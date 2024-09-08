import { LoaderX } from 'components/shared/Loader';
import React, { useEffect, useMemo, useState } from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import CompanyNameEdit from '../Persona/CompanyNameEdit';
import useRole, { UserRoles } from 'Hooks/useRole';
import UserRowItem from './UserRowItem';
import { Persona, User } from 'types';

interface UserTableProps {
  loading?: boolean;
  headers: string[];
  data: (Persona | User)[];
  showSelector?: boolean;
  setModal?: (x: boolean) => any;
  setViewing?: (id: string, type: 'consultant' | 'contractor') => void;
  type?: 'professionals' | 'developers' | 'projectManagers';
}

const ITEMS_PER_PAGE = 10;
const UserTable = ({
  loading,
  headers,
  data,
  showSelector,
  setModal,
  setViewing,
  type
}: UserTableProps) => {
  const [companyNameDetails, setCompanyNameDetails] = useState<{
    userId: string;
    defaultValue?: string;
    uniqueClassName: string;
  }>({
    userId: '',
    defaultValue: undefined,
    uniqueClassName: ''
  });
  const showNew = (type: 'contractor' | 'consultant', id: string) => {
    if (setModal && setViewing) {
      setModal(true);
      setViewing(id, type);
    }
  };
  const _type = useMemo(() => {
    return type ? type : 'professionals';
  }, []);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    setPages(Math.ceil((data?.length || 0) / ITEMS_PER_PAGE));
  }, [data]);
  let { role } = useRole();
  const [currentPage, setCurrentPage] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const nav = (type: string) => {
    if (type === 'next' && currentPage + 1 <= pages - 1) {
      setCurrentPage((current) => current + 1);
    }
    if (type === 'prev' && currentPage - 1 >= 0) {
      setCurrentPage((current) => current - 1);
    }
  };
  const list = useMemo(() => {
    return data.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);
  }, [data, currentPage]);

  const [_modal, _setModal] = useState(false);

  const setCompanyModal = (userId: string, defaultValue: string) => {
    setCompanyNameDetails({ ...companyNameDetails, userId, defaultValue });
    setShowEditModal(true);
  };
  const onDoneEditing = () => {
    setCompanyNameDetails({ userId: '', defaultValue: undefined, uniqueClassName: '' });
    setShowEditModal(false);
  };

  return (
    <>
      {showEditModal && (
        <CompanyNameEdit
          {...companyNameDetails}
          showImmediately={true}
          onDoneEditing={onDoneEditing}
        />
      )}
      <div className="w-full mt-2.5 overflow-x-auto ">
        {loading ? (
          <div className="w-full flex justify-center items-center bg-white p-5">
            <LoaderX color="blue" />
          </div>
        ) : data.length > 0 ? (
          <table className="w-full mt-4 md:mt-9 overflow-x-auto rounded-lg">
            <tr className="w-full py-2  font-semibold bg-pbg rounded-t-lg ">
              {headers.map((m, i) => {
                if (m === 'Company Name' && role === UserRoles.Developer) return null;
                return (
                  <th
                    key={i}
                    className={`py-4 ${i === 3 ? 'px-2' : ''} ${
                      i === 0
                        ? 'rounded-tl-lg '
                        : i === headers.length - 1
                          ? 'rounded-tr-lg text-left'
                          : 'text-left'
                    } ${i === 5 ? ' w-auto' : ''}`}>
                    {m}
                  </th>
                );
              })}
            </tr>
            {data.length > 0
              ? list.map((m) => (
                  <UserRowItem
                    type={_type}
                    showSelector={showSelector}
                    displayFn={showNew}
                    key={m._id}
                    contractor={m}
                    showEditModal={() => setCompanyModal(m._id, m.companyName || '')}
                  />
                ))
              : null}
          </table>
        ) : (
          <p className="w-full bg-white text-center text-black">
            No results found for your search criteria
          </p>
        )}
        <div className="w-full h-40 mb-4 p-4 rounded-b-lg bg-white">
          {' '}
          <div className="flex mt-20 justify-between items-center">
            <div
              onClick={() => nav('prev')}
              className="flex   hover:underline items-center cursor-pointer">
              <BsChevronLeft color="#C8CDD4" size={8} />
              <span className="text-sm ml-2">Previous</span>
            </div>
            {!loading && data.length > 0 ? (
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
            ) : null}
            <div
              onClick={() => nav('next')}
              className="flex hover:underline items-center cursor-pointer">
              <span className="text-sm mr-2">Next</span>
              <BsChevronRight color="#C8CDD4" size={8} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserTable;
