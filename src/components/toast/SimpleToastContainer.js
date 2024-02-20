import React from 'react';

import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react-pro';
import { useRecoilValue } from 'recoil';

import { toastState } from '../../states/toastState';

const SimpleToastContainer = () => {
  const toasts = useRecoilValue(toastState);

  if (toasts) {
    return (
      <CToaster
        placement="bottom-end"
        push={
          <CToast autohide visible color={toasts.color} className="d-flex">
            <CToastBody className="text-white">{toasts.message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </CToast>
        }
      />
    );
  } else {
    return null;
  }
};

export default SimpleToastContainer;
