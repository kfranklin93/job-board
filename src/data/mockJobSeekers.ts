import { UserRole, UserProfile, JobType } from '../types/data';

export const mockJobSeekers: UserProfile[] = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Experienced childcare professional with over 5 years working in early childhood education. Passionate about child development and creating engaging learning environments.',
    jobTitle: 'Lead Preschool Teacher',
    avatar: 'https://placehold.co/400?text=SJ',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Lead Preschool Teacher',
        company: 'Sunshine Daycare Center',
        location: 'San Francisco, CA',
        startDate: 'Jan 2022',
        endDate: 'Present',
        description: 'Developed and implemented age-appropriate curriculum for preschoolers. Maintained a safe and engaging classroom environment. Communicated effectively with parents and colleagues.'
      },
      {
        id: '2',
        title: 'Assistant Teacher',
        company: 'Little Stars Childcare',
        location: 'Oakland, CA',
        startDate: 'Mar 2020',
        endDate: 'Dec 2021',
        description: 'Assisted lead teachers with daily activities and lessons. Supervised children during indoor and outdoor play. Helped maintain classroom cleanliness and organization.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Arts in Early Childhood Education',
        institution: 'San Francisco State University',
        location: 'San Francisco, CA',
        graduationYear: '2020'
      }
    ],
    skills: ['Curriculum Development', 'Child Development', 'Classroom Management', 'Communication', 'First Aid & CPR', 'Activity Planning', 'Parent Relations'],
    certifications: ['Early Childhood Education License', 'CPR & First Aid Certification', 'Child Development Associate (CDA)'],
    createdAt: new Date('2025-01-15').toISOString(),
    updatedAt: new Date('2025-07-20').toISOString(),
    availability: 'Full-time',
    preferredJobTypes: [JobType.FULL_TIME],
    minSalary: 50000,
    yearsOfExperience: 5
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    email: 'michael.rodriguez@example.com',
    phone: '(555) 234-5678',
    location: 'Oakland, CA',
    bio: 'Dedicated childcare professional with 3 years of experience working with infants and toddlers. Strong background in child development and passionate about creating nurturing environments for young children.',
    jobTitle: 'Infant and Toddler Specialist',
    avatar: 'https://placehold.co/400?text=MR',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Infant Caregiver',
        company: 'Little Stars Childcare',
        location: 'Oakland, CA',
        startDate: 'Jun 2023',
        endDate: 'Present',
        description: 'Provided attentive care for infants aged 3-12 months. Created stimulating activities to promote sensory development. Maintained detailed records of feeding, sleeping, and developmental milestones.'
      },
      {
        id: '2',
        title: 'Nanny',
        company: 'Private Family',
        location: 'Berkeley, CA',
        startDate: 'Sep 2022',
        endDate: 'May 2023',
        description: 'Cared for twin infants from 3 months to 15 months of age. Established consistent routines and introduced age-appropriate developmental activities.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Associate of Arts in Child Development',
        institution: 'Laney College',
        location: 'Oakland, CA',
        graduationYear: '2022'
      }
    ],
    skills: ['Infant Care', 'Toddler Development', 'Bottle Feeding', 'Diapering', 'Safe Sleep Practices', 'Sensory Activities', 'Developmental Milestones'],
    certifications: ['Infant CPR & First Aid', 'Safe Sleep Certification', 'Child Development Associate (CDA)'],
    createdAt: new Date('2025-02-10').toISOString(),
    updatedAt: new Date('2025-08-01').toISOString(),
    availability: 'Full-time, Part-time',
    preferredJobTypes: [JobType.FULL_TIME, JobType.PART_TIME],
    minSalary: 40000,
    yearsOfExperience: 3
  },
  {
    id: '3',
    firstName: 'Jessica',
    lastName: 'Williams',
    email: 'jessica.williams@example.com',
    phone: '(555) 345-6789',
    location: 'San Francisco, CA',
    bio: 'Recent graduate with a Master\'s in Early Childhood Education seeking to leverage my education and student teaching experience. Passionate about creating inclusive learning environments and implementing progressive educational approaches.',
    jobTitle: 'Early Childhood Educator',
    avatar: 'https://placehold.co/400?text=JW',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Student Teacher',
        company: 'Bright Horizons Preschool',
        location: 'San Francisco, CA',
        startDate: 'Sep 2024',
        endDate: 'May 2025',
        description: 'Completed practicum hours under mentor teacher supervision. Planned and implemented curriculum for preschool children. Participated in parent-teacher conferences and staff meetings.'
      },
      {
        id: '2',
        title: 'Classroom Aide',
        company: 'San Francisco Unified School District',
        location: 'San Francisco, CA',
        startDate: 'Jan 2023',
        endDate: 'Jun 2024',
        description: 'Supported lead teachers in kindergarten classrooms. Assisted with small group instruction and classroom management. Prepared materials for classroom activities.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Master of Arts in Early Childhood Education',
        institution: 'San Francisco State University',
        location: 'San Francisco, CA',
        graduationYear: '2025'
      },
      {
        id: '2',
        degree: 'Bachelor of Arts in Psychology',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        graduationYear: '2023'
      }
    ],
    skills: ['Curriculum Planning', 'Reggio Emilia Approach', 'Documentation', 'Emergent Curriculum', 'Project-Based Learning', 'Family Engagement', 'Assessment'],
    certifications: ['California Teaching Credential', 'CPR & First Aid Certification'],
    createdAt: new Date('2025-05-15').toISOString(),
    updatedAt: new Date('2025-08-05').toISOString(),
    availability: 'Full-time',
    preferredJobTypes: [JobType.FULL_TIME],
    minSalary: 45000,
    yearsOfExperience: 2
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@example.com',
    phone: '(555) 456-7890',
    location: 'San Jose, CA',
    bio: 'Creative and energetic after-school program leader with 4 years of experience working with elementary and middle school students. Skilled in developing engaging educational activities that balance learning and fun.',
    jobTitle: 'After-School Program Coordinator',
    avatar: 'https://placehold.co/400?text=DC',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'After-School Program Leader',
        company: 'YMCA of Silicon Valley',
        location: 'San Jose, CA',
        startDate: 'Aug 2022',
        endDate: 'Present',
        description: 'Planned and led daily activities for school-age children. Developed special interest clubs in science, art, and coding. Maintained positive relationships with school staff and parents.'
      },
      {
        id: '2',
        title: 'Summer Camp Counselor',
        company: 'Camp Galileo',
        location: 'Palo Alto, CA',
        startDate: 'Jun 2021',
        endDate: 'Aug 2022',
        description: 'Led STEAM-focused activities for campers aged 7-12. Managed group dynamics and ensured camper safety. Created innovative projects combining art, science, and outdoor education.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Bachelor of Science in Recreation Administration',
        institution: 'San Jose State University',
        location: 'San Jose, CA',
        graduationYear: '2021'
      }
    ],
    skills: ['Program Planning', 'Behavior Management', 'STEM Activities', 'Group Leadership', 'Conflict Resolution', 'Team Building', 'Educational Games'],
    certifications: ['Youth Development Professional Certification', 'CPR & First Aid', 'Positive Discipline Certification'],
    createdAt: new Date('2025-03-20').toISOString(),
    updatedAt: new Date('2025-07-15').toISOString(),
    availability: 'Part-time, Afternoons',
    preferredJobTypes: [JobType.PART_TIME],
    minSalary: 25000,
    yearsOfExperience: 4
  },
  {
    id: '5',
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'amanda.taylor@example.com',
    phone: '(555) 567-8901',
    location: 'Berkeley, CA',
    bio: 'Experienced childcare director with 8 years in the field, including 4 years in management positions. Strong background in program development, staff training, and regulatory compliance. Passionate about creating high-quality educational programs for young children.',
    jobTitle: 'Childcare Center Director',
    avatar: 'https://placehold.co/400?text=AT',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Assistant Director',
        company: 'KinderCare Learning Center',
        location: 'Berkeley, CA',
        startDate: 'Jul 2022',
        endDate: 'Present',
        description: 'Assisted in managing daily operations of a center serving 90 children. Supervised and mentored a team of 15 teachers. Ensured compliance with licensing regulations and quality standards.'
      },
      {
        id: '2',
        title: 'Program Coordinator',
        company: 'Bright Horizons Family Solutions',
        location: 'Oakland, CA',
        startDate: 'May 2021',
        endDate: 'Jun 2022',
        description: 'Oversaw curriculum implementation across multiple classrooms. Coordinated family engagement activities and special events. Conducted teacher observations and provided coaching.'
      },
      {
        id: '3',
        title: 'Lead Teacher',
        company: 'Primrose School',
        location: 'Walnut Creek, CA',
        startDate: 'Aug 2017',
        endDate: 'Apr 2021',
        description: 'Led a preschool classroom of 16 children. Developed and implemented curriculum aligned with school philosophy. Mentored assistant teachers and student teachers.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Master of Education in Educational Leadership',
        institution: 'Mills College',
        location: 'Oakland, CA',
        graduationYear: '2021'
      },
      {
        id: '2',
        degree: 'Bachelor of Arts in Child Development',
        institution: 'California State University, East Bay',
        location: 'Hayward, CA',
        graduationYear: '2017'
      }
    ],
    skills: ['Program Administration', 'Staff Supervision', 'Budget Management', 'Regulatory Compliance', 'Family Engagement', 'Curriculum Development', 'Quality Assessment', 'Leadership'],
    certifications: ['Program Administrator Credential', 'Child Development Program Director Permit', 'CPR & First Aid Instructor Certification'],
    createdAt: new Date('2025-01-05').toISOString(),
    updatedAt: new Date('2025-07-25').toISOString(),
    availability: 'Full-time',
    preferredJobTypes: [JobType.FULL_TIME],
    minSalary: 70000,
    yearsOfExperience: 8
  },
  {
    id: '6',
    firstName: 'Robert',
    lastName: 'Jackson',
    email: 'robert.jackson@example.com',
    phone: '(555) 678-9012',
    location: 'Oakland, CA',
    bio: 'Experienced special education teacher with 6 years focused on early childhood. Expertise in working with children with autism spectrum disorders, ADHD, and developmental delays. Passionate about inclusive education and individualized learning approaches.',
    jobTitle: 'Early Childhood Special Education Teacher',
    avatar: 'https://placehold.co/400?text=RJ',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Special Education Teacher',
        company: 'Oakland Unified School District',
        location: 'Oakland, CA',
        startDate: 'Aug 2022',
        endDate: 'Present',
        description: 'Taught in an inclusive preschool classroom serving children with diverse needs. Developed and implemented IEPs for students with various disabilities. Collaborated with therapists and families to support student progress.'
      },
      {
        id: '2',
        title: 'Early Intervention Specialist',
        company: 'Regional Center of the East Bay',
        location: 'San Leandro, CA',
        startDate: 'Jun 2020',
        endDate: 'Jul 2022',
        description: 'Provided home-based services to children from birth to age 3 with developmental delays. Coached parents on implementing strategies to support child development. Coordinated with service providers to ensure comprehensive care.'
      },
      {
        id: '3',
        title: 'Behavioral Therapist',
        company: 'Autism Learning Partners',
        location: 'Berkeley, CA',
        startDate: 'Sep 2019',
        endDate: 'May 2020',
        description: 'Implemented ABA therapy for children with autism. Collected and analyzed data on behavioral objectives. Collaborated with supervisors to modify treatment plans.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Master of Arts in Special Education',
        institution: 'San Francisco State University',
        location: 'San Francisco, CA',
        graduationYear: '2019'
      },
      {
        id: '2',
        degree: 'Bachelor of Science in Psychology',
        institution: 'University of California, Davis',
        location: 'Davis, CA',
        graduationYear: '2017'
      }
    ],
    skills: ['IEP Development', 'Behavior Management', 'Assistive Technology', 'Inclusive Education', 'Differentiated Instruction', 'Applied Behavior Analysis', 'Parent Coaching', 'Sensory Integration'],
    certifications: ['Education Specialist Credential', 'Board Certified Behavior Analyst (BCBA)', 'Picture Exchange Communication System (PECS) Certification'],
    createdAt: new Date('2025-02-15').toISOString(),
    updatedAt: new Date('2025-08-01').toISOString(),
    availability: 'Full-time',
    preferredJobTypes: [JobType.FULL_TIME],
    minSalary: 60000,
    yearsOfExperience: 6
  },
  {
    id: '7',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@example.com',
    phone: '(555) 789-0123',
    location: 'San Mateo, CA',
    bio: 'Creative and organized curriculum specialist with 5 years of experience in early childhood education. Passionate about developing innovative, developmentally appropriate curriculum that engages children and supports holistic development.',
    jobTitle: 'Early Childhood Curriculum Specialist',
    avatar: 'https://placehold.co/400?text=SM',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Education Coordinator',
        company: 'Peninsula Family Service',
        location: 'San Mateo, CA',
        startDate: 'Jun 2023',
        endDate: 'Present',
        description: 'Oversaw curriculum implementation across 5 childcare centers. Provided coaching and professional development for teaching staff. Evaluated program quality and identified areas for improvement.'
      },
      {
        id: '2',
        title: 'Lead Teacher',
        company: 'Montessori School of San Mateo',
        location: 'San Mateo, CA',
        startDate: 'Aug 2020',
        endDate: 'May 2023',
        description: 'Led a mixed-age classroom of children aged 3-6. Implemented Montessori curriculum and philosophy. Mentored assistant teachers and communicated regularly with families.'
      },
      {
        id: '3',
        title: 'Teacher',
        company: 'Bright Horizons Family Solutions',
        location: 'Redwood City, CA',
        startDate: 'Sep 2018',
        endDate: 'Jul 2020',
        description: 'Taught in a preschool classroom serving children aged 3-5. Planned and implemented emergent curriculum based on children\'s interests. Documented children\'s learning through portfolios and learning stories.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Master of Arts in Education, Curriculum and Instruction',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        graduationYear: '2023'
      },
      {
        id: '2',
        degree: 'Bachelor of Arts in Child and Adolescent Development',
        institution: 'San Francisco State University',
        location: 'San Francisco, CA',
        graduationYear: '2018'
      }
    ],
    skills: ['Curriculum Design', 'Teacher Coaching', 'Documentation', 'Assessment', 'Emergent Curriculum', 'Project Approach', 'Professional Development', 'Program Evaluation'],
    certifications: ['Montessori Teacher Certification (AMI)', 'Program for Infant/Toddler Care (PITC) Certification', 'Early Childhood Environment Rating Scale (ECERS) Assessor'],
    createdAt: new Date('2025-04-10').toISOString(),
    updatedAt: new Date('2025-07-30').toISOString(),
    availability: 'Full-time',
    preferredJobTypes: [JobType.FULL_TIME],
    minSalary: 58000,
    yearsOfExperience: 5
  },
  {
    id: '8',
    firstName: 'Emily',
    lastName: 'Nguyen',
    email: 'emily.nguyen@example.com',
    phone: '(555) 890-1234',
    location: 'San Francisco, CA',
    bio: 'Reliable and adaptable substitute teacher with 2 years of experience in early childhood settings. Comfortable working with all age groups and quickly adapting to different classroom routines and expectations.',
    jobTitle: 'Early Childhood Substitute Teacher',
    avatar: 'https://placehold.co/400?text=EN',
    role: UserRole.SEEKER,
    experience: [
      {
        id: '1',
        title: 'Substitute Teacher',
        company: 'Wu Yee Children\'s Services',
        location: 'San Francisco, CA',
        startDate: 'Sep 2023',
        endDate: 'Present',
        description: 'Provided on-call coverage for teachers across multiple centers. Implemented existing lesson plans and maintained classroom routines. Adapted to various age groups from infants to preschoolers.'
      },
      {
        id: '2',
        title: 'After-School Program Assistant',
        company: 'San Francisco Unified School District',
        location: 'San Francisco, CA',
        startDate: 'Jan 2023',
        endDate: 'Present',
        description: 'Assisted with after-school programs for elementary school students. Led small group activities and homework help. Maintained a safe and engaging environment for students.'
      }
    ],
    education: [
      {
        id: '1',
        degree: 'Associate of Science in Early Childhood Education',
        institution: 'City College of San Francisco',
        location: 'San Francisco, CA',
        graduationYear: '2023'
      }
    ],
    skills: ['Adaptability', 'Classroom Management', 'Following Lesson Plans', 'Transitions', 'Flexibility', 'Quick Learning', 'Positive Guidance'],
    certifications: ['CPR & First Aid Certification', '12 ECE Units Completed'],
    createdAt: new Date('2025-05-20').toISOString(),
    updatedAt: new Date('2025-08-10').toISOString(),
    availability: 'Part-time, Flexible',
    preferredJobTypes: [JobType.PART_TIME, JobType.CONTRACT],
    minSalary: 20000,
    yearsOfExperience: 2
  }
];