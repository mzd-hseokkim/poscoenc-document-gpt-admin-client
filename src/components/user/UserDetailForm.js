import React, { useEffect, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FromInputGrid from 'components/input/FromInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import UserService from 'services/UserService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/formModes';
import { emailValidationPattern } from 'utils/validationUtils';

const UserDetailForm = ({ selectedId, initialFormMode, closeModal, fetchUserList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formMode, setFormMode] = useState(initialFormMode);
  const [formData, setFormData] = useState([]);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const deleted = watch('deleted');

  const userInfoFields = [
    {
      name: 'email',
      label: '이메일',
      placeholder: '이메일을 입력하세요.',
      rules: {
        required: '이메일은 필수 입력 항목입니다.',
        pattern: {
          value: emailValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
      rules: {
        required: '이름은 필수 입력 항목입니다.',
      },
    },
    {
      name: 'team',
      label: '팀',
      placeholder: '팀명을 입력하세요.',
    },
  ];

  const fetchUserDetail = async () => {
    try {
      setIsLoading(true);

      const data = await UserService.getUser(selectedId);
      const formattedData = {
        ...data,
        modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
        createdAt: data.createdAt && formatToYMD(data.createdAt),
      };
      reset(formattedData);
      setFormData(formattedData);
    } catch (error) {
      addToast({ message: '사용자 정보를 가져오지 못했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
    if (!isCreateMode && selectedId) {
      fetchUserDetail();
    }
  }, [selectedId]);

  const postUser = async (data) => {
    try {
      await UserService.postUser(data);
      closeModal();
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

  const patchUser = async (data) => {
    try {
      await UserService.putUser(selectedId, data);
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

  const onSubmit = (data) => {
    if (isCreateMode) {
      void postUser(data);
    } else if (isUpdateMode) {
      void patchUser(data);
    }
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !deleted;
    try {
      await UserService.deleteUsers([id], shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    closeModal();
    fetchUserList();
  };

  const handleCancelClick = () => {
    setFormMode('read');
    void fetchUserDetail();
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
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
              <FromInputGrid fields={userInfoFields} isReadMode={isReadMode} register={register} errors={errors} />
              <CFormLabel htmlFor="detail-form-memo" className="col-form-label fw-bold">
                메모
              </CFormLabel>
              <CFormTextarea
                {...register('memo')}
                id="detail-form-memo"
                name="memo"
                placeholder={isReadMode ? '' : '메모를 입력하세요.'}
                plainText={isReadMode}
                readOnly={isReadMode}
              />
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CRow>
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            {isReadMode ? (
              <CButton onClick={handleUpdateClick}>수정</CButton>
            ) : (
              <CButton type="submit" onClick={handleSubmit(onSubmit)}>
                저장
              </CButton>
            )}
            {isUpdateMode && <CButton onClick={handleCancelClick}>취소</CButton>}
            {!isCreateMode && (
              <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>{deleted ? '복구' : '삭제'}</CButton>
            )}
          </CCol>
        </CRow>
        <DetailFormActionButtons
          dataId={selectedId}
          formModes={formModes(formMode)}
          handleCancel={handleCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={handleUpdateClick}
          isDataDeleted={deleted}
          //REMIND 관리자가 사용자 정보 수정 가능한지 결정되면 props 추가
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};

export default UserDetailForm;
