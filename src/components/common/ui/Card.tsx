import React from 'react';
import styled, { css } from 'styled-components';

// --- Prop Types ---

// This interface is now the single source of truth for the Card's props.
interface CardProps {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'outlined';
  className?: string;
}

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';


// --- Styled Components ---

// FIX: Updated to use CardProps to receive the 'variant' prop.
const CardContainer = styled.div<Partial<CardProps>>`
  background-color: ${props => props.theme.colors.neutral.white};
  border-radius: ${props => props.theme.borders.radius.lg};
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
        return css`box-shadow: ${props.theme.shadows.md};`;
    }
  }}
  
  /* This style will now work correctly */
  ${({ variant, theme }) => variant === 'outlined' && css`
    border: 1px solid ${theme.colors.neutral.gray300};
    box-shadow: none;
  `}
`;

const CardHeaderContainer = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.neutral.gray200};
  font-weight: ${props => props.theme.typography.fontWeights.semiBold};
  font-size: ${props => props.theme.typography.sizes.lg};
  color: ${props => props.theme.colors.neutral.gray900};
`;

const CardBodyContainer = styled.div<{ padding: PaddingSize }>`
  ${({ theme, padding }) => {
    switch (padding) {
      case 'sm':
        return css`padding: ${theme.spacing.sm};`;
      case 'lg':
        return css`padding: ${theme.spacing.lg};`;
      case 'none':
        return css`padding: 0;`;
      case 'md':
      default:
        return css`padding: ${theme.spacing.md};`;
    }
  }}
`;

const CardFooterContainer = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.neutral.gray200};
  background-color: ${props => props.theme.colors.neutral.gray50};
`;


// --- React Components ---

// FIX: The Card component now uses the CardProps interface.
export const Card: React.FC<CardProps> = ({ 
  children, 
  elevation = 'medium', 
  variant = 'default', // <-- Now correctly accepts the variant prop
  className 
}) => {
  return (
    // And passes the variant prop down to the styled container
    <CardContainer elevation={elevation} variant={variant} className={className}>
      {children}
    </CardContainer>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <CardHeaderContainer className={className}>{children}</CardHeaderContainer>;
};

export const CardBody: React.FC<{
  children: React.ReactNode;
  padding?: PaddingSize;
  className?: string;
}> = ({ children, padding = 'md', className }) => {
  return (
    <CardBodyContainer padding={padding} className={className}>
      {children}
    </CardBodyContainer>
  );
};

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <CardFooterContainer className={className}>{children}</CardFooterContainer>;
};

export default Card;