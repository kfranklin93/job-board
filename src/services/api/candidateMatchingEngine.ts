import { Job, UserProfile, JobType } from '../../types/data';

// ### --- TYPE DEFINITIONS --- ###

/**
 * Defines the detailed breakdown of a match score.
 */
export interface MatchResult {
  score: number;
  breakdown: {
    skills: number;
    experience: number;
    yearsOfExperience: number;
    education: number;
    certifications: number;
    jobType: number;
  };
  details: {
    matchedSkills: string[];
    missingSkills: string[];
    experienceMatch: boolean;
    educationMatch: boolean;
    certificationMatch: boolean;
    yearsMatch: boolean;
  };
}

/**
 * Represents a job along with its calculated match result for a candidate.
 */
export interface JobMatch {
  job: Job;
  matchResult: MatchResult;
}

// ### --- HELPER FUNCTIONS --- ###

/**
 * Extracts unique, relevant keywords from a text string.
 * @param text The text to process.
 * @returns An array of unique keywords.
 */
function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Remove punctuation
    .split(/\s+/) // Split by spaces
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  return [...new Set(words)]; // Return unique keywords
}

/**
 * Gets a numerical value for an education level.
 * @param degree The degree string (e.g., "Bachelor's in Education").
 * @returns A numerical level.
 */
function getEducationLevel(degree: string): number {
  const normalizedDegree = degree.toLowerCase();
  if (normalizedDegree.includes('phd') || normalizedDegree.includes('doctorate')) return 5;
  if (normalizedDegree.includes('master')) return 4;
  if (normalizedDegree.includes('bachelor')) return 3;
  if (normalizedDegree.includes('associate')) return 2;
  return 1; // Default to high school level
}

/**
 * Checks if an education field is relevant to the early childhood sector.
 * @param degree The degree string.
 * @param job The job posting.
 * @returns True if the field is considered relevant.
 */
function isEducationFieldRelevant(degree: string, job: Job): boolean {
  const relevantFields = ['early childhood', 'education', 'child development', 'psychology', 'social work', 'family studies'];
  const normalizedDegree = degree.toLowerCase();
  const normalizedJobText = (job.title + ' ' + job.description).toLowerCase();
  
  return relevantFields.some(field => normalizedDegree.includes(field) || normalizedJobText.includes(field));
}

// ### --- SCORING FUNCTIONS --- ###

function calculateSkillsScore(job: Job, candidate: UserProfile): { score: number; matched: string[]; missing: string[] } {
  const requiredSkills = job.requiredSkills ?? [];
  const candidateSkills = candidate.skills ?? [];
  if (requiredSkills.length === 0) return { score: 100, matched: [], missing: [] };

  const normalizedRequired = requiredSkills.map(s => s.toLowerCase().trim());
  const normalizedCandidate = new Set(candidateSkills.map(s => s.toLowerCase().trim()));
  
  const matched = requiredSkills.filter(skill => normalizedCandidate.has(skill.toLowerCase().trim()));
  const missing = requiredSkills.filter(skill => !normalizedCandidate.has(skill.toLowerCase().trim()));
  
  const matchPercentage = matched.length / requiredSkills.length;
  const score = Math.min(100, Math.round(matchPercentage * 100) + Math.min(10, candidateSkills.length - matched.length)); // Add small bonus for extra skills
  
  return { score, matched, missing };
}

function calculateExperienceScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const experiences = candidate.experience ?? [];
  if (experiences.length === 0) return { score: 0, match: false };

  const jobTitle = job.title.toLowerCase();
  const jobKeywords = extractKeywords(job.title + ' ' + job.description);
  
  let bestScore = 0;
  experiences.forEach(exp => {
    const expTitle = exp.title.toLowerCase();
    if (expTitle.includes(jobTitle) || jobTitle.includes(expTitle)) {
      bestScore = Math.max(bestScore, 100);
    }
    const expKeywords = extractKeywords(exp.title + ' ' + (exp.description || ''));
    const commonKeywords = jobKeywords.filter(keyword => expKeywords.includes(keyword));
    const keywordScore = Math.min(90, (commonKeywords.length / jobKeywords.length) * 100);
    bestScore = Math.max(bestScore, keywordScore);
  });
  
  return { score: Math.round(bestScore), match: bestScore > 50 };
}

function calculateYearsOfExperienceScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const requiredYears = job.yearsOfExperienceRequired ?? 0;
  const candidateYears = candidate.yearsOfExperience ?? 0;
  if (requiredYears === 0) return { score: 100, match: true };

  if (candidateYears >= requiredYears) {
    const bonus = Math.min(20, ((candidateYears - requiredYears) / requiredYears) * 20); // Up to 20% bonus
    return { score: Math.min(100, 100 + bonus), match: true };
  }
  
  const score = Math.round((candidateYears / requiredYears) * 80); // Max 80% if under
  return { score, match: candidateYears >= requiredYears * 0.8 };
}

function calculateEducationScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const requiredEducation = job.educationLevelRequired;
  const candidateEducation = candidate.education ?? [];
  if (!requiredEducation) return { score: 100, match: true };
  if (candidateEducation.length === 0) return { score: 50, match: false };

  const requiredLevel = getEducationLevel(requiredEducation);
  const candidateHighestLevel = Math.max(...candidateEducation.map(edu => getEducationLevel(edu.degree)));
  
  if (candidateHighestLevel >= requiredLevel) {
    const hasRelevantField = candidateEducation.some(edu => isEducationFieldRelevant(edu.degree, job));
    return { score: hasRelevantField ? 100 : 90, match: true };
  }
  
  const score = Math.round((candidateHighestLevel / requiredLevel) * 70);
  return { score, match: false };
}

function calculateCertificationsScore(job: Job, candidate: UserProfile): { score: number; match: boolean; matched: string[]; missing: string[] } {
    const requiredCerts = job.requiredCertifications ?? [];
    const candidateCerts = candidate.certifications ?? [];
    if (requiredCerts.length === 0) return { score: 100, match: true, matched: [], missing: [] };

    const normalizedRequired = requiredCerts.map(c => c.toLowerCase().trim());
    const normalizedCandidate = new Set(candidateCerts.map(c => c.toLowerCase().trim()));

    const matched = requiredCerts.filter(cert => normalizedCandidate.has(cert.toLowerCase().trim()));
    const missing = requiredCerts.filter(cert => !normalizedCandidate.has(cert.toLowerCase().trim()));

    const matchPercentage = matched.length / requiredCerts.length;
    const score = Math.round(matchPercentage * 100);

    return { score, match: matchPercentage >= 0.8, matched, missing };
}

function calculateJobTypeScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const preferredTypes = candidate.preferredJobTypes ?? [];
  if (preferredTypes.length === 0) return { score: 80, match: true }; // Neutral score if no preference
  
  const hasMatch = preferredTypes.includes(job.type as JobType);
  return { score: hasMatch ? 100 : 60, match: hasMatch };
}

// ### --- MAIN EXPORTED FUNCTIONS --- ###

/**
 * Calculates a comprehensive match score between a job and a candidate.
 * Returns a detailed result object with the overall score and a breakdown.
 */
export function calculateMatchScore(job: Job, candidate: UserProfile): MatchResult {
  const weights = {
    skills: 0.25,
    experience: 0.25,
    yearsOfExperience: 0.20,
    education: 0.15,
    certifications: 0.10,
    jobType: 0.05
  };

  const skillsResult = calculateSkillsScore(job, candidate);
  const experienceResult = calculateExperienceScore(job, candidate);
  const yearsResult = calculateYearsOfExperienceScore(job, candidate);
  const educationResult = calculateEducationScore(job, candidate);
  const certsResult = calculateCertificationsScore(job, candidate);
  const jobTypeResult = calculateJobTypeScore(job, candidate);

  const totalScore = Math.round(
    skillsResult.score * weights.skills +
    experienceResult.score * weights.experience +
    yearsResult.score * weights.yearsOfExperience +
    educationResult.score * weights.education +
    certsResult.score * weights.certifications +
    jobTypeResult.score * weights.jobType
  );

  return {
    score: Math.min(100, totalScore),
    breakdown: {
      skills: skillsResult.score,
      experience: experienceResult.score,
      yearsOfExperience: yearsResult.score,
      education: educationResult.score,
      certifications: certsResult.score,
      jobType: jobTypeResult.score
    },
    details: {
      matchedSkills: skillsResult.matched,
      missingSkills: skillsResult.missing,
      experienceMatch: experienceResult.match,
      educationMatch: educationResult.match,
      certificationMatch: certsResult.match,
      yearsMatch: yearsResult.match,
    }
  };
}

/**
 * Finds the best job matches for a specific job seeker from a list of jobs.
 * @param candidate The user profile of the job seeker.
 * @param jobs An array of available jobs.
 * @param limit The maximum number of matches to return.
 * @returns An array of sorted job matches.
 */
export function findBestJobMatches(candidate: UserProfile, jobs: Job[], limit: number = 10): JobMatch[] {
  return jobs
    .map(job => ({
      job,
      matchResult: calculateMatchScore(job, candidate)
    }))
    .sort((a, b) => b.matchResult.score - a.matchResult.score)
    .slice(0, limit);
}