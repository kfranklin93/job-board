import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme'; // Assuming this is the correct path to your theme

// --- Prop Types ---

// This now extends all standard HTML attributes for a <div>, making it fully flexible.
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'outlined';
}

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';


// --- Styled Components ---

const CardContainer = styled.div<Partial<CardProps>>`
  background-color: ${theme.colors.white};
  border-radius: 8px; /* Example value */
  overflow: hidden;
  position: relative;
  
  /* Shadow based on elevation */
  ${props => {
    switch (props.elevation) {
      case 'low':
        return css`box-shadow: ${props.theme.shadows.sm};`;
      case 'high':
        return css`box-shadow: ${props.theme.shadows.lg};`;
      case 'medium':
      default:
        return css`box-shadow: ${props.theme.shadows.base};`; /* Using base for medium */
    }
  }}
  
  /* Variant for an outlined style */
  ${({ variant, theme }) => variant === 'outlined' && css`
    border: 1px solid ${theme.colors.gray[300]}; /* Example value */
    box-shadow: none;
  `}
`;

const CardHeaderContainer = styled.div`
  padding: 1rem 1.5rem; /* Example values */
  border-bottom: 1px solid ${theme.colors.gray[200]};
  font-weight: 600; /* Example value */
  font-size: 1.125rem; /* Example value */
  color: ${theme.colors.gray[900]};
`;

const CardBodyContainer = styled.div<{ padding: PaddingSize }>`
  ${({ padding }) => {
    switch (padding) {
      case 'sm':
        return css`padding: 0.75rem;`;
      case 'lg':
        return css`padding: 1.5rem;`;
      case 'none':
        return css`padding: 0;`;
      case 'md':
      default:
        return css`padding: 1rem;`;
    }
  }}
`;

const CardFooterContainer = styled.div`
  padding: 0.75rem 1rem; /* Example values */
  border-top: 1px solid ${theme.colors.gray[200]};
  background-color: ${theme.colors.gray[50]};
`;


// --- React Components ---

export const Card: React.FC<CardProps> = ({ 
  children, 
  elevation = 'medium', 
  variant = 'default',
  // The '...props' here collects any other passed-in props, like onClick, id, etc.
  ...props 
}) => {
  return (
    // We pass elevation and variant for styling, and spread {...props} onto the container.
    <CardContainer elevation={elevation} variant={variant} {...props}>
      {children}
    </CardContainer>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className }) => {
  return <CardHeaderContainer className={className}>{children}</CardHeaderContainer>;
};

export const CardBody: React.FC<{ children: React.ReactNode; padding?: PaddingSize; className?: string; }> = ({ children, padding = 'md', className }) => {
  return <CardBodyContainer padding={padding} className={className}>{children}</CardBodyContainer>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string; }> = ({ children, className }) => {
  return <CardFooterContainer className={className}>{children}</CardFooterContainer>;
};