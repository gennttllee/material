import { hoverFade } from 'constants/globalStyles';
import { BiRadioCircle, BiRadioCircleMarked } from 'react-icons/bi';

function RadioBtn({
  label,
  pressed,
  onChange
}: {
  label: string;
  pressed: boolean;
  onChange: () => void;
}) {
  return (
    <div
      onClick={onChange}
      className={`flex items-center ${hoverFade} ${!pressed ? '!text-bash' : '!text-bblue'}`}
    >
      {pressed ? (
        <BiRadioCircleMarked className="text-xl" />
      ) : (
        <BiRadioCircle className="text-xl" />
      )}
      <p className="text-base ml-2 capitalize">{label}</p>
    </div>
  );
}

export default RadioBtn;
