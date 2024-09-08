import React, { FC, useState, useEffect, useRef, memo } from 'react';
import { AiOutlineCheck, AiOutlineLoading } from 'react-icons/ai';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import IconInput from '../IconInput';
import { RxDividerHorizontal } from 'react-icons/rx';
import { centered, errorStyle, flexer } from 'constants/globalStyles';
import { IoMdClose } from 'react-icons/io';
import { TbChevronDown, TbChevronUp } from 'react-icons/tb';
import { IoClose } from 'react-icons/io5';
import { truncateText } from '../utils';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';

export type TOption = {
  value: string;
  icon?: string;
  label?: string; // incase its not provided, we render the actual value
};

export interface SelectProps {
  onChange: (value: string[]) => void;
  showSearch?: boolean;
  placeholder?: string;
  className?: string;
  data?: TOption[];
  value?: string[];
  error?: string;
  label?: string;
  disabled?: boolean;
  showAcheck?: boolean;
  isLoading?: boolean;
  wrapperClassName?: string;
  labelClassName?: string;
  initialValue?: string[];
  placeholderClassName?: string;
  modalClassName?: string;
  showClearButton?: boolean;
  onClear?: () => void;
}

const SelectField: FC<SelectProps> = ({
  label,
  placeholder,
  data,
  isLoading,
  showAcheck,
  labelClassName,
  showSearch,
  showClearButton,
  modalClassName,
  onChange
}) => {
  const [options, setOptions] = useState(false);
  const [localValue, setLocalValue] = useState<string[]>([]);
  const [query, setQuery] = useState('');

  const toggleModal = () => {
    setOptions(!options);
  };

  const handleChange = (val: TOption) => {
    if (localValue.includes(val.value)) {
      setLocalValue(localValue.filter((m) => m !== val.value));
    } else {
      setLocalValue([...localValue, val.value]);
    }
  };

  const deleteVal = (val: string) => () => {
    setLocalValue([...localValue].filter((m) => m !== val));
  };
  let optionsRef = useRef(null);

  useClickOutSideComponent(optionsRef, () => {
    setOptions(false);
  });
  let uniqueClassName = '';

  useEffect(() => {
    onChange(localValue);
  }, [localValue]);
  return (
    <div>
      <div className={` my-3 relative `}>
        <p className={`text-sm text-bash font-semibold `}>{label}</p>
        <div
          onClick={toggleModal}
          className={`border mt-1 rounded-md px-4 flex items-center justify-between py-2`}>
          <div
            // onClick={(e) => {
            //   e.stopPropagation();
            // }}
            className=" flex-1 flex items-center gap-x-2 overflow-x-auto">
            {localValue.length > 0 ? (
              <>
                {localValue.map((m) => (
                  <span className=" whitespace-nowrap  bg-ashShade-3 flex items-center rounded-md p-1 text-sm font-semibold ">
                    {truncateText(m, 20)}
                    <span onClick={deleteVal(m)} className="p-0.5">
                      <IoClose className=" ml-1 " />
                    </span>
                  </span>
                ))}
              </>
            ) : (
              <span className={` text-bash font-semibold`}>{placeholder ?? 'Select'}</span>
            )}
          </div>

          {React.createElement(options ? TbChevronUp : TbChevronDown, {
            size: 16,
            color: '#9099A8'
          })}
        </div>

        {options && (
          <div
            ref={optionsRef}
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
                  data
                    ?.filter((m) => !localValue.includes(m.value))
                    .map(({ value, label, icon }, index) =>
                      showAcheck ? (
                        <div
                          className={`
                      flex items-center px-1 py-1 rounded-md whitespace-nowrap 
                      hover:bg-blue-100 hover:text-bblue w-full
                      ${!localValue.includes(value) ? 'pl-5' : 'bg-bblue'} 
                      ${index ? null : 'mt-1'}
                    `}>
                          {localValue.includes(value) ? (
                            <AiOutlineCheck className="text-white text-base mr-1" />
                          ) : null}
                          <p
                            className={`
                          w-full cursor-pointer truncate !text-left flex-[.95]
                          ${!localValue.includes(value) ? '' : 'text-white'}
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
      </div>
    </div>
  );
};

export default memo(SelectField);
