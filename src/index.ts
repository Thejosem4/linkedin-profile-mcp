import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { 
  get_profile, 
  get_analytics, 
  update_headline, 
  update_summary,
  update_experience,
  update_education,
  update_skills,
  add_certification,
  add_license,
  add_project,
  add_honor_award,
  post_update,
  post_article,
  draft_recommendation,
  update_open_to_work,
  add_volunteering,
  update_languages,
  add_publication,
  analyze_profile,
  generate_content,
  ats_optimize
} from "./tools/index.js";
import { buildSystemPrompt } from "./prompts/system.js";
import { 
  updateHeadlineTemplate, 
  updateSummaryTemplate,
  updateExperienceTemplate
} from "./prompts/templates.js";
import { LinkedInProfile, Experience, Certification, Project, UserContext } from "./types.js";
import { config } from "./config.js";

/**
 * Helper to build user context from app configuration.
 */
function getAppUserContext(): UserContext {
  return {
    userId: "current_user",
    sector: config.userSector,
    objective: config.userObjective as any,
    audience: config.userAudience as any,
    tone: config.userTone as any,
    language: config.profileLanguage,
  };
}

/**
 * LinkedIn Profile MCP Server.
 * Provides tools for reading and updating LinkedIn profile data.
 */
const server = new Server(
  {
    name: "linkedin-profile-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available prompts.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "optimize_profile",
        description: "Get the system prompt for profile optimization.",
      },
      {
        name: "propose_headline",
        description: "Generate a template for proposing a new headline.",
        arguments: [
          {
            name: "goals",
            description: "User goals for the new headline.",
            required: false,
          },
        ],
      },
      {
        name: "propose_summary",
        description: "Generate a template for proposing a new summary.",
        arguments: [
          {
            name: "goals",
            description: "User goals for the new summary.",
            required: false,
          },
        ],
      },
    ],
  };
});

