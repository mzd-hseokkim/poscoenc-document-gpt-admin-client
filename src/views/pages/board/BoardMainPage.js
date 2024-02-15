import { useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CDateRangePicker,
  CForm,
  CFormInput,
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import { format } from 'date-fns';

import BoardPostDetailsForm from '../../../components/board/BoardPostDetailsForm';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import ModalContainer from '../../../components/modal/ModalContainer';
import UseModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';
import { getSearchedPostListApi, patchPostsDeletedOptionApi } from '../../../services/board/BoardService';
import { getColumnDefinitions } from '../../../utils/board/BoardColumnDefinitions';

const BoardMainPage = () => {
  const tableFields = getColumnDefinitions();

  const [selectedRows, setSelectedRows] = useState([]);
  //REMIND remove default postSearchResults

  const handleSelectedRows = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };
  // Delete -------------------------------------------------------------
  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const togglePostStatus = async (shouldDelete) => {
    try {
      const isSuccess = await patchPostsDeletedOptionApi(
        selectedRows.map((row) => row.id),
        shouldDelete
      );

      if (isSuccess) {
        await handleSearchSubmit();
        handleSelectedRows([]);
      }
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      await handleSearchSubmit();
    }
  };

  // Delete -------------------------------------------------------------

  // Modal --------------------------------------------------------------
  const modal = UseModal();
  const [clickedRowId, setClickedRowId] = useState(null);
  const handleClickedRowId = (newClickedRowId) => {
    setClickedRowId(newClickedRowId);
  };
  const scopedColumns = getScopedColumns(handleClickedRowId, modal.openModal);
  // ---------------------------------------------------------------

  // 검색 창 --------------------------------------------------------
  //REMIND post 로 기본값 줌
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [searchIsLoading, setSearchIsLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const addToast = useToast();

  const initialSearchFormData = {
    title: '',
    content: '',
    createdByName: '',
    hasFilesOption: '',
    fromCreatedAt: format(startDate, "yyyy-MM-dd'T'00:00"),
    toCreatedAt: format(endDate, "yyyy-MM-dd'T'23:59"),
    deletionOption: '',
  };
  const [searchRequestFormData, setSearchRequestFormData] = useState(initialSearchFormData);
  const handleSearchFormChange = ({ target: { id, value } }) => {
    setSearchRequestFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartDateChange = ({ newDate }) => {
    setSearchRequestFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
    }));
  };
  const handleEndDateChange = ({ newDate }) => {
    setSearchRequestFormData((prev) => ({
      ...prev,
      toCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'23:59"),
    }));
  };
  const handleReset = () => {
    setSearchRequestFormData(initialSearchFormData);
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    setEndDate(new Date());
  };
  const handleSearchSubmit = async () => {
    setSearchIsLoading(true);
    try {
      const searchResult = await getSearchedPostListApi(searchRequestFormData);
      setPostSearchResults(searchResult);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
    } finally {
      setSearchIsLoading(false);
    }
  };

  // 검색 창 --------------------------------------------------------

  //REMIND 구체적인 에러 핸들링 추가
  const [error, setError] = useState(null);

  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="row g-3 needs-validation">
            <CCardBody>
              <CForm onSubmit={handleSearchSubmit}>
                <CRow className="mb-3">
                  <CCol md={4} className="position-relative">
                    <CFormInput
                      type="text"
                      id="title"
                      label="제목"
                      onChange={handleSearchFormChange}
                      value={searchRequestFormData.title}
                    />
                  </CCol>
                  <CCol md={4} className="position-relative">
                    <CFormInput
                      id="createdByName"
                      label="작성자"
                      onChange={handleSearchFormChange}
                      value={searchRequestFormData.createdByName}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12} className="position-relative">
                    <CFormInput
                      id="content"
                      label="내용"
                      onChange={handleSearchFormChange}
                      value={searchRequestFormData.content}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={6} className="position-relative">
                    <CDateRangePicker
                      label="작성일"
                      startDate={startDate}
                      endDate={endDate}
                      onStartDateChange={(newDate) => handleStartDateChange({ id: 'createdAt', newDate })}
                      onEndDateChange={(newDate) => handleEndDateChange({ id: 'createdAt', newDate })}
                    />
                  </CCol>
                  <CCol md={3} className="position-relative">
                    <CFormSelect
                      id="hasFilesOption"
                      label="첨부파일 없는 게시물 포함"
                      name="hasFilesOption"
                      value={searchRequestFormData.hasFilesOption}
                      options={[
                        { label: '모든 게시글', value: '' },
                        { label: '예', value: true },
                        { label: '아니오', value: false },
                      ]}
                      onChange={handleSearchFormChange}
                    />
                  </CCol>
                  <CCol md={3} className="position-relative">
                    <CFormSelect
                      id="deletionOption"
                      label="게시글 상태"
                      name="deletionOption"
                      value={searchRequestFormData.deletionOption}
                      options={[
                        { label: '모든 게시글', value: '' },
                        { label: '삭제됨', value: 'Yes' },
                        { label: '삭제되지 않음', value: 'NO' },
                      ]}
                      onChange={handleSearchFormChange}
                    />
                  </CCol>
                </CRow>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton type="submit">{'검색'}</CButton>
                  <CButton onClick={handleReset} color="primary" value="Reset">
                    초기화
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard className="row g-3 mt-2">
        <CCardBody>
          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton
              disabled={selectedRows?.length === 0 || isDeletedRow(selectedRows)}
              onClick={() => {
                togglePostStatus(true);
              }}
            >
              {'삭제'}
            </CButton>
            <CButton
              disabled={selectedRows?.length === 0 || !isDeletedRow(selectedRows)}
              onClick={() => {
                togglePostStatus(false);
              }}
            >
              {'복구'}
            </CButton>
          </div>
          <CSmartTable
            // 페이징
            // REMIND 페이지네이션 컴포넌트 구현
            pagination
            activePage={1}
            itemsPerPageSelect
            itemsPerPage={10}
            itemsPerPageLabel={'페이지당 글 개수'}
            // 스피너
            loading={searchIsLoading}
            // 정렬
            // REMIND 커스텀 소터 구현
            sorterValue={{ column: 'id', state: 'asc' }}
            // 컬럼
            items={postSearchResults}
            columns={tableFields}
            selectable
            selected={selectedRows}
            // REMIND clickable row 대신에 제목 칸에 css pointer 적용
            scopedColumns={scopedColumns}
            // REMIND DOMException 처리
            onSelectedItemsChange={(selectedItems) => handleSelectedRows(selectedItems)}
            noItemsLabel="검색 결과가 없습니다."
            // 스타일
            tableProps={{
              responsive: true,
              hover: true,
            }}
          />
          <ModalContainer visible={modal.isOpen} title="게시글" onClose={modal.closeModal} size="lg">
            <BoardPostDetailsForm clickedRowId={clickedRowId}></BoardPostDetailsForm>
          </ModalContainer>
        </CCardBody>
      </CCard>
    </>
  );
};

export default BoardMainPage;
