import React from 'react';
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
  background: #8e44ad;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    background: #7d3c98;
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
  border-left: 4px solid #8e44ad;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 2rem;
    color: #8e44ad;
  }
  
  p {
    margin: 0;
    color: #666;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const ContentCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  h2 {
    margin: 0 0 1.5rem 0;
    color: #333;
  }
`;

const ReportCard = styled.div`
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
  
  .daycare-name {
    color: #8e44ad;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  .candidates-count {
    color: #27ae60;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  
  .generated-date {
    color: #888;
    font-size: 0.8rem;
  }
`;

const CandidateCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  .candidate-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .candidate-title {
    color: #666;
    margin-bottom: 0.5rem;
  }
  
  .match-score {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    
    &.high {
      background: #d4edda;
      color: #155724;
    }
    
    &.medium {
      background: #fff3cd;
      color: #856404;
    }
  }
  
  .skills {
    font-size: 0.8rem;
    color: #666;
  }
`;

const PartnerCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  .partner-name {
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .location {
    color: #666;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  .stats {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: #888;
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

export const RecruiterDashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock data - replace with real data from API
  const stats = {
    partnerDaycares: 8,
    candidatesPlaced: 15,
    activeReports: 6,
    avgMatchScore: 87,
  };

  const recentReports = [
    {
      id: '1',
      title: 'Weekly Top Candidates Report',
      daycareName: 'Sunshine Learning Center',
      candidatesCount: 12,
      generatedDate: '2 days ago',
    },
    {
      id: '2',
      title: 'Lead Teacher Candidates',
      daycareName: 'Little Explorers Daycare',
      candidatesCount: 8,
      generatedDate: '4 days ago',
    },
    {
      id: '3',
      title: 'Monthly Hiring Report',
      daycareName: 'Growing Minds Academy',
      candidatesCount: 15,
      generatedDate: '1 week ago',
    },
  ];

  const topCandidates = [
    {
      id: '1',
      name: 'Sarah Mitchell',
      title: 'Early Childhood Educator',
      matchScore: 95,
      skills: 'Child Development, Montessori, Team Leadership',
    },
    {
      id: '2',
      name: 'David Thompson',
      title: 'Lead Teacher',
      matchScore: 92,
      skills: 'Curriculum Development, Parent Communication',
    },
    {
      id: '3',
      name: 'Maria Garcia',
      title: 'Assistant Teacher',
      matchScore: 88,
      skills: 'Bilingual Education, Creative Arts, Patience',
    },
  ];

  const partnerDaycares = [
    {
      id: '1',
      name: 'Sunshine Learning Center',
      location: 'Seattle, WA',
      openPositions: 3,
      lastReport: '2 days ago',
    },
    {
      id: '2',
      name: 'Little Explorers Daycare',
      location: 'Bellevue, WA',
      openPositions: 2,
      lastReport: '4 days ago',
    },
    {
      id: '3',
      name: 'Growing Minds Academy',
      location: 'Redmond, WA',
      openPositions: 5,
      lastReport: '1 week ago',
    },
  ];

  return (
    <DashboardContainer>
      <Header>
        <h1>Welcome back, {user?.firstName}!</h1>
        <p>Monitor recruitment activities and generate candidate reports</p>
      </Header>

      <ActionBar>
        <PrimaryButton>+ Generate New Report</PrimaryButton>
        <SecondaryButton>Search Candidates</SecondaryButton>
        <SecondaryButton>View Analytics</SecondaryButton>
      </ActionBar>

      <StatsGrid>
        <StatCard>
          <h3>{stats.partnerDaycares}</h3>
          <p>Partner Daycares</p>
        </StatCard>
        <StatCard>
          <h3>{stats.candidatesPlaced}</h3>
          <p>Candidates Placed</p>
        </StatCard>
        <StatCard>
          <h3>{stats.activeReports}</h3>
          <p>Active Reports</p>
        </StatCard>
        <StatCard>
          <h3>{stats.avgMatchScore}%</h3>
          <p>Avg Match Score</p>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <ContentCard>
          <h2>Recent Reports</h2>
          
          {recentReports.map((report) => (
            <ReportCard key={report.id}>
              <h4>{report.title}</h4>
              <div className="daycare-name">{report.daycareName}</div>
              <div className="candidates-count">
                {report.candidatesCount} candidates included
              </div>
              <div className="generated-date">Generated {report.generatedDate}</div>
              <div style={{ marginTop: '1rem' }}>
                <ActionButton>View Report</ActionButton>
                <ActionButton>Download PDF</ActionButton>
              </div>
            </ReportCard>
          ))}
        </ContentCard>

        <ContentCard>
          <h2>Top Candidates</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
            Highest matching candidates across all partner daycares
          </p>
          
          {topCandidates.map((candidate) => (
            <CandidateCard key={candidate.id}>
              <div className="candidate-name">{candidate.name}</div>
              <div className="candidate-title">{candidate.title}</div>
              <div className={`match-score ${candidate.matchScore >= 90 ? 'high' : 'medium'}`}>
                {candidate.matchScore}% Match
              </div>
              <div className="skills">{candidate.skills}</div>
              <ActionButton>View Profile</ActionButton>
              <ActionButton>Add to Report</ActionButton>
            </CandidateCard>
          ))}
        </ContentCard>
      </ContentGrid>

      <div style={{ marginTop: '2rem' }}>
        <ContentCard>
          <h2>Partner Daycares</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {partnerDaycares.map((partner) => (
              <PartnerCard key={partner.id}>
                <div className="partner-name">{partner.name}</div>
                <div className="location">{partner.location}</div>
                <div className="stats">
                  <span>{partner.openPositions} open positions</span>
                  <span>Last report: {partner.lastReport}</span>
                </div>
                <ActionButton>Generate Report</ActionButton>
                <ActionButton>View Details</ActionButton>
              </PartnerCard>
            ))}
          </div>
        </ContentCard>
      </div>
    </DashboardContainer>
  );
};

export default RecruiterDashboard;
