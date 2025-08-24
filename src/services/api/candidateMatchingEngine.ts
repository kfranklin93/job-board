// src/services/candidateMatchingEngine.ts

import { Job, UserProfile } from '../../types/data';

/**
 * Calculates skills match score between job requirements and candidate skills
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Score from 0 to 1
 */
const calculateSkillsMatch = (job: Job, candidate: UserProfile): number => {
  if (!candidate.skills || candidate.skills.length === 0) {
    return 0;
  }

  // Extract skill keywords from job description and requirements
  const jobText = (job.description + ' ' + job.requirements.join(' ')).toLowerCase();
  const candidateSkills = candidate.skills.map(skill => skill.toLowerCase());

  // Find matching skills
  const matchingSkills = candidateSkills.filter(skill =>
    jobText.includes(skill) ||
    job.requirements.some(req => req.toLowerCase().includes(skill))
  );

  // Calculate percentage match
  const matchPercentage = matchingSkills.length / candidateSkills.length;
  
  // Bonus for having many relevant skills (max 20% bonus)
  const skillCount = candidateSkills.length;
  const bonusMultiplier = Math.min(1.2, 1 + (skillCount - 3) * 0.05);

  return Math.min(1, matchPercentage * bonusMultiplier);
};

/**
 * Calculates experience title match score
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Score from 0 to 1
 */
const calculateExperienceMatch = (job: Job, candidate: UserProfile): number => {
  if (!candidate.experience || candidate.experience.length === 0) {
    return 0;
  }

  const jobTitle = job.title.toLowerCase();
  const jobKeywords = jobTitle.split(' ');

  let bestMatch = 0;

  candidate.experience.forEach(exp => {
    const expTitle = exp.title.toLowerCase();

    // Direct title match
    if (expTitle === jobTitle) {
      bestMatch = Math.max(bestMatch, 1.0);
      return;
    }

    // Partial keyword matching
    const expKeywords = expTitle.split(' ');
    const matchingKeywords = jobKeywords.filter(keyword =>
      expKeywords.some(expKeyword =>
        expKeyword.includes(keyword) || keyword.includes(expKeyword)
      )
    );

    const keywordMatch = matchingKeywords.length / jobKeywords.length;
    bestMatch = Math.max(bestMatch, keywordMatch);
  });

  return bestMatch;
};

/**
 * Calculates years of experience match score
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Score from 0 to 1
 */
const calculateYearsOfExperienceMatch = (job: Job, candidate: UserProfile): number => {
  if (candidate.yearsOfExperience === undefined) {
    return 0.5; // neutral score if not specified
  }

  // Extract required years from job requirements
  let requiredYears = 1; // default minimum
  for (const requirement of job.requirements) {
    const yearMatch = requirement.match(/(\d+)\+?\s*years?/i);
    if (yearMatch) {
      requiredYears = Math.max(requiredYears, parseInt(yearMatch[1], 10));
    }
  }

  const candidateYears = candidate.yearsOfExperience;

  if (candidateYears >= requiredYears) {
    // Full score if meets requirement, bonus for significant extra experience
    const bonus = Math.min(0.2, (candidateYears - requiredYears) * 0.05);
    return Math.min(1, 1 + bonus);
  } else {
    // Partial score if below requirement
    return candidateYears / requiredYears;
  }
};

/**
 * Calculates education match score
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Score from 0 to 1
 */
