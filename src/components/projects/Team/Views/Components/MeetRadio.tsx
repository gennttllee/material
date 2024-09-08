import React, { useEffect, useState } from 'react';

interface Props {
  setter: (x: any) => any;
  list: { label: string; value: string }[];
  initialValue?: string;
}

const MeetRadio = ({ list, setter, initialValue }: Props) => {
  const [value, setValue] = useState(initialValue ?? '');

  useEffect(() => {
    if (value !== '') {
      setter(value);
    }
  }, [value]);

  return (
    <div className=" my-6 text-bash cursor-pointer ">
      <p className="font-Medium ">Location</p>
      <div className="flex items-center gap-x-6 mt-2">
        {list.map((m) => (
          <span onClick={() => setValue(m.value)} className="flex items-center gap-x-2">
            <span
              className={`w-4 h-4 rounded-full border-bash border ${
                value === m.value ? ' bg-bblue' : ''
              } `}
            ></span>
            <span>{m.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default MeetRadio;
