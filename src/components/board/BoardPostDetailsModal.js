import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react-pro';
import BoardPostDetailsForm from './BoardPostDetailsForm';
import StatusBadge from './BoadStatusBadge';
import React, { useState } from 'react';
import { useBoardPostDetails } from '../../hooks/board/useBoardPostDetails';
//DEPRECATED 아마 삭제시 경고 모달로 사용될 예정
const BoardPostDetailsModal = ({ isModalOpen, clickedPostId = {}, handleCloseModal }) => {
  const [targetPostId, setTargetPostId] = useState(clickedPostId);
  const [error, setError] = useState(null);

  const { postDetails, loadingFlag } = useBoardPostDetails(targetPostId);

  return (
    <CModal size="xl" visible={isModalOpen} onClose={() => handleCloseModal()} aria-labelledby="PostDetails">
      <CModalHeader>
        {clickedPostId && (
          <CModalTitle id="PostDetails">
            {postDetails?.title}
            <StatusBadge deleted={postDetails?.deleted} />
          </CModalTitle>
        )}
      </CModalHeader>
      <CModalBody>
        <BoardPostDetailsForm formData={postDetails} />
      </CModalBody>
    </CModal>
  );
};
export default BoardPostDetailsModal;
