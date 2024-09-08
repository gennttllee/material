import React, { useMemo, useState, useEffect } from 'react';
import { Record } from 'components/projects/procurement/supply/types';
import SupplyTableItem from './SupplyTableItem';
import NoContent from 'components/projects/photos/NoContent';
import { LoaderX } from 'components/shared/Loader';
import PaginationComponent from './PaginationComponent';

interface SupplyTableProps {
  data: Record[];
  loading: boolean;
  setEditing: (record: Record) => void;
  onDelete: (id: string) => void;
}

const numberperPage = 10;

const SupplyTable: React.FC<SupplyTableProps> = ({ data, loading, setEditing, onDelete }) => {
  const [current, setCurrent] = useState<number>(0);

  useEffect(() => {
    if (data.length > 0) {
      setCurrent(0);
    }
  }, [data]);

  const numberofPages = Math.ceil(data.length / numberperPage);

  const _data = useMemo(() => {
    return data.slice(current * numberperPage, (current + 1) * numberperPage);
  }, [current, data]);

  return (
    <div className="p-2 mt-4 rounded-md">
      {loading ? (
        <div className="w-full flex rounded-md bg-white items-center justify-center p-10">
          <LoaderX color="blue" />
        </div>
      ) : data.length > 0 ? (
        <>
          <table className="bg-white w-full">
            <thead>
              <tr className="border-b font-semibold">
                <td className="py-6 pl-4">S/N</td>
                <td className="py-6 ">Order Number</td>
                <td className="py-6">Material</td>
                <td className="py-6">Quantity</td>
                <td className="py-6">Vendor</td>
                <td className="py-6">Received by</td>
                <td className="py-6">Supplied Date</td>
              </tr>
            </thead>
            <tbody>
              {_data.map((m, i) => {
                const { s_n, ...rest } = m;
                return (
                  <SupplyTableItem
                    key={m._id}
                    s_n={current * numberperPage + i + 1}
                    {...rest}
                    setEditing={setEditing}
                    onDelete={onDelete}
                  />
                );
              })}
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

export default SupplyTable;
