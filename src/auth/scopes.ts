/**
 * LinkedIn OAuth 2.0 Scopes
 * @see https://learn.microsoft.com/en-us/linkedin/shared/authentication/getting-access-token-with-oauth2
 */
export const LINKEDIN_SCOPES = [
  'openid',
  'profile',
  'email',
  'w_member_social',
  // 'rw_me' is used in some legacy or specific API versions, 
  // but openid/profile/email are standard for the new API.
  // Including them as per instructions.
  'rw_me',
  'r_liteprofile',
] as const;

export type LinkedInScope = typeof LINKEDIN_SCOPES[number];

export const SCOPES_STRING = LINKEDIN_SCOPES.join(' ');
