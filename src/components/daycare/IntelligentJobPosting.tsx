import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Job, JobType, JobStatus } from '../../types/data';
import { Button, Input, TextArea } from '../common/ui';

const PostingContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

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

// Job title suggestions with auto-fill data
const jobSuggestions = {
  'preschool teacher': {
    skills: ['Early Childhood Development', 'Curriculum Planning', 'Classroom Management', 'Child Safety'],
    certifications: ['CPR Certified', 'First Aid', 'Early Childhood Education License'],
    requirements: [
      'Bachelor\'s degree in Early Childhood Education or related field',
      'Minimum 2 years of teaching experience',
      'CPR and First Aid certification required',
      'Strong communication and organizational skills'
    ]
  },
  'special education teacher': {
    skills: ['Special Needs Education', 'IEP Development', 'Behavioral Intervention', 'Autism Support'],
    certifications: ['Special Education License', 'Applied Behavior Analysis (ABA)', 'CPR Certified'],
    requirements: [
      'Master\'s degree in Special Education preferred',
      'Special Education teaching license required',
      'Experience with IEP development and implementation',
      'Knowledge of Applied Behavior Analysis (ABA)'
    ]
  },
  'center director': {
    skills: ['Program Administration', 'Staff Management', 'Budget Planning', 'Regulatory Compliance'],
    certifications: ['Childcare Center Director License', 'CPR Certified', 'Food Safety Certificate'],
    requirements: [
      'Bachelor\'s degree in Early Childhood Education, Business, or related field',
      'Minimum 5 years of childcare management experience',
      'Childcare Center Director license required',
      'Budget management and staff leadership experience'
    ]
  }
};

