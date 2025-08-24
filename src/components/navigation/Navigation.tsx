import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/data';

const Nav = styled.nav`
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  
  &:hover {
    color: #3498db;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#3498db' : '#666'};
  text-decoration: none;
  font-weight: ${props => props.$active ? '600' : '400'};
  padding: 0.5rem 0;
  border-bottom: 2px solid ${props => props.$active ? '#3498db' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: #3498db;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #3498db;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  background: none;
  border: none;
  padding: 0.75rem 1rem;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e0e0e0;
    padding: 1rem;
  }
`;

const RoleBadge = styled.span<{ $role: UserRole }>`
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
  background: ${props => {
    switch (props.$role) {
      case UserRole.SEEKER: return '#e3f2fd';
      case UserRole.DAYCARE: return '#e8f5e8';
      case UserRole.RECRUITER: return '#f3e5f5';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch (props.$role) {
      case UserRole.SEEKER: return '#1976d2';
      case UserRole.DAYCARE: return '#388e3c';
      case UserRole.RECRUITER: return '#7b1fa2';
      default: return '#666';
    }
  }};
`;

export const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    const commonLinks = [
      { path: '/dashboard', label: 'Dashboard' },
    ];

    switch (user.role) {
      case UserRole.SEEKER:
        return [
          ...commonLinks,
          { path: '/jobs', label: 'Browse Jobs' },
          { path: '/applications', label: 'My Applications' },
          { path: '/profile', label: 'Profile' },
        ];
      case UserRole.DAYCARE:
        return [
          ...commonLinks,
          { path: '/post-job', label: 'Post Job' },
          { path: '/candidates', label: 'Browse Candidates' },
          { path: '/my-jobs', label: 'My Job Posts' },
          { path: '/organization', label: 'Organization' },
        ];
      case UserRole.RECRUITER:
        return [
          ...commonLinks,
          { path: '/reports', label: 'Reports' },
          { path: '/candidates', label: 'Search Candidates' },
          { path: '/partners', label: 'Partner Daycares' },
          { path: '/analytics', label: 'Analytics' },
        ];
      default:
        return commonLinks;
    }
  };

  const navLinks = getNavLinks();
  const userInitials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case UserRole.SEEKER: return 'Job Seeker';
      case UserRole.DAYCARE: return 'Daycare';
      case UserRole.RECRUITER: return 'Recruiter';
      default: return 'User';
    }
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/dashboard">DayCare Connect</Logo>
        
        <NavLinks>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              $active={location.pathname === link.path}
            >
              {link.label}
            </NavLink>
          ))}
        </NavLinks>

        <UserMenu>
          <RoleBadge $role={user.role}>
            {getRoleLabel(user.role)}
          </RoleBadge>
          
          <UserButton onClick={() => setShowUserMenu(!showUserMenu)}>
            <UserAvatar>{userInitials}</UserAvatar>
            <span>{user.firstName}</span>
            <span style={{ fontSize: '0.8rem' }}>▼</span>
          </UserButton>

          <DropdownMenu $isOpen={showUserMenu}>
            <DropdownItem onClick={() => {
              setShowUserMenu(false);
              navigate('/profile');
            }}>
              My Profile
            </DropdownItem>
            <DropdownItem onClick={() => {
              setShowUserMenu(false);
              navigate('/settings');
            }}>
              Settings
            </DropdownItem>
            <DropdownItem onClick={handleLogout}>
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>

        <MobileMenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
          ☰
        </MobileMenuButton>
      </NavContainer>

      <MobileMenu $isOpen={showMobileMenu}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'block',
              padding: '0.75rem 0',
              color: location.pathname === link.path ? '#3498db' : '#666',
              textDecoration: 'none',
              fontWeight: location.pathname === link.path ? '600' : '400',
            }}
            onClick={() => setShowMobileMenu(false)}
          >
            {link.label}
          </Link>
        ))}
      </MobileMenu>
    </Nav>
  );
};

export default Navigation;
