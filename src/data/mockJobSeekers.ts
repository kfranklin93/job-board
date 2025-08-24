import { UserProfile, JobType, UserRole } from '../types/data';

export const mockJobSeekers: UserProfile[] = [
  {
    id: '1',
    email: 'sarah.johnson@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '(555) 123-4567',
    role: UserRole.SEEKER,
    bio: 'Passionate early childhood educator with 5 years of experience creating engaging learning environments for children.',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-20T14:30:00Z',
    
    // Matching fields
    location: 'San Francisco, CA',
    jobTitle: 'Lead Preschool Teacher',
    skills: [
      'Early Childhood Development',
      'Curriculum Planning',
      'Classroom Management',
      'Child Safety',
      'Parent Communication',
      'Learning Assessment',
      'Creative Arts',
      'STEM Education'
    ],
    certifications: [
      'CPR Certified',
      'First Aid',
      'Early Childhood Education License',
      'Child Development Associate (CDA)'
    ],
    education: [
      {
        id: 'edu1',
        degree: 'Bachelor of Arts in Early Childhood Education',
        institution: 'San Francisco State University',
        location: 'San Francisco, CA',
        graduationYear: '2019'
      }
    ],
    experience: [
      {
        id: 'exp1',
        title: 'Lead Preschool Teacher',
        company: 'Little Stars Daycare',
        location: 'San Francisco, CA',
        startDate: '2020-08-01',
        endDate: '2024-08-01',
        description: 'Led a classroom of 15 children ages 3-5, developed creative curriculum, managed behavioral interventions',
        skills: ['Curriculum Development', 'Classroom Management', 'Parent Communication']
      },
      {
        id: 'exp2',
        title: 'Assistant Teacher',
        company: 'Bright Beginnings Preschool',
        location: 'San Francisco, CA',
        startDate: '2019-06-01',
        endDate: '2020-07-31',
        description: 'Supported lead teacher with daily activities, specialized in art and music programs',
        skills: ['Creative Arts', 'Music Education', 'Child Development']
      }
    ],
    yearsOfExperience: 5,
    minSalary: 55000,
    preferredJobTypes: [JobType.FULL_TIME, JobType.PART_TIME]
  },
  {
    id: '2',
    email: 'michael.chen@example.com',
    firstName: 'Michael',
    lastName: 'Chen',
    phone: '(555) 234-5678',
    role: UserRole.SEEKER,
    bio: 'Dedicated special education teacher with expertise in inclusive learning environments.',
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-08-18T11:45:00Z',
    
    location: 'Oakland, CA',
    jobTitle: 'Special Education Teacher',
    skills: [
      'Special Needs Education',
      'Individualized Education Plans (IEP)',
      'Behavioral Intervention',
      'Autism Spectrum Support',
      'Speech Therapy Support',
      'Adaptive Technology',
      'Family Counseling'
    ],
    certifications: [
      'Special Education Teaching License',
      'Applied Behavior Analysis (ABA)',
      'CPR Certified',
      'First Aid'
    ],
    education: [
      {
        id: 'edu2',
        degree: 'Master of Education in Special Education',
        institution: 'UC Berkeley',
        location: 'Berkeley, CA',
        graduationYear: '2020'
      },
      {
        id: 'edu3',
        degree: 'Bachelor of Science in Psychology',
        institution: 'UC Davis',
        location: 'Davis, CA',
        graduationYear: '2018'
      }
    ],
    experience: [
      {
        id: 'exp3',
        title: 'Special Education Teacher',
        company: 'Rainbow Kids Development Center',
        location: 'Oakland, CA',
        startDate: '2021-01-01',
        endDate: '2024-07-31',
        description: 'Developed and implemented IEPs for children with diverse learning needs',
        skills: ['IEP Development', 'Behavioral Intervention', 'Parent Training']
      }
    ],
    yearsOfExperience: 3,
    minSalary: 65000,
    preferredJobTypes: [JobType.FULL_TIME]
  },
  {
    id: '3',
    email: 'jessica.williams@example.com',
    firstName: 'Jessica',
    lastName: 'Williams',
    phone: '(555) 345-6789',
    role: UserRole.SEEKER,
    bio: 'Enthusiastic early childhood educator seeking opportunities to grow in the field.',
    createdAt: '2024-03-05T08:30:00Z',
    updatedAt: '2024-08-22T16:20:00Z',
    
    location: 'San Francisco, CA',
    jobTitle: 'Early Childhood Educator',
    skills: [
      'Child Development',
      'Play-Based Learning',
      'Basic First Aid',
      'Classroom Setup',
      'Activity Planning',
      'Storytelling',
      'Art and Crafts'
    ],
    certifications: [
      'CPR Certified',
      'Child Development Associate (CDA) - In Progress'
    ],
    education: [
      {
        id: 'edu4',
        degree: 'Associate Degree in Early Childhood Education',
        institution: 'City College of San Francisco',
        location: 'San Francisco, CA',
        graduationYear: '2022'
      }
    ],
    experience: [
      {
        id: 'exp4',
        title: 'Teacher Assistant',
        company: 'Happy Hearts Daycare',
        location: 'San Francisco, CA',
        startDate: '2022-09-01',
        endDate: '2024-08-15',
        description: 'Assisted lead teachers with daily activities, supervised children during meals and naptime',
        skills: ['Child Supervision', 'Activity Planning', 'Classroom Support']
      }
    ],
    yearsOfExperience: 2,
    minSalary: 45000,
    preferredJobTypes: [JobType.FULL_TIME, JobType.PART_TIME]
  },
  {
    id: '4',
    email: 'amanda.taylor@example.com',
    firstName: 'Amanda',
    lastName: 'Taylor',
    phone: '(555) 456-7890',
    role: UserRole.SEEKER,
    bio: 'Experienced childcare center director with strong leadership and administrative skills.',
    createdAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-08-19T13:15:00Z',
    
    location: 'Berkeley, CA',
    jobTitle: 'Childcare Center Director',
    skills: [
      'Program Administration',
      'Staff Management',
      'Budget Planning',
      'Regulatory Compliance',
      'Parent Relations',
      'Curriculum Oversight',
      'Quality Assurance',
      'Staff Training'
    ],
    certifications: [
      'Childcare Center Director License',
      'CPR Certified',
      'First Aid',
      'Food Safety Certificate'
    ],
    education: [
      {
        id: 'edu5',
        degree: 'Master of Business Administration',
        institution: 'UC Berkeley Haas School of Business',
        location: 'Berkeley, CA',
        graduationYear: '2015'
      },
      {
        id: 'edu6',
        degree: 'Bachelor of Arts in Child Development',
        institution: 'UC Davis',
        location: 'Davis, CA',
        graduationYear: '2012'
      }
    ],
    experience: [
      {
        id: 'exp5',
        title: 'Childcare Center Director',
        company: 'Growing Minds Learning Center',
        location: 'Berkeley, CA',
        startDate: '2018-03-01',
        endDate: '2024-06-30',
        description: 'Managed center operations for 120 children, oversaw 25 staff members, maintained licensing compliance',
        skills: ['Operations Management', 'Staff Leadership', 'Budget Management']
      },
      {
        id: 'exp6',
        title: 'Assistant Director',
        company: 'Sunshine Kids Academy',
        location: 'Oakland, CA',
        startDate: '2015-08-01',
        endDate: '2018-02-28',
        description: 'Supported center operations, managed enrollment and parent communications',
        skills: ['Administrative Support', 'Parent Communication', 'Enrollment Management']
      }
    ],
    yearsOfExperience: 8,
    minSalary: 80000,
    preferredJobTypes: [JobType.FULL_TIME]
  }
];

export default mockJobSeekers;
