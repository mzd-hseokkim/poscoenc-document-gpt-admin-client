import { useEffect, useState } from 'react';

import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react-pro';
import { colorButtonTextStyle } from 'components/button/colorButtonTextStyle';

const DeleteAlertModal = ({ isDataDeleted, visible, setVisible, deleteMethod }) => {
  const [pendingDataDeleted, setPendingDataDeleted] = useState(isDataDeleted);

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setPendingDataDeleted(isDataDeleted);
      }, 300); // modal 닫힘 애니메이션 시간에 맞춰 지연시간 설정
    }
  }, [visible, isDataDeleted]);

  return (
    <CModal backdrop="static" visible={visible} alignment="center" onClose={() => setVisible(false)}>
      <CModalHeader>
        <CModalTitle>{pendingDataDeleted ? '복구하시겠습니까?' : '삭제하시겠습니까?'}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{pendingDataDeleted ? '데이터를 복구합니다.' : '복구 버튼을 눌러 되돌릴 수 있습니다.'}</p>
      </CModalBody>
      <CModalFooter>
        <CButton style={colorButtonTextStyle} color="secondary" onClick={() => setVisible(false)}>
          취소
        </CButton>
        <CButton
          style={colorButtonTextStyle}
          color={pendingDataDeleted ? 'success' : 'danger'}
          onClick={(e) => {
            deleteMethod(e);
            setVisible(false);
          }}
        >
          {pendingDataDeleted ? '복구' : '삭제'}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default DeleteAlertModal;
