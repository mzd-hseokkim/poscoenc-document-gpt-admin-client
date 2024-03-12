import React, { useState } from 'react';

import { CCard, CCardBody, CForm, CModalBody, CModalFooter } from '@coreui/react-pro';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';

const ChunkDetailForm = ({ closeModal, fetchChunkList, initialFormMode }) => {
  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);

  return (
    <>
      <CModalBody>
        <FormLoadingCover isLoading={getDetailIsLoading} />
        <CForm
        // onSubmit={handleSubmit(onSubmit)}
        >
          <CCard className="mb-3">
            <CCardBody>Api 병합 후 구현 예정</CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
        // dataId={collectionDetail.id}
        // formModes={formModes(formMode)}
        // handleCancel={handleModificationCancelClick}
        // handleDeleteRestore={handleDeleteRestoreClick}
        // handleUpdateClick={() => setFormMode('update')}
        // isCreatedByCurrentUser={collectionDetail.createdBy === currentUserId}
        // isDataDeleted={collectionDetail.deleted}
        // onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default ChunkDetailForm;
