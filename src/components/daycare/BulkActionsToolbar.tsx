// src/components/daycare/BulkActionsToolbar.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { BulkAction, ApplicationStatus } from '../../types/data';
import { Button } from '../common/ui';

const ToolbarContainer = styled.div`
  background: ${({ theme }) => theme.colors.primary.light};
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  justify-content: between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const SelectedInfo = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-right: auto;
`;

const ActionsGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ActionButton = styled(Button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 8px 16px;
  font-size: 14px;
  white-space: nowrap;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'danger':
        return `
          background: ${theme.colors.error.main};
          color: white;
          &:hover { background: ${theme.colors.error.dark}; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.background.main};
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background: ${theme.colors.background.light}; }
        `;
      default:
        return `
          background: ${theme.colors.primary.main};
          color: white;
          &:hover { background: ${theme.colors.primary.dark}; }
        `;
    }
  }}
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled(ActionButton)`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DropdownContent = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: ${({ isOpen }) => isOpen ? 'block' : 'none'};
  margin-top: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:hover {
    background: ${({ theme }) => theme.colors.background.light};
  }
  
  &:first-child {
    border-radius: 6px 6px 0 0;
  }
  
  &:last-child {
    border-radius: 0 0 6px 6px;
  }
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.h3`
  margin: 0 0 16px 0;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  font-size: 14px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

interface BulkActionsToolbarProps {
  selectedCount: number;
  onAction: (action: BulkAction) => void;
  onSelectAll: (selected: boolean) => void;
  onClearSelection: () => void;
}

const BulkActionsToolbar: React.FC<BulkActionsToolbarProps> = ({
  selectedCount,
  onAction,
  onSelectAll,
  onClearSelection
}) => {
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleStatusUpdate = (status: ApplicationStatus) => {
    onAction({
      type: 'STATUS_UPDATE',
      payload: { status }
    });
    setStatusDropdownOpen(false);
  };

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAction({
        type: 'ADD_NOTE',
        payload: { note: noteText.trim() }
      });
      setNoteText('');
      setNoteModalOpen(false);
    }
  };

  const handleSendEmail = () => {
    if (emailSubject.trim() && emailBody.trim()) {
      onAction({
        type: 'EMAIL',
        payload: { 
          subject: emailSubject.trim(),
          body: emailBody.trim()
        }
      });
      setEmailSubject('');
      setEmailBody('');
      setEmailModalOpen(false);
    }
  };

  const handleExport = () => {
    onAction({
      type: 'EXPORT',
      payload: { format: 'csv' }
    });
  };

  const handleAddTag = (tag: string) => {
    onAction({
      type: 'ADD_TAG',
      payload: { tag }
    });
  };

  return (
    <>
      <ToolbarContainer>
        <SelectedInfo>
          {selectedCount} candidate{selectedCount !== 1 ? 's' : ''} selected
        </SelectedInfo>
        
        <ActionsGroup>
          <ActionButton variant="secondary" onClick={() => onSelectAll(true)}>
            Select All
          </ActionButton>
          
          <ActionButton variant="secondary" onClick={onClearSelection}>
            Clear Selection
          </ActionButton>

          <DropdownContainer>
            <DropdownButton 
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            >
              Update Status ▼
            </DropdownButton>
            <DropdownContent isOpen={statusDropdownOpen}>
              <DropdownItem onClick={() => handleStatusUpdate(ApplicationStatus.REVIEWING)}>
                Move to Review
              </DropdownItem>
              <DropdownItem onClick={() => handleStatusUpdate(ApplicationStatus.INTERVIEW_SCHEDULED)}>
                Schedule Interview
              </DropdownItem>
              <DropdownItem onClick={() => handleStatusUpdate(ApplicationStatus.OFFERED)}>
                Make Offer
              </DropdownItem>
              <DropdownItem onClick={() => handleStatusUpdate(ApplicationStatus.REJECTED)}>
                Reject
              </DropdownItem>
            </DropdownContent>
          </DropdownContainer>

          <ActionButton onClick={() => setNoteModalOpen(true)}>
            Add Note
          </ActionButton>

          <ActionButton onClick={() => setEmailModalOpen(true)}>
            Send Email
          </ActionButton>

          <ActionButton onClick={() => handleAddTag('Shortlisted')}>
            Add to Shortlist
          </ActionButton>

          <ActionButton variant="secondary" onClick={handleExport}>
            Export CSV
          </ActionButton>
        </ActionsGroup>
      </ToolbarContainer>

      {/* Add Note Modal */}
      <Modal isOpen={noteModalOpen}>
        <ModalContent>
          <ModalHeader>Add Note to Selected Candidates</ModalHeader>
          <TextArea
            placeholder="Enter note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
          <ModalActions>
            <ActionButton variant="secondary" onClick={() => setNoteModalOpen(false)}>
              Cancel
            </ActionButton>
            <ActionButton onClick={handleAddNote}>
              Add Note
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Send Email Modal */}
      <Modal isOpen={emailModalOpen}>
        <ModalContent>
          <ModalHeader>Send Email to Selected Candidates</ModalHeader>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Subject
            </label>
            <input
              type="text"
              placeholder="Email subject..."
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
              Message
            </label>
            <TextArea
              placeholder="Email message..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
            />
          </div>
          <ModalActions>
            <ActionButton variant="secondary" onClick={() => setEmailModalOpen(false)}>
              Cancel
            </ActionButton>
            <ActionButton onClick={handleSendEmail}>
              Send Email
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BulkActionsToolbar;
