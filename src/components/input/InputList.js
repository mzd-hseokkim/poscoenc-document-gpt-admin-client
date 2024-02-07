import { CCol, CFormInput, CRow } from '@coreui/react-pro';

const InputList = ({ fields, formData, handleChange, isReadMode }) => {
  return fields?.map((field) => {
    const fieldValue = field.value ?? formData[field.name];
    const isRendered = field.isRendered ?? true;

    if (isRendered) {
      return (
        <CRow className="mb-3" key={field.name}>
          <CCol>
            <CFormInput
              id={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              disabled={field.isDisabled}
              readOnly={isReadMode}
              value={fieldValue || ''}
            />
          </CCol>
        </CRow>
      );
    } else {
      return null;
    }
  });
};

export default InputList;
