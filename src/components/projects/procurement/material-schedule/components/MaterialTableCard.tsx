import { FC, ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  className?: string;
  icon?: ReactNode;
  iconStyle?: string;
}

export const MaterialTableCard: FC<Props> = ({ label, value, className, icon, iconStyle }) => {
  return (
    <div className="flex items-center  gap-5 bg-white p-4 w-full rounded-md">
      <div
        className={`h-[48px] w-[48px] rounded-md  flex justify-center items-center p-1 ${className}`}>
        {icon && <div className={iconStyle}>{icon}</div>}
      </div>
      <div>
        <p className="text-sm font-satoshi font-medium text-bash">{label}</p>
        <p className="text-2xl font-satoshi font-semibold text-bblack-1">{value}</p>
      </div>
    </div>
  );
};
