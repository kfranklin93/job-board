import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/data';

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
  border-left: 4px solid #3498db;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #3498db;
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
  transition: box-shadow 0.2s;
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .company {
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .location {
    color: #888;
    font-size: 0.9rem;
  }
  
  .salary {
    color: #27ae60;
    font-weight: 600;
    margin-top: 0.5rem;
  }
`;

const ActionButton = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #2980b9;
  }
`;

const QuickAction = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: #f8f9fa;
  }
  
  span {
    margin-left: 0.75rem;
  }
`;

export const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with real data from API
  const stats = {
    applicationsSubmitted: 8,
    interviewsScheduled: 3,
    profileViews: 24,
    jobsBookmarked: 12,
  };

  const recommendedJobs = [
    {
      id: '1',
      title: 'Early Childhood Educator',
      company: 'Sunshine Daycare Center',
      location: 'Seattle, WA',
      salary: '$35,000 - $45,000',
      posted: '2 days ago',
    },
    {
      id: '2',
      title: 'Assistant Teacher',
      company: 'Little Learners Academy',
      location: 'Bellevue, WA',
      salary: '$32,000 - $38,000',
      posted: '1 week ago',
    },
    {
      id: '3',
      title: 'Lead Teacher',
      company: 'Growing Minds Childcare',
      location: 'Redmond, WA',
      salary: '$40,000 - $50,000',
      posted: '3 days ago',
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Here's what's happening with your job search</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <h3>{stats.applicationsSubmitted}</h3>
          <p>Applications Submitted</p>
        </StatCard>
        <StatCard>
          <h3>{stats.interviewsScheduled}</h3>
          <p>Interviews Scheduled</p>
        </StatCard>
        <StatCard>
          <h3>{stats.profileViews}</h3>
          <p>Profile Views</p>
        </StatCard>
        <StatCard>
          <h3>{stats.jobsBookmarked}</h3>
          <p>Jobs Bookmarked</p>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <MainContent>
          <h2>Recommended Jobs</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Based on your profile and preferences
          </p>
          
          {recommendedJobs.map((job) => (
            <JobCard key={job.id}>
              <h4>{job.title}</h4>
              <div className="company">{job.company}</div>
              <div className="location">{job.location}</div>
              <div className="salary">{job.salary}</div>
              <ActionButton>Apply Now</ActionButton>
            </JobCard>
          ))}
        </MainContent>

        <Sidebar>
          <SidebarCard>
            <h3>Quick Actions</h3>
            <QuickAction>
              <span>🔍</span>
              <span>Search Jobs</span>
            </QuickAction>
            <QuickAction>
              <span>📝</span>
              <span>Update Profile</span>
            </QuickAction>
            <QuickAction>
              <span>📄</span>
              <span>Upload Resume</span>
            </QuickAction>
            <QuickAction>
              <span>📊</span>
              <span>View Applications</span>
            </QuickAction>
          </SidebarCard>

          <SidebarCard>
            <h3>Profile Completion</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>85% Complete</span>
              </div>
              <div style={{ 
                height: '8px', 
                background: '#e0e0e0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: '85%', 
                  background: '#27ae60' 
                }} />
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              Complete your profile to get better job matches
            </p>
          </SidebarCard>

          <SidebarCard>
            <h3>Application Status</h3>
            <div style={{ fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Under Review</span>
                <span style={{ color: '#f39c12' }}>5</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Interview Scheduled</span>
                <span style={{ color: '#3498db' }}>3</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Awaiting Response</span>
                <span style={{ color: '#95a5a6' }}>2</span>
              </div>
            </div>
          </SidebarCard>
        </Sidebar>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default JobSeekerDashboard;
