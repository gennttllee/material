import { centered, hoverFade } from 'constants/globalStyles';
import React, { useMemo } from 'react';
import { DayProps } from 'react-day-picker';

interface Props extends DayProps {
  value: Date;
  minDate?: Date;
  maxDate?: Date;
  disablePastDays?: boolean;
  onChange: (val: Date) => void;
}

const DayComponent = ({
  minDate,
  maxDate,
  displayMonth,
  date,
  value,
  onChange,
  disablePastDays = true
}: Props) => {
  const today = useMemo(() => new Date(), []);
  //
  const isDateDisabled = useMemo(() => {
    // of day has passed
    const initPass = today > date;

    // if greater than the specified date
    if (maxDate) return date > maxDate;
    // if lower than the specified date
    else if (minDate) return date < minDate;

    return initPass;
  }, [minDate, maxDate, today, date]);

  const hasDiffMonth = useMemo(
    () => displayMonth.getMonth() > date.getMonth() || displayMonth.getMonth() < date.getMonth(),
    [date, displayMonth]
  );

  const isToday = useMemo(
    () =>
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear(),
    [date, today]
  );
  //
  const isSelected = useMemo(
    () =>
      date.getDate() === value.getDate() &&
      date.getMonth() === value.getMonth() &&
      today.getFullYear() === value.getFullYear(),
    [value, date, today]
  );

  const onClick = () => {
    if (disablePastDays) {
      if (isToday || !isDateDisabled) {
        onChange(date);
      }
    } else {
      onChange(date);
    }
  };

  return (
    <div className={`${isSelected && 'bg-blue-700'} w-10 h-10 rounded-full ${centered}`}>
      <button
        onClick={onClick}
        type="button"
        className={` 
              font-Medium text-sm ${hoverFade}
              ${hasDiffMonth && 'opacity-20 text-bash'}
              ${
                isSelected
                  ? 'text-white'
                  : isToday
                    ? 'text-blue-500'
                    : disablePastDays && isDateDisabled
                      ? 'text-bash'
                      : 'hover:text-gray-700'
              }
            `}
      >
        {date.getDate()}
      </button>
    </div>
  );
};

export default DayComponent;
