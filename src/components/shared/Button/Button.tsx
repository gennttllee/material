import { AiOutlineCheck, AiOutlineLoading } from 'react-icons/ai';
import { CSSProperties, ForwardRefRenderFunction, MouseEvent, ReactNode, forwardRef } from 'react';

interface Props {
  // ref?: React.RefObject<HTMLButtonElement>;
  text: string | ReactNode;
  isLoading?: boolean;
  onClick?: (ev?: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
  type?: 'primary' | 'secondary' | 'muted' | 'danger' | 'transparent' | 'plain';
  className?: string;
  id?: string;
  LeftIcon?: ReactNode;
  RightIcon?: ReactNode;
  style?: CSSProperties;
  textStyle?: string;
  iconStyle?: string;
  key?: string;
  disabled?: boolean;
  success?: boolean;
  btnHasEvent?: boolean;
  btnType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
}

export const btnStyle =
  'bg-bblue rounded-lg py-2 px-8 border font-Medium text-lg text-white cursor-pointer';

const Button: ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  {
    btnType,
    success = false,
    text,
    key,
    onClick,
    type,
    id,
    className,
    RightIcon,
    LeftIcon,
    style,
    textStyle,
    iconStyle,
    btnHasEvent,
    disabled = false,
    isLoading = false
  },
  ref
) => {
  const onClickHandler = (ev: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    // if not loading, emit the event
    if (!isLoading && onClick) {
      onClick(btnHasEvent ? ev : undefined);
    }
  };

  const typeBasedStyles = () => {
    switch (type) {
      case 'secondary':
        return 'border border-black !bg-transparent  hover:!bg-gray-100 hover:bg-pbg !text-black';
      case 'danger':
        return 'bg-bred';
      case 'muted':
        return '!bg-ashShade-3 border border-ashShade-2 !text-ashShade-2';
      case 'transparent':
        return 'bg-transparent hover:!bg-blue-100 !border-bblue hover:border-transparent !text-bblue';
      case 'plain':
        return 'bg-transparent    ';
      default:
        break;
    }
  };

  if (success)
    return (
      <button
        id={id}
        ref={ref}
        key={key}
        style={style}
        type={btnType}
        data-testid="btn"
        onClick={onClickHandler}
        className={`${btnStyle} ${type} Button ${typeBasedStyles()} ${className} bg-gradient-to-l from-green-700 to-green-600`}>
        <AiOutlineCheck className="text-white mx-10" />
      </button>
    );

  return (
    <button
      id={id}
      ref={ref}
      key={key}
      style={style}
      type={btnType}
      data-testid="btn"
      onClick={onClickHandler}
      disabled={disabled || type === 'muted' || isLoading}
      className={`${btnStyle} ${type} Button ${typeBasedStyles()} ${className} relative flex items-center justify-center hover:opacity-90`}>
      {LeftIcon}
      <AiOutlineLoading
        className={`animate-spin mx-2 my-1 absolute ${
          !isLoading && 'opacity-0'
        } cursor-pointer ${iconStyle}`}
      />
      <span
        className={`${
          isLoading && 'opacity-0'
        } whitespace-nowrap cursor-pointer text-sm md:text-base ${textStyle}`}>
        {text}
      </span>
      {RightIcon}
    </button>
  );
};

export default forwardRef<HTMLButtonElement, Props>(Button);
