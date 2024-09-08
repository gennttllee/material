import React from 'react';

interface Props {
  onClick?: (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => void;
  className?: string;
  label: string;
  type: 'pending' | 'decline' | 'done' | 'dormant' | 'not started' | 'completed';
}

const StatusBanner = ({ type, label, className, onClick }: Props) => {
  const color = () => {
    switch (type) {
      case 'decline':
        return `text-red-700 bg-red-200`;
      case 'pending':
        return `text-[#9C740C] bg-[#F8EFD8]`;
      case 'not started':
        return `text-red-700 bg-red-200`;
      case 'done':
        return `text-green-700 bg-green-200`;
      case 'completed':
        return `text-blue-700 bg-blue-200`;
      case 'dormant':
        return `text-[#77828D] bg-[#E4E6EA]`;
    }
  };
  return (
    <p
      {...{ onClick }}
      className={`px-2 py-1 rounded-full w-auto font-Medium text-xs truncate capitalize ${color()} ${className}`}
    >
      {label}
    </p>
  );
};

export default StatusBanner;
