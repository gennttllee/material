import React, { useState } from 'react';
import Button from 'components/shared/Button';
import { IconType } from 'react-icons/lib';
import { TbTemplate, TbPlus } from 'react-icons/tb';
import { Navigate, useNavigate } from 'react-router-dom';
import { centered } from 'constants/globalStyles';
import { BsCheck } from 'react-icons/bs';

const options = [
  {
    title: 'Create custom project',
    subtitle: 'Create custom project from scratch',
    Icon: TbPlus
  },
  {
    title: 'Select from existing templates',
    subtitle: 'Select from list of existing templates',
    Icon: TbTemplate
  }
];

function Create() {
  let navigate = useNavigate();
  const [selected, setSelected] = useState<number>(-1);

  const handleContinue = () => {
    if (selected === 0) {
      navigate('/projectform');
    } else {
      navigate('/projects/prototypes');
    }
  };
  return (
    <div className="w-full overflow-y-auto  ">
      <p className=" text-black mt-10 text-2xl font-semibold">Create a Project</p>
      <div className="w-full flex flex-col items-center justify-center mt-40">
        <div>
          <div className=" flex items-center gap-4">
            {options.map((m, i) => (
              <OptionButton
                {...m}
                active={selected === i}
                onClick={() => {
                  setSelected(i);
                }}
              />
            ))}
          </div>
          <Button
            text="Continue"
            onClick={handleContinue}
            className=" mt-10 w-full mx-auto font-semibold"
            type={selected > -1 ? 'primary' : 'muted'}
          />

          <p className="text-bash mt-6 text-center font-semibold">
            I will do this later{' '}
            <span
              onClick={() => navigate('/projects/home/snapshot')}
              className=" text-bblue cursor-pointer ">
              Skip this step
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

interface OptionButtonProp {
  Icon: IconType;
  title: string;
  subtitle: string;
  onClick: () => void;
  active?: boolean;
}

const OptionButton = ({ active, Icon, title, subtitle, onClick }: OptionButtonProp) => {
  return (
    <div
      onClick={onClick}
      className={` p-4 rounded-lg text-bblack-1 cursor-pointer flex flex-col items-center border-2 relative ${
        active ? ' border-bblue' : ' border-ashShade-3'
      }`}>
      {React.createElement(Icon, {
        size: 44,
        color: '#24282E'
      })}
      <p className="mt-4 font-semibold">{title}</p>
      <p className="text-sm">{subtitle}</p>
      <span
        className={
          `absolute w-4 h-4  top-4 right-4 rounded-full flex border items-center ${
            active ? 'border-bblue bg-bblue' : ' border-ashShade-3 '
          } ` + centered
        }>
        {active && <BsCheck size={18} color="white" />}
      </span>
    </div>
  );
};

export default Create;
