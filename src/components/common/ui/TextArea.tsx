import React from 'react';
import styled from 'styled-components';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'error';
  fullWidth?: boolean;
}

const StyledTextArea = styled.textarea<TextAreaProps>`
  padding: 0.75rem;
  border: 1px solid ${props => props.variant === 'error' ? '#e53e3e' : '#e2e8f0'};
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3182ce;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
  }
  
  &::placeholder {
    color: #a0aec0;
  }
  
  &:disabled {
    background-color: #f7fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }
`;

const TextArea: React.FC<TextAreaProps> = ({ fullWidth = true, ...props }) => {
  return <StyledTextArea fullWidth={fullWidth} {...props} />;
};

export default TextArea;
