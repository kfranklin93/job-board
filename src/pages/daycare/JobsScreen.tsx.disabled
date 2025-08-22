import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, CardBody, Button, Input } from '../../components/ui';
import { mockJobs } from '../../data/mockJobs';
import { Job, JobType, JobStatus } from '../../types/data';
import { ROUTES, DAYCARE_NAV_ITEMS } from '../../types/navigation';
import { Link } from 'react-router-dom';

// --- Styled Components ---
const JobsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Navbar = styled.nav`
  background-color: white;
  padding: 1rem 2rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #4361ee;
`;

const NavMenu = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)<{ active?: boolean }>`
  color: ${({ active }) => (active ? '#4361ee' : '#4a5568')};
  text-decoration: none;
  font-weight: ${({ active }) => (active ? '600' : '500')};
  padding: 0.5rem 0;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #4361ee;
    transform: ${({ active }) => (active ? 'scaleX(1)' : 'scaleX(0)')};
    transform-origin: bottom left;
    transition: transform 0.2s ease-in-out;
  }
  
  &:hover::after {
    transform: scaleX(1);
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderLeft = styled.div``;

const HeaderRight = styled.div``;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #718096;
  margin: 0;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchBar = styled(Input)`
  flex: 1;
  min-width: 300px;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f9fafb;
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const JobStatusBadge = styled.span<{ status: JobStatus }>`
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  text-transform: capitalize;
  
  ${({ status }) => {
    switch (status) {
      case JobStatus.ACTIVE:
        return `background-color: #ecfdf5; color: #10b981;`;
      case JobStatus.PAUSED:
        return `background-color: #fffbeb; color: #f59e0b;`;
      case JobStatus.CLOSED:
        return `background-color: #eff6ff; color: #60a5fa;`;
      case JobStatus.DRAFT:
        return `background-color: #f3f4f6; color: #6b7280;`;
      default:
        return `background-color: #f3f4f6; color: #6b7280;`;
    }
  }}
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  font-size: 4rem;
  color: #e2e8f0;
  margin-bottom: 1.5rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.75rem;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: #718096;
  margin-bottom: 2rem;
  max-width: 400px;
`;

// --- Helper Functions ---
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const JobTypeLabel = {
  [JobType.FULL_TIME]: 'Full-time',
  [JobType.PART_TIME]: 'Part-time',
  [JobType.CONTRACT]: 'Contract',
  [JobType.TEMPORARY]: 'Temporary',
  [JobType.INTERNSHIP]: 'Internship'
};

// --- Component ---
const JobsScreen = () => {
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
  
  // --- Placeholder Action Handlers ---
  const handleViewApplicants = (jobId: string) => console.log(`Viewing applicants for job: ${jobId}`);
  const handleEditJob = (jobId: string) => console.log(`Editing job: ${jobId}`);

  return (
    <>
      <Navbar>
        <Logo>DaycareDashboard</Logo>
        <NavMenu>
          {DAYCARE_NAV_ITEMS.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path}
              active={item.path === ROUTES.DAYCARE_JOBS}
            >
              {item.label}
            </NavLink>
          ))}
        </NavMenu>
      </Navbar>
      
      <JobsContainer>
        <PageHeader>
          <HeaderLeft>
            <Title>Job Listings</Title>
            <Subtitle>Manage your organization's job postings</Subtitle>
          </HeaderLeft>
          <HeaderRight>
            <Button>Create New Job</Button>
          </HeaderRight>
        </PageHeader>
        
        <FiltersContainer>
          <SearchBar 
            placeholder="Search by title, organization, or location..." 
            value={searchQuery}
            onChange={handleSearch}
          />
        </FiltersContainer>
        
        <TableContainer>
            {filteredJobs.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Job Title</TableHeaderCell>
                      <TableHeaderCell>Type</TableHeaderCell>
                      <TableHeaderCell>Applicants</TableHeaderCell>
                      <TableHeaderCell>Posted</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Actions</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {filteredJobs.map(job => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div style={{ fontWeight: 500 }}>{job.title}</div>
                          <div style={{ fontSize: '0.875rem', color: '#718096' }}>{job.location}</div>
                        </TableCell>
                        <TableCell>
                          {job.type ? JobTypeLabel[job.type] : 'N/A'}
                        </TableCell>
                        <TableCell>{job.applicantCount}</TableCell>
                        <TableCell>{formatDate(job.postedDate)}</TableCell>
                        <TableCell>
                          <JobStatusBadge status={job.status}>{job.status}</JobStatusBadge>
                        </TableCell>
                        <TableCell>
                          <Button variant="text" size="small" onClick={() => handleViewApplicants(job.id)}>View</Button>
                          <Button variant="text" size="small" onClick={() => handleEditJob(job.id)}>Edit</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
            ) : (
              <EmptyState>
                <EmptyStateIcon>📋</EmptyStateIcon>
                <EmptyStateTitle>No jobs found</EmptyStateTitle>
                <EmptyStateText>
                  No job listings match your search criteria. Try adjusting your search or create a new job posting.
                </EmptyStateText>
                <Button>Create New Job</Button>
              </EmptyState>
            )}
        </TableContainer>
      </JobsContainer>
    </>
  );
};

export default JobsScreen;