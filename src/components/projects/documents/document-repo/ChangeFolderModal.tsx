import React, { useEffect, useMemo, useState } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { convertToProper, editFile } from 'components/shared/utils';
import { Doc } from '../drawings/DocModal';
import { removeemptyFields } from 'pages/projectform/utils';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import { changeFieldValue, updateFile } from 'store/slices/folderSlice';
import { groupFiles } from '.';
import { LoaderX } from 'components/shared/Loader';
import ConfirmationModal from './ConfirmationModal';
import { IoMdClose } from 'react-icons/io';
import { LatestDoc } from './SingleDocModal';
import { FileFolder } from '../types';
import { postForm } from 'apis/postForm';
import { moveFileToFolder } from './useFiles';
import { useRouteError } from 'react-router-dom';
import useRole, { UserRoles } from 'Hooks/useRole';
import { UserComponent } from './UserComponent';

interface ChangeFolderModalProps {
  toggler: () => void;
  renaming: boolean;
  doc: LatestDoc;
}

function ChangeFolderModal({ toggler, renaming, doc }: ChangeFolderModalProps) {
  let folder = useAppSelector((m) => m.folder);
  let team = useAppSelector((m) => m.team);
  let dispatch = useAppDispatch();
  let [selected, setSelected] = React.useState<string>(
    typeof doc.folder === 'string' ? doc.folder : doc?.folder?.name || ''
  );
  let user = useAppSelector((m) => m.user);
  let { isOfType } = useRole();
  let inputRef = React.useRef<HTMLInputElement>(null);
  let [value, setValue] = React.useState<string>(renaming ? doc?.alias || '' : '');
  let [loading, setLoading] = React.useState(false);
  let [showConfirmationPromopt, setShowConfirmationPrompt] = React.useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  let _folders = React.useMemo(() => {
    return Object.keys(folder?.folder || {});
  }, [folder.files]);
  let { data, loading: projectLoading } = useAppSelector((m) => m.team);
  let Members = useMemo(() => {
    if (!loading) {
      return Object.values(data) || [];
    }
    return [];
  }, [data, projectLoading]);

  let folderList = React.useMemo(() => {
    const canSeeFolder = folder.fileFolders.filter((m) => {
      let isManager = isOfType(UserRoles.PortfolioManager);

      let access = m.access.find((m) => m.userId === user._id);

      return access && m?._id !== doc?.folderId;
    });
    return canSeeFolder;
  }, [folder]);

  let errors = React.useMemo(() => {
    if (renaming && value.length < 1) {
      return 'Please enter a filename';
    }
    if (!renaming && selected === 'other_' && value.length < 1) {
      return 'please enter a folder name';
    } else if (!renaming && selected !== 'other_' && selected?.length && selected?.length < 1) {
      return 'please select a folder';
    }
    return undefined;
  }, [value, selected]);

  const handleFileMove = async (fileId: string = '', folderId: string = '') => {
    let { response, e } = await moveFileToFolder(fileId, folderId);

    if (response) {
      dispatch(updateFile(response.data.data));
    }

    return { response, e };
  };
  const handleSubmit = async () => {
    setLoading(true);
    if (!errors) {
      let body = {
        alias: renaming ? value : undefined,
        folder: !renaming ? (selected !== 'other_' ? selected : value) : undefined
      };
      let _folder = selected !== 'other_' ? selected : value;
      let { response, e } = renaming
        ? await editFile(doc._id || '', removeemptyFields(body))
        : await handleFileMove(doc?._id, selected);

      if (e) {
        displayInfo(renaming ? 'Could not rename File ' : ' Could not change File folder');
      } else {
        if (renaming) {
          let newFiles = folder.files.map((m) => {
            if (m._id === doc._id) {
              let newFile = { ...m };
              if (renaming) newFile.alias = value;
              if (!renaming) newFile.folder = selected === 'other_' ? value : selected;
              return newFile;
            } else {
              return m;
            }
          });

          dispatch(
            changeFieldValue({
              files: newFiles,
              folder: groupFiles(newFiles, true)
            })
          );
        } else {
          dispatch(updateFile(response.data.data));
        }

        setSelected('');
        setValue('');
        displaySuccess(
          renaming ? 'File Renamed successfully' : `File Moved to ${_folder} Successfully`
        );

        toggler();
      }
    }
    setLoading(false);
  };

  const checkIfisOnlyFile = () => {
    let fileCount = 0;
    let files = folder.files.map((m) => {
      if (m.folder === doc.folder || m.folderId === doc.folderId) fileCount++;
    });
    const hasFolders = folder.fileFolders.find((m) => m?.parentFolder === doc.folderId);
    return fileCount < 2 && !hasFolders;
  };

  let isDifferentAccess = useMemo(() => {
    let destination = folder.fileFolders.find((m) => m._id === selected);
    let destinationAccess = destination?.access;
    let destinationAccessIds = destinationAccess?.map((m) => m.userId);
    let currentAccess = doc?.access?.map((m) => m.userId);

    let usersWithNoAccessInDestinationFolder =
      doc?.access?.filter(
        (m) => !destinationAccessIds?.includes(m.userId) && destination?.createdBy !== m.userId
      ) || [];

    let _Members =
      usersWithNoAccessInDestinationFolder?.map((m) => {
        return Members?.find((k) => k?._id === m?.userId);
      }) || [];

    return {
      usersWithNoAccessInDestinationFolder,
      canAddNewAccess: destination?.createdBy === user?._id,
      members: _Members
    };
  }, [selected, Members]);


  const giveOddUsersAccesstoFolder = async () => {
    let access = oddUsers.map((m) => ({
      userId: m._id,
      role: m.prole
    }));

    let data: Record<string, any> = {
      folderId: selected,
      access
    };

    if (access.length > 0) {
      //remove Unselected users from file

      let _oddUsers = access.map((m) => m.userId);

      let unselected = isDifferentAccess.usersWithNoAccessInDestinationFolder
        .filter((m) => {
          return m && !_oddUsers.includes(m.userId);
        })
        .map((m) =>
          postForm(
            'patch',
            `files/remove-access`,
            removeemptyFields({
              fileId: doc._id,
              userId: m.userId
            })
          )
        );

      await Promise.all(unselected);

      //add new access to destination folder

      let { response, e } = await postForm(
        'patch',
        `files${'/folder'}/add-access`,
        removeemptyFields(data)
      );

      if (response) {
        let { response: _response, e: _e } = await handleFileMove(doc._id, selected);
        if (_e) {
          displayError(('Could not Move File to new Folder. ' + _e?.message) as string);
        }
      } else {
        displayError('Could not modify file access before moving File to new Folder. ');
      }
    }
  };

  const stripOddUsersAccess = async () => {
    let access = isDifferentAccess.usersWithNoAccessInDestinationFolder.map((m) => ({
      userId: m.userId,
      role: m.role
    }));

    let data: Record<string, any> = {
      folderId: selected,
      access
    };

    let calls = isDifferentAccess.usersWithNoAccessInDestinationFolder.map((m) =>
      postForm(
        'patch',
        `files/remove-access`,
        removeemptyFields({
          fileId: doc._id,
          userId: m.userId
        })
      )
    );

    let responses = await Promise.all(calls);
    let removed = responses.find((m) => m.response);
    if (removed) {
      let { response: _response, e: _e } = await handleFileMove(doc._id, selected);
      if (!_response) {
        displayError(('Could not Move File to new Folder. ' + _e?.message) as string);
      }
    } else {
      displayError('Could not modify file access before moving File to new Folder. ');
    }
  };

  const [oddUsers, setOddUsers] = useState<Record<string, string>[]>([]);

  const removeUser = (id: string) => {
    setOddUsers([...oddUsers].filter((m) => m._id !== id));
  };

  useEffect(() => {
    setOddUsers(isDifferentAccess.members.filter((m) => m) as Record<string, string>[]);
  }, [isDifferentAccess.members, showConfirmationPromopt]);

  return (
    <SuperModal
      classes=" bg-opacity-50 bg-black overflow-y-auto flex justify-center"
      closer={() => toggler()}>
      {!showConfirmationPromopt ? (
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-white rounded-md m-auto p-6 text-bash  font-medium w-4/5 sm:w-3/5 lg:w-[33%] 2xl:w-[400px] ">
          <div className="flex items-center justify-between">
            <span className="text-2xl text-black font-semibold">
              {renaming ? 'Rename File' : 'Select Folder'}
            </span>
            <span
              onClick={() => toggler()}
              className="text-sm hover:cursor-pointer hover:underline ">
              Close
            </span>
          </div>
          {renaming ? (
            <div className="my-2">
              <p className="pb-2 text-bblack-0">Filename</p>
              <div className="flex flex-1 focus:border-bblue focus:border  items-center justify-between">
                <input
                  onChange={(e) => setValue(e.target.value)}
                  disabled={loading}
                  ref={inputRef}
                  defaultValue={doc.alias}
                  type="text"
                  className=" p-2 w-full rounded-md border-bash border outline-none"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-y-4 mt-4">
              {folderList.map((m) => (
                <Folder
                  name={m.name}
                  selected={selected === m._id}
                  onClick={() => setSelected(m._id)}
                />
              ))}
              {/* <span className=" flex items-center">
                <NewFolder
                  name={''}
                  inputRef={inputRef}
                  onFocus={() => setSelected('other_')}
                  onChange={(e) => setValue(e.target.value)}
                  onClick={() => {
                    setSelected('other_');
                    setValue('');
                  }}
                  selected={selected === 'other_'}
                />
              </span> */}
            </div>
          )}
          {errors && buttonClicked && <p className="text-red-400 text-xs">{errors}</p>}

          <div className="flex items-center w-full  gap-x-4 mt-7">
            <button
              onClick={() => toggler()}
              className="rounded-md border flex-1 border-ashShade-1 py-2 px-8 ">
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={async () => {
                setButtonClicked(true);
                let { canAddNewAccess: canAdd, usersWithNoAccessInDestinationFolder: oddUsers } =
                  isDifferentAccess;
                oddUsers?.length === 0||renaming ? await handleSubmit() : setShowConfirmationPrompt(true);
              }}
              className={`rounded-md border  lg:whitespace-nowrap flex-1 border-ashShade-1 ${
                errors ? 'bg-ashShade-4' : ' bg-bblue text-white'
              }  py-2 px-8 flex items-center justify-center`}>
              {loading ? <LoaderX /> : renaming ? 'Rename' : 'Move to Folder'}
            </button>
          </div>
        </div>
      ) : (
        <ConfirmationModal
          onCancel={async () => {
            if (isDifferentAccess.canAddNewAccess) await stripOddUsersAccess();
            toggler();
          }}
          onProceed={async () => {
            isDifferentAccess.canAddNewAccess
              ? await giveOddUsersAccesstoFolder()
              : await stripOddUsersAccess();
            // await handleSubmit();
            toggler();
          }}
          className=" rounded-md p-5 flex flex-col items-center bg-white w-auto h-auto m-auto  "
          text=""
          removeImage
          cancleButtonText={
            isDifferentAccess.canAddNewAccess ? "Don't Grant Access and Proceed" : 'Cancel'
          }
          buttonText={
            isDifferentAccess.canAddNewAccess
              ? 'Grant Access And Proceed'
              : 'Strip Access and Proceed'
          }
          Element={
            <div className="w-full">
              <div className=" flex w-full justify-between">
                <p className=" -mt-4 text-xl font-semibold ">
                  Move {doc?.alias} to {folder.fileFolders.find((m) => m._id === selected)?.name}{' '}
                  Folder
                </p>

                <span onClick={() => setShowConfirmationPrompt(false)} className="  ">
                  Close
                </span>
              </div>

              <p>
                {isDifferentAccess.canAddNewAccess
                  ? 'Do you want to give the following users access in destination folder? '
                  : ' The Followinng users will their access to this file removed'}
              </p>
              <div className=" mt-4 flex flex-col gap-y-4 max-h-[40vh] overflow-y-auto ">
                {oddUsers.map((k) => (
                  <UserComponent
                    showDelete
                    onDelete={() => {
                      removeUser(k?._id);
                    }}
                    email={k?.email}
                    name={k?.name}
                    url={k?.logo}
                  />
                ))}
              </div>
            </div>
          }
        />
      )}
    </SuperModal>
  );
}

