import { DatePicker } from 'components/shared/DatePicker';
import InputField from 'components/shared/InputField';
import SelectDate from 'components/shared/SelectDate';
import SelectField from 'components/shared/SelectField';
import SuperModal from 'components/shared/SuperModal';
import { tr } from 'date-fns/locale';
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-day-picker';
import { TbChevronLeft, TbChevronRight, TbLockOpenOff, TbSearch } from 'react-icons/tb';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ReferralContext } from '../types';
import { useAppSelector } from 'store/hooks';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import SelectDateRange from 'components/shared/SelectDateRange';

const withdrawalTableHeaders = [
  'S/N',
  'Name',
  'Email',
  'Amount Requested',
  'Date Requested',
  'Date Completed'
];

let maxItems = 6;
const Index = () => {
  let user = useAppSelector((m) => m.user);
  const [currentPage, setCurrentPage] = useState(0);
  let navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: '',
    // amount: '',
    date: ''
  });
  const [dateTouched, setDateTouched] = useState(false);

  let details = useOutletContext() as ReferralContext;

  let withdrawals = useMemo(() => {
    return Array.isArray(details.dashboard.withdrawalRequest)
      ? details.dashboard.withdrawalRequest
      : [];
  }, [details]);

  const dateCompare = (date1: string, date2: string) => {
    let left = new Date(date1).toLocaleDateString();
    let right = new Date(date2).toLocaleDateString();
    return left === right;
  };

  const isWithin = (start: string, end: string, val: string) => {
    let _start = new Date(start).getTime();
    let _end = new Date(end).getTime();

    let _val = new Date(val).getTime();

    return _start <= _val && val <= end;
  };

  let filtered = useMemo(() => {
    return details
      ? withdrawals.filter((m, i) => {
          let name = true;
          if (user) {
            name =
              user?.email?.includes(filters?.name?.toLowerCase()) ||
              user?.name?.includes(filters?.name?.toLowerCase());
          }

          // let amount = m.amount.toString().includes(filters.amount);
          let [start, end] = filters.date.split('*');
          let date = filters.date ? isWithin(start, end, m.requestedOn as string) : true;

          return date && name;
        })
      : [];
  }, [withdrawals, filters, details]);

  const currentList = useMemo(() => {
    let start = currentPage * maxItems;
    return filtered.slice(start, start + maxItems);
  }, [filtered, currentPage]);

  let pages = useMemo(() => {
    return Math.ceil(filtered.length / maxItems);
  }, [filtered]);

  const onFilterChange = (key: keyof typeof filters) => (e: string) => {
    let filterCopy = { ...filters };
    filterCopy[key] = e;
    setFilters(filterCopy);
  };

  const nav = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      currentPage == pages - 1 ? null : setCurrentPage(currentPage + 1);
    }
    if (direction === 'prev') {
      currentPage == 0 ? null : setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  return (
    <div className="">
      <SuperModal classes="!bg-projectBg items-center flex flex-col " closer={() => {}}>
        <div className="w-full h-full flex overflow-y-auto  flex-col pt-16 px-10 items-center ">
          <div className=" max-w-[1280px] w-full  self-center ">
            <div
              className="items-center flex w-full hover:cursor-pointer"
              onClick={() => {
                navigate(-1);
              }}>
              <TbChevronLeft size={20} />
              <span className="ml-2 text-sm">Back</span>
            </div>
            <p className=" text-xl mt-4 font-bold">Cash Withdrawal</p>

            <div className="flex items-center justify-between">
              <div className=" border-ashShade-4 py-1  px-4 rounded-md border bg-projectBg flex items-center mt-10">
                <TbSearch />
                <input
                  onChange={(e) => onFilterChange('name')(e.target.value)}
                  className="ml-2 p-2 outline-none bg-projectBg"
                  placeholder="Search Table"
                />
              </div>

              <span
                onClick={() => {
                  setFilters({ name: '', date: '' });
                }}
                className="py-2 hover:cursor-pointer px-8 border text-bash border-ashShade-4 rounded-md">
                Clear Filter
              </span>
            </div>

            <div className="mt-10 flex rounded-md gap-x-8 items-center bg-white p-5 ">
              <div
                className="w-1/2"
                onClick={() => {
                  setDateTouched(true);
                }}>
                {/* <SelectDate
                  minDate={new Date(1970, 2, 1)}
                  label="Date invited"
                  placeholder="Select date"
                  // value={new Date(filters.date)}
                  onChange={(date) => {
                    if (dateTouched) onFilterChange('date')(new Date(date).toISOString());
                  }}
                /> */}

                <SelectDateRange
                  label="Date"
                  // value={filters.date}
                  placeholder="Select date range"
                  onChange={(range, userAction) => {
                    if (dateTouched)
                      onFilterChange('date')(
                        `${new Date(range?.from || '').toISOString()}*${new Date(
                          range?.to || ''
                        ).toISOString()}`
                      );
                  }}
                />
              </div>

              {/* <InputField
                className="flex-1"
                type="number"
                label="Amount"
                onChange={(e) => onFilterChange('amount')(e.target.value)}
              /> */}
            </div>

            <div className="w-full mt-9 bg-white rounded-md">
              <table className="w-full rounded-md">
                <thead className="">
                  <tr className="w-full ">
                    {withdrawalTableHeaders.map((m, i) => (
                      <th
                        className={`${
                          i !== 0 ? 'text-start' : 'text-center'
                        }  py-4 border-b border-b-ashShade-4 `}>
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {currentList.map((m, i) => (
                    <TableItem
                      sn={(i + 1).toString()}
                      email={user.email}
                      amount={m.amount.toString()}
                      name={user.name}
                      dateRequested={new Date(m.requestedOn).toDateString().slice(4)}
                      dateCompleted={
                        m.completedOn ? new Date(m.completedOn).toDateString().slice(4) : ''
                      }
                    />
                  ))}
                </tbody>
              </table>
              <div className="w-full flex items-center justify-center ">
                {withdrawals.length < 1 && (
                  <p className="text-center p-2">No withdrawals have been made</p>
                )}
                {withdrawals.length > 0 && filtered.length < 1 && (
                  <p className="text-center p-2">No items match your search Criteria</p>
                )}
              </div>
            </div>
            {pages > 1 && (
              <div>
                <div className="flex mt-20 mb-10 justify-between items-center">
                  <div
                    onClick={() => nav('prev')}
                    className="flex   hover:underline items-center cursor-pointer">
                    <BsChevronLeft size={10} />
                    <span className="text-sm ml-2 font-bold">Previous</span>
                  </div>
                  {
                    <div>
                      {Array(pages)
                        .fill('')
                        .map((j, m) => (
                          <span
                            key={m}
                            onClick={() => {
                              setCurrentPage(m);
                            }}
                            className={`py-1 px-2 ${
                              currentPage === m ? 'bg-bblue text-white' : ''
                            } hover:bg-lightblue cursor-pointer rounded-md`}>
                            {m + 1}
                          </span>
                        ))}
                    </div>
                  }
                  <div
                    onClick={() => nav('next')}
                    className="flex hover:underline items-center cursor-pointer">
                    <span className="text-sm mr-2 font-bold">Next</span>
                    <BsChevronRight size={10} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SuperModal>
    </div>
  );
};

const sampleItem = {
  sn: '1',
  email: 't@m.com',
  amount: '12000',
  name: 'Tim Olu',
  dateCompleted: '15 January 2024',
  dateRequested: '16 January 2024'
};

const TableItem = ({
  sn,
  email,
  amount,
  name,
  dateCompleted,
  dateRequested
}: {
  amount: string;
  dateRequested: string;
  name: string;
  email: string;
  dateCompleted: string;
  sn: string;
}) => {
  let arr = [sn, name, email, amount, dateRequested, dateCompleted];
  return (
    <tr className="w-full  pb-4 bprder-b border-b-ashShade-4">
      {arr.map((m, i) => (
        <td
          className={`${
            i !== 0 ? 'text-start' : 'text-center'
          }  py-4 border-b border-b-ashShade-4 `}>
          {m}
        </td>
      ))}
    </tr>
  );
};

export default Index;
