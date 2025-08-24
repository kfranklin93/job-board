import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from './context/AuthContext';
import { theme } from './styles/theme';

// Auth components
import { AuthLayout } from './components/auth/AuthLayout';
import { LoginForm } from './components/auth/LoginForm';
import { RegistrationForm } from './components/auth/RegistrationForm';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Navigation
import { Navigation } from './components/navigation/Navigation';

// Dashboards
import { Dashboard } from './components/dashboards/Dashboard';

// Layout components
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const MainContent = styled.main`
  min-height: calc(100vh - 64px); // Subtract navigation height
`;

const UnauthorizedPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  
  h1 {
    color: #e74c3c;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const NotFoundPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  
  h1 {
    color: #34495e;
    margin-bottom: 1rem;
  }
  
  p {
    color: #666;
    margin-bottom: 2rem;
  }
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    background: #2980b9;
  }
`;

// Placeholder components for future implementation
const JobsPage = () => <div style={{ padding: '2rem' }}>Jobs Page - Coming Soon</div>;
const ApplicationsPage = () => <div style={{ padding: '2rem' }}>Applications Page - Coming Soon</div>;
const ProfilePage = () => <div style={{ padding: '2rem' }}>Profile Page - Coming Soon</div>;
const PostJobPage = () => <div style={{ padding: '2rem' }}>Post Job Page - Coming Soon</div>;
const CandidatesPage = () => <div style={{ padding: '2rem' }}>Candidates Page - Coming Soon</div>;
const MyJobsPage = () => <div style={{ padding: '2rem' }}>My Jobs Page - Coming Soon</div>;
const OrganizationPage = () => <div style={{ padding: '2rem' }}>Organization Page - Coming Soon</div>;
const ReportsPage = () => <div style={{ padding: '2rem' }}>Reports Page - Coming Soon</div>;
const PartnersPage = () => <div style={{ padding: '2rem' }}>Partners Page - Coming Soon</div>;
const AnalyticsPage = () => <div style={{ padding: '2rem' }}>Analytics Page - Coming Soon</div>;
const SettingsPage = () => <div style={{ padding: '2rem' }}>Settings Page - Coming Soon</div>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContainer>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <AuthLayout>
                  <LoginForm />
                </AuthLayout>
              } />
              
              <Route path="/register" element={
                <AuthLayout>
                  <RegistrationForm />
                </AuthLayout>
              } />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <Dashboard />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <ProfilePage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <SettingsPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/jobs" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <JobsPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/applications" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <ApplicationsPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/post-job" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <PostJobPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/candidates" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <CandidatesPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/my-jobs" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <MyJobsPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/organization" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <OrganizationPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <ReportsPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/partners" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <PartnersPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Navigation />
                  <MainContent>
                    <AnalyticsPage />
                  </MainContent>
                </ProtectedRoute>
              } />
              
              {/* Root redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Unauthorized access page */}
              <Route path="/unauthorized" element={
                <UnauthorizedPage>
                  <h1>Access Denied</h1>
                  <p>You don't have permission to access this page.</p>
                  <Button onClick={() => window.location.href = '/dashboard'}>
                    Go to Dashboard
                  </Button>
                </UnauthorizedPage>
              } />
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AppContainer>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
