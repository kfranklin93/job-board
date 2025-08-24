import { Job, UserProfile, JobType } from '../../types/data';

// Interface for match result
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

// Interface for job match with candidate
export interface JobMatch {
  job: Job;
  matchResult: MatchResult;
}

/**
 * Calculate a comprehensive match score between a job and a candidate
 * Returns a score from 0-100 based on weighted criteria
 */
export function calculateMatchScore(job: Job, candidate: UserProfile): MatchResult {
  const weights = {
    skills: 0.25,           // 25%
    experience: 0.25,       // 25%
    yearsOfExperience: 0.20, // 20%
    education: 0.15,        // 15%
    certifications: 0.10,   // 10%
    jobType: 0.05          // 5%
  };

  // Calculate individual scores
  const skillsScore = calculateSkillsScore(job, candidate);
  const experienceScore = calculateExperienceScore(job, candidate);
  const yearsScore = calculateYearsOfExperienceScore(job, candidate);
  const educationScore = calculateEducationScore(job, candidate);
  const certificationsScore = calculateCertificationsScore(job, candidate);
  const jobTypeScore = calculateJobTypeScore(job, candidate);

  // Calculate weighted total score
  const totalScore = Math.round(
    skillsScore.score * weights.skills +
    experienceScore.score * weights.experience +
    yearsScore.score * weights.yearsOfExperience +
    educationScore.score * weights.education +
    certificationsScore.score * weights.certifications +
    jobTypeScore.score * weights.jobType
  );

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      skills: skillsScore.score,
      experience: experienceScore.score,
      yearsOfExperience: yearsScore.score,
      education: educationScore.score,
      certifications: certificationsScore.score,
      jobType: jobTypeScore.score
    },
    details: {
      matchedSkills: skillsScore.matched,
      missingSkills: skillsScore.missing,
      experienceMatch: experienceScore.match,
      educationMatch: educationScore.match,
      certificationMatch: certificationsScore.match,
      yearsMatch: yearsScore.match
    }
  };
}

/**
 * Calculate skills matching score (0-100)
 */
function calculateSkillsScore(job: Job, candidate: UserProfile): { score: number; matched: string[]; missing: string[] } {
  const requiredSkills = job.requiredSkills || [];
  const candidateSkills = candidate.skills || [];
  
  if (requiredSkills.length === 0) {
    return { score: 100, matched: [], missing: [] };
  }

  const normalizedRequired = requiredSkills.map(s => s.toLowerCase().trim());
  const normalizedCandidate = candidateSkills.map(s => s.toLowerCase().trim());
  
  const matched: string[] = [];
  const missing: string[] = [];
  
  normalizedRequired.forEach((skill, index) => {
    if (normalizedCandidate.some(cs => cs.includes(skill) || skill.includes(cs))) {
      matched.push(requiredSkills[index]);
    } else {
      missing.push(requiredSkills[index]);
    }
  });
  
  const matchPercentage = matched.length / requiredSkills.length;
  const baseScore = Math.round(matchPercentage * 100);
  
  // Bonus for having extra relevant skills
  const extraSkillsBonus = Math.min(10, candidateSkills.length - matched.length);
  
  return {
    score: Math.min(100, baseScore + extraSkillsBonus),
    matched,
    missing
  };
}

/**
 * Calculate experience keywords matching score (0-100)
 */
function calculateExperienceScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const experiences = candidate.experience || [];
  
  if (experiences.length === 0) {
    return { score: 0, match: false };
  }

  const jobTitle = job.title.toLowerCase();
  const jobKeywords = extractKeywords(job.title + ' ' + job.description);
  
  let bestScore = 0;
  let hasMatch = false;
  
  experiences.forEach(exp => {
    const expTitle = exp.title.toLowerCase();
    const expKeywords = extractKeywords(exp.title + ' ' + (exp.description || ''));
    
    // Direct title match bonus
    if (expTitle.includes(jobTitle) || jobTitle.includes(expTitle)) {
      bestScore = Math.max(bestScore, 100);
      hasMatch = true;
      return;
    }
    
    // Keyword matching
    const commonKeywords = jobKeywords.filter(keyword => 
      expKeywords.includes(keyword)
    );
    
    if (commonKeywords.length > 0) {
      const keywordScore = Math.min(90, (commonKeywords.length / jobKeywords.length) * 100);
      bestScore = Math.max(bestScore, keywordScore);
      hasMatch = true;
    }
  });
  
  return { score: Math.round(bestScore), match: hasMatch };
}

/**
 * Calculate years of experience score (0-100)
 */
function calculateYearsOfExperienceScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const requiredYears = job.yearsOfExperienceRequired || 0;
  const candidateYears = candidate.yearsOfExperience || 0;
  
  if (requiredYears === 0) {
    return { score: 100, match: true };
  }
  
  if (candidateYears >= requiredYears) {
    // Bonus for extra experience, up to 100%
    const bonusYears = Math.min(candidateYears - requiredYears, requiredYears);
    const bonus = (bonusYears / requiredYears) * 20; // Up to 20% bonus
    return { score: Math.min(100, 100 + bonus), match: true };
  }
  
  // Proportional score if under requirements
  const score = Math.round((candidateYears / requiredYears) * 80); // Max 80% if under
  return { score, match: candidateYears >= requiredYears * 0.8 };
}

/**
 * Calculate education matching score (0-100)
 */
function calculateEducationScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const requiredEducation = job.educationLevelRequired;
  const candidateEducation = candidate.education || [];
  
  if (!requiredEducation || candidateEducation.length === 0) {
    return { score: requiredEducation ? 50 : 100, match: !requiredEducation };
  }
  
  const educationLevels = {
    'high school': 1,
    'associate': 2,
    'bachelor': 3,
    'master': 4,
    'doctorate': 5,
    'phd': 5
  };
  
  const requiredLevel = getEducationLevel(requiredEducation, educationLevels);
  const candidateHighestLevel = Math.max(
    ...candidateEducation.map(edu => getEducationLevel(edu.degree, educationLevels))
  );
  
  if (candidateHighestLevel >= requiredLevel) {
    // Check for field relevance
    const hasRelevantField = candidateEducation.some(edu => 
      isEducationFieldRelevant(edu.degree, job)
    );
    return { score: hasRelevantField ? 100 : 90, match: true };
  }
  
  // Partial credit for lower education
  const score = Math.round((candidateHighestLevel / requiredLevel) * 70);
  return { score, match: false };
}

/**
 * Calculate certifications matching score (0-100)
 */
function calculateCertificationsScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const requiredCerts = job.requiredCertifications || [];
  const candidateCerts = candidate.certifications || [];
  
  if (requiredCerts.length === 0) {
    return { score: 100, match: true };
  }
  
  const normalizedRequired = requiredCerts.map(c => c.toLowerCase().trim());
  const normalizedCandidate = candidateCerts.map(c => c.toLowerCase().trim());
  
  const matchedCerts = normalizedRequired.filter(cert =>
    normalizedCandidate.some(candCert => 
      candCert.includes(cert) || cert.includes(candCert)
    )
  );
  
  const matchPercentage = matchedCerts.length / requiredCerts.length;
  const score = Math.round(matchPercentage * 100);
  
  return { score, match: matchPercentage >= 0.8 };
}

/**
 * Calculate job type preference score (0-100)
 */
function calculateJobTypeScore(job: Job, candidate: UserProfile): { score: number; match: boolean } {
  const preferredTypes = candidate.preferredJobTypes || [];
  
  if (preferredTypes.length === 0) {
    return { score: 80, match: true }; // Neutral score if no preference
  }
  
  const hasMatch = preferredTypes.includes(job.type);
  return { score: hasMatch ? 100 : 60, match: hasMatch };
}

/**
 * Find best job matches for a specific job seeker
 */
export function findBestJobMatches(candidate: UserProfile, jobs: Job[], limit: number = 10): JobMatch[] {
  const matches = jobs.map(job => ({
    job,
    matchResult: calculateMatchScore(job, candidate)
  }));
  
  // Sort by score descending
  matches.sort((a, b) => b.matchResult.score - a.matchResult.score);
  
  return matches.slice(0, limit);
}

/**
 * Helper function to extract keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
    .filter((word, index, array) => array.indexOf(word) === index); // Remove duplicates
}

/**
 * Helper function to get education level number
 */
function getEducationLevel(degree: string, levels: Record<string, number>): number {
  const normalizedDegree = degree.toLowerCase();
  
  for (const [level, value] of Object.entries(levels)) {
    if (normalizedDegree.includes(level)) {
      return value;
    }
  }
  
  return 1; // Default to high school level
}

/**
 * Helper function to check if education field is relevant to job
 */
function isEducationFieldRelevant(degree: string, job: Job): boolean {
  const relevantFields = [
    'early childhood',
    'education',
    'child development',
    'psychology',
    'social work',
    'family studies'
  ];
  
  const normalizedDegree = degree.toLowerCase();
  const normalizedJob = (job.title + ' ' + job.description).toLowerCase();
  
  return relevantFields.some(field => 
    normalizedDegree.includes(field) || normalizedJob.includes(field)
  );
}

export default {
  calculateMatchScore,
  findBestJobMatches
};
