import React, { FC, useState, useEffect, useRef } from 'react';
import { IoIosClose } from 'react-icons/io';
import { BsChevronDown, BsChevronUp, BsSearch } from 'react-icons/bs';
import { errorStyle, flexer, hoverFade } from '../../../constants/globalStyles';
import IconInput from '../IconInput';

interface Props {
  onChange: (value: string[] | string) => void;
  showSearch?: boolean;
  placeholder: string;
  label: string;
  value?: string[];
  data?: string[];
  styles?: any;
  max?: number;
  error?: string;
  disabled?: string;
  className?: string;
}

const LabelPicker: FC<Props> = ({
  label,
  value,
  onChange,
  error,
  max = 3,
  className,
  showSearch,
  disabled = false,
  data
}) => {
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState<string>();
  const [showModal, setModal] = useState<boolean>(false);
  //
  const container = useRef<HTMLDivElement | null>(null);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  useEffect(() => {
    // clicke event that's incharge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.contains(container.current)) {
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
    if (data) {
      if (query) {
        const newresults = data.filter((one) => one.toLowerCase().includes(query.toLowerCase()));
        setResults(newresults);
      } else {
        setResults(data);
      }
    }
  }, [query, data]);

  const handleAdd = (location: string) => {
    if (!value) return onChange([location]);

    const arr = [...value];

    if (arr.length < max) {
      // check if a location does not already exists
      const exists = arr.find((one) => one === location);
      if (!exists) {
        arr.push(location);
        onChange(arr);
      }
    }
  };

  const handleRemove = (location: string) => {
    // if value in null, create a new array with the value

    const arr = value || [location];

    const newArr = arr.filter((one) => one !== location);

    onChange(newArr);
  };

  return (
    <div className={'w-full flex my-3 relative flex-col ' + className} ref={container}>
      <label className="font-Medium text-bash text-sm">{label}</label>
      <div
        className={
          flexer +
          `p-2 cursor-pointer border border-bash rounded-md ${disabled && 'bg-gray-50'} mt-1`
        }
        onClick={toggleModal}
      >
        <div className="flex-1 flex items-center overflow-x-scroll">
          {value && value[0] ? (
            React.Children.toArray(
              value.map((one) => (
                <div
                  className={
                    'flex items-center p-1 bg-blue-100 rounded-md mr-2 cursor-pointer' + hoverFade
                  }
                  onClick={() => handleRemove(one)}
                >
                  <p className="text-blue-600 text-sm">{one}</p>
                  <IoIosClose className="text-blue-700 ml-2 text-lg" />
                </div>
              ))
            )
          ) : (
            <label className="text-bash p-1 text-sm">Select </label>
          )}
        </div>
        {showModal ? (
          <BsChevronUp className="text-bash ml-auto" />
        ) : (
          <BsChevronDown className="text-bash ml-auto" />
        )}
      </div>
      <p className={errorStyle}>{error || null}</p>
      {showModal && (
        <div className="absolute w-full top-full left-0 z-20 rounded-md shadow-lg p-3 bg-white">
          {showSearch && (
            <IconInput
              value={query}
              Icon={BsSearch}
              placeholder="Search"
              onChange={(val) => setQuery(val)}
            />
          )}
          <div className="max-h-40 overflow-y-scroll">
            {
              // creating unique keys
              React.Children.toArray(
                results.map((one, index) => (
                  <p
                    className={`px-5 py-1 rounded-md w-full cursor-pointer hover:bg-blue-100 hover:text-bblue ${
                      index ? null : 'mt-1'
                    } `}
                    onClick={() => handleAdd(one)}
                  >
                    {one}
                  </p>
                ))
              )
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default LabelPicker;
