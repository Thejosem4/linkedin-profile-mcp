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
import { LinkedInProfile, Experience, Certification, Project, LinkedInDate } from "./types.js";

/**
 * LinkedIn Profile MCP Server.
 * Provides tools for reading and updating LinkedIn profile data.
 */
const server = new Server(
  {
    name: "linkedin-profile-mcp",
    version: "0.1.0",
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
            text: buildSystemPrompt({ userId: "current_user" }),
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
        name: "get_profile",
        description: "Get the full LinkedIn profile of the authenticated user.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_analytics",
        description: "Get LinkedIn profile analytics (e.g., profile views).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "update_headline",
        description: "Update the LinkedIn headline.",
        inputSchema: {
          type: "object",
          properties: {
            headline: { type: "string" },
          },
          required: ["headline"],
        },
      },
      {
        name: "update_summary",
        description: "Update the LinkedIn summary (About section).",
        inputSchema: {
          type: "object",
          properties: {
            summary: { type: "string" },
          },
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
        description: "Update the skills list.",
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
              },
              required: ["name", "issuingOrganization"],
            },
          },
          required: ["certification"],
        },
      },
      {
        name: "post_update",
        description: "Post a short update to LinkedIn.",
        inputSchema: {
          type: "object",
          properties: {
            text: { type: "string" },
          },
          required: ["text"],
        },
      },
      {
        name: "analyze_profile",
        description: "Analyze the profile and provide strategic improvements.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "ats_optimize",
        description: "Optimize the profile for ATS by comparing it with a job description.",
        inputSchema: {
          type: "object",
          properties: {
            jobDescription: { type: "string" },
          },
          required: ["jobDescription"],
        },
      },
      {
        name: "authenticate",
        description: "Start the OAuth 2.0 flow to authenticate with LinkedIn. Run this first to get your tokens.",
        inputSchema: {
          type: "object",
          properties: {},
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
        console.error("🔑 Starting authentication flow...");
        const { oauthManager } = await import("./auth/oauth.js");
        const code = await oauthManager.startCallbackServer();
        const tokens = await oauthManager.handleCallback(code);
        return {
          content: [
            {
              type: "text",
              text: "✅ Authentication successful! Tokens have been saved securely.",
            },
          ],
        };
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
        const result = await update_education(args?.educationId as string, args?.updates as Partial<LinkedInProfile['educations'][0]>);
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
      case "post_update": {
        const result = await post_update(args?.text as string);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }
      case "analyze_profile": {
        const result = await analyze_profile();
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
