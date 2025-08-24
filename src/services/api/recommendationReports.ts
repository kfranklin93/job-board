// src/lib/recommendationReports.ts

import { mockJobs } from '../../data/mockJobs';
import { mockJobSeekers } from '../../data/mockJobSeekers';
import { getRecommendationsForJob, RecommendedCandidate } from './recommendationService';
import { Job, UserProfile } from '../../types/data';

// Using the RecommendedCandidate type from the service

// Interface for the final report
interface JobRecommendationReport {
  job: Job;
  recommendations: RecommendedCandidate[];
  summary: string;
  matchDetails: {
    candidateName: string;
    matchScore: number;
    keyStrengths: string[];
    potentialGaps: string[];
  }[];
}

// HELPER: Safely extracts the city from a location string
const getCity = (location: string | undefined): string | null => {
  if (!location) return null;
  return location.split(',')[0].trim();
};

// Generate a recommendation report for a specific job
export const generateJobRecommendationReport = (jobId: string): JobRecommendationReport | null => {
  const job = mockJobs.find(j => j.id === jobId);
  if (!job) return null;
  
  // Convert mockJobSeekers to UserProfile format for the service
  const candidates: UserProfile[] = mockJobSeekers.map(seeker => ({
    ...seeker,
    role: seeker.role,
    createdAt: seeker.createdAt,
    updatedAt: seeker.updatedAt
  }));
  
  const recommendations = getRecommendationsForJob(job, candidates, 5);
  
  const matchDetails = recommendations.map(candidate => {
    const strengths: string[] = [];
    const gaps: string[] = [];
    const jobKeywords = job.description.toLowerCase() + ' ' + job.requirements.join(' ').toLowerCase();
    
    // Analyze skills
    const matchingSkills = candidate.skills?.filter(skill  => 
      jobKeywords.includes(skill.toLowerCase())
    ) ?? [];
    
    if (matchingSkills.length > 2) {
      strengths.push(`Strong skill match: ${matchingSkills.slice(0, 3).join(', ')}`);
    } else {
      gaps.push('May need additional training in key skills');
    }
    
    // Analyze experience
    if (candidate.experience) {
      const hasRelevantTitle = candidate.experience.some(exp =>
        exp.title.toLowerCase().includes(job.title.toLowerCase()) ||
        job.title.toLowerCase().includes(exp.title.toLowerCase())
      );
      if (hasRelevantTitle) {
        strengths.push('Direct experience in a similar role');
      }
    }
    
    // Analyze years of experience
    const yearsReqString = job.requirements.find(req => req.toLowerCase().includes('year'));
    let requiredYears = 1; // Default
    if (yearsReqString) {
      const yearsMatch = yearsReqString.match(/\d+/);
      if (yearsMatch) requiredYears = parseInt(yearsMatch[0], 10);
    }
    
    if (candidate.yearsOfExperience !== undefined) {
      if (candidate.yearsOfExperience >= requiredYears) {
        strengths.push(`${candidate.yearsOfExperience}+ years of relevant experience`);
      } else {
        gaps.push(`Less experience than ideal (${candidate.yearsOfExperience} vs ${requiredYears} years)`);
      }
    } else {
      gaps.push('Years of experience not specified.');
    }
    
    // Analyze education
    const educationReq = job.requirements.find(req => req.toLowerCase().includes('degree'));
    if (educationReq && candidate.education) {
      const hasMatchingEducation = candidate.education.some(edu => 
        educationReq.toLowerCase().includes(edu.degree.toLowerCase())
      );
      if (hasMatchingEducation) strengths.push('Education requirements met');
      else gaps.push('May not meet all education requirements');
    }
    
    // Analyze certifications
    const certReq = job.requirements.find(req => req.toLowerCase().includes('certif'));
    if (certReq && candidate.certifications) {
      const hasCertifications = candidate.certifications.some(cert => 
        certReq.toLowerCase().includes(cert.toLowerCase())
      );
      if (hasCertifications) strengths.push('Has required certifications');
      else gaps.push('May need to obtain specific certifications');
    }
    
    // Analyze location using the helper
    const jobCity = getCity(job.location);
    const candidateCity = getCity(candidate.location);
    if (jobCity && candidateCity) {
      if (jobCity.toLowerCase() === candidateCity.toLowerCase()) {
        strengths.push(`Located in the same city (${jobCity})`);
      } else {
        gaps.push(`May have commute considerations (located in ${candidateCity})`);
      }
    }
    
    return {
      candidateName: `${candidate.firstName ?? ''} ${candidate.lastName ?? ''}`.trim(),
      matchScore: candidate.matchScore || 0,
      keyStrengths: strengths,
      potentialGaps: gaps
    };
  });
  
  // Generate overall summary
  const topCandidate = recommendations.length > 0 ? recommendations[0] : null;
  const avgScore = matchDetails.length > 0 ? matchDetails.reduce((sum, detail) => sum + detail.matchScore, 0) / matchDetails.length : 0;
  
  let summary = `We found ${recommendations.length} qualified candidates for the ${job.title} position. `;
  
  if (topCandidate) {
    summary += `The top match is ${topCandidate.firstName} ${topCandidate.lastName} with a ${topCandidate.matchScore || 0}% match rate. `;
    if (avgScore > 80) summary += 'Overall, the candidate pool is exceptionally strong.';
    else if (avgScore > 65) summary += 'The candidate pool is strong with several qualified applicants.';
    else summary += 'You may want to continue your search to find more candidates.';
  } else {
    summary += 'Consider adjusting your requirements to attract more applicants.';
  }
  
  return {
    job,
    recommendations,
    summary,
    matchDetails
  };
};

// Generate recommendations for all jobs from a specific organization
export const generateOrganizationRecommendations = (organizationId: string): JobRecommendationReport[] => {
  const orgJobs = mockJobs.filter(job => job.organizationId === organizationId);
  
  return orgJobs
    .map(job => generateJobRecommendationReport(job.id))
    .filter((report): report is JobRecommendationReport => report !== null);
};