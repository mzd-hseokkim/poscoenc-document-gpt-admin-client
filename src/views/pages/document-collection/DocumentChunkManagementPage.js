import React, { useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDateRangePicker,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import FormLoadingCover from 'components/cover/FormLoadingCover';
import ChunkDetailForm from 'components/document-collection/ChunkDetailForm';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import documentChunkService from 'services/document-collection/DocumentChunkService';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from 'utils/common/dateUtils';
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';
import DocumentChunkColumnConfig from 'utils/document-collection/documentChunkColumnConfig';

const DocumentChunkManagementPage = () => {
  const [chunkList, setChunkList] = useState([]);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [detailFormMode, setDetailFormMode] = useState('');
  const [noItemsLabel, setNoItemsLabel] = useState('');
  const [totalChunkElements, setTotalChunkElements] = useState(0);
  const [isPickTime, setIsPickTime] = useState(false);

  const initialSearchFormData = {
    chunkedText: '',
    documentCollectionId: '',
    chunkSeq: '',
    pageId: '',
    documentCollectionFileId: '',
    documentCollectionFileNameOrg: '',
    fromCreatedAt: getOneYearAgoDate(),
    toCreatedAt: getCurrentDate(),
    createdByName: '',
  };

  const [searchFormData, setSearchFormData] = useState(initialSearchFormData);
  const isComponentMounted = useRef(true);
  const { addToast } = useToast();
  const modal = useModal();

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalChunkElements);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchDocumentChunkList();
    }
  }, [pageableData]);
  const searchDocumentChunkList = async () => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await documentChunkService.getSearchedDocumentChunk(searchFormData, pageableData);
      setChunkList(searchResult.content);
      setTotalChunkElements(searchResult.totalElements);
      if (searchResult.content.length === 0 && noItemsLabel === '') {
        setNoItemsLabel('검색 결과가 없습니다.');
      }
    } catch (error) {
      addToast({ message: error.message });
      console.log(error);
    } finally {
      setSearchResultIsLoading(false);
    }
  };
  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    await searchDocumentChunkList();
  };
  const handleSearchFormChange = ({ target: { id, value } }) => {
    setSearchFormData((prev) => ({ ...prev, [id]: value }));
  };
  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
    };
    const fieldToUpdate = fieldMap[id];
    if (fieldToUpdate) {
      const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : formatToIsoEndDate(newDate);
      setSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    }
  };

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);
    if (searchFormData.fromCreatedAt == null || searchFormData.toCreatedAt == null) {
      return;
    }
    setSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(searchFormData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(searchFormData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
    }));
  };

  const handleRowClick = (id) => {
    setDetailFormMode('read');
    modal.openModal(id);
  };

  const scopedColumns = {
    chunkSeq: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.chunkSeq}
      </td>
    ),
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
  };

  return (
    <>
      <CRow>
        <CCard className="row g-3">
          <FormLoadingCover isLoading={searchResultIsLoading} />
          <CCardBody>
            <CForm onSubmit={handleSubmitSearchRequest}>
              <CRow className="mb-3">
                <CCol md={8}>
                  <CFormInput
                    id="chunkedText"
                    label="청크 내용"
                    value={searchFormData.chunkedText}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    id="chunkSeq"
                    label="Chunk Sequence"
                    value={searchFormData.chunkSeq}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionId"
                    label="문서 집합 아이디"
                    value={searchFormData.documentCollectionId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionFileId"
                    label="문서 집합의 파일 아이디"
                    value={searchFormData.documentCollectionFileId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    id="documentCollectionFileNameOrg"
                    label="문서 집합 파일 이름"
                    value={searchFormData.documentCollectionFileNameOrg}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={3}>
                  <CFormInput
                    id="pageId"
                    label="해당 문서 페이지"
                    value={searchFormData.pageId}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={3} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    label="게시자"
                    onChange={handleSearchFormChange}
                    value={searchFormData.createdByName}
                  />
                </CCol>
                <CCol md={6}>
                  <CDateRangePicker
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={searchFormData.fromCreatedAt}
                    endDate={searchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={3} className="mt-3">
                  <CFormLabel />
                  <CFormCheck label="시간 검색 여부" checked={isPickTime} onChange={(e) => handleTimePickerCheck(e)} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton color="primary" value="Reset" onClick={() => setSearchFormData(initialSearchFormData)}>
                    초기화
                  </CButton>
                </CCol>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CRow>
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={columnSorterCustomProps}
                columns={DocumentChunkColumnConfig}
                items={chunkList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 문서 청크 개수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={noItemsLabel}
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={setSelectedRows}
                onSorterChange={handlePageSortChange}
                paginationProps={smartPaginationProps}
                scopedColumns={scopedColumns}
                selectable
                selected={selectedRows}
                tableProps={tableCustomProps}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
      <ModalContainer visible={modal.isOpen} title={'문서 집합 상세'} onClose={modal.closeModal} size="lg">
        <ChunkDetailForm
          closeModal={modal.closeModal}
          initialFormMode={detailFormMode}
          fetchChunkList={searchDocumentChunkList}
        />
      </ModalContainer>
    </>
  );
};
export default DocumentChunkManagementPage;
