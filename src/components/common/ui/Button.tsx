import React from 'react';
import styled, { css } from 'styled-components';

// Types
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'gold' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isLoading?: boolean;
}

// Styled button with variants
const StyledButton = styled.button<{
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
}>`
  /* Base button styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${props => props.theme.typography.fontFamily};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  border-radius: ${props => props.theme.borders.radius.md};
  transition: all ${props => props.theme.transitions.normal};
  cursor: pointer;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  position: relative;
  overflow: hidden;
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'small':
        return css`
          padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
          font-size: ${props.theme.typography.sizes.sm};
        `;
      case 'large':
        return css`
          padding: ${props.theme.spacing.md} ${props.theme.spacing.lg};
          font-size: ${props.theme.typography.sizes.lg};
        `;
      case 'medium':
      default:
        return css`
          padding: ${props.theme.spacing.sm} ${props.theme.spacing.md};
          font-size: ${props.theme.typography.sizes.md};
        `;
    }
  }}
  
  /* Style variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background-color: ${props.theme.colors.primary.main};
          color: ${props.theme.colors.primary.contrastText};
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.primary.dark};
            box-shadow: ${props.theme.shadows.md};
            transform: translateY(-1px);
          }
          
          &:active {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:disabled {
            background-color: ${props.theme.colors.neutral.gray300};
            color: ${props.theme.colors.neutral.gray600};
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        `;
      
      case 'secondary':
        return css`
          background-color: ${props.theme.colors.neutral.gray800};
          color: ${props.theme.colors.neutral.white};
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.neutral.gray900};
            box-shadow: ${props.theme.shadows.md};
            transform: translateY(-1px);
          }
          
          &:active {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:disabled {
            background-color: ${props.theme.colors.neutral.gray300};
            color: ${props.theme.colors.neutral.gray600};
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        `;
      
      case 'outline':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.primary.main};
          border: 1px solid ${props.theme.colors.primary.main};
          
          &:hover {
            background-color: rgba(94, 53, 177, 0.05);
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:active {
            background-color: rgba(94, 53, 177, 0.1);
          }
          
          &:disabled {
            color: ${props.theme.colors.neutral.gray400};
            border-color: ${props.theme.colors.neutral.gray300};
            cursor: not-allowed;
            background-color: transparent;
            box-shadow: none;
          }
        `;
      
      case 'text':
        return css`
          background-color: transparent;
          color: ${props.theme.colors.primary.main};
          border: none;
          padding-left: ${props.theme.spacing.xs};
          padding-right: ${props.theme.spacing.xs};
          
          &:hover {
            background-color: rgba(94, 53, 177, 0.05);
            text-decoration: underline;
          }
          
          &:active {
            background-color: rgba(94, 53, 177, 0.1);
          }
          
          &:disabled {
            color: ${props.theme.colors.neutral.gray400};
            cursor: not-allowed;
            background-color: transparent;
          }
        `;
      
      case 'gold':
        return css`
          background-color: ${props.theme.colors.secondary.main};
          color: ${props.theme.colors.secondary.contrastText};
          border: none;
          
          &:hover {
            background-color: ${props.theme.colors.secondary.dark};
            box-shadow: ${props.theme.shadows.md};
            transform: translateY(-1px);
          }
          
          &:active {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.sm};
          }
          
          &:disabled {
            background-color: ${props.theme.colors.neutral.gray300};
            color: ${props.theme.colors.neutral.gray600};
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }
        `;
        case 'danger':
        return css`
          background-color: ${props.theme.colors.error.main};
          color: ${props.theme.colors.error.contrastText};
          border: none;
          &:hover {
            background-color: ${props.theme.colors.error.dark};
          }
        `;
    }
  }}
  
  /* Ripple effect */
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.4) 10%, transparent 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10, 10);
    opacity: 0;
    transition: transform 0.3s, opacity 0.5s;
  }
  
  &:active::after {
    transform: scale(0, 0);
    opacity: 0.3;
    transition: 0s;
  }
`;

const IconContainer = styled.span<{ position: 'start' | 'end' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-${props => props.position === 'start' ? 'right' : 'left'}: ${props => props.theme.spacing.xs};
`;

const LoadingSpinner = styled.span`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: ${props => props.theme.colors.neutral.white};
  animation: spin 0.8s ease-in-out infinite;
  margin-right: ${props => props.theme.spacing.xs};
`;

// Button component
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  startIcon,
  endIcon,
  isLoading = false,
  disabled,
  children,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      
      {startIcon && !isLoading && (
        <IconContainer position="start">{startIcon}</IconContainer>
      )}
      
      {children}
      
      {endIcon && !isLoading && (
        <IconContainer position="end">{endIcon}</IconContainer>
      )}
    </StyledButton>
  );
};

export default Button;