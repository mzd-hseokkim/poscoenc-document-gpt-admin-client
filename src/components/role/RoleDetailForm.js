import React, { useCallback, useEffect, useState } from 'react';

import { CForm, CModalBody, CModalFooter } from '@coreui/react-pro';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import InputList from 'components/input/InputList';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import RoleService from 'services/Role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';

const RoleDetailForm = ({ selectedId, initialFormMode, closeModal, fetchRoleList }) => {
  const [formMode, setFormMode] = useState(initialFormMode);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

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

  const fetchRoleDetail = useCallback(
    async (roleId) => {
      setIsLoading(true);
      try {
        const data = await RoleService.getRole(roleId);
        const formattedData = {
          ...data,
          modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
          createdAt: data.createdAt && formatToYMD(data.createdAt),
        };
        reset(formattedData);
      } catch (error) {
        addToast({ message: `id={${roleId}} 해당 권한 정보를 찾을 수 없습니다.` });
        closeModal();
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, closeModal, reset]
  );
  useEffect(() => {
    setIsLoading(false);
    const roleId = searchParams.get('id');
    if (!isCreateMode && roleId) {
      void fetchRoleDetail(roleId);
    }
  }, [fetchRoleDetail, isCreateMode, searchParams]);

  const createRole = async (data) => {
    try {
      const result = await RoleService.postRole(data.role);
      if (result) {
        closeModal();
        fetchRoleList();
        setFormMode('read');
      }
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
      const result = await RoleService.putRole(data.id, data.role);
      if (result) {
        closeModal();
        fetchRoleList();
        setFormMode('read');
      }
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
      void createRole(data);
    } else if (isUpdateMode) {
      void updateRole(data);
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
        <DetailFormActionButtons
          dataId={selectedId}
          formModes={formModes(formMode)}
          handleCancel={handleCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={handleUpdateClick}
          isDataDeleted={deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default RoleDetailForm;
