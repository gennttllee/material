import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { ProjectTask, TaskStatus, POW, SubTask } from '../types';
import { StoreContext } from 'context';

export type PMContextState = {
  isLoading: boolean;
  tasks: { [key: string]: ProjectTask[] }; // { powId: tasks[] }
  activePow?: POW;
  draftsToSubmit: ProjectTask[];
  activeSubTask?: SubTask;
  activeTask?: ProjectTask;
  taskStatusFilter?: TaskStatus;
  hasFetchedAllPows: boolean;
  hasFetchedAllTasks: boolean;
  pows: POW[];
};

interface Props {
  children?: ReactNode;
}

type handleContext = <T extends keyof PMContextState, Y extends PMContextState[T]>(
  key: T,
  value: Y
) => void;

interface ContextProps extends PMContextState {
  handleContext: handleContext;
  setContext: React.Dispatch<React.SetStateAction<PMContextState>>;
}

const initialState: ContextProps = {
  pows: [],
  tasks: {},
  isLoading: false,
  draftsToSubmit: [],
  setContext: () => {},
  handleContext: () => {},
  hasFetchedAllPows: false,
  hasFetchedAllTasks: false
};

const PMStoreContext = createContext<ContextProps>(initialState);

const PMStoreProvider: FC<Props> = ({ children }) => {
  const { selectedProject } = useContext(StoreContext);
  const [state, setState] = useState<PMContextState>(initialState);

  useEffect(() => {
    /** check to see if the project has changed, and clear */
    const exists = state.pows.find((one) => one.project === selectedProject._id);
    if (!exists) {
      // clear all POWs
      setState((prev) => ({ ...prev, pows: [], hasFetchedAllPows: false }));
    }
  }, [selectedProject]);

  const handleContext: handleContext = (key, value) => {
    if (key === 'activeTask' && value === undefined) {
      setState((prev) => {
        if (!prev.activeTask) return prev;
        /**
         *  when aborting
         *  active task (viewing one task)
         *  save the current instance
         */
        const newTasks = prev.tasks[prev.activeTask.powId].map((one) =>
          one._id === prev.activeTask?._id ? prev.activeTask : one
        );
        return {
          ...prev,
          tasks: { ...prev.tasks, [prev.activeTask.powId]: newTasks },
          activeTask: undefined
        };
      });
    } else {
      setState((prev: PMContextState) => ({ ...prev, [key]: value }));
    }
  };

  return (
    <PMStoreContext.Provider
      value={{
        ...state,
        handleContext,
        setContext: setState
      }}
    >
      {children}
    </PMStoreContext.Provider>
  );
};

export { PMStoreContext, PMStoreProvider };
