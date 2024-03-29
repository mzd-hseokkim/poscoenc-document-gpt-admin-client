import React, { useEffect, useState } from 'react';

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModalBody,
  CModalFooter,
  CRow,
} from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import { useToast } from 'context/ToastContext';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';
import DocumentChatHistoryService from 'services/document-collection/DocumentChatHistoryService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import { formatToYMD } from 'utils/common/dateUtils';
import formModes from 'utils/common/formModes';

import 'components/document-collection/ChatHistoryQnA.css';

const DocumentChatHistoryDetailForm = ({ initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [formMode, setFormMode] = useState(initialFormMode || 'read');
  const [chatHistory, setChatHistory] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isCreateMode, isReadMode } = formModes(formMode);
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();

  const {
    reset,
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const chatHistoryAttributeFields = [
    {
      name: 'documentCollectionId',
      label: '문서 집합 아이디',
    },
    {
      name: 'documentCollectionDisplayName',
      label: '문서 집합 표시명',
    },
    {
      name: 'inputTokens',
      label: '인풋 토큰',
    },
    {
      name: 'outputTokens',
      label: '아웃풋 토큰',
    },
    {
      name: 'bingSearchs',
      label: 'Bing 검색 횟수',
    },
    {
      name: 'dallE3Generations',
      label: 'Dall_E_3 답변 생성 횟수',
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
        <CCardHeader className="h5">Audit</CCardHeader>
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
            <CCardHeader className="h5">Attributes</CCardHeader>
            <CCardBody>
              <FormInputGrid
                register={register}
                fields={chatHistoryAttributeFields}
                formData={chatHistory}
                isReadMode={isReadMode}
                col={2}
              />
            </CCardBody>
          </CCard>
          <CCard className="d-flex border-3">
            <CCardBody>
              <CCard className="mb-3 border-1">
                <CCardHeader className="bold h4">질문</CCardHeader>
                <CCardBody>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="markdown-content mt-3">
                    {chatHistory.question}
                  </ReactMarkdown>
                </CCardBody>
              </CCard>
              <CCard className="border-1">
                <CCardHeader className="bold h4">답변</CCardHeader>
                <CCardBody>
                  <ReactMarkdown remarkPlugins={[remarkGfm]} className="reactMarkdown">
                    {chatHistory.answer}
                  </ReactMarkdown>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCard>
        </CForm>
      </CModalBody>
      <CModalFooter></CModalFooter>
    </>
  );
};
export default DocumentChatHistoryDetailForm;
