import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/data';
import JobSeekerDashboard from './JobSeekerDashboard';
import DaycareDashboard from './DaycareDashboard';
import RecruiterDashboard from './RecruiterDashboard';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  switch (user.role) {
    case UserRole.SEEKER:
      return <JobSeekerDashboard />;
    case UserRole.DAYCARE:
      return <DaycareDashboard />;
    case UserRole.RECRUITER:
      return <RecruiterDashboard />;
    default:
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh' 
        }}>
          <div>Unknown user role</div>
        </div>
      );
  }
};

export default Dashboard;
