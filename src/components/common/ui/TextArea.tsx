import React from 'react';
import styled from 'styled-components';
import { theme } from '../../../styles/theme';

const Wrapper = styled.div`
  width: 100%;
`;

const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ hasError }) => (hasError ? theme.colors.error.main : theme.colors.neutral.gray300)};
  border-radius: ${theme.borders.radius.md};
  font-size: ${theme.typography.sizes.md};
  color: ${theme.colors.neutral.gray900};
  background-color: ${theme.colors.neutral.white};
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.light}30;
  }
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error.main};
  font-size: ${theme.typography.sizes.sm};
  margin-top: 0.25rem;
`;

// FIX 1: Add 'error' (boolean) and 'errorText' (string) to the props interface.
export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  // FIX 2: Destructure the new props.
  ({ error, errorText, ...props }, ref) => {
    return (
      <Wrapper>
        <StyledTextArea hasError={error} ref={ref} {...props} />
        {/* FIX 3: Conditionally render the error message. */}
        {error && errorText && <ErrorMessage>{errorText}</ErrorMessage>}
      </Wrapper>
    );
  }
);

export default TextArea;