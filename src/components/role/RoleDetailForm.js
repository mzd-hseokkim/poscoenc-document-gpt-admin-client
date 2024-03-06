import React, { useEffect, useState } from 'react';

import { CButton, CCol, CForm, CModalBody, CModalFooter, CRow } from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import InputList from 'components/input/InputList';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import RoleService from 'services/Role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';

const RoleDetailForm = ({ selectedId, initialFormMode, closeModal, fetchRoleList }) => {
  const [formMode, setFormMode] = useState(initialFormMode);
  const [isLoading, setIsLoading] = useState(false);

  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const deleted = watch('deleted');

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
      const formattedData = {
        ...data,
        modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
        createdAt: data.createdAt && formatToYMD(data.createdAt),
      };
      reset(formattedData);
    } catch (error) {
      addToast({ message: '권한 정보를 가져오지 못했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const createRole = async (data) => {
    try {
      await RoleService.postRole(data.role);
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

  const updateRole = async (data) => {
    try {
      await RoleService.putRole(data.id, data.role);
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

  const onSubmit = (data) => {
    if (isCreateMode) {
      createRole(data);
    } else if (isUpdateMode) {
      updateRole(data);
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
    const shouldDelete = !deleted;
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
      <FormLoadingCover isLoading={isLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          <InputList fields={roleFields} isReadMode={isReadMode} register={register} errors={errors} />
          <InputList fields={getAuditFields(formMode)} isReadMode={isReadMode} register={register} errors={errors} />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CRow>
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            {isUpdateMode && <CButton onClick={handleCancelClick}>취소</CButton>}
            {!isCreateMode && (
              <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>{deleted ? '복구' : '삭제'}</CButton>
            )}
            {isReadMode ? <CButton onClick={handleUpdateClick}>수정</CButton> : <CButton type="submit">저장</CButton>}
          </CCol>
        </CRow>
      </CModalFooter>
    </>
  );
};

export default RoleDetailForm;
