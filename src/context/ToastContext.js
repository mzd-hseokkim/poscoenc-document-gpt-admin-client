import React, { createContext, useContext, useState } from 'react';

import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react-pro';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  /**
   *
   * @param message - The message to display in the toast.
   * @param color - The color of the toast. Defaults to 'danger'.
   * @param autoHide - Whether the toast should automatically hide. Defaults to true.
   */
  const addToast = ({ message, color = 'danger' }, autoHide = true) => {
    setToast({ message, color, key: Date.now(), autoHide });
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <CToaster
        placement="bottom-end"
        push={
          toast && (
            <CToast autohide={toast.autoHide} visible={true} color={toast.color} className="d-flex">
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
