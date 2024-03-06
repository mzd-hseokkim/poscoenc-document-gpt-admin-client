import { CModal, CModalHeader, CModalTitle } from '@coreui/react-pro';

const ModalContainer = ({ children, visible, title, onClose, size }) => {
  return (
    <CModal size={size} alignment="center" visible={visible} onClose={onClose} portal={false} scrollable>
      <CModalHeader>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      {children}
    </CModal>
  );
};

export default ModalContainer;
