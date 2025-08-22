import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardBody, Button, Input } from '../../components/ui';
import Navbar from '../../components/layout/Navbar';
import PageHeader from '../../components/layout/PageHeader';
import { mockJobs } from '../../data/mockJobs';
import { Job, JobType, JobStatus } from '../../types/data';
import { ROUTES, SEEKER_NAV_ITEMS } from '../../types/navigation';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.colors.neutral.gray100};
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${props => props.theme.spacing.xl};
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.xl};
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const JobsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const JobCard = styled(Card)`
  transition: transform ${props => props.theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
  }
`;

const JobTitle = styled.h3`
  color: ${props => props.theme.colors.neutral.black};
  font-size: ${props => props.theme.typography.sizes.xl};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const JobCompany = styled.div`
  color: ${props => props.theme.colors.neutral.gray700};
  font-size: ${props => props.theme.typography.sizes.md};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const JobLocation = styled.div`
  color: ${props => props.theme.colors.neutral.gray600};
  font-size: ${props => props.theme.typography.sizes.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const JobTypeBadge = styled.span`
  background-color: ${props => props.theme.colors.primary.main}15;
  color: ${props => props.theme.colors.primary.main};
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.sizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

const JobStatusBadge = styled.span<{ status: JobStatus }>`
  padding: ${props => `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
  border-radius: ${props => props.theme.borders.radius.full};
  font-size: ${props => props.theme.typography.sizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  
  ${props => {
    switch (props.status) {
      case JobStatus.ACTIVE:
        return `
          background-color: ${props.theme.colors.success.main}15;
          color: ${props.theme.colors.success.main};
        `;
      case JobStatus.PAUSED:
        return `
          background-color: ${props.theme.colors.warning.main}15;
          color: ${props.theme.colors.warning.main};
        `;
      case JobStatus.CLOSED:
        return `
          background-color: ${props.theme.colors.info.main}15;
          color: ${props.theme.colors.info.main};
        `;
      default:
        return `
          background-color: ${props.theme.colors.neutral.gray200};
          color: ${props.theme.colors.neutral.gray600};
        `;
    }
  }}
`;

const BadgesContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const JobDescription = styled.p`
  color: ${props => props.theme.colors.neutral.gray600};
  font-size: ${props => props.theme.typography.sizes.sm};
  line-height: 1.5;
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const JobMetaInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.neutral.gray500};
  font-size: ${props => props.theme.typography.sizes.sm};
`;

const PostedDate = styled.span`
  color: ${props => props.theme.colors.secondary.main};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
`;

// Helper Functions
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric' 
  }).format(date);
};

const JobTypeLabel = {
  [JobType.FULL_TIME]: 'Full-time',
  [JobType.PART_TIME]: 'Part-time',
  [JobType.CONTRACT]: 'Contract',
  [JobType.TEMPORARY]: 'Temporary',
  [JobType.INTERNSHIP]: 'Internship'
};

// Component
const SeekerJobsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (!query) {
      setFilteredJobs(mockJobs);
      return;
    }
    
    const filtered = mockJobs.filter(job => 
      job.title?.toLowerCase().includes(query) ||
      job.organizationName?.toLowerCase().includes(query) ||
      job.location?.toLowerCase().includes(query)
    );
    
    setFilteredJobs(filtered);
  };

  return (
    <PageContainer>
      <Navbar 
        navItems={SEEKER_NAV_ITEMS}
        appName="TalentHub"
      />
      
      <ContentContainer>
        <PageHeader
          title="Find Your Next Opportunity"
          subtitle="Explore and apply to jobs that match your skills and interests"
        />
        
        <FiltersContainer>
          <Input
            placeholder="Search jobs by title, company, or location..."
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            startIcon={<span>🔍</span>}
          />
        </FiltersContainer>

        <JobsGrid>
          {filteredJobs.map(job => (
            <JobCard key={job.id} elevation="low">
              <CardBody>
                <JobTitle>{job.title}</JobTitle>
                <JobCompany>{job.organizationName}</JobCompany>
                <JobLocation>{job.location}</JobLocation>
                
                <BadgesContainer>
                  <JobTypeBadge>
                    {job.type ? JobTypeLabel[job.type] : 'N/A'}
                  </JobTypeBadge>
                  <JobStatusBadge status={job.status}>
                    {job.status}
                  </JobStatusBadge>
                </BadgesContainer>
                
                <JobDescription>
                  {job.description?.slice(0, 150)}...
                </JobDescription>
                
                <JobMetaInfo>
                  <PostedDate>Posted {formatDate(job.postedDate)}</PostedDate>
                  <Button variant="primary" size="small">
                    Apply Now
                  </Button>
                </JobMetaInfo>
              </CardBody>
            </JobCard>
          ))}
        </JobsGrid>
        
        {filteredJobs.length === 0 && (
          <Card>
            <CardBody>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            </CardBody>
          </Card>
        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default SeekerJobsScreen;