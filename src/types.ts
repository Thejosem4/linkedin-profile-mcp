export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  vanityName?: string;
  profilePicture?: string;
  location?: string;
  industry?: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
  honors?: any[];
  languages?: { name: string; proficiency: string }[];
  volunteering?: any[];
  publications?: any[];
}

export interface Experience {
  id?: string;
  title: string;
  companyName: string;
  location?: string;
  startDate: LinkedInDate;
  endDate?: LinkedInDate;
  description?: string;
  isCurrent: boolean;
}

export interface Education {
  id?: string;
  schoolName: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: LinkedInDate;
  endDate?: LinkedInDate;
  description?: string;
}

export interface Skill {
  id?: string;
  name: string;
}

export interface Certification {
  id?: string;
  name: string;
  issuingOrganization?: string;
  authority?: string;
  licenseNumber?: string;
  startDate?: LinkedInDate;
  endDate?: LinkedInDate;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Project {
  id?: string;
  title: string;
  description?: string;
  startDate?: LinkedInDate;
  endDate?: LinkedInDate;
  url?: string;
  members?: string[];
}

export interface LinkedInDate {
  month?: number;
  year: number;
}

export interface ToolResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface DiffPreview {
  field: string;
  before: string;
  after: string;
  charsBefore: number;
  charsAfter: number;
  charsRemaining: number;
  warnings: string[];
}

export interface UserContext {
  userId: string;
  sector?: string;
  objective?: 'job_search' | 'personal_brand' | 'freelance' | 'promotion';
  audience?: 'recruiters' | 'clients' | 'peers' | 'general';
  tone?: 'formal' | 'conversacional' | 'técnico';
  language?: string;
}
