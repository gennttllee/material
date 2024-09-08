import { FC, useMemo, useState } from 'react';

import PaginationComponent from 'components/projects/financials/book-keeping/PaginationComponent';
import NoContent from 'components/projects/photos/NoContent';
import { LoaderX } from 'components/shared/Loader';
import { isArrayNullOrEmpty } from 'helpers/helper';
import { DashboardResponse } from '../types';
import { DashboardTableItem } from './DashboardTableItem';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from 'react-icons/md';

interface Props {
  data: DashboardResponse[];
  loading?: boolean;
  columns: any[];
}
const NUMBER_PER_PAGE = 10;

export const CustomTable: FC<Props> = ({ data, loading, columns }) => {
  let numberOfPages = Math.ceil(data.length / NUMBER_PER_PAGE);

  const [currentPage, setCurrentPage] = useState<number>(0);

  const paginatedData = useMemo(() => {
    return data.slice(currentPage * NUMBER_PER_PAGE, (currentPage + 1) * NUMBER_PER_PAGE);
  }, [currentPage, data]);

  if (loading) {
    return (
      <div className="w-full flex rounded-md bg-white items-center justify-center p-10 mt-16">
        <LoaderX color="blue" />
      </div>
    );
  }

  if (isArrayNullOrEmpty(data)) {
    return (
      <NoContent
        subtitle="Keep a record of materials needed\ninto complete the project"
        title="No Material recorded yet"
      />
    );
  }

  return (
    <>
      <table className="bg-white w-full rounded-md pr-[20em]">
        <thead>
          <tr className="border-b font-semibold">
            {columns.map((column, index) => (
              <td
                key={index}
                className={`py-6 font-satoshi font-medium text-sm text-bblack-1 ${
                  index === 0 ? 'pl-4' : ''
                }`}>
                <div className="flex items-center gap-2">
                  {column.name}
                  {column.showIcons && (
                    <div>
                      <MdOutlineKeyboardArrowUp size={10} color="#9099A8" />
                      <MdOutlineKeyboardArrowDown size={10} color="#9099A8" />
                    </div>
                  )}
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <DashboardTableItem
              key={item._id}
              s_n={currentPage * NUMBER_PER_PAGE + index + 1}
              item={item}
              isLastItem={index === paginatedData.length - 1}
            />
          ))}
        </tbody>
      </table>
      <PaginationComponent
        pageIndex={currentPage}
        pageCount={numberOfPages}
        setPageIndex={setCurrentPage}
      />
    </>
  );
};
