import { CCol, CFormInput, CFormLabel, CRow } from '@coreui/react-pro';
import StatusBadge from 'components/badge/StatusBadge';
import { formatToYMD } from 'utils/common/dateUtils';

const getValue = (field, formData) => {
  if (field.value) {
    return field.value;
  }
  if (field.type === 'date' && formData[field.name]) {
    return formatToYMD(formData[field.name]);
  }
  return formData[field.name];
};
const HorizontalCFormInputList = ({ defaultMd, fields, formData, isReadMode, register }) => {
  return (
    <>
      <CRow>
        {fields.map((field, index) => {
          const isRendered = field.isRendered ?? true;
          if (!isRendered) {
            return null;
          }

          if (field.name === 'deleted') {
            return (
              <CCol key={index} md={field.md || defaultMd}>
                <CFormLabel htmlFor={field.name}>{field.label}</CFormLabel>
                <div className="mt-1">
                  <StatusBadge deleted={formData.deleted} />
                </div>
              </CCol>
            );
          }

          const commonProps = {
            id: field.id,
            name: field.name,
            type: field.type === 'date' ? 'text' : field.type,
            min: field.type === 'number' ? 0 : '',
            placeholder: field.placeholder,
            multiple: field.multiple,
            readOnly: isReadMode,
            disabled: field.isDisabled,
            defaultValue: getValue(field, formData),
          };

          return (
            <CCol key={index} md={field.md || defaultMd}>
              <CFormLabel htmlFor={field.name}>{field.label}</CFormLabel>
              <CFormInput {...commonProps} {...register(field.name, field.rules)} />
            </CCol>
          );
        })}
      </CRow>
    </>
  );
};

export default HorizontalCFormInputList;
