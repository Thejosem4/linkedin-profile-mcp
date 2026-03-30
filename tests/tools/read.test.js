import { jest } from '@jest/globals';
import { get_profile, get_analytics } from '../../src/tools/read.js';
import { linkedinClient } from '../../src/api/client.js';
import { profileCache } from '../../src/api/profile-cache.js';
describe('Read Tools', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        profileCache.clear();
    });
    describe('get_profile', () => {
        it('should return cached profile if available', async () => {
            const mockProfile = { id: '123', firstName: 'John', lastName: 'Doe' };
            jest.spyOn(profileCache, 'get').mockReturnValue(mockProfile);
            const result = await get_profile();
            expect(result.success).toBe(true);
            expect(result.message).toContain('cache');
            expect(result.data).toEqual(mockProfile);
        });
        it('should fetch profile from LinkedIn if not cached', async () => {
            const mockApiResponse = {
                data: {
                    id: '123',
                    localizedFirstName: 'John',
                    localizedLastName: 'Doe',
                    headline: { localized: { en_US: 'Software Engineer' } },
                    summary: { localized: { en_US: 'Experienced dev' } },
                },
            };
            jest.spyOn(profileCache, 'get').mockReturnValue(null);
            jest.spyOn(linkedinClient, 'get').mockResolvedValue(mockApiResponse);
            const setCacheSpy = jest.spyOn(profileCache, 'set');
            const result = await get_profile();
            expect(result.success).toBe(true);
            expect(result.message).toContain('LinkedIn');
            expect(result.data.id).toBe('123');
            expect(result.data.firstName).toBe('John');
            expect(result.data.headline).toBe('Software Engineer');
            expect(setCacheSpy).toHaveBeenCalled();
        });
        it('should handle API errors gracefully', async () => {
            jest.spyOn(profileCache, 'get').mockReturnValue(null);
            jest.spyOn(linkedinClient, 'get').mockRejectedValue(new Error('API Error'));
            const result = await get_profile();
            expect(result.success).toBe(false);
            expect(result.error).toBe('API Error');
        });
    });
    describe('get_analytics', () => {
        it('should return analytics from API', async () => {
            const mockApiResponse = {
                data: {
                    profileViews: 200,
                },
            };
            jest.spyOn(linkedinClient, 'get').mockResolvedValue(mockApiResponse);
            const result = await get_analytics();
            expect(result.success).toBe(true);
            expect(result.data.profileViews).toBe(200);
        });
        it('should return mock analytics on API failure', async () => {
            jest.spyOn(linkedinClient, 'get').mockRejectedValue(new Error('API Error'));
            const result = await get_analytics();
            expect(result.success).toBe(true);
            expect(result.message).toContain('mock data');
            expect(result.data.profileViews).toBeDefined();
        });
    });
});
//# sourceMappingURL=read.test.js.map