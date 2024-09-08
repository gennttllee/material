import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Record } from './types';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { TheOption } from 'pages/projects/Home/Components/ProjectCard';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { useAppDispatch } from 'store/hooks';
import { removeRecord } from 'store/slices/bookKeepingSlice';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess, formatCurrency, formatWithComma } from 'Utils';
import { StoreContext } from 'context';
import DetailModal from './DetailModal';
import { convertToProper } from 'components/shared/utils';

interface Props extends Record {
  s_n: number;
  setEditing: (x: Record) => void;
}

const handleEditing = (val: Record, setter: (x: Record) => void) => () => {
  setter(val);
};
const toggler = (val: any, setter: any) => () => {
  setter(!val);
};
const RecordTableItem = (m: Props) => {
  let { data, activeProject } = useContext(StoreContext);
  const [options, setOptions] = useState(false);
  const [loading, setLoading] = useState(false);
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

  let dispatch = useAppDispatch();

  const handleDelete = async () => {
    setLoading(true);
    let { e, response } = await postForm('delete', `financials/bookkeeping/delete?bookId=${m._id}`);
    if (response) {
      displaySuccess('Record removed Successfully');
      dispatch(removeRecord(m._id));
    } else {
      displayError(e?.message || 'Could not remove record');
    }
    setLoading(false);
  };

  const pureVal = useMemo(() => {
    let newVal: { [key: string]: any } = {};
    for (let x in m) {
      if (!['s_n', 'setEditing'].includes(x)) {
        newVal[x] = m[x as keyof Record];
      }
    }
    return newVal as Record;
  }, [m]);

  let fieldset = useMemo(() => {
    let fields = ['name', 'quantity', 'rate', 'amount', 'date', 'category', 'vendor'];
    return fields.map((f: string) => ({
      [convertToProper(f as string)]:
        f === 'date'
          ? new Date(m.date).toDateString().slice(4)
          : (m[(f === 'name' ? 'item' : f) as keyof typeof m] as any)
    }));
  }, []);
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
    <tr className=" py-4 text-bash text-sm w-full ">
      <td className=" pl-4">{m.s_n}</td>
      <td className="py-2">{m.item}</td>
      <td className="py-2">
        {formatWithComma(m.quantity)} {m.unit}
      </td>
      <td className="py-2">
        {activeProject?.currency?.code} {formatWithComma(m.rate)}
      </td>
      <td className="py-2  ">
        {activeProject?.currency?.code} {formatWithComma(m.amount)}
      </td>
      <td className="py-2">{new Date(m.date).toDateString().slice(4)}</td>
      <td
        ref={hoverRef}
        onMouseOver={toggle}
        onMouseLeave={toggle}
        className="py-2 relative  hover:cursor-pointer">
        <span className=" text-bash underline font-medium">
          {`${showDescription ? 'Hide' : 'View'} description`}
        </span>
        {showDescription && (
          <span
            onMouseOver={() => {
              setViewing(true);
            }}
            onMouseLeave={handleViewingLeave}
            ref={descriptionRef}
            style={{ top }}
            className=" absolute z-20   text-sm min-w-[30vw]  max-w-[450px] right-0 rounded-md text-white ">
            <DetailModal fieldset={fieldset} description={m.description} />
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

export default RecordTableItem;
