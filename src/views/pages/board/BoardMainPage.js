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
import { useState } from 'react';
import { getColumnDefinitions } from '../../../utils/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { useBoardPosts } from '../../../hooks/board/useBoardPosts';
import { fetchPostsDeletedOption, searchPostList } from '../../../services/board/BoardService';
import ModalContainer from '../../../components/modal/ModalContainer';
import BoardPostDetailsForm from '../../../components/board/BoardPostDetailsForm';
import UseModal from '../../../hooks/useModal';
import { format } from 'date-fns';
import useToast from '../../../hooks/useToast';

const BoardMainPage = () => {
  const tableFields = getColumnDefinitions();

  const [selectedRows, setSelectedRows] = useState([]);
  //REMIND remove default posts
  const { boardPosts, isLoading, fetchBoardData } = useBoardPosts();

  const handleSelectedRows = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const togglePostStatus = async (shouldDelete) => {
    const isSuccess = await fetchPostsDeletedOption(
      selectedRows.map((row) => row.id),
      shouldDelete
    );
    if (isSuccess) {
      await fetchBoardData();
      handleSelectedRows([]);
    }
  };
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
  const [posts, setPosts] = useState([]);
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
  const handleChange = ({ target: { id, value } }) => {
    setSearchRequestFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStartDateChange = ({ newDate }) => {
    console.table(newDate);
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
  //TODO 검색 요청 구현 예정
  const handleSubmit = async () => {
    try {
      const searchResult = await searchPostList(searchRequestFormData);
      setPosts(searchResult);
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ color: 'danger', body: error.response.data.message });
      }
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
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-3">
                  <CCol md={4} className="position-relative">
                    <CFormInput
                      type="text"
                      id="title"
                      label="제목"
                      onChange={handleChange}
                      value={searchRequestFormData.title}
                    />
                  </CCol>
                  <CCol md={4} className="position-relative">
                    <CFormInput
                      id="createdByName"
                      label="작성자"
                      onChange={handleChange}
                      value={searchRequestFormData.createdByName}
                    />
                  </CCol>
                </CRow>
                <CRow className="mb-3">
                  <CCol md={12} className="position-relative">
                    <CFormInput
                      id="content"
                      label="내용"
                      onChange={handleChange}
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
                      //TODO 메뉴 보고 수정사항 반영하기
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                    />
                  </CCol>
                </CRow>
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <CButton type="submit">검색</CButton>
                  <CButton onClick={handleReset} color="secondary" value="Reset">
                    초기화
                  </CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {posts.length !== 0 && (
        <CCard className="row g-3 mt-2">
          <CCardBody>
            <div className="d-grid gap-2 d-md-flex justify-content-md-start">
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
              loading={isLoading}
              // 정렬
              // REMIND 커스텀 소터 구현
              sorterValue={{ column: 'id', state: 'asc' }}
              // 컬럼
              items={posts}
              columns={tableFields}
              selectable
              selected={selectedRows}
              // REMIND clickable row 대신에 제목 칸에 css pointer 적용
              scopedColumns={scopedColumns}
              // REMIND DOMException 처리
              onSelectedItemsChange={() => handleSelectedRows}
              // 스타일
              tableProps={{
                responsive: true,
                hover: true,
              }}
            />
            <ModalContainer visible={modal.isOpen} title="게시글" onClose={modal.closeModal}>
              <BoardPostDetailsForm selectedId={clickedRowId}></BoardPostDetailsForm>
            </ModalContainer>
          </CCardBody>
        </CCard>
      )}
    </>
  );
};

export default BoardMainPage;
