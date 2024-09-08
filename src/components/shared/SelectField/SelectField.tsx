import React, { FC, useState, useEffect, useRef, memo } from 'react';
import { AiOutlineCheck, AiOutlineLoading } from 'react-icons/ai';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import IconInput from '../IconInput';
import { RxDividerHorizontal } from 'react-icons/rx';
import { centered, errorStyle, flexer } from 'constants/globalStyles';
import { IoMdClose } from 'react-icons/io';

export type TOption = {
  value: string;
  icon?: string;
  label?: string; // incase its not provided, we render the actual value
};

export interface SelectProps {
  onChange: (value: string) => void;
  showSearch?: boolean;
  placeholder?: string;
  className?: string;
  data?: TOption[];
  value?: string;
  error?: string;
  label?: string;
  disabled?: boolean;
  showAcheck?: boolean;
  isLoading?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  initialValue?: string;
  placeholderClassName?: string;
  modalClassName?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

const SelectField: FC<SelectProps> = ({
  error,
  value,
  label,
  placeholderClassName,
  wrapperClassName,
  modalClassName,
  labelClassName,
  showAcheck,
  onChange,
  data = [],
  placeholder,
  className,
  disabled = false,
  isLoading = false,
  showSearch = false,
  initialValue,
  showClearButton,
  onClear
}) => {
  const [customData, setCustomData] = useState<TOption[]>([]);
  const [showModal, setModal] = useState<boolean>(false);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const [localValue, setLocalValue] = useState<{
    value: string;
    icon?: string;
  }>();
  const [query, setQuery] = useState<string>();
  const uniqueClassName = `pickerRef${label?.replace(/\s/g, '')}`;
  //
  const handleLabelChange = (value: string | undefined) => {
    if (value) {
      /**
       * when the valued is updated,
       * it find the corresponding value
       * in the data, and sets it label
       */
      for (const one of data) {
        if (one.value === value || one.label === value) {
          setLocalValue({ value: one.label || one.value, icon: one.icon });
        }
      }
    } else {
      setLocalValue(undefined);
      setQuery(undefined);
    }
  };

  const handleInitialLabelChange = (value: string | undefined) => {
    if (value) {
      /**
       * when the valued is updated,
       * it find the corresponding value
       * in the data, and sets it label
       */
      for (const one of data) {
        if (one.value === value) {
          setLocalValue({ icon: one.icon, value: one.label || one.value });
          return one.value;
        }
      }
    } else {
      setLocalValue(undefined);
    }
  };

  useEffect(() => {
    handleLabelChange(value);
  }, [value, data]);

  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(selectRef.current) || !e.target.classList.contains(uniqueClassName))
      ) {
        setModal(false);
      }
    });
    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setModal(false);
      });
    };
  }, []);

  useEffect(() => {
    if (initialValue) {
      onChange(handleInitialLabelChange(initialValue) || '');
    }
  }, [selectRef.current]);

  useEffect(() => {
    if (query) {
      const newData = data.filter(
        ({ value, label }) =>
          String(value).toLowerCase().includes(query.toLowerCase()) ||
          String(label).toLowerCase().includes(query.toLowerCase())
      );
      setCustomData(newData);
    } else {
      setCustomData(data);
    }
  }, [query, data]);

  const toggleModal = () => {
    if (!disabled) setModal((prev) => !prev);
  };

  const handleChange = ({ value, label, icon }: TOption) => {
    onChange(value);
    setLocalValue({ icon: icon, value: label || value });
    toggleModal();
  };

  return (
    <div
      className={`w-full flex my-3 relative flex-col ${uniqueClassName} ` + className}
      ref={selectRef}>
      {label ? (
        <label className={`font-Medium text-bash text-sm ${labelClassName}`}>{label}</label>
      ) : null}
      <button
        type="button"
        className={
          flexer +
          `px-4 cursor-pointer border !w-full !max-w-full ${
            showModal ? 'border-bblue' : 'border-ashShade-4'
          }  rounded-md ${disabled && 'bg-gray-50'} mt-1 ${wrapperClassName} ${uniqueClassName}`
        }
        onClick={toggleModal}>
        {localValue ? (
          <p
            className={
              'py-2 !text-black font-Medium !w-full !max-w-full truncate flex-[.95] !text-left ' +
              uniqueClassName
            }>
            {localValue.icon} {localValue.value}
          </p>
        ) : (
          <p
            className={` !text-gray-400 py-2 truncate flex-[.95] !text-left 
              ${uniqueClassName} ${placeholderClassName} `}>
            {value || placeholder || 'Choose'}
          </p>
        )}

        <div className={centered}>
          {showClearButton && value !== '' && (
            <span
              onClick={() => {
                if (onClear) onClear();
              }}
              className="mr-2 p-1 hover:bg-ashShade-0 rounded-full self-end ">
              <IoMdClose size={20} className="text-bash" />
            </span>
          )}
          {disabled ? (
            <RxDividerHorizontal className="text-bash" />
          ) : showModal ? (
            <BsChevronUp className={'text-bash ' + uniqueClassName} />
          ) : (
            <BsChevronDown className={'text-bash ' + uniqueClassName} />
          )}
        </div>
      </button>
      {showModal && (
        <div
          className={`absolute w-full top-full left-0 z-20 rounded-md shadow-lg p-3 bg-white ${modalClassName} ${uniqueClassName}`}>
          {showSearch && (
            <IconInput
              value={query}
              placeholder="Search"
              style={{ padding: 0 }}
              className={uniqueClassName}
              onChange={(val) => setQuery(val)}
            />
          )}

          <div className="max-h-40 h-fit overflow-y-scroll">
            {isLoading ? (
              <div className="flex mt-1 items-center px-5 py-1 rounded-md w-full bg-gray-100">
                <AiOutlineLoading className="animate-spin text-gray-700 mr-2 text-sm" />
                <p className="font-Medium text-black">Loading</p>
              </div>
            ) : (
              // creating unique keys
              React.Children.toArray(
                customData.map(({ value, label, icon }, index) =>
                  showAcheck ? (
                    <div
                      className={`
                      flex items-center px-1 py-1 rounded-md whitespace-nowrap 
                      hover:bg-blue-100 hover:text-bblue w-full
                      ${value !== localValue?.value ? 'pl-5' : 'bg-bblue'} 
                      ${index ? null : 'mt-1'}
                    `}>
                      {localValue?.value === value ? (
                        <AiOutlineCheck className="text-white text-base mr-1" />
                      ) : null}
                      <p
                        className={`
                          w-full cursor-pointer truncate !text-left flex-[.95]
                          ${value !== localValue?.value ? '' : 'text-white'}
                        `}
                        onClick={() => handleChange({ value, label, icon })}>
                        {' '}
                        {label || value}
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`py-1 px-2 rounded-md w-full cursor-pointer !text-left truncate flex-1 hover:bg-blue-100 hover:text-bblue ${
                        index ? null : 'mt-1'
                      } ${labelClassName}`}
                      onClick={() => handleChange({ value, label, icon })}>
                      {icon} {label || value}
                    </p>
                  )
                )
              )
            )}
          </div>
        </div>
      )}
      <p className={errorStyle}>{!localValue ? error : null}</p>
    </div>
  );
};

export default memo(SelectField);
