import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react-pro';

const ModalContainer = ({ children, visible, title, onClose }) => {
  return (
    <CModal alignment="center" visible={visible} onClose={onClose} portal={false}>
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
