import { CCol, CFormInput, CFormLabel, CRow } from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';

const InputList = ({ fields, handleChange, isReadMode, formData, register, errors = {} }) => {
  return fields.map((field) => {
    const isRendered = field.isRendered ?? true;

    if (!isRendered) {
      return null;
    }

    if (field.name === 'deleted') {
      return (
        <CRow className="mb-3" key={field.name}>
          <CCol>
            <CFormLabel htmlFor="staticEmail" className="col-md-2 col-form-label fw-bold">
              {field.label}
            </CFormLabel>
            <StatusBadge deleted={formData.deleted} />
          </CCol>
        </CRow>
      );
    }

    const commonProps = {
      id: field.name,
      name: field.name,
      type: field.type === 'date' ? 'text' : field.type,
      min: field.type === 'number' ? 0 : '',
      placeholder: isReadMode ? '' : field.placeholder,
      readOnly: isReadMode,
      disabled: field.isDisabled,
      plainText: isReadMode || field.isDisabled,
    };

    return (
      <CRow className="mb-3" key={field.name}>
        <CCol>
          {register ? (
            <CRow>
              <CFormLabel htmlFor="staticEmail" className="col-md-2 col-form-label fw-bold">
                {field.label}
              </CFormLabel>
              <CCol>
                <CFormInput
                  {...commonProps}
                  {...register(field.name, field.rules)}
                  invalid={!!errors[field.name]}
                  feedbackInvalid={errors[field.name]?.message}
                />
              </CCol>
            </CRow>
          ) : (
            <CRow>
              <CFormLabel htmlFor="staticEmail" className="col-md-2 col-form-label">
                {field.label}
              </CFormLabel>
              <CCol>
                <CFormInput {...commonProps} onChange={handleChange} value={field.value || formData[field.name]} />
              </CCol>
            </CRow>
          )}
        </CCol>
      </CRow>
    );
  });
};

export default InputList;
