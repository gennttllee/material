import React from 'react';

interface Prop {
  label: string;
  state: string;
  setter: any;
}

const BulletList = ({ label, state, setter }: Prop) => {
  return (
    <div
      onClick={() => setter((_: string) => label)}
      className="w-full flex items-center mb-3 cursor-pointer"
    >
      <span
        className={`mr-3 border w-3 h-3 flex items-center justify-center rounded-full p-[1px] ${
          label === state ? 'border-bblue' : 'border-bash'
        } `}
      >
        {label === state ? <div className=" w-full h-full rounded-full bg-bblue"></div> : null}
      </span>
      {label}
    </div>
  );
};

export default BulletList;
