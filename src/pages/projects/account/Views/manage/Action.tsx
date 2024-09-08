import React, { useState } from 'react';
interface Prop {
  permission: string;
  allowed: boolean;
}
const Action = ({ permission, allowed }: Prop) => {
  const [isAllowed, setIsAllowed] = useState(allowed);
  return (
    <div className="w-full my-2 flex items-center justify-between">
      <span className="">{permission}</span>
      <span
        onClick={() => setIsAllowed(!isAllowed)}
        className={`p-0.5 cursor-pointer w-10 rounded-xl flex items-center ${
          isAllowed ? 'bg-bblue justify-end' : ' bg-ashShade-12'
        }`}
      >
        <span className="w-4 h-4 rounded-full bg-white"></span>
      </span>
    </div>
  );
};

export default Action;
