import { CheckCheck, Check } from 'lucide-react';

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'read':
      return <CheckCheck size={14} className="text-blue-500" />;
    case 'delivered':
      return <CheckCheck size={14} className="text-gray-500" />;
    case 'sending':
      return <Check size={14} className="text-gray-400" />;
    case 'failed':
      return <span className="text-red-500 text-xs">!</span>;
    default:
      return null;
  }
};

const clipboardCopy = (text) => {
  console.log('Copied to clipboard:', text);
  window.navigator.clipboard.writeText(text);
  return null;
};

const quickActionOptions = {
  buyer: ['Set Inspecting', 'Finalize', 'Request Refund'],
  seller: ['Item sent'],
};

export { formatTime, getStatusIcon, quickActionOptions, clipboardCopy };
