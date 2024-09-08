import React from 'react';

interface Prop {
  icon: any;
  value: number | string;
  label: string;
}

const Facility = ({ icon, value, label }: Prop) => (
  <div className="w-full sm:min-w-max">
    <div className="w-full py-8 overflow-hidden box-border bg-ashShade-0  rounded-md flex flex-col items-center justify-center relative">
      <div className="flex justify-center items-center">
        <img loading="lazy" decoding="async" src={icon} alt="" />
        <span className="text-xl ml-2 truncate">
          {typeof value === 'number' ? Number(value).toLocaleString() : value}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-center mx-5 mt-2 capitalize truncate">{label}</p>
    </div>
  </div>
);

export default Facility;
