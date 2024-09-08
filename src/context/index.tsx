import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { Brief, ProfessionalBrief, Prototype } from '../types';
import useRole from 'Hooks/useRole';

export type ContextState = {
  data: Brief[];
  token?: string;
  isLoading: boolean;
  searchQuery: string;
  selectedProject: Brief;
  selectedProjectIndex: number;
  selectedData: ProfessionalBrief;
  activeProject: Brief | ProfessionalBrief;
  menuProjects: ProfessionalBrief[];
  prototypes: Prototype[];
};

interface Props {
  children?: ReactNode;
}

type handleContext = <T extends keyof ContextState, Y extends ContextState[T]>(
  key: T,
  value: Y
) => void;

interface ContextProps extends ContextState {
  handleContext: handleContext;
  setContext: React.Dispatch<React.SetStateAction<ContextState>>;
}

const initialState: ContextProps = {
  data: [],
  searchQuery: '',
  isLoading: true,
  menuProjects: [],
  selectedProjectIndex: -1,
  setContext: () => {},
  handleContext: () => {},
  activeProject: {} as Brief,
  selectedProject: {} as Brief,
  selectedData: {} as ProfessionalBrief,
  prototypes: []
};

const StoreContext = createContext<ContextProps>(initialState);

const StoreProvider: FC<Props> = ({ children }) => {
  const { isProfessional } = useRole();
  const [state, setState] = useState<ContextState>(initialState);

  const handleContext: handleContext = (key, value) => {
    setState((prev: ContextState) => ({ ...prev, [key]: value }));
  };

  const selectedData = useMemo(() => {
    const { menuProjects, selectedProjectIndex } = state;
    //
    return menuProjects[selectedProjectIndex]||{};
  }, [state]);

  const selectedProject = useMemo(() => {
    const { data, selectedProjectIndex } = state;
    //
    return data[selectedProjectIndex]||{};
  }, [state]);

  const activeProject = useMemo(() => {
    return !isProfessional ? selectedData : selectedProject;
  }, [selectedData, selectedProject, isProfessional]);

  return (
    <StoreContext.Provider
      value={{
        ...state,
        selectedData,
        handleContext,
        activeProject,
        selectedProject,
        setContext: setState
      }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreContext, StoreProvider };
