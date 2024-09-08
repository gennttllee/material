import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Record } from 'components/projects/procurement/supply/types';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { TheOption } from 'pages/projects/Home/Components/ProjectCard';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { useDispatch } from 'react-redux';
import { removeRecord } from 'store/slices/supplySlice';
import { displayError, displaySuccess, formatWithComma } from 'Utils';
import ViewDetails from './ViewDetailsModal';

interface Props extends Record {
  s_n: number;
  setEditing: (x: Record) => void;
  onDelete: (id: string) => void;
}

const handleEditing = (val: Record, setter: (x: Record) => void) => () => {
  setter(val);
};

const toggler = (val: any, setter: any) => () => {
  setter(!val);
};

const SupplyTableItem: React.FC<Props> = ({
  s_n,
  date,
  material,
  quantity,
  unit,
  vendor,
  category,
  notes,
  acknowledgedBy,
  _id,
  orderNumber,
  setEditing,
  onDelete
}) => {
  const [options, setOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewDetails, setviewDetails] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [top, setTop] = useState(0);
  const optionsRef = useRef<any>();
  const hoverRef = useRef<HTMLTableCellElement>(null);
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
  // useClickOutSideComponent(descriptionRef, () => setviewDetails(false));

  const dispatch = useDispatch();

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(removeRecord(id));
      onDelete(id);
      displaySuccess('Record removed Successfully');
    } catch (error) {
      displayError('Could not remove record');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    console.log(hoverRef?.current?.getBoundingClientRect());
    if (!viewing) {
      setShowDescription(!showDescription);
      setViewing(true);
    }
  };
  const handleViewing = () => {
    setViewing(true);
  };
  const handleViewingLeave = () => {
    setViewing(false);
    setShowDescription(false);
  };
  useEffect(() => {
    if (viewing || showDescription) {
      let details = descriptionRef?.current?.getBoundingClientRect();
      let screenHeight = window.innerHeight;
      let elementTop = hoverRef?.current?.getBoundingClientRect()?.top;
      let newTop = 0;
      if (details && elementTop && details.height >= screenHeight) {
        newTop = -details.top;
      } else if (details && elementTop + details.height > screenHeight) {
        newTop = screenHeight - (details.height + elementTop);
      }
      setTop(newTop);
    }
  }, [viewing, showDescription]);

  return (
    <tr className="py-4 text-bash text-sm w-full relative">
      <td className="pl-4 capitalize">{s_n}</td>
      <td className="py-2 capitalize">{orderNumber}</td>
      <td className="py-2 capitalize">{material}</td>
      <td className="py-2 capitalize">
        {formatWithComma(quantity)} {unit}
      </td>
     <td className="py-2 capitalize">{vendor}</td>
      <td className="py-2 capitalize">{acknowledgedBy}</td>
      <td className="py-2 capitalize">{new Date(date).toDateString().slice(4)}</td>
      <td
        onMouseEnter={() => setviewDetails(true)}
        onMouseLeave={() => setviewDetails(false)}
        className="py-2 relative hover:cursor-pointer">
        <span className="text-bash underline font-medium">
          {viewDetails ? 'Hide details' : 'More details'}
        </span>
        {viewDetails && (
          <span className="absolute z-20 text-sm min-w-[30vw] max-w-[460px] right-0 rounded-md top-[-90px] text-white">
            <ViewDetails
              orderNumber={orderNumber}
              material={material}
              quantity={quantity}
              unit={unit}
              vendor={vendor}
              acknowledgedBy={acknowledgedBy}
              category={category}
              date={date}
              notes={notes}
              s_n={undefined}
              _id={''}
            />
          </span>
        )}
      </td>
      <td className="py-2 relative">
        <div>
          <span
            onClick={() => setOptions(true)}
            className="p-2 w-8 h-8 flex rounded-full hover:bg-ashShade-0">
            <FaEllipsisVertical />
          </span>
          {options && (
            <div
              ref={optionsRef}
              className="top-6 z-10 right-2 absolute bg-white rounded-md shadow-bnkle lg:w-[136px]">
              <TheOption
                icon={TbEdit}
                text="Edit"
                onClick={handleEditing(
                  {
                    s_n,
                    orderNumber,
                    material,
                    quantity,
                    unit,
                    vendor,
                    category,
                    notes,
                    acknowledgedBy,
                    date,
                    _id
                  },
                  setEditing
                )}
                className="px-4"
              />
              <TheOption
                loading={loading}
                className="hover:text-redShades-2 text-redShades-2 hover:bg-redShades-1 px-4"
                iconColor="#B63434"
                iconHoveredColor="#B63434"
                icon={TbTrash}
                text="Delete"
                onClick={() => handleDelete(_id)}
              />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default SupplyTableItem;
