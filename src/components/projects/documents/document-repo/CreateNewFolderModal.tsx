import React, { useContext, useMemo, useState } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addFileFolders, includeFolder, updateFolder } from 'store/slices/folderSlice';
import { displayInfo, displaySuccess } from 'Utils';
import { postForm } from 'apis/postForm';
import { StoreContext } from 'context';
import InputField from 'components/shared/InputField';
import { act } from '@testing-library/react';
import Button from 'components/shared/Button';
import { toggle } from 'store/slices/profileSlice';
import { removeemptyFields } from 'pages/projectform/utils';

interface CreateNewFolderModalProps {
  toggler: () => void;
  parentFolder?: string;
  isEditing?: boolean;
  _value?: {
    name: string;
    alias: string;
  };
  _id?: string;
}

function CreateNewFolderModal({
  toggler,
  parentFolder,
  isEditing,
  _value,
  _id
}: CreateNewFolderModalProps) {
  const [value, setValue] = React.useState(
    _value ?? {
      name: '',
      alias: ''
    }
  );

  const [loading, setLoading] = useState(false);

  const { data, selectedProjectIndex, activeProject } = useContext(StoreContext);

  const user = useAppSelector((m) => m.user);
  const folder = useAppSelector((m) => m.folder);

  let dispatch = useAppDispatch();

  const handleChange = (field: keyof typeof value) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue({ ...value, [field]: e?.target?.value || '' });
  };

  const createFolders = async () => {
    if (value.name.toLowerCase() === 'presentation') {
      displayInfo(
        "The word 'Presentation' in all forms is a reserved folder name. \n\n Please choose another name for your folder"
      );
      return;
    }
    let folderswithSameName = folder.fileFolders.filter(
      (m) => m?.parentFolder === parentFolder && m.name === value.name
    );

    if (folderswithSameName.length > 0) {
      if (_id) {
        let currentFolder = folderswithSameName.find((m) => m._id === _id);
        if (currentFolder && currentFolder?.alias === value.alias) {
          displayInfo('You have not made any changes');
          return;
        }
      } else {
        displayInfo('A folder with the same name currently exists');
        return;
      }
    }

    setLoading(true);
    let prole = activeProject?.team?.find((m) => m.id === user._id);

    let data: Record<string, any> = {
      name: value.name,
      project: activeProject?._id,
      alias: value.alias,
      access: [{ userId: user?._id, role: prole ? prole.role : user?.role }],
      parentFolder
    };

    let { response, e } = isEditing
      ? await postForm('patch', 'files/folder/update', { ...value, folderId: _id })
      : await postForm('post', `files/folder/create`, removeemptyFields(data));
    if (response?.data) {
      dispatch(
        isEditing
          ? updateFolder(response.data.data)
          : addFileFolders([...folder.fileFolders, response.data.data])
      );
      displaySuccess('Folder Created Successfully');
      toggler();
    }
    setLoading(false);
  };

  const handleSubmit = () => {
    if (canCreate) {
      createFolders();
    }
  };

  const canCreate = useMemo(() => {
    return value.name.trim().length > 0;
  }, [value]);
  return (
    <SuperModal classes=" bg-opacity-50 bg-black flex justify-center" closer={toggler}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white rounded-md m-auto p-6 text-bash lg:w-[435px] font-medium">
        <div className="flex items-center justify-between">
          <span className="text-2xl text-black font-semibold">
            {isEditing ? 'Edit Folder' : 'Create New Folder'}
          </span>
          <span onClick={() => toggler()} className="text-sm hover:cursor-pointer hover:underline ">
            Close
          </span>
        </div>

        <InputField
          value={value.name}
          label="Folder Name"
          onChange={handleChange('name')}
          placeholder="Enter Folder name"
          error={!canCreate ? 'Please enter folder name' : undefined}
        />

        <InputField
          value={value.alias}
          label="Alias (Optional)"
          onChange={handleChange('alias')}
          placeholder="Enter Folder name"
        />

        <div className="flex items-center justify-end gap-x-4 mt-7">
          <Button text="Cancel" type="secondary" onClick={() => toggler()} />
          <Button
            isLoading={loading}
            text="Submit"
            type={canCreate ? 'primary' : 'muted'}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </SuperModal>
  );
}

export default CreateNewFolderModal;