interface FolderProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}
const Folder = ({ name, selected, onClick }: FolderProps) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center w-full gap-x-2 hover:underline hover:cursor-pointer">
      <span
        className={`rounded-full border flex items-center justify-center  h-4 w-4 ${
          selected ? ' border-bblue ' : 'border-ashShade-1'
        }`}>
        {!!selected && <span className="w-2 h-2 bg-bblue rounded-full"></span>}
      </span>
      <span className=" font-semibold text-bblack-0 ">{name}</span>
    </div>
  );
};

const NewFolder = ({
  name,
  selected,
  onClick,
  loading,
  onChange,
  onFocus,
  inputRef
}: FolderProps & {
  loading?: boolean;
  inputRef: any;
  onFocus: () => void;
  onChange: (e: any) => void;
}) => {
  const [entering, setEntering] = useState(false);
  const [focus, setFocus] = useState(false);
  return (
    <div onClick={onClick} className="flex items-center w-full gap-x-2  hover:cursor-pointer">
      {entering ? (
        <div className="flex items-center flex-1 ">
          <span
            className={`rounded-full border flex items-center justify-center  h-4 w-4 ${
              selected ? ' border-bblue ' : 'border-ashShade-1'
            }`}>
            {!!selected && <span className="w-2 h-2 bg-bblue rounded-full"></span>}
          </span>
          <span className=" font-semibold text-bblack-0 ">{name}</span>
          <div className="flex-1 ml-2 p-2 rounded-md flex border border-bblue  items-center justify-between">
            <input
              autoFocus
              disabled={loading}
              onChange={onChange}
              onFocus={onFocus}
              ref={inputRef}
              type="text"
              className="    text-black rounded-md   outline-none"
            />

            <span
              onClick={(e) => {
                setEntering(false);
                // onChange(e);
              }}
              className="mr-2 p-1 hover:bg-ashShade-0 rounded-full self-end ">
              <IoMdClose size={20} className="text-bash" />
            </span>
          </div>
        </div>
      ) : (
        <span onClick={() => setEntering((_) => !_)} className=" text-bash">
          + New Folder
        </span>
      )}
    </div>
  );
};

export default ChangeFolderModal;
