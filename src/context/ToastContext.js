import React, { createContext, useContext, useState } from 'react';

import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react-pro';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const addToast = ({ message, color = 'danger' }) => {
    setToast({ message, color, key: Date.now() });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <CToaster
        placement="bottom-end"
        push={
          toast && (
            <CToast autohide visible={true} color={toast.color} className="d-flex">
              <CToastBody className="text-white">{toast.message}</CToastBody>
              <CToastClose className="me-2 m-auto" white />
            </CToast>
          )
        }
      />
    </ToastContext.Provider>
  );
};
export const useToast = () => useContext(ToastContext);
