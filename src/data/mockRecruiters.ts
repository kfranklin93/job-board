// src/data/mockRecruiters.ts

import { UserRole, UserProfile } from '../types/data';

export const mockRecruiters: UserProfile[] = [
  {
    id: 'recruiter_1',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    email: 'maria.rodriguez@kidcare-staffing.com',
    phone: '(555) 111-2222',
    location: 'San Francisco, CA',
    bio: 'Experienced recruiter specializing in early childhood education placements. 10+ years connecting qualified candidates with leading daycare centers throughout the Bay Area.',
    jobTitle: 'Senior Childcare Recruiter',
    avatar: 'https://placehold.co/400?text=MR',
    role: UserRole.RECRUITER,
    skills: ['Talent Acquisition', 'Candidate Assessment', 'Client Relations', 'Market Research', 'Interview Coordination'],
    experience: [
      {
        id: 'r1_exp1',
        title: 'Senior Childcare Recruiter',
        company: 'KidCare Staffing Solutions',
        location: 'San Francisco, CA',
        startDate: 'Jan 2020',
        endDate: 'Present',
        description: 'Lead recruiter for early childhood education positions. Manage client relationships with 25+ daycare centers. Successfully placed 200+ candidates in the past 4 years.'
      },
      {
        id: 'r1_exp2',
        title: 'Education Recruiter',
        company: 'Bay Area Talent Group',
        location: 'Oakland, CA',
        startDate: 'Mar 2017',
        endDate: 'Dec 2019',
        description: 'Recruited teachers and education professionals for K-12 schools and early childhood centers. Built strong network of education professionals in the region.'
      }
    ],
    education: [
      {
        id: 'r1_edu1',
        degree: 'Bachelor of Arts in Human Resources',
        institution: 'San Francisco State University',
        location: 'San Francisco, CA',
        graduationYear: '2016'
      }
    ],
    certifications: ['Professional in Human Resources (PHR)', 'Certified Talent Acquisition Professional (CTAP)'],
    createdAt: new Date('2025-01-10').toISOString(),
    updatedAt: new Date('2025-08-15').toISOString(),
    availability: 'Full-time',
    yearsOfExperience: 7,
    minSalary: 75000
  },
  {
    id: 'recruiter_2',
    firstName: 'James',
    lastName: 'Thompson',
    email: 'james.thompson@early-ed-talent.com',
    phone: '(555) 222-3333',
    location: 'Oakland, CA',
    bio: 'Specialized recruiter focused on matching exceptional early childhood educators with progressive daycare organizations. Passionate about improving quality in early childhood education through strategic talent placement.',
    jobTitle: 'Early Childhood Talent Specialist',
    avatar: 'https://placehold.co/400?text=JT',
    role: UserRole.RECRUITER,
    skills: ['Candidate Matching', 'Quality Assessment', 'Stakeholder Management', 'Data Analysis', 'Relationship Building'],
    experience: [
      {
        id: 'r2_exp1',
        title: 'Early Childhood Talent Specialist',
        company: 'Early Ed Talent Partners',
        location: 'Oakland, CA',
        startDate: 'Jun 2021',
        endDate: 'Present',
        description: 'Specialize in high-level placements for director and coordinator positions. Work with premium daycare centers to find exceptional leadership talent. 95% retention rate for placed candidates.'
      },
      {
        id: 'r2_exp2',
        title: 'Corporate Recruiter',
        company: 'Tech Talent Solutions',
        location: 'San Francisco, CA',
        startDate: 'Aug 2018',
        endDate: 'May 2021',
        description: 'Recruited for various corporate roles before transitioning to education sector. Developed strong assessment and matching methodologies.'
      }
    ],
    education: [
      {
        id: 'r2_edu1',
        degree: 'Master of Business Administration',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationYear: '2018'
      },
      {
        id: 'r2_edu2',
        degree: 'Bachelor of Science in Psychology',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        graduationYear: '2016'
      }
    ],
    certifications: ['Certified Professional Recruiter (CPR)', 'SHRM Certified Professional (SHRM-CP)'],
    createdAt: new Date('2025-02-01').toISOString(),
    updatedAt: new Date('2025-08-20').toISOString(),
    availability: 'Full-time',
    yearsOfExperience: 6,
    minSalary: 80000
  }
];

// Recruiter-Organization partnerships
export const recruiterPartnerships = [
  {
    recruiterId: 'recruiter_1',
    organizationIds: ['org_sunshine', 'org_rainbow'],
    partnershipType: 'Exclusive',
    startDate: '2025-01-01',
    contractTerms: 'Full recruitment services for all teaching positions'
  },
  {
    recruiterId: 'recruiter_2', 
    organizationIds: ['org_sunshine'],
    partnershipType: 'Leadership Only',
    startDate: '2025-03-01',
    contractTerms: 'Specialized recruitment for director and coordinator level positions'
  }
];
