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

  const modifiableDetailInitialFormData = {
    id: collectionDetail?.id,
    name: collectionDetail?.name || '',
    displayName: collectionDetail?.displayName || '',
  };

  const [modifiableDetailFormData, setModifiableDetailFormData] = useState(modifiableDetailInitialFormData);

  const fetchCollectionDetail = async () => {
    if (!clickedRowId) {
      return;
    }
    setGetDetailIsLoading(true);
    try {
      const details = await DocumentCollectionService.getCollectionDetail(clickedRowId);
      setCollectionDetail(details);
    } catch (error) {
      if (error.response?.status === 404) {
        addToast({ message: '해당 문서 집합을 찾을 수 없습니다.' });
      } else {
        console.log(error);
      }
    } finally {
      setGetDetailIsLoading(false);
    }
  };
  const postNewCollection = async (e) => {
    try {
      const formData = new FormData(e.currentTarget);
      const isPosted = await DocumentCollectionService.postNewCollection(formData);
      if (isPosted) {
        refreshDocumentCollectionList();
        closeModal();
      }
    } catch (error) {
      //REMIND 생성 실패 시 500 Error
      console.log(error);
    }
  };

  const putModifiedCollection = async () => {
    console.table(modifiableDetailFormData);
    try {
      const isModified = await DocumentCollectionService.putModifiedCollectionDetail(modifiableDetailFormData);
      if (isModified) {
        closeModal();
        refreshDocumentCollectionList();
        await fetchCollectionDetail();
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        addToast({ message: '본인이 게시한 문서 집합만 수정 가능합니다.' });
      } else if (status === 404) {
        addToast({ message: '수정할 문서 집합을 찾지 못했습니다. 다시 검색 해 주세요.' });
      } else {
        console.log(error);
      }
    }
    //REMIND loading spinner
  };

  useEffect(() => {
    if (!isCreateMode) {
      fetchCollectionDetail();
      setModifiableDetailFormData(collectionDetail);
    } else {
      setCollectionDetail(createModeInitialFormData);
    }
  }, [clickedRowId, formMode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setModifiableDetailFormData((prev) => ({ ...prev, [id]: value }));

    const emailRegex = /\S+@\S+\.\S+/;
    if (id === 'name') {
      const isValidEmail = emailRegex.test(value);
      setIsValid(isValidEmail);
    }
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
      const status = error.response?.status;
      if (status === 404) {
        addToast({ message: '다운로드 할 파일을 찾지 못했습니다. 목록을 새로고침 해 주세요.' });
      } else {
        console.log(error);
      }
    }
  };

  const handleFormModeChange = (e) => {
    e.preventDefault();
    setFormMode('update');
  };

  // 유효성 감사 테스트 --------------------
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(undefined);
  const validateEmail = (e) => {
    const email = e.target.value;
    setEmail(email);

    // 간단한 이메일 유효성 검사
    const emailRegex = /\S+@\S+\.\S+/;
    const isValidEmail = emailRegex.test(email);
    setIsValid(isValidEmail);
  };

  // 유효성 감사 테스트 --------------------
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
          invalid={isValid === false}
          valid={!isReadMode && isValid === true}
          feedbackInvalid="유효하지 않은 이메일 주소입니다."
          feedbackValid="유효한 이메일 주소입니다."
          // label="이메일 주소"
          required={!isReadMode}
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
          valid={!isReadMode}
          required={!isReadMode}
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
          {collectionDetail?.createdBy === currentUserId && (
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
            <CButton type="submit" disabled={!isValid}>
              저장
            </CButton>
            {!isCreateMode && <CButton onClick={() => setFormMode('read')}>취소</CButton>}
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
                  key={formMode}
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
                    {/*REMIND 파란색 -> 클릭 시 보라색이름, 다운로드 흔적 남기기*/}
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
