import React, { useEffect, useState } from 'react';

import { CButton, CCol, CElementCover, CForm, CFormTextarea, CRow, CSpinner } from '@coreui/react-pro';
import InputList from 'components/input/InputList';
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
      const formattedData = {
        ...data,
        modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
        createdAt: data.createdAt && formatToYMD(data.createdAt),
      };
      reset(formattedData);
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
      postUser(data);
    } else if (isUpdateMode) {
      patchUser(data);
    }
  };

  const handleDeleteRestoreClick = async (id) => {
    const shouldDelete = !deleted;
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
          {...register('memo')}
          id="memo"
          name="memo"
          label="메모"
          placeholder="메모를 입력하세요."
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
        <InputList fields={userFields} isReadMode={isReadMode} register={register} errors={errors} />
        {renderMemoField()}
        <InputList fields={getAuditFields(formMode)} isReadMode={isReadMode} register={register} errors={errors} />
        <CRow>
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            {isUpdateMode && <CButton onClick={handleCancelClick}>취소</CButton>}
            {!isCreateMode && (
              <CButton onClick={() => handleDeleteRestoreClick(selectedId)}>{deleted ? '복구' : '삭제'}</CButton>
            )}
            {isReadMode ? <CButton onClick={handleUpdateClick}>수정</CButton> : <CButton type="submit">저장</CButton>}
          </CCol>
        </CRow>
      </CForm>
    </>
  );
};

export default UserDetailForm;
