import React, { useState } from 'react';

import { CButton, CCol, CRow } from '@coreui/react-pro';
import { colorButtonTextStyle } from 'components/button/colorButtonTextStyle';
import DeleteAlertModal from 'components/modal/DeleteAlertModal';

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
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const shouldShowModifyButton = () => {
    if (!isReadMode) return false;

    if (!isUserData) return true;

    return isUserData && isCreatedByCurrentUser;
  };

  const handleDelete = (e) => {
    e.preventDefault();
    handleDeleteRestore?.(dataId);
    setDeleteModalVisible(false);
  };

  return (
    <>
      <CRow>
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
              onClick={() => setDeleteModalVisible(true)}
            >
              {isDataDeleted ? '복구' : '삭제'}
            </CButton>
          )}
        </CCol>
      </CRow>
      <DeleteAlertModal
        isDataDeleted={isDataDeleted}
        visible={deleteModalVisible}
        setVisible={setDeleteModalVisible}
        deleteMethod={handleDelete}
      />
    </>
  );
};

export default DetailFormActionButtons;
