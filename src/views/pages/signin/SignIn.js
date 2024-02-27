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
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { useToast } from '../../../context/ToastContext';
import SignInService from '../../../services/signin/SignInService';
import { emailValidationPattern, passwordValidationPattern } from '../../../utils/validationUtils';

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await SignInService.signIn(data);
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

  const emailValidation = {
    ...register('email', {
      required: '이메일을 입력하세요.',
      pattern: {
        value: emailValidationPattern,
        message: '유효한 이메일 주소를 입력하세요.',
      },
    }),
  };

  const passwordValidation = {
    ...register('password', {
      required: '비밀번호를 입력하세요.',
      pattern: {
        value: passwordValidationPattern,
        message: '유효한 비밀번호를 입력하세요.',
      },
    }),
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit(onSubmit)}>
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
                      {...emailValidation}
                      invalid={!!errors.email}
                      feedbackInvalid={errors.email?.message}
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
                      {...passwordValidation}
                      invalid={!!errors.password}
                      feedbackInvalid={errors.password?.message}
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
