import React, { useEffect, useState } from 'react';

import { CButton, CCol, CElementCover, CForm, CFormTextarea, CRow, CSpinner } from '@coreui/react-pro';
import { useForm } from 'react-hook-form';

import { useToast } from '../../context/ToastContext';
import UserService from '../../services/UserService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import { emailValidationPattern } from '../../utils/validationUtils';
import InputList from '../input/InputList';

const UserDetailForm = ({ selectedId, initialFormMode, closeModal, fetchUserList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);

  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

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
      setFormData(data);
      reset(data);
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
      await UserService.putUser(selectedId, formData);
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

  const onSubmit = () => {
    if (isCreateMode) {
      postUser();
    } else if (isUpdateMode) {
      patchUser();
    }
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !formData.deleted;
    try {
      await UserService.deleteUser(id, shouldDelete);
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    closeModal();
    fetchUserList();
  };

  const handleCancelClick = () => {
    setFormMode('read');
    fetchUserDetail();
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
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
      {isLoading && (
        <CElementCover>
          <CSpinner variant="grow" color="primary" />
        </CElementCover>
      )}
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <InputList
          fields={userFields}
          formData={formData}
          handleChange={handleChange}
          isReadMode={isReadMode}
          control={control}
          errors={errors}
        />
        {renderMemoField()}
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

export default UserDetailForm;
