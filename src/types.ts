export interface LinkedInProfile {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  experiences: Experience[];
  educations: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
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
  authority?: string;
  licenseNumber?: string;
  startDate?: LinkedInDate;
  endDate?: LinkedInDate;
}

export interface Project {
  id?: string;
  title: string;
  description?: string;
  startDate?: LinkedInDate;
  endDate?: LinkedInDate;
  url?: string;
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
  original: string;
  proposed: string;
  changeType: 'update' | 'add' | 'remove';
}

export interface UserContext {
  userId: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
}
