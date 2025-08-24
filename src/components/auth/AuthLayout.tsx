import React from 'react';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: white;
  
  h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 700;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }
`;

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title = 'DayCare Connect',
  subtitle = 'Connecting childcare professionals with opportunities',
}) => {
  return (
    <LayoutContainer>
      <ContentWrapper>
        <Header>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </Header>
        {children}
      </ContentWrapper>
    </LayoutContainer>
  );
};

export default AuthLayout;
