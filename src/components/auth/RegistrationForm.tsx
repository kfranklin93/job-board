import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { RegisterData, UserRole } from '../../types/data';
import { Button, Input } from '../common/ui';

const RegistrationContainer = styled.div`
  max-width: 500px;
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

const RoleSelection = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin: 1rem 0;

  label {
    display: flex;
    align-items: center;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #3498db;
      background: #f8f9fa;
    }

    input[type="radio"] {
      margin-right: 0.75rem;
    }

    &.selected {
      border-color: #3498db;
      background: #e3f2fd;
    }
  }

  .role-info {
    flex: 1;

    .role-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .role-description {
      font-size: 0.875rem;
      color: #666;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
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

export const RegistrationForm: React.FC = () => {
  const { register: registerUser, error, isLoading, clearError } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>();

  const password = watch('password');

  const roleOptions = [
    {
      value: UserRole.SEEKER,
      title: 'Job Seeker',
      description: 'Looking for employment opportunities at daycare centers',
    },
    {
      value: UserRole.DAYCARE,
      title: 'Daycare Organization',
      description: 'Post job openings and find qualified candidates',
    },
    {
      value: UserRole.RECRUITER,
      title: 'Recruiter',
      description: 'Receive curated candidate reports for partner daycares',
    },
  ];

  const onSubmit = async (data: RegisterData) => {
    try {
      clearError();
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <RegistrationContainer>
      <Title>Create Account</Title>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <Input
            type="text"
            placeholder="First Name"
            {...register('firstName', {
              required: 'First name is required',
              minLength: {
                value: 2,
                message: 'First name must be at least 2 characters',
              },
            })}
            error={!!errors.firstName}
            errorText={errors.firstName?.message}
          />

          <Input
            type="text"
            placeholder="Last Name"
            {...register('lastName', {
              required: 'Last name is required',
              minLength: {
                value: 2,
                message: 'Last name must be at least 2 characters',
              },
            })}
            error={!!errors.lastName}
            errorText={errors.lastName?.message}
          />
        </FormRow>

        <Input
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

        <Input
          type="tel"
          placeholder="Phone number (optional)"
          {...register('phone')}
          error={!!errors.phone}
          errorText={errors.phone?.message}
        />

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Account Type
          </label>
          <RoleSelection>
            {roleOptions.map((role) => (
              <label
                key={role.value}
                className={selectedRole === role.value ? 'selected' : ''}
              >
                <input
                  type="radio"
                  value={role.value}
                  {...register('role', { required: 'Please select an account type' })}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                />
                <div className="role-info">
                  <div className="role-title">{role.title}</div>
                  <div className="role-description">{role.description}</div>
                </div>
              </label>
            ))}
          </RoleSelection>
          {errors.role && (
            <ErrorMessage style={{ marginTop: '0.5rem' }}>
              {errors.role.message}
            </ErrorMessage>
          )}
        </div>

        <FormRow>
          <Input
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number',
              },
            })}
            error={!!errors.password}
            errorText={errors.password?.message}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === password || 'Passwords do not match',
            })}
            error={!!errors.confirmPassword}
            errorText={errors.confirmPassword?.message}
          />
        </FormRow>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </Form>

      <LinkContainer>
        <div>
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </div>
      </LinkContainer>
    </RegistrationContainer>
  );
};

export default RegistrationForm;
