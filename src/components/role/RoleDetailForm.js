import React, { useEffect, useState } from 'react';

import { CCard, CCardBody, CCol, CForm, CFormInput, CModalBody, CModalFooter, CRow } from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FromInputGrid from 'components/input/FromInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import RoleService from 'services/Role/RoleService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';

const RoleDetailForm = ({ selectedId, initialFormMode, closeModal, fetchRoleList }) => {
  const [formMode, setFormMode] = useState(initialFormMode);
  const [formData, setFormData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      setFormData(formattedData);
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
          <FromInputGrid fields={getAuditFields(formMode)} formData={formData} isReadMode={isReadMode} col={2} />
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
              <FromInputGrid fields={roleFields} isReadMode={isReadMode} register={register} errors={errors} />
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
