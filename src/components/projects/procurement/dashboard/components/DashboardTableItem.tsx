import { FC, useMemo } from 'react';

import { FaEllipsisVertical } from 'react-icons/fa6';
import { formatWithComma } from 'Utils';
import { DashboardResponse } from '../types';

interface Props {
  item: DashboardResponse;
  s_n: number;
  isLastItem: boolean;
}

export const DashboardTableItem: FC<Props> = ({ s_n, item, isLastItem }) => {
  const pureVal = useMemo(() => {
    let newVal: { [key: string]: any } = {};
    for (let x in item) {
      if (!['s_n', 'setEditing'].includes(x)) {
        newVal[x] = item[x as keyof DashboardResponse];
      }
    }
    return newVal as DashboardResponse;
  }, [item]);

  return (
    <tr
      className={`py-4 font-satoshi font-medium text-bash text-sm w-full ${
        !isLastItem ? 'border-b' : ''
      }`}>
      <td className="pl-4">{s_n}</td>
      <td className="">{item.material}</td>
      <td className="">
        {formatWithComma(item.budget)} {item.unit}
      </td>
      <td className="">
        {formatWithComma(item.purchase)} {item.unit}
      </td>
      <td className="">
        {formatWithComma(item.inStock)} {item.unit}
      </td>
      <td className="py-6 ">
        <FaEllipsisVertical />
      </td>
    </tr>
  );
};
