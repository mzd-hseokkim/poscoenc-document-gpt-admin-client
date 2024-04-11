import React, { useCallback, useEffect, useState } from 'react';

import { cilCloudDownload } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormLabel,
  CFormTextarea,
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react-pro';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import { BingSearchsChart } from 'components/chart/BingSearchsChart';
import { DallE3GenerationChart } from 'components/chart/DallE3GenerationChart';
import { TokenUsageChart } from 'components/chart/TokenUsageChart';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import StatisticsService from 'services/statistics/StatisticsService';
import UserService from 'services/UserService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';
import MonthLabelGenerator from 'utils/common/MonthLabelGenerator';
import { emailValidationPattern } from 'utils/common/validationUtils';

const UserDetailForm = ({ selectedId, initialFormMode, closeModal, fetchUserList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [formData, setFormData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({
    inputTokenData: [],
    outputTokenData: [],
    bingSearchsData: [],
    dallE3GenerationsData: [],
  });
  const [searchParams] = useSearchParams();
  const chartLabels = MonthLabelGenerator.pastYearMonthsChartLabels();

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

  const fetchUserDetail = useCallback(
    async (userId) => {
      if (!isCreateMode && !userId) {
        return;
      }
      try {
        setIsLoading(true);

        const data = await UserService.getUser(userId);
        const formattedData = {
          ...data,
          modifiedAt: data.modifiedAt && formatToYMD(data.modifiedAt),
          createdAt: data.createdAt && formatToYMD(data.createdAt),
        };
        reset(formattedData);
        setFormData(formattedData);
      } catch (error) {
        addToast({ message: `id={${userId}} 해당 사용자를 찾을 수 없습니다.` });
        closeModal();
      } finally {
        setIsLoading(false);
      }
    },
    [addToast, closeModal, isCreateMode, reset]
  );

  const fetchStatisticsData = useCallback(async (userId) => {
    setIsLoading(true);
    try {
      const responseData = await StatisticsService.getMonthlyStatisticsData({
        criteria: 'createdBy',
        criteriaKey: userId,
        endDate: new Date().toISOString().split('T')[0],
      });

      responseData.list.sort((a, b) => {
        const [yearA, monthA] = a.aggregationKey.split('-').map(Number);
        const [yearB, monthB] = b.aggregationKey.split('-').map(Number);

        if (yearA !== yearB) {
          return yearA - yearB;
        } else {
          return monthA - monthB;
        }
      });
      setStatisticsData({
        inputTokenData: responseData.list.map((item) => item.sumInputTokens),
        outputTokenData: responseData.list.map((item) => item.sumOutputTokens),
        bingSearchsData: responseData.list.map((item) => item.sumBingSearchs),
        dallE3GenerationsData: responseData.list.map((item) => item.sumDallE3Generations),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(false);
    const userId = searchParams.get('id');

    if (!isCreateMode && userId) {
      void fetchUserDetail(userId);
      void fetchStatisticsData(userId);
    }
  }, [fetchStatisticsData, fetchUserDetail, isCreateMode, searchParams, selectedId]);

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

  const handleCancelClick = async () => {
    if (isUpdateMode) {
      setFormMode('read');
      await fetchUserDetail(searchParams.get('id'));
    } else if (isCreateMode) {
      closeModal();
    }
  };

  const handleUpdateClick = (e) => {
    e.preventDefault();
    setFormMode('update');
  };

  const renderAuditFields = () => {
    return (
      <CCard className="g-3 mb-3">
        <CCardBody>
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
              <FormInputGrid fields={userInfoFields} isReadMode={isReadMode} register={register} errors={errors} />
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
        <CCard>
          <CCardHeader>
            <CRow>
              <CCol sm={5}>
                <h4 id="traffic" className="card-title mb-0">
                  사용 통계
                </h4>
                <div className="small text-medium-emphasis">
                  {chartLabels[0]} - {`${new Date().getFullYear()} / ${chartLabels[11]}`}
                </div>
              </CCol>
              <CCol sm={7} className="d-none d-md-block mt-2">
                {/*REMIND 차트 엑셀 다운로드 구현 가능 */}
                <CButton color="primary" className="float-end">
                  <CIcon icon={cilCloudDownload} />
                </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          {statisticsData?.length !== 0 && (
            <CCardBody>
              <CRow className="mb-3 justify-content-center">
                <TokenUsageChart
                  inputTokenData={statisticsData.inputTokenData}
                  outputTokenData={statisticsData.outputTokenData}
                />
              </CRow>
              <CRow className="justify-content-center">
                <CCol sm={5}>
                  <BingSearchsChart data={statisticsData.bingSearchsData} />
                </CCol>
                <CCol sm={5}>
                  <DallE3GenerationChart data={statisticsData.dallE3GenerationsData} />
                </CCol>
              </CRow>
            </CCardBody>
          )}
        </CCard>
      </CModalBody>
      <CModalFooter>
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
