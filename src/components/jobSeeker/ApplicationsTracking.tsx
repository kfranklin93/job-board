import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { format, differenceInDays } from 'date-fns';
import { Application, ApplicationStatus } from '../../types/data';
import { Button } from '../common/ui';

const TrackingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #5E35B1;
  margin-bottom: 0.5rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div<{ color?: string }>`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.color || '#5E35B1'};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.875rem;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #eee;
`;

const FilterTab = styled.button<{ active: boolean }>`
  background: none;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-bottom: 3px solid ${props => props.active ? '#5E35B1' : 'transparent'};
  color: ${props => props.active ? '#5E35B1' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s;
  
  &:hover {
    color: #5E35B1;
  }
`;

const ApplicationsList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ApplicationCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const JobInfo = styled.div`
  flex: 1;
`;

const JobTitle = styled.h3`
  color: #333;
  margin-bottom: 0.25rem;
  font-size: 1.25rem;
`;

const CompanyName = styled.p`
  color: #666;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const JobMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #666;
`;

const StatusBadge = styled.div<{ status: ApplicationStatus }>`
  background: ${props => {
    switch (props.status) {
      case ApplicationStatus.APPLIED: return '#E3F2FD';
      case ApplicationStatus.REVIEWING: return '#FFF3E0';
      case ApplicationStatus.INTERVIEW_SCHEDULED: return '#F3E5F5';
      case ApplicationStatus.INTERVIEW_COMPLETED: return '#E8F5E8';
      case ApplicationStatus.OFFERED: return '#E8F5E8';
      case ApplicationStatus.HIRED: return '#C8E6C9';
      case ApplicationStatus.REJECTED: return '#FFEBEE';
      case ApplicationStatus.WITHDRAWN: return '#F5F5F5';
      default: return '#F5F5F5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case ApplicationStatus.APPLIED: return '#1976D2';
      case ApplicationStatus.REVIEWING: return '#F57C00';
      case ApplicationStatus.INTERVIEW_SCHEDULED: return '#7B1FA2';
      case ApplicationStatus.INTERVIEW_COMPLETED: return '#388E3C';
      case ApplicationStatus.OFFERED: return '#388E3C';
      case ApplicationStatus.HIRED: return '#2E7D32';
      case ApplicationStatus.REJECTED: return '#D32F2F';
      case ApplicationStatus.WITHDRAWN: return '#616161';
      default: return '#616161';
    }
  }};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  min-width: 120px;
`;

const Timeline = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
`;

const TimelineTitle = styled.h4`
  color: #333;
  margin-bottom: 1rem;
`;

const TimelineEvent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
`;

const EventIcon = styled.div<{ status: ApplicationStatus }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.status) {
      case ApplicationStatus.APPLIED: return '#2196F3';
      case ApplicationStatus.REVIEWING: return '#FF9800';
      case ApplicationStatus.INTERVIEW_SCHEDULED: return '#9C27B0';
      case ApplicationStatus.HIRED: return '#4CAF50';
      case ApplicationStatus.REJECTED: return '#F44336';
      default: return '#757575';
    }
  }};
  color: white;
  font-size: 0.875rem;
`;

const EventDetails = styled.div`
  flex: 1;
`;

const EventTitle = styled.div`
  font-weight: 500;
  color: #333;
