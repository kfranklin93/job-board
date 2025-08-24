import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1.1rem;
  }
`;

const ActionBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PrimaryButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background: #219a52;
  }
`;

const SecondaryButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background: #2980b9;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #27ae60;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #27ae60;
  }
  
  p {
    margin: 0;
    color: #666;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SidebarCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h3 {
    margin: 0 0 1rem 0;
    color: #333;
  }
`;

const JobCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .status {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    
    &.active {
      background: #d4edda;
      color: #155724;
    }
    
    &.draft {
      background: #f8d7da;
      color: #721c24;
    }
  }
  
  .applications {
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .posted {
    color: #888;
    font-size: 0.9rem;
  }
`;

const ApplicationCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  .candidate-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .position {
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .status {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    
    &.reviewing {
      background: #fff3cd;
      color: #856404;
    }
    
    &.interview {
      background: #cce5ff;
      color: #004085;
    }
  }
`;

const ActionButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  
  &:hover {
    background: #2980b9;
  }
`;

export const DaycareDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - replace with real data from API
  const stats = {
    activeJobs: 5,
    totalApplications: 23,
    pendingReviews: 8,
    scheduledInterviews: 4,
  };

  const activeJobs = [
    {
      id: '1',
      title: 'Early Childhood Educator',
      status: 'active',
      applications: 12,
      posted: '5 days ago',
    },
    {
      id: '2',
      title: 'Assistant Teacher',
      status: 'active',
      applications: 8,
      posted: '1 week ago',
    },
    {
      id: '3',
      title: 'Lead Teacher - Toddlers',
      status: 'draft',
      applications: 0,
      posted: 'Draft',
    },
  ];

  const recentApplications = [
    {
      id: '1',
      candidateName: 'Sarah Johnson',
      position: 'Early Childhood Educator',
      status: 'reviewing',
      appliedDate: '2 days ago',
    },
    {
      id: '2',
      candidateName: 'Michael Chen',
      position: 'Assistant Teacher',
      status: 'interview',
      appliedDate: '3 days ago',
    },
    {
      id: '3',
      candidateName: 'Emily Rodriguez',
      position: 'Early Childhood Educator',
      status: 'reviewing',
      appliedDate: '1 week ago',
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Manage your job postings and candidates</p>
      </Header>

      <ActionBar>
        <PrimaryButton>+ Post New Job</PrimaryButton>
        <SecondaryButton onClick={() => navigate('/daycare/candidates')}>
          Manage Candidates
        </SecondaryButton>
        <SecondaryButton>Browse Candidates</SecondaryButton>
        <SecondaryButton>View All Applications</SecondaryButton>
      </ActionBar>

      <StatsGrid>
        <StatCard>
          <h3>{stats.activeJobs}</h3>
          <p>Active Job Postings</p>
        </StatCard>
        <StatCard>
          <h3>{stats.totalApplications}</h3>
          <p>Total Applications</p>
        </StatCard>
        <StatCard>
          <h3>{stats.pendingReviews}</h3>
          <p>Pending Reviews</p>
        </StatCard>
        <StatCard>
          <h3>{stats.scheduledInterviews}</h3>
          <p>Scheduled Interviews</p>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainContent>
          <h2>Your Job Postings</h2>
          
          {activeJobs.map((job) => (
            <JobCard key={job.id}>
              <h4>{job.title}</h4>
              <div className={`status ${job.status}`}>
                {job.status === 'active' ? 'Active' : 'Draft'}
              </div>
              <div className="applications">
                {job.applications} application{job.applications !== 1 ? 's' : ''}
              </div>
              <div className="posted">Posted {job.posted}</div>
              <div style={{ marginTop: '1rem' }}>
                <ActionButton>View Applications</ActionButton>
                <ActionButton>Edit Job</ActionButton>
                {job.status === 'draft' && (
                  <ActionButton style={{ background: '#27ae60' }}>
                    Publish
                  </ActionButton>
                )}
              </div>
            </JobCard>
          ))}
        </MainContent>

        <Sidebar>
          <SidebarCard>
            <h3>Recent Applications</h3>
            {recentApplications.map((app) => (
              <ApplicationCard key={app.id}>
                <div className="candidate-name">{app.candidateName}</div>
                <div className="position">{app.position}</div>
                <div className={`status ${app.status}`}>
                  {app.status === 'reviewing' ? 'Under Review' : 'Interview Scheduled'}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.5rem' }}>
                  Applied {app.appliedDate}
                </div>
                <ActionButton>View Profile</ActionButton>
              </ApplicationCard>
            ))}
          </SidebarCard>

          <SidebarCard>
            <h3>Quick Stats</h3>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>This Week's Applications</span>
                <span style={{ color: '#27ae60', fontWeight: '600' }}>7</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Profile Views</span>
                <span style={{ color: '#3498db', fontWeight: '600' }}>45</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Average Response Time</span>
                <span style={{ color: '#f39c12', fontWeight: '600' }}>2.3 days</span>
              </div>
            </div>
          </SidebarCard>

          <SidebarCard>
            <h3>Organization Profile</h3>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <p>Keep your organization profile updated to attract the best candidates.</p>
              <ActionButton style={{ width: '100%', marginTop: '1rem' }}>
                Update Profile
              </ActionButton>
            </div>
          </SidebarCard>
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DaycareDashboard;
