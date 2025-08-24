// src/components/daycare/CandidateDetailsModal.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { CandidateApplication, ApplicationStatus } from '../../types/data';
import { Button } from '../common/ui';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 24px;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CandidateInfo = styled.div`
  flex: 1;
`;

const CandidateName = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const JobTitle = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
`;

const ContactInfo = styled.div`
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 16px;
`;

const StatusAndScore = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
`;

const StatusBadge = styled.span<{ status: ApplicationStatus }>`
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  background: ${({ status, theme }) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return theme.colors.info.light;
      case ApplicationStatus.REVIEWING: return theme.colors.warning.light;
      case ApplicationStatus.INTERVIEW_SCHEDULED: return theme.colors.primary.light;
      case ApplicationStatus.INTERVIEW_COMPLETED: return theme.colors.primary.main;
      case ApplicationStatus.OFFERED: return theme.colors.success.light;
      case ApplicationStatus.HIRED: return theme.colors.success.main;
      case ApplicationStatus.REJECTED: return theme.colors.error.light;
      case ApplicationStatus.WITHDRAWN: return theme.colors.text.disabled;
      default: return theme.colors.text.disabled;
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case ApplicationStatus.HIRED: return 'white';
      case ApplicationStatus.INTERVIEW_COMPLETED: return 'white';
      default: return theme.colors.text.primary;
    }
  }};
`;

const MatchScore = styled.div<{ score: number }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  
  .score {
    font-size: 18px;
    color: ${({ score, theme }) => {
      if (score >= 90) return theme.colors.success.main;
      if (score >= 80) return theme.colors.warning.main;
      if (score >= 70) return theme.colors.info.main;
      return theme.colors.error.main;
    }};
  }
`;

const ModalBody = styled.div`
  padding: 0 24px 24px 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const MatchBreakdown = styled.div`
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: 8px;
  padding: 20px;
`;

const BreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const BreakdownItem = styled.div`
  text-align: center;
`;

const BreakdownScore = styled.div<{ score: number }>`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
  color: ${({ score, theme }) => {
    if (score >= 80) return theme.colors.success.main;
    if (score >= 60) return theme.colors.warning.main;
    return theme.colors.error.main;
  }};
`;

const BreakdownLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: 500;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const SkillsColumn = styled.div``;

const SkillsSubtitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SkillTag = styled.span<{ isMatched?: boolean }>`
  background: ${({ isMatched, theme }) => 
    isMatched ? theme.colors.success.light : theme.colors.error.light};
  color: ${({ isMatched, theme }) => 
    isMatched ? theme.colors.success.dark : theme.colors.error.dark};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ExperienceItem = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 16px;
`;

const ExperienceHeader = styled.div`
  margin-bottom: 8px;
`;

const ExperienceTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const ExperienceCompany = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const ExperienceDates = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
`;

const ExperienceDescription = styled.div`
  font-size: 14px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: 0 0 12px 12px;
