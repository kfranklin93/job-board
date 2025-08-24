// src/components/daycare/FilterPanel.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { CandidateFilters, CandidateStats, ApplicationStatus, JobType } from '../../types/data';
import { Card, Input, Button } from '../common/ui';

const FilterContainer = styled(Card)`
  padding: 20px;
  position: sticky;
  top: 20px;
  height: fit-content;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FilterTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary.main};
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary.light};
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const FilterLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 8px;
`;

const RangeInputs = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RangeInput = styled(Input)`
  flex: 1;
  min-width: 0;
`;

const RangeSeparator = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 14px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const StatusBadge = styled.span<{ status: ApplicationStatus }>`
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  margin-left: auto;
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

const CollapsibleSection = styled.div<{ isOpen: boolean }>`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin-bottom: 16px;
`;

const CollapsibleHeader = styled.div`
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.background.light};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  font-size: 14px;
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.main};
  }
`;

const CollapsibleContent = styled.div<{ isOpen: boolean }>`
  padding: ${({ isOpen }) => isOpen ? '16px' : '0'};
  max-height: ${({ isOpen }) => isOpen ? '300px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const ExpandIcon = styled.span<{ isOpen: boolean }>`
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.3s ease;
`;

interface FilterPanelProps {
  filters: CandidateFilters;
  onChange: (filters: CandidateFilters) => void;
  stats: CandidateStats;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onChange, stats }) => {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['basic', 'status']));

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...filters,
      searchQuery: e.target.value || undefined
    });
  };

  const handleMatchScoreChange = (field: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value);
    onChange({
      ...filters,
      matchScoreRange: {
        min: field === 'min' ? numValue || 0 : filters.matchScoreRange?.min || 0,
        max: field === 'max' ? numValue || 100 : filters.matchScoreRange?.max || 100
      }
    });
  };

  const handleStatusChange = (status: ApplicationStatus, checked: boolean) => {
    const currentStatuses = filters.applicationStatus || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    onChange({
      ...filters,
      applicationStatus: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleExperienceLevelChange = (level: string, checked: boolean) => {
    const currentLevels = filters.experienceLevel || [];
    const newLevels = checked
      ? [...currentLevels, level]
      : currentLevels.filter(l => l !== level);
    
    onChange({
      ...filters,
      experienceLevel: newLevels.length > 0 ? newLevels : undefined
    });
  };

  const handleAvailabilityChange = (type: JobType, checked: boolean) => {
    const currentTypes = filters.availability || [];
    const newTypes = checked
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onChange({
      ...filters,
      availability: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleClearFilters = () => {
    onChange({});
  };

  const toggleSection = (section: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(section)) {
      newOpen.delete(section);
    } else {
      newOpen.add(section);
    }
    setOpenSections(newOpen);
  };

  const hasActiveFilters = !!(
    filters.searchQuery ||
    filters.matchScoreRange ||
    filters.applicationStatus?.length ||
    filters.experienceLevel?.length ||
    filters.availability?.length
  );

  return (
    <FilterContainer>
      <FilterHeader>
        <FilterTitle>Filters</FilterTitle>
        {hasActiveFilters && (
          <ClearButton onClick={handleClearFilters}>
            Clear All
          </ClearButton>
        )}
      </FilterHeader>

      <CollapsibleSection isOpen={openSections.has('basic')}>
        <CollapsibleHeader onClick={() => toggleSection('basic')}>
          Search & Score
          <ExpandIcon isOpen={openSections.has('basic')}>▼</ExpandIcon>
        </CollapsibleHeader>
        <CollapsibleContent isOpen={openSections.has('basic')}>
          <FilterSection>
            <FilterLabel>Search Candidates</FilterLabel>
            <Input
              type="text"
              placeholder="Name, email, skills..."
              value={filters.searchQuery || ''}
              onChange={handleSearchChange}
            />
          </FilterSection>

          <FilterSection>
            <FilterLabel>Match Score Range</FilterLabel>
            <RangeInputs>
              <RangeInput
                type="number"
                placeholder="Min"
                min="0"
                max="100"
                value={filters.matchScoreRange?.min || ''}
                onChange={(e) => handleMatchScoreChange('min', e.target.value)}
              />
              <RangeSeparator>to</RangeSeparator>
              <RangeInput
                type="number"
                placeholder="Max"
                min="0"
                max="100"
                value={filters.matchScoreRange?.max || ''}
                onChange={(e) => handleMatchScoreChange('max', e.target.value)}
              />
            </RangeInputs>
          </FilterSection>
        </CollapsibleContent>
      </CollapsibleSection>

      <CollapsibleSection isOpen={openSections.has('status')}>
        <CollapsibleHeader onClick={() => toggleSection('status')}>
          Application Status
          <ExpandIcon isOpen={openSections.has('status')}>▼</ExpandIcon>
        </CollapsibleHeader>
        <CollapsibleContent isOpen={openSections.has('status')}>
          <CheckboxGroup>
            {Object.values(ApplicationStatus).map(status => (
              <CheckboxItem key={status}>
                <Checkbox
                  checked={filters.applicationStatus?.includes(status) || false}
                  onChange={(e) => handleStatusChange(status, e.target.checked)}
                />
                {status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                <StatusBadge status={status}>
                  {stats.byStatus[status] || 0}
                </StatusBadge>
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CollapsibleContent>
      </CollapsibleSection>

      <CollapsibleSection isOpen={openSections.has('experience')}>
        <CollapsibleHeader onClick={() => toggleSection('experience')}>
          Experience Level
          <ExpandIcon isOpen={openSections.has('experience')}>▼</ExpandIcon>
        </CollapsibleHeader>
        <CollapsibleContent isOpen={openSections.has('experience')}>
          <CheckboxGroup>
            {['Entry Level', 'Mid Level', 'Senior Level'].map(level => (
              <CheckboxItem key={level}>
                <Checkbox
                  checked={filters.experienceLevel?.includes(level) || false}
                  onChange={(e) => handleExperienceLevelChange(level, e.target.checked)}
                />
                {level}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CollapsibleContent>
      </CollapsibleSection>

      <CollapsibleSection isOpen={openSections.has('availability')}>
        <CollapsibleHeader onClick={() => toggleSection('availability')}>
          Job Type Preference
          <ExpandIcon isOpen={openSections.has('availability')}>▼</ExpandIcon>
        </CollapsibleHeader>
        <CollapsibleContent isOpen={openSections.has('availability')}>
          <CheckboxGroup>
            {Object.values(JobType).map(type => (
              <CheckboxItem key={type}>
                <Checkbox
                  checked={filters.availability?.includes(type) || false}
                  onChange={(e) => handleAvailabilityChange(type, e.target.checked)}
                />
                {type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </CheckboxItem>
            ))}
          </CheckboxGroup>
        </CollapsibleContent>
      </CollapsibleSection>
    </FilterContainer>
  );
};

export default FilterPanel;
