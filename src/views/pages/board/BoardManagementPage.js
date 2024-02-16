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

import BoardPostDetailForm from '../../../components/board/BoardPostDetailForm';
import { getScopedColumns } from '../../../components/board/BoardScopedColumn';
import ModalContainer from '../../../components/modal/ModalContainer';
import useModal from '../../../hooks/useModal';
import useToast from '../../../hooks/useToast';
import BoardService from '../../../services/board/BoardService';
import { postColumnConfig } from '../../../utils/board/postColumnConfig';

const BoardManagementPage = () => {
  // 2. useState
  const [selectedRows, setSelectedRows] = useState([]);
  const [clickedRowId, setClickedRowId] = useState(null);
  const [postSearchResults, setPostSearchResults] = useState([]);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const initialSearchFormData = {
    title: '',
    content: '',
    createdByName: '',
    hasFilesOption: '',
    fromCreatedAt: format(startDate, "yyyy-MM-dd'T'00:00"),
    toCreatedAt: format(endDate, "yyyy-MM-dd'T'23:59"),
    deletionOption: '',
  };
  const [searchFormData, setSearchFormData] = useState(initialSearchFormData);
  const [error, setError] = useState(null);

  // 3. hooks
  const tableFields = postColumnConfig;
  const modal = useModal();
  const addToast = useToast();
  const handleClickedRowId = (newClickedRowId) => {
    setClickedRowId(newClickedRowId);
  };
  const scopedColumns = getScopedColumns(handleClickedRowId, modal.openModal);

  // 4. 컴포넌트가 사용할 함수
  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  // 5. 이벤트 핸들러 함수
  const handleSelectedRows = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };

  const handleSearchFormChange = ({ target: { id, value } }) => {
    setSearchFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartDateChange = ({ newDate }) => {
    setSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'00:00"),
    }));
  };

  const handleEndDateChange = ({ newDate }) => {
    setSearchFormData((prev) => ({
      ...prev,
      toCreatedAt: format(new Date(newDate), "yyyy-MM-dd'T'23:59"),
    }));
  };

  const handleReset = () => {
    setSearchFormData(initialSearchFormData);
    setStartDate(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
    setEndDate(new Date());
  };

  const handleSearchSubmit = async () => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await BoardService.getSearchedPostList(searchFormData);
      setPostSearchResults(searchResult);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setSearchResultIsLoading(false);
    }
  };

  const togglePostStatus = async (shouldDelete) => {
    try {
      const isSuccess = await BoardService.patchPostsDeletedOption(
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

  // 6. 렌더링을 돕는 작은 컴포넌트 정의
  // 이 예시에서는 별도의 작은 컴포넌트가 정의되지 않았습니다.

  // 7. 메인 렌더링 로직(return 문)
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
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12} className="position-relative">
                    <CFormInput
                      id="content"
                      label="내용"
                      onChange={handleSearchFormChange}
                      value={searchFormData.content}
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
                      value={searchFormData.hasFilesOption}
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
            // REMIND 페이지네이션 컴포넌트 구현
            pagination
            activePage={1}
            itemsPerPageSelect
            itemsPerPage={10}
            itemsPerPageLabel={'페이지당 글 개수'}
            loading={searchResultIsLoading}
            // REMIND 커스텀 소터 구현
            sorterValue={{ column: 'id', state: 'asc' }}
            items={postSearchResults}
            columns={tableFields}
            selectable
            selected={selectedRows}
            scopedColumns={scopedColumns}
            // REMIND DOMException 처리
            onSelectedItemsChange={(selectedItems) => handleSelectedRows(selectedItems)}
            noItemsLabel="검색 결과가 없습니다."
            tableProps={{
              responsive: true,
              hover: true,
            }}
          />
          <ModalContainer visible={modal.isOpen} title="게시글" onClose={modal.closeModal} size="lg">
            <BoardPostDetailForm clickedRowId={clickedRowId} refreshPosts={handleSearchSubmit}></BoardPostDetailForm>
          </ModalContainer>
        </CCardBody>
      </CCard>
    </>
  );
};

export default BoardManagementPage;
