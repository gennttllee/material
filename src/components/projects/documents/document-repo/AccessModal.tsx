// import { FetchImage } from 'components/shared/FetchImage';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import Button from 'components/shared/Button';
import { FetchImage } from 'components/shared/FetchImage';
import InputField from 'components/shared/InputField';
import SuperModal from 'components/shared/SuperModal';
import { Option } from 'pages/projects/Clusters/BuildingTypes';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TbCheck, TbChevronDown, TbChevronLeft, TbChevronRight, TbLock } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { prototypeImage } from 'types';
import { UserComponent } from './UserComponent';
import Team from 'components/projects/Team';
import { postForm } from 'apis/postForm';
import useFiles from './useFiles';
import { StoreContext } from 'context';
import { displayError } from 'Utils';
import { LoaderX } from 'components/shared/Loader';
import { Access, FileFolder } from '../types';
import { LatestDoc, NewDoc } from './SingleDocModal';
import { addFileFolders, updateFile, updateFolder } from 'store/slices/folderSlice';
import { removeemptyFields } from 'pages/projectform/utils';
import AccessComponent from './AccessComponent';

interface Props {
  closer: () => void;
  id?: string;
  type?: 'file' | 'folder';

  //   images: prototypeImage[];
  //   active: number;
}

const subs: { [key: string | _Access['status']]: string } = {
  'Restrict access': 'No one can access this folder',
  'Allow access': 'Everyone can access this folder'
};

type _Access = {
  status: 'Restrict access' | 'Allow access';
  access?: 'Editor' | 'Viewer';
};

