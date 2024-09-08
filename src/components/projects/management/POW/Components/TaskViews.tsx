import { flexer, hoverFade } from 'constants/globalStyles';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TbChevronDown } from 'react-icons/tb';
import { TiArrowRight } from 'react-icons/ti';
import ListView from './ListView';
import GanttChart from './GanttChart';
import KanbanView from './KanBan';

export type TaskViewType = 'card' | 'calendar' | 'kanban';

const taskViewOptions: TaskViewType[] = ['card', 'calendar', 'kanban'];

const TaskViews = () => {
  const [showMenu, setMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<TaskViewType>('kanban');

  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(containerRef.current) || !e.target.classList.contains('bread-crumb'))
      ) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
  }, []);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  const ViewHandler = useMemo(() => {
    switch (view) {
      case 'card':
        return <ListView />;
      case 'calendar':
        return <GanttChart />;
      case 'kanban':
        return <KanbanView />;
    }
  }, [view]);

  return (
    <>
      <div
        ref={containerRef}
        className={'flex items-end w-full mb-2 relative flex-col bread-crumb'}
      >
        <button onClick={toggleMenu} className={'flex items-center bread-crumb' + hoverFade}>
          <TbChevronDown
            className={`text-blue-700 bread-crumb text-base transform transition-all ${
              showMenu && 'rotate-180'
            } `}
          />
          <p className="text-blue-700 text-sm font-Medium capitalize bread-crumb">{view} view</p>
        </button>

        <div
          className={`${
            !showMenu ? 'hidden' : 'grid z-10'
          } items-center absolute py-2 bg-white w-fit top-full right-0 rounded-md shadow-md `}
        >
          {React.Children.toArray(
            taskViewOptions.map((one) => (
              <div
                className={hoverFade + 'px-5 py-2 group hover:bg-[whitesmoke] rounded-sm' + flexer}
                onClick={() => setView(one)}
              >
                <p
                  className={`truncate w-full ${
                    view === one ? 'text-blue-700' : 'text-bash group-hover:text-ashShade-1 '
                  } font-Medium text-base capitalize mr-3`}
                >
                  {one} view
                </p>
                <TiArrowRight className="opacity-0 text-base text-bash group-hover:opacity-100 transform group-hover:translate-x-1 transition-all " />
              </div>
            ))
          )}
        </div>
      </div>
      {ViewHandler}
    </>
  );
};

export default TaskViews;
