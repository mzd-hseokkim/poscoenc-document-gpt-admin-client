import { CToast, CToastBody, CToastClose, CToaster } from '@coreui/react-pro';
import { useRecoilValue } from 'recoil';
import { toastState } from '../../states/toastState';

const SimpleToastContainer = () => {
  const toasts = useRecoilValue(toastState);

  return (
    <CToaster placement="bottom-end">
      {toasts?.map((toast) => (
        <CToast key={toast.id} autohide={true} visible={true} color={toast.color}>
          <div className="d-flex">
            <CToastBody className="text-white">{toast.body}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
      ))}
    </CToaster>
  );
};

export default SimpleToastContainer;
