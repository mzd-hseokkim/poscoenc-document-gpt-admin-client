import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react-pro';

const ModalContainer = ({ children, visible, title, onClose, size }) => {
  return (
    <CModal size={size} alignment="center" visible={visible} onClose={onClose}>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{children}</CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={onClose}>
          닫기
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default ModalContainer;
