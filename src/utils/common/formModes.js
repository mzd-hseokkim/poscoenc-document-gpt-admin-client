export const FORM_MODES = {
  READ: 'read',
  UPDATE: 'update',
  CREATE: 'create',
};

const formModes = (currentMode) => {
  const isReadMode = currentMode === FORM_MODES.READ;
  const isUpdateMode = currentMode === FORM_MODES.UPDATE;
  const isCreateMode = currentMode === FORM_MODES.CREATE;

  return { isReadMode, isUpdateMode, isCreateMode };
};

export default formModes;
