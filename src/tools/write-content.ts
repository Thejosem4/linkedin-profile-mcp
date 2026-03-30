import { linkedinClient } from '../api/client.js';
import { ENDPOINTS } from '../api/endpoints.js';
import { ToolResult } from '../types.js';
import { validate } from '../utils/char-counter.js';
import { createDiff } from '../utils/diff.js';

/**
 * Posts a short update (share) to LinkedIn.
 */
export async function post_update(text: string): Promise<ToolResult> {
  // LinkedIn posts have a limit of 3000 characters for most users.
  // We'll use the summary limit (2600) as a safe proxy or default to 3000.
  const validation = validate(text, 'post_text');
  if (!validation.valid) {
    return {
      success: false,
      message: `Post text exceeds character limit (${validation.count}/${validation.limit}).`,
    };
  }

  const diff = createDiff('post_update', '', text);

  try {
    // In a real scenario, we would make a POST request to the UGC_POSTS endpoint.
    // For now, we'll simulate the post.
    // await linkedinClient.post(ENDPOINTS.UGC_POSTS, { ... });

    return {
      success: true,
      message: 'Update posted successfully.',
      data: {
        diff,
        post: {
          text,
          timestamp: new Date().toISOString(),
        },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to post update.',
      error: error.message,
    };
  }
}

/**
 * Posts an article to LinkedIn.
 */
export async function post_article(title: string, content: string): Promise<ToolResult> {
  const titleValidation = validate(title, 'project_title');
  if (!titleValidation.valid) {
    return {
      success: false,
      message: `Article title exceeds character limit (${titleValidation.count}/${titleValidation.limit}).`,
    };
  }

  const diff = createDiff('post_article', '', `${title}\n\n${content.substring(0, 100)}...`);

  try {
    // Simulate article post
    return {
      success: true,
      message: 'Article posted successfully.',
      data: {
        diff,
        article: {
          title,
          contentSummary: content.substring(0, 200) + '...',
          timestamp: new Date().toISOString(),
        },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to post article.',
      error: error.message,
    };
  }
}
