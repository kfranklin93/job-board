import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { UserProfile, Job } from '../../types/data';
import { profileService } from '../../services/api/profileService';
import { findBestJobMatches } from '../../services/api/candidateMatchingEngine';
import { mockJobs } from '../../data/mockJobs';

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

const MatchBadge = styled.span<{ score: number }>`
  background: ${({ score, theme }) => {
    if (score >= 90) return theme.colors.success.main;
    if (score >= 80) return theme.colors.warning.main;
    if (score >= 70) return theme.colors.info.main;
    return theme.colors.error.main;
  }};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
`;

export const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Array<Job & { matchScore: number }>>([]);
  const [profileCompletion, setProfileCompletion] = useState({ percentage: 0, missingFields: [] as string[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Load user profile
      const userProfile = await profileService.getProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
        
        // Calculate profile completion
        const completion = profileService.calculateProfileCompletion(userProfile);
        setProfileCompletion(completion);
        
        // Get recommended jobs using matching engine
        const jobMatches = findBestJobMatches(userProfile, mockJobs);
        const jobsWithScores = jobMatches.map(match => ({
          ...match.job,
          matchScore: match.matchResult.score
        }));
        setRecommendedJobs(jobsWithScores.slice(0, 5)); // Show top 5
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'search':
        navigate('/jobs');
        break;
      case 'profile':
        navigate('/profile/edit');
        break;
      case 'resume':
        navigate('/profile/edit');
        break;
      case 'applications':
        navigate('/applications');
        break;
    }
  };

  // Mock stats - in real app, these would come from API
  const stats = {
    applicationsSubmitted: 8,
    interviewsScheduled: 3,
    profileViews: 24,
    jobsBookmarked: 12,
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingMessage>Loading your dashboard...</LoadingMessage>
      </DashboardContainer>
    );
  }

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
          
          {recommendedJobs.length > 0 ? (
            recommendedJobs.map((job) => (
              <JobCard key={job.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4>{job.title}</h4>
                    <div className="company">{job.organizationName}</div>
                    <div className="location">{job.location}</div>
                    <div className="salary">{job.salary}</div>
                  </div>
                  <MatchBadge score={job.matchScore}>
                    {Math.round(job.matchScore)}% match
                  </MatchBadge>
                </div>
                <ActionButton>Apply Now</ActionButton>
              </JobCard>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Complete your profile to see personalized job recommendations
            </div>
          )}
        </MainContent>

        <Sidebar>
          <SidebarCard>
            <h3>Quick Actions</h3>
            <QuickAction onClick={() => handleQuickAction('search')}>
              <span>🔍</span>
              <span>Search Jobs</span>
            </QuickAction>
            <QuickAction onClick={() => handleQuickAction('profile')}>
              <span>📝</span>
              <span>Update Profile</span>
            </QuickAction>
            <QuickAction onClick={() => handleQuickAction('resume')}>
              <span>📄</span>
              <span>Upload Resume</span>
            </QuickAction>
            <QuickAction onClick={() => handleQuickAction('applications')}>
              <span>📊</span>
              <span>View Applications</span>
            </QuickAction>
          </SidebarCard>

          <SidebarCard>
            <h3>Profile Completion</h3>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{profileCompletion.percentage}% Complete</span>
              </div>
              <div style={{ 
                height: '8px', 
                background: '#e0e0e0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  height: '100%', 
                  width: `${profileCompletion.percentage}%`, 
                  background: profileCompletion.percentage >= 80 ? '#27ae60' : '#f39c12'
                }} />
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              {profileCompletion.percentage < 100 
                ? `Complete ${profileCompletion.missingFields.length} more section${profileCompletion.missingFields.length !== 1 ? 's' : ''} to improve job matches`
                : 'Your profile is complete!'
              }
            </p>
            {profileCompletion.percentage < 100 && (
              <ActionButton 
                onClick={() => handleQuickAction('profile')}
                style={{ marginTop: '10px', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                Complete Profile
              </ActionButton>
            )}
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
