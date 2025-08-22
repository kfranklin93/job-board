import React from 'react';
import styled from 'styled-components';

// Import our services and data for testing
import { mockJobs } from './data/mockJobs';
import { mockJobSeekers } from './data/mockJobSeekers';
import { getRecommendationsForJob, generateRecommendationSummary } from './services/recommendationService';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 2rem;
  padding: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
`;

const SectionTitle = styled.h2`
  color: #34495e;
  margin-bottom: 1rem;
`;

const JobCard = styled.div`
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const CandidateCard = styled.div`
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchScore = styled.span<{ score: number }>`
  background: ${props => props.score >= 80 ? '#27ae60' : props.score >= 60 ? '#f39c12' : '#e74c3c'};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
`;

function App() {
  // Test the matching engine with the first job and all candidates
  const testJob = mockJobs[0];
  const recommendations = getRecommendationsForJob(testJob, mockJobSeekers, 5);
  const summary = generateRecommendationSummary(testJob, recommendations);

  return (
    <Container>
      <Header>🏠 Daycare Staffing & Recommendation Platform</Header>
      
      <Section>
        <SectionTitle>Platform Overview</SectionTitle>
        <p>
          Welcome to the Daycare Staffing & Recommendation Platform! This platform connects 
          job seekers with daycare organizations while providing recruiters with intelligent 
          candidate matching and recommendation reports.
        </p>
        <ul>
          <li><strong>Job Seekers:</strong> Create profiles and find matching daycare positions</li>
          <li><strong>Daycare Organizations:</strong> Post jobs and view recommended candidates</li>
          <li><strong>Recruiters:</strong> Receive curated reports of top candidates</li>
        </ul>
      </Section>

      <Section>
        <SectionTitle>Demo: Job Matching Results</SectionTitle>
        <JobCard>
          <h3>{testJob.title}</h3>
          <p><strong>Organization:</strong> {testJob.organizationName}</p>
          <p><strong>Location:</strong> {testJob.location}</p>
          <p><strong>Type:</strong> {testJob.type}</p>
          <p><strong>Description:</strong> {testJob.description}</p>
          <p><strong>Requirements:</strong></p>
          <ul>
            {testJob.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </JobCard>

        <h4>Recommendation Summary:</h4>
        <p style={{ fontStyle: 'italic', background: 'white', padding: '1rem', borderRadius: '8px' }}>
          {summary}
        </p>

        <h4>Top Candidate Matches:</h4>
        {recommendations.map((candidate, index) => (
          <CandidateCard key={candidate.id}>
            <div>
              <strong>{candidate.firstName} {candidate.lastName}</strong>
              <br />
              <span style={{ color: '#7f8c8d' }}>{candidate.jobTitle}</span>
              <br />
              <span style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
                {candidate.location} • {candidate.yearsOfExperience} years experience
              </span>
            </div>
            <MatchScore score={candidate.matchScore}>
              {candidate.matchScore}% Match
            </MatchScore>
          </CandidateCard>
        ))}
      </Section>

      <Section>
        <SectionTitle>Current Data</SectionTitle>
        <p>📊 <strong>Jobs Available:</strong> {mockJobs.length}</p>
        <p>👥 <strong>Job Seekers:</strong> {mockJobSeekers.length}</p>
        <p>🏢 <strong>Organizations:</strong> {new Set(mockJobs.map(job => job.organizationId)).size}</p>
      </Section>

      <Section>
        <SectionTitle>Next Steps</SectionTitle>
        <p>This demo shows the core matching engine working! Next steps include:</p>
        <ul>
          <li>Building user authentication and role-based routing</li>
          <li>Creating dashboards for each user type</li>
          <li>Adding job application workflows</li>
          <li>Implementing recruiter reporting features</li>
          <li>Adding real-time notifications</li>
        </ul>
      </Section>
    </Container>
  );
}

export default App;
