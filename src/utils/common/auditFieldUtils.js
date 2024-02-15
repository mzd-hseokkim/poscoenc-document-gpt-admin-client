import { FORM_MODES } from '../formModes';

export const getAuditFields = (formMode) => {
  const isCreateMode = formMode === FORM_MODES.CREATE;
  const isUpdateMode = formMode === FORM_MODES.UPDATE;

  return [
    { name: 'createdByName', label: '생성자', isRendered: !isCreateMode, isDisabled: isUpdateMode },
    { name: 'createdAt', label: '생성일', type: 'date', isRendered: !isCreateMode, isDisabled: isUpdateMode },
    { name: 'modifiedByName', label: '수정자', isRendered: !isCreateMode, isDisabled: isUpdateMode },
    { name: 'modifiedAt', label: '수정일', type: 'date', isRendered: !isCreateMode, isDisabled: isUpdateMode },
  ];
};
