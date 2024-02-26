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
import { Controller, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { useToast } from '../../context/ToastContext';
import DocumentCollectionFileService from '../../services/document-collection/DocumentCollectionFileService';
import DocumentCollectionService from '../../services/document-collection/DocumentCollectionService';
import { userIdSelector } from '../../states/jwtTokenState';
import { formatToYMD } from '../../utils/common/dateUtils';
import { formatFileSize } from '../../utils/common/formatFileSize';
import formModes from '../../utils/formModes';
import { menuNameValidationPattern } from '../../utils/validationUtils';
import StatusBadge from '../badge/StatusBadge';
import FormLoadingCover from '../cover/FormLoadingCover';
import InputList from '../input/InputList';

const DocumentCollectionDetailForm = ({ clickedRowId, initialFormMode, closeModal, refreshDocumentCollectionList }) => {
  const [collectionDetail, setCollectionDetail] = useState({});
  const [formMode, setFormMode] = useState(initialFormMode);

  const [getDetailIsLoading, setGetDetailIsLoading] = useState(false);

  const { addToast } = useToast();
  const currentUserId = useRecoilValue(userIdSelector);
  const { isCreateMode, isReadMode, isUpdateMode } = formModes(formMode);

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ mode: 'onChange' });

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

  const collectionBasicFields = [
    {
      name: 'name',
      label: '문서 집합 이름',
      isDisabled: !isCreateMode,
      placeholder: '문서 집합의 이름을 설정해주세요.',
      rules: {
        required: '문서 집합 이름은 필수 입력 항목입니다.',
        pattern: {
          value: menuNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
    {
      name: 'displayName',
      label: '표시명',
      //REMIND 표시명이 뭔가요..?
      placeholder: '표시명을 입력해주세요.',
      rules: {
        required: '표시명은 필수 입력 항목입니다.',
        pattern: {
          value: menuNameValidationPattern,
          message: '한글, 알파벳, 숫자, 띄어쓰기만 허용됩니다.',
        },
      },
    },
  ];
  const [modifiableDetailFormData, setModifiableDetailFormData] = useState(modifiableDetailInitialFormData);

  useEffect(() => {
    if (!isCreateMode) {
      fetchCollectionDetail();
      setModifiableDetailFormData(collectionDetail);
    } else {
      setCollectionDetail(createModeInitialFormData);
    }
  }, [clickedRowId, formMode]);

  const fetchCollectionDetail = async () => {
    if (!clickedRowId) {
      return;
    }
    setGetDetailIsLoading(true);
    try {
      const details = await DocumentCollectionService.getCollectionDetail(clickedRowId);
      setCollectionDetail(details);
      reset(details);
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
  const postNewCollection = async (data) => {
    try {
      const formData = new FormData();
      console.table(data);
      formData.append('name', data.name);
      formData.append('displayName', data.displayName);
      if (data.files && data.files.length) {
        for (const file of data.files) {
          formData.append('files', file);
        }
      }
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setModifiableDetailFormData((prev) => ({ ...prev, [id]: value }));
  };
  const onSubmit = async (data) => {
    if (isCreateMode) {
      await postNewCollection(data);
    } else if (isUpdateMode) {
      //REMIND fix to useForm
      await putModifiedCollection(modifiableDetailFormData);
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

  const handleFormModeChange = () => {
    setFormMode('update');
  };

  const topInfoScopedColumn = {
    id: (item) => <td className="align-middle">{item.id}</td>,
    name: (item) => (
      <td>
        <Controller
          name="name"
          control={control}
          rules={{ required: '문서 집합 이름은 필수 입력 항목입니다.' }}
          render={({ field: { onChange } }) => (
            <CFormInput
              type="text"
              id="name"
              name="name"
              defaultValue={item?.name}
              readOnly={isReadMode}
              disabled={isReadMode}
              onChange={handleChange}
              invalid={errors.name}
              feedbackInvalid={errors.name && errors.name.message}
            />
          )}
        ></Controller>
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
          // invalid={}
          // feedbackInvalid={}
        />
      </td>
    ),
    deleted: (item) => (
      <td className="align-middle">
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
            <CButton type="submit">저장</CButton>
            {!isCreateMode && <CButton onClick={() => setFormMode('read')}>취소</CButton>}
          </CCol>
        </CRow>
      )}
    </>
  );

  return (
    <>
      <CForm onSubmit={handleSubmit(onSubmit)}>
        <CCard className="mb-3">
          <CCardBody>
            {!isCreateMode ? (
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
                <InputList
                  fields={collectionBasicFields}
                  formData={collectionDetail}
                  handleChange={handleChange}
                  control={control}
                  errors={errors}
                />
                <Controller
                  name="files"
                  control={control}
                  render={({ field }) => (
                    <CFormInput
                      label="첨부 문서"
                      type="file"
                      multiple
                      onChange={(e) => field.onChange(e.target.files)}
                    />
                  )}
                />
              </>
            )}
            {renderFormActions()}
          </CCardBody>
        </CCard>
        {!isCreateMode && (
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
