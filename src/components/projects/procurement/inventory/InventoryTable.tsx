import React, { useEffect, useMemo, useState } from 'react';
import { Inventory, ActivityType } from './types';
import InventoryTableItem from './InventoryTableItem';
import NoContent from 'components/projects/photos/NoContent';
import { LoaderX } from 'components/shared/Loader';
import PaginationComponent from './PaginationComponent';

interface Props {
  data: Inventory[];
  loading?: boolean;
  setEditing: (x: Inventory) => void;
  activity: ActivityType;
}

const numberperPage = 10;

const InventoryTable = ({ data, setEditing, loading, activity }: Props) => {
  let numberofPages = Math.ceil(data.length / numberperPage);

  const [current, setCurrent] = useState(0);

  const _data = useMemo(() => {
    return data.slice(current * numberperPage, (current + 1) * numberperPage);
  }, [current, data]);

  return (
    <div className=" p-2 mt-4 rounded-md">
      {loading ? (
        <div className=" w-full flex rounded-md bg-white  items-center justify-center p-10">
          <LoaderX color="blue" />
        </div>
      ) : data.length > 0 ? (
        <>
          <table className="  bg-white w-full">
            <thead className="text-bblack-1 text-sm">
              <tr className="  border-b  font-semibold">
                <td className=" py-6 pl-4">S/N</td>
                <td className="py-6">Material</td>
                <td className="py-6">Quantity</td>
                <td className="py-6">Work Area</td>
                <td className="py-6">Activity Type</td>
                <td className="py-6">Activity Date</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {_data.map((m, i) => (
                <InventoryTableItem
                  key={m._id}
                  s_n={current * numberperPage + i + 1}
                  {...m}
                  setEditing={setEditing}
                  activity={activity}
                />
              ))}
            </tbody>
          </table>
          <PaginationComponent
            pageIndex={current}
            pageCount={numberofPages}
            setPageIndex={setCurrent}
          />
        </>
      ) : (
        <NoContent subtitle="Please add a record" title="No Records Yet" />
      )}
    </div>
  );
};
export default InventoryTable;
