import { FORM_MODES } from 'utils/common/formModes';

export const getAuditFields = (formMode) => {
  const isCreateMode = formMode === FORM_MODES.CREATE;
  const isUpdateMode = formMode === FORM_MODES.UPDATE;

  return [
    {
      name: 'id',
      label: '아이디',
      isRendered: !isCreateMode,
      isDisabled: isUpdateMode,
    },
    {
      name: 'deleted',
      label: '삭제 여부',
      badge: 'DeletionStatusBadge',
    },
    { name: 'createdByName', label: '등록자', isRendered: !isCreateMode, isDisabled: isUpdateMode },
    { name: 'createdAt', label: '등록일', type: 'date', isRendered: !isCreateMode, isDisabled: isUpdateMode },
    { name: 'modifiedByName', label: '수정자', isRendered: !isCreateMode, isDisabled: isUpdateMode },
    { name: 'modifiedAt', label: '수정일', type: 'date', isRendered: !isCreateMode, isDisabled: isUpdateMode },
  ];
};
