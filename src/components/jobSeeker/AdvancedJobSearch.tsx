import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Job, JobType, UserProfile } from '../../types/data';
import { mockJobs } from '../../data/mockJobs';
import { mockJobSeekers } from '../../data/mockJobSeekers';
import { calculateMatchScore } from '../../services/api/candidateMatchingEngine';
import { Button, Input } from '../common/ui';

const SearchContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const SearchHeader = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #5E35B1;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const FiltersContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #5E35B1;
    box-shadow: 0 0 0 3px rgba(94, 53, 177, 0.1);
  }
`;

const RangeSlider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const SliderValue = styled.span`
  font-weight: 600;
  color: #5E35B1;
`;

const SuggestionsSection = styled.div`
  background: #f8f5ff;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
`;

const SuggestionTitle = styled.h3`
  color: #5E35B1;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SuggestionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SuggestionChip = styled.button`
  background: #5E35B1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #4527A0;
    transform: translateY(-1px);
  }
`;

const ResultsContainer = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const JobCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #5E35B1;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const JobHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
`;

const CompanyName = styled.p`
  color: #666;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const JobMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

const MatchScore = styled.div<{ score: number }>`
  text-align: center;
  padding: 1rem;
  background: ${props => 
    props.score >= 80 ? '#E8F5E8' : 
    props.score >= 60 ? '#FFF3E0' : '#FFEBEE'};
  border-radius: 8px;
  min-width: 100px;
`;

const ScoreValue = styled.div<{ score: number }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => 
    props.score >= 80 ? '#4CAF50' : 
    props.score >= 60 ? '#FF9800' : '#F44336'};
`;

const ScoreLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
`;

const JobDescription = styled.p`
  color: #555;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const RequirementsList = styled.ul`
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  
  li {
    color: #666;
    margin-bottom: 0.25rem;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ApplyButton = styled(Button)`
  background: #4CAF50;
  
  &:hover {
    background: #45a049;
  }
`;

const SaveButton = styled(Button)`
  background: transparent;
  color: #5E35B1;
  border: 2px solid #5E35B1;
  
  &:hover {
    background: #5E35B1;
    color: white;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

interface JobSearchFilters {
  minMatchScore: number;
  minSalary: number;
  maxSalary: number;
  location: string;
  jobType: JobType | '';
  educationLevel: string;
  keywords: string;
}

export const AdvancedJobSearch: React.FC = () => {
  const [filters, setFilters] = useState<JobSearchFilters>({
    minMatchScore: 0,
    minSalary: 0,
    maxSalary: 100000,
    location: '',
    jobType: '',
    educationLevel: '',
    keywords: ''
  });
  
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [jobScores, setJobScores] = useState<Map<string, number>>(new Map());
  const [currentUser] = useState<UserProfile>(mockJobSeekers[0]); // Mock current user
  const [isLoading, setIsLoading] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  
  // Intelligent skill suggestions based on user profile and job market
  const skillSuggestions = [
    'Classroom Management',
    'Child Development',
    'Early Childhood Education',
    'Special Needs Support',
    'Curriculum Planning',
    'Parent Communication',
    'First Aid/CPR',
    'Behavior Management'
  ];
  
  // Calculate match scores for all jobs
  useEffect(() => {
    setIsLoading(true);
    
    const scores = new Map<string, number>();
    mockJobs.forEach(job => {
      const matchResult = calculateMatchScore(job, currentUser);
      scores.set(job.id, matchResult.score);
    });
    
    setJobScores(scores);
    setIsLoading(false);
  }, [currentUser]);
  
  // Filter jobs based on current filters
  useEffect(() => {
    let filtered = mockJobs.filter(job => {
      const matchScore = jobScores.get(job.id) || 0;
      
      // Match score filter
      if (matchScore < filters.minMatchScore) return false;
      
      // Job type filter
      if (filters.jobType && job.type !== filters.jobType) return false;
      
      // Location filter
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      
      // Education level filter
      if (filters.educationLevel && job.educationLevelRequired) {
        if (!job.educationLevelRequired.toLowerCase().includes(filters.educationLevel.toLowerCase())) {
          return false;
        }
      }
      
      // Keywords filter
      if (filters.keywords) {
        const searchText = `${job.title} ${job.description} ${job.requirements.join(' ')}`.toLowerCase();
        const keywords = filters.keywords.toLowerCase().split(' ');
        if (!keywords.some(keyword => searchText.includes(keyword))) {
          return false;
        }
      }
      
      // Salary filter (extract from salary string)
      const salaryMatch = job.salary.match(/\$?([\d,]+)/);
      if (salaryMatch) {
        const salary = parseInt(salaryMatch[1].replace(',', ''));
        if (salary < filters.minSalary || salary > filters.maxSalary) {
          return false;
        }
      }
      
      return true;
    });
    
    // Sort by match score
    filtered.sort((a, b) => (jobScores.get(b.id) || 0) - (jobScores.get(a.id) || 0));
    
    setFilteredJobs(filtered);
  }, [filters, jobScores]);
  
  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const addSkillSuggestion = (skill: string) => {
    setFilters(prev => ({
      ...prev,
      keywords: prev.keywords ? `${prev.keywords} ${skill}` : skill
    }));
  };
  
  const applyToJob = (jobId: string) => {
    setAppliedJobs(prev => new Set(prev).add(jobId));
    // In real app, this would make an API call
    console.log(`Applied to job: ${jobId}`);
  };
  
  const saveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };
  
  if (isLoading) {
    return <LoadingSpinner>Calculating match scores...</LoadingSpinner>;
  }
  
  return (
    <SearchContainer>
      <SearchHeader>
        <Title>Find Your Perfect Daycare Position</Title>
        <Subtitle>
          Discover opportunities tailored to your skills and experience
        </Subtitle>
      </SearchHeader>
      
      <FiltersContainer>
        <FilterGrid>
          <FilterGroup>
            <FilterLabel>Minimum Match Score</FilterLabel>
            <RangeSlider
              type="range"
              min="0"
              max="100"
              value={filters.minMatchScore}
              onChange={(e) => handleFilterChange('minMatchScore', parseInt(e.target.value))}
            />
            <SliderValue>{filters.minMatchScore}%</SliderValue>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Job Type</FilterLabel>
            <Select
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value={JobType.FULL_TIME}>Full Time</option>
              <option value={JobType.PART_TIME}>Part Time</option>
              <option value={JobType.CONTRACT}>Contract</option>
              <option value={JobType.TEMPORARY}>Temporary</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Location</FilterLabel>
            <Input
              placeholder="Enter city or region"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Education Level</FilterLabel>
            <Select
              value={filters.educationLevel}
              onChange={(e) => handleFilterChange('educationLevel', e.target.value)}
            >
              <option value="">Any Level</option>
              <option value="high school">High School</option>
              <option value="associate">Associate Degree</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Salary Range</FilterLabel>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Input
                type="number"
                placeholder="Min"
                value={filters.minSalary}
                onChange={(e) => handleFilterChange('minSalary', parseInt(e.target.value) || 0)}
              />
              <span>-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.maxSalary}
                onChange={(e) => handleFilterChange('maxSalary', parseInt(e.target.value) || 100000)}
              />
            </div>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Keywords</FilterLabel>
            <Input
              placeholder="Skills, title, requirements..."
              value={filters.keywords}
              onChange={(e) => handleFilterChange('keywords', e.target.value)}
            />
          </FilterGroup>
        </FilterGrid>
        
        <SuggestionsSection>
          <SuggestionTitle>
            💡 Suggested Skills to Add to Your Search
          </SuggestionTitle>
          <SuggestionList>
            {skillSuggestions.map(skill => (
              <SuggestionChip
                key={skill}
                onClick={() => addSkillSuggestion(skill)}
              >
                + {skill}
              </SuggestionChip>
            ))}
          </SuggestionList>
        </SuggestionsSection>
      </FiltersContainer>
      
      <ResultsContainer>
        <h2>Found {filteredJobs.length} matching positions</h2>
        
        {filteredJobs.map(job => {
          const matchScore = jobScores.get(job.id) || 0;
          const isApplied = appliedJobs.has(job.id);
          const isSaved = savedJobs.has(job.id);
          
          return (
            <JobCard key={job.id}>
              <JobHeader>
                <JobInfo>
                  <JobTitle>{job.title}</JobTitle>
                  <CompanyName>{job.organizationName}</CompanyName>
                  <JobMeta>
                    <span>📍 {job.location}</span>
                    <span>💼 {job.type}</span>
                    <span>💰 {job.salary}</span>
                  </JobMeta>
                </JobInfo>
                
                <MatchScore score={matchScore}>
                  <ScoreValue score={matchScore}>{matchScore}%</ScoreValue>
                  <ScoreLabel>Match</ScoreLabel>
                </MatchScore>
              </JobHeader>
              
              <JobDescription>{job.description}</JobDescription>
              
              <div>
                <strong>Requirements:</strong>
                <RequirementsList>
                  {job.requirements.slice(0, 3).map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                  {job.requirements.length > 3 && (
                    <li>+ {job.requirements.length - 3} more requirements</li>
                  )}
                </RequirementsList>
              </div>
              
              <ActionButtons>
                <ApplyButton
                  onClick={() => applyToJob(job.id)}
                  disabled={isApplied}
                >
                  {isApplied ? '✓ Applied' : 'Apply Now'}
                </ApplyButton>
                
                <SaveButton onClick={() => saveJob(job.id)}>
                  {isSaved ? '❤️ Saved' : '🤍 Save'}
                </SaveButton>
                
                <Button variant="outline" size="small">
                  View Details
                </Button>
              </ActionButtons>
            </JobCard>
          );
        })}
        
        {filteredJobs.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
            <h3>No matching jobs found</h3>
            <p>Try adjusting your filters or search criteria</p>
          </div>
        )}
      </ResultsContainer>
    </SearchContainer>
  );
};

export default AdvancedJobSearch;