export const IntelligentJobPosting: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<any>(null);
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<JobFormData>({
    defaultValues: {
      type: JobType.FULL_TIME,
      yearsOfExperienceRequired: 1
    }
  });

  const watchedTitle = watch('title');

  // Auto-suggest based on job title
  useEffect(() => {
    if (watchedTitle) {
      const normalizedTitle = watchedTitle.toLowerCase();
      const matchedSuggestion = Object.entries(jobSuggestions).find(([key]) => 
        normalizedTitle.includes(key)
      );
      
      if (matchedSuggestion) {
        setSuggestions(matchedSuggestion[1]);
      } else {
        setSuggestions(null);
      }
    }
  }, [watchedTitle]);

  const applySuggestions = (type: 'skills' | 'certifications' | 'requirements') => {
    if (!suggestions) return;
    
    if (type === 'skills') {
      setSelectedSkills(suggestions.skills);
    } else if (type === 'certifications') {
      setSelectedCertifications(suggestions.certifications);
    } else if (type === 'requirements') {
      setValue('requirements', suggestions.requirements);
    }
  };

  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const addCertification = (cert: string) => {
    if (!selectedCertifications.includes(cert)) {
      setSelectedCertifications([...selectedCertifications, cert]);
    }
  };

  const onSubmit = (data: JobFormData) => {
    const jobData = {
      ...data,
      requiredSkills: selectedSkills,
      requiredCertifications: selectedCertifications,
      id: `job_${Date.now()}`,
      organizationId: 'current_org',
      organizationName: 'Your Organization',
      status: JobStatus.ACTIVE,
      postedDate: new Date().toISOString(),
      applicantCount: 0
    };
    
    console.log('Creating job posting:', jobData);
    alert('Job posted successfully!');
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <PostingContainer>
      <Header>
        <Title>Post a New Position</Title>
        <p style={{ color: '#666' }}>Create an intelligent job posting with AI-powered suggestions</p>
      </Header>

      <FormContainer>
        <StepIndicator>
          <Step active={currentStep === 1} completed={currentStep > 1}>
            1. Job Details
          </Step>
          <Step active={currentStep === 2} completed={currentStep > 2}>
            2. Requirements
          </Step>
          <Step active={currentStep === 3} completed={false}>
            3. Review & Post
          </Step>
        </StepIndicator>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Step 1: Basic Job Information */}
          <FormStep active={currentStep === 1}>
            <FormGroup>
              <Label>Job Title</Label>
              <Input
                {...register('title', { required: 'Job title is required' })}
                placeholder="e.g. Lead Preschool Teacher"
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
                error={!!errors.salary}
                errorText={errors.salary?.message}
              />
            </FormGroup>

            <FormGroup>
              <Label>Job Description</Label>
              <TextArea
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe the role, responsibilities, and what makes your organization special..."
                rows={6}
                error={!!errors.description}
                errorText={errors.description?.message}
              />
            </FormGroup>
          </FormStep>

          {/* Step 2: Requirements and Skills */}
          <FormStep active={currentStep === 2}>
            {suggestions && (
              <SuggestionSection>
                <SuggestionTitle>
                  🤖 AI Suggestions for "{watchedTitle}"
                </SuggestionTitle>
                <SuggestionGrid>
                  <SuggestionCard onClick={() => applySuggestions('skills')}>
                    <SuggestionCardTitle>Required Skills</SuggestionCardTitle>
                    <SuggestionList>
                      {suggestions.skills.map((skill: string, index: number) => (
                        <li key={index}>• {skill}</li>
                      ))}
                    </SuggestionList>
                  </SuggestionCard>
                  
                  <SuggestionCard onClick={() => applySuggestions('certifications')}>
                    <SuggestionCardTitle>Certifications</SuggestionCardTitle>
                    <SuggestionList>
                      {suggestions.certifications.map((cert: string, index: number) => (
                        <li key={index}>• {cert}</li>
                      ))}
                    </SuggestionList>
                  </SuggestionCard>
                  
                  <SuggestionCard onClick={() => applySuggestions('requirements')}>
                    <SuggestionCardTitle>Common Requirements</SuggestionCardTitle>
                    <SuggestionList>
                      {suggestions.requirements.slice(0, 3).map((req: string, index: number) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </SuggestionList>
                  </SuggestionCard>
                </SuggestionGrid>
              </SuggestionSection>
            )}

            <FormGrid>
              <FormGroup>
                <Label>Education Level Required</Label>
                <Select {...register('educationLevelRequired')}>
                  <option value="">No specific requirement</option>
                  <option value="High School">High School Diploma</option>
                  <option value="Associate">Associate Degree</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Years of Experience Required</Label>
                <Input
                  type="number"
                  min="0"
                  max="20"
                  {...register('yearsOfExperienceRequired')}
                />
              </FormGroup>
            </FormGrid>

            <FormGroup>
              <Label>Required Skills</Label>
              <div style={{ marginBottom: '1rem' }}>
                <Input placeholder="Type a skill and press Enter" />
              </div>
              <SkillTagsContainer>
                {selectedSkills.map(skill => (
                  <SkillTag key={skill} onClick={() => removeSkill(skill)}>
                    {skill} ×
                  </SkillTag>
                ))}
              </SkillTagsContainer>
              
              {suggestions && suggestions.skills && (
                <div style={{ marginTop: '1rem' }}>
                  <small style={{ color: '#666', marginBottom: '0.5rem', display: 'block' }}>
                    💡 Suggested skills (click to add):
                  </small>
                  <SkillTagsContainer>
                    {suggestions.skills
                      .filter((skill: string) => !selectedSkills.includes(skill))
                      .map((skill: string) => (
                        <SkillTag key={skill} suggested onClick={() => addSkill(skill)}>
                          + {skill}
                        </SkillTag>
                      ))
                    }
                  </SkillTagsContainer>
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Required Certifications</Label>
              <SkillTagsContainer>
                {selectedCertifications.map(cert => (
                  <SkillTag key={cert}>
                    {cert} ×
                  </SkillTag>
                ))}
              </SkillTagsContainer>
              
              {suggestions && suggestions.certifications && (
                <div style={{ marginTop: '1rem' }}>
                  <small style={{ color: '#666', marginBottom: '0.5rem', display: 'block' }}>
                    💡 Suggested certifications (click to add):
                  </small>
                  <SkillTagsContainer>
                    {suggestions.certifications
                      .filter((cert: string) => !selectedCertifications.includes(cert))
                      .map((cert: string) => (
                        <SkillTag key={cert} suggested onClick={() => addCertification(cert)}>
                          + {cert}
                        </SkillTag>
                      ))
                    }
                  </SkillTagsContainer>
                </div>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Detailed Requirements</Label>
              <TextArea
                {...register('requirements')}
                placeholder="List specific requirements, qualifications, and responsibilities..."
                rows={6}
              />
            </FormGroup>
          </FormStep>

          {/* Step 3: Review */}
          <FormStep active={currentStep === 3}>
            <div style={{ background: '#f8f9fa', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ color: '#333', marginBottom: '1rem' }}>Job Posting Preview</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong>Title:</strong> {watch('title')}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Type:</strong> {watch('type')} | <strong>Location:</strong> {watch('location')}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Salary:</strong> {watch('salary')}
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>Description:</strong> {watch('description')}
              </div>
              
              {selectedSkills.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Required Skills:</strong>
                  <SkillTagsContainer style={{ marginTop: '0.5rem' }}>
                    {selectedSkills.map(skill => (
                      <SkillTag key={skill}>{skill}</SkillTag>
                    ))}
                  </SkillTagsContainer>
                </div>
              )}
              
              {selectedCertifications.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Required Certifications:</strong>
                  <SkillTagsContainer style={{ marginTop: '0.5rem' }}>
                    {selectedCertifications.map(cert => (
                      <SkillTag key={cert}>{cert}</SkillTag>
                    ))}
                  </SkillTagsContainer>
                </div>
              )}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button type="submit" size="large">
                🚀 Post This Job
              </Button>
            </div>
          </FormStep>

          <StepNavigation>
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              ← Previous
            </Button>
            
            {currentStep < 3 ? (
              <Button type="button" onClick={nextStep}>
                Next →
              </Button>
            ) : (
              <div></div>
            )}
          </StepNavigation>
        </form>
      </FormContainer>
    </PostingContainer>
  );
};

export default IntelligentJobPosting;
