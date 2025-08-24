import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { UserProfile, Job, JobType } from '../../types/data';
import { mockJobs } from '../../data/mockJobs';
import { mockJobSeekers } from '../../data/mockJobSeekers';
import { calculateMatchScore } from '../../services/api/candidateMatchingEngine';
import { useRealTimeScoring } from '../../services/realtime/scoringSystem';
import { Button } from '../common/ui';

const OptimizationContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #5E35B1;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const ScoreCard = styled.div`
  background: linear-gradient(135deg, #5E35B1, #7E57C2);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 24px rgba(94, 53, 177, 0.3);
`;

const CurrentScore = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const RecommendationsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const RecommendationCard = styled.div<{ priority: 'high' | 'medium' | 'low' }>`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => 
    props.priority === 'high' ? '#F44336' :
    props.priority === 'medium' ? '#FF9800' : '#4CAF50'
  };
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const RecommendationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const PriorityBadge = styled.span<{ priority: 'high' | 'medium' | 'low' }>`
  background: ${props => 
    props.priority === 'high' ? '#F44336' :
    props.priority === 'medium' ? '#FF9800' : '#4CAF50'
  };
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
`;

const ImpactScore = styled.div`
  text-align: center;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 60px;
`;

const RecommendationTitle = styled.h3`
  color: #333;
  margin-bottom: 0.5rem;
`;

const RecommendationDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const ActionButton = styled(Button)`
  background: #5E35B1;
  
  &:hover {
    background: #4527A0;
  }
`;

const ProgressSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const ProgressTitle = styled.h2`
  color: #333;
  margin-bottom: 1.5rem;
`;

