# Daycare Staffing & Recommendation Platform - Rebuild TODO

## Phase 1: Core Data Models & Services
- [ ] Update data models in `src/types/data.ts`
  - [ ] Add RECRUITER role to UserRole enum
  - [ ] Ensure data models match exact specifications 
  - [ ] Remove excess enums/interfaces not needed
- [ ] Create missing `src/services/candidateMatchingEngine.ts`
  - [ ] Implement calculateMatchScore function (0-100 scale)
  - [ ] Create scoring functions for skills, experience, education, etc.
  - [ ] Apply proper weights: Skills (25%), Experience (25%), Years (20%), Education (15%), Certifications (10%), Job Type (5%)
- [ ] Create missing `src/services/recommendationService.ts`
  - [ ] Implement getRecommendationsForJob function
  - [ ] Implement generateStrengthsAndGaps function
  - [ ] Implement generateRecommendationSummary function
- [ ] Fix broken import in `src/lib/recommendationReports.ts`
  - [ ] Update import to use new services

## Phase 2: Mock Data & Type Alignment
- [ ] Update `src/data/mockJobSeekers.ts`
  - [ ] Convert JobSeekerProfile interface to use UserProfile from data.ts
  - [ ] Ensure all mock job seekers match UserProfile interface exactly
  - [ ] Add missing fields like yearsOfExperience, minSalary, etc.
- [ ] Review and update `src/data/mockJobs.ts`
  - [ ] Ensure all jobs use proper Job interface
  - [ ] Add any missing required fields
- [ ] Create `src/data/mockRecruiters.ts`
  - [ ] Add mock recruiter profiles with RECRUITER role
  - [ ] Include their partner daycare organizations

## Phase 3: Core React Application
- [ ] Create missing `src/index.tsx` (React entry point)
- [ ] Create missing `src/App.tsx` (Main app component with routing)
- [ ] Update routing structure for three user types:
  - [ ] Job Seeker routes
  - [ ] Daycare Organization routes  
  - [ ] Recruiter routes

## Phase 4: User Interface Components
- [ ] Review existing components in `src/components/`
- [ ] Create user role-specific screens:
  - [ ] Job Seeker dashboard and profile management
  - [ ] Daycare job posting and candidate viewing
  - [ ] Recruiter recommendation reports and analytics
- [ ] Implement responsive design with existing styled-components

## Phase 5: Integration & Testing
- [ ] Test candidate matching engine with mock data
- [ ] Test recommendation service end-to-end
- [ ] Ensure all imports resolve correctly
- [ ] Test React app compilation and startup
- [ ] Fix any TypeScript errors

## Phase 6: Enhanced Features
- [ ] Add authentication flow for different user types
- [ ] Implement job application workflow
- [ ] Add candidate search and filtering
- [ ] Create detailed recommendation reports for recruiters
- [ ] Add data persistence layer (currently using mock data)

## Current Issues to Fix
- [ ] Missing `src/services/candidateMatchingEngine.ts` causing import error
- [ ] Missing main React app files (index.tsx, App.tsx)
- [ ] Type mismatch between JobSeekerProfile and UserProfile
- [ ] Need to add Jest tests for matching engine and services

## Technical Debt
- [ ] Update README.md to reflect actual platform purpose
- [ ] Add proper error handling in services
- [ ] Implement proper logging for debugging
- [ ] Add validation schemas using Zod for all data types
- [ ] Create comprehensive test suite

---

**Priority Order**: Focus on Phase 1 first to get the core services working, then Phase 3 to get React app running, then build out the UI in Phase 4.