`;

interface CandidateDetailsModalProps {
  candidate: CandidateApplication;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  candidate,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'match' | 'experience'>('overview');

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'Applied';
      case ApplicationStatus.REVIEWING: return 'Under Review';
      case ApplicationStatus.INTERVIEW_SCHEDULED: return 'Interview Scheduled';
      case ApplicationStatus.INTERVIEW_COMPLETED: return 'Interview Completed';
      case ApplicationStatus.OFFERED: return 'Offer Extended';
      case ApplicationStatus.HIRED: return 'Hired';
      case ApplicationStatus.REJECTED: return 'Rejected';
      case ApplicationStatus.WITHDRAWN: return 'Withdrawn';
      default: return status;
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTop>
            <CandidateInfo>
              <CandidateName>
                {candidate.applicant.firstName} {candidate.applicant.lastName}
              </CandidateName>
              <JobTitle>Applied for: {candidate.job.title}</JobTitle>
              <ContactInfo>
                <span>{candidate.applicant.email}</span>
                <span>{candidate.applicant.phone}</span>
              </ContactInfo>
              <StatusAndScore>
                <StatusBadge status={candidate.application.status}>
                  {getStatusLabel(candidate.application.status)}
                </StatusBadge>
                <MatchScore score={candidate.matchScore}>
                  <span className="score">{Math.round(candidate.matchScore)}%</span>
                  <span>Match</span>
                </MatchScore>
              </StatusAndScore>
            </CandidateInfo>
            <CloseButton onClick={onClose}>×</CloseButton>
          </HeaderTop>
        </ModalHeader>

        <ModalBody>
          {candidate.matchBreakdown && (
            <Section>
              <SectionTitle>Match Score Breakdown</SectionTitle>
              <MatchBreakdown>
                <BreakdownGrid>
                  <BreakdownItem>
                    <BreakdownScore score={candidate.matchBreakdown.skills}>
                      {Math.round(candidate.matchBreakdown.skills)}%
                    </BreakdownScore>
                    <BreakdownLabel>Skills</BreakdownLabel>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownScore score={candidate.matchBreakdown.experience}>
                      {Math.round(candidate.matchBreakdown.experience)}%
                    </BreakdownScore>
                    <BreakdownLabel>Experience</BreakdownLabel>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownScore score={candidate.matchBreakdown.education}>
                      {Math.round(candidate.matchBreakdown.education)}%
                    </BreakdownScore>
                    <BreakdownLabel>Education</BreakdownLabel>
                  </BreakdownItem>
                  <BreakdownItem>
                    <BreakdownScore score={candidate.matchBreakdown.certifications}>
                      {Math.round(candidate.matchBreakdown.certifications)}%
                    </BreakdownScore>
                    <BreakdownLabel>Certifications</BreakdownLabel>
                  </BreakdownItem>
                </BreakdownGrid>

                <SkillsGrid>
                  <SkillsColumn>
                    <SkillsSubtitle>Matched Skills ({candidate.matchBreakdown.details.matchedSkills.length})</SkillsSubtitle>
                    <SkillsList>
                      {candidate.matchBreakdown.details.matchedSkills.map((skill, index) => (
                        <SkillTag key={index} isMatched={true}>{skill}</SkillTag>
                      ))}
                    </SkillsList>
                  </SkillsColumn>
                  <SkillsColumn>
                    <SkillsSubtitle>Missing Skills ({candidate.matchBreakdown.details.missingSkills.length})</SkillsSubtitle>
                    <SkillsList>
                      {candidate.matchBreakdown.details.missingSkills.map((skill, index) => (
                        <SkillTag key={index} isMatched={false}>{skill}</SkillTag>
                      ))}
                    </SkillsList>
                  </SkillsColumn>
                </SkillsGrid>
              </MatchBreakdown>
            </Section>
          )}

          <Section>
            <SectionTitle>Work Experience</SectionTitle>
            <ExperienceList>
              {candidate.applicant.experience?.map(exp => (
                <ExperienceItem key={exp.id}>
                  <ExperienceHeader>
                    <ExperienceTitle>{exp.title}</ExperienceTitle>
                    <ExperienceCompany>{exp.company}</ExperienceCompany>
                  </ExperienceHeader>
                  <ExperienceDates>
                    {exp.startDate} - {exp.endDate}
                  </ExperienceDates>
                  {exp.description && (
                    <ExperienceDescription>{exp.description}</ExperienceDescription>
                  )}
                  {exp.skills && exp.skills.length > 0 && (
                    <SkillsList style={{ marginTop: '12px' }}>
                      {exp.skills.map((skill, index) => (
                        <SkillTag key={index} isMatched={candidate.matchBreakdown?.details.matchedSkills.includes(skill)}>
                          {skill}
                        </SkillTag>
                      ))}
                    </SkillsList>
                  )}
                </ExperienceItem>
              )) || <div>No experience information provided.</div>}
            </ExperienceList>
          </Section>

          <Section>
            <SectionTitle>Education</SectionTitle>
            {candidate.applicant.education?.map(edu => (
              <ExperienceItem key={edu.id}>
                <ExperienceHeader>
                  <ExperienceTitle>{edu.degree}</ExperienceTitle>
                  <ExperienceCompany>{edu.institution}</ExperienceCompany>
                </ExperienceHeader>
                <ExperienceDates>Graduated {edu.graduationYear}</ExperienceDates>
              </ExperienceItem>
            )) || <div>No education information provided.</div>}
          </Section>

          <Section>
            <SectionTitle>Application Details</SectionTitle>
            <ExperienceItem>
              <ExperienceHeader>
                <ExperienceTitle>Applied Date</ExperienceTitle>
              </ExperienceHeader>
              <ExperienceDates>{formatDate(candidate.application.appliedDate)}</ExperienceDates>
              {candidate.application.notes && (
                <ExperienceDescription style={{ marginTop: '12px' }}>
                  <strong>Notes:</strong> {candidate.application.notes}
                </ExperienceDescription>
              )}
            </ExperienceItem>
          </Section>
        </ModalBody>

        <ActionButtons>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary">
            Schedule Interview
          </Button>
          <Button variant="primary">
            Send Message
          </Button>
        </ActionButtons>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CandidateDetailsModal;
