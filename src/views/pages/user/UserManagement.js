import { useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDateRangePicker,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
} from '@coreui/react-pro';
import { format } from 'date-fns';

import useToast from '../../../hooks/useToast';
import userService from '../../../services/UserService';

const UserManagement = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const addToast = useToast();

  const initialFormData = {
    name: '',
    email: '',
    team: '',
    memo: '',
    fromLastPullRequest: format(startDate, 'yyyy-MM-dd'),
    toLastPullRequest: format(endDate, 'yyyy-MM-dd'),
    findEmptyPullRequest: true,
    deletionOption: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleSubmit = async () => {
    try {
      const data = await userService.getUserList(formData);
      console.log(data.content);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
    }
  };

  const handleChange = ({ target: { id, value } }) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      fromLastPullRequest: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
    }));
  };

  const handleEndDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      toLastPullRequest: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
    }));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    setEndDate(new Date());
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="row g-3 needs-validation">
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={4} className="position-relative">
                  <CFormInput type="text" id="name" label="이름" onChange={handleChange} />
                </CCol>
                <CCol md={4} className="position-relative">
                  <CFormInput type="text" id="email" label="이메일" onChange={handleChange} />
                </CCol>
                <CCol md={4} className="position-relative">
                  <CFormInput id="team" label="팀" onChange={handleChange} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={12} className="position-relative">
                  <CFormInput id="memo" label="메모" onChange={handleChange} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6} className="position-relative">
                  <CDateRangePicker
                    label="최근 PR 일시"
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={(newDate) => handleStartDateChange(newDate)}
                    onEndDateChange={(newDate) => handleEndDateChange(newDate)}
                  />
                </CCol>
                <CCol md={3} className="position-relative">
                  <CFormSelect
                    id="findEmptyPullRequest"
                    label="PR 없는 사용자 포함"
                    name="findEmptyPullRequest"
                    options={[
                      { label: '예', value: true },
                      { label: '아니오', value: false },
                    ]}
                    onChange={handleChange}
                  />
                </CCol>
                <CCol md={3} className="position-relative">
                  <CFormSelect
                    id="deletionOption"
                    label="사용자 상태"
                    name="deletionOption"
                    options={[
                      { label: '모든 사용자', value: '' },
                      { label: '삭제됨', value: 'Yes' },
                      { label: '삭제되지 않음', value: 'NO' },
                    ]}
                    onChange={handleChange}
                  />
                </CCol>
              </CRow>
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit">검색</CButton>
                <CButton onClick={handleReset} color="secondary" value="Reset">
                  초기화
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default UserManagement;
