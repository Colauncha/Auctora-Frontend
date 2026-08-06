import { toast } from 'react-toastify';
import { charLimit } from './index';

const renderContent = (message, detail) => {
  if (!detail) return message;
  return (
    <div>
      <p className="font-semibold">{message}</p>
      <p className="text-sm opacity-80">{charLimit(detail, 160)}</p>
    </div>
  );
};

const renderContentWithButton = (message, detail, func_, func_name) => {
  if (!detail) return message;
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-semibold">{message}</p>
        <p className="text-sm opacity-80">{charLimit(detail, 160)}</p>
      </div>
      <button
        className="mt-2 px-4 py-2 bg-gradient-to-br from-[#5e1a28] to-[#e65471] text-white rounded hover:to-[#5e1a28] transition duration-300"
        onClick={() => {
          if (func_) func_();
        }}
      >
        {func_name || 'Take Action'}
      </button>
    </div>
  );
};

// With buttons
export const toastSuccessWithButton = (message, detail, func_, func_name) =>
  toast.success(renderContentWithButton(message, detail, func_, func_name));

export const toastErrorWithButton = (message, detail, func_, func_name) =>
  toast.error(renderContentWithButton(message, detail, func_, func_name));

export const toastWarnWithButton = (message, detail, func_, func_name) =>
  toast.warn(renderContentWithButton(message, detail, func_, func_name));

export const toastInfoWithButton = (message, detail, func_, func_name) =>
  toast.info(renderContentWithButton(message, detail, func_, func_name));

// Without buttons
export const toastSuccess = (message, detail) =>
  toast.success(renderContent(message, detail));

export const toastError = (message, detail) =>
  toast.error(renderContent(message, detail));

export const toastWarn = (message, detail) =>
  toast.warn(renderContent(message, detail));

export const toastInfo = (message, detail) =>
  toast.info(renderContent(message, detail));
