import { toast } from 'react-toastify';

export const toastMessage = (type, text) => {
  let message = null;
  switch (type) {
    case 'success':
      message = () => toast.success(text);
      break;

    case 'warn':
      message = () => toast.warn(text);
      break;

    case 'error':
      message = () => toast.error(text);
      break;

    case 'info':
      message = () => toast.info(text);
      break;

    default:
      message = () => toast.dark(text);
  }

  message();
};
