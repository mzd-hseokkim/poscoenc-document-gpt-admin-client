import React, { useEffect, useState } from 'react';

import { CCard, CCardBody, CCol, CForm, CFormInput, CModalBody, CModalFooter, CRow } from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import DocumentChatHistoryService from 'services/document-collection/DocumentChatHistoryService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';

const DocumentChatHistoryDetailForm = ({ initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [formMode, setFormMode] = useState(initialFormMode);
  const [chatHistory, setChatHistory] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const {
    reset,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const chatHistoryInfoFields = [
    {
      name: 'documentCollectionId',
      label: '문서 집합 아이디',
    },
    {
      name: 'documentCollectionDisplayName',
      label: '문서 집합 표시명',
    },
  ];

  useEffect(() => {
    setIsLoading(false);
    const chatId = searchParams.get('id');
    void fetchChatHistoryDetail(chatId);
  }, []);
  const fetchChatHistoryDetail = async (chatId) => {
    setIsLoading(true);
    if (!chatId) {
      return;
    }
    try {
      const detail = await DocumentChatHistoryService.getDocumentChatHistory(chatId);
      const formattedDetail = {
        ...detail,
        createdAt: detail.createdAt && formatToYMD(detail.createdAt),
        modifiedAt: detail.modifiedAt && formatToYMD(detail.modifiedAt),
      };
      setChatHistory(formattedDetail);
      reset(formattedDetail);
    } catch (error) {
      if (error.response?.status === 404) {
        addToast({ message: `id={${chatId}} 해당 대화 이력을 찾을 수 없습니다.` });
      } else {
        console.log(error);
      }
      closeModal();
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = () => {
    //REMIND FormInputGrid 를 사용하기 위해 CForm 내부에 선언해줘야합니다. 다만 수정, 삭제 등의 로직이 없기 때문에 Submit 함수를 비워두었습니다.
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
                value={chatHistory.id || ''}
                disabled={!isCreateMode}
                plainText={!isCreateMode}
              />
            </CCol>
          </CRow>
          <FormInputGrid
            register={register}
            fields={getAuditFields(formMode)}
            formData={chatHistory}
            isReadMode={isReadMode}
            col={2}
          />
        </CCardBody>
      </CCard>
    );
  };
  return (
    <>
      <FormLoadingCover isLoading={isLoading} />
      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit())}>
          {renderAuditFields()}
          <CCard className="mb-3">
            <CCardBody>
              <FormInputGrid
                register={register}
                fields={chatHistoryInfoFields}
                formData={chatHistory}
                isReadMode={isReadMode}
                col={2}
              />
            </CCardBody>
          </CCard>
          <CCard>
            <CCardBody>{/*TODO 회의 후 구현*/} 채팅 내용</CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter></CModalFooter>
    </>
  );
};
export default DocumentChatHistoryDetailForm;
