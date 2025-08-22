// src/services/__tests__/recommendationService.test.ts

import { 
  getRecommendationsForJob, 
  generateStrengthsAndGaps, 
  generateRecommendationSummary 
} from '../recommendationService';
import { Job, UserProfile, JobType, JobStatus, UserRole } from '../../types/data';

describe('Recommendation Service', () => {
  const mockJob: Job = {
    id: 'test-job-1',
    organizationId: 'org-1',
    organizationName: 'Test Daycare',
    title: 'Lead Preschool Teacher',
    description: 'Seeking an experienced teacher for curriculum development and classroom management',
    requirements: [
      'Bachelor\'s degree in Early Childhood Education',
      'Minimum 3 years of experience',
      'CPR and First Aid certification'
    ],
    location: 'San Francisco, CA',
    salary: '$50,000 - $60,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE
  };

  const mockCandidates: UserProfile[] = [
    {
      id: 'candidate-1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      role: UserRole.SEEKER,
      location: 'San Francisco, CA',
      skills: ['Curriculum Development', 'Classroom Management'],
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
      certifications: ['CPR Certification'],
      yearsOfExperience: 5,
      preferredJobTypes: [JobType.FULL_TIME],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      id: 'candidate-2',
      firstName: 'Michael',
      lastName: 'Rodriguez',
      email: 'michael@example.com',
      role: UserRole.SEEKER,
      location: 'Oakland, CA',
      skills: ['Child Development'],
      experience: [
        {
          id: 'exp-2',
          title: 'Assistant Teacher',
          company: 'Another School',
          startDate: '2022-01-01',
          endDate: '2025-01-01'
        }
      ],
      yearsOfExperience: 2,
      preferredJobTypes: [JobType.PART_TIME],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    },
    {
      id: 'candidate-3',
      firstName: 'Jessica',
      lastName: 'Williams',
      email: 'jessica@example.com',
      role: UserRole.SEEKER,
      location: 'San Francisco, CA',
      skills: ['Curriculum Development', 'Assessment', 'Family Engagement'],
      education: [
        {
          id: 'edu-3',
          degree: 'Master of Arts in Early Childhood Education',
          institution: 'Top University',
          graduationYear: '2018'
        }
      ],
      certifications: ['CPR Certification', 'First Aid Certification'],
      yearsOfExperience: 4,
      preferredJobTypes: [JobType.FULL_TIME],
      createdAt: '2025-01-01',
      updatedAt: '2025-01-01'
    }
  ];

  describe('getRecommendationsForJob', () => {
    test('should return candidates sorted by match score', () => {
      const recommendations = getRecommendationsForJob(mockJob, mockCandidates, 3);
      
      expect(recommendations).toHaveLength(3);
      expect(recommendations[0]).toHaveProperty('matchScore');
      
      // Scores should be in descending order
      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].matchScore).toBeGreaterThanOrEqual(
          recommendations[i + 1].matchScore
        );
      }
    });

    test('should respect the limit parameter', () => {
      const recommendations = getRecommendationsForJob(mockJob, mockCandidates, 2);
      expect(recommendations).toHaveLength(2);
    });

    test('should include all candidate properties plus matchScore', () => {
      const recommendations = getRecommendationsForJob(mockJob, mockCandidates, 1);
      const recommendation = recommendations[0];
      
      expect(recommendation).toHaveProperty('id');
      expect(recommendation).toHaveProperty('firstName');
      expect(recommendation).toHaveProperty('lastName');
      expect(recommendation).toHaveProperty('matchScore');
      expect(typeof recommendation.matchScore).toBe('number');
    });

    test('should handle empty candidate list', () => {
      const recommendations = getRecommendationsForJob(mockJob, [], 5);
      expect(recommendations).toHaveLength(0);
    });
  });

  describe('generateStrengthsAndGaps', () => {
    test('should identify strengths for well-matched candidate', () => {
      const wellMatchedCandidate = mockCandidates[0]; // Sarah Johnson
      const analysis = generateStrengthsAndGaps(mockJob, wellMatchedCandidate);
      
      expect(analysis).toHaveProperty('strengths');
      expect(analysis).toHaveProperty('gaps');
      expect(Array.isArray(analysis.strengths)).toBe(true);
      expect(Array.isArray(analysis.gaps)).toBe(true);
      expect(analysis.strengths.length).toBeGreaterThan(0);
    });

    test('should identify gaps for less experienced candidate', () => {
      const lessExperiencedCandidate = mockCandidates[1]; // Michael Rodriguez
      const analysis = generateStrengthsAndGaps(mockJob, lessExperiencedCandidate);
      
      expect(analysis.gaps.length).toBeGreaterThan(0);
      expect(analysis.gaps.some(gap => gap.includes('experience'))).toBe(true);
    });

    test('should recognize location match as strength', () => {
      const localCandidate = mockCandidates[0]; // Sarah Johnson (San Francisco)
      const analysis = generateStrengthsAndGaps(mockJob, localCandidate);
      
      expect(analysis.strengths.some(strength => 
        strength.toLowerCase().includes('san francisco') || strength.toLowerCase().includes('location')
      )).toBe(true);
    });

    test('should identify direct experience as strength', () => {
      const experiencedCandidate = mockCandidates[0]; // Has "Lead Preschool Teacher" experience
      const analysis = generateStrengthsAndGaps(mockJob, experiencedCandidate);
      
      expect(analysis.strengths.some(strength => 
        strength.toLowerCase().includes('direct experience') || strength.toLowerCase().includes('similar role')
      )).toBe(true);
    });

    test('should handle candidate with missing data gracefully', () => {
      const incompleteCandidate: UserProfile = {
        id: 'incomplete',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: UserRole.SEEKER,
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01'
      };
      
      const analysis = generateStrengthsAndGaps(mockJob, incompleteCandidate);
      expect(analysis).toHaveProperty('strengths');
      expect(analysis).toHaveProperty('gaps');
      expect(analysis.gaps.length).toBeGreaterThan(0); // Should identify missing information as gaps
    });
  });

  describe('generateRecommendationSummary', () => {
    test('should generate summary for multiple candidates', () => {
      const recommendations = getRecommendationsForJob(mockJob, mockCandidates, 3);
      const summary = generateRecommendationSummary(mockJob, recommendations);
      
      expect(typeof summary).toBe('string');
      expect(summary.length).toBeGreaterThan(0);
      expect(summary).toContain('Lead Preschool Teacher');
      expect(summary).toContain('Test Daycare');
      expect(summary).toContain('3'); // Number of candidates
    });

    test('should mention top candidate by name', () => {
      const recommendations = getRecommendationsForJob(mockJob, mockCandidates, 2);
      const summary = generateRecommendationSummary(mockJob, recommendations);
      const topCandidate = recommendations[0];
      
      expect(summary).toContain(topCandidate.firstName);
      expect(summary).toContain(topCandidate.lastName);
      expect(summary).toContain(`${topCandidate.matchScore}%`);
    });

    test('should handle empty candidate list', () => {
      const summary = generateRecommendationSummary(mockJob, []);
      
      expect(typeof summary).toBe('string');
      expect(summary).toContain('No qualified candidates');
      expect(summary).toContain('Lead Preschool Teacher');
      expect(summary).toContain('Test Daycare');
    });

    test('should provide appropriate assessment based on average scores', () => {
      // Create high-scoring candidates
      const highScoringRecommendations = mockCandidates.map(candidate => ({
        ...candidate,
        matchScore: 90
      }));
      
      const highScoreSummary = generateRecommendationSummary(mockJob, highScoringRecommendations);
      expect(highScoreSummary.toLowerCase()).toContain('strong');
      
      // Create low-scoring candidates
      const lowScoringRecommendations = mockCandidates.map(candidate => ({
        ...candidate,
        matchScore: 40
      }));
      
      const lowScoreSummary = generateRecommendationSummary(mockJob, lowScoringRecommendations);
      expect(lowScoreSummary.toLowerCase()).toMatch(/consider|expand|adjust/);
    });

    test('should include top candidate details when available', () => {
      const recommendationsWithExperience = [
        {
          ...mockCandidates[0],
          matchScore: 85,
          yearsOfExperience: 7,
          education: [
            {
              id: 'edu-1',
              degree: 'Master of Education',
              institution: 'University',
              graduationYear: '2018'
            }
          ]
        }
      ];
      
      const summary = generateRecommendationSummary(mockJob, recommendationsWithExperience);
      expect(summary).toContain('7 years');
      expect(summary).toContain('Master of Education');
    });
  });
});
