import React from 'react';

interface Prop {
  label?: string;
  value?: string;
}

const StatCard = ({ value, label }: Prop) => {
  return (
    <div className=" w-full bg-white flex items-center p-6 gap-x-4 rounded-md ">
      <span className=" text-lg text-bash font-semibold ">{label}</span>
      <span className="  text-3xl font-bold ">{value}</span>
    </div>
  );
};

export default StatCard;
