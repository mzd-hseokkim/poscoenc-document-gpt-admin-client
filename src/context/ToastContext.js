import React, { createContext, useContext, useRef, useState } from 'react';

import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react-pro';

const ToastContext = createContext({});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextKeyRef = useRef(1);

  const addToast = ({ message, color = 'danger' }, autoHide = true) => {
    const key = `toastNum${nextKeyRef.current}`;
    setToasts((prevToasts) => [...prevToasts, { message, color, key, autoHide }]);
    nextKeyRef.current = nextKeyRef.current === 10 ? 1 : nextKeyRef.current + 1;
  };

  const removeToast = (key) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.key !== key));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <CToaster placement="bottom-end">
        {toasts.map((toast) => (
          <CToast
            autoFocus
            key={toast.key}
            autohide={toast.autoHide}
            visible={true}
            color={toast.color}
            className="d-flex"
            onClose={() => removeToast(toast.key)}
          >
            <CToastBody className="text-white">{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </CToast>
        ))}
      </CToaster>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
