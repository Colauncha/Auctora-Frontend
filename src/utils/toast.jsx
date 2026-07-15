import { toast } from 'react-toastify';
import { charLimit } from './index';

const renderContent = (message, detail) => {
  if (!detail) return message;
  return (
    <div>
      <p className="font-semibold">{message}</p>
      <p className="text-sm opacity-80">{charLimit(detail, 80)}</p>
    </div>
  );
};

export const toastSuccess = (message, detail) =>
  toast.success(renderContent(message, detail));

export const toastError = (message, detail) =>
  toast.error(renderContent(message, detail));

export const toastWarn = (message, detail) =>
  toast.warn(renderContent(message, detail));

export const toastInfo = (message, detail) =>
  toast.info(renderContent(message, detail));
