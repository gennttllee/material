import useFocus from 'Hooks/useFocus';
import { errorStyle, hoverFade } from 'constants/globalStyles';
import { FC, ReactNode, useRef } from 'react';
import { IconType } from 'react-icons';

type Props = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  IconProp?: ReactNode;
  Icon?: IconType;
  label: string;
  error?: string;
  register?: any;
  ContainerClassName?: string;
  wrapperClassName?: string;
};

const TextArea: FC<Props> = ({
  wrapperClassName,
  ContainerClassName,
  register,
  error,
  Icon,
  label,
  IconProp,
  ...rest
}) => {
  const { focused, setFocus } = useFocus();
  const inputStyle = 'bg-transparent w-full outline-none ' + rest.className;
  return (
    <div key={label} className={'my-3 overflow-hidden w-full ' + ContainerClassName}>
      <label className="text-bash font-Medium capitalize text-sm">{label}</label>
      <div
        className={
          `border ${
            focused ? 'border-bblue' : 'border-ashShade-4'
          } relative rounded-md mt-1 flex items-center ` + wrapperClassName
        }>
        <textarea
          {...rest}
          {...register}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          className={'pl-4 pt-4 ' + inputStyle}
        />
        {Icon ? <Icon className={'text-bash' + hoverFade} /> : null}
        {IconProp || null}
      </div>
      <p className={errorStyle}>{error}</p>
    </div>
  );
};

export default TextArea;
