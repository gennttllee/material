import React, { FC, FocusEvent, memo, ReactNode, useEffect, useRef } from 'react';
import { IconType } from 'react-icons';
import { errorStyle } from '../../../constants/globalStyles';
import { formatNumberWithCommas, parseNumberWithoutCommas } from 'helpers';
import useFocus from 'Hooks/useFocus';

export type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  handleChange?: (value: string) => void;
  onLabelClick?: (label: string) => void;
  ContainerClassName?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  showDimensions?: boolean;
  LeftIconProp?: ReactNode;
  IconProp?: ReactNode;
  Icon?: IconType;
  error?: string;
  label: string;
  register?: any;
  maximum?: number;
  addCommars?: boolean;
  value?: string | number;
  isTextArea?: boolean;
};

const InputField: FC<InputProps> = ({
  handleChange,
  Icon,
  error,
  label,
  IconProp,
  LeftIconProp,
  labelClassName,
  ContainerClassName,
  wrapperClassName,
  register,
  onLabelClick,
  showDimensions = false,
  addCommars = false,
  maximum = 0,
  isTextArea,
  ...rest
}) => {
  const { focused, setFocus } = useFocus();
  const plainInputRef = useRef<any>(null);
  const inputRef = useRef<any>(null);

  const onFocus = (e?: FocusEvent<HTMLInputElement>) => {
    if (e) e.stopPropagation();
    /**
     * when an input if focused
     * and the user assigned type is number
     * * it should change type back to number
     */
    setFocus(true);
    if (rest.type === 'number' && rest.value && addCommars) {
      inputRef.current.type = 'number';
      inputRef.current.value = rest.value;
    }
  };

  const onBlur = (e?: FocusEvent<HTMLInputElement>) => {
    if (e) e.stopPropagation();
    /**
     * when an input if focused
     * and the user's assigned type is number
     * * it should change type to text to be able to append commas
     */
    setFocus(false);
    if (
      rest.type === 'number' &&
      addCommars &&
      rest.value &&
      addCommars &&
      !isNaN(Number(rest.value || 0))
    ) {
      inputRef.current.type = 'text';
      inputRef.current.value = Number(rest.value || 0).toLocaleString();
    }
  };

  const handleCommars = () => {
    if (rest.value && inputRef.current && !focused && !isNaN(Number(rest.value || 0))) {
      inputRef.current.type = 'text';
      inputRef.current.value = Number(rest.value || 0).toLocaleString();
    }
  };

  useEffect(() => {
    if (rest.type === 'number' && rest.value && addCommars) {
      handleCommars();
    }
    // eslint-disable-next-line
  }, [rest]);

  useEffect(() => {
    if (rest.defaultValue) {
      plainInputRef.current.value = rest.defaultValue;
      // if (rest.onChange) rest.onChange(rest.defaultValue as any);
    }
  }, []);

  const inputStyle =
    'flex-1 placeholder-ashShade-4 font-Medium outline-none py-2 rounded-md w-full ' +
    rest.className;

  return (
    <div key={label} className={'my-3 overflow-hidden w-full ' + ContainerClassName}>
      <label className={`text-bash font-Medium capitalize text-sm ${labelClassName}`}>
        {label}
      </label>
      <div
        className={
          `border ${
            focused ? 'border-bblue' : 'border-ashShade-4'
          } rounded-md flex items-center px-4 mt-1 ` + wrapperClassName
        }>
        {LeftIconProp}
        {
          /**
           * when an input if of type number we need,
           * to add commas within the number for better ux,
           * which register prohibits when destructured in an input
           */
          rest.type === 'number' ? (
            <input
              ref={inputRef}
              onChange={(e) => {
                if (handleChange) handleChange(e.target.value);
              }}
              {...rest}
              className={inputStyle}
              onFocus={onFocus}
              onBlur={onBlur}
              min={0}
            />
          ) : isTextArea ? (
            <textarea {...rest} {...register} className={inputStyle} />
          ) : (
            <input
              {...register}
              {...rest}
              className={inputStyle}
              onFocus={(e) => {
                setFocus(true);
                if (rest.onFocus) {
                  rest.onFocus(e);
                }
              }}
              onBlur={(e) => {
                setFocus(false);
                if (rest.onFocus) {
                  rest.onFocus(e);
                }
              }}
            />
          )
        }
        {IconProp}
      </div>
      {!rest.value || Number(rest.value) > maximum || error ? (
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
const InputFieldWithRef: FC<InputProps> = ({
  handleChange,
  Icon,
  error,
  label,
  IconProp,
  LeftIconProp,
  ContainerClassName,
  wrapperClassName,
  register,
  onLabelClick,
  showDimensions = false,
  addCommars = false,
  maximum = 0,
  ...rest
}) => {
  const inputRef = useRef<any>(null);
  const plainInputRef = useRef<any>(null);

  const onBlur = (e?: FocusEvent<HTMLInputElement>) => {
    if (e) e.stopPropagation();
    /**
     * when an input if focused
     * and the user's assigned type is number
     * * it should change type to text to be able to append commas
     */
    if (
      rest.type === 'number' &&
      addCommars &&
      rest.value &&
      addCommars &&
      !isNaN(Number(rest.value || 0))
    ) {
      inputRef.current.value = formatNumberWithCommas(Number(rest.value) || 0);
    }
  };

  useEffect(() => {
    if (rest.type === 'number' && rest.value && addCommars) {
      // if initial the input has values, and commas immediately
      inputRef.current.value = formatNumberWithCommas(Number(rest.value) || 0);
    }
    // eslint-disable-next-line
  }, [rest]);

  useEffect(() => {
    if (rest.defaultValue) {
      plainInputRef.current.value = rest.defaultValue;
      // if (rest.onChange) rest.onChange(rest.defaultValue as any);
    }
  }, []);

  const inputStyle =
    'flex-1 placeholder-ashShade-4 font-Medium outline-none py-2 rounded-md w-full ' +
    rest.className;

  return (
    <div key={label} className={'my-3 overflow-hidden w-full ' + ContainerClassName}>
      <label className="text-bash font-Medium capitalize text-sm">{label}</label>
      <div className={'border border-bash rounded-md flex items-center px-4 ' + wrapperClassName}>
        {
          /**
           * when an input if of type number we need,
           * to add commas within the number for better ux,
           * which register prohibits when distructured in an input
           */
          rest.type === 'number' ? (
            <input
              ref={inputRef}
              onChange={(e) => {
                const newValue = parseNumberWithoutCommas(e.target.value);
                // prevent users from providing text input (only numbers)
                if (/^[0-9e]*$/.test(newValue) && handleChange) {
                  handleChange(newValue);
                }
              }}
              {...rest}
              type="text"
              className={inputStyle}
              onBlur={onBlur}
              min={0}
            />
          ) : (
            <input {...rest} ref={plainInputRef} {...register} className={inputStyle} />
          )
        }
        {IconProp || null}
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
let InputFieldWithRef_ = memo(InputFieldWithRef);
export { InputFieldWithRef_ };
export default memo(InputField);
