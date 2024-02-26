import { CCol, CFormInput, CRow } from '@coreui/react-pro';
import { Controller } from 'react-hook-form';

import { formatToYMD } from '../../utils/common/dateUtils';

const getValue = (field, formData) => {
  if (field.value) {
    return field.value;
  }
  if (field.type === 'date' && formData[field.name]) {
    return formatToYMD(formData[field.name]);
  }
  return formData[field.name];
};

const InputList = ({ fields, handleChange, isReadMode, formData, control, errors = {} }) => {
  return fields.map((field) => {
    const isRendered = field.isRendered ?? true;

    if (!isRendered) {
      return null;
    }

    const commonProps = {
      id: field.id,
      name: field.name,
      label: field.label,
      type: field.type === 'date' ? 'text' : field.type,
      min: field.type === 'number' ? 0 : '',
      placeholder: field.placeholder,
      readOnly: isReadMode,
      disabled: field.isDisabled,
      value: getValue(field, formData),
      onChange: handleChange,
    };

    return (
      <CRow className="mb-3" key={field.name}>
        <CCol>
          {control && field.rules ? (
            <Controller
              control={control}
              name={field.name}
              rules={field.rules}
              defaultValue={formData[field.name]}
              render={({ field: controllerField }) => (
                <CFormInput
                  {...commonProps}
                  name={controllerField.name}
                  onChange={(e) => {
                    controllerField.onChange(e);
                    handleChange(e);
                  }}
                  onBlur={controllerField.onBlur}
                  invalid={!!errors[field.name]}
                  feedbackInvalid={errors[field.name]?.message}
                />
              )}
            />
          ) : (
            <CFormInput {...commonProps} />
          )}
        </CCol>
      </CRow>
    );
  });
};

export default InputList;
