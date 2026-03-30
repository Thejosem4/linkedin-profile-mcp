/**
 * LinkedIn API v2 endpoints.
 */
export const LINKEDIN_API_BASE_URL = 'https://api.linkedin.com';

export const ENDPOINTS = {
  /**
   * Get the current user's profile.
   * Requires 'r_liteprofile' or 'r_basicprofile' scope.
   */
  ME: '/v2/me',

  /**
   * Get the current user's email address.
   * Requires 'r_emailaddress' scope.
   */
  EMAIL: '/v2/emailAddress?q=owners&projection=(elements*(handle~))',

  /**
   * Get the current user's profile picture.
   */
  PROFILE_PICTURE: '/v2/me?projection=(id,profilePicture(displayImage~:playableStreams))',

  /**
   * Post a share on LinkedIn.
   * Requires 'w_member_social' scope.
   */
  SHARES: '/v2/shares',

  /**
   * Post a UGC (User Generated Content) post on LinkedIn.
   * Requires 'w_member_social' scope.
   */
  UGC_POSTS: '/v2/ugcPosts',

  /**
   * Get profile analytics.
   */
  ANALYTICS: '/v2/memberSnapshotData?q=owners&types=List(PROFILE_VIEWS)',
} as const;
