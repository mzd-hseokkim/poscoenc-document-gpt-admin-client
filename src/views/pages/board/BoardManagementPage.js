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
import { getBoardScopedColumns } from '../../../components/board/BoardScopedColumn';
import ModalContainer from '../../../components/modal/ModalContainer';
import { useToast } from '../../../context/ToastContext';
import useModal from '../../../hooks/useModal';
import BoardService from '../../../services/board/BoardService';
import { postColumnConfig } from '../../../utils/board/postColumnConfig';

const BoardManagementPage = () => {
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

  const modal = useModal();
  const { addToast } = useToast();
  const handleClickedRowId = (newClickedRowId) => {
    setClickedRowId(newClickedRowId);
  };
  const scopedColumns = getBoardScopedColumns(handleClickedRowId, modal.openModal);

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
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

  const handleSubmitSearchRequest = async () => {
    setSearchResultIsLoading(true);
    try {
      const searchResult = await BoardService.getSearchedPostList(searchFormData);
      setPostSearchResults(searchResult);
    } catch (error) {
      addToast({ message: '검색 조건을 확인 해 주세요.' });
    } finally {
      setSearchResultIsLoading(false);
    }
  };

  const togglePostStatus = async (shouldDelete) => {
    try {
      const isSuccess = await BoardService.patchPostsDeletionOption(
        selectedRows.map((row) => row.id),
        shouldDelete
      );

      if (isSuccess) {
        setSelectedRows([]);
      }
    } catch (error) {
      const statusCode = error.status;
      if (statusCode === 400) {
        addToast({ message: '삭제할 게시글을 선택해주세요.' });
      } else if (statusCode === 404) {
        addToast({ message: '삭제할 게시글을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    } finally {
      await handleSubmitSearchRequest();
    }
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
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
                <CRow className="mb-3">
                  <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton type="submit">{'검색'}</CButton>
                    <CButton onClick={handleReset} color="primary" value="Reset">
                      초기화
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CCard className="row g-3 mt-2">
        <CCardBody>
          <CRow className="mb-3">
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
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
          </CRow>
          <CSmartTable
            pagination
            activePage={1}
            itemsPerPageSelect
            itemsPerPage={10}
            itemsPerPageLabel={'페이지당 글 개수'}
            loading={searchResultIsLoading}
            // REMIND 커스텀 소터 구현
            sorterValue={{ column: 'id', state: 'asc' }}
            items={postSearchResults}
            columns={postColumnConfig}
            selectable
            selected={selectedRows}
            scopedColumns={scopedColumns}
            onSelectedItemsChange={(selectedItems) => setSelectedRows(selectedItems)}
            noItemsLabel="검색 결과가 없습니다."
            tableProps={{
              responsive: true,
              hover: true,
            }}
          />
          {/*REMIND Modal open 시 url 변경되게 수정*/}
          <ModalContainer visible={modal.isOpen} title="게시글" onClose={modal.closeModal} size="lg">
            <BoardPostDetailForm
              clickedRowId={clickedRowId}
              fetchPosts={handleSubmitSearchRequest}
            ></BoardPostDetailForm>
          </ModalContainer>
        </CCardBody>
      </CCard>
    </>
  );
};

export default BoardManagementPage;
