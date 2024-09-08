import React, { ReactNode } from 'react';
import { GiPartyPopper } from 'react-icons/gi';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { TbCircleDotted, TbCircleOff } from 'react-icons/tb';
import { flexer } from '../../../constants/globalStyles';

interface Props {
  title: string;
  className?: string;
  description: string;
  ExtraContext?: ReactNode;
  Icon?: ReactNode;
  type: 'pending' | 'decline' | 'done' | 'dormant' | 'primary';
}

export default function StatusLabel({
  type,
  description,
  ExtraContext,
  title,
  Icon,
  className
}: Props) {
  const textColor = () => {
    switch (type) {
      case 'primary':
        return 'text-bblue';
      case 'decline':
        return `text-red-700 `;
      case 'pending':
        return `text-[#8A6813]`;
      case 'done':
        return `text-green-700`;
      case 'dormant':
        return `text-gray-700`;
    }
  };

  const bgColor = () => {
    switch (type) {
      case 'primary':
        return 'bg-blue-100';
      case 'decline':
        return `bg-red-200`;
      case 'pending':
        return ` bg-[#F8EFD8]`;
      case 'done':
        return `bg-green-200`;
      case 'dormant':
        return `bg-gray-200`;
    }
  };

  const IconHandler = () => {
    switch (type) {
      case 'primary':
        return <HiOutlineCheckCircle className="text-blue-500 text-2xl" />;
      case 'decline':
        return <TbCircleOff className="text-red-500 text-2xl" />;
      case 'pending':
        return <TbCircleDotted className="text-[#8A6813] text-3xl" />;
      case 'done':
        return <GiPartyPopper className="text-green-500 text-2xl" />;
      case 'dormant':
        return <></>;
    }
  };

  return (
    <div
      className={
        `${bgColor()} w-full py-4 px-6 rounded-md grid md:flex items-center` + flexer + className
      }
    >
      <div className="flex items-center">
        {Icon ? Icon : IconHandler()}
        <strong className={`mx-2 ${textColor()} font-semibold text-base`}>{title}!!</strong>
      </div>
      <p className={`${textColor()} opacity-80 flex-1 md:my-0 my-2 ml-8 md:ml-0`}>{description}</p>
      {ExtraContext}
    </div>
  );
}
