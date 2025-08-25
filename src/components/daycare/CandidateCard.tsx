// src/components/daycare/CandidateCard.tsx

import React from 'react';
import styled from 'styled-components';
import { CandidateApplication, ApplicationStatus } from '../../types/data';
import { Card } from '../common/ui';

const CardContainer = styled.div<{ isSelected: boolean }>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  cursor: pointer;
  border: 2px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary.main : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.light};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const CandidateInfo = styled.div`
  flex: 1;
`;

const SelectCheckbox = styled.input`
  width: 18px;
  height: 18px;
  margin-right: 12px;
  cursor: pointer;
`;

const MatchScore = styled.div<{ score: number }>`
  background: ${({ score, theme }) => {
    if (score >= 90) return theme.colors.success.main;
    if (score >= 80) return theme.colors.warning.main;
    if (score >= 70) return theme.colors.info.main;
    return theme.colors.error.main;
  }};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-left: 12px;
`;

const CandidateName = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const JobTitle = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const ContactInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 12px;
`;

const StatusBadge = styled.span<{ status: ApplicationStatus }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
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
      default: return theme.colors.text.primary;
    }
  }};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const Tag = styled.span`
  background: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const SkillsPreview = styled.div`
  margin-bottom: 12px;
`;

const SkillsLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 4px;
  font-weight: 500;
`;

const SkillsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Skill = styled.span<{ isMatched?: boolean }>`
  background: ${({ isMatched, theme }) => 
    isMatched ? theme.colors.success.light : theme.colors.background.light};
  color: ${({ isMatched, theme }) => 
    isMatched ? theme.colors.success.dark : theme.colors.text.secondary};
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-top: 12px;
`;

const AppliedDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const InterviewInfo = styled.div`
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: 500;
`;

interface CandidateCardProps {
  candidate: CandidateApplication;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onClick: () => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isSelected,
  onSelect,
  onClick
}) => {
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(e.target.checked);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
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

  const matchedSkills = candidate.matchBreakdown?.details.matchedSkills || [];
  const skillsToShow = candidate.applicant.skills?.slice(0, 6) || [];

  return (
    <CardContainer isSelected={isSelected} onClick={onClick}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
          <SelectCheckbox
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            onClick={handleCheckboxClick}
          />
          <CandidateInfo>
            <CandidateName>
              {candidate.applicant.firstName} {candidate.applicant.lastName}
            </CandidateName>
            <JobTitle>Applied for: {candidate.job.title}</JobTitle>
            <ContactInfo>
              {candidate.applicant.email} • {candidate.applicant.phone}
            </ContactInfo>
            <StatusBadge status={candidate.application.status}>
              {getStatusLabel(candidate.application.status)}
            </StatusBadge>
          </CandidateInfo>
        </div>
        <MatchScore score={candidate.matchScore}>
          {Math.round(candidate.matchScore)}%
        </MatchScore>
      </CardHeader>

      {candidate.tags && candidate.tags.length > 0 && (
        <TagsContainer>
          {candidate.tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>
      )}

      {skillsToShow.length > 0 && (
        <SkillsPreview>
          <SkillsLabel>Skills ({candidate.applicant.skills?.length || 0})</SkillsLabel>
          <SkillsList>
            {skillsToShow.map((skill, index) => (
              <Skill 
                key={index} 
                isMatched={matchedSkills.includes(skill)}
              >
                {skill}
              </Skill>
            ))}
            {(candidate.applicant.skills?.length || 0) > 6 && (
              <Skill>+{(candidate.applicant.skills?.length || 0) - 6} more</Skill>
            )}
          </SkillsList>
        </SkillsPreview>
      )}

      <CardFooter>
        <AppliedDate>
          Applied {formatDate(candidate.application.appliedDate)}
        </AppliedDate>
        {candidate.interviewScheduled && candidate.interviewDate && (
          <InterviewInfo>
            Interview: {formatDate(candidate.interviewDate)}
          </InterviewInfo>
        )}
      </CardFooter>
    </CardContainer>
  );
};

export default CandidateCard;