const AccessModal = ({ closer, id, type }: Props) => {
  let { data, loading } = useAppSelector((m) => m.team);
  let { fileFolders, files } = useAppSelector((m) => m.folder);
  let { activeProject } = useContext(StoreContext);
  let user = useAppSelector((m) => m.user);
  const [changingAccess, setChangingAccess] = useState(false);
  let dispatch = useAppDispatch();
  let Members = useMemo(() => {
    if (!loading) {
      return Object.values(data) || [];
    }
    return [];
  }, [data, loading]);

  const [access, setAccess] = useState<_Access>({
    status: 'Restrict access',
    access: 'Viewer'
  });
  const [showAccess, setShowAccess] = useState(false);
  const [showTypeOption, setShowTypeOption] = useState(false);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  let { getFiles } = useFiles(true);

  const accessRef = useRef<any>();
  const typeRef = useRef<any>();
  useClickOutSideComponent(accessRef, () => {
    setShowAccess(false);
  });
  useClickOutSideComponent(typeRef, () => {
    setShowTypeOption(false);
  });

  let teamRef = useRef<any>();
  useClickOutSideComponent(teamRef, () => {
    setFocused(false);
  });

  const current = useMemo(() => {
    if (type === 'folder') {
      return fileFolders.find((m) => m._id === id) as FileFolder & LatestDoc;
    } else {
      return files.find((m) => m._id === id) as FileFolder & LatestDoc;
    }
  }, [fileFolders]);

  const includableTeamMembers = useMemo(() => {
    let team = activeProject?.team;
    if (current?.folderId) {
      let _access = fileFolders
        .find((m) => m._id === current?.folderId)
        ?.access.map((m) => m.userId);

      if (_access) {
        team = team?.filter((m) => _access?.includes(m.id));
      }
    } else {
      if (current?.parentFolder) {
        let _access = fileFolders
          .find((m) => m._id === current.parentFolder)
          ?.access.map((m) => m.userId);

        if (_access) {
          team = team?.filter((m) => _access?.includes(m.id));
        }
      }
    }

    return team;
  }, [Members, current, activeProject]);

  const viewers = useMemo(() => {
    let _accessors =
      type === 'folder'
        ? fileFolders.find((m) => m._id === id)?.access || []
        : files.find((m) => m._id === id)?.access || [];

    let _viewers: Record<string, any>[] = [];

    _accessors.forEach((m) => {
      let mem = Members.find((k) => k?._id === m?.userId);
      if (mem) {
        _viewers.push(mem);
      }
    });

    let _current = current as FileFolder;
    const isOwnerIncluded = _viewers.find((m) => m?._id === _current?.createdBy);
    if (!isOwnerIncluded) {
      let owner = Members?.find((m) => m?._id === user?._id || m?._id === _current?.createdBy);
      if (owner) {
        _viewers.unshift(owner);
      }
    }
    let _accessorsIds = _accessors.map((m) => m.userId);
    const _contextualMembers = includableTeamMembers.map((m) => m.id);
    const _Members = includableTeamMembers.map((m) =>
      Members.find((k) => m?.id === k?._id)
    ) as Record<string, any>[];
    let _viewerIds = _viewers.map((m) => m?._id);
    let unAddedMembers = Members?.filter(
      (m) =>
        m?.role.toLowerCase() !== 'general' &&
        !_viewerIds?.includes(m?._id) &&
        _contextualMembers.includes(m?._id)
    );

    return {
      _accessors,
      _viewers,
      unAddedMembers,
      _accessorsIds,
      _Members
    };
  }, [Members, fileFolders, files, includableTeamMembers]);

  const addAccess = async (userId: string = '', folderId: string = '') => {
    setChangingAccess(true);
    let _user = Members.find((m) => m?._id === userId);
    let { response, e } = await postForm(
      'patch',
      `files${type == 'folder' ? '/folder' : ''}/add-access`,
      removeemptyFields({
        folderId: type === 'folder' ? folderId : undefined,
        access: [{ userId, role: _user?.role }],
        fileId: type === 'file' ? folderId : undefined
      })
    );

    if (response) {
      setValue('');
      dispatch(
        type === 'folder' ? updateFolder(response.data.data) : updateFile(response.data.data)
      );
    } else {
      console.log(e);
      displayError('Could not Add access');
    }

    setChangingAccess(false);
  };

  let currentViewers = useMemo(() => {
    let _current = current as FileFolder;
    let owner = Members.find((m) => m?._id === user._id || m?._id === _current?.createdBy);

    return {
      owner
    };
  }, [Members, current]);

  const handleGeneralAcess = async () => {
    setChangingAccess(true);

    let list: (FileFolder | LatestDoc)[] = type === 'file' ? files : fileFolders;
    let _members =
      list.find((m: any) => m._id === id)?.access?.filter((m: Access) => m.userId !== user._id) ||
      [];

    let membersWithAccess = _members.map((m: Access) => m.userId);
    let _current = current as FileFolder;
    if (access.status !== 'Allow access') {
      let unaddedMembers = includableTeamMembers.filter((m) => !membersWithAccess.includes(m.id));
      let access = unaddedMembers
        .filter((m) => m.id !== _current?.createdBy)
        .map((m) => ({ userId: m.id, role: m.role }));

      let data: Record<string, any> = {
        folderId: type === 'file' ? undefined : id,
        fileId: type === 'file' ? id : undefined,
        access
      };

      if (access.length > 0) {
        let { response, e } = await postForm(
          'patch',
          `files${type === 'file' ? '' : '/folder'}/add-access`,
          removeemptyFields(data)
        );

        if (response) {
          getFiles();
        } else {
          displayError('could not modify access');
        }
      }
    } else {
      let calls = membersWithAccess
        .filter((m: string) => ![user._id, current?.createdBy].includes(m))
        .map((m: string) =>
          postForm(
            'patch',
            `files${type === 'file' ? '' : '/folder'}/remove-access`,
            removeemptyFields({
              folderId: type === 'file' ? undefined : id,
              fileId: type === 'file' ? id : undefined,
              userId: m
            })
          )
        );

      let responses = await Promise.all(calls);

      let removed = responses.find((m) => m.response);

      if (removed) {
        getFiles();
      }
    }

    setChangingAccess(false);
  };

  useEffect(() => {
    let _current = current as FileFolder;
    setAccess({
      ...access,
      status: _current.access.length > 1 ? 'Allow access' : 'Restrict access'
    });
  }, [current]);

  const unAddedMembers = useMemo(() => {}, [Members]);

  const removeAccess = async (_user: Record<string, any>) => {
    let folderId = current?._id;
    let userId = _user?._id;

    let { response } = await postForm(
      'patch',
      `files/${type === 'folder' ? 'folder/' : ''}remove-access`,
      removeemptyFields({
        folderId: type === 'folder' ? folderId : undefined,
        userId,
        fileId: type === 'file' ? folderId : undefined
      })
    );

    if (response) {
      let _current = { ...current } as FileFolder;
      _current.access = _current.access.filter((m) => m.userId !== userId);
      dispatch(type == 'file' ? updateFile(response.data.data) : updateFolder(_current));
    } else {
      displayError('Could not remove access');
    }
  };

  const handleAdd = async (_user: Record<string, any>) => {
    await addAccess(_user?._id, current?._id);
  };

  const fileOwner = useMemo(() => {
    return Members.find((m) => m?._id === current?.createdBy);
  }, [Members]);
  return (
    <AccessComponent
      onRemoveUserAccess={removeAccess}
      onToggleGeneralAccess={handleGeneralAcess}
      onGrantUserAccess={handleAdd}
      Members={viewers._Members}
      selectedUsers={viewers._accessorsIds}
      title={`Manage ${type === 'file' ? current?.alias : current?.name}`}
      closer={closer}
      ownerId={current?.createdBy ?? ''}
      MemberAccessList={current?.access}
    />
  );
};

export default AccessModal;
