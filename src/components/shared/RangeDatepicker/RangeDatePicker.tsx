import { DateRange, DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';

interface Props {
  onChange: (val: DateRange) => void;
  value?: DateRange;
}

export default function RangeDatePicker({ onChange, value }: Props) {
  const today = new Date();

  let footer = (
    <p className="text-ashShade-2 text-center font-Medium text-base ml-2 mt-2 truncate">
      Please pick a date
    </p>
  );

  if (value?.from) {
    if (!value.to) {
      footer = (
        <p className="font-semibold text-center text-bash text-xs">{format(value.from, 'PPP')}</p>
      );
    } else if (value.to) {
      footer = (
        <p className="font-semibold text-center text-bash text-xs">
          {format(value.from, 'PPP')} – {format(value.to, 'PPP')}
        </p>
      );
    }
  }

  return (
    <DayPicker
      min={2}
      mode="range"
      footer={footer}
      selected={value}
      onSelect={(val) => {
        if (val) {
          onChange(val);
        }
      }}
      defaultMonth={today}
    />
  );
}
