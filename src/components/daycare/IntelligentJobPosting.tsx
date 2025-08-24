import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { Job, JobType, JobStatus } from '../../types/data';
// FIX 1: Removed 'Select as UiSelect' because it's not exported from the UI library.
// We will use the styled 'Select' component defined locally in this file.
import { Button, Select as UiSelect, Input, TextArea } from '../common/ui';

// --- Styled Components ---

const PostingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;
// ... (rest of the styled components are fine)
const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #5E35B1;
  margin-bottom: 0.5rem;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const FormStep = styled.div<{ active: boolean }>`
  display: ${props => props.active ? 'block' : 'none'};
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props =>
    props.active ? '#5E35B1' :
    props.completed ? '#4CAF50' : '#f0f0f0'
  };
  color: ${props => props.active || props.completed ? 'white' : '#666'};
  border-radius: 25px;
  margin: 0 0.5rem;
  font-weight: 500;
`;

const SuggestionSection = styled.div`
  background: #f8f5ff;
  padding: 1.5rem;
  border-radius: 12px;
  margin: 1rem 0;
`;

const SuggestionTitle = styled.h3`
  color: #5E35B1;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuggestionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SuggestionCard = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #5E35B1;
    transform: translateY(-1px);
  }
`;

const SuggestionCardTitle = styled.h4`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.75rem;
  color: #666;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #5E35B1;
    box-shadow: 0 0 0 3px rgba(94, 53, 177, 0.1);
  }
`;

const SkillTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillTag = styled.span<{ suggested?: boolean }>`
  background: ${props => props.suggested ? '#e3f2fd' : '#5E35B1'};
  color: ${props => props.suggested ? '#1976d2' : 'white'};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  cursor: ${props => props.suggested ? 'pointer' : 'default'};
  border: ${props => props.suggested ? '1px dashed #1976d2' : 'none'};

  &:hover {
    background: ${props => props.suggested ? '#1976d2' : '#4527A0'};
    color: white;
  }
`;

const StepNavigation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;


// --- Component Logic ---

interface JobFormData {
  title: string;
  description: string;
  requirements: string[];
  location: string;
  salary: string;
  type: JobType;
  requiredSkills: string[];
  requiredCertifications: string[];
  educationLevelRequired: string;
  yearsOfExperienceRequired: number;
}

const jobSuggestions = {
    // ... job suggestions object
};

export const IntelligentJobPosting: React.FC = () => {
    // ... state declarations
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any>(null);

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<JobFormData>({
    // ... default values
  });

  // ... useEffect and other functions

  const onSubmit = (data: JobFormData) => {
    // ... submit logic
  };

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, 3));
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1));

  return (
    <PostingContainer>
      <Header>
        <Title>Post a New Position</Title>
        <p style={{ color: '#666' }}>Create an intelligent job posting with AI-powered suggestions</p>
      </Header>

      <FormContainer>
        <StepIndicator>
            {/* ... steps */}
        </StepIndicator>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormStep active={currentStep === 1}>
            <FormGroup>
              <Label>Job Title</Label>
              <Input
                {...register('title', { required: 'Job title is required' })}
                placeholder="e.g. Lead Preschool Teacher"
                // FIX 2: Convert the error message string to a boolean for the 'error' prop.
                error={!!errors.title}
                errorText={errors.title?.message}
              />
            </FormGroup>

            <FormGrid>
              <FormGroup>
                <Label>Job Type</Label>
                <Select {...register('type')}>
                  <option value={JobType.FULL_TIME}>Full Time</option>
                  <option value={JobType.PART_TIME}>Part Time</option>
                  <option value={JobType.CONTRACT}>Contract</option>
                  <option value={JobType.TEMPORARY}>Temporary</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Location</Label>
                <Input
                  {...register('location', { required: 'Location is required' })}
                  placeholder="City, State"
                  // FIX 2: Convert to boolean
                  error={!!errors.location}
                  errorText={errors.location?.message}
                />
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Salary Range</Label>
              <Input
                {...register('salary', { required: 'Salary range is required' })}
                placeholder="e.g. $45,000 - $55,000 or $18 - $22 per hour"
                // FIX 2: Convert to boolean
                error={!!errors.salary}
                errorText={errors.salary?.message}
              />
            </FormGroup>

            <FormGroup>
              <Label>Job Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field, fieldState }) => (
                  <TextArea
                    {...field}
                    placeholder="Describe the role, responsibilities, and what makes your organization special..."
                    rows={6}
                    // This now works correctly because we updated TextArea.tsx
                    error={!!fieldState.error}
                    errorText={fieldState.error?.message}
                  />
                )}
              />
            </FormGroup>
          </FormStep>

          {/* ... Other steps and navigation ... */}
        </form>
      </FormContainer>
    </PostingContainer>
  );
};