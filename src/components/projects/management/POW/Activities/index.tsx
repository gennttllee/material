import { centered, hoverFade } from 'constants/globalStyles';
import { TbArrowLeft } from 'react-icons/tb';
import React, { useContext, useMemo } from 'react';
import Activity from '../Components/Activity';
import { PMStoreContext } from '../../Context';
import { SubtaskActivity } from '../../types';
import Moment from 'react-moment';

const Activities = () => {
  const { activeSubTask, handleContext } = useContext(PMStoreContext);

  const sortedByDate = useMemo(() => {
    let data: { [date: number]: SubtaskActivity[] } = [];

    if (!activeSubTask || !activeSubTask.activities) return data;

    for (const activity of [...activeSubTask.activities].reverse()) {
      const currentDate = new Date(activity.date).setHours(0, 0, 0, 0);

      data = {
        ...data,
        [currentDate]: data[currentDate] ? [...data[currentDate], activity] : [activity]
      };
    }

    return data;
  }, [activeSubTask]);

  return (
    <>
      <button
        onClick={() => handleContext('activeSubTask', undefined)}
        className={'flex items-center' + hoverFade}
      >
        <TbArrowLeft />
        <p className="ml-2 font-Medium">Back</p>
      </button>
      <div className="my-5" />
      <div className="bg-white rounded-md shadow-md p-8">
        <h5 className="text-bash font-Demibold text-sm">Activity</h5>
        <h2 className="font-Demibold text-2xl my-4 capitalize">{activeSubTask?.name}</h2>

        <div className="rounded-md py-4 mx-h-[200px] overflow-y-scroll">
          {React.Children.toArray(
            Object.entries(sortedByDate).map(([key, activities]) => (
              <div className="relative">
                <div className="absolute z-0 top-0 left-5 h-full border-l-2 " />
                <div className="relative z-10">
                  {React.Children.toArray(
                    activities.map((item, index) => (
                      <Activity hasShortDate {...{ ...item, index }} />
                    ))
                  )}
                </div>
                <div className={'relative w-full my-5 z-10' + centered}>
                  <div className="border rounded-full bg-white px-3 py-2 relative z-10">
                    <p className="text-bash text-sm font-Medium">
                      <Moment format="LL">{Number(key)}</Moment>
                    </p>
                  </div>
                  <div className="absolute z-0 border-t w-full left-5 bg-white h-[50%] top-[50%]" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Activities;
