import { CCol, CFormInput, CRow } from '@coreui/react-pro';
import { Controller } from 'react-hook-form';

import { formatToYMD } from '../../utils/common/dateUtils';

const getFieldValue = (field, formData) => {
  if (field.value !== undefined) {
    return field.value;
  }

  if (formData[field.name] && field.type === 'date') {
    return formatToYMD(formData[field.name]);
  }

  return formData[field.name];
};

const InputList = ({ fields, control, isReadMode, errors, formData }) => {
  return fields.map((field) => {
    const isRendered = field.isRendered ?? true;
    if (isRendered) {
      return (
        <CRow className="mb-3" key={field.name}>
          <CCol>
            <Controller
              control={control}
              name={field.name}
              rules={field.rules}
              defaultValue={field.defaultValue}
              render={({ field: { onChange, onBlur, name } }) => {
                const fieldValue = getFieldValue(field, formData);

                return (
                  <CFormInput
                    id={field.id}
                    name={name}
                    label={field.label}
                    type={field.type === 'date' ? 'text' : field.type}
                    min={field.type === 'number' ? 0 : ''}
                    placeholder={field.placeholder}
                    value={fieldValue}
                    onChange={onChange}
                    onBlur={onBlur}
                    readOnly={isReadMode}
                    disabled={field.isDisabled}
                    invalid={errors[field.name]}
                    feedbackInvalid={errors[field.name] && errors[field.name].message}
                  />
                );
              }}
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
