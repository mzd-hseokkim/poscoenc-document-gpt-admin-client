import { CFormInput } from '@coreui/react-pro';

const InputList = ({ fields, formData, handleChange, isReadMode }) => {
  return fields?.map((field) => {
    const fieldValue = field.value ?? formData[field.name];
    const isRendered = field.isRendered ?? true;

    if (isRendered) {
      return (
        <div className="mb-3" key={field.name}>
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
        </div>
      );
    } else {
      return null;
    }
  });
};

export default InputList;
