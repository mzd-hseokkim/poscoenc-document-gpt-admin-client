import React, { useEffect, useState } from 'react';

import { CCard, CCardBody, CCol, CForm, CFormInput, CModalBody, CModalFooter, CRow } from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import DetailFormActionButtons from 'components/button/DetailFormActionButtons';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import FormInputGrid from 'components/input/FormInputGrid';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import DocumentChatHistoryService from 'services/document-collection/DocumentChatHistoryService';
import { getAuditFields } from 'utils/common/auditFieldUtils';
import formModes from 'utils/formModes';

const DocumentChatHistoryDetailForm = ({ initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [formMode, setFormMode] = useState(initialFormMode);
  const [chatHistory, setChatHistory] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);
  const [searchParams] = useSearchParams();

  const {
    reset,
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

  const chatHistoryInfoFields = [{}];

  useEffect(() => {
    setIsLoading(false);
    const chatId = searchParams.get('id');
  }, []);
  const fetchChatHistoryDetail = (chatId) => {
    setIsLoading(true);
    try {
      const detail = DocumentChatHistoryService.getDocumentChatHistory(chatId);
      console.log(detail);
      setChatHistory(detail);
      if (detail) {
        setChatHistory(detail);
      }
    } catch (errors) {
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = () => {};
  const handleModificationCancelClick = () => {};
  const handleDeleteRestoreClick = () => {};

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
            <CCol className="col-md mb-2">
              <CCol className="fw-bold">삭제</CCol>
              <CCol>
                <StatusBadge deleted={chatHistory.deleted} />
              </CCol>
            </CCol>
          </CRow>
          <FormInputGrid fields={getAuditFields(formMode)} formData={chatHistory} isReadMode={isReadMode} col={2} />
        </CCardBody>
      </CCard>
    );
  };
  return (
    <>
      <FormLoadingCover isLoading={isLoading} />

      <CModalBody>
        <CForm onSubmit={handleSubmit(onSubmit())}>{renderAuditFields()}</CForm>
      </CModalBody>
      <CModalFooter>
        <DetailFormActionButtons
          dataId={chatHistory.id}
          formModes={formModes(formMode)}
          handleCancel={handleModificationCancelClick}
          handleDeleteRestore={handleDeleteRestoreClick}
          handleUpdateClick={() => setFormMode('update')}
          isDataDeleted={chatHistory.deleted}
          onSubmit={handleSubmit(onSubmit)}
        />
      </CModalFooter>
    </>
  );
};
export default DocumentChatHistoryDetailForm;
