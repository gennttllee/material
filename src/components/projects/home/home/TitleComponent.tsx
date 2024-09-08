import React from 'react';
interface Prop {
  label: string;
  value: string | number;
}

const TitleComponent = ({ label, value }: Prop) => (
  <div key={label.replaceAll(' ', '')} className="flex flex-col w-full">
    <p className="text-sm mb-2 text-ashShade-1">{label}</p>
    <span className=" rounded-md bg-ashShade-0 py-2 px-4 text-base font-Medium">
      {isNaN(Number(value)) ? value : Number(value).toLocaleString()}
    </span>
  </div>
);

export default TitleComponent;
