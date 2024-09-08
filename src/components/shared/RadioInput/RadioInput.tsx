import RadioBtn from '../RadioBtn';
import React from 'react';
import { TOption } from '../SelectField/SelectField';

const RadioInput = ({
  value: stateValue,
  options,
  onChange
}: {
  value: string;
  onChange: (vl: string) => void;
  options: TOption[];
}) => (
  <div className="flex items-center gap-5 flex-nowrap">
    {React.Children.toArray(
      options.map(({ label, value }) => (
        <RadioBtn
          label={label || value}
          pressed={stateValue === value}
          onChange={() => onChange(value)}
        />
      ))
    )}
  </div>
);

export default RadioInput;
