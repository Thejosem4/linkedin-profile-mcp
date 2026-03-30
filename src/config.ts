import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const configSchema = z.object({
  clientId: z.string().min(1, "LINKEDIN_CLIENT_ID is required"),
  clientSecret: z.string().min(1, "LINKEDIN_CLIENT_SECRET is required"),
  redirectUri: z.string().url("LINKEDIN_REDIRECT_URI must be a valid URL"),
  port: z.coerce.number().default(3000),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  userSector: z.string().default('technology'),
  userObjective: z.enum(['job_search', 'personal_brand', 'freelance', 'promotion']).default('job_search'),
  userAudience: z.enum(['recruiters', 'clients', 'peers', 'general']).default('recruiters'),
  userTone: z.enum(['formal', 'conversacional', 'técnico']).default('conversacional'),
  profileLanguage: z.string().default('en'),
});

const env = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI,
  port: process.env.PORT,
  logLevel: process.env.LOG_LEVEL,
  userSector: process.env.USER_SECTOR,
  userObjective: process.env.USER_OBJECTIVE,
  userAudience: process.env.USER_AUDIENCE,
  userTone: process.env.USER_TONE,
  profileLanguage: process.env.PROFILE_LANGUAGE,
};

const parsed = configSchema.safeParse(env);

if (!parsed.success) {
  console.error('❌ Invalid configuration:', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
export type Config = z.infer<typeof configSchema>;
