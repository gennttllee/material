import Button from 'components/shared/Button';
import { errorStyle, flexer, hoverFade } from 'constants/globalStyles';
import { formatNumberWithCommas } from 'helpers';
import React, { ReactNode, memo, useEffect, useMemo, useState } from 'react';
import { TbEdit } from 'react-icons/tb';

interface InputSectionWithBorderProps {
  Children: React.FC;
  placeholder?: string;
  placeholderSub?: React.ReactNode;
  placeholderClassName?: string;
  clickablePlaceholder?: boolean;
  error: string | undefined;
  hasBorderBottom?: boolean;
  labelClassName?: string;
  localizeText?: boolean;
  autoSave?: boolean;
  header: string;
  label: string;
  value?: any;
}

export interface IChildComponentProps {
  onClick: () => void;
}

const InputSectionWithBorder = ({
  Children,
  placeholder,
  placeholderSub, // shows instead on the placeholder JSX
  labelClassName,
  clickablePlaceholder,
  placeholderClassName,
  hasBorderBottom = true,
  localizeText,
  autoSave,
  header,
  error,
  label,
  value
}: InputSectionWithBorderProps) => {
  const [show, setShow] = useState(false);
  const [initialValue, setInitialValue] = useState();

  const hasChanges = useMemo(
    () => String(value).length !== String(initialValue).length,
    [initialValue, value]
  );

  const toggleShow = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    setInitialValue(show ? value : undefined);
  }, [show]);

  const placeholderWithProps = React.Children.map(placeholderSub, (child: ReactNode) => {
    if (React.isValidElement(child) && clickablePlaceholder) {
      // Use a type assertion to specify the expected child props
      return React.cloneElement(child, {
        onClick: toggleShow
      } as IChildComponentProps); // Replace with your actual child component's props type
    }
    return child;
  });

  return (
    <div className="w-full mt-4" key={label.replace(/' '/g, '')}>
      <div className={flexer + 'mb-2'}>
        <label
          onClick={toggleShow}
          className={`text-black font-Medium capitalize text-base ${labelClassName}`}>
          {label}
        </label>
        {!show && <TbEdit className={'text-slate-400' + hoverFade} onClick={toggleShow} />}
      </div>
      {show ? (
        <div className="border rounded-md w-full">
          <div className="border-b p-4">
            <div className={flexer + 'pb-2'}>
              <label className="text-slate-800 font-Medium capitalize text-sm">{header}</label>
              <button onClick={toggleShow} className="font-Medium text-bash">
                Close
              </button>
            </div>
            <Children />
          </div>
          <div className={flexer + 'py-2 px-4'}>
            <button onClick={toggleShow} className="font-Medium text-lg text-red-700">
              Cancel
            </button>
            <Button
              text="Done"
              onClick={() => {
                setInitialValue(undefined);
                toggleShow();
              }}
              type={hasChanges || autoSave ? 'primary' : 'muted'}
            />
          </div>
        </div>
      ) : (
        placeholderWithProps || (
          <p
            className={`capitalize pb-4 ${hasBorderBottom && 'border-b'}  ${
              value ? 'text-slate-800 ' : placeholderClassName || ' !text-red-700 '
            } `}>
            {localizeText && value
              ? formatNumberWithCommas(Number(value))
              : value || placeholder || 'Not Set'}
          </p>
        )
      )}
      <p className={errorStyle + 'mt-3'}>{error}</p>
    </div>
  );
};

export default memo(InputSectionWithBorder);
