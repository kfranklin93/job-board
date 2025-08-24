import React from 'react';
import styled, { css } from 'styled-components';
import { theme } from '../../../styles/theme';

// --- Prop Types ---

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevation?: 'low' | 'medium' | 'high';
  variant?: 'default' | 'outlined';
}

type PaddingSize = 'none' | 'sm' | 'md' | 'lg';


// --- Styled Components ---

const CardContainer = styled.div<Partial<CardProps>>`
  /* FIX: 'white' is inside the 'neutral' color object */
  background-color: ${theme.colors.neutral.white};
  border-radius: ${theme.borders.radius.lg};
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
        /* FIX: The 'base' shadow was renamed to 'md' in your theme */
        return css`box-shadow: ${props.theme.shadows.md};`;
    }
  }}
  
  /* Variant for an outlined style */
  ${({ variant, theme }) => variant === 'outlined' && css`
    /* FIX: All gray colors are inside the 'neutral' object */
    border: 1px solid ${theme.colors.neutral.gray300};
    box-shadow: none;
  `}
`;

const CardHeaderContainer = styled.div`
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  /* FIX: All gray colors are inside the 'neutral' object */
  border-bottom: 1px solid ${theme.colors.neutral.gray200};
  font-weight: ${theme.typography.fontWeights.semiBold};
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.neutral.gray900};
`;

const CardBodyContainer = styled.div<{ padding: PaddingSize }>`
  ${({ padding, theme }) => {
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
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  /* FIX: All gray colors are inside the 'neutral' object */
  border-top: 1px solid ${theme.colors.neutral.gray200};
  background-color: ${theme.colors.neutral.gray50};
`;


// --- React Components ---

export const Card: React.FC<CardProps> = ({ 
  children, 
  elevation = 'medium', 
  variant = 'default',
  ...props 
}) => {
  return (
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