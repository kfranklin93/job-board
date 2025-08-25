// src/data/mockApplications.ts

import { 
  CandidateApplication, 
  Application, 
  ApplicationStatus, 
  MatchScoreBreakdown,
  CandidateStats 
} from '../types/data';
import { mockJobSeekers } from './mockJobSeekers';
import { mockJobs } from './mockJobs';
import { calculateMatchScore } from '../services/api/candidateMatchingEngine';

// Mock Applications Data
export const mockApplications: Application[] = [
  {
    id: 'app-001',
    // FIX: Aligned IDs with the latest mock data files.
    jobId: 'job1',
    applicantId: 'user-seeker-001', // Corresponds to Sarah Johnson
    jobTitle: 'Lead Preschool Teacher',
    organizationId: 'org_sunshine',
    organizationName: 'Sunshine Daycare Center',
    organizationLogo: 'https://via.placeholder.com/150x150/4CAF50/white?text=SDC',
    applicantName: 'Sarah Johnson',
    applicantEmail: 'sarah.johnson@email.com',
    applicantPhone: '+1-555-0101',
    status: ApplicationStatus.REVIEWING,
    appliedDate: '2024-08-20T10:30:00Z',
    lastUpdated: '2024-08-22T14:15:00Z',
    notes: 'Strong background in curriculum development. Very positive phone screen.',
    resume: '/uploads/sarah-johnson-resume.pdf',
    coverLetter: 'I am excited to bring my 5 years of preschool experience to your team...'
  },
  {
    id: 'app-002',
    // FIX: Aligned IDs
    jobId: 'job4',
    applicantId: 'user-seeker-002', // Corresponds to Michael Chen
    jobTitle: 'Special Education Teacher',
    organizationId: 'org_sunshine',
    organizationName: 'Sunshine Daycare Center',
    organizationLogo: 'https://via.placeholder.com/150x150/4CAF50/white?text=SDC',
    applicantName: 'Michael Chen',
    applicantEmail: 'michael.chen@email.com',
    applicantPhone: '+1-555-0102',
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    appliedDate: '2024-08-18T14:20:00Z',
    lastUpdated: '2024-08-23T09:30:00Z',
    notes: 'Perfect match for special education role. Interview scheduled for Monday.',
    resume: '/uploads/michael-chen-resume.pdf'
  },
  {
    id: 'app-003',
    // FIX: Aligned IDs
    jobId: 'job2',
    applicantId: 'user-seeker-003', // Corresponds to Jessica Williams
    jobTitle: 'Toddler Teacher',
    organizationId: 'org_rainbow',
    organizationName: 'Rainbow Learning Center',
    organizationLogo: 'https://via.placeholder.com/150x150/2196F3/white?text=RLC',
    applicantName: 'Jessica Williams',
    applicantEmail: 'jessica.williams@email.com',
    applicantPhone: '+1-555-0103',
    status: ApplicationStatus.APPLIED,
    appliedDate: '2024-08-24T11:15:00Z',
    lastUpdated: '2024-08-24T11:15:00Z',
    notes: 'Recent graduate, eager to start career.',
    resume: '/uploads/jessica-williams-resume.pdf'
  },
  {
    id: 'app-004',
    // FIX: Aligned IDs
    jobId: 'job3',
    applicantId: 'user-seeker-004', // Corresponds to Amanda Taylor
    jobTitle: 'Assistant Director',
    organizationId: 'org_sunshine',
    organizationName: 'Sunshine Daycare',
    organizationLogo: 'https://via.placeholder.com/150x150/4CAF50/white?text=SDC',
    applicantName: 'Amanda Taylor',
    applicantEmail: 'amanda.taylor@email.com',
    applicantPhone: '+1-555-0104',
    status: ApplicationStatus.OFFERED,
    appliedDate: '2024-08-15T16:45:00Z',
    lastUpdated: '2024-08-23T17:20:00Z',
    notes: 'Excellent leadership experience. Made competitive offer.',
    resume: '/uploads/amanda-taylor-resume.pdf'
  }
];

// Helper function to create CandidateApplication objects
export const createCandidateApplications = (): CandidateApplication[] => {
  return mockApplications.map(application => {
    const applicant = mockJobSeekers.find(seeker => seeker.id === application.applicantId);
    const job = mockJobs.find(j => j.id === application.jobId);
    
    if (!applicant || !job) {
      throw new Error(`Missing applicant or job data for application ${application.id}`);
    }

    // FIX 1: The arguments were reversed. It should be (job, applicant).
    const matchResult = calculateMatchScore(job, applicant);
    
    // FIX 2: Access the properties from the detailed MatchResult object correctly.
    const matchBreakdown: MatchScoreBreakdown = {
      overall: matchResult.score,
      skills: matchResult.breakdown.skills,
      experience: matchResult.breakdown.experience,
      education: matchResult.breakdown.education,
      certifications: matchResult.breakdown.certifications,
      yearOfExperience: matchResult.breakdown.yearsOfExperience,
      jobType: matchResult.breakdown.jobType,
      details: {
        matchedSkills: matchResult.details.matchedSkills,
        missingSkills: matchResult.details.missingSkills,
        experienceMatch: matchResult.details.experienceMatch,
        educationMatch: matchResult.details.educationMatch,
        // FIX: Use the 'matchedCertifications' array (string[]) from the details object,
        // which matches the expected type for 'certificationMatches'.
        certificationMatches: matchResult.details.matchedCertifications, 
        
        // Use the 'missingCertifications' array from the details object as well.
        missingCertifications: matchResult.details.missingCertifications,
        
      }
    };

    return {
      id: application.id,
      jobId: application.jobId,
      job,
      applicant,
      application,
      matchScore: matchResult.score,
      matchBreakdown,
      notes: application.notes ? [application.notes] : [],
      tags: generateTags(matchResult.score, application.status),
      interviewScheduled: application.status === ApplicationStatus.INTERVIEW_SCHEDULED,
      interviewDate: application.status === ApplicationStatus.INTERVIEW_SCHEDULED ? '2024-08-26T14:00:00Z' : undefined,
      resumeUrl: application.resume,
      portfolioUrl: undefined
    };
  });
};

// Helper function to generate relevant tags
const generateTags = (matchScore: number, status: ApplicationStatus): string[] => {
  const tags: string[] = [];
  
  if (matchScore >= 90) tags.push('Top Match');
  else if (matchScore >= 80) tags.push('Strong Match');
  else if (matchScore >= 70) tags.push('Good Match');
  else tags.push('Needs Review');
  
  if (status === ApplicationStatus.INTERVIEW_SCHEDULED) tags.push('Interview Scheduled');
  if (status === ApplicationStatus.OFFERED) tags.push('Offer Extended');
  
  return tags;
};

// Mock candidate statistics
export const mockCandidateStats: CandidateStats = {
  total: mockApplications.length,
  byStatus: {
    [ApplicationStatus.APPLIED]: 2,
    [ApplicationStatus.REVIEWING]: 1,
    [ApplicationStatus.INTERVIEW_SCHEDULED]: 1,
    [ApplicationStatus.INTERVIEW_COMPLETED]: 0,
    [ApplicationStatus.OFFERED]: 1,
    [ApplicationStatus.HIRED]: 0,
    [ApplicationStatus.REJECTED]: 1,
    [ApplicationStatus.WITHDRAWN]: 0
  },
  averageMatchScore: 82.5,
  topMatchScore: 95,
  recentApplications: 3 // Last 7 days
};

// Export the generated candidate applications
export const mockCandidateApplications = createCandidateApplications();