const ProgressBar = styled.div`
  background: #f0f0f0;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ percentage: number }>`
  background: linear-gradient(90deg, #5E35B1, #7E57C2);
  height: 100%;
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
`;

const ProfileCompleteness = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const CompletenessItem = styled.div<{ completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.completed ? '#E8F5E8' : '#FFEBEE'};
  border-radius: 8px;
  font-size: 0.875rem;
`;

const SimulationSection = styled.div`
  background: #f8f5ff;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const SimulationTitle = styled.h2`
  color: #5E35B1;
  margin-bottom: 1rem;
`;

const SimulationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SimulationCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px dashed #5E35B1;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #5E35B1;
    color: white;
  }
`;

interface ProfileAnalysis {
  currentAverageScore: number;
  completenessPercentage: number;
  missingElements: string[];
  recommendations: {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    potentialImpact: number;
    action: string;
  }[];
}

export const ProfileOptimization: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(mockJobSeekers[0]);
  const [analysis, setAnalysis] = useState<ProfileAnalysis | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const { isUpdating, simulateSkillAddition, simulateExperienceUpdate } = useRealTimeScoring();

  // Analyze profile on component mount
  useEffect(() => {
    analyzeProfile(currentUser);
  }, [currentUser]);

  const analyzeProfile = (profile: UserProfile) => {
    // Calculate current average score across all jobs
    const scores = mockJobs.map(job => calculateMatchScore(job, profile).score);
    const currentAverageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    // Calculate profile completeness
    const completenessChecks = [
      { name: 'Profile Photo', completed: !!profile.avatar },
      { name: 'Bio/Summary', completed: !!profile.bio },
      { name: 'Skills (5+)', completed: (profile.skills?.length || 0) >= 5 },
      { name: 'Education', completed: (profile.education?.length || 0) > 0 },
      { name: 'Experience (2+)', completed: (profile.experience?.length || 0) >= 2 },
      { name: 'Certifications', completed: (profile.certifications?.length || 0) > 0 },
      { name: 'Contact Info', completed: !!profile.phone && !!profile.email },
      { name: 'Location', completed: !!profile.location },
      { name: 'Job Preferences', completed: (profile.preferredJobTypes?.length || 0) > 0 }
    ];

    const completedCount = completenessChecks.filter(check => check.completed).length;
    const completenessPercentage = Math.round((completedCount / completenessChecks.length) * 100);

    // Generate recommendations
    const recommendations = [];

    // Skills recommendations
    const skillCount = profile.skills?.length || 0;
    if (skillCount < 5) {
      recommendations.push({
        id: 'add-skills',
        title: 'Add More Skills',
        description: `You currently have ${skillCount} skills listed. Adding 3-5 more relevant skills could increase your match scores by 15-25% for most positions.`,
        priority: 'high' as const,
        potentialImpact: 20,
        action: 'Add Skills'
      });
    }

    // Experience recommendations
    const expYears = profile.yearsOfExperience || 0;
    if (expYears < 3) {
      recommendations.push({
        id: 'gain-experience',
        title: 'Gain More Experience',
        description: 'Many lead positions require 3+ years of experience. Consider substitute teaching or volunteer work to build your background.',
        priority: 'medium' as const,
        potentialImpact: 15,
        action: 'View Opportunities'
      });
    }

    // Certifications recommendations
    if (!profile.certifications?.length) {
      recommendations.push({
        id: 'get-certified',
        title: 'Obtain Essential Certifications',
        description: 'CPR/First Aid certification is required for most daycare positions. This could unlock 40+ additional job opportunities.',
        priority: 'high' as const,
        potentialImpact: 25,
        action: 'Find Training'
      });
    }

    // Education recommendations
    if (!profile.education?.length) {
      recommendations.push({
        id: 'add-education',
        title: 'Add Educational Background',
        description: 'Include your educational qualifications to meet job requirements and improve match scores.',
        priority: 'medium' as const,
        potentialImpact: 18,
        action: 'Update Profile'
      });
    }

    // Bio recommendations
    if (!profile.bio) {
      recommendations.push({
        id: 'write-bio',
        title: 'Write a Professional Summary',
        description: 'A compelling bio helps recruiters understand your passion for childcare and unique qualifications.',
        priority: 'low' as const,
        potentialImpact: 10,
        action: 'Write Bio'
      });
    }

    setAnalysis({
      currentAverageScore,
      completenessPercentage,
      missingElements: completenessChecks.filter(check => !check.completed).map(check => check.name),
      recommendations
    });
  };

  const handleSimulateSkillAddition = async (skill: string) => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    try {
      await simulateSkillAddition(currentUser, skill, mockJobs);
      // Update current user to reflect the change
      const updatedUser = {
        ...currentUser,
        skills: [...(currentUser.skills || []), skill]
      };
      setCurrentUser(updatedUser);
      analyzeProfile(updatedUser);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSimulateExperienceUpdate = async () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    try {
      await simulateExperienceUpdate(currentUser, 1, mockJobs);
      const updatedUser = {
        ...currentUser,
        yearsOfExperience: (currentUser.yearsOfExperience || 0) + 1
      };
      setCurrentUser(updatedUser);
      analyzeProfile(updatedUser);
    } finally {
      setIsSimulating(false);
    }
  };

  if (!analysis) {
    return <div>Analyzing profile...</div>;
  }

  return (
    <OptimizationContainer>
      <Header>
        <Title>Profile Optimization Center</Title>
        <Subtitle>Maximize your job match potential with AI-powered recommendations</Subtitle>
      </Header>

      <ScoreCard>
        <CurrentScore>{analysis.currentAverageScore}%</CurrentScore>
        <ScoreLabel>Average Match Score Across All Jobs</ScoreLabel>
        {isUpdating && <div style={{ marginTop: '1rem', opacity: 0.8 }}>🔄 Recalculating scores...</div>}
      </ScoreCard>

      <ProgressSection>
        <ProgressTitle>Profile Completeness</ProgressTitle>
        <ProgressBar>
          <ProgressFill percentage={analysis.completenessPercentage} />
        </ProgressBar>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {analysis.completenessPercentage}% Complete
        </div>
        
        <ProfileCompleteness>
          <CompletenessItem completed={!!currentUser.avatar}>
            {currentUser.avatar ? '✅' : '❌'} Profile Photo
          </CompletenessItem>
          <CompletenessItem completed={!!currentUser.bio}>
            {currentUser.bio ? '✅' : '❌'} Professional Bio
          </CompletenessItem>
          <CompletenessItem completed={(currentUser.skills?.length || 0) >= 5}>
            {(currentUser.skills?.length || 0) >= 5 ? '✅' : '❌'} Skills (5+)
          </CompletenessItem>
          <CompletenessItem completed={(currentUser.education?.length || 0) > 0}>
            {(currentUser.education?.length || 0) > 0 ? '✅' : '❌'} Education
          </CompletenessItem>
          <CompletenessItem completed={(currentUser.experience?.length || 0) >= 2}>
            {(currentUser.experience?.length || 0) >= 2 ? '✅' : '❌'} Experience (2+)
          </CompletenessItem>
          <CompletenessItem completed={(currentUser.certifications?.length || 0) > 0}>
            {(currentUser.certifications?.length || 0) > 0 ? '✅' : '❌'} Certifications
          </CompletenessItem>
        </ProfileCompleteness>
      </ProgressSection>

      <RecommendationsGrid>
        <h2 style={{ gridColumn: '1 / -1', color: '#333', marginBottom: '0' }}>
          Optimization Recommendations
        </h2>
        
        {analysis.recommendations.map(rec => (
          <RecommendationCard key={rec.id} priority={rec.priority}>
            <RecommendationHeader>
              <div>
                <PriorityBadge priority={rec.priority}>
                  {rec.priority.toUpperCase()} PRIORITY
                </PriorityBadge>
              </div>
              <ImpactScore>
                <div style={{ fontWeight: 'bold', color: '#5E35B1' }}>
                  +{rec.potentialImpact}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#666' }}>
                  Impact
                </div>
              </ImpactScore>
            </RecommendationHeader>
            
            <RecommendationTitle>{rec.title}</RecommendationTitle>
            <RecommendationDescription>{rec.description}</RecommendationDescription>
            
            <ActionButton size="small">
              {rec.action}
            </ActionButton>
          </RecommendationCard>
        ))}
      </RecommendationsGrid>

      <SimulationSection>
        <SimulationTitle>🚀 Try Real-Time Profile Updates</SimulationTitle>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          See how adding skills or experience affects your match scores in real-time!
        </p>
        
        <SimulationGrid>
          <SimulationCard onClick={() => handleSimulateSkillAddition('Montessori Method')}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Add "Montessori Method"</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              Specialized teaching skill
            </div>
          </SimulationCard>
          
          <SimulationCard onClick={() => handleSimulateSkillAddition('Bilingual Education')}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌎</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Add "Bilingual Education"</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              High-demand skill
            </div>
          </SimulationCard>
          
          <SimulationCard onClick={() => handleSimulateSkillAddition('Autism Spectrum Support')}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤝</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Add "Autism Spectrum Support"</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              Special needs expertise
            </div>
          </SimulationCard>
          
          <SimulationCard onClick={handleSimulateExperienceUpdate}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</div>
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Add 1 Year Experience</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>
              Increase to {(currentUser.yearsOfExperience || 0) + 1} years
            </div>
          </SimulationCard>
        </SimulationGrid>
        
        {isSimulating && (
          <div style={{ textAlign: 'center', marginTop: '1rem', color: '#5E35B1' }}>
            ⏳ Updating profile and recalculating scores...
          </div>
        )}
      </SimulationSection>
    </OptimizationContainer>
  );
};

export default ProfileOptimization;
