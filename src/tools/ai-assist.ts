import { ToolResult, LinkedInProfile } from '../types.js';
import { get_profile } from './read.js';
import { buildSystemPrompt } from '../prompts/system.js';
import { 
  updateHeadlineTemplate, 
  updateSummaryTemplate, 
  updateExperienceTemplate 
} from '../prompts/templates.js';
import { performGapAnalysis } from '../utils/keyword-extractor.js';

/**
 * Analyzes the LinkedIn profile and provides strategic improvements.
 */
export async function analyze_profile(): Promise<ToolResult> {
  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  const systemPrompt = buildSystemPrompt({ userId: 'current_user' });

  // In a real scenario, we would send the profile and system prompt to an AI model.
  // For now, we'll simulate the analysis.
  const analysis = {
    overallScore: 85,
    strengths: [
      'Strong headline with clear value proposition.',
      'Detailed experience descriptions with quantifiable results.',
      'Relevant skills listed and endorsed.',
    ],
    weaknesses: [
      'Summary could be more compelling and story-driven.',
      'Missing some key certifications in the industry.',
      'Could benefit from more recent projects.',
    ],
    recommendations: [
      'Update the "About" section to include a more personal narrative.',
      'Add the "AWS Certified Solutions Architect" certification if applicable.',
      'Highlight the "Project X" more prominently in the experience section.',
    ],
  };

  return {
    success: true,
    message: 'Profile analysis completed.',
    data: {
      analysis,
      systemPrompt,
    },
  };
}

/**
 * Generates high-quality content for a specific profile section.
 */
export async function generate_content(
  section: 'headline' | 'summary' | 'experience',
  goals?: string,
  experienceId?: string
): Promise<ToolResult> {
  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  let prompt = '';

  if (section === 'headline') {
    prompt = updateHeadlineTemplate(profile, goals);
  } else if (section === 'summary') {
    prompt = updateSummaryTemplate(profile, goals);
  } else if (section === 'experience') {
    const experience = profile.experiences.find(exp => exp.id === experienceId);
    if (!experience) {
      return {
        success: false,
        message: `Experience with ID ${experienceId} not found.`,
      };
    }
    prompt = updateExperienceTemplate(experience, goals);
  }

  // In a real scenario, we would send the prompt to an AI model.
  // For now, we'll return the prompt and a simulated response.
  return {
    success: true,
    message: `Generated content for ${section}.`,
    data: {
      prompt,
      suggestedContent: `This is a simulated AI-generated ${section} based on your goals: ${goals || 'None'}.`,
    },
  };
}

/**
 * Optimizes the profile for ATS by comparing it with a job description.
 */
export async function ats_optimize(jobDescription: string): Promise<ToolResult> {
  const profileResult = await get_profile();
  if (!profileResult.success) {
    return profileResult;
  }

  const profile = profileResult.data as LinkedInProfile;
  
  // Combine all profile text for analysis
  const profileText = [
    profile.headline,
    profile.summary,
    ...profile.experiences.map(exp => `${exp.title} ${exp.companyName} ${exp.description}`),
    ...profile.skills.map(skill => skill.name),
  ].join(' ');

  const gapAnalysis = performGapAnalysis(profileText, jobDescription);

  return {
    success: true,
    message: 'ATS optimization analysis completed.',
    data: {
      matchPercentage: gapAnalysis.matchPercentage,
      matchingKeywords: gapAnalysis.matchingKeywords,
      missingKeywords: gapAnalysis.missingKeywords,
      recommendations: gapAnalysis.missingKeywords.map(keyword => `Consider incorporating "${keyword}" into your profile where relevant.`),
    },
  };
}
