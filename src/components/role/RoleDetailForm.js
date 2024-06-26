import React, { useCallback, useEffect, useState } from 'react';

import { CCard, CCardBody, CForm, CModalBody, CModalFooter } from '@coreui/react-pro';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import { AuditFields } from 'components/form/AuditFields';
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import RoleService from 'services/role/RoleService';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';

const RoleDetailForm = ({ initialFormMode, closeModal, fetchRoleList }) => {
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const roleIdParam = searchParams.get('id');

  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const roleFields = [
    {
      name: 'role',
      label: '권한',
      placeholder: '권한을 입력하세요.',
      rules: {
        required: '필수 입력 항목입니다.',
      },
    },
  ];

  const fetchRoleDetail = useCallback(async () => {
    if (!roleIdParam) {
      return;
    }
    setIsLoading(true);
    try {
      const data = await RoleService.getRole(roleIdParam);
      const formattedData = {
        ...data,
        modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
        createdAt: data.createdAt && formatToYMD(data.createdAt),
      };
      reset(formattedData);
      setFormData(formattedData);
    } catch (error) {
      addToast({ message: `id={${roleIdParam}} 해당 권한 정보를 찾을 수 없습니다.` });
      closeModal();
    } finally {
      setIsLoading(false);
    }
  }, [roleIdParam, addToast, closeModal, reset]);
  useEffect(() => {
    if (!isCreateMode && roleIdParam) {
      void fetchRoleDetail();
    }
  }, [roleIdParam, fetchRoleDetail, isCreateMode]);

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

  const handleCancelClick = async () => {
    if (isUpdateMode) {
      setFormMode('read');
      await fetchRoleDetail();
    } else if (isCreateMode) {
      closeModal();
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };
  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await RoleService.deleteRoles([id], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    fetchRoleList();
  };

  return (
    <>
      <FormLoadingCover isLoading={isLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && <AuditFields formMode={formMode} formData={formData} isReadMode={isReadMode} />}
          <CCard className="g-3 mb-3">
            <CCardBody>
              <FormInputGrid fields={roleFields} isReadMode={isReadMode} register={register} errors={errors} />
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={searchParams.get('id')}
          formModes={formModes(formMode)}
          handleCancel={handleCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={handleUpdateClick}
          isDataDeleted={formData.deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default RoleDetailForm;
