import { CCol, CFormInput, CFormLabel, CRow } from '@coreui/react-pro';

const FormInputGrid = ({ fields, handleChange, isReadMode, formData, register, errors = {}, col = 1 }) => {
  const numberOfRows = Math.ceil(fields.length / col);

  const paddedFields = [...fields];
  const totalCellsNeeded = numberOfRows * col;
  while (paddedFields.length < totalCellsNeeded) {
    paddedFields.push({ isEmpty: true }); // Add empty objects for padding
  }

  const chunkedFields = [];
  for (let i = 0; i < paddedFields.length; i += col) {
    chunkedFields.push(paddedFields.slice(i, i + col));
  }

  return chunkedFields.map((rowFields, rowIndex) => (
    <CRow key={`row-${rowIndex}`}>
      {rowFields.map((field, colIndex) => {
        if (field.isEmpty) {
          return <CCol key={`empty-${rowIndex}-${colIndex}`} />;
        }

        const isRendered = field.isRendered ?? true;

        if (!isRendered) {
          return null;
        }

        const commonProps = {
          id: `input-list-${field.name}`,
          name: field.name,
          type: field.type === 'date' ? 'text' : field.type,
          min: field.type === 'number' ? 0 : '',
          placeholder: isReadMode ? '' : field.placeholder,
          readOnly: isReadMode,
          disabled: field.isDisabled,
          plainText: isReadMode || field.isDisabled,
        };

        return (
          <CCol key={field.name} className="mb-2">
            <CFormLabel htmlFor={`input-list-${field.name}`} className="fw-bold">
              {field.label}
            </CFormLabel>
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
        );
      })}
    </CRow>
  ));
};

export default FormInputGrid;
