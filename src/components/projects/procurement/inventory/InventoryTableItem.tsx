import React, { useMemo, useRef, useState } from 'react';
import { Inventory } from './types';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { TheOption } from 'pages/projects/Home/Components/ProjectCard';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { useAppDispatch } from 'store/hooks';
import { removeRecord } from 'store/slices/inventorySlice';
import { formatWithComma } from 'Utils';
import ItemDetailsCard from './ItemDetailsCard';
import { ActivityType } from './types';

export interface Props extends Inventory {
  s_n: number;
  setEditing: (x: Inventory) => void;
  activity: ActivityType;
}

const handleEditing = (val: Inventory, setter: (x: Inventory) => void) => () => {
  setter(val);
};
const toggler = (val: any, setter: any) => () => {
  setter(!val);
};

const InventoryTableItem = (m: Props) => {
  const [options, setOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const optionsRef = useRef<any>();
  useClickOutSideComponent(optionsRef, () => {
    if (!loading) {
      setOptions(false);
    }
  });

  const descriptionRef = useRef<any>();
  useClickOutSideComponent(descriptionRef, () => {
    if (!loading) {
      setOptions(false);
    }
  });

  let dispatch = useAppDispatch();

  const handleDelete = () => {
    dispatch(removeRecord(m._id));
  };

  const pureVal = useMemo(() => {
    let newVal: { [key: string]: any } = {};
    for (let x in m) {
      if (!['s_n', 'setEditing'].includes(x)) {
        newVal[x] = m[x as keyof Inventory];
      }
    }
    return newVal as Inventory;
  }, [m]);

  return (
    <tr className=" py-4 text-bash text-sm w-full ">
      <td className=" pl-4">{m.s_n}</td>
      <td className="py-2">{m.material}</td>
      <td className="py-2">
        {formatWithComma(m.quantity)} {m.unit}
      </td>
      <td className="py-2">{m.workArea}</td>
      <td className={`py-2 `}>
        <span
          className={`py-1 px-3 rounded-3xl text-xs ${
            m.activityType === 'Disburse'
              ? 'bg-redShades-1 text-redShades-2'
              : 'bg-bgreen-1 text-bgreen-0'
          }`}>
          {m.activityType}
        </span>
      </td>
      <td className="py-2">{new Date(m.date).toDateString().slice(4)}</td>
      <td
        className="py-2 relative hover:cursor-pointer"
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}>
        <span className=" text-bash underline font-medium hover:text-bblack-1">View details</span>
        {showDetails && (
          <span
            ref={descriptionRef}
            className=" absolute z-50 bg-white p-4 text-sm top-10 w-[458px] right-0 rounded-md text-black shadow-[0_4px_6px_8px_rgba(0,0,0,0.1)]">
            <ItemDetailsCard itemDetails={m} setShowDetails={setShowDetails} />
          </span>
        )}
      </td>
      <td className="py-2 relative ">
        <div>
          <span
            onClick={() => {
              setOptions(true);
            }}
            className=" p-2 w-8 h-8 flex rounded-full  hover:bg-ashShade-0 ">
            <FaEllipsisVertical />
          </span>

          {options && (
            <div
              ref={optionsRef}
              className=" top-6 z-10 right-2 absolute bg-white   rounded-md shadow-bnkle lg:w-[136px] ">
              <TheOption
                icon={TbEdit}
                text="Edit"
                onClick={handleEditing(pureVal, m.setEditing)}
                className=" px-4"
              />
              <TheOption
                loading={loading}
                className=" hover:text-redShades-2 text-redShades-2 hover:bg-redShades-1 px-4"
                iconColor="#B63434"
                iconHoveredColor="#B63434"
                icon={TbTrash}
                text="Delete"
                onClick={handleDelete}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
export default InventoryTableItem;
