// src/services/recommendationService.ts

import { Job, UserProfile } from '../../types/data';
import { calculateMatchScore } from './candidateMatchingEngine';

// Type for a candidate enriched with their match score
export type RecommendedCandidate = UserProfile & { matchScore: number };

/**
 * Gets top recommended candidates for a specific job
 * @param job - The job posting
 * @param candidates - Array of all available candidates
 * @param limit - Maximum number of candidates to return (default: 5)
 * @returns Array of top candidates sorted by match score (highest first)
 */
export const getRecommendationsForJob = (
  job: Job,
  candidates: UserProfile[],
  limit: number = 5
): RecommendedCandidate[] => {
  // Calculate match scores for all candidates
  const candidatesWithScores: RecommendedCandidate[] = candidates.map(candidate => ({
    ...candidate,
    matchScore: calculateMatchScore(job, candidate)
  }));

  // Sort by match score (highest first) and return top N
  return candidatesWithScores
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

/**
 * Analyzes a candidate against a job to identify strengths and gaps
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Object with arrays of strengths and gaps
 */
export const generateStrengthsAndGaps = (
  job: Job,
  candidate: UserProfile
): { strengths: string[], gaps: string[] } => {
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Analyze skills
  if (candidate.skills && candidate.skills.length > 0) {
    const jobText = (job.description + ' ' + job.requirements.join(' ')).toLowerCase();
    const matchingSkills = candidate.skills.filter(skill =>
      jobText.includes(skill.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    );

    if (matchingSkills.length >= 3) {
      strengths.push(`Strong skill alignment: ${matchingSkills.slice(0, 3).join(', ')}`);
    } else if (matchingSkills.length > 0) {
      strengths.push(`Some relevant skills: ${matchingSkills.join(', ')}`);
    } else {
      gaps.push('Limited skills matching job requirements');
    }
  } else {
    gaps.push('No skills listed on profile');
  }

  // Analyze experience titles
  if (candidate.experience && candidate.experience.length > 0) {
    const hasRelevantTitle = candidate.experience.some(exp =>
      exp.title.toLowerCase().includes(job.title.toLowerCase()) ||
      job.title.toLowerCase().includes(exp.title.toLowerCase())
    );

    if (hasRelevantTitle) {
      strengths.push('Direct experience in a similar role');
    } else {
      // Check for related experience
      const hasChildcareExp = candidate.experience.some(exp =>
        exp.title.toLowerCase().includes('teacher') ||
        exp.title.toLowerCase().includes('caregiver') ||
        exp.title.toLowerCase().includes('childcare') ||
        exp.title.toLowerCase().includes('education')
      );

      if (hasChildcareExp) {
        strengths.push('Relevant childcare/education experience');
      } else {
        gaps.push('Limited relevant job title experience');
      }
    }
  } else {
    gaps.push('No work experience listed');
  }

  // Analyze years of experience
  if (candidate.yearsOfExperience !== undefined) {
    // Extract required years from job requirements
    let requiredYears = 1;
    for (const requirement of job.requirements) {
      const yearMatch = requirement.match(/(\d+)\+?\s*years?/i);
      if (yearMatch) {
        requiredYears = Math.max(requiredYears, parseInt(yearMatch[1], 10));
      }
    }

    if (candidate.yearsOfExperience >= requiredYears + 2) {
      strengths.push(`Extensive experience (${candidate.yearsOfExperience}+ years)`);
    } else if (candidate.yearsOfExperience >= requiredYears) {
      strengths.push(`Meets experience requirements (${candidate.yearsOfExperience} years)`);
    } else {
      gaps.push(`Fewer years of experience than required (${candidate.yearsOfExperience} vs ${requiredYears} years)`);
    }
  } else {
    gaps.push('Years of experience not specified');
  }

  // Analyze education
  const educationReqs = job.requirements.filter(req =>
    req.toLowerCase().includes('degree') ||
    req.toLowerCase().includes('education') ||
    req.toLowerCase().includes('bachelor') ||
    req.toLowerCase().includes('master')
  );

  if (educationReqs.length > 0) {
    if (candidate.education && candidate.education.length > 0) {
      const hasMatchingEducation = educationReqs.some(req =>
        candidate.education!.some(edu =>
          req.toLowerCase().includes(edu.degree.toLowerCase()) ||
          edu.degree.toLowerCase().includes('early childhood') ||
          edu.degree.toLowerCase().includes('education')
        )
      );

      if (hasMatchingEducation) {
        strengths.push('Education requirements met');
      } else {
        gaps.push('May not fully meet education requirements');
      }
    } else {
      gaps.push('No education information provided');
    }
  }

  // Analyze certifications
  const certReqs = job.requirements.filter(req =>
    req.toLowerCase().includes('certif') ||
    req.toLowerCase().includes('license') ||
    req.toLowerCase().includes('cpr') ||
    req.toLowerCase().includes('first aid')
  );

  if (certReqs.length > 0) {
    if (candidate.certifications && candidate.certifications.length > 0) {
      const hasCertifications = certReqs.some(req =>
        candidate.certifications!.some(cert =>
          req.toLowerCase().includes(cert.toLowerCase()) ||
          cert.toLowerCase().includes('cpr') ||
          cert.toLowerCase().includes('first aid')
        )
      );

      if (hasCertifications) {
        strengths.push('Has required certifications');
      } else {
        gaps.push('May need to obtain specific certifications');
      }
    } else {
      gaps.push('No certifications listed');
    }
  }

  // Analyze location
  if (candidate.location && job.location) {
    const candidateCity = candidate.location.split(',')[0].trim().toLowerCase();
    const jobCity = job.location.split(',')[0].trim().toLowerCase();

    if (candidateCity === jobCity) {
      strengths.push(`Located in same area (${candidateCity})`);
    } else {
      gaps.push(`Location difference may require commute or relocation`);
    }
  }

  // Analyze job type preference
  if (candidate.preferredJobTypes && candidate.preferredJobTypes.includes(job.type)) {
    strengths.push('Job type aligns with preferences');
  } else if (candidate.preferredJobTypes && candidate.preferredJobTypes.length > 0) {
    gaps.push('Job type may not match stated preferences');
  }

  return { strengths, gaps };
};

/**
 * Generates a human-readable summary of recommendations for a job
 * @param job - The job posting
 * @param topCandidates - Array of top recommended candidates
 * @returns A summary paragraph for recruiters
 */
export const generateRecommendationSummary = (
  job: Job,
  topCandidates: RecommendedCandidate[]
): string => {
  if (topCandidates.length === 0) {
    return `No qualified candidates found for the ${job.title} position at ${job.organizationName}. Consider adjusting requirements or expanding your search criteria.`;
  }

  const topCandidate = topCandidates[0];
  const avgScore = topCandidates.reduce((sum, candidate) => sum + candidate.matchScore, 0) / topCandidates.length;

  let summary = `We found ${topCandidates.length} qualified candidate${topCandidates.length > 1 ? 's' : ''} for the ${job.title} role at ${job.organizationName}. `;

  summary += `The top match is ${topCandidate.firstName} ${topCandidate.lastName} with a ${topCandidate.matchScore}% compatibility score. `;

  // Add assessment based on average score
  if (avgScore >= 85) {
    summary += 'The candidate pool is exceptionally strong with multiple highly qualified applicants.';
  } else if (avgScore >= 70) {
    summary += 'The overall candidate pool is strong with several well-qualified applicants.';
  } else if (avgScore >= 55) {
    summary += 'The candidate pool shows promise, though some candidates may need additional training or development.';
  } else {
    summary += 'Consider expanding your search or adjusting requirements to find more closely matched candidates.';
  }

  // Add insights about top candidate
  if (topCandidate.yearsOfExperience) {
    summary += ` ${topCandidate.firstName} brings ${topCandidate.yearsOfExperience} years of relevant experience`;

    if (topCandidate.education && topCandidate.education.length > 0) {
      const degree = topCandidate.education[0].degree;
      summary += ` and holds a ${degree}`;
    }

    summary += '.';
  }

  return summary;
};
