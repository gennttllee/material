import { ReactNode } from 'react';
import { IconType } from 'react-icons';

const CustomSection = ({
  Icon,
  title,
  Children,
  hasBorder,
  description
}: {
  title: string;
  Icon: IconType;
  hasBorder?: boolean;
  description: string;
  Children?: ReactNode;
}) => (
  <section className="flex justify-between flex-col lg:flex-row px-0 py-10 h-fit relative">
    <div className="lg:w-[45%] flex items-start">
      <Icon className="text-2xl text-black" />
      <div className="flex-1 px-4">
        <p className="font-Medium text-2xl">{title}</p>
        <p className="text-bash text-base mt-3">{description}</p>
      </div>
    </div>
    <div className="lg:w-1/2 ml-10 lg:ml-0">{Children}</div>
    {hasBorder && <div className="w-full border-t absolute bottom-0 right-0" />}
  </section>
);

export default CustomSection;
