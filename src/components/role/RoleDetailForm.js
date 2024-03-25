import React, { useCallback, useEffect, useState } from 'react';

import { CCard, CCardBody, CCol, CForm, CFormInput, CModalBody, CModalFooter, CRow } from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import RoleService from 'services/Role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';

const RoleDetailForm = ({ selectedId, initialFormMode, closeModal, fetchRoleList }) => {
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

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
        setFormData(formattedData);
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
    closeModal();
    fetchRoleList();
  };

  const renderAuditFields = () => {
    return (
      <CCard className="g-3 mb-3">
        <CCardBody>
          <CRow>
            <CCol className="col-md mb-2">
              <CCol className="fw-bold">아이디</CCol>
              <CFormInput
                id="input-list-id"
                name="id"
                value={formData.id || ''}
                disabled={!isCreateMode}
                plainText={!isCreateMode}
              />
            </CCol>
            <CCol className="col-md mb-2">
              <CCol className="fw-bold">삭제</CCol>
              <CCol>
                <StatusBadge deleted={formData.deleted} />
              </CCol>
            </CCol>
          </CRow>
          <FormInputGrid fields={getAuditFields(formMode)} formData={formData} isReadMode={isReadMode} col={2} />
        </CCardBody>
      </CCard>
    );
  };

  return (
    <>
      <FormLoadingCover isLoading={isLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit)}>
          {!isCreateMode && renderAuditFields()}
          <CCard className="g-3 mb-3">
            <CCardBody>
              <FormInputGrid fields={roleFields} isReadMode={isReadMode} register={register} errors={errors} />
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={selectedId}
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
