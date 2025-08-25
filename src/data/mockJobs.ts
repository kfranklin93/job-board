// src/mockJobs.ts
import { Job, JobType, JobStatus } from '../types/data';

export const mockJobs: Job[] = [
  {
    id: 'job1',
    organizationId: 'org1',
    organizationName: 'Sunshine Learning Academy',
    title: 'Lead Preschool Teacher',
    description: 'We are seeking an experienced lead preschool teacher to join our team. The ideal candidate will have experience with curriculum development, classroom management, and creating engaging learning environments for children ages 3-5.',
    requirements: [
      'Bachelor\'s degree in Early Childhood Education or related field',
      'Minimum 3 years of teaching experience',
      'CPR and First Aid certification required',
      'Strong communication and organizational skills',
      'Experience with play-based learning approaches'
    ],
    location: 'San Francisco, CA',
    salary: '$55,000 - $65,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-15T09:00:00Z',
    applicantCount: 12,
    
    // Matching fields
    requiredSkills: [
      'Early Childhood Development',
      'Curriculum Planning',
      'Classroom Management',
      'Child Safety',
      'Parent Communication'
    ],
    requiredCertifications: [
      'CPR Certified',
      'First Aid',
      'Early Childhood Education License'
    ],
    educationLevelRequired: 'Bachelor',
    yearsOfExperienceRequired: 3,
    desiredJobType: JobType.FULL_TIME
  },
  {
    id: 'job2',
    organizationId: 'org2',
    organizationName: 'Rainbow Kids Development Center',
    title: 'Special Education Teacher',
    description: 'Join our inclusive team as a Special Education Teacher specializing in early childhood development. You will work with children with diverse learning needs and collaborate with families to create individualized education plans.',
    requirements: [
      'Master\'s degree in Special Education preferred',
      'Special Education teaching license',
      'Experience with IEP development and implementation',
      'Knowledge of Applied Behavior Analysis (ABA)',
      'Excellent communication skills with children and families'
    ],
    location: 'Oakland, CA',
    salary: '$65,000 - $75,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-18T10:30:00Z',
    applicantCount: 8,
    
    requiredSkills: [
      'Special Needs Education',
      'Individualized Education Plans (IEP)',
      'Behavioral Intervention',
      'Autism Spectrum Support',
      'Family Counseling'
    ],
    requiredCertifications: [
      'Special Education Teaching License',
      'Applied Behavior Analysis (ABA)',
      'CPR Certified'
    ],
    educationLevelRequired: 'Master',
    yearsOfExperienceRequired: 2,
    desiredJobType: JobType.FULL_TIME
  },
  {
    id: 'job3',
    organizationId: 'org1',
    organizationName: 'Sunshine Learning Academy',
    title: 'Assistant Teacher',
    description: 'Support our lead teachers in creating a nurturing learning environment. This entry-level position is perfect for someone passionate about early childhood education and looking to grow in the field.',
    requirements: [
      'Associate degree in Early Childhood Education or related field',
      'CPR and First Aid certification',
      'Enthusiasm for working with young children',
      'Reliable and punctual',
      'Willingness to learn and take direction'
    ],
    location: 'San Francisco, CA',
    salary: '$40,000 - $45,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-20T14:00:00Z',
    applicantCount: 15,
    
    requiredSkills: [
      'Child Development',
      'Classroom Support',
      'Activity Planning',
      'Child Safety'
    ],
    requiredCertifications: [
      'CPR Certified',
      'First Aid'
    ],
    educationLevelRequired: 'Associate',
    yearsOfExperienceRequired: 1,
    desiredJobType: JobType.FULL_TIME
  },
  {
    id: 'job4',
    organizationId: 'org3',
    organizationName: 'Little Explorers Daycare',
    title: 'Part-Time Infant Teacher',
    description: 'Care for infants and toddlers (6 months - 2 years) in a warm, nurturing environment. Perfect for someone seeking work-life balance with flexible scheduling options.',
    requirements: [
      'High school diploma minimum, early childhood coursework preferred',
      'Experience caring for infants and toddlers',
      'CPR and First Aid certification',
      'Patience and nurturing personality',
      'Available for morning or afternoon shifts'
    ],
    location: 'Daly City, CA',
    salary: '$18 - $22 per hour',
    type: JobType.PART_TIME,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-22T08:00:00Z',
    applicantCount: 6,
    
    requiredSkills: [
      'Infant Care',
      'Diaper Changing',
      'Feeding Support',
      'Sleep Routine Management'
    ],
    requiredCertifications: [
      'CPR Certified',
      'First Aid'
    ],
    educationLevelRequired: 'High School',
    yearsOfExperienceRequired: 0,
    desiredJobType: JobType.PART_TIME
  },
  {
    id: 'job5',
    organizationId: 'org4',
    organizationName: 'Creative Minds Learning Center',
    title: 'Center Director',
    description: 'Lead our team of educators and manage center operations. The ideal candidate will have strong leadership skills and experience in childcare administration.',
    requirements: [
      'Bachelor\'s degree in Early Childhood Education, Business, or related field',
      'Minimum 5 years of childcare management experience',
      'Childcare Center Director license',
      'Budget management and staff leadership experience',
      'Knowledge of licensing regulations and compliance'
    ],
    location: 'Berkeley, CA',
    salary: '$75,000 - $85,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-10T11:00:00Z',
    applicantCount: 4,
    
    requiredSkills: [
      'Program Administration',
      'Staff Management',
      'Budget Planning',
      'Regulatory Compliance',
      'Quality Assurance'
    ],
    requiredCertifications: [
      'Childcare Center Director License',
      'CPR Certified',
      'First Aid'
    ],
    educationLevelRequired: 'Bachelor',
    yearsOfExperienceRequired: 5,
    desiredJobType: JobType.FULL_TIME
  },
  {
    id: 'job6',
    organizationId: 'org5',
    organizationName: 'Happy Hearts Montessori',
    title: 'Montessori Teacher',
    description: 'Join our Montessori program and guide children through self-directed learning. Montessori certification required along with a passion for child-led education.',
    requirements: [
      'Bachelor\'s degree in Education or related field',
      'Montessori teaching certification (AMI or AMS)',
      'Experience with Montessori materials and philosophy',
      'Patience and observation skills',
      'Commitment to child-centered learning'
    ],
    location: 'Palo Alto, CA',
    salary: '$60,000 - $70,000',
    type: JobType.FULL_TIME,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-12T13:30:00Z',
    applicantCount: 7,
    
    requiredSkills: [
      'Montessori Philosophy',
      'Self-Directed Learning',
      'Child Observation',
      'Material Preparation',
      'Individual Instruction'
    ],
    requiredCertifications: [
      'Montessori Teaching Certification',
      'CPR Certified',
      'First Aid'
    ],
    educationLevelRequired: 'Bachelor',
    yearsOfExperienceRequired: 2,
    desiredJobType: JobType.FULL_TIME
  },
  {
    id: 'job7',
    organizationId: 'org6',
    organizationName: 'Bright Futures Academy',
    title: 'Substitute Teacher',
    description: 'Flexible substitute teaching position for various classrooms. Perfect for someone looking for part-time work with varied experiences across different age groups.',
    requirements: [
      'Some college coursework in Education or related field',
      'Flexibility and adaptability',
      'CPR and First Aid certification',
      'Ability to follow lesson plans',
      'Available on short notice'
    ],
    location: 'San Mateo, CA',
    salary: '$20 - $25 per hour',
    type: JobType.CONTRACT,
    status: JobStatus.ACTIVE,
    postedDate: '2024-08-19T16:00:00Z',
    applicantCount: 10,
    
    requiredSkills: [
      'Adaptability',
      'Classroom Management',
      'Following Instructions',
      'Child Supervision'
    ],
    requiredCertifications: [
      'CPR Certified',
      'First Aid'
    ],
    educationLevelRequired: 'High School',
    yearsOfExperienceRequired: 0,
    desiredJobType: JobType.CONTRACT
  }
];

export default mockJobs;
