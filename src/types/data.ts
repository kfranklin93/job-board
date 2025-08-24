// src/types/data.ts

// --- Enums ---

export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
  INTERNSHIP = 'INTERNSHIP'
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  EXPIRED = 'EXPIRED'
}

export enum ApplicationStatus {
  APPLIED = 'APPLIED',
  REVIEWING = 'REVIEWING',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED = 'INTERVIEW_COMPLETED',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum UserRole {
  SEEKER = 'SEEKER',
  DAYCARE = 'DAYCARE', 
  RECRUITER = 'RECRUITER'
}

// --- Object Interfaces ---

// Core interfaces for recommendation engine
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

// The comprehensive UserProfile for the recommendation engine
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
  
  // Core fields for recommendation matching
  location?: string; 
  jobTitle?: string;
  skills?: string[];
  certifications?: string[];
  education?: Education[];
  experience?: Experience[];
  
  // Fields for matching algorithms
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

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: AuthUser;
  tokens: AuthToken;
}

// Role-specific profile types
export interface JobSeekerProfile extends UserProfile {
  role: UserRole.SEEKER;
  seekingJobTypes: JobType[];
  desiredSalaryRange: {
    min: number;
    max: number;
  };
  willingToRelocate: boolean;
  preferredLocations: string[];
}

export interface DaycareProfile extends UserProfile {
  role: UserRole.DAYCARE;
  organizationId: string;
  organization: Organization;
  hiringAuthority: boolean;
  canPostJobs: boolean;
}

export interface RecruiterProfile extends UserProfile {
  role: UserRole.RECRUITER;
  company: string;
  partnerDaycares: string[]; // Organization IDs
  specializations: string[];
  yearsInRecruitment: number;
  canAccessReports: boolean;
}