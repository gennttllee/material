import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import 'react-day-picker/dist/style.css';
import { DateRange, DayPicker, SelectRangeEventHandler } from 'react-day-picker';
import DayComponent from './components/DayComponent';

interface Props {
  value: Date;
  disablePastDays?: boolean;
  onChange: (val: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  mode?: string;
}

const DatePicker = ({ value, mode, onChange, disablePastDays, minDate, maxDate }: Props) => (
  <DayPicker
    mode={'single'}
    selected={value}
    captionLayout="dropdown"
    onDayClick={onChange}
    defaultMonth={value}
    components={{
      Day: (props) => (
        <DayComponent
          {...{
            ...props,
            value,
            minDate,
            maxDate,
            onChange,
            disablePastDays
          }}
        />
      )
    }}
    footer={
      value ? (
        <p className="font-semibold text-center text-sm">
          <span className="text-gray-700">You picked </span>
          <Moment className="text-bash" format="MMM Do YY">
            {value}
          </Moment>
        </p>
      ) : (
        <p className="text-ashShade-2 text-center font-Medium text-base ml-2 mt-2 truncate">
          Please pick a date
        </p>
      )
    }
  />
);
interface RangeProps {
  value: DateRange | undefined;
  disablePastDays?: boolean;
  onChange: (x: DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  mode?: string;
}

const RangeDatePicker = ({
  value,
  mode,
  onChange,
  disablePastDays,
  minDate,
  maxDate
}: RangeProps) => {
  return (
    <DayPicker
      mode={'range'}
      selected={value}
      onSelect={(_range, selectedDay, activeModifiers, e) => {
        onChange(_range);
      }}
      captionLayout="dropdown"
      footer={
        value ? (
          <p className="font-semibold text-center text-sm mt-4">
            <span className="text-gray-700 ">You picked</span>
            {/* <Moment className="text-bash" format="MMM Do YY"> */}
            {` ${value.from?.toLocaleDateString()} - ${value?.to?.toLocaleDateString()}`}
            {/* </Moment> */}
          </p>
        ) : (
          <p className="text-ashShade-2 text-center font-Medium text-base ml-2 mt-2 truncate">
            Please pick a date
          </p>
        )
      }
    />
  );
};

export { RangeDatePicker };

export default DatePicker;
