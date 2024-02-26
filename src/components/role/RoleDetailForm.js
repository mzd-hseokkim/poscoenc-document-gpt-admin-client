import React, { useEffect, useState } from 'react';

import { CButton, CCol, CElementCover, CForm, CRow, CSpinner } from '@coreui/react-pro';
import { useForm } from 'react-hook-form';

import { useToast } from '../../context/ToastContext';
import RoleService from '../../services/Role/RoleService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import InputList from '../input/InputList';

const RoleDetailForm = ({ selectedId, initialFormMode, closeModal, fetchRoleList }) => {
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);
  const [isLoading, setIsLoading] = useState(false);

  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

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
      rules: {
        required: '필수 입력 항목입니다.',
      },
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
      reset(data);
    } catch (error) {
      addToast({ message: '권한 정보를 가져오지 못했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async () => {
    try {
      await RoleService.postRole(formData.role);
      closeModal();
      fetchRoleList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '권한을 등록할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const updateRole = async () => {
    try {
      await RoleService.putRole(formData.id, formData.role);
      closeModal();
      fetchRoleList();
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '권한을 수정할 수 없습니다.' });
      }
      if (status === 409) {
        addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해주세요.' });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    if (isCreateMode) {
      createRole();
    } else if (isUpdateMode) {
      updateRole();
    }
  };

  const handleCancelClick = () => {
    setFormMode('read');
    fetchRoleDetail();
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };
  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await RoleService.deleteRole(id, shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
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
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <InputList
          fields={roleFields}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
          control={control}
          errors={errors}
        />
        <InputList
          fields={getAuditFields(formMode)}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
        />
        <CRow>
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            {isUpdateMode && <CButton onClick={handleCancelClick}>취소</CButton>}
            {!isCreateMode && (
              <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>
                {formData.deleted ? '복구' : '삭제'}
              </CButton>
            )}
            {isReadMode ? <CButton onClick={handleUpdateClick}>수정</CButton> : <CButton type="submit">저장</CButton>}
          </CCol>
        </CRow>
      </CForm>
    </>
  );
};

export default RoleDetailForm;
