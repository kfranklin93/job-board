import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { LoginCredentials } from '../../types/data';
import { Button, Input } from '../common/ui';

const LoginContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #fdf0f0;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
  margin-bottom: 1rem;
`;

const LinkContainer = styled.div`
  text-align: center;
  margin-top: 1rem;
  
  a {
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DemoCredentials = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #666;
  }
  
  div {
    margin-bottom: 0.25rem;
  }
`;

export const LoginForm: React.FC = () => {
  const { login, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>();

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: LoginCredentials) => {
    try {
      clearError();
      await login(data);
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const fillDemoCredentials = (userType: 'jobseeker' | 'daycare' | 'recruiter') => {
    const credentials = {
      jobseeker: { email: 'jobseeker@example.com', password: 'password123' },
      daycare: { email: 'daycare@example.com', password: 'password123' },
      recruiter: { email: 'recruiter@example.com', password: 'password123' },
    };

    const demo = credentials[userType];
    (document.getElementById('email') as HTMLInputElement).value = demo.email;
    (document.getElementById('password') as HTMLInputElement).value = demo.password;
  };

  return (
    <LoginContainer>
      <Title>Welcome Back</Title>
      
      <DemoCredentials>
        <h4>Demo Accounts:</h4>
        <div>
          <strong>Job Seeker:</strong>{' '}
          <button type="button" onClick={() => fillDemoCredentials('jobseeker')}>
            Use Demo
          </button>
        </div>
        <div>
          <strong>Daycare:</strong>{' '}
          <button type="button" onClick={() => fillDemoCredentials('daycare')}>
            Use Demo
          </button>
        </div>
        <div>
          <strong>Recruiter:</strong>{' '}
          <button type="button" onClick={() => fillDemoCredentials('recruiter')}>
            Use Demo
          </button>
        </div>
      </DemoCredentials>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="email"
          type="email"
          placeholder="Email address"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email address',
            },
          })}
          error={!!errors.email}
          errorText={errors.email?.message}
        />

        <div style={{ position: 'relative' }}>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            error={!!errors.password}
            errorText={errors.password?.message}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '12px',
              top: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </Form>

      <LinkContainer>
        <div>
          Don't have an account?{' '}
          <Link to="/register">Sign up</Link>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </LinkContainer>
    </LoginContainer>
  );
};

export default LoginForm;
