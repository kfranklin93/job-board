import React from 'react';
import styled from 'styled-components';

// Types
type InputSize = 'small' | 'medium' | 'large';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: InputSize;
  success?: boolean; // <-- Add this
}

// Styled components
const InputContainer = styled.div<{ fullWidth: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const InputLabel = styled.label<{ error?: boolean }>`
  font-size: ${props => props.theme.typography.sizes.sm};
  font-weight: ${props => props.theme.typography.fontWeights.medium};
  color: ${props => props.error ? props.theme.colors.error.main : props.theme.colors.neutral.gray800};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div<{ position: 'start' | 'end' }>`
  position: absolute;
  top: 50%;
  ${props => props.position === 'start' ? 'left: 12px;' : 'right: 12px;'}
  transform: translateY(-50%);
  color: ${props => props.theme.colors.neutral.gray600};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const StyledInput = styled.input<{
  error?: boolean;
  hasStartIcon?: boolean;
  hasEndIcon?: boolean;
  size: InputSize;
  success?: boolean; // <-- Add this
}>`
  width: 100%;
  font-family: ${props => props.theme.typography.fontFamily};
  color: ${props => props.theme.colors.neutral.gray900};
  background-color: ${props => props.theme.colors.neutral.white};
  border: 1px solid ${props => {
    if (props.error) return props.theme.colors.error.main;
    if (props.success) return props.theme.colors.success.main; // <-- Add this
    return props.theme.colors.neutral.gray300;
  }};
  border-radius: ${props => props.theme.borders.radius.md};
  padding-left: ${props => props.hasStartIcon ? '2.5rem' : props.theme.spacing.md};
  padding-right: ${props => props.hasEndIcon ? '2.5rem' : props.theme.spacing.md};
  outline: none;
  transition: all ${props => props.theme.transitions.fast};
  
  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding-top: ${props.theme.spacing.xs};
          padding-bottom: ${props.theme.spacing.xs};
          font-size: ${props.theme.typography.sizes.sm};
        `;
      case 'large':
        return `
          padding-top: ${props.theme.spacing.md};
          padding-bottom: ${props.theme.spacing.md};
          font-size: ${props.theme.typography.sizes.lg};
        `;
      case 'medium':
      default:
        return `
          padding-top: ${props.theme.spacing.sm};
          padding-bottom: ${props.theme.spacing.sm};
          font-size: ${props.theme.typography.sizes.md};
        `;
    }
  }}
  
  &:hover {
    border-color: ${props => props.error ? props.theme.colors.error.main : props.theme.colors.primary.light};
  }
  
  &:focus {
    border-color: ${props => props.error ? props.theme.colors.error.main : props.theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${props => props.error 
      ? `${props.theme.colors.error.main}33` 
      : `${props.theme.colors.primary.main}33`};
  }
  
  &:disabled {
    background-color: ${props => props.theme.colors.neutral.gray100};
    border-color: ${props => props.theme.colors.neutral.gray300};
    color: ${props => props.theme.colors.neutral.gray500};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.neutral.gray500};
  }
`;

const HelperText = styled.span<{ error?: boolean }>`
  font-size: ${props => props.theme.typography.sizes.xs};
  color: ${props => props.error ? props.theme.colors.error.main : props.theme.colors.neutral.gray600};
  margin-top: ${props => props.theme.spacing.xs};
`;

// Input component
const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error = false,
  success = false,
  errorText,
  fullWidth = false,
  startIcon,
  endIcon,
  size = 'medium',
  className,
  ...props
}) => {
  return (
    <InputContainer fullWidth={fullWidth} className={className}>
      {label && <InputLabel error={error}>{label}</InputLabel>}
      
      <InputWrapper>
        {startIcon && (
          <IconContainer position="start">
            {startIcon}
          </IconContainer>
        )}
        
        <StyledInput
          error={error}
          success={success}
          hasStartIcon={!!startIcon}
          hasEndIcon={!!endIcon}
          size={size}
          {...props}
        />
        
        {endIcon && (
          <IconContainer position="end">
            {endIcon}
          </IconContainer>
        )}
      </InputWrapper>
      
      {(helperText || (error && errorText)) && (
        <HelperText error={error}>
          {error ? errorText : helperText}
        </HelperText>
      )}
    </InputContainer>
  );
};

export default Input;