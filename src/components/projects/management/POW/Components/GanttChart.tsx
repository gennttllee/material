import Button from 'components/shared/Button';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { TbChevronLeft, TbChevronRight, TbPlus, TbSortDescending } from 'react-icons/tb';
import RangeDatepicker from 'components/shared/RangeDatepicker';
import { Gantt, ViewMode } from '../../../../shared/Gantt';
import { DatePicker } from 'components/shared/DatePicker';
import { DateRange } from 'react-day-picker';
import SubTaskForm from './subTaskForm';
import Moment from 'react-moment';
import Modal from '../../../../shared/Modal';
import useRole, { UserRoles } from '../../../../../Hooks/useRole';
import { SubTaskStatusColor } from '../helpers';
import { PMStoreContext } from '../../Context';
import { CustomTask } from './GanttChartView';
import { SubTaskStatus } from '../../types';

const GanttChart = () => {
  const { isOfType } = useRole();
  const { activeTask } = useContext(PMStoreContext);
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [activeMonth, setActiveMonth] = useState(new Date());
  const [subTasks, setSubTasks] = useState<CustomTask[]>([]);
  const [showCalendar, setCalendar] = useState(false);
  const [activeFilter, setFilter] = useState('week');
  const [range, setRange] = useState<DateRange>();
  const [showModal, setModal] = useState(false);

  useEffect(() => {
    if (activeMonth) setCalendar(false);
  }, [activeMonth]);

  const statusProgress = (progress: SubTaskStatus) => {
    switch (progress) {
      case SubTaskStatus.awaitingApproval:
        return 0;
      case SubTaskStatus.notStarted:
        return 1;
      case SubTaskStatus.ongoing:
        return 2;
      case SubTaskStatus.completed:
        return 3;
      default:
        return 4;
    }
  };

  useEffect(() => {
    if (activeTask) {
      const GanttChartTasks: CustomTask[] = activeTask.subTasks
        // only keep subt-tasks with start & end Dates
        .filter((one) => one.startDate && one.endDate)
        .map((one) => ({
          start: new Date(one.startDate.value),
          end: new Date(one.endDate),
          name: one.name,
          status: one.status,
          id: one._id,
          type: 'task',
          isDisabled: true,
          progress: statusProgress(one.status),
          styles: {
            backgroundColor: SubTaskStatusColor(one.status)
          }
        }));
      setSubTasks(GanttChartTasks);
    }
  }, [activeTask]);

  useEffect(() => {}, [range]);

  useEffect(() => {
    switch (activeFilter) {
      case 'month':
        setView(ViewMode.Month);
        break;
      case 'week':
        setView(ViewMode.Week);
        break;
      case 'day':
        setView(ViewMode.Day);
        break;
      default:
        break;
    }
  }, [activeFilter]);

  const columnWidth = useMemo(() => {
    switch (view) {
      case ViewMode.Day:
        return 50;
      case ViewMode.Week:
        return 200;
      default:
        return 94;
    }
  }, [view]);

  const toggleCalendar = () => {
    setCalendar((prev) => !prev);
  };

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const ModalView = showModal && (
    <div className="bg-white absolute cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg">
      <SubTaskForm {...{ toggleModal }} />
    </div>
  );

  const focusOnToday = () => {
    const targetElement = document.querySelector('.today');
    if (targetElement) {
      [targetElement].forEach((el) => {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    } else {
      // alert("Target element not found");
    }
  };

  useEffect(() => {
    focusOnToday();
  }, [view]);

  return (
    <div className="bg-white max-w-full w-full h-full rounded-md p-6 overflow-hidden">
      <div className={flexer + 'relative z-10'}>
        <div className={flexer + 'relative z-10'}>
          <Moment
            className="font-Medium text-2xl truncate"
            format={`${window.innerWidth > 500 ? 'MMMM YYYY' : 'MMM YY'}`}>
            {activeMonth}
          </Moment>
          <TbChevronLeft
            onClick={toggleCalendar}
            className={'text-ashShade-1 ml-3 mr-1' + hoverFade}
          />
          <TbChevronRight onClick={toggleCalendar} className={'text-ashShade-1' + hoverFade} />
          <div
            className={`${
              !showCalendar && 'hidden'
            } absolute top-full left-0 z-10 bg-white shadow-md`}>
            <DatePicker
              value={activeMonth}
              disablePastDays={false}
              onChange={(val) => setActiveMonth(val)}
            />
          </div>
        </div>
        <div className={flexer + 'relative'}>
          <p
            onClick={toggleModal}
            className={
              flexer +
              `${
                !isOfType(UserRoles.Contractor) && 'hidden'
              } text-borange text-base font-Medium mr-3 truncate` +
              hoverFade
            }>
            <TbPlus className="mr-2" />
            <span>Add subtask</span>
          </p>
          <div className="group relative">
            <Button
              text={activeFilter}
              type="secondary"
              textStyle="capitalize"
              LeftIcon={<TbSortDescending className="mr-2" />}
            />
            <div className="hidden group-hover:grid bg-white absolute z-20 top-full w-32 right-0 p-2 rounded-md shadow-md">
              {React.Children.toArray(
                ['month', 'week', 'day', 'range'].map((one) => (
                  <p
                    onClick={() => setFilter(one)}
                    className={
                      `
                        p-2 capitalize font-Medium rounded-md
                        ${activeFilter === one ? 'bg-blue-100 text-blue-600' : 'text-bash'} 
                    ` + hoverFade
                    }>
                    {one}
                  </p>
                ))
              )}
            </div>
          </div>
          <div
            className={`${
              activeFilter !== 'range' && 'show'
            } absolute z-10 right-0 top-full bg-white rounded-md shadow-md`}>
            <RangeDatepicker onChange={setRange} />
          </div>
        </div>
      </div>
      <div className="h-full relative z-0 mt-5">
        {subTasks[0] ? (
          <Gantt viewMode={view} listCellWidth="" tasks={subTasks} columnWidth={columnWidth} />
        ) : (
          <div className={centered + 'h-full'}>
            <h1 className="text-bash opacity-60 font-Medium text-2xl">No subtasks yet</h1>
          </div>
        )}
      </div>
      <Modal
        visible={showModal}
        toggle={toggleModal}
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg !z-0">
        {ModalView}
      </Modal>
    </div>
  );
};

export default memo(GanttChart);
