import React, { FC, useState, useEffect, useRef, memo, useMemo } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import Moment from 'react-moment';

import { TbCalendar } from 'react-icons/tb';
import { errorStyle, flexer } from 'constants/globalStyles';
import { DatePicker } from 'components/shared/DatePicker';
import { getdayEnd, getDayStart } from 'Utils';
import { subDays } from 'date-fns';
import Radio from './Radio';
import SelectDateRange from 'components/shared/SelectDateRange';
import { IoClose } from 'react-icons/io5';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';

export interface IOption {
  value: string;
  label?: string; // incase its not provided, we render the actual value
}

interface Props {
  onChange: (value: Date[], userAction?: boolean) => void;
  className?: string;
  placeholder?: string;
  value?: Date;
  error?: string;
  label?: string;
  disabled?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  minDate?: Date;
  maxDate?: Date;
  initialValue?: Date[];
}

// export default SelectDate;

const DateFilter: FC<Props> = ({
  error,
  value,
  label,
  minDate,
  maxDate,
  onChange,
  className,
  placeholder,
  initialValue,
  wrapperClassName,
  disabled = false
}) => {
  let rangeMaps = useMemo(() => {
    let labels = ['Today', 'Last 3 days', 'Last 7 days', 'Last 30 days', 'Custom'];
    let map: Record<string, Date[]> = {};
    labels.forEach((m) => {
      let todayStart = getDayStart(new Date());
      let todayEnd = getdayEnd(new Date());
      let defaultRange = [todayStart, todayEnd];

      switch (m) {
        case 'Today':
          map['Today'] = defaultRange;
          break;
        case 'Last 3 days':
          map['Last 3 days'] = [getDayStart(subDays(new Date(), 3)), todayEnd];
          break;
        case 'Last 7 days':
          map['Last 7 days'] = [getDayStart(subDays(new Date(), 7)), todayEnd];
          break;
        case 'Last 30 days':
          map['Last 30 days'] = [getDayStart(subDays(new Date(), 30)), todayEnd];
          break;
        default:
          map['Custom'] = defaultRange;
      }
    });
    return map;
  }, []);
  const selectRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState<Date[]>([new Date(), new Date()]);
  const [hasChanges, setHasChanges] = useState(false);
  const [showModal, setModal] = useState(false);
  const [optionLabel, setOptionLabel] = useState('');

  useEffect(() => {
    if (initialValue && !localValue) {
      setLocalValue(initialValue);
    }
  }, [initialValue]);
  //
  // useEffect(() => {
  //   // click event that's in-charge of
  //   // closing the modal
  //   document.addEventListener('click', (e: any) => {
  //     if (e.target && e.target.contains(selectRef.current)) {
  //       setModal(false);
  //     }
  //   });
  //   // update the with the base date
  //   onChange([new Date(), new Date()], false);

  //   return () => {
  //     // clear the event
  //     document.removeEventListener('click', () => {
  //       setModal(false);
  //     });
  //   };
  //   // eslint-disable-next-line
  // }, []);

  const toggleModal = () => {
    if (!disabled) setModal((prev) => !prev);
  };

  const handleChange = (index: number) => (value: Date) => {
    let _localValue = [...localValue];
    _localValue[index] = index === 0 ? getDayStart(value) : getdayEnd(value);
    if (_localValue[0].getTime() > _localValue[1].getTime() && index === 0) {
      _localValue[1] = _localValue[0];
    } else if (_localValue[1].getTime() < _localValue[0].getTime() && index === 1) {
      _localValue[0] = _localValue[1];
    }
    setLocalValue(_localValue);
    if (!hasChanges) setHasChanges(true);
    //toggleModal();
  };

  useEffect(() => {
    if (localValue && localValue[0].getTime() !== localValue[1].getTime()) {
      onChange(localValue);
    }
  }, [localValue]);

  const makeSelection = (type: keyof typeof rangeMaps) => () => {
    setOptionLabel(type);
    setLocalValue(rangeMaps[type]);
  };

  let _minDate = new Date(0);

  const dateModalRef = useRef<HTMLDivElement>(null);

  useClickOutSideComponent(dateModalRef, () => {
    setModal(false);
  });

  const dateisDefault = useMemo(() => {
    return localValue[0].getTime() === localValue[1].getTime();
  }, [localValue]);

  return (
    <div className={'w-full selectDate flex my-3 relative flex-col ' + className} ref={selectRef}>
      {label ? <label className="font-Medium selectDate text-bash text-sm">{label}</label> : null}
      <div
        className={
          flexer +
          `px-4 py-2 cursor-pointer selectDate border border-bash rounded-md ${
            disabled && 'bg-gray-50'
          } mt-1 ${wrapperClassName}`
        }
        onClick={toggleModal}>
        {!localValue || localValue.length < 1 || dateisDefault ? (
          <p className="font-Medium selectDate text-base text-bash">{placeholder}</p>
        ) : (
          <p className="font-Medium selectDate text-base text-gray-700">
            <Moment format="MMM Do YY">{localValue[0]}</Moment>
            {' - '}
            <Moment format="MMM Do YY">{localValue[1]}</Moment>
          </p>
        )}
        <div className="  flex items-center  gap-x-2 ">
          {!dateisDefault && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                let date = new Date();
                setLocalValue([date, date]);
                onChange([]);
              }}
              className="p-1 rounded-full hover:bg-ashShade-0 ">
              <IoClose />
            </span>
          )}
          <TbCalendar className="text-bash selectDate" />
        </div>
      </div>
      {showModal && (
        <div
          ref={dateModalRef}
          className="absolute my-4 border border-ashShade-0 selectDate min-w-[30vw] top-full right-0 z-20 rounded-md shadow-lg p-3 bg-white ">
          <div className=" flex flex-col gap-y-2">
            {Object.keys(rangeMaps).map((m) => (
              <Radio onClick={makeSelection(m)} label={m} selected={optionLabel === m} />
            ))}
          </div>

          {optionLabel === 'Custom' && (
            <>
              <div className="w-full border border-ashShade-0 my-3 flex items-center justify-between py-2 px-4 rounded-md">
                <p className="font-Medium selectDate text-base text-gray-700">
                  <Moment format="MMM Do YY">{localValue[0]}</Moment>
                  {' - '}
                  <Moment format="MMM Do YY">{localValue[1]}</Moment>
                </p>
                <TbCalendar color="#9099A8" />
              </div>

              <div
                onClick={(e) => {
                  // e.stopPropagation();
                }}
                className=" flex items-center gap-x-3 ">
                <span className=" p-3 rounded-lg border-ashShade-0 border ">
                  <DatePicker
                    value={localValue[0] || new Date()}
                    onChange={handleChange(0)}
                    minDate={_minDate}
                    {...{ maxDate }}
                  />
                </span>
                <span className=" p-3 rounded-lg border-ashShade-0 border ">
                  <DatePicker
                    mode="multiple"
                    value={localValue[1]}
                    onChange={handleChange(1)}
                    minDate={_minDate}
                    {...{ maxDate }}
                  />
                </span>
              </div>
            </>
          )}

          <></>
        </div>
      )}
      <p className={errorStyle + 'selectDate'}>{!value ? error : null}</p>
    </div>
  );
};

export default DateFilter;
