// src/components/jobSeeker/JobSeekerProfileEdit.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, Experience, Education, JobType } from '../../types/data';
import { profileService, ProfileUpdateData } from '../../services/api/profileService';
import { Card, Input, TextArea, Button } from '../common/ui';
import ProfilePictureUpload from '../common/ui/ProfilePictureUpload';

const PageContainer = styled.div`
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const FormSection = styled(Card)`
  margin-bottom: 24px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const FieldGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 6px;
`;

const SkillsContainer = styled.div`
  margin-bottom: 16px;
`;

const SkillsInput = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const SkillTag = styled.span`
  background: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.primary.dark};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveSkillButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary.dark};
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error.main};
  }
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const ExperienceItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const DeleteButton = styled.button`
  background: ${({ theme }) => theme.colors.error.main};
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  
  &:hover {
    background: ${({ theme }) => theme.colors.error.dark};
  }
`;

const AddButton = styled(Button)`
  margin-top: 16px;
`;

const ActionBar = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  padding: 24px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.dark};
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const SuccessMessage = styled.div`
  background: ${({ theme }) => theme.colors.success.light};
  color: ${({ theme }) => theme.colors.success.dark};
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const JobSeekerProfileEdit: React.FC = () => {
  const { user, updateProfile: updateAuthProfile } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState<ProfileUpdateData>({});
  const [newSkill, setNewSkill] = useState('');
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const profileData = await profileService.getProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          bio: profileData.bio,
          location: profileData.location,
          jobTitle: profileData.jobTitle,
          skills: profileData.skills || [],
          certifications: profileData.certifications || [],
          education: profileData.education || [],
          experience: profileData.experience || [],
          availability: profileData.availability,
          yearsOfExperience: profileData.yearsOfExperience,
          minSalary: profileData.minSalary,
        });
      }
    } catch (err) {
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileUpdateData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
    setSuccessMessage(null);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      handleInputChange('skills', [...(formData.skills || []), newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    handleInputChange('skills', formData.skills?.filter(skill => skill !== skillToRemove) || []);
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !formData.certifications?.includes(newCertification.trim())) {
      handleInputChange('certifications', [...(formData.certifications || []), newCertification.trim()]);
      setNewCertification('');
    }
  };

  const handleRemoveCertification = (certToRemove: string) => {
    handleInputChange('certifications', formData.certifications?.filter(cert => cert !== certToRemove) || []);
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      skills: []
    };
    handleInputChange('experience', [...(formData.experience || []), newExp]);
  };

  const handleUpdateExperience = (index: number, field: keyof Experience, value: string) => {
    const updatedExp = [...(formData.experience || [])];
    updatedExp[index] = { ...updatedExp[index], [field]: value };
    handleInputChange('experience', updatedExp);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExp = [...(formData.experience || [])];
    updatedExp.splice(index, 1);
    handleInputChange('experience', updatedExp);
  };

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      graduationYear: ''
    };
    handleInputChange('education', [...(formData.education || []), newEdu]);
  };

  const handleUpdateEducation = (index: number, field: keyof Education, value: string) => {
    const updatedEdu = [...(formData.education || [])];
    updatedEdu[index] = { ...updatedEdu[index], [field]: value };
    handleInputChange('education', updatedEdu);
  };

  const handleRemoveEducation = (index: number) => {
    const updatedEdu = [...(formData.education || [])];
    updatedEdu.splice(index, 1);
    handleInputChange('education', updatedEdu);
  };

  const handleAvatarChange = async (file: File | null, imageUrl: string) => {
    if (!file || !user?.id) return;

    try {
      const result = await profileService.uploadAvatar(file, user.id);
      if (result.success && result.avatarUrl) {
        // Update the profile with new avatar URL
        if (profile) {
          const updatedProfile = { ...profile, avatar: result.avatarUrl };
          setProfile(updatedProfile);
          updateAuthProfile(updatedProfile);
          setSuccessMessage('Profile picture updated successfully!');
        }
      } else {
        setError(result.error || 'Failed to upload profile picture');
      }
    } catch (err) {
      setError('Failed to upload profile picture');
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      setError(null);

      const updatedProfile = await profileService.updateProfile(user.id, formData);
      if (updatedProfile) {
        // Update auth context with the full updated profile
        updateAuthProfile(updatedProfile);
        
        setProfile(updatedProfile);
        setSuccessMessage('Profile updated successfully!');
        
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>Loading profile...</LoadingSpinner>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <ErrorMessage>Failed to load profile data.</ErrorMessage>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Edit Profile</Title>
        <Subtitle>Keep your profile up to date to get better job matches</Subtitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      {/* Profile Picture Section */}
      <FormSection>
        <SectionTitle>Profile Picture</SectionTitle>
        <ProfilePictureUpload
          initialImage={profile.avatar}
          onImageChange={handleAvatarChange}
          size="large"
        />
      </FormSection>

      {/* Basic Information */}
      <FormSection>
        <SectionTitle>Basic Information</SectionTitle>
        <FormGrid>
          <FieldGroup>
            <Label>First Name</Label>
            <Input
              type="text"
              value={formData.firstName || ''}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Enter your first name"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Last Name</Label>
            <Input
              type="text"
              value={formData.lastName || ''}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Enter your last name"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Location</Label>
            <Input
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Current Job Title</Label>
            <Input
              type="text"
              value={formData.jobTitle || ''}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              placeholder="e.g., Early Childhood Educator"
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Years of Experience</Label>
            <Input
              type="number"
              min="0"
              max="50"
              value={formData.yearsOfExperience || ''}
              onChange={(e) => handleInputChange('yearsOfExperience', parseInt(e.target.value) || 0)}
              placeholder="0"
            />
          </FieldGroup>
          <FullWidthField>
            <FieldGroup>
              <Label>Professional Bio</Label>
              <TextArea
                value={formData.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself, your experience, and what makes you passionate about early childhood education..."
                rows={4}
              />
            </FieldGroup>
          </FullWidthField>
        </FormGrid>
      </FormSection>

      {/* Skills */}
      <FormSection>
        <SectionTitle>Skills</SectionTitle>
        <SkillsContainer>
          <SkillsInput>
            <Input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
            />
            <Button type="button" onClick={handleAddSkill}>Add</Button>
          </SkillsInput>
          <SkillsList>
            {formData.skills?.map((skill, index) => (
              <SkillTag key={index}>
                {skill}
                <RemoveSkillButton onClick={() => handleRemoveSkill(skill)}>×</RemoveSkillButton>
              </SkillTag>
            ))}
          </SkillsList>
        </SkillsContainer>

        <SkillsContainer>
          <Label>Certifications</Label>
          <SkillsInput>
            <Input
              type="text"
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="Add a certification..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCertification())}
            />
            <Button type="button" onClick={handleAddCertification}>Add</Button>
          </SkillsInput>
          <SkillsList>
            {formData.certifications?.map((cert, index) => (
              <SkillTag key={index}>
                {cert}
                <RemoveSkillButton onClick={() => handleRemoveCertification(cert)}>×</RemoveSkillButton>
              </SkillTag>
            ))}
          </SkillsList>
        </SkillsContainer>
      </FormSection>

      {/* Work Experience */}
      <FormSection>
        <SectionTitle>Work Experience</SectionTitle>
        {formData.experience?.map((exp, index) => (
          <ExperienceItem key={exp.id}>
            <ExperienceHeader>
              <h4>Experience {index + 1}</h4>
              <DeleteButton onClick={() => handleRemoveExperience(index)}>Delete</DeleteButton>
            </ExperienceHeader>
            <FormGrid>
              <FieldGroup>
                <Label>Job Title</Label>
                <Input
                  type="text"
                  value={exp.title}
                  onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                  placeholder="e.g., Preschool Teacher"
                />
              </FieldGroup>
              <FieldGroup>
                <Label>Company</Label>
                <Input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                  placeholder="e.g., ABC Daycare Center"
                />
              </FieldGroup>
              <FieldGroup>
                <Label>Start Date</Label>
                <Input
                  type="text"
                  value={exp.startDate}
                  onChange={(e) => handleUpdateExperience(index, 'startDate', e.target.value)}
                  placeholder="e.g., January 2022"
                />
              </FieldGroup>
              <FieldGroup>
                <Label>End Date</Label>
                <Input
                  type="text"
                  value={exp.endDate}
                  onChange={(e) => handleUpdateExperience(index, 'endDate', e.target.value)}
                  placeholder="e.g., Present"
                />
              </FieldGroup>
              <FullWidthField>
                <FieldGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={exp.description || ''}
                    onChange={(e) => handleUpdateExperience(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    rows={3}
                  />
                </FieldGroup>
              </FullWidthField>
            </FormGrid>
          </ExperienceItem>
        ))}
        <AddButton type="button" onClick={handleAddExperience} variant="secondary">
          Add Experience
        </AddButton>
      </FormSection>

      {/* Education */}
      <FormSection>
        <SectionTitle>Education</SectionTitle>
        {formData.education?.map((edu, index) => (
          <ExperienceItem key={edu.id}>
            <ExperienceHeader>
              <h4>Education {index + 1}</h4>
              <DeleteButton onClick={() => handleRemoveEducation(index)}>Delete</DeleteButton>
            </ExperienceHeader>
            <FormGrid>
              <FieldGroup>
                <Label>Degree</Label>
                <Input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                  placeholder="e.g., Bachelor of Arts in Early Childhood Education"
                />
              </FieldGroup>
              <FieldGroup>
                <Label>Institution</Label>
                <Input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => handleUpdateEducation(index, 'institution', e.target.value)}
                  placeholder="e.g., University of California"
                />
              </FieldGroup>
              <FieldGroup>
                <Label>Graduation Year</Label>
                <Input
                  type="text"
                  value={edu.graduationYear}
                  onChange={(e) => handleUpdateEducation(index, 'graduationYear', e.target.value)}
                  placeholder="e.g., 2020"
                />
              </FieldGroup>
              <FieldGroup>
                <Label>Location</Label>
                <Input
                  type="text"
                  value={edu.location || ''}
                  onChange={(e) => handleUpdateEducation(index, 'location', e.target.value)}
                  placeholder="e.g., Berkeley, CA"
                />
              </FieldGroup>
            </FormGrid>
          </ExperienceItem>
        ))}
        <AddButton type="button" onClick={handleAddEducation} variant="secondary">
          Add Education
        </AddButton>
      </FormSection>

      <ActionBar>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </ActionBar>
    </PageContainer>
  );
};

export default JobSeekerProfileEdit;
