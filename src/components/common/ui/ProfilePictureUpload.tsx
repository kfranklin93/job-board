import React, { useRef, useState } from 'react';
import styled from 'styled-components';

interface ProfilePictureUploadProps {
  initialImage?: string;
  onImageChange: (file: File | null, imageUrl: string) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const sizes = {
  small: '60px',
  medium: '100px',
  large: '150px'
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const ProfileImage = styled.img<{ size: 'small' | 'medium' | 'large' }>`
  width: ${props => sizes[props.size]};
  height: ${props => sizes[props.size]};
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;
  
  &:hover {
    border-color: #3182ce;
  }
`;

const UploadOverlay = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => sizes[props.size]};
  height: ${props => sizes[props.size]};
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
  color: white;
  font-size: ${props => props.size === 'small' ? '0.75rem' : '0.875rem'};
  
  &:hover {
    opacity: 1;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: #e53e3e;
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #c53030;
  }
`;

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  initialImage,
  onImageChange,
  size = 'medium',
  disabled = false
}) => {
  const [currentImage, setCurrentImage] = useState(initialImage || 'https://placehold.co/400?text=Upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setCurrentImage(imageUrl);
      onImageChange(file, imageUrl);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage('https://placehold.co/400?text=Upload');
    onImageChange(null, 'https://placehold.co/400?text=Upload');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showRemoveButton = currentImage !== 'https://placehold.co/400?text=Upload' && !disabled;

  return (
    <Container>
      <ProfileImage 
        src={currentImage} 
        alt="Profile"
        size={size}
        onClick={handleImageClick}
      />
      
      {!disabled && (
        <UploadOverlay size={size} onClick={handleImageClick}>
          {currentImage === 'https://placehold.co/400?text=Upload' ? 'Upload' : 'Change'}
        </UploadOverlay>
      )}
      
      {showRemoveButton && (
        <RemoveButton onClick={handleRemove} type="button">
          ×
        </RemoveButton>
      )}
      
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </Container>
  );
};

export default ProfilePictureUpload;
