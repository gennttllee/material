import React, { FC, useState, useEffect, useRef } from 'react';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { errorStyle, flexer } from '../../../constants/globalStyles';
import RangeDatepicker from '../RangeDatepicker';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

export interface IOption {
  value: string;
  label?: string; // incase its not provided, we render the actual value
}

interface Props {
  onChange: (value: DateRange, userAction?: boolean) => void;
  className?: string;
  placeholder?: string;
  value?: DateRange;
  error?: string;
  label?: string;
  disabled?: boolean;
  labelClassName?: string;
  initialValue?: DateRange;
  wrapperClassName?: string;
}

const SelectDateRange: FC<Props> = ({
  error,
  value,
  label,
  onChange,
  className,
  placeholder,
  wrapperClassName,
  disabled = false
}) => {
  const [showModal, setModal] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [localValue, setLocalValue] = useState<DateRange>();

  useEffect(() => {
    setLocalValue(value ? value : { from: new Date(), to: new Date() });
  }, []);
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
    onChange({ from: new Date(), to: new Date() }, false);

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

  const handleChange = (vl: DateRange) => {
    setLocalValue(vl);
    if (vl.from && vl.to) {
      toggleModal();
      onChange(vl, true);
    }
  };

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
            {localValue.from ? format(localValue.from, 'PPP') : ''} –{' '}
            {localValue.to ? format(localValue.to, 'PPP') : ''}
          </p>
        )}
        {showModal ? (
          <BsChevronUp className="text-bash selectDate" />
        ) : (
          <BsChevronDown className="text-bash selectDate" />
        )}
      </div>
      {showModal && (
        <div className="absolute selectDate w-fit top-full left-0 z-20 rounded-md shadow-lg p-3 bg-white ">
          <RangeDatepicker value={localValue} onChange={handleChange} />
        </div>
      )}
      <p className={errorStyle + 'selectDate'}>{!value ? error : null}</p>
    </div>
  );
};

export default SelectDateRange;
