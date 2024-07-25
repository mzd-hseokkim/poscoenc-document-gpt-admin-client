import React, { createContext, useContext, useRef, useState } from 'react';

import { CButton, CToast, CToastBody, CToastClose, CToaster } from '@coreui/react-pro';

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

  const clearAllToasts = () => {
    setToasts([]);
  };

  return (
    <>
      <ToastContext.Provider value={{ addToast }}>
        {children}
        <CToaster placement="bottom-end">
          {toasts.map((toast, index) => (
            <CToast
              autoFocus
              key={toast.key}
              autohide={toast.autoHide}
              visible={true}
              color={toast.color}
              className="d-flex"
              onClose={() => removeToast(toast.key)}
            >
              <CToastBody className="text-white">{toast.message + index}</CToastBody>
              <CToastClose className="me-2 m-auto" white />
            </CToast>
          ))}
        </CToaster>
        {toasts.length > 0 && (
          <CButton
            style={{
              position: 'fixed',
              right: 370,
              bottom: 16,
            }}
            onClick={clearAllToasts}
          >
            {'Dismiss All'}
          </CButton>
        )}
      </ToastContext.Provider>
    </>
  );
};

export const useToast = () => useContext(ToastContext);
