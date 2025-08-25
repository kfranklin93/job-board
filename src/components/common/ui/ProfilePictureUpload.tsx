import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { theme } from '../../../styles/theme';
import { profileService } from '../../../services/api/profileService'; // Import the service

// --- Styled Components ---
// ... (No changes needed in your styled components)
const Container = styled.div`/* ... */`;
const ProfileImage = styled.img`/* ... */`;
const UploadOverlay = styled.div`/* ... */`;
const LoadingSpinner = styled.div`/* ... */`;
const HiddenInput = styled.input`/* ... */`;
const RemoveButton = styled.button`/* ... */`;
const Modal = styled.div`/* ... */`;
const ModalContent = styled.div`/* ... */`;
const ModalHeader = styled.div`/* ... */`;
const ModalTitle = styled.h3`/* ... */`;
const CloseButton = styled.button`/* ... */`;
const CropContainer = styled.div`/* ... */`;
const PreviewContainer = styled.div`/* ... */`;
const PreviewTitle = styled.h4`/* ... */`;
const PreviewImage = styled.img`/* ... */`;
const ModalActions = styled.div`/* ... */`;
const Button = styled.button`/* ... */`;
const ErrorMessage = styled.div`/* ... */`;


// --- Component Logic ---

// FIX 1: Consolidated into a single, correct props interface.
interface ProfilePictureUploadProps {
  userId: string;
  initialImage?: string;
  onUploadSuccess: (newAvatarUrl: string) => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  // FIX 2: Destructure the corrected props, including userId.
  userId,
  initialImage,
  onUploadSuccess,
  size = 'medium',
  disabled = false,
}) => {
  const [currentImage, setCurrentImage] = useState(initialImage || 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  
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
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result?.toString() || '');
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(makeAspectCrop({ unit: '%', width: 50 }, 1, width, height), width, height);
    setCrop(crop);
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (!completedCrop || !imageRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;
    if (!ctx) return null;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    ctx.drawImage(image, completedCrop.x * scaleX, completedCrop.y * scaleY, completedCrop.width * scaleX, completedCrop.height * scaleY, 0, 0, completedCrop.width, completedCrop.height);

    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
  }, [completedCrop]);

  const handleCropComplete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const croppedBlob = await generateCroppedImage();
      if (croppedBlob) {
        // FIX 3: Use the profileService to upload the image with the userId.
        const response = await profileService.uploadAvatar(croppedBlob, userId);
        if (response.success && response.avatarUrl) {
          onUploadSuccess(response.avatarUrl); // Notify the parent component of success
          setCurrentImage(response.avatarUrl); // Update the image locally
        } else {
          throw new Error(response.error || 'Upload failed');
        }
      }
      closeCropModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultImage = 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload';
    setCurrentImage(defaultImage);
    // Here you would typically make an API call to remove the avatar
    // For now, we can just call the success handler with a blank or default URL
    onUploadSuccess('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const closeCropModal = () => {
    setShowCropModal(false);
    setImageSrc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const showRemoveButton = currentImage !== 'https://via.placeholder.com/150x150/f0f0f0/666?text=Upload' && !disabled && !isLoading;

  return (
    <>
      <Container>
        {/* We can show the error near the component or in the modal */}
        <ProfileImage src={currentImage} alt="Profile" size={size} isLoading={isLoading} onClick={handleImageClick} />
        <UploadOverlay size={size} isLoading={isLoading} onClick={handleImageClick}>
          {isLoading ? <LoadingSpinner /> : (currentImage.includes('placeholder') ? 'Upload' : 'Change')}
        </UploadOverlay>
        {showRemoveButton && <RemoveButton onClick={handleRemove} type="button">×</RemoveButton>}
        <HiddenInput ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} disabled={disabled || isLoading} />
      </Container>
      
      <Modal isOpen={showCropModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Crop Profile Picture</ModalTitle>
            <CloseButton onClick={closeCropModal}>×</CloseButton>
          </ModalHeader>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {imageSrc && (
            <CropContainer>
              <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspect={1} circularCrop>
                <img ref={imageRef} alt="Crop preview" src={imageSrc} style={{ maxHeight: '50vh' }} onLoad={onImageLoad} />
              </ReactCrop>
            </CropContainer>
          )}

          <ModalActions>
            <Button variant="secondary" onClick={closeCropModal}>Cancel</Button>
            <Button variant="primary" onClick={handleCropComplete} disabled={!completedCrop || isLoading}>
              {isLoading ? 'Uploading...' : 'Save and Upload'}
            </Button>
          </ModalActions>
        </ModalContent>
      </Modal>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default ProfilePictureUpload;