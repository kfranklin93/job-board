// src/components/daycare/CandidateManagementDashboard.tsx

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  CandidateApplication, 
  CandidateFilters, 
  CandidateSortOptions, 
  BulkAction,
  CandidateStats,
  ApplicationStatus 
} from '../../types/data';
import { mockCandidateApplications, mockCandidateStats } from '../../data/mockApplications';
import CandidateCard from './CandidateCard';
import FilterPanel from './FilterPanel';
import BulkActionsToolbar from './BulkActionsToolbar';
import CandidateDetailsModal from './CandidateDetailsModal';
import { Card } from '../common/ui';

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled(Card)`
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CandidatesSection = styled.div`
  min-height: 600px;
`;

const CandidatesHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 16px;
`;

const ResultsInfo = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  background: white;
  font-size: 14px;
  min-width: 160px;
`;

const CandidatesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${({ theme }) => theme.colors.text.secondary};

  h3 {
    margin: 0 0 8px 0;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

interface CandidateManagementDashboardProps {
  organizationId?: string;
}

const CandidateManagementDashboard: React.FC<CandidateManagementDashboardProps> = ({
  organizationId = 'org-001' // Default to Sunshine Daycare for demo
}) => {
  const [candidates] = useState<CandidateApplication[]>(mockCandidateApplications);
  const [stats] = useState<CandidateStats>(mockCandidateStats);
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [sortOptions, setSortOptions] = useState<CandidateSortOptions>({
    field: 'matchScore',
    direction: 'desc'
  });
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);
  const [isLoading] = useState(false);

  // Filter and sort candidates
  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate => {
      // Filter by organization
      if (candidate.job.organizationId !== organizationId) return false;

      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = [
          candidate.applicant.firstName,
          candidate.applicant.lastName,
          candidate.applicant.email,
          candidate.job.title,
          ...(candidate.applicant.skills || [])
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(query)) return false;
      }

      // Match score range filter
      if (filters.matchScoreRange) {
        const { min, max } = filters.matchScoreRange;
        if (candidate.matchScore < min || candidate.matchScore > max) return false;
      }

      // Application status filter
      if (filters.applicationStatus && filters.applicationStatus.length > 0) {
        if (!filters.applicationStatus.includes(candidate.application.status)) return false;
      }

      // Experience level filter (simplified)
      if (filters.experienceLevel && filters.experienceLevel.length > 0) {
        const years = candidate.applicant.yearsOfExperience || 0;
        const level = years < 2 ? 'Entry Level' : years < 5 ? 'Mid Level' : 'Senior Level';
        if (!filters.experienceLevel.includes(level)) return false;
      }

      return true;
    });

    // Sort candidates
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortOptions.field) {
        case 'matchScore':
          aValue = a.matchScore;
          bValue = b.matchScore;
          break;
        case 'appliedDate':
          aValue = new Date(a.application.appliedDate).getTime();
          bValue = new Date(b.application.appliedDate).getTime();
          break;
        case 'lastName':
          aValue = a.applicant.lastName;
          bValue = b.applicant.lastName;
          break;
        case 'experience':
          aValue = a.applicant.yearsOfExperience || 0;
          bValue = b.applicant.yearsOfExperience || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOptions.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOptions.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [candidates, filters, sortOptions, organizationId]);

  const handleFilterChange = (newFilters: CandidateFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, direction] = event.target.value.split('-') as [CandidateSortOptions['field'], CandidateSortOptions['direction']];
    setSortOptions({ field, direction });
  };

  const handleCandidateSelect = (candidateId: string, selected: boolean) => {
    const newSelected = new Set(selectedCandidates);
    if (selected) {
      newSelected.add(candidateId);
    } else {
      newSelected.delete(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCandidates(new Set(filteredAndSortedCandidates.map(c => c.id)));
    } else {
      setSelectedCandidates(new Set());
    }
  };

  const handleBulkAction = (action: BulkAction) => {
    console.log('Bulk action:', action, 'for candidates:', Array.from(selectedCandidates));
    // Here you would implement actual bulk actions
    // For demo purposes, we'll just log and clear selection
    setSelectedCandidates(new Set());
  };

  const handleCandidateClick = (candidate: CandidateApplication) => {
    setSelectedCandidate(candidate);
  };

  return (
    <DashboardContainer>
      <Header>
        <Title>Candidate Management</Title>
        <Subtitle>Review, filter, and manage job applicants</Subtitle>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Applicants</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.recentApplications}</StatValue>
          <StatLabel>New This Week</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{Math.round(stats.averageMatchScore)}%</StatValue>
          <StatLabel>Avg. Match Score</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.byStatus[ApplicationStatus.INTERVIEW_SCHEDULED]}</StatValue>
          <StatLabel>Interviews Scheduled</StatLabel>
        </StatCard>
      </StatsGrid>

      <MainContent>
        <FilterPanel
          filters={filters}
          onChange={handleFilterChange}
          stats={stats}
        />

        <CandidatesSection>
          <CandidatesHeader>
            <ResultsInfo>
              {filteredAndSortedCandidates.length} of {candidates.filter(c => c.job.organizationId === organizationId).length} candidates
            </ResultsInfo>
            <SortSelect value={`${sortOptions.field}-${sortOptions.direction}`} onChange={handleSortChange}>
              <option value="matchScore-desc">Best Match First</option>
              <option value="matchScore-asc">Lowest Match First</option>
              <option value="appliedDate-desc">Newest First</option>
              <option value="appliedDate-asc">Oldest First</option>
              <option value="lastName-asc">Name A-Z</option>
              <option value="lastName-desc">Name Z-A</option>
              <option value="experience-desc">Most Experience</option>
              <option value="experience-asc">Least Experience</option>
            </SortSelect>
          </CandidatesHeader>

          {selectedCandidates.size > 0 && (
            <BulkActionsToolbar
              selectedCount={selectedCandidates.size}
              onAction={handleBulkAction}
              onSelectAll={handleSelectAll}
              onClearSelection={() => setSelectedCandidates(new Set())}
            />
          )}

          {isLoading ? (
            <LoadingMessage>Loading candidates...</LoadingMessage>
          ) : filteredAndSortedCandidates.length === 0 ? (
            <EmptyState>
              <h3>No candidates found</h3>
              <p>Try adjusting your filters or check back later for new applications.</p>
            </EmptyState>
          ) : (
            <CandidatesList>
              {filteredAndSortedCandidates.map(candidate => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidates.has(candidate.id)}
                  onSelect={(selected) => handleCandidateSelect(candidate.id, selected)}
                  onClick={() => handleCandidateClick(candidate)}
                />
              ))}
            </CandidatesList>
          )}
        </CandidatesSection>
      </MainContent>

      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </DashboardContainer>
  );
};

export default CandidateManagementDashboard;
