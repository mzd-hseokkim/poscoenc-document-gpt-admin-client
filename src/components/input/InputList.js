import { CCol, CFormInput, CRow } from '@coreui/react-pro';
import { format } from 'date-fns';

const getFieldValue = (field, formData) => {
  if (field.value !== undefined) {
    return field.value;
  }

  if (formData[field.name] && field.type === 'date') {
    return format(new Date(formData[field.name]), 'yyyy/MM/dd');
  }

  return formData[field.name];
};

const InputList = ({ fields, formData, handleChange, isReadMode }) => {
  return fields?.map((field) => {
    const isRendered = field.isRendered ?? true;
    const fieldValue = getFieldValue(field, formData);

    if (isRendered) {
      return (
        <CRow className="mb-3" key={field.name}>
          <CCol>
            <CFormInput
              id={field.name}
              name={field.name}
              label={field.label}
              type={field.type === 'date' ? 'text' : field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              disabled={field.isDisabled}
              readOnly={isReadMode}
              value={fieldValue || ''}
              min={field.type === 'number' ? 0 : ''}
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
