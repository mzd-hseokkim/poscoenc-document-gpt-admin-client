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

import { useToast } from '../../context/ToastContext';
import DocumentCollectionFileService from '../../services/document-collection/DocumentCollectionFileService';
import DocumentCollectionService from '../../services/document-collection/DocumentCollectionService';
import { userIdSelector } from '../../states/jwtTokenState';
import { formatToYMD } from '../../utils/common/dateUtils';
import { formatFileSize } from '../../utils/common/formatFileSize';
import formModes from '../../utils/formModes';
import StatusBadge from '../badge/StatusBadge';
import FormLoadingCover from '../cover/FormLoadingCover';
//REMIND Handle closeModal
const DocumentCollectionDetailForm = ({ clickedRowId, initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [collectionDetail, setCollectionDetail] = useState(null);
  const [formMode, setFormMode] = useState(initialFormMode);

  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);

  const topInfoColumns = [
    { key: 'id', label: 'ID', _style: { width: '5%' } },
    { key: 'name', label: '문서 집합 이름', _style: { width: '30%' } },
    { key: 'displayName', label: '표시명', _style: { width: '50%' } },
    {
      key: 'deleted',
      label: '삭제 여부',
      _style: { width: '40%' },
    },
  ];

  const topInfoData = [
    {
      id: collectionDetail?.id,
      name: collectionDetail?.name,
      displayName: collectionDetail?.displayName,
      deleted: collectionDetail?.deleted,
    },
  ];

  const middleInfoColumns = [
    { key: 'createdByName', label: '작성자', _style: { width: '10%' } },
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
  ];

  const middleInfoData = [
    {
      createdByName: collectionDetail?.createdByName,
      createdAt: collectionDetail?.createdAt,
      modifiedAt: collectionDetail?.modifiedAt,
    },
  ];

  const infoTableHeaderProps = {
    color: 'light',
  };

  const infoTableProps = {
    bordered: true,
  };

  const createModeInitialFormData = {
    name: '',
    displayName: '',
    files: [],
  };

  const fetchCollectionDetail = async () => {
    if (!clickedRowId) {
      return;
    }
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
  const postNewCollection = async (e) => {
    console.log(e);
    try {
      const formData = new FormData(e.currentTarget);
      const newCollectionFormData = {
        name: formData.get('name'),
        displayName: formData.get('displayName'),
        files: formData.get('files'),
      };
      console.log(newCollectionFormData);
      //ㄱ뜨ㅑㅜㅇ 테스트 설정용 래그 ㅇㅁㅅㅁ
      const isPosted = await DocumentCollectionService.postNewCollection(formData);
      if (isPosted) {
        refreshDocumentCollectionList();
        closeModal();
      }
    } catch (error) {
      addToast({ color: 'danger', message: '문서 집합을 게시하는데 문제가 발생했습니다.' });
    }
  };

  const putModifiedCollection = async () => {
    try {
      const isModified = await DocumentCollectionService.putModifiedCollectionDetail(collectionDetail);
      if (isModified) {
        refreshDocumentCollectionList();
        setFormMode('read');
      }
    } catch (error) {
      addToast({ message: '수정 작업에 실패했습니다.' });
    }
    //REMIND loading spinner
  };

  useEffect(() => {
    if (!isCreateMode) {
      fetchCollectionDetail();
    } else {
      setCollectionDetail(createModeInitialFormData);
    }
  }, [clickedRowId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCollectionDetail((prev) => ({ ...prev, [id]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCreateMode) {
      postNewCollection(e);
    } else if (isUpdateMode) {
      putModifiedCollection();
    }
  };

  const handleDownload = async (file) => {
    try {
      await DocumentCollectionFileService.getDownloadDocument(file);
    } catch (error) {
      addToast({ message: '다운로드를 할 수 없습니다.' });
    }
  };

  const handleFormModeChange = (e) => {
    e.preventDefault();
    setFormMode('update');
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
    deleted: (item) => (
      <td>
        <StatusBadge deleted={item.deleted} />
      </td>
    ),
  };

  const middleInfoScopedColumns = {
    createdAt: (item) => <td>{formatToYMD(item.createdAt)}</td>,
    modifiedAt: (item) => <td>{formatToYMD(item.modifiedAt)}</td>,
  };
  const renderFormActions = () => (
    <>
      {isReadMode ? (
        <CRow className="row justify-content-end">
          {collectionDetail?.createdByName === currentUserId && (
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton disabled={!isReadMode} onClick={handleFormModeChange}>
                수정
              </CButton>
            </CCol>
          )}
        </CRow>
      ) : (
        <CRow className="mt-3 justify-content-end">
          <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
            <CButton type="submit">저장</CButton>
            {!isCreateMode && (
              <CButton type="reset" onClick={() => setFormMode('read')}>
                취소
              </CButton>
            )}
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
            {isReadMode || isUpdateMode ? (
              <>
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
              </>
            ) : (
              <>
                <CFormInput label="문서 집합 이름" name="name" />
                <CFormInput label="표시명" name="displayName" className="mb-1" />
                <CFormInput label="첨부 문서" name="files" type="file" multiple />
              </>
            )}
            {renderFormActions()}
          </CCardBody>
        </CCard>
        {(isReadMode || isUpdateMode) && (
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
        )}
        <FormLoadingCover isLoading={getDetailIsLoading} />
      </CForm>
    </>
  );
};

export default DocumentCollectionDetailForm;
