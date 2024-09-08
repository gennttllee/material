import React, { useState } from 'react';
import { userRoles } from './constants';
import TableRow from './TableRow';
import { useNavigate } from 'react-router-dom';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import SuperModal from 'components/shared/SuperModal';
import SelectBox from 'components/shared/SelectBox';
const Manage = () => {
  let navigate = useNavigate();
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [invite, setInvite] = useState(false);
  const [role, setRole] = useState('');
  const nav = (type: string) => {
    if (type === 'next' && currentPage + 1 <= pages - 1) {
      setCurrentPage((current) => currentPage + 1);
    }
    if (type === 'prev' && currentPage - 1 >= 0) {
      setCurrentPage((current) => currentPage - 1);
    }
  };

  return (
    <div className="w-full">
      {invite && (
        <SuperModal
          closer={() => setInvite(false)}
          classes="bg-black bg-opacity-80 flex justify-center"
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" bg-white h-fit mt-[10%] rounded-lg w-full max-w-[484px] p-4"
          >
            <div className="flex mb-6 hover:cursor-pointer items-center justify-between">
              <span className="font-Medium">Invite Members</span>
              <span onClick={() => setInvite(false)} className="hover:underline text-bash text-sm">
                Close
              </span>
            </div>
            <p>Email Address</p>
            <input
              className="w-full mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2
             "
              type="text"
              placeholder="Enter email address"
            />
            <p className="mb-2">Role</p>
            <SelectBox
              options={[
                { label: 'Consultant', value: 'consultant' },
                { label: 'Contractor', value: 'contractor' }
              ]}
              state={role}
              setter={setRole}
              placeholder="Select role"
            />
            <div className="flex mt-4 items-center justify-end">
              <span
                onClick={() => setInvite(false)}
                className=" hover:cursor-pointer px-8 py-2 border border-bblack-0 text-bblack-0 rounded-md"
              >
                Cancel
              </span>
              <span
                onClick={() => setInvite(true)}
                className=" hover:cursor-pointer px-8 py-2 border border-bblue bg-bblue ml-4 text-white rounded-md"
              >
                Send Invite
              </span>
            </div>
          </span>
        </SuperModal>
      )}
      <div className="flex items-center justify-between">
        <span className=" text-black text-2xl font-Medium">Profiles</span>
        <div className="flex items-center">
          <span
            onClick={() => navigate('/projects/account/manage/roles')}
            className=" font-Medium hover:cursor-pointer px-8 py-2 border border-bblack-0 text-bblack-0 rounded-md"
          >
            Manage role
          </span>
          <span
            onClick={() => setInvite(true)}
            className=" font-Medium hover:cursor-pointer px-8 py-2 border border-bblue bg-bblue ml-4 text-white rounded-md"
          >
            Invite person
          </span>
        </div>
      </div>
      <div className="mt-8 bg-white rounded-md ">
        <table className="w-full rounded-t-md overflow-x-auto">
          <tr className="w-full  rounded-t-md">
            <th className=" text-left px-9 py-4 bg-ashShade-3 rounded-tl-md ">Name</th>
            <th className=" text-left bg-ashShade-3">Email Address</th>
            <th className=" text-left bg-ashShade-3 rounded-tr-md">Role</th>
          </tr>
          {userRoles.map((m, i) => (
            <TableRow
              isLast={i === userRoles.length - 1}
              name={m.name}
              email={m.email}
              role={m.role}
            />
          ))}
        </table>

        <div className="w-full h-40 mb-4 p-4 rounded-b-lg bg-white">
          {' '}
          <div className="flex mt-20 justify-between items-center">
            <div
              onClick={() => nav('prev')}
              className="flex   hover:underline items-center cursor-pointer"
            >
              <BsChevronLeft color="#C8CDD4" size={8} />
              <span className="text-sm ml-2 font-Medium">Previous</span>
            </div>
            {
              <div>
                {Array.from({ length: pages }).map((_, m) => (
                  <span
                    onClick={() => {
                      setCurrentPage(m);
                    }}
                    className={`py-1 px-2 ${
                      currentPage === m ? 'bg-bblue text-white' : ''
                    } hover:bg-lightblue cursor-pointer rounded-md`}
                  >
                    {m + 1}
                  </span>
                ))}
              </div>
            }
            <div
              onClick={() => nav('next')}
              className="flex hover:underline items-center cursor-pointer"
            >
              <span className="text-sm mr-2 font-Medium">Next</span>
              <BsChevronRight color="#C8CDD4" size={8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;
