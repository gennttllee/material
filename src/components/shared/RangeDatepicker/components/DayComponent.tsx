import { centered, hoverFade } from 'constants/globalStyles';
import { useEffect, useState } from 'react';
import { DayProps } from 'react-day-picker';

interface Props extends DayProps {
  value?: Date;
  onChange?: (val: Date) => void;
}

const DayComponent = ({ displayMonth, date, value, onChange }: Props) => {
  const [localValue, setValue] = useState(new Date());

  useEffect(() => {
    if (value) {
      setValue(value);
    }
  }, [localValue, value]);

  const today = new Date();
  //
  const hasPastDate = today > date;
  const hasDiffMonth =
    displayMonth.getMonth() > date.getMonth() || displayMonth.getMonth() < date.getMonth();
  const isToday =
    today.getDate() === date.getDate() &&
    today.getMonth() === date.getMonth() &&
    today.getFullYear() === date.getFullYear();
  //
  const isSelected =
    date.getDate() === localValue.getDate() &&
    date.getMonth() === localValue.getMonth() &&
    today.getFullYear() === localValue.getFullYear();

  const onClick = () => {
    if (isToday || today < date) {
      //
      if (onChange) onChange(date);
    }
  };

  return (
    <div className={`${isSelected && 'bg-blue-700'} w-10 h-10 rounded-full ${centered}`}>
      <p
        onClick={onClick}
        className={` 
          font-Medium tetx-sm ${hoverFade}
          ${hasDiffMonth && 'opacity-20 text-bash'}
          ${
            isSelected
              ? 'text-white'
              : isToday
                ? 'text-blue-500'
                : hasPastDate
                  ? 'text-bash'
                  : 'hover:text-gray-700'
          }
        `}
      >
        {date.getDate()}
      </p>
    </div>
  );
};

export default DayComponent;
