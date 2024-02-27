import { CCol, CFormInput, CRow } from '@coreui/react-pro';

const InputList = ({ fields, handleChange, isReadMode, formData, register, errors = {} }) => {
  return fields.map((field) => {
    const isRendered = field.isRendered ?? true;

    if (!isRendered) {
      return null;
    }

    const commonProps = {
      id: field.name,
      name: field.name,
      label: field.label,
      type: field.type === 'date' ? 'text' : field.type,
      min: field.type === 'number' ? 0 : '',
      placeholder: field.placeholder,
      readOnly: isReadMode,
      disabled: field.isDisabled,
    };

    return (
      <CRow className="mb-3" key={field.name}>
        <CCol>
          {register ? (
            <CFormInput
              {...commonProps}
              {...register(field.name, field.rules)}
              invalid={!!errors[field.name]}
              feedbackInvalid={errors[field.name]?.message}
            />
          ) : (
            <CFormInput {...commonProps} onChange={handleChange} value={field.value || formData[field.name]} />
          )}
        </CCol>
      </CRow>
    );
  });
};

export default InputList;
