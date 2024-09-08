import { FC } from 'react';

interface Props {
  label: string;
  value: string;
}

export const TableItemCard: FC<Props> = ({ label, value }) => {
  return (
    <div className="flex items-center  gap-4 bg-white p-6 w-full rounded-md">
      <p className="text-lg font-satoshi font-medium text-bash">{label}</p>
      <p className="text-3xl font-satoshi font-semibold text-bblack-1">{value}</p>
    </div>
  );
};
