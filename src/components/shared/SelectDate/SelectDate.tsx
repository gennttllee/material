import React, { FC, useState, useEffect, useRef, memo } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { errorStyle, flexer } from '../../../constants/globalStyles';
import Moment from 'react-moment';
import { DatePicker } from '../DatePicker';
import { TbCalendar } from 'react-icons/tb';

export interface IOption {
  value: string;
  label?: string; // incase its not provided, we render the actual value
}

interface Props {
  onChange: (value: Date, userAction?: boolean) => void;
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
  initialValue?: Date;
    required?: boolean;
}

const SelectDate: FC<Props> = ({
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
  const selectRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState<Date | undefined>();
  const [hasChanges, setHasChanges] = useState(false);
  const [showModal, setModal] = useState(false);

  useEffect(() => {
    if (initialValue && !localValue) {
      setLocalValue(initialValue);
    }
  }, [initialValue]);
  //
  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.contains(selectRef.current)) {
        setModal(false);
      }
    });
    // update the with the base date
    onChange(new Date(), false);

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setModal(false);
      });
    };
    // eslint-disable-next-line
  }, []);


  const toggleModal = () => {
    if (!disabled) setModal((prev) => !prev);
  };

  const handleChange = (value: Date) => {
    setLocalValue(value);
    if (!hasChanges) setHasChanges(true);
    toggleModal();
  };

  useEffect(() => {
    if (localValue) {
      onChange(localValue);
    }
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
        {!localValue ? (
          <p className="font-Medium selectDate text-base text-bash">{placeholder}</p>
        ) : (
          <p className="font-Medium selectDate text-base text-gray-700">
            <Moment format="MMM Do YY">{localValue}</Moment>
          </p>
        )}
        <TbCalendar className='text-bash selectDate' />
      </div>
      {showModal && (
        <div className="absolute selectDate w-fit top-full left-0 z-20 rounded-md shadow-lg p-3 bg-white ">
          <DatePicker
            value={localValue ?? new Date()}
            onChange={handleChange}
            minDate={minDate ?? initialValue ?? new Date()}
            {...{ maxDate }}
          />
        </div>
      )}
      <p className={errorStyle + 'selectDate'}>{!value ? error : null}</p>
    </div>
  );
};

export default SelectDate;
