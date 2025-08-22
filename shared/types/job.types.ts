// shared/types/job.types.ts

// --- Enums ---

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
  INTERNSHIP = 'INTERNSHIP',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED',
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REVIEWING = 'REVIEWING',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum UserRole {
  SEEKER = 'SEEKER',
  DAYCARE = 'DAYCARE',
  RECRUITER = 'RECRUITER',
}

// --- Interfaces ---

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  graduationYear: string;
}

export interface Job {
  id: string;
  organizationId: string;
  organizationName: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  type: JobType;
  status: JobStatus;
  postedDate?: string;
  applicantCount?: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  organizationId: string;
  organizationName: string;
  organizationLogo?: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  resume?: string;
  coverLetter?: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  bio?: string;
  resume?: string;
  createdAt: string;
  updatedAt: string;

  // Recommendation engine fields
  location?: string;
  jobTitle?: string;
  skills?: string[];
  certifications?: string[];
  education?: Education[];
  experience?: Experience[];
  availability?: string;
  yearsOfExperience?: number;
  minSalary?: number;
  preferredJobTypes?: JobType[];
}

export interface Organization {
  id: string;
  name: string;
  description: string;
  logo?: string;
  website?: string;
  location: string;
  phone?: string;
  email: string;
  licenseNumber?: string;
  foundedYear?: number;
  capacity?: number;
  ageRange?: string;
  hours?: string;
  facilities?: string[];
  programs?: string[];
  photos?: string[];
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

// Legacy or subset type for early JobPosting usage
export interface JobPosting {
  _id: string;
  title: string;
  requirements: {
    skills: string[];
    minExperience: number;
  };
}