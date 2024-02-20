import React, { useEffect, useState } from 'react';

import { CButton, CCol, CMultiSelect, CRow, CSpinner } from '@coreui/react-pro';

import { useToast } from '../../context/ToastContext';
import AdminService from '../../services/admin/AdminService';
import RoleService from '../../services/Role/RoleService';
import { getAuditFields } from '../../utils/common/auditFieldUtils';
import formModes from '../../utils/formModes';
import InputList from '../input/InputList';

const AdminDetailForm = ({ selectedId, initialFormMode, closeModal, fetchAdminList }) => {
  const [formData, setFormData] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);
  const [roles, setRoles] = useState([]);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const adminFields = [
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
    },
    {
      name: 'name',
      label: '이름',
      placeholder: '이름을 입력하세요.',
    },
    {
      name: 'password',
      label: '비밀번호',
      type: 'password',
      placeholder: '비밀번호를 입력하세요.',
      isRendered: isCreateMode,
    },
  ];
  const logInFields = [
    {
      name: 'lastLoggedInAt',
      label: '최근 로그인',
      type: 'date',
      isDisabled: isUpdateMode,
      isRendered: !isCreateMode,
    },
    {
      name: 'failedCnt',
      label: '로그인 실패 횟수',
      type: 'number',
      isRendered: !isCreateMode,
    },
  ];

  useEffect(() => {
    setIsLoading(false);
    if (!isCreateMode && selectedId) {
      fetchMenuDetail();
    } else {
      getRoles();
    }
  }, [selectedId]);

  const fetchMenuDetail = async () => {
    try {
      setIsLoading(true);
      const data = await AdminService.getAdmin(selectedId);
      setFormData(data);
      const allowedRoles = data.roles;
      await getRoles(allowedRoles);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoles = async (allowedRoles) => {
    try {
      const rolesData = await RoleService.getRoleList();
      const newRoles = rolesData.map((role) => ({
        value: role.role,
        text: role.role,
        selected: allowedRoles?.length > 0 ? allowedRoles.includes(role.role) : false,
      }));
      setRoles(newRoles);
    } catch (error) {
      addToast({ color: 'danger', message: error });
    }
  };

  const createAdmin = async () => {
    try {
      await AdminService.postAdmin(formData);
      closeModal();
      fetchAdminList();
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
      await AdminService.putAdmin(selectedId, formData);
      closeModal();
      fetchAdminList();
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

  const handleMultiSelect = (list) => {
    const roleList = list.map((item) => item.value);
    setFormData((prev) => ({ ...prev, roles: roleList }));
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
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
      await AdminService.deleteAdmin(id, shouldDelete);
    } catch (error) {
      console.log(error);
    }
    closeModal();
    fetchAdminList();
  };

  const renderRoleSelect = () => (
    <CRow className="mb-3">
      <CCol>
        <CMultiSelect
          options={roles}
          label="인가된 권한"
          placeholder="권한을 선택하세요."
          selectAllLabel="모두 선택"
          virtualScroller
          onChange={(values) => handleMultiSelect(values)}
          disabled={isReadMode}
        />
      </CCol>
    </CRow>
  );

  return (
    <>
      {isLoading && <CSpinner />}
      {!isLoading && (
        <>
          <InputList fields={adminFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
          {renderRoleSelect()}
          <InputList fields={logInFields} formData={formData} handleChange={handleChange} isReadMode={isReadMode} />
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
      )}
    </>
  );
};

export default AdminDetailForm;
