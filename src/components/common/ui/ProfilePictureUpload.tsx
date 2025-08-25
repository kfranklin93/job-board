import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ProfilePictureUploadProps {
  initialImage?: string;
  onImageChange?: (file: File | null, imageUrl: string) => void;
  onImageUpload?: (croppedImageBlob: Blob) => Promise<void>;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  showCropping?: boolean;
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

const ProfileImage = styled.img<{ size: 'small' | 'medium' | 'large'; isLoading?: boolean }>`
  width: ${props => sizes[props.size]};
  height: ${props => sizes[props.size]};
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.border};
  cursor: ${props => props.isLoading ? 'default' : 'pointer'};
  transition: all 0.2s ease-in-out;
  opacity: ${props => props.isLoading ? 0.6 : 1};
  
  &:hover {
    border-color: ${({ theme, isLoading }) => isLoading ? theme.colors.border : theme.colors.primary.main};
  }
`;

const UploadOverlay = styled.div<{ size: 'small' | 'medium' | 'large'; isLoading?: boolean }>`
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
  opacity: ${props => props.isLoading ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
  cursor: pointer;
  color: white;
  font-size: ${props => props.size === 'small' ? '0.75rem' : '0.875rem'};
  
  &:hover {
    opacity: 1;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  background-color: ${({ theme }) => theme.colors.error.main};
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.error.dark};
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const CropContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const PreviewContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

const PreviewTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.border};
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary.main};
        color: white;
        &:hover { background: ${theme.colors.primary.dark}; }
        &:disabled { 
          background: ${theme.colors.text.disabled}; 
          cursor: not-allowed;
        }
      `;
    } else {
      return `
        background: ${theme.colors.background.main};
        color: ${theme.colors.text.primary};
        border: 1px solid ${theme.colors.border};
        &:hover { background: ${theme.colors.background.light}; }
      `;
    }
  }}
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error.light};
  color: ${({ theme }) => theme.colors.error.dark};
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  initialImage,
  onImageChange,
  onImageUpload,
  size = 'medium',
  disabled = false,
  showCropping = true
}) => {
  const [currentImage, setCurrentImage] = useState(initialImage || 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageClick = () => {
    if (!disabled && !isLoading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        if (showCropping) {
          setShowCropModal(true);
        } else {
          // Skip cropping, use image directly
          const imageUrl = URL.createObjectURL(file);
          setCurrentImage(imageUrl);
          onImageChange?.(file, imageUrl);
        }
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Create a centered square crop
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 50,
        },
        1, // aspect ratio 1:1 for circular crop
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(crop);
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imageRef.current || !canvasRef.current || !selectedFile) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    return new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/jpeg', 0.9);
    });
  }, [completedCrop, selectedFile]);

  const updatePreview = useCallback(async () => {
    if (canvasRef.current && completedCrop) {
      const blob = await generateCroppedImage();
      if (blob) {
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    }
  }, [generateCroppedImage, completedCrop]);

  React.useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleCropComplete = async () => {
    if (!onImageUpload) {
      // If no upload handler, just update the image
      if (previewUrl) {
        setCurrentImage(previewUrl);
        onImageChange?.(selectedFile, previewUrl);
      }
      setShowCropModal(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const croppedBlob = await generateCroppedImage();
      if (croppedBlob) {
        await onImageUpload(croppedBlob);
        
        // Update the displayed image
        const url = URL.createObjectURL(croppedBlob);
        setCurrentImage(url);
        onImageChange?.(selectedFile, url);
      }
      setShowCropModal(false);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage('https://via.placeholder.com/150x150/f0f0f0/666?text=Upload');
    onImageChange?.(null, 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const closeCropModal = () => {
    setShowCropModal(false);
    setImageSrc('');
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showRemoveButton = currentImage !== 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload' && !disabled && !isLoading;

  return (
    <>
      <Container>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <ProfileImage 
          src={currentImage} 
          alt="Profile"
          size={size}
          isLoading={isLoading}
          onClick={handleImageClick}
        />
        
        <UploadOverlay size={size} isLoading={isLoading} onClick={handleImageClick}>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            currentImage === 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload' ? 'Upload' : 'Change'
          )}
        </UploadOverlay>
        
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
          disabled={disabled || isLoading}
        />
      </Container>

      {/* Cropping Modal */}
      <Modal isOpen={showCropModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Crop Profile Picture</ModalTitle>
            <CloseButton onClick={closeCropModal}>×</CloseButton>
          </ModalHeader>
          
          {imageSrc && (
            <CropContainer>
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
              >
                <img
                  ref={imageRef}
                  alt="Crop preview"
                  src={imageSrc}
                  style={{ maxWidth: '100%' }}
                  onLoad={onImageLoad}
                />
              </ReactCrop>
            </CropContainer>
          )}

          {previewUrl && (
            <PreviewContainer>
              <PreviewTitle>Preview</PreviewTitle>
              <PreviewImage src={previewUrl} alt="Cropped preview" />
            </PreviewContainer>
          )}

          <ModalActions>
            <Button variant="secondary" onClick={closeCropModal}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCropComplete}
              disabled={!completedCrop || isLoading}
            >
              {isLoading ? 'Uploading...' : 'Save'}
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Hidden canvas for cropping */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default ProfilePictureUpload;
