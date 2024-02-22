import { CCol, CFormInput, CRow } from '@coreui/react-pro';
import { Controller } from 'react-hook-form';

import { formatToYMD } from '../../utils/common/dateUtils';

const InputList = ({ fields, handleChange, isReadMode, formData, control, errors }) => {
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
              defaultValue={formData[field.name]}
              render={({ field: { onChange, onBlur, name, value } }) => {
                const formattedValue = field.type === 'date' && value ? formatToYMD(value) : value;

                return (
                  <CFormInput
                    id={field.id}
                    name={name}
                    label={field.label}
                    type={field.type === 'date' ? 'text' : field.type}
                    min={field.type === 'number' ? 0 : ''}
                    placeholder={field.placeholder}
                    value={formattedValue}
                    onChange={(e) => {
                      onChange(e);
                      handleChange(e);
                    }}
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
