// Core daycare domain types

export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  ageGroup: AgeGroup;
  enrollmentDate: string;
  status: ChildStatus;
  allergies: string[];
  medicalNotes: string;
  emergencyContact: Contact;
  parents: Parent[];
  profilePicture?: string;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  relationship: 'mother' | 'father' | 'guardian';
  contact: Contact;
  isEmergencyContact: boolean;
}

export interface Contact {
  phone: string;
  email: string;
  address: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: StaffRole;
  email: string;
  phone: string;
  hireDate: string;
  status: StaffStatus;
  qualifications: string[];
  ageGroupsSupervised: AgeGroup[];
  profilePicture?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  staffAssigned: string[]; // Staff IDs
  materials: string[];
  category: ActivityCategory;
  capacity: number;
  enrolledChildren: string[]; // Child IDs
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string; // Staff ID
  createdAt: string;
  priority: AnnouncementPriority;
  targetAudience: AnnouncementAudience;
  expiresAt?: string;
}

export interface Schedule {
  id: string;
  staffId: string;
  date: string;
  startTime: string;
  endTime: string;
  ageGroup?: AgeGroup;
  role: string;
  status: ScheduleStatus;
}

// Enums and Union Types
export type AgeGroup = 'infants' | 'toddlers' | 'preschool' | 'kindergarten';

export type ChildStatus = 'active' | 'inactive' | 'graduated' | 'waitlist';

export type StaffRole = 'director' | 'lead_teacher' | 'assistant_teacher' | 'aide' | 'substitute';

export type StaffStatus = 'active' | 'inactive' | 'on_leave';

export type ActivityCategory = 'educational' | 'physical' | 'creative' | 'social' | 'outdoor' | 'meal';

export type AnnouncementPriority = 'low' | 'medium' | 'high' | 'urgent';

export type AnnouncementAudience = 'all' | 'parents' | 'staff' | 'specific_age_group';

export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

// Dashboard metrics
export interface DashboardMetrics {
  totalChildren: number;
  totalStaff: number;
  staffOnDuty: number;
  todaysActivities: number;
  attendanceRate: number;
  ageGroupDistribution: Record<AgeGroup, number>;
}

// Form types
export interface ChildFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  allergies: string[];
  medicalNotes: string;
  emergencyContact: Contact;
  parents: Parent[];
}

export interface StaffFormData {
  firstName: string;
  lastName: string;
  role: StaffRole;
  email: string;
  phone: string;
  qualifications: string[];
  ageGroupsSupervised: AgeGroup[];
}

export interface ActivityFormData {
  title: string;
  description: string;
  ageGroups: AgeGroup[];
  startTime: string;
  endTime: string;
  date: string;
  location: string;
  materials: string[];
  category: ActivityCategory;
  capacity: number;
}
