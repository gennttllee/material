import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi';
import { actions, names2, permissions, roles } from './constants';
import RoleType from './RoleType';
import Names from './Names';
import Permissions from './Permissions';
import SuperModal from 'components/shared/SuperModal';
import Action from './Action';
import Button from 'components/shared/Button/Button';
import InputField from 'components/shared/InputField/InputField';

const Roles = () => {
  let navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [permission, setPermission] = useState(false);
  return (
    <div className="w-full flex flex-col flex-1 ">
      {modal && (
        <SuperModal
          closer={() => setModal(false)}
          classes="bg-black bg-opacity-80 flex justify-center"
        >
          <span
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" bg-white h-fit mt-[10%] rounded-lg w-full max-w-[484px] p-6"
          >
            {!permission ? (
              <>
                <p className="text-bash text-xs mb-1 font-Medium">Step 1/2</p>
                <div className="flex mb-6 hover:cursor-pointer items-center justify-between">
                  <span className="font-semibold">Create role</span>
                  <span
                    onClick={() => setModal(false)}
                    className="hover:underline text-bash text-sm"
                  >
                    Close
                  </span>
                </div>
                <InputField label="Name" placeholder="E.g John Doe" />

                <div className="flex mt-4 items-center justify-end">
                  <span
                    onClick={() => setPermission(true)}
                    className=" text-borange hover:underline font-Medium hover:cursor-pointer"
                  >
                    + Add permissions
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="text-bash text-xs mb-1">Step 1/2</p>
                <div className="flex mb-1 hover:cursor-pointer items-center justify-between pt-1">
                  <span className="font-Medium text-sm">Permissions</span>
                  <span
                    onClick={() => setPermission(false)}
                    className="hover:underline text-bash text-sm"
                  >
                    Close
                  </span>
                </div>
                <p className="font-bold text-2xl mb-1">Profile</p>
                <p className="text-bash text-sm">
                  The user(s) you assign this permission will be able to carry out the following
                  tasks:
                </p>

                <div className="my-6">
                  {actions.map((m, i) => (
                    <Action permission={m.permission} allowed={m.allowed} />
                  ))}
                </div>

                <div className="flex mt-4 items-center justify-end">
                  <span
                    onClick={() => setPermission(false)}
                    className=" hover:cursor-pointer px-8 py-2 border border-bblack-0 text-bblack-0 rounded-md"
                  >
                    Cancel
                  </span>
                  <span
                    onClick={() => setPermission(false)}
                    className=" hover:cursor-pointer px-8 py-2 border border-bblue bg-bblue ml-4 text-white rounded-md"
                  >
                    Create role
                  </span>
                </div>
              </>
            )}
          </span>
        </SuperModal>
      )}

      <p
        onClick={() => navigate(-1)}
        className=" text-orangeShade-0 mb-7 flex items-center w-fit hover:underline cursor-pointer"
      >
        <HiOutlineChevronLeft size={16} className="mr-2" /> Profiles
      </p>
      <div className="w-full flex items-center justify-between">
        <span className="text-2xl font-Medium">Manage role</span>
        <Button text="Create role" onClick={() => setModal(true)} />
      </div>
      <div className=" flex flex-col flex-1">
        <div className="flex  items-start gap-x-5 mt-8 ">
          <div className="  bg-white p-4 rounded-md w-1/3">
            <p className="font-semibold mb-4">Default Roles</p>
            {roles.map((m) => (
              <RoleType title={m} />
            ))}
            <hr className="h-0.5 mb-6" />
            <p className="font-semibold mb-4">Custom Roles</p>
            {roles.slice(1).map((m) => (
              <RoleType title={m} isCustom />
            ))}
          </div>
          <div className="flex-1">
            <div className="  bg-white p-4 rounded-md">
              <div className="flex items-center">
                <p className="font-semibold mr-2">Contractors</p>
                <span className="w-6 h-6  flex items-center justify-center  bg-ashShade-4 rounded-full">
                  <span className=" text-xs text-Medium">50</span>
                </span>
              </div>

              <div className="flex items-center flex-wrap gap-2 mt-2">
                {names2.map((m, i) => (
                  <Names name={m} key={i} />
                ))}
              </div>
            </div>
            <div className="rounded-lg py-8 bg-white mt-5  flex-1">
              <div className="ml-6  mb-6 font-semibold">Contractors</div>
              <table className="w-full hover:cursor-pointer mb-6">
                <tr>
                  <td></td>
                  <td className="transform -translate-x-4">Can do</td>
                  <td className="transform -translate-x-4">Can't do</td>
                </tr>
                {permissions.map((m, i) => (
                  <Permissions permission={m.permission} allowed={m.allowed} />
                ))}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
