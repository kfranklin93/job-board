// src/services/api/profileService.ts

import { UserProfile, Education, Experience } from '../../types/data';

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  location?: string;
  jobTitle?: string;
  skills?: string[];
  certifications?: string[];
  education?: Education[];
  experience?: Experience[];
  availability?: string;
  yearsOfExperience?: number;
  minSalary?: number;
}

export interface AvatarUploadResponse {
  success: boolean;
  avatarUrl?: string;
  error?: string;
}

class ProfileService {
  private baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  /**
   * Upload user avatar/profile picture
   */
  async uploadAvatar(imageData: Blob, userId: string): Promise<AvatarUploadResponse> {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append('avatar', imageData, 'avatar.jpg');
      formData.append('userId', userId);

      const response = await fetch(`${this.baseUrl}/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        avatarUrl: data.avatarUrl,
      };
    } catch (error) {
      console.error('Avatar upload failed:', error);
      
      // For demo purposes, simulate success with a placeholder
      return {
        success: true,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b9fd9c13?w=150&h=150&fit=crop&crop=face',
      };
      
      // Uncomment this for actual error handling:
      // return {
      //   success: false,
      //   error: error instanceof Error ? error.message : 'Upload failed',
      // };
    }
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const profile = await response.json();
      return profile;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      
      // For demo purposes, return mock data
      // In production, you would return null or throw the error
      return this.getMockProfile(userId);
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<UserProfile | null> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProfile = await response.json();
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      
      // For demo purposes, simulate success with merged data
      const currentProfile = await this.getProfile(userId);
      if (currentProfile) {
        return {
          ...currentProfile,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return null;
    }
  }

  /**
   * Delete user profile (for data privacy compliance)
   */
  async deleteProfile(userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/profile/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete profile:', error);
      return false;
    }
  }

  /**
   * Calculate profile completion percentage
   */
  calculateProfileCompletion(profile: UserProfile): { percentage: number; missingFields: string[] } {
    const requiredFields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'location', label: 'Location' },
      { key: 'bio', label: 'Professional Bio' },
      { key: 'jobTitle', label: 'Current Job Title' },
      { key: 'skills', label: 'Skills (at least 3)', validator: (val: any) => Array.isArray(val) && val.length >= 3 },
      { key: 'experience', label: 'Work Experience', validator: (val: any) => Array.isArray(val) && val.length >= 1 },
      { key: 'education', label: 'Education', validator: (val: any) => Array.isArray(val) && val.length >= 1 },
      { key: 'yearsOfExperience', label: 'Years of Experience' },
    ];

    const missingFields: string[] = [];
    let completedFields = 0;

    requiredFields.forEach(field => {
      const value = (profile as any)[field.key];
      const isComplete = field.validator 
        ? field.validator(value)
        : value !== undefined && value !== null && value !== '';
      
      if (isComplete) {
        completedFields++;
      } else {
        missingFields.push(field.label);
      }
    });

    const percentage = Math.round((completedFields / requiredFields.length) * 100);

    return { percentage, missingFields };
  }

  /**
   * Get authentication token from localStorage
   */
  private getAuthToken(): string {
    const user = localStorage.getItem('authUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.token || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  /**
   * Mock profile data for demo purposes
   */
  private getMockProfile(userId: string): UserProfile {
    return {
      id: userId,
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1-555-0123',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9fd9c13?w=150&h=150&fit=crop&crop=face',
      role: 'SEEKER' as any,
      bio: 'Passionate early childhood educator with experience in creating engaging learning environments.',
      // FIX: Changed 'null' to 'undefined' to match the type definition.
      resume: undefined,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
      location: 'San Francisco, CA',

      jobTitle: 'Early Childhood Educator',
      skills: ['Child Development', 'Classroom Management', 'Creative Arts', 'Communication'],
      certifications: ['CPR Certified', 'First Aid'],
      education: [{
        id: 'edu-1',
        degree: 'Bachelor of Arts in Early Childhood Education',
        institution: 'University of California',
        location: 'Berkeley, CA',
        graduationYear: '2020'
      }],
      experience: [{
        id: 'exp-1',
        title: 'Preschool Teacher',
        company: 'Little Stars Academy',
        location: 'San Francisco, CA',
        startDate: '2020-08',
        endDate: 'Present',
        description: 'Lead teacher for ages 3-5, developing curriculum and managing classroom of 15 children.',
        skills: ['Curriculum Development', 'Parent Communication', 'Behavior Management']
      }],
      availability: 'Full-time',
      yearsOfExperience: 4,
      minSalary: 45000,
      preferredJobTypes: ['FULL_TIME' as any],
    };
  }
}

export const profileService = new ProfileService();
export default profileService;
