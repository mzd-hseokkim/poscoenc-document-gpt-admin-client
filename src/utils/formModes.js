export const FORM_MODES = {
  READ: 'read',
  UPDATE: 'update',
  CREATE: 'create',
};

const formModes = (currentMode) => {
  const isCreateMode = currentMode === FORM_MODES.CREATE;
  const isReadMode = currentMode === FORM_MODES.READ;
  const isUpdateMode = currentMode === FORM_MODES.UPDATE;

  return { isCreateMode, isReadMode, isUpdateMode };
};

export default formModes;
