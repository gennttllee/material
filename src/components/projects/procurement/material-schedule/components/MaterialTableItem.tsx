import { FC, useContext, useMemo, useRef, useState } from 'react';
import { MaterialScheduleRecord, MaterialRecord } from '../types';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { TheOption } from 'pages/projects/Home/Components/ProjectCard';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { useAppDispatch } from 'store/hooks';
import { removeMaterialRecord } from 'store/slices/materialScheduleSlice';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess, formatWithComma } from 'Utils';
import { StoreContext } from 'context';
import MaterialItemCard from './MaterialItemCard';

export interface Props extends MaterialRecord {
  s_n: number;
  activeTab: string;
  setEditing: (x: MaterialRecord) => void;
}

const handleEditing =
  (val: MaterialRecord, setter: (x: MaterialRecord) => void) => () => {
    setter(val);
  };
const toggler = (val: any, setter: any) => () => {
  setter(!val);
};
const RecordTableItem = (m:Props) => {
  let { data, activeProject } = useContext(StoreContext);
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

  const handleDelete = async () => {
    setLoading(true);
    const payLoad = {
      scheduleId: m.activeTab,
      materialId: m._id
    }
    let { e, response } = await postForm(
      'delete',
      `procurements/material-schedule/delete-material`, payLoad
    );
    if (response) {
      displaySuccess('Material removed Successfully');
      dispatch(removeMaterialRecord(payLoad));
    } else {
      displayError(e?.message || 'Could not remove material');
    }
    setLoading(false);
  };

  const pureVal = useMemo(() => {
    let newVal: { [key: string]: any } = {};
    for (let x in m) {
      if (!['s_n', 'setEditing'].includes(x)) {
        newVal[x] = m[x as keyof MaterialRecord];
      }
    }
    return newVal as MaterialRecord;
  }, [m]);

  // const materialItem = item.materials[0];

  return (
    <tr className=" py-4 text-bash text-sm w-full ">
      <td className=" pl-4">{m.s_n}</td>
      <td className="py-2">{m.material}</td>
      <td className="py-2">
        {formatWithComma(m.quantity)} {m.unit}
      </td>
      <td className="py-2">
        {activeProject?.currency?.code} {formatWithComma(m.rate)}
      </td>
      <td className="py-2  ">
        {activeProject?.currency?.code} {formatWithComma(m.amount)}
      </td>
      <td
        onClick={toggler(showDetails, setShowDetails)}
        className="py-2 relative hover:cursor-pointer">
        <span className=" text-bash underline font-medium">
          {`${showDetails ? 'Hide' : 'View'} note`}
        </span>

        {showDetails && <MaterialItemCard item={m}/>}
      </td>
      <td className="py-2">{new Date(m.purchaseDate).toDateString().slice(4)}</td>

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
