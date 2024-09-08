import Button from 'components/shared/Button';
import InputField from 'components/shared/InputField';
import SelectField from 'components/shared/SelectField';
import SuperModal from 'components/shared/SuperModal';
import { StoreContext } from 'context';
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { TbCheck, TbChevronDown, TbSearch } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { GrFormClose } from 'react-icons/gr';
import { useClickOutSideComponent } from './OnScreen';
import axios from 'axios';
import { MESSAGING_REST, postForm } from 'apis/postForm';
import { cleanError, displayError } from 'Utils';
import { addGroupOrTasks, chats } from 'store/slices/chatsSlice';
import { removeemptyFields } from 'pages/projectform/utils';

interface NewGroupModalProps {
  closer: () => void;
  title?: string;
  isTaskChat?: boolean;
}

export type Selected = { id: string; name: string; role: string };

const NewGroupModal = ({ closer, isTaskChat, title }: NewGroupModalProps) => {
  const [loading, setLoading] = React.useState(false);
  const [selection, setSelection] = React.useState<Selected[]>([]);
  const [filter, setFilter] = React.useState('');
  const [showList, setShowList] = React.useState(false);
  const [groupName, setGroupName] = React.useState('');
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(false);
  const [value, setValue] = React.useState('');
  let { data, selectedProjectIndex } = useContext(StoreContext);
  let optionsRef = useRef<any>();
  let { selectedProject } = useContext(StoreContext);

  let team = useAppSelector((m) => m.team);
  let chats = useAppSelector((m) => m.chats);

  useClickOutSideComponent(optionsRef, () => {
    if (showList !== false) {
      setShowList(false);
    }
  });

  let _team = useMemo(() => {
    let list: Selected[] = [];
    let keys = Object.keys(team.data);
    for (let key of keys) {
      if (key.toLowerCase() !== selectedProject._id)
        list.push({ id: key, name: team.data[key]?.name, role: team.data[key]?.rolename });
    }

    return list;
  }, [team]);

  let filtered = useMemo(() => {
    return _team.filter((m) => m.name?.toLowerCase().includes(filter?.toLowerCase()));
  }, [filter, team]);
  const create = () => {};

  const getTasks = async () => {
    setFetching(true);
    let { response, e } = await postForm(
      'get',
      `tasks/project-tasks?projectId=${data[selectedProjectIndex]?._id}`
    );
    if (!e) {
      setTasks(response.data.data);
    }

    setFetching(false);
  };

  useEffect(() => {
    if (isTaskChat) {
      getTasks();
    }
  }, []);

  let taskOptions = useMemo(() => {
    let currentTasks = Object.values(chats.groups.tasks).map((m) => m.taskId);

    return tasks
      .map((m) => ({
        value: m._id,
        label: m.name
      }))
      .filter((n) => !currentTasks.includes(n.value));
  }, [tasks]);

  const display = useMemo(() => {}, []);
  const errors = useMemo(() => {
    let group = groupName ? '' : 'Please enter a group name';
    let select = selection.length > 0 ? '' : 'Please select a group member';
    let task = value ? '' : 'Please select a task';
    return { group, select, task };
  }, [selection, groupName, value]);

  const toggleSelection = (value: Selected) => () => {
    let selects = [...selection];
    let ids = selects.map((m) => m.id);
    if (ids.includes(value.id)) {
      selects = selects.filter((m) => m.id !== value.id);
    } else {
      selects.push(value);
    }
    setSelection(selects);
  };
  const toggleList = (event: any) => {
    setShowList(!showList);
  };

  let dispatch = useAppDispatch();
  const createGroup = async () => {
    setLoading(true);
    let errorCondition = !isTaskChat ? errors.group || errors.select : errors.task;
    if (errorCondition) {
      setLoading(false);
      return;
    }

    let members = isTaskChat
      ? _team.map((m) => ({ userId: m.id, role: m.role }))
      : selection.map((m) => ({ userId: m.id, role: m.role }));
    let token = localStorage.getItem('token');

    let body = {
      projectId: selectedProject._id,
      taskId: value,
      name: isTaskChat ? undefined : groupName,
      taskName: isTaskChat ? taskOptions.find((m) => m.value === value)?.label : undefined,
      members
    };
    body = removeemptyFields(body);
    try {
      let response = await axios.post(`${MESSAGING_REST}/group/create`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      dispatch(addGroupOrTasks(response.data.data));

      closer();
    } catch (error: any) {
      console.log(error);
      displayError(cleanError(error));
    }
    setLoading(false);
  };
  return (
    <SuperModal classes="  bg-black bg-opacity-30 " closer={closer}>
      <div className="w-full h-full flex flex-col items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" w-4/5 lg:w-1/2 xl:w-1/3 bg-white p-6 rounded-md mt-32 max-w-[516px] h-auto ">
          <div className="w-full justify-between  flex items-center">
            <span className=" text-xl text-bblack-1 font-semibold">
              {title ?? 'Create New Group'}
            </span>
            <span onClick={closer} className=" text-bash text-sm cursor-pointer">
              Close
            </span>
          </div>
          {isTaskChat ? (
            <>
              <SelectField
                placeholder="Select a task"
                label="Select tasks"
                value={value}
                isLoading={fetching}
                data={taskOptions}
                onChange={(e) => {
                  setValue(e);
                }}
              />
              <ErrorComponent text={errors.task} />
            </>
          ) : (
            <InputField
              error={errors.group}
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
              }}
              label="Name of Group"
              placeholder="e.g Contractors"
            />
          )}

          {!isTaskChat && (
            <div className="w-full relative rounded-md">
              <p className="mt-2.5 text-bash">Add members</p>
              <div
                onClick={toggleList}
                className="p-3 rounded-md w-full mt-2 cursor-pointer border  border-ashShade-2 flex  justify-between items-center ">
                {selection.length > 0 ? (
                  <div className="flex flex-wrap">
                    {selection.map((m) => {
                      return (
                        <span className="flex items-center px-2 py-1 m-1 bg-ashShade-0 rounded-md">
                          <span className=" items-center flex flex-wrap">{m.name}</span>

                          <span className="ml-1" onClick={toggleSelection(m)}>
                            <GrFormClose />
                          </span>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <span className="text-bash">Select Team members</span>
                )}
                <TbChevronDown className="text-ashShade-2" />
              </div>
              <ErrorComponent text={errors.select} />
              {showList && (
                <div ref={optionsRef} className="absolute bg-white  px-4 w-full z-10 shadow-lg">
                  <InputField
                    value={filter}
                    className="ml-4"
                    LeftIconProp={<TbSearch />}
                    label=""
                    onChange={(x) => {
                      setFilter(x.target.value);
                    }}
                    placeholder="Search"
                  />
                  <div className="w-full h-52 overflow-y-auto scrollbar">
                    {filtered.map((m) => (
                      <div
                        onClick={toggleSelection(m)}
                        className=" w-full hover:bg-lightblue hover:text-blueShades-0 cursor-pointer rounded-md flex py-2 px-2 items-center ">
                        <span
                          className={`w-4 h-4 border flex items-center justify-center ${
                            selection.includes(m)
                              ? ' border-bblue bg-bblue '
                              : 'bg-white border-ashShade-2'
                          } rounded`}>
                          <TbCheck color="white" size={12} />
                        </span>
                        <span className="ml-2.5">{m.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex justify-end py-4">
                    <Button
                      textStyle=" !text-bblack-1"
                      className=" !border-ashShade-4 "
                      type="transparent"
                      onClick={toggleList}
                      text="Cancel"
                    />
                    <Button
                      className=" ml-2"
                      isLoading={loading}
                      onClick={toggleList}
                      text="Done"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="w-full flex justify-end mt-8">
            <Button
              textStyle=" !text-bblack-1"
              className=" !border-ashShade-4 "
              type="plain"
              onClick={closer}
              text="Cancel"
            />
            <Button className=" ml-2" isLoading={loading} onClick={createGroup} text="Create" />
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

interface ErrorComponentProps {
  text: string;
}
const ErrorComponent = ({ text }: ErrorComponentProps) => {
  return <p className={`text-bred ${text ? '' : 'hidden'}`}>{text}</p>;
};

export default NewGroupModal;
