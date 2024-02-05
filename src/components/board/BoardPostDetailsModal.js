import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react-pro';
import BoardPostDetailsForm from './BoardPostDetailsForm';
import StatusBadge from './BoadStatusBadge';
import React from 'react';

const BoardPostDetailsModal = ({ isModalOpen, details = {}, handleCloseModal }) => {
  return (
    <CModal size="xl" visible={isModalOpen} onClose={() => handleCloseModal()} aria-labelledby="PostDetails">
      <CModalHeader>
        {details && (
          <CModalTitle id="PostDetails">
            {details?.title}
            <StatusBadge deleted={details.deleted} />
          </CModalTitle>
        )}
      </CModalHeader>
      <CModalBody>
        <BoardPostDetailsForm formData={details} />
      </CModalBody>
    </CModal>
  );
};
export default BoardPostDetailsModal;
