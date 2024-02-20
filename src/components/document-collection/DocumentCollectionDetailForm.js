import React, { useEffect, useState } from 'react';

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CListGroup,
  CListGroupItem,
  CRow,
  CSmartTable,
} from '@coreui/react-pro';
import { useRecoilValue } from 'recoil';

import useToast from '../../hooks/useToast';
import DocumentCollectionFileService from '../../services/document-collection/DocumentCollectionFileService';
import DocumentCollectionService from '../../services/document-collection/DocumentCollectionService';
import { userIdSelector } from '../../states/jwtTokenState';
import { formatToYMD } from '../../utils/common/dateUtils';
import { formatFileSize } from '../../utils/common/formatFileSize';
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

  const middleInfoData = [
    {
      createdAt: collectionDetail?.createdAt,
      modifiedAt: collectionDetail?.modifiedAt,
      deleted: collectionDetail?.deleted,
    },
  ];

  const infoTableHeaderProps = {
    color: 'light',
  };

  const infoTableProps = {
    bordered: true,
  };

  const fetchCollectionDetail = async () => {
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
  const postDocumentCollection = async () => {};

  const putDocumentCollection = async () => {
    try {
      const isModified = await DocumentCollectionService.putModifiedCollectionDetail(collectionDetail);
      if (isModified) {
        fetchDocumentCollection();
        setFormMode('read');
      }
    } catch (error) {
      addToast({ message: '수정 작업에 실패했습니다.' });
    }
    //REMIND loading spinner
  };

  useEffect(() => {
    fetchCollectionDetail();
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

  const handleDownload = async (file) => {
    try {
      await DocumentCollectionFileService.getDownloadDocument(file);
    } catch (error) {
      addToast({ message: '다운로드를 할 수 없습니다.' });
    }
  };

  const topInfoScopedColumn = {
    id: (item) => <td>{item.id}</td>,
    name: (item) => (
      <td>
        <CFormInput
          type="text"
          id="name"
          name="name"
          defaultValue={item?.name}
          readOnly={isReadMode}
          disabled={isReadMode}
          onChange={handleChange}
        />
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
          disabled={isReadMode}
          onChange={handleChange}
        />
      </td>
    ),
    createdByName: (item) => <td>{item.createdByName}</td>,
  };

  const middleInfoScopedColumns = {
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    modifiedAt: (item) => <td>{formatToYMD(item.modifiedAt)}</td>,
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
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
            <CButton onClick={handleSubmit}>저장</CButton>
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
      <CForm onSubmit={handleSubmit}>
        <CCard className="mb-3">
          <CCardBody>
            <CSmartTable
              columns={topInfoColumns}
              items={topInfoData}
              tableHeadProps={infoTableHeaderProps}
              tableProps={infoTableProps}
              scopedColumns={topInfoScopedColumn}
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
        <CCard>
          <CCardBody>
            <CListGroup>
              {collectionDetail?.files?.map((file, index) => (
                <CListGroupItem
                  key={index}
                  component="button"
                  onClick={() => handleDownload(file)}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>{file.originalName}</span>
                  <small>{formatFileSize(file.size)}</small>
                </CListGroupItem>
              ))}
            </CListGroup>
          </CCardBody>
        </CCard>
        <FormLoadingCover isLoading={getDetailIsLoading} />
      </CForm>
    </>
  );
};

export default DocumentCollectionDetailForm;
