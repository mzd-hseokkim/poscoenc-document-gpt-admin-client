import React, { useEffect, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCardTitle,
  CCol,
  CDateRangePicker,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';

import StatusBadge from '../../../components/badge/StatusBadge';
import DocumentCollectionDetailForm from '../../../components/document-collection/DocumentCollectionDetailForm';
import ModalContainer from '../../../components/modal/ModalContainer';
import { useToast } from '../../../context/ToastContext';
import useModal from '../../../hooks/useModal';
import DocumentCollectionService from '../../../services/document-collection/DocumentCollectionService';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from '../../../utils/common/dateUtils';
import { documentCollectionColumnConfig } from '../../../utils/document-collection/documentCollectionColumnConfig';

const DocumentCollectionManagementPage = () => {
  const [documentCollectionList, setDocumentCollectionList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [clickedRowId, setClickedRowId] = useState();
  const [detailFormMode, setDetailFormMode] = useState('');
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);

  const initialSearchFormData = () => ({
    name: '',
    displayName: '',
    createdByName: '',
    fromCreatedAt: getOneYearAgoDate(),
    toCreatedAt: getCurrentDate(),
    deletionOption: 'ALL',
  });

  const [searchFormData, setSearchFormData] = useState(initialSearchFormData);

  const modal = useModal();
  const { addToast } = useToast();

  useEffect(() => {
    setSearchResultIsLoading(false);
  }, []);

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };
  const searchDocumentCollectionList = async () => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await DocumentCollectionService.getSearchedCollectionList(searchFormData);
      setDocumentCollectionList(searchResult);
    } catch (error) {
      //REMIND only sever error occur
      console.log(error);
    } finally {
      setSearchResultIsLoading(false);
    }
  };

  const handleRowClick = (id) => {
    setClickedRowId(id);
    setDetailFormMode('read');
    modal.openModal();
  };

  const scopedColumns = {
    displayName: (item) => (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleRowClick(item.id);
        }}
      >
        {item.displayName}
      </td>
    ),
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
  };
  const handleSearchFormChange = ({ target: { id, value } }) => {
    setSearchFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      modifiedAt: isStartDate ? 'fromModifiedAt' : 'toModifiedAt',
    };
    const fieldToUpdate = fieldMap[id];
    if (fieldToUpdate) {
      const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : formatToIsoEndDate(newDate);
      setSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    }
  };

  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    await searchDocumentCollectionList();
  };
  const toggleDocumentCollectionStatus = async (deletionOption) => {
    try {
      const isSuccess = await DocumentCollectionService.patchCollectionsDeletionOption(
        selectedRows.map((row) => row.id),
        deletionOption
      );

      if (isSuccess) {
        setSelectedRows([]);
      }
    } catch (error) {
      const statusCode = error.status;
      if (statusCode === 400) {
        addToast({ message: '삭제할 문서 집합을 선택해주세요.' });
      } else if (statusCode === 404) {
        addToast({ message: '삭제할 문서 집합을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      await searchDocumentCollectionList();
    }
  };

  const handleUploadClick = () => {
    setDetailFormMode('create');
    modal.openModal();
  };

  const handleCloseModal = () => {
    modal.closeModal();
    setClickedRowId(null);
  };

  return (
    <>
      <CCard className="row g-3">
        <CCardBody>
          <CCardTitle>문서 관리</CCardTitle>
          <CForm onSubmit={handleSubmitSearchRequest}>
            <CRow className="mb-3">
              <CCol md={4}>
                <CFormInput
                  id="name"
                  label="문서 집합 이름"
                  value={searchFormData.name}
                  onChange={handleSearchFormChange}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  id="displayName"
                  label="표시명"
                  value={searchFormData.displayName}
                  onChange={handleSearchFormChange}
                ></CFormInput>
              </CCol>
              <CCol md={4} className="position-relative">
                <CFormInput
                  id="createdByName"
                  label="게시자"
                  onChange={handleSearchFormChange}
                  value={searchFormData.createdByName}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3"></CRow>
            <CRow className="mb-3">
              <CCol md={6}>
                <CDateRangePicker
                  id="createdAt"
                  label="생성일"
                  startDate={searchFormData.fromCreatedAt}
                  endDate={searchFormData.toCreatedAt}
                  onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                  onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                />
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  id="deletionOption"
                  label="삭제된 문서 포함"
                  name="deletionOption"
                  options={[
                    { label: '선택하지 않음', value: '' },
                    { label: '예', value: 'YES' },
                    { label: '아니오', value: 'NO' },
                  ]}
                  value={searchFormData.deletionOption}
                  onChange={handleSearchFormChange}
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit">검색</CButton>
                <CButton color="primary" value="Reset" onClick={() => setSearchFormData(initialSearchFormData)}>
                  초기화
                </CButton>
              </CCol>
            </CRow>
          </CForm>
          <CRow className="mb-3">
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={handleUploadClick}>문서 게시</CButton>
              <CButton
                disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
                onClick={() => toggleDocumentCollectionStatus(true)}
              >
                {'삭제'}
              </CButton>
              <CButton
                disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
                onClick={() => toggleDocumentCollectionStatus(false)}
              >
                {'복구'}
              </CButton>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CSmartTable
              pagination
              activePage={1}
              itemsPerPageSelect
              itemsPerPage={10}
              itemsPerPageLabel="페이지당 문서 집합 개수"
              loading={searchResultIsLoading}
              items={documentCollectionList}
              noItemsLabel="검색 결과가 없습니다."
              columns={documentCollectionColumnConfig}
              selectable
              selected={selectedRows}
              onSelectedItemsChange={(selectedItems) => setSelectedRows(selectedItems)}
              scopedColumns={scopedColumns}
              tableProps={{
                responsive: true,
                hover: true,
              }}
            />
          </CRow>
        </CCardBody>
      </CCard>
      {/*REMIND Modal open 시 url 변경되게 수정*/}
      <ModalContainer
        visible={modal.isOpen}
        title={detailFormMode === 'create' ? '문서 게시' : '문서 집합 상세'}
        onClose={handleCloseModal}
        size="lg"
      >
        <DocumentCollectionDetailForm
          clickedRowId={clickedRowId}
          initialFormMode={detailFormMode}
          closeModal={handleCloseModal}
          refreshDocumentCollectionList={searchDocumentCollectionList}
        />
      </ModalContainer>
    </>
  );
};

export default DocumentCollectionManagementPage;
