import { FC } from 'react';
import { InputProps } from '../InputField/InputField';
import { errorStyle } from 'constants/globalStyles';
import useFocus from 'Hooks/useFocus';

const NumericInput: FC<InputProps> = ({
  label,
  error,
  register,
  IconProp,
  maximum = 0,
  min = 0,
  onLabelClick,
  showDimensions,
  wrapperClassName,
  ContainerClassName,
  ...rest
}) => {
  const { focused, setFocus } = useFocus();

  const inputStyle =
    'flex-1 placeholder-ashShade-4 font-Medium outline-none py-2 rounded-md w-full ' +
    rest.className;

  return (
    <div key={label} className={'my-3 overflow-hidden w-full ' + ContainerClassName}>
      <label className="text-bash font-Medium capitalize text-sm">{label}</label>
      <div
        className={
          `border ${
            focused ? 'border-bblue' : 'border-ashShade-4'
          }  focus:border-bblue rounded-md flex items-center px-4 mt-1` + wrapperClassName
        }>
        <input
          {...{ ...rest, min }}
          {...register}
          className={inputStyle}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {IconProp ? IconProp : null}
      </div>
      {!rest.value || Number(rest.value) > maximum ? (
        <p className={errorStyle}>{error}</p>
      ) : (
        showDimensions && (
          <p
            onClick={() => {
              if (onLabelClick) onLabelClick(label);
            }}
            className="hover:opacity-90 text-blue-600 cursor-pointer">
            Set dimensions
          </p>
        )
      )}
    </div>
  );
};

export default NumericInput;
