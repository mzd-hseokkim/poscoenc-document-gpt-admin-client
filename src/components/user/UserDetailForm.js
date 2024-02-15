import React, { useEffect, useState } from 'react';

import { CButton, CCol, CFormTextarea, CRow, CSpinner } from '@coreui/react-pro';

import useToast from '../../hooks/useToast';
import UserService from '../../services/UserService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import InputList from '../input/InputList';

const UserDetailForm = ({ selectedId, initialFormMode, closeModal, fetchUserList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);

  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const addToast = useToast();

  const userFields = [
    {
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'email',
      label: '이메일',
      placeholder: '이메일을 입력하세요.',
    },
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
    },
    {
      name: 'team',
      label: '팀',
      placeholder: '팀명을 입력하세요.',
    },
  ];

  const getUserDetail = async () => {
    try {
      setIsLoading(true);
      const data = await UserService.getUserDetail(selectedId);
      setFormData(data);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    if (!isCreateMode && selectedId) {
      getUserDetail();
    }
  }, [selectedId]);

  const postUser = async () => {
    try {
      await UserService.postUser(formData);
      closeModal();
      fetchUserList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '사용자를 등록할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const patchUser = async () => {
    try {
      await UserService.putUserDetail(selectedId, formData);
      closeModal();
      fetchUserList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '사용자를 수정할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;

    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isCreateMode) {
      postUser();
    } else if (isUpdateMode) {
      patchUser();
    }
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await UserService.patchDeleteSingleUser(id, shouldDelete);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    }
    closeModal();
    fetchUserList();
  };

  const handleUpdateClick = () => {
    setFormMode('update');
  };

  const renderMemoField = () => (
    <CRow className="mb-3">
      <CCol>
        <CFormTextarea
          id="memo"
          name="memo"
          label="메모"
          placeholder="메모를 입력하세요."
          value={formData.memo || ''}
          onChange={handleChange}
          readOnly={isReadMode}
        />
      </CCol>
    </CRow>
  );

  return (
    <>
      {isLoading && <CSpinner />}
      {!isLoading && (
        <>
          <InputList fields={userFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
          {renderMemoField()}
          <InputList
            fields={getAuditFields(formMode)}
            formData={formData}
            handleChange={handleChange}
            isReadMode={isReadMode}
          />
          <CRow>
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              {isReadMode ? (
                <>
                  <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>
                    {formData.deleted ? '복구' : '삭제'}
                  </CButton>
                  <CButton onClick={handleUpdateClick}>수정</CButton>
                </>
              ) : (
                <>
                  <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>
                    {formData.deleted ? '복구' : '삭제'}
                  </CButton>
                  <CButton onClick={handleSubmit}>저장</CButton>
                </>
              )}
            </CCol>
          </CRow>
        </>
      )}
    </>
  );
};

export default UserDetailForm;
