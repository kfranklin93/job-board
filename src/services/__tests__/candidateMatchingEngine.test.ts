// src/services/__tests__/candidateMatchingEngine.test.ts

import { calculateMatchScore } from '../candidateMatchingEngine';
import { Job, UserProfile, JobType, JobStatus, UserRole } from '../../types/data';

describe('Candidate Matching Engine', () => {
  const mockJob: Job = {
    id: 'test-job-1',
    organizationId: 'org-1',
    organizationName: 'Test Daycare',
    title: 'Lead Preschool Teacher',
    description: 'Seeking an experienced teacher for curriculum development and classroom management',
    requirements: [
      'Bachelor\'s degree in Early Childhood Education',
      'Minimum 3 years of experience',
      'CPR and First Aid certification',
      'Experience with curriculum development'
    ],
    location: 'San Francisco, CA',
    salary: '$50,000 - $60,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE
  };

  const mockCandidate: UserProfile = {
    id: 'candidate-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    role: UserRole.SEEKER,
    location: 'San Francisco, CA',
    jobTitle: 'Lead Preschool Teacher',
    skills: ['Curriculum Development', 'Classroom Management', 'Child Development'],
    experience: [
      {
        id: 'exp-1',
        title: 'Lead Preschool Teacher',
        company: 'Previous Daycare',
        startDate: '2020-01-01',
        endDate: '2025-01-01'
      }
    ],
    education: [
      {
        id: 'edu-1',
        degree: 'Bachelor of Arts in Early Childhood Education',
        institution: 'Test University',
        graduationYear: '2019'
      }
    ],
    certifications: ['CPR Certification', 'First Aid Certification'],
    yearsOfExperience: 5,
    preferredJobTypes: [JobType.FULL_TIME],
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01'
  };

  test('should return a score between 0 and 100', () => {
    const score = calculateMatchScore(mockJob, mockCandidate);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
    expect(Number.isInteger(score)).toBe(true);
  });

  test('should give high score for perfect match candidate', () => {
    const perfectCandidate = { ...mockCandidate };
    const score = calculateMatchScore(mockJob, perfectCandidate);
    expect(score).toBeGreaterThan(80); // Should be high for good match
  });

  test('should give low score for candidate with no relevant skills', () => {
    const poorCandidate: UserProfile = {
      ...mockCandidate,
      skills: ['Cooking', 'Dancing', 'Photography'], // No relevant skills
      experience: [],
      education: [],
      certifications: [],
      yearsOfExperience: 0,
      preferredJobTypes: [JobType.PART_TIME] // Different job type preference
    };
    
    const score = calculateMatchScore(mockJob, poorCandidate);
    expect(score).toBeLessThan(40); // Should be low for poor match
  });

  test('should handle candidate with missing fields gracefully', () => {
    const incompleteCandidate: UserProfile = {
      id: 'incomplete',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: UserRole.SEEKER,
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
      // Missing optional fields
    };
    
    const score = calculateMatchScore(mockJob, incompleteCandidate);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('should weight different criteria correctly', () => {
    // Test that skills have significant impact (25% weight)
    const skillsCandidate: UserProfile = {
      ...mockCandidate,
      skills: ['Curriculum Development', 'Classroom Management', 'Child Development', 'Assessment'],
      experience: [],
      education: [],
      certifications: [],
      yearsOfExperience: undefined
    };
    
    const skillsScore = calculateMatchScore(mockJob, skillsCandidate);
    expect(skillsScore).toBeGreaterThan(20); // Should get some points from skills alone
  });

  test('should consider years of experience requirement', () => {
    const experiencedCandidate = {
      ...mockCandidate,
      yearsOfExperience: 10 // More than required 3 years
    };
    
    const newCandidate = {
      ...mockCandidate,
      yearsOfExperience: 1 // Less than required 3 years
    };
    
    const experiencedScore = calculateMatchScore(mockJob, experiencedCandidate);
    const newScore = calculateMatchScore(mockJob, newCandidate);
    
    expect(experiencedScore).toBeGreaterThanOrEqual(newScore);
  });

  test('should consider job type preferences', () => {
    const fullTimeCandidate = {
      ...mockCandidate,
      preferredJobTypes: [JobType.FULL_TIME]
    };
    
    const partTimeCandidate = {
      ...mockCandidate,
      preferredJobTypes: [JobType.PART_TIME]
    };
    
    const fullTimeScore = calculateMatchScore(mockJob, fullTimeCandidate);
    const partTimeScore = calculateMatchScore(mockJob, partTimeCandidate);
    
    expect(fullTimeScore).toBeGreaterThan(partTimeScore);
  });

  test('should give bonus for exact title match in experience', () => {
    const exactTitleCandidate = {
      ...mockCandidate,
      experience: [
        {
          id: 'exp-1',
          title: 'Lead Preschool Teacher', // Exact match
          company: 'Previous School',
          startDate: '2020-01-01',
          endDate: '2025-01-01'
        }
      ]
    };
    
    const differentTitleCandidate = {
      ...mockCandidate,
      experience: [
        {
          id: 'exp-1',
          title: 'Assistant Teacher', // Related but not exact
          company: 'Previous School',
          startDate: '2020-01-01',
          endDate: '2025-01-01'
        }
      ]
    };
    
    const exactScore = calculateMatchScore(mockJob, exactTitleCandidate);
    const differentScore = calculateMatchScore(mockJob, differentTitleCandidate);
    
    expect(exactScore).toBeGreaterThanOrEqual(differentScore);
  });

  test('should consider education requirements', () => {
    const educatedCandidate = {
      ...mockCandidate,
      education: [
        {
          id: 'edu-1',
          degree: 'Bachelor of Arts in Early Childhood Education',
          institution: 'University',
          graduationYear: '2020'
        }
      ]
    };
    
    const noEducationCandidate = {
      ...mockCandidate,
      education: []
    };
    
    const educatedScore = calculateMatchScore(mockJob, educatedCandidate);
    const noEducationScore = calculateMatchScore(mockJob, noEducationCandidate);
    
    expect(educatedScore).toBeGreaterThan(noEducationScore);
  });

  test('should consider certifications', () => {
    const certifiedCandidate = {
      ...mockCandidate,
      certifications: ['CPR Certification', 'First Aid Certification']
    };
    
    const noCertificationsCandidate = {
      ...mockCandidate,
      certifications: []
    };
    
    const certifiedScore = calculateMatchScore(mockJob, certifiedCandidate);
    const noCertificationsScore = calculateMatchScore(mockJob, noCertificationsCandidate);
    
    expect(certifiedScore).toBeGreaterThan(noCertificationsScore);
  });
});