/**
 * Handler for getting a specific prompt.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "optimize_profile") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: buildSystemPrompt(getAppUserContext()),
          },
        },
      ],
    };
  }

  if (name === "propose_headline") {
    const profileResult = await get_profile();
    if (!profileResult.success) {
      throw new Error("Failed to get profile for template.");
    }
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: updateHeadlineTemplate(profileResult.data as LinkedInProfile, args?.goals as string),
          },
        },
      ],
    };
  }

  if (name === "propose_summary") {
    const profileResult = await get_profile();
    if (!profileResult.success) {
      throw new Error("Failed to get profile for template.");
    }
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: updateSummaryTemplate(profileResult.data as LinkedInProfile, args?.goals as string),
          },
        },
      ],
    };
  }

  throw new Error(`Unknown prompt: ${name}`);
});

/**
 * Handler for listing available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "authenticate",
        description: "Start the OAuth 2.0 flow to authenticate with LinkedIn. Run this first to get your tokens.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_profile",
        description: "Get the full LinkedIn profile of the authenticated user.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "get_analytics",
        description: "Get LinkedIn profile analytics (e.g., profile views).",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "update_headline",
        description: "Update the LinkedIn headline.",
        inputSchema: {
          type: "object",
          properties: { headline: { type: "string" } },
          required: ["headline"],
        },
      },
      {
        name: "update_summary",
        description: "Update the LinkedIn summary (About section).",
        inputSchema: {
          type: "object",
          properties: { summary: { type: "string" } },
          required: ["summary"],
        },
      },
      {
        name: "update_experience",
        description: "Update an experience entry.",
        inputSchema: {
          type: "object",
          properties: {
            experienceId: { type: "string" },
            updates: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
              },
            },
          },
          required: ["experienceId", "updates"],
        },
      },
      {
        name: "update_education",
        description: "Update an education entry.",
        inputSchema: {
          type: "object",
          properties: {
            educationId: { type: "string" },
            updates: {
              type: "object",
              properties: {
                schoolName: { type: "string" },
                degree: { type: "string" },
              },
            },
          },
          required: ["educationId", "updates"],
        },
      },
      {
        name: "update_skills",
        description: "Update the skills list (max 50).",
        inputSchema: {
          type: "object",
          properties: {
            skills: { type: "array", items: { type: "string" } },
          },
          required: ["skills"],
        },
      },
      {
        name: "add_certification",
        description: "Add a certification.",
        inputSchema: {
          type: "object",
          properties: {
            certification: {
              type: "object",
              properties: {
                name: { type: "string" },
                issuingOrganization: { type: "string" },
                issueDate: { type: "object", properties: { month: { type: "number" }, year: { type: "number" } }, required: ["year"] },
                credentialUrl: { type: "string" }
              },
              required: ["name", "issuingOrganization"],
            },
          },
          required: ["certification"],
        },
      },
      {
        name: "add_license",
        description: "Add a professional license.",
        inputSchema: {
          type: "object",
          properties: {
            license: {
              type: "object",
              properties: {
                name: { type: "string" },
                issuingOrganization: { type: "string" },
                licenseNumber: { type: "string" }
              },
              required: ["name", "issuingOrganization"],
            },
          },
          required: ["license"],
        },
      },
      {
        name: "add_project",
        description: "Add a project to the profile.",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string", maxLength: 300 },
            url: { type: "string" },
            startDate: { type: "object", properties: { month: { type: "number" }, year: { type: "number" } }, required: ["year"] }
          },
          required: ["name", "description", "startDate"],
        },
      },
      {
        name: "add_honor_award",
        description: "Add an honor or award.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            issuer: { type: "string" },
            description: { type: "string" }
          },
          required: ["title"],
        },
      },
      {
        name: "post_update",
        description: "Post a short update to LinkedIn.",
        inputSchema: {
          type: "object",
          properties: { text: { type: "string", maxLength: 3000 } },
          required: ["text"],
        },
      },
      {
        name: "post_article",
        description: "Post an article to LinkedIn.",
        inputSchema: {
          type: "object",
          properties: { 
            title: { type: "string", maxLength: 200 },
            content: { type: "string" }
          },
          required: ["title", "content"],
        },
      },
      {
        name: "draft_recommendation",
        description: "Draft a recommendation for a connection.",
        inputSchema: {
          type: "object",
          properties: {
            connectionName: { type: "string" },
            relationship: { type: "string" },
            keyAchievements: { type: "array", items: { type: "string" } }
          },
          required: ["connectionName", "relationship", "keyAchievements"],
        },
      },
      {
        name: "update_open_to_work",
        description: "Update Open to Work status.",
        inputSchema: {
          type: "object",
          properties: {
            isOpen: { type: "boolean" },
            jobTitles: { type: "array", items: { type: "string" } }
          },
          required: ["isOpen"],
        },
      },
      {
        name: "add_volunteering",
        description: "Add volunteering experience.",
        inputSchema: {
          type: "object",
          properties: {
            organization: { type: "string" },
            role: { type: "string" },
            cause: { type: "string" }
          },
          required: ["organization", "role", "cause"],
        },
      },
      {
        name: "update_languages",
        description: "Update profile languages.",
        inputSchema: {
          type: "object",
          properties: {
            languages: { 
              type: "array", 
              items: { 
                type: "object", 
                properties: { 
                  name: { type: "string" }, 
                  proficiency: { type: "string", enum: ["ELEMENTARY", "LIMITED_WORKING", "PROFESSIONAL_WORKING", "FULL_PROFESSIONAL", "NATIVE_OR_BILINGUAL"] } 
                } 
              } 
            }
          },
          required: ["languages"],
        },
      },
      {
        name: "add_publication",
        description: "Add a publication.",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            publisher: { type: "string" }
          },
          required: ["title", "publisher"],
        },
      },
      {
        name: "analyze_profile",
        description: "Analyze the profile and provide strategic improvements.",
        inputSchema: { type: "object", properties: {} },
      },
      {
        name: "generate_content",
        description: "Generate optimized text for a profile section.",
        inputSchema: {
          type: "object",
          properties: {
            section: { type: "string", enum: ["headline", "summary", "experience"] },
            goals: { type: "string" }
          },
          required: ["section"],
        },
      },
      {
        name: "ats_optimize",
        description: "Optimize the profile for ATS by comparing it with a job description.",
        inputSchema: {
          type: "object",
          properties: { jobDescription: { type: "string" } },
          required: ["jobDescription"],
        },
      },
    ],
  };
});

/**
 * Handler for tool calls.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "authenticate": {
        const { oauthManager } = await import("./auth/oauth.js");
        const code = await oauthManager.startCallbackServer();
        await oauthManager.handleCallback(code);
        return { content: [{ type: "text", text: "✅ Authentication successful!" }] };
      }
      case "get_profile": {
        const result = await get_profile();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "get_analytics": {
        const result = await get_analytics();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_headline": {
        const result = await update_headline(args?.headline as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_summary": {
        const result = await update_summary(args?.summary as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_experience": {
        const result = await update_experience(args?.experienceId as string, args?.updates as Partial<Experience>);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_education": {
        const result = await update_education(args?.educationId as string, args?.updates as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_skills": {
        const result = await update_skills(args?.skills as string[]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "add_certification": {
        const result = await add_certification(args?.certification as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "add_license": {
        const result = await add_license(args?.license as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "add_project": {
        const result = await add_project(args as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "add_honor_award": {
        const result = await add_honor_award(args as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "post_update": {
        const result = await post_update(args?.text as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "post_article": {
        const result = await post_article(args?.title as string, args?.content as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "draft_recommendation": {
        const result = await draft_recommendation(args?.connectionName as string, args?.relationship as string, args?.keyAchievements as string[]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_open_to_work": {
        const result = await update_open_to_work(args?.isOpen as boolean, args?.jobTitles as string[]);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "add_volunteering": {
        const result = await add_volunteering(args?.organization as string, args?.role as string, args?.cause as string, { year: 2024 } as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "update_languages": {
        const result = await update_languages(args?.languages as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "add_publication": {
        const result = await add_publication(args?.title as string, args?.publisher as string, { year: 2024 } as any);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "analyze_profile": {
        const result = await analyze_profile();
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "generate_content": {
        const result = await generate_content(args?.section as any, args?.goals as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "ats_optimize": {
        const result = await ats_optimize(args?.jobDescription as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [{ type: "text", text: JSON.stringify({ success: false, message: error.message }, null, 2) }],
      isError: true,
    };
  }
});

/**
 * Main entry point for the MCP server.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LinkedIn Profile MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
