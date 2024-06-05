import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cilCommentBubble, cilPaperclip } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
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
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import BoardPostDetailForm from 'components/board/BoardPostDetailForm';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import BoardService from 'services/board/BoardService';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from 'utils/common/dateUtils';
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';
import { postColumnConfig } from 'views/pages/board/postColumnConfig';

const createInitialSearchFormData = () => ({
  title: '',
  content: '',
  createdByName: '',
  hasFilesOption: '',
  fromCreatedAt: getOneYearAgoDate(),
  toCreatedAt: getCurrentDate(),
  fromModifiedAt: getOneYearAgoDate(),
  toModifiedAt: getCurrentDate(),
  deletionOption: 'ALL',
});

const BoardManagementPage = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [postList, setPostList] = useState([]);
  const [postFormMode, setPostFormMode] = useState('');
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [totalPostElements, setTotalPostElements] = useState(0);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [isPickTime, setIsPickTime] = useState(false);

  const [searchFormData, setSearchFormData] = useState({});
  const [stagedSearchFormData, setStagedSearchFormData] = useState(createInitialSearchFormData);

  const isComponentMounted = useRef(true);

  const modal = useModal();
  const { addToast } = useToast();
  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalPostElements);

  const handleRowClick = (itemId) => {
    setPostFormMode('read');
    modal.openModal(itemId);
  };

  const handleCreateClick = () => {
    setPostFormMode('create');
    modal.openModal();
  };

  const scopedColumnsUpdate = {
    title: (item) => {
      return (
        <td
          style={{ cursor: 'pointer' }}
          onClick={() => {
            handleRowClick(item.id);
          }}
        >
          {item.hasFiles ? <CIcon icon={cilPaperclip} size="sm" className="me-1" /> : ''}
          {item.title}

          {item.comments ? (
            <>
              <CIcon icon={cilCommentBubble} size="sm" className="ms-2" />
              {item.comments.length}
            </>
          ) : (
            ''
          )}
        </td>
      );
    },
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    deleted: (item) => (
      <td>
        <DeletionStatusBadge deleted={item.deleted} />
      </td>
    ),
  };
  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const searchPostList = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed) {
      setIsSearchPerformed(true);
    }
    try {
      const searchResult = await BoardService.getSearchedPostList(searchFormData, pageableData);
      setPostList(searchResult.content);
      setTotalPostElements(searchResult.totalElements);
    } catch (error) {
      addToast({ message: '검색 조건을 확인 해 주세요.' });
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, isSearchPerformed, pageableData, searchFormData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchPostList();
    }
  }, [pageableData, searchPostList]);

  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    setSearchFormData(stagedSearchFormData);
  };

  const handleSearchFormReset = () => {
    setStagedSearchFormData(createInitialSearchFormData);
    setIsPickTime(false);
  };
  const handleSearchFormChange = ({ target: { id, value } }) => {
    setStagedSearchFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleDateChange = ({ id, newDate, isStartDate = true }) => {
    const fieldMap = {
      createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      modifiedAt: isStartDate ? 'fromModifiedAt' : 'toModifiedAt',
    };

    const fieldToUpdate = fieldMap[id];
    if (fieldToUpdate) {
      const formattedDate = isStartDate ? formatToIsoStartDate(newDate) : formatToIsoEndDate(newDate);
      setStagedSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    }
  };

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);
    setStagedSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(stagedSearchFormData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(stagedSearchFormData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
      fromModifiedAt: format(stagedSearchFormData.fromModifiedAt, "yyyy-MM-dd'T'00:00"),
      toModifiedAt: format(stagedSearchFormData.toModifiedAt, "yyyy-MM-dd'T'23:59"),
    }));
  };

  const togglePostStatus = async (deletionOption) => {
    try {
      const isSuccess = await BoardService.patchPostsDeletionOption(
        selectedRows.map((row) => row.id),
        deletionOption
      );

      if (isSuccess) {
        setSelectedRows([]);
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '삭제할 게시글을 선택해주세요.' });
      } else if (status === 404) {
        addToast({ message: '삭제할 게시글을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      await searchPostList();
    }
  };

  return (
    <>
      <CRow>
        <CCard className="row g-3 needs-validation">
          <CCardBody>
            <CForm onSubmit={handleSubmitSearchRequest}>
              <CRow className="mb-3">
                <CCol md={6} className="position-relative">
                  <CFormInput
                    type="text"
                    id="title"
                    floatingLabel="제목"
                    placeholder=""
                    onChange={handleSearchFormChange}
                    value={stagedSearchFormData.title}
                  />
                </CCol>
                <CCol md={6} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    floatingLabel="작성자"
                    placeholder=""
                    onChange={handleSearchFormChange}
                    value={stagedSearchFormData.createdByName}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6} className="position-relative">
                  <CFormInput
                    id="content"
                    floatingLabel="내용"
                    placeholder=""
                    onChange={handleSearchFormChange}
                    value={stagedSearchFormData.content}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormSelect
                    id="deletionOption"
                    label="게시글 상태"
                    name="deletionOption"
                    value={stagedSearchFormData.deletionOption}
                    options={[
                      { label: '모든 게시글', value: '' },
                      { label: '삭제됨', value: 'Yes' },
                      { label: '삭제되지 않음', value: 'NO' },
                    ]}
                    onChange={handleSearchFormChange}
                  ></CFormSelect>
                </CCol>
                <CCol md={6} className="position-relative">
                  <CFormSelect
                    id="hasFilesOption"
                    label="첨부파일 없는 게시물 포함 여부"
                    name="hasFilesOption"
                    value={stagedSearchFormData.hasFilesOption}
                    options={[
                      { label: '모든 게시글', value: '' },
                      { label: '예', value: true },
                      { label: '아니오', value: false },
                    ]}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={5}>
                  <CDateRangePicker
                    key={`createdAt-${isPickTime}`}
                    id="createdAt"
                    label="등록일"
                    startDate={stagedSearchFormData.fromCreatedAt}
                    endDate={stagedSearchFormData.toCreatedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'createdAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={5}>
                  <CDateRangePicker
                    key={`modifiedAt-${isPickTime}`}
                    id="modifiedAt"
                    label="수정일"
                    startDate={stagedSearchFormData.fromModifiedAt}
                    endDate={stagedSearchFormData.toModifiedAt}
                    onStartDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate })}
                    onEndDateChange={(newDate) => handleDateChange({ id: 'modifiedAt', newDate, isStartDate: false })}
                    timepicker={isPickTime}
                  />
                </CCol>
                <CCol md={2} className="mt-5">
                  <CFormCheck label="시간 검색 여부" checked={isPickTime} onChange={(e) => handleTimePickerCheck(e)} />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton onClick={handleSearchFormReset} color="primary" value="Reset">
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
              <CCol className="d-grid gap-2 d-md-flex justify-content-md-start">
                <CButton onClick={handleCreateClick}>작성</CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
                  onClick={() => togglePostStatus(true)}
                >
                  삭제
                </CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
                  onClick={() => togglePostStatus(false)}
                >
                  복구
                </CButton>
                <ExcelDownloadCButton
                  downloadFunction={BoardService.getDownloadSearchedPostList}
                  searchFormData={searchFormData}
                  hasSearchResults={postList.length !== 0}
                />
              </CCol>
              <CCol className="d-flex justify-content-end">
                <CFormLabel>총 {totalPostElements} 개의 검색 결과</CFormLabel>
              </CCol>
            </CRow>
            <CSmartTable
              columnSorter={columnSorterCustomProps}
              columns={postColumnConfig}
              items={postList}
              itemsPerPage={pageableData.size}
              itemsPerPageLabel={'페이지당 글 개수'}
              itemsPerPageSelect
              loading={searchResultIsLoading}
              noItemsLabel={
                <CSmartTableNoItemLabel
                  contentLength={postList.length}
                  isSearchPerformed={isSearchPerformed}
                  defaultMessage="검색 조건에 맞는 게시글을 검색합니다."
                />
              }
              onItemsPerPageChange={handlePageSizeChange}
              onSelectedItemsChange={setSelectedRows}
              onSorterChange={handlePageSortChange}
              paginationProps={smartPaginationProps}
              scopedColumns={scopedColumnsUpdate}
              selectable
              selected={selectedRows}
              tableProps={tableCustomProps}
            />
            <ModalContainer visible={modal.isOpen} title="게시글" onClose={modal.closeModal} size="lg">
              <BoardPostDetailForm
                closeModal={modal.closeModal}
                initialFormMode={postFormMode}
                refreshPosts={() => setSearchFormData(stagedSearchFormData)}
              />
            </ModalContainer>
          </CCardBody>
        </CCard>
      </CRow>
    </>
  );
};

export default BoardManagementPage;
