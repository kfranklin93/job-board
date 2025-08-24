import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ hasError }) => (hasError ? theme.colors.error.main : theme.colors.neutral.gray300)};
  border-radius: ${theme.borders.radius.md};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.gray900};
  background-color: ${theme.colors.neutral.white};
  appearance: none; /* Removes default browser styling */

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}30; /* Blue focus ring */
  }

  &::placeholder {
    color: ${theme.colors.neutral.gray500};
  }
`;

const ChevronIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${theme.colors.neutral.gray500};
`;

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  error?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, error, ...props }, ref) => {
    return (
      <SelectWrapper>
        <StyledSelect hasError={error} ref={ref} {...props}>
          {children}
        </StyledSelect>
        <ChevronIcon>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </ChevronIcon>
      </SelectWrapper>
    );
  }
);

export default Select;