import React, { FC, useState, useMemo } from 'react';
import { FaUserGroup } from 'react-icons/fa6';
import { MaterialScheduleRecord, MaterialRecord } from '../types';
import Button from 'components/shared/Button';
import { TbPlus } from 'react-icons/tb';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { TbEdit, TbTrash } from 'react-icons/tb';
import { postForm } from 'apis/postForm';
import { HiOutlineTrash } from 'react-icons/hi';
import CreateMaterialModal from './CreateMaterialModal';
import useMaterialSchedule from 'Hooks/useMaterialSchedule';
import { displayError, displaySuccess } from 'Utils';
import { useAppDispatch } from 'store/hooks';
import { removeRecord } from 'store/slices/materialScheduleSlice';
import { setLoading } from 'store/slices/teamSlice';

interface ScheduleType {
  data: MaterialScheduleRecord[];
  item: MaterialScheduleRecord[];
  activeTab: string;
  onMaterialClick: (material : any) => void;
  setEditingSchedule: (x: MaterialScheduleRecord) => void;
}

const TabsMaterialSchedule: FC<ScheduleType> = ({
  item,
  data,
  activeTab,
  onMaterialClick,
  setEditingSchedule
}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<MaterialScheduleRecord | undefined>(undefined);
  // const { triggerRefresh } = useMaterialSchedule();
  let dispatch = useAppDispatch();

  const handleEditing =
    (val: MaterialScheduleRecord, setter: (x: MaterialScheduleRecord) => void) => () => {
      setter(val);
    };

  const pureVal = useMemo(() => {
    let newVal: { [key: string]: any } = {};
    for (let x in item) {
      if (!['s_n', 'setEditing'].includes(x)) {
        newVal[x] = item[x as keyof MaterialScheduleRecord as any];
      }
    }
    return newVal as MaterialScheduleRecord;
  }, [item]);

  const handleDelete = async (id: string) => {
    setLoading(true);

    let { e, response } = await postForm(
      'patch',
      `/procurements/material-schedule/delete?scheduleId=${id}`
    );
    if (response) {
      displaySuccess('Material removed Successfully');
      dispatch(removeRecord(id));
    } else {
      console.log(id);
      displayError(e?.message || 'Could not remove material');
    }
    setLoading(false);

    console.log(`Request URL: /procurements/material-schedule/delete?scheduleId=${id}`);
  };

  console.log(data);

  const validData = data.filter(Boolean)

  return (
    <>
      {showModal && (
        <CreateMaterialModal
          // onAdd={() => triggerRefresh()}
          isEditing={Boolean(editing)}
          value={editing}
          closer={() => {
            setShowModal(false);
            setEditing(undefined);
          }}
        />
      )}

      <div className=" flex items-center  overflow-x-auto mt-4">

      {validData.length === 0 && <div>No material schedules found.</div>}
        
        {validData.map((schedule, index) => {

          return (
            <div
              key={schedule._id}
              className={`flex items-center gap-2 py-2 px-6 border hover:cursor-pointer border-t-bbg rounded-t-lg ${
                activeTab === schedule._id ? 'active bg-white border-b-white' : 'bg-[#EBF1FA] border-x-bbg'
              }`}
              onClick={() => onMaterialClick(schedule)}>
              <div className="flex items-center justify-start gap-2">
                <span>
                  <FaUserGroup
                    className={`${activeTab === schedule._id ? 'text-bblue' : 'text-ashShade-2'}`}
                  />
                </span>
                <span
                  className={`max-w-[9em] whitespace-nowrap inline-block  overflow-x-auto ${
                    activeTab === schedule._id ? 'text-bblue' : 'text-bblack-1'
                  }`}>
                  {schedule.name || `Material Schedule ${index + 1}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <TbEdit onClick={handleEditing(pureVal, setEditingSchedule)} />
                <HiOutlineTrash
                  onClick={() => handleDelete(schedule._id)}
                  className="text-redShade-0"
                />
              </div>
            </div>
          );
        })}
        <Button text="" onClick={() => setShowModal(true)} LeftIcon={<TbPlus />} />
      </div>
    </>
  );
};

export default TabsMaterialSchedule;