const calculateEducationMatch = (job: Job, candidate: UserProfile): number => {
  if (!candidate.education || candidate.education.length === 0) {
    return 0.3; // partial credit for experience
  }

  const educationReqs = job.requirements.filter(req =>
    req.toLowerCase().includes('degree') ||
    req.toLowerCase().includes('education') ||
    req.toLowerCase().includes('bachelor') ||
    req.toLowerCase().includes('master') ||
    req.toLowerCase().includes('associate')
  );

  if (educationReqs.length === 0) {
    return 0.8; // high score if no specific education required
  }

  let bestMatch = 0;

  educationReqs.forEach(req => {
    candidate.education!.forEach(edu => {
      const reqLower = req.toLowerCase();
      const degreeLower = edu.degree.toLowerCase();

      // Check for degree level matches
      if (reqLower.includes('bachelor') && degreeLower.includes('bachelor')) {
        bestMatch = Math.max(bestMatch, 1.0);
      } else if (reqLower.includes('master') && degreeLower.includes('master')) {
        bestMatch = Math.max(bestMatch, 1.0);
      } else if (reqLower.includes('associate') && degreeLower.includes('associate')) {
        bestMatch = Math.max(bestMatch, 0.8);
      } else if (reqLower.includes('degree') && degreeLower.includes('degree')) {
        bestMatch = Math.max(bestMatch, 0.9);
      }

      // Check for field-specific matches
      if (reqLower.includes('early childhood') && degreeLower.includes('early childhood')) {
        bestMatch = Math.max(bestMatch, 1.0);
      } else if (reqLower.includes('education') && degreeLower.includes('education')) {
        bestMatch = Math.max(bestMatch, 0.9);
      }
    });
  });

  return bestMatch || 0.5; // default partial match if education exists but doesn't clearly match
};

/**
 * Calculates certifications match score
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Score from 0 to 1
 */
const calculateCertificationsMatch = (job: Job, candidate: UserProfile): number => {
  const certReqs = job.requirements.filter(req =>
    req.toLowerCase().includes('certif') ||
    req.toLowerCase().includes('license') ||
    req.toLowerCase().includes('cpr') ||
    req.toLowerCase().includes('first aid')
  );

  if (certReqs.length === 0) {
    return 0.8; // high score if no certifications required
  }

  if (!candidate.certifications || candidate.certifications.length === 0) {
    return 0;
  }

  const candidateCerts = candidate.certifications.map(cert => cert.toLowerCase());
  let matchCount = 0;

  certReqs.forEach(req => {
    const reqLower = req.toLowerCase();
    const hasMatch = candidateCerts.some(cert =>
      reqLower.includes(cert) || cert.includes('cpr') || cert.includes('first aid')
    );
    if (hasMatch) matchCount++;
  });

  return matchCount / certReqs.length;
};

/**
 * Calculates job type preference match score
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Score from 0 to 1
 */
const calculateJobTypeMatch = (job: Job, candidate: UserProfile): number => {
  if (!candidate.preferredJobTypes || candidate.preferredJobTypes.length === 0) {
    return 0.7; // neutral score if not specified
  }

  return candidate.preferredJobTypes.includes(job.type) ? 1.0 : 0.3;
};

/**
 * Main function to calculate overall match score for a candidate against a job
 * Uses specified weights: Skills (25%), Experience Title Match (25%), Years (20%), Education (15%), Certifications (10%), Job Type (5%)
 * @param job - The job posting
 * @param candidate - The candidate profile
 * @returns Match score from 0 to 100
 */
export const calculateMatchScore = (job: Job, candidate: UserProfile): number => {
  // Calculate individual scores
  const skillsScore = calculateSkillsMatch(job, candidate);
  const experienceScore = calculateExperienceMatch(job, candidate);
  const yearsScore = calculateYearsOfExperienceMatch(job, candidate);
  const educationScore = calculateEducationMatch(job, candidate);
  const certificationsScore = calculateCertificationsMatch(job, candidate);
  const jobTypeScore = calculateJobTypeMatch(job, candidate);

  // Apply weights as specified
  const weightedScore =
    (skillsScore * 0.25) +           // Skills: 25%
    (experienceScore * 0.25) +       // Experience Title Match: 25%
    (yearsScore * 0.20) +            // Years of Experience: 20%
    (educationScore * 0.15) +        // Education: 15%
    (certificationsScore * 0.10) +   // Certifications: 10%
    (jobTypeScore * 0.05);           // Job Type Preference: 5%

  // Convert to 0-100 scale and round to whole number
  return Math.round(weightedScore * 100);
};
