import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, Card, CardHeader, CardBody, CardFooter, Input, TextArea} from '../../components/ui';
import { Job } from '../../types/data';
import { UserProfile } from '../../types/data';
import ProfilePictureUpload from '../../components/ui/ProfilePictureUpload';

interface JobApplicationModalProps {
  job: Job;
  userProfile: UserProfile;
  onClose: () => void;
  onSubmit: (formData: ApplicationFormData) => void;
}

export interface ApplicationFormData {
  jobId: string;
  coverLetter: string;
  profilePicture: File | null;
  profilePictureUrl: string;
  resume?: File;
  includeProfile: boolean;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  color: #718096;
  transition: color 0.2s ease-in-out;
  
  &:hover {
    color: #4a5568;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const JobInfoSection = styled.div`
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`;

const JobTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.5rem 0;
`;

const JobCompany = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const JobLocation = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const ProfileSection = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ProfileName = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
`;

const ProfileTitle = styled.div`
  font-size: 0.875rem;
  color: #4a5568;
`;

const JobApplicationModal = ({ job, userProfile, onClose, onSubmit }: JobApplicationModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    jobId: job.id,
    coverLetter: '',
    profilePicture: null,
    profilePictureUrl: userProfile.avatar || 'https://placehold.co/400?text=Upload+Photo',
    includeProfile: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
    } catch (error) {
      console.error('Error submitting application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePictureChange = (file: File | null, imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: file,
      profilePictureUrl: imageUrl
    }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resume: file }));
    }
  };

  return (
    <ModalOverlay>
      <ModalCard>
        {/* FIX: The <Form> now wraps the body and footer */}
        <Form onSubmit={handleSubmit}>
          <CardHeader>
            <ModalHeader>
              <h2>Apply for Job</h2>
              {/* Add type="button" to prevent this from submitting the form */}
              <CloseButton onClick={onClose} type="button">×</CloseButton>
            </ModalHeader>
          </CardHeader>
          
          <CardBody>
            <JobInfoSection>
              <JobTitle>{job.title}</JobTitle>
              <JobCompany>{job.organizationName}</JobCompany>
              <JobLocation>{job.location}</JobLocation>
            </JobInfoSection>
            
            <ProfileSection>
              <ProfilePictureUpload 
                initialImage={formData.profilePictureUrl}
                onImageChange={handleProfilePictureChange}
                size="small"
              />
              <ProfileInfo>
                <ProfileName>{userProfile.firstName} {userProfile.lastName}</ProfileName>
                <ProfileTitle>{userProfile.jobTitle || 'Job Seeker'}</ProfileTitle>
                <CheckboxGroup>
                  <input 
                    type="checkbox" 
                    id="includeProfile" 
                    checked={formData.includeProfile}
                    onChange={e => setFormData(prev => ({ ...prev, includeProfile: e.target.checked }))}
                  />
                  <label htmlFor="includeProfile">Include my profile with this application</label>
                </CheckboxGroup>
              </ProfileInfo>
            </ProfileSection>
            
            <FormGroup>
              <label htmlFor="resume">Resume</label>
              <Input 
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
              />
              <small>PDF, DOC, or DOCX up to 5MB</small>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="coverLetter">Cover Letter</label>
              <TextArea 
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => setFormData(prev => ({ ...prev, coverLetter: e.target.value }))}
                rows={6}
                placeholder="Introduce yourself and explain why you're a good fit..."
              />
            </FormGroup>
          </CardBody>
          
          <CardFooter>
            {/* Add type="button" to prevent this from submitting the form */}
            <Button variant="outline" onClick={onClose} disabled={isSubmitting} type="button">
              Cancel
            </Button>
            {/* FIX: This button now correctly submits the form it's inside of */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </CardFooter>
        </Form>
      </ModalCard>
    </ModalOverlay>
  );
};

export default JobApplicationModal;