import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import DeletionStatusBadge from 'components/badge/DeletionStatusBadge';
import ExcelDownloadCButton from 'components/button/ExcelDownloadCButton';
import { CSmartTableNoItemLabel } from 'components/label/CSmartTableNoItemLabel';
import ModalContainer from 'components/modal/ModalContainer';
import UserDetailForm from 'components/user/UserDetailForm';
import { useToast } from 'context/ToastContext';
import useModal from 'hooks/useModal';
import usePagination from 'hooks/usePagination';
import { useSearchForm } from 'hooks/useSearchForm';
import UserService from 'services/UserService';
import { userColumnConfig } from 'views/pages/user/userColumnConfig';

const createInitialSearchFormData = () => ({
  name: '',
  email: '',
  team: '',
  memo: '',
  deletionOption: 'ALL',
});
const UserManagementPage = () => {
  const [userList, setUserList] = useState([]);
  const [searchResultIsLoading, setSearchResultIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [formMode, setFormMode] = useState('');
  const [totalUserElements, setTotalUserElements] = useState(0);
  const [hasError, setHasError] = useState(false);

  const [searchFormData, setSearchFormData] = useState({});

  const isComponentMounted = useRef(true);
  const isSearchPerformed = useRef(false);

  const { pageableData, handlePageSizeChange, handlePageSortChange, smartPaginationProps } = usePagination(
    totalUserElements,
    'id,desc'
  );
  const { addToast } = useToast();
  const modal = useModal();

  const { stagedSearchFormData, handleSearchFormChange, handleSearchFormReset } = useSearchForm(
    createInitialSearchFormData()
  );

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const fetchUserList = useCallback(async () => {
    setSearchResultIsLoading(true);
    if (!isSearchPerformed.current) {
      isSearchPerformed.current = true;
    }
    try {
      const data = await UserService.getUsers(searchFormData, pageableData);
      setUserList(data.content);
      setTotalUserElements(data.totalElements);
    } catch (error) {
      console.log(error);
      setHasError(true);
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: `${error.response.data.message} with ${error.response.status}` });
      }
    } finally {
      setSearchResultIsLoading(false);
    }
  }, [addToast, searchFormData, pageableData]);

  useEffect(() => {
    if (isComponentMounted.current) {
      isComponentMounted.current = false;
    } else {
      if (!hasError) {
        void fetchUserList();
      }
    }
  }, [fetchUserList, hasError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasError(false);
    setSearchFormData(stagedSearchFormData);
  };

  const handleRowClick = (id) => {
    setFormMode('read');
    modal.openModal(id);
  };

  const handleCreateClick = () => {
    setFormMode('create');
    modal.openModal();
  };

  const handleDeleteRestoreClick = async (shouldDelete) => {
    const ids = checkedItems.map((item) => item.id);
    try {
      await UserService.deleteUsers(ids, shouldDelete);
      void fetchUserList();
    } catch (error) {
      addToast({ message: `${shouldDelete ? '삭제' : '복구'}하지 못했습니다` });
    }
    setCheckedItems([]);
  };

  return (
    <>
      <CRow>
        <CCard className="row g-3">
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="name"
                    floatingLabel="이름"
                    placeholder=""
                    value={stagedSearchFormData.name}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="email"
                    floatingLabel="이메일"
                    placeholder=""
                    value={stagedSearchFormData.email}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormInput
                    id="team"
                    floatingLabel="팀"
                    placeholder=""
                    value={stagedSearchFormData.team}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    id="memo"
                    floatingLabel="메모"
                    placeholder=""
                    value={stagedSearchFormData.memo}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
                <CRow className="mb-3"></CRow>
                <CCol md={6}>
                  <CFormSelect
                    id="deletionOption"
                    label="사용자 상태"
                    name="deletionOption"
                    options={[
                      { label: '모든 사용자', value: '' },
                      { label: '삭제됨', value: 'Yes' },
                      { label: '삭제되지 않음', value: 'NO' },
                    ]}
                    value={stagedSearchFormData.deletionOption}
                    onChange={handleSearchFormChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <CButton type="submit">검색</CButton>
                  <CButton onClick={handleSearchFormReset}>초기화</CButton>
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
                <CButton onClick={handleCreateClick}>사용자 추가</CButton>
                <CButton
                  disabled={checkedItems?.length === 0 || isDeletedRow(checkedItems)}
                  onClick={() => handleDeleteRestoreClick(true)}
                >
                  삭제
                </CButton>
                <CButton
                  disabled={checkedItems?.length === 0 || !isDeletedRow(checkedItems)}
                  onClick={() => handleDeleteRestoreClick(false)}
                >
                  복구
                </CButton>
                <ExcelDownloadCButton
                  downloadFunction={UserService.getDownloadSearchedUserList}
                  searchFormData={searchFormData}
                  hasSearchResults={userList.length !== 0}
                />
                <CCol className="d-flex justify-content-end">
                  <CFormLabel>총 {totalUserElements} 개의 검색 결과</CFormLabel>
                </CCol>
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CSmartTable
                columnSorter={{
                  external: true,
                  resetable: false,
                }}
                columns={userColumnConfig}
                items={userList}
                itemsPerPage={pageableData.size}
                itemsPerPageLabel="페이지당 사용자 수"
                itemsPerPageSelect
                loading={searchResultIsLoading}
                noItemsLabel={
                  <CSmartTableNoItemLabel
                    contentLength={userList.length}
                    isSearchPerformed={isSearchPerformed.current}
                    defaultMessage="검색 조건에 맞는 사용자를 검색합니다."
                    isLoading={searchResultIsLoading}
                  />
                }
                onItemsPerPageChange={handlePageSizeChange}
                onSelectedItemsChange={(items) => {
                  setCheckedItems(items);
                }}
                onSorterChange={(sorterValue) => handlePageSortChange(sorterValue)}
                paginationProps={smartPaginationProps}
                scopedColumns={{
                  name: (item) => (
                    <td
                      onClick={() => {
                        handleRowClick(item.id);
                      }}
                    >
                      {item.name}
                    </td>
                  ),
                  deleted: (item) => (
                    <td>
                      <DeletionStatusBadge deleted={item.deleted} />
                    </td>
                  ),
                }}
                selectable
                selected={checkedItems}
                tableProps={{
                  hover: true,
                  responsive: true,
                }}
              />
            </CRow>
          </CCardBody>
        </CCard>
      </CRow>
      <ModalContainer visible={modal.isOpen} title="사용자 정보" size="lg" onClose={modal.closeModal}>
        <UserDetailForm initialFormMode={formMode} closeModal={modal.closeModal} fetchUserList={fetchUserList} />
      </ModalContainer>
    </>
  );
};

export default UserManagementPage;
