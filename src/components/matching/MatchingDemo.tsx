import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { calculateMatchScore, findBestJobMatches, MatchResult, JobMatch } from '../../services/api/candidateMatchingEngine';
import { mockJobSeekers } from '../../data/mockJobSeekers';
import { mockJobs } from '../../data/mockJobs';
import { UserProfile, Job } from '../../types/data';

const DemoContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  color: #5E35B1;
  margin-bottom: 1rem;
`;

const SelectContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const MatchCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #f9f9f9;
`;

const ScoreBar = styled.div<{ score: number }>`
  width: 100%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin: 0.5rem 0;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.score}%;
    background: ${props => {
      if (props.score >= 80) return '#4CAF50';
      if (props.score >= 60) return '#FFC107';
      return '#F44336';
    }};
    transition: width 0.3s ease;
  }
`;

const ScoreText = styled.span<{ score: number }>`
  font-weight: bold;
  color: ${props => {
    if (props.score >= 80) return '#4CAF50';
    if (props.score >= 60) return '#FFA000';
    return '#F44336';
  }};
`;

const BreakdownContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const BreakdownItem = styled.div`
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  text-align: center;
`;

const SkillsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
`;

const SkillItem = styled.li<{ matched: boolean }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin: 0.25rem;
  border-radius: 12px;
  font-size: 0.875rem;
  background: ${props => props.matched ? '#E8F5E8' : '#FFEBEE'};
  color: ${props => props.matched ? '#2E7D32' : '#C62828'};
  border: 1px solid ${props => props.matched ? '#4CAF50' : '#F44336'};
`;

const JobList = styled.div`
  display: grid;
  gap: 1rem;
`;

const JobCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: white;
`;

export const MatchingDemo: React.FC = () => {
  const [selectedCandidate, setSelectedCandidate] = useState<UserProfile>(mockJobSeekers[0]);
  const [selectedJob, setSelectedJob] = useState<Job>(mockJobs[0]);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);

  // Calculate match when selections change
  useEffect(() => {
    if (selectedCandidate && selectedJob) {
      const result = calculateMatchScore(selectedJob, selectedCandidate);
      setMatchResult(result);
    }
  }, [selectedCandidate, selectedJob]);

  // Find best job matches for candidate
  useEffect(() => {
    if (selectedCandidate) {
      const matches = findBestJobMatches(selectedCandidate, mockJobs, 5);
      setJobMatches(matches);
    }
  }, [selectedCandidate]);

  return (
    <DemoContainer>
      <Title>Smart Candidate Matching Engine Demo</Title>
      
      {/* Individual Match Section */}
      <Section>
        <SectionTitle>Individual Job-Candidate Match</SectionTitle>
        
        <SelectContainer>
          <div>
            <label>Select Candidate: </label>
            <Select
              value={selectedCandidate.id}
              onChange={(e) => {
                const candidate = mockJobSeekers.find(c => c.id === e.target.value);
                if (candidate) setSelectedCandidate(candidate);
              }}
            >
              {mockJobSeekers.map(candidate => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.firstName} {candidate.lastName} - {candidate.jobTitle}
                </option>
              ))}
            </Select>
          </div>
          
          <div>
            <label>Select Job: </label>
            <Select
              value={selectedJob.id}
              onChange={(e) => {
                const job = mockJobs.find(j => j.id === e.target.value);
                if (job) setSelectedJob(job);
              }}
            >
              {mockJobs.map(job => (
                <option key={job.id} value={job.id}>
                  {job.title} at {job.organizationName}
                </option>
              ))}
            </Select>
          </div>
        </SelectContainer>

        {matchResult && (
          <MatchCard>
            <h3>Match Result</h3>
            <div>
              <strong>Overall Score: </strong>
              <ScoreText score={matchResult.score}>{matchResult.score}/100</ScoreText>
            </div>
            <ScoreBar score={matchResult.score} />
            
            <BreakdownContainer>
              <BreakdownItem>
                <strong>Skills</strong><br />
                <ScoreText score={matchResult.breakdown.skills}>
                  {matchResult.breakdown.skills}/100
                </ScoreText>
              </BreakdownItem>
              <BreakdownItem>
                <strong>Experience</strong><br />
                <ScoreText score={matchResult.breakdown.experience}>
                  {matchResult.breakdown.experience}/100
                </ScoreText>
              </BreakdownItem>
              <BreakdownItem>
                <strong>Years</strong><br />
                <ScoreText score={matchResult.breakdown.yearsOfExperience}>
                  {matchResult.breakdown.yearsOfExperience}/100
                </ScoreText>
              </BreakdownItem>
              <BreakdownItem>
                <strong>Education</strong><br />
                <ScoreText score={matchResult.breakdown.education}>
                  {matchResult.breakdown.education}/100
                </ScoreText>
              </BreakdownItem>
              <BreakdownItem>
                <strong>Certifications</strong><br />
                <ScoreText score={matchResult.breakdown.certifications}>
                  {matchResult.breakdown.certifications}/100
                </ScoreText>
              </BreakdownItem>
              <BreakdownItem>
                <strong>Job Type</strong><br />
                <ScoreText score={matchResult.breakdown.jobType}>
                  {matchResult.breakdown.jobType}/100
                </ScoreText>
              </BreakdownItem>
            </BreakdownContainer>
            
            <div style={{ marginTop: '1rem' }}>
              <h4>Skills Analysis</h4>
              <div>
                <strong>Matched Skills:</strong>
                <SkillsList>
                  {matchResult.details.matchedSkills.map(skill => (
                    <SkillItem key={skill} matched={true}>{skill}</SkillItem>
                  ))}
                </SkillsList>
              </div>
              {matchResult.details.missingSkills.length > 0 && (
                <div>
                  <strong>Missing Skills:</strong>
                  <SkillsList>
                    {matchResult.details.missingSkills.map(skill => (
                      <SkillItem key={skill} matched={false}>{skill}</SkillItem>
                    ))}
                  </SkillsList>
                </div>
              )}
            </div>
          </MatchCard>
        )}
      </Section>

      {/* Best Matches Section */}
      <Section>
        <SectionTitle>Best Job Matches for {selectedCandidate.firstName} {selectedCandidate.lastName}</SectionTitle>
        
        <JobList>
          {jobMatches.map((match, index) => (
            <JobCard key={match.job.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>
                    #{index + 1}: {match.job.title}
                  </h3>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                    {match.job.organizationName} - {match.job.location}
                  </p>
                  <p style={{ margin: '0', fontSize: '0.9rem' }}>
                    {match.job.salary} • {match.job.type}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <ScoreText score={match.matchResult.score}>
                    {match.matchResult.score}%
                  </ScoreText>
                  <ScoreBar score={match.matchResult.score} style={{ width: '100px' }} />
                </div>
              </div>
              
              <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                <strong>Key Strengths: </strong>
                {match.matchResult.details.matchedSkills.slice(0, 3).join(', ')}
                {match.matchResult.details.matchedSkills.length > 3 && ' ...'}
              </div>
            </JobCard>
          ))}
        </JobList>
      </Section>
    </DemoContainer>
  );
};

export default MatchingDemo;
