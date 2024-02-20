import React, { useState } from 'react';

import { cilLockLocked, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CLoadingButton,
  CRow,
} from '@coreui/react-pro';
import { useNavigate } from 'react-router-dom';

import { useToast } from '../../../context/ToastContext';
import SignInService from '../../../services/signin/SignInService';
import { emailValidationPattern, passwordValidationPattern } from '../../../utils/validationUtils';

const SignIn = () => {
  const [userData, setUserData] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await SignInService.signIn(userData);
      const { token } = response;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        addToast({ color: 'danger', message: '이메일 혹은 비밀번호가 틀렸습니다.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateField = (name, value) => {
    if (name === 'email') {
      return !value || !emailValidationPattern.test(value) ? '유효하지 않은 이메일 주소입니다.' : '';
    } else if (name === 'password') {
      if (!value || value.length < 5) {
        return '비밀번호는 최소 5자 이상이어야 합니다.';
      }
      if (!passwordValidationPattern.test(value)) {
        return '유효하지 않은 비밀번호 형식입니다.';
      }
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1>로그인</h1>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      id="email"
                      placeholder="이메일"
                      autoComplete="email"
                      name="email"
                      onChange={handleChange}
                      invalid={!!errors.email}
                      feedbackInvalid={errors.email}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      id="password"
                      type="password"
                      placeholder="비밀번호"
                      autoComplete="current-password"
                      name="password"
                      onChange={handleChange}
                      invalid={!!errors.password}
                      feedbackInvalid={errors.password}
                    />
                  </CInputGroup>
                  <CRow>
                    <CLoadingButton loading={isLoading} color="primary" className="px-4" type="submit">
                      로그인
                    </CLoadingButton>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default SignIn;
