import React from 'react';

interface Prop {
  label?: string;
  value?: string;
  image?: string;
}

const StatCard = ({ value, label, image }: Prop) => {
  return (
    <div className="w-full bg-white flex items-center py-4 px-6 gap-x-6 rounded-md">
      {image && <img src={image} alt={label} className="h-12 w-12 object-contain" />}
      <div className="flex flex-col">
        <span className="text-sm text-bash font-semibold">{label}</span>
        <span className="text-2xl font-semibold">{value}</span>
      </div>
    </div>
  );
};

export default StatCard;
