import React, { useEffect, useState } from 'react';

import { CButton, CCol, CElementCover, CRow, CSpinner } from '@coreui/react-pro';

import useToast from '../../hooks/useToast';
import RoleService from '../../services/Role/RoleService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import InputList from '../input/InputList';

const RoleDetailForm = ({ selectedId, initialFormMode, closeModal, fetchRoleList }) => {
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const [isLoading, setIsLoading] = useState(false);
  const addToast = useToast();

  const roleFields = [
    {
      name: 'id',
      label: '아이디',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'role',
      label: '권한',
      placeholder: '권한을 입력하세요.',
    },
  ];

  useEffect(() => {
    setIsLoading(false);
    if (!isCreateMode && selectedId) {
      fetchRoleDetail();
    }
  }, [selectedId]);

  const fetchRoleDetail = async () => {
    try {
      setIsLoading(true);
      const data = await RoleService.getRole(selectedId);
      setFormData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createAdmin = async () => {
    try {
      await RoleService.postRole(formData.role);
      closeModal();
      fetchRoleList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴를 등록할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const updateAdmin = async () => {
    try {
      await RoleService.putRole(formData.id, formData.role);
      closeModal();
      fetchRoleList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '메뉴를 수정할 수 없습니다.' });
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

  const handleSubmit = () => {
    if (isCreateMode) {
      createAdmin();
    } else if (isUpdateMode) {
      updateAdmin();
    }
  };

  const handleUpdateClick = () => {
    setFormMode('update');
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await RoleService.deleteRole(id, shouldDelete);
    } catch (error) {
      console.log(error);
    }
    closeModal();
    fetchRoleList();
  };

  return (
    <>
      {isLoading && (
        <CElementCover>
          <CSpinner variant="grow" color="primary" />
        </CElementCover>
      )}
      <InputList fields={roleFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
      <InputList
        fields={getAuditFields(formMode)}
        formData={formData}
        handleChange={handleChange}
        isReadMode={isReadMode}
      />
      <CRow>
        <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
          {!isCreateMode && (
            <>
              <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>
                {formData.deleted ? '복구' : '삭제'}
              </CButton>
            </>
          )}
          {isUpdateMode || isCreateMode ? (
            <CButton onClick={handleSubmit}>저장</CButton>
          ) : (
            <CButton onClick={handleUpdateClick}>수정</CButton>
          )}
        </CCol>
      </CRow>
    </>
  );
};

export default RoleDetailForm;