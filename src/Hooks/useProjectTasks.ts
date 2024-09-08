import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { ConstructionStatus, SubTaskState, TaskStatus } from 'components/projects/management/types';

export type TaskType = {
  name: string;
  startDate: string;
  endDate: string;
  status: string;
  subTasks: SubTaskType[];
  preConstructionStatus: ConstructionStatus;
  _id: string;
  messages: number;
  isCompleted: boolean;
  personnel: any[];
  note: any[];
  SNo: number;
  __v: number;
  powId: string;
  secondarySubTasks?: any[];
  budget?: number;
  duration: { value: number; timestamp: Date; state: SubTaskState };
};

export interface SubTaskType {
  budget: Budget;
  startDate: StartDate;
  duration: Duration;
  pendingUpdates: PendingUpdates;
  _id: string;
  name: string;
  endDate: string;
  personnel: any[];
  plannedStartDate: string;
  plannedEndDate: string;
  task: string;
  dependencies: any[];
  weekDaysOff: any[];
  status: string;
  phaseGate: boolean;
  user: string;
  preConstructionStatus: string;
  powId: string;
  actionDates: any[];
  __v: number;
}

export interface Budget {
  state: string;
  timestamp: string;
}

export interface StartDate {
  value: string;
  state: string;
  timestamp: string;
}

export interface Duration {
  value: number;
  state: string;
  timestamp: string;
}

export interface PendingUpdates {
  dependencies: any[];
}

const useProjectTasks = () => {
  const { data, selectedProjectIndex } = useContext(StoreContext);

  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //fetch tasks  pows/project/{projectId}  tasks/?id?={powId}
    fetchTasks();
  }, [data, selectedProjectIndex]);
  const fetchTasks = async () => {
    setLoading(true);
    let { response, e } = await postForm('get', `pows/project/${data[selectedProjectIndex]._id}`);
    let pows: { _id: string }[] = [];
    if (response) {
      pows = response.data.data;
    }
    if (pows.length > 0) {
      let responses = await Promise.all(
        pows.map(async (m) => await postForm('get', `tasks?type=pow&id=${m._id}`))
      );
      let tasks = responses
        .filter((m) => m.response)
        .map((m) => m.response.data.data)
        .flat();
      setTasks(tasks);
    }
    setLoading(false);
  };
  return { loading, tasks };
};

export default useProjectTasks;
