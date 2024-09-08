import React from 'react';
interface Prop {
  name: string;
}
const Names = ({ name }: Prop) => {
  return (
    <span className="p-2 text-xs border border-black text-black font-Medium rounded-3xl">
      {name}
    </span>
  );
};

export default Names;
