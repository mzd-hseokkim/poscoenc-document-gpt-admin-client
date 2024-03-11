import React, { useEffect, useRef, useState } from 'react';

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
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import BoardPostDetailForm from 'components/board/BoardPostDetailForm';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import ModalContainer from 'components/modal/ModalContainer';
import { useToast } from 'context/ToastContext';
import { format } from 'date-fns';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import BoardService from 'services/board/BoardService';
import { postColumnConfig } from 'utils/board/postColumnConfig';
import {
  formatToIsoEndDate,
  formatToIsoStartDate,
  formatToYMD,
  getCurrentDate,
  getOneYearAgoDate,
} from 'utils/common/dateUtils';
import { columnSorterCustomProps, tableCustomProps } from 'utils/common/smartTablePropsConfig';

const BoardManagementPage = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [postList, setPostList] = useState([]);
  const [postFormMode, setPostFormMode] = useState('');
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [totalPostElements, setTotalPostElements] = useState(0);
  const [noItemsLabel, setNoItemsLabel] = useState('');
  const [isPickTime, setIsPickTime] = useState(false);

  //REMIND searchForm audit 정보 통합해보기.
  const initialSearchFormData = {
    title: '',
    content: '',
    createdByName: '',
    hasFilesOption: '',
    fromCreatedAt: getOneYearAgoDate(),
    toCreatedAt: getCurrentDate(),
    fromModifiedAt: getOneYearAgoDate(),
    toModifiedAt: getCurrentDate(),
    deletionOption: 'ALL',
  };
  const [searchFormData, setSearchFormData] = useState(initialSearchFormData);
  const isComponentMounted = useRef(true);

  const modal = useModal();
  const { addToast } = useToast();
  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } =
    usePagination(totalPostElements);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      void searchPostList();
    }
  }, [pageableData]);

  const handleRowClick = (itemId) => {
    setPostFormMode('read');
    modal.openModal(itemId);
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
          {item.title}
          {item.hasFiles ? <CIcon icon={cilPaperclip} size="sm" className="ms-2" /> : ''}
          {item.comments ? <CIcon icon={cilCommentBubble} size="sm" className="ms-2" /> : ''}
        </td>
      );
    },
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
  };
  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const searchPostList = async () => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await BoardService.getSearchedPostList(searchFormData, pageableData);
      setPostList(searchResult.content);
      setTotalPostElements(searchResult.totalElements);
      if (searchResult.content.length === 0 && noItemsLabel === '') {
        setNoItemsLabel('검색 결과가 없습니다.');
      }
    } catch (error) {
      addToast({ message: '검색 조건을 확인 해 주세요.' });
    } finally {
      setSearchResultIsLoading(false);
    }
  };
  const handleSubmitSearchRequest = async (e) => {
    e.preventDefault();
    await searchPostList();
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

  const handleTimePickerCheck = (e) => {
    setIsPickTime(e.target.checked);
    setSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(searchFormData.fromCreatedAt, "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(searchFormData.toCreatedAt, "yyyy-MM-dd'T'23:59"),
      fromModifiedAt: format(searchFormData.fromModifiedAt, "yyyy-MM-dd'T'00:00"),
      toModifiedAt: format(searchFormData.toModifiedAt, "yyyy-MM-dd'T'23:59"),
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
                <CCol md={4} className="position-relative">
                  <CFormInput
                    type="text"
                    id="title"
                    label="제목"
                    onChange={handleSearchFormChange}
                    value={searchFormData.title}
                  />
                </CCol>
                <CCol md={4} className="position-relative">
                  <CFormInput
                    id="createdByName"
                    label="작성자"
                    onChange={handleSearchFormChange}
                    value={searchFormData.createdByName}
                  />
                </CCol>
                <CCol md={4} className="position-relative">
                  <CFormSelect
                    id="deletionOption"
                    label="게시글 상태"
                    name="deletionOption"
                    value={searchFormData.deletionOption}
                    options={[
                      { label: '모든 게시글', value: '' },
                      { label: '삭제됨', value: 'Yes' },
                      { label: '삭제되지 않음', value: 'NO' },
                    ]}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={8} className="position-relative">
                  <CFormInput
                    id="content"
                    label="내용"
                    onChange={handleSearchFormChange}
                    value={searchFormData.content}
                  />
                </CCol>
                <CCol md={4} className="position-relative">
                  <CFormSelect
                    id="hasFilesOption"
                    label="첨부파일 없는 게시물 포함"
                    name="hasFilesOption"
                    value={searchFormData.hasFilesOption}
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
                    startDate={searchFormData.fromCreatedAt}
                    endDate={searchFormData.toCreatedAt}
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
                    startDate={searchFormData.fromModifiedAt}
                    endDate={searchFormData.toModifiedAt}
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
                  <CButton
                    onClick={() => {
                      setSearchFormData(initialSearchFormData);
                    }}
                    color="primary"
                    value="Reset"
                  >
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
                <CButton
                  disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
                  onClick={() => togglePostStatus(true)}
                >
                  {'삭제'}
                </CButton>
                <CButton
                  disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
                  onClick={() => togglePostStatus(false)}
                >
                  {'복구'}
                </CButton>
              </CCol>
              <CCol className="d-grid gap-2 justify-content-end">
                <ExcelDownloadCButton
                  downloadFunction={BoardService.getDownloadSearchedPostList}
                  searchFormData={searchFormData}
                />
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
              noItemsLabel={noItemsLabel}
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
                refreshPosts={searchPostList}
              />
            </ModalContainer>
          </CCardBody>
        </CCard>
      </CRow>
    </>
  );
};

export default BoardManagementPage;
