import React from 'react';
import { IconType } from 'react-icons';
import { TbFolderPlus } from 'react-icons/tb';
import { func } from '../drawings/DrawingCard';

interface OptionProps {
  onClick: func;
  text: string;
  iconleft: IconType;
  iconRight?: IconType;
}
function Options({ text, iconleft, iconRight, onClick }: OptionProps) {
  const [loading, setLoading] = React.useState(false);

  return (
    <span
      onClick={async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
      className=" flex items-center cursor-pointer  px-1 py-2 justify-between text-ashShade-2 "
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <span className="flex items-center gap-x-2">
            {React.createElement(iconleft, { size: 16, color: '#9099A8' })}
            <span className=" text-sm  whitespace-nowrap">{text}</span>
          </span>
          {iconRight &&
            React.createElement(iconRight, {
              size: 16,
              color: '#9099A8'
            })}
        </>
      )}
    </span>
  );
}

function DocOptions({ text, iconleft, iconRight, onClick }: OptionProps) {
  return (
    <span
      onClick={() => onClick()}
      className=" flex items-center cursor-pointer  px-1 py-2 justify-between text-ashShade-2 "
    >
      <span className="flex items-center gap-x-2">
        {React.createElement(iconleft, { size: 16, color: '#9099A8' })}
        <span className=" text-sm  whitespace-nowrap">{text}</span>
      </span>
      {iconRight &&
        React.createElement(iconRight, {
          size: 16,
          color: '#9099A8'
        })}
    </span>
  );
}

export { DocOptions };
export default Options;