`;

const EventDate = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

// Mock applications data
const mockApplications: Application[] = [
  {
    id: 'app1',
    jobId: 'job1',
    jobTitle: 'Lead Preschool Teacher',
    organizationId: 'org1',
    organizationName: 'Sunshine Learning Academy',
    organizationLogo: '',
    applicantId: '1',
    applicantName: 'Sarah Johnson',
    applicantEmail: 'sarah.johnson@example.com',
    applicantPhone: '(555) 123-4567',
    status: ApplicationStatus.INTERVIEW_SCHEDULED,
    appliedDate: '2024-08-20T10:00:00Z',
    lastUpdated: '2024-08-23T14:30:00Z',
    notes: 'Impressive background in curriculum development'
  },
  {
    id: 'app2',
    jobId: 'job3',
    jobTitle: 'Assistant Teacher',
    organizationId: 'org1',
    organizationName: 'Sunshine Learning Academy',
    applicantId: '1',
    applicantName: 'Sarah Johnson',
    applicantEmail: 'sarah.johnson@example.com',
    applicantPhone: '(555) 123-4567',
    status: ApplicationStatus.OFFERED,
    appliedDate: '2024-08-18T09:15:00Z',
    lastUpdated: '2024-08-24T11:00:00Z',
    notes: 'Strong candidate, made offer'
  },
  {
    id: 'app3',
    jobId: 'job2',
    jobTitle: 'Special Education Teacher',
    organizationId: 'org2',
    organizationName: 'Rainbow Kids Development Center',
    applicantId: '1',
    applicantName: 'Sarah Johnson',
    applicantEmail: 'sarah.johnson@example.com',
    applicantPhone: '(555) 123-4567',
    status: ApplicationStatus.REVIEWING,
    appliedDate: '2024-08-22T16:45:00Z',
    lastUpdated: '2024-08-22T16:45:00Z'
  }
];

const getStatusIcon = (status: ApplicationStatus): string => {
  switch (status) {
    case ApplicationStatus.APPLIED: return '📝';
    case ApplicationStatus.REVIEWING: return '👀';
    case ApplicationStatus.INTERVIEW_SCHEDULED: return '📅';
    case ApplicationStatus.INTERVIEW_COMPLETED: return '✅';
    case ApplicationStatus.OFFERED: return '🎉';
    case ApplicationStatus.HIRED: return '🎊';
    case ApplicationStatus.REJECTED: return '❌';
    case ApplicationStatus.WITHDRAWN: return '🔙';
    default: return '📄';
  }
};

const getTimelineEvents = (application: Application) => {
  const events = [
    {
      status: ApplicationStatus.APPLIED,
      title: 'Application Submitted',
      date: application.appliedDate
    }
  ];
  
  if (application.status !== ApplicationStatus.APPLIED) {
    events.push({
      status: application.status,
      title: application.status.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase()),
      date: application.lastUpdated
    });
  }
  
  return events;
};

export const ApplicationsTracking: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [activeFilter, setActiveFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(applications);

  // Filter applications based on active filter
  useEffect(() => {
    if (activeFilter === 'ALL') {
      setFilteredApplications(applications);
    } else {
      setFilteredApplications(applications.filter(app => app.status === activeFilter));
    }
  }, [applications, activeFilter]);

  // Calculate statistics
  const stats = {
    total: applications.length,
    inReview: applications.filter(app => 
      app.status === ApplicationStatus.REVIEWING || 
      app.status === ApplicationStatus.APPLIED
    ).length,
    interviews: applications.filter(app => 
      app.status === ApplicationStatus.INTERVIEW_SCHEDULED ||
      app.status === ApplicationStatus.INTERVIEW_COMPLETED
    ).length,
    offers: applications.filter(app => app.status === ApplicationStatus.OFFERED).length
  };

  const withdrawApplication = (applicationId: string) => {
    setApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: ApplicationStatus.WITHDRAWN, lastUpdated: new Date().toISOString() }
          : app
      )
    );
  };

  const statusFilters = [
    { key: 'ALL', label: 'All Applications', count: stats.total },
    { key: ApplicationStatus.APPLIED, label: 'Applied', count: applications.filter(a => a.status === ApplicationStatus.APPLIED).length },
    { key: ApplicationStatus.REVIEWING, label: 'In Review', count: applications.filter(a => a.status === ApplicationStatus.REVIEWING).length },
    { key: ApplicationStatus.INTERVIEW_SCHEDULED, label: 'Interview Scheduled', count: applications.filter(a => a.status === ApplicationStatus.INTERVIEW_SCHEDULED).length },
    { key: ApplicationStatus.OFFERED, label: 'Offers', count: applications.filter(a => a.status === ApplicationStatus.OFFERED).length },
  ];

  return (
    <TrackingContainer>
      <Header>
        <Title>My Applications</Title>
        <p style={{ color: '#666' }}>Track your job applications and interview progress</p>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Applications</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color="#FF9800">{stats.inReview}</StatValue>
          <StatLabel>Under Review</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color="#9C27B0">{stats.interviews}</StatValue>
          <StatLabel>Interviews</StatLabel>
        </StatCard>
        
        <StatCard>
          <StatValue color="#4CAF50">{stats.offers}</StatValue>
          <StatLabel>Offers Received</StatLabel>
        </StatCard>
      </StatsContainer>

      <FilterTabs>
        {statusFilters.map(filter => (
          <FilterTab
            key={filter.key}
            active={activeFilter === filter.key}
            onClick={() => setActiveFilter(filter.key as ApplicationStatus | 'ALL')}
          >
            {filter.label} ({filter.count})
          </FilterTab>
        ))}
      </FilterTabs>

      <ApplicationsList>
        {filteredApplications.map(application => (
          <ApplicationCard key={application.id}>
            <ApplicationHeader>
              <JobInfo>
                <JobTitle>{application.jobTitle}</JobTitle>
                <CompanyName>{application.organizationName}</CompanyName>
                <JobMeta>
                  <span>Applied {differenceInDays(new Date(), new Date(application.appliedDate))} days ago</span>
                  <span>•</span>
                  <span>Last updated {format(new Date(application.lastUpdated), 'MMM d, yyyy')}</span>
                </JobMeta>
              </JobInfo>
              
              <StatusBadge status={application.status}>
                {getStatusIcon(application.status)} {application.status.replace(/_/g, ' ')}
              </StatusBadge>
            </ApplicationHeader>

            <Timeline>
              <TimelineTitle>Application Timeline</TimelineTitle>
              {getTimelineEvents(application).map((event, index) => (
                <TimelineEvent key={index}>
                  <EventIcon status={event.status}>
                    {getStatusIcon(event.status)}
                  </EventIcon>
                  <EventDetails>
                    <EventTitle>{event.title}</EventTitle>
                    <EventDate>{format(new Date(event.date), 'MMM d, yyyy h:mm a')}</EventDate>
                  </EventDetails>
                </TimelineEvent>
              ))}
            </Timeline>

            <ActionButtons>
              <Button variant="outline" size="small">
                View Job Details
              </Button>
              
              {application.status === ApplicationStatus.INTERVIEW_SCHEDULED && (
                <Button variant="primary" size="small">
                  Confirm Interview
                </Button>
              )}
              
              {application.status === ApplicationStatus.OFFERED && (
                <>
                  <Button variant="primary" size="small">
                    Accept Offer
                  </Button>
                  <Button variant="outline" size="small">
                    Negotiate
                  </Button>
                </>
              )}
              
              {[ApplicationStatus.APPLIED, ApplicationStatus.REVIEWING].includes(application.status) && (
                <Button 
                  variant="text" 
                  size="small"
                  onClick={() => withdrawApplication(application.id)}
                >
                  Withdraw Application
                </Button>
              )}
            </ActionButtons>

            {application.notes && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '1rem', 
                background: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: '#666'
              }}>
                <strong>Recruiter Notes:</strong> {application.notes}
              </div>
            )}
          </ApplicationCard>
        ))}
        
        {filteredApplications.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem',
            color: '#666',
            background: 'white',
            borderRadius: '12px'
          }}>
            <h3>No applications found</h3>
            <p>
              {activeFilter === 'ALL' 
                ? "You haven't applied to any jobs yet. Start exploring opportunities!"
                : `No applications with status: ${activeFilter.replace(/_/g, ' ')}`
              }
            </p>
            <Button style={{ marginTop: '1rem' }}>
              Browse Jobs
            </Button>
          </div>
        )}
      </ApplicationsList>
    </TrackingContainer>
  );
};

export default ApplicationsTracking;
