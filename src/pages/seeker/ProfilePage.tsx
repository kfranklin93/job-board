import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/api/profileService';
import { UserProfile } from '../../types/data';
import { Button, Card, CardBody, CardHeader, ProfilePictureUpload } from '../../components/common/ui';
import { theme } from '../../styles/theme';

// --- Styled Components ---

const ProfileWrapper = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 0 1rem;
`;

const ProfileHeader = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  margin-bottom: 2rem;
`;

const AvatarContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const Name = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: ${theme.colors.neutral.gray900};
`;

const JobTitle = styled.p`
  font-size: 1.125rem;
  color: ${theme.colors.primary.main};
  margin: 0 0 0.5rem 0;
  font-weight: 500;
`;

const Location = styled.p`
  font-size: 1rem;
  color: ${theme.colors.neutral.gray600};
  margin: 0;
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ProfileSection = styled(Card)`
  padding: 0; // Remove padding from Card base
`;

const SectionContent = styled.div`
  font-size: 1rem;
  color: ${theme.colors.neutral.gray700};
  line-height: 1.6;
`;

const ExperienceItem = styled.div`
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${theme.colors.neutral.gray200};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const ExperienceHeader = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.neutral.gray800};
  margin: 0;
`;

const ExperienceSubheader = styled.p`
  font-size: 0.9rem;
  color: ${theme.colors.neutral.gray600};
  margin: 0.25rem 0 0.5rem 0;
`;

const SkillTag = styled.span`
  display: inline-block;
  background-color: ${theme.colors.primary.light}30;
  color: ${theme.colors.primary.dark};
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
`;


// --- Profile Page Component ---

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setError('You must be logged in to view this page.');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const userProfile = await profileService.getProfile(user.id);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setError('Could not find your profile.');
        }
      } catch (err) {
        setError('An unexpected error occurred while fetching your profile.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleAvatarUpload = (avatarUrl: string) => {
    if (profile) {
      setProfile({ ...profile, avatar: avatarUrl });
    }
    setShowUploadModal(false);
  };

  if (isLoading) return <ProfileWrapper><div>Loading your profile...</div></ProfileWrapper>;
  if (error) return <ProfileWrapper><div>Error: {error}</div></ProfileWrapper>;
  if (!profile) return <ProfileWrapper><div>No profile data available.</div></ProfileWrapper>;

  return (
    <ProfileWrapper>
      <ProfileHeader>
        <AvatarContainer onClick={() => setShowUploadModal(true)}>
          <img src={profile.avatar} alt={`${profile.firstName}'s avatar`} style={{ width: 120, height: 120, borderRadius: '50%', cursor: 'pointer' }} />
        </AvatarContainer>
        <Name>{profile.firstName} {profile.lastName}</Name>
        <JobTitle>{profile.jobTitle}</JobTitle>
        <Location>{profile.location}</Location>
        <Button variant="outline" style={{ marginTop: '1rem' }}>Edit Profile</Button>
      </ProfileHeader>

      {showUploadModal && user && (
        <ProfilePictureUpload
          userId={user.id}
          onUploadSuccess={handleAvatarUpload}
          onClose={() => setShowUploadModal(false)}
        />
      )}

      <ProfileGrid>
        <ProfileSection>
          <CardHeader>About Me</CardHeader>
          <CardBody>
            <SectionContent>{profile.bio}</SectionContent>
          </CardBody>
        </ProfileSection>

        <ProfileSection>
          <CardHeader>Work Experience</CardHeader>
          <CardBody>
            {profile.experience?.map(exp => (
              <ExperienceItem key={exp.id}>
                <ExperienceHeader>{exp.title}</ExperienceHeader>
                <ExperienceSubheader>{exp.company} • {exp.location}</ExperienceSubheader>
                <SectionContent>{exp.description}</SectionContent>
              </ExperienceItem>
            ))}
          </CardBody>
        </ProfileSection>

        <ProfileSection>
          <CardHeader>Skills</CardHeader>
          <CardBody>
            {profile.skills?.map(skill => <SkillTag key={skill}>{skill}</SkillTag>)}
          </CardBody>
        </ProfileSection>
      </ProfileGrid>
    </ProfileWrapper>
  );
};

export default ProfilePage;