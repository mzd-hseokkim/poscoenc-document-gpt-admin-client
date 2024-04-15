import React from 'react';

import { CButton, CCol } from '@coreui/react-pro';

const DetailFormActionButtons = ({
  dataId,
  formModes,
  handleCancel,
  handleDeleteRestore,
  handleUpdateClick,
  isDataDeleted,
  isCreatedByCurrentUser,
  onSubmit,
}) => {
  const isReadMode = formModes?.isReadMode;
  const isUpdateMode = formModes?.isUpdateMode;
  const isCreateMode = formModes?.isCreateMode;

  const isUserData = isCreatedByCurrentUser !== undefined;

  const shouldShowModifyButton = () => {
    if (!isReadMode) return false;

    if (!isUserData) return true;

    return isUserData && isCreatedByCurrentUser;
  };
  const colorButtonTextStyle = {
    '--cui-btn-color': 'white',
    '--cui-btn-hover-color': 'white',
  };

  return (
    <CCol className="d-grid gap-2 d-md-flex">
      {shouldShowModifyButton() && <CButton onClick={handleUpdateClick}>수정</CButton>}
      {(isUpdateMode || isCreateMode) && (
        <>
          <CButton type="submit" onClick={onSubmit}>
            저장
          </CButton>
          <CButton onClick={handleCancel}>취소</CButton>
        </>
      )}
      {isReadMode && (
        <CButton
          style={colorButtonTextStyle}
          color={isDataDeleted ? 'success' : 'danger'}
          onClick={() => handleDeleteRestore?.(dataId)}
        >
          {isDataDeleted ? '복구' : '삭제'}
        </CButton>
      )}
    </CCol>
  );
};

export default DetailFormActionButtons;
