import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { TbCalendar } from 'react-icons/tb';
import { DatePicker } from '../DatePicker';
import Dropdown from 'react-dropdown';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { RangeDatePicker } from '../DatePicker/DatePicker';
import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';

export type TPeriod = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface Date_Period_Picker_Props {
  label?: string;
  selectedDate?: Date;
  datePlaceHolder: string;
  selectedPeriod?: TPeriod;
  periodPlaceHolder: string;
  onDateChange: (val: Date) => void;
  onPeriodChange: (val: TPeriod) => void;
  classes?: string;
  onRangeChange?: (x: DateRange | undefined) => void;
  value?: DateRange;
}
 const getDayStart = (date: Date = new Date()) => {
  return new Date(new Date(date).setHours(0, 0, 0, 0));
};
 const getdayEnd = (date: Date = new Date()) => {
  return new Date(new Date(date).setHours(23, 59, 59, 999));
};
let defaultRange = {
  from: getDayStart(new Date()),
  to: getdayEnd(new Date())
};
const Date_Period_Picker = ({
  periodPlaceHolder,
  datePlaceHolder,
  selectedPeriod,
  onPeriodChange,
  onDateChange,
  selectedDate,
  label,
  classes,
  value,
  onRangeChange
}: Date_Period_Picker_Props) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [showCalendar, setCalendar] = useState(false);
  const [showSelect, setShowSelect] = useState(false);
  const [selected, setSelected] = useState('today');
  const [range, setRange] = useState<DateRange>(defaultRange as DateRange);
  const [selection, setSelection] = useState<DateRange>();
  const dropDownItems = [
    { value: 'today', label: 'Today' },
    { value: '3days', label: 'Last 3 Days' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'customised', label: 'Customised' }
  ];
  let calendarRef = useRef<any>();
  useEffect(() => {
    handleSelection();
  }, [range, selected]);
  useEffect(() => {
    if (!value) {
      setSelected('today');
      // setRange();
    }
  });
  const handleSelection = () => {
    let dateRange = { ...defaultRange };

    if (selected === '3days') dateRange.from = getDayStart(subDays(new Date(), 3));
    else if (selected === '7days') dateRange.from = getDayStart(subDays(new Date(), 7));
    else if (selected === '30days') dateRange.from = getDayStart(subMonths(new Date(), 1));
    else if (selected === 'customised') {
      dateRange.from = getDayStart(range?.from);
      dateRange.to = getdayEnd(range?.to);
    }

    if (onRangeChange) {
      onRangeChange(dateRange);
    }
    setSelection(dateRange);
  };

  useClickOutSideComponent(calendarRef, () => {
    setCalendar(false);
  });

  const toggleCalendar = () => {
    setCalendar((prev) => !prev);
  };
  let indicator = useMemo(() => {
    return selection
      ? `${selection.from?.toLocaleDateString()} - ${selection.to?.toLocaleDateString()}`
      : datePlaceHolder;
  }, [selection]);
  return (
    <div className={`flex-1   relative  flex-col ${classes}`} ref={selectRef}>
      <label className="font-Medium text-bash text-sm mb-2">{label}</label>
      <div
        className={`flex flex-col  w-full items-center gap-5 border   ${
          showCalendar ? 'border-bblue' : 'border-ashShade-4'
        }  rounded-md `}>
        <Dropdown
          className=" w-full px-4"
          controlClassName=" w-full  flex items-center justify-between"
          options={dropDownItems}
          value={selected}
          placeholder={periodPlaceHolder || 'Select an option'}
          onChange={(val) => {
            setSelected(val.value);
          }}
          arrowOpen={<BsChevronUp className="text-bash text-sm" />}
          menuClassName="border-ashShade-4 -ml-4 rounded-tr flex-1 w-full  rounded-tr rounded-br-md rounded-bl-md"
          arrowClosed={<BsChevronDown className="text-bash text-sm" />}
        />
      </div>
      {selected === 'customised' && (
        <>
          <button
            className="flex  bg-white w-full border-b border-b-ashShade-0 z-10 relative justify-between items-center flex-1 p-4 "
            onClick={() => {
              toggleCalendar();
            }}>
            <p className="font-Medium truncate   text-bash text-base">{indicator}</p>
            <div className="relative">
              <TbCalendar className="text-xl text-bash" />
            </div>
          </button>
          {showCalendar && (
            <div
              ref={calendarRef}
              className="absolute selectDate w-fit top-full left-0 z-20 rounded-md shadow-lg p-3 bg-white ">
              <RangeDatePicker
                value={range}
                onChange={(val) => {
                  setRange(val as DateRange);
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Date_Period_Picker;
