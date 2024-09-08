import React, { useEffect, useMemo, useState } from 'react';
import { Record } from './types';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { TheOption } from 'pages/projects/Home/Components/ProjectCard';
import { Option } from 'pages/projects/Clusters/BuildingTypes';
import { TbEdit } from 'react-icons/tb';
import RecordTableItem from './RecordTableItem';
import NoContent from 'components/projects/photos/NoContent';
import { LoaderX } from 'components/shared/Loader';
import PaginationComponent from './PaginationComponent';

interface Props {
  data: Record[];
  loading?: boolean;
  setEditing: (x: Record) => void;
}
const numberperPage = 10;
const BookKeepingTable = ({ data, setEditing, loading }: Props) => {
  let numberofPages = Math.ceil(data.length / numberperPage);

  const [current, setCurrent] = useState(0);

  const _data = useMemo(() => {
    return data.slice(current * numberperPage, (current + 1) * numberperPage);
  }, [current, data]);

  useEffect(() => {
    setCurrent(0);
  }, [data]);

  return (
    <div className=" p-2 mt-4 rounded-md">
      {loading ? (
        <div className=" w-full flex rounded-md bg-white  items-center justify-center p-10">
          <LoaderX color="blue" />
        </div>
      ) : data.length > 0 ? (
        <>
          <table className="  bg-white w-full ">
            <thead>
              <tr className="  border-b  font-semibold">
                <td className=" py-6 pl-4">S/N</td>
                <td className="py-6">Material</td>
                <td className="py-6">Quantity</td>
                <td className="py-6">Rate</td>
                <td className="py-6">Amount</td>
                <td className="py-6">Date</td>
                <td className="py-6"></td>
                <td className="py-6"></td>
              </tr>
            </thead>
            <tbody>
              {_data.map((m, i) => (
                <RecordTableItem
                  key={m._id}
                  s_n={current * numberperPage + i + 1}
                  {...m}
                  setEditing={setEditing}
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

export default BookKeepingTable;
