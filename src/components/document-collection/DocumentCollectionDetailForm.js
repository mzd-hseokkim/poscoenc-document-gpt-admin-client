import React, { useEffect, useState } from 'react';

import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CRow, CSmartTable } from '@coreui/react-pro';
import { useRecoilValue } from 'recoil';

import useToast from '../../hooks/useToast';
import DocumentCollectionService from '../../services/document-collection/DocumentCollectionService';
import { userIdSelector } from '../../states/jwtTokenState';
import { formatToYMD } from '../../utils/common/dateUtils';
import formModes from '../../utils/formModes';
import StatusBadge from '../badge/StatusBadge';
import FormLoadingCover from '../cover/FormLoadingCover';

const DocumentCollectionDetailForm = ({ clickedRowId, initialFormMode, closeModal, fetchDocumentCollection }) => {
  const [collectionDetail, setCollectionDetail] = useState([]);
  const [formMode, setFormMode] = useState(initialFormMode);

  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);

  const addToast = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);

  const topInfoColumns = [
    { key: 'id', label: 'ID', _style: { width: '5%' } },
    { key: 'name', label: '문서 집합 이름', _style: { width: '30%' } },
    { key: 'displayName', label: '표시명', _style: { width: '50%' } },
    { key: 'createdByName', label: '작성자', _style: { width: '10%' } },
  ];

  const topInfoData = [
    {
      id: collectionDetail?.id,
      name: collectionDetail?.name,
      displayName: collectionDetail?.displayName,
      createdByName: collectionDetail?.createdByName,
    },
  ];

  const middleInfoColumns = [
    {
      key: 'createdAt',
      label: '작성일시',
      _style: { width: '30%' },
    },
    {
      key: 'modifiedAt',
      label: '수정일시',
      _style: { width: '30%' },
    },
    {
      key: 'deleted',
      label: '삭제 여부',

      _style: { width: '40%' },
    },
  ];

  const middleInfoScopedColumns = {
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    modifiedAt: (item) => <td>{formatToYMD(item.modifiedAt)}</td>,
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
  };
  const middleInfoData = [
    {
      createdAt: collectionDetail?.createdAt,
      modifiedAt: collectionDetail?.modifiedAt,
      deleted: collectionDetail?.deleted,
    },
  ];

  const scopedColumn = {
    id: (item) => <td>{item.id}</td>,
    name: (item) => (
      <td>
        <CFormInput type="text" id="name" name="name" defaultValue={item?.name} readOnly={isReadMode} />
      </td>
    ),
    displayName: (item) => (
      <td>
        <CFormInput
          type="text"
          id="displayName"
          name="displayName"
          defaultValue={item?.displayName}
          readOnly={isReadMode}
        />
      </td>
    ),
    createdByName: (item) => <td>{item.createdByName}</td>,
  };

  const infoTableHeaderProps = {
    color: 'light',
  };

  const infoTableProps = {
    bordered: true,
  };

  const fetchDocumentDetail = async () => {
    setGetDetailIsLoading(true);
    try {
      const details = await DocumentCollectionService.getCollectionDetail(clickedRowId);
      setCollectionDetail(details);
    } catch (error) {
      addToast({ color: 'danger', message: error.message });
    } finally {
      setGetDetailIsLoading(false);
    }
  };
  const postDocumentCollection = () => {};
  //StartFrom 수정 메소드 구현부터 시작.
  const putDocumentCollection = () => {};

  useEffect(() => {
    fetchDocumentDetail();
  }, [clickedRowId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCollectionDetail((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreateMode) {
      postDocumentCollection();
    } else if (isUpdateMode) {
      putDocumentCollection();
    }
  };
  const renderFormActions = () => (
    <>
      {isReadMode ? (
        <CRow className="row justify-content-end">
          {collectionDetail?.createdByName === currentUserId && (
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton disabled={!isReadMode} onClick={() => setFormMode('update')}>
                수정
              </CButton>
            </CCol>
          )}
        </CRow>
      ) : (
        <CRow className="justify-content-end">
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton type="submit">저장</CButton>
            <CButton type="reset" onClick={() => setFormMode('read')}>
              취소
            </CButton>
          </CCol>
        </CRow>
      )}
    </>
  );

  return (
    <>
      <CCard className="mb-3">
        <CCardBody>
          <CSmartTable
            columns={topInfoColumns}
            items={topInfoData}
            tableHeadProps={infoTableHeaderProps}
            tableProps={infoTableProps}
            scopedColumns={scopedColumn}
          />

          <CSmartTable
            columns={middleInfoColumns}
            items={middleInfoData}
            scopedColumns={middleInfoScopedColumns}
            tableHeadProps={infoTableHeaderProps}
            tableProps={infoTableProps}
          />
          {renderFormActions()}
        </CCardBody>
      </CCard>
      <CForm onSubmit={handleSubmit}>
        <FormLoadingCover isLoading={getDetailIsLoading} />
      </CForm>
    </>
  );
};

export default DocumentCollectionDetailForm;
