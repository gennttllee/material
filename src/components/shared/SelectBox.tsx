import { useMemo, useState, createElement, useRef } from 'react';
import caretup from '../../assets/caretup.svg';
import caretdown from '../../assets/caretdown.svg';
import { TbSearch, TbChevronDown, TbChevronUp } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';

type Selection = {
  label: string;
  value: string;
};
interface Props {
  setter: any;
  state: string;
  options: Selection[];
  placeholder: string;
}

const SelectBox = ({ setter, state, options, placeholder }: Props) => {
  const [toggle, setToggle] = useState(false);
  let optionsRef = useRef<any>();
  useClickOutSideComponent(optionsRef, () => {
    setToggle(false);
  });
  const checkforLabel = (val: string) => {
    for (let i = 0; i < options.length; i++) {
      if (options[i]['value'] === val) {
        return options[i]['label'];
      }
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setToggle(!toggle)}
        className="flex  w-full justify-between items-center cursor-pointer px-4 py-3 border rounded-lg border-ashShade-3 p-4">
        <span className="">{state === '' ? placeholder : checkforLabel(state)}</span>
        {''}

        {createElement(toggle ? TbChevronUp : TbChevronDown, {
          size: 24,
          color: '#9099A8'
        })}
      </div>
      {toggle ? (
        <div
          ref={optionsRef}
          className="w-full bg-white shadow-bnkle  absolute border  z-20 border-ashShade-3  mt-1 rounded-lg max-h-36 overflow-y-scroll">
          {options.map((op, i) => (
            <div
              key={i}
              onClick={() => {
                setter(op.value);
                setToggle(!toggle);
              }}
              className={`${
                op.value === state ? ' bg-lightblue text-bblue' : ' text-bash'
              } hover:bg-lightblue hover:text-bblue cursor-pointer pl-4 py-2 rounded-md`}>
              {op.label}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

const DocSelectBox = ({
  setter,
  state,
  options,
  placeholder,
  onSelectNew
}: Props & { onSelectNew: () => void }) => {
  const [toggle, setToggle] = useState(false);

  const label = useMemo(() => {
    for (let i = 0; i < options.length; i++) {
      if (options[i]['value'] === state) {
        return options[i]['label'];
      }
    }
    return placeholder;
  }, [state]);
  const checkforLabel = (val: string) => {
    for (let i = 0; i < options.length; i++) {
      if (options[i]['value'] === val) {
        return options[i]['label'];
      }
    }
  };
  return (
    <div className="relative">
      <div
        onClick={() => setToggle(!toggle)}
        className="flex  w-full justify-between cursor-pointer  border rounded-lg border-ashShade-2 px-4 py-2">
        <span className={state ? 'text-bash' : ''}>{label}</span>
        {''}
        <img
          loading="lazy"
          decoding="async"
          src={toggle ? caretup : caretdown}
          className={'w-2'}
          alt="caret"
        />
      </div>
      {toggle ? (
        <div className="w-full bg-white  absolute border z-20   mt-1 rounded-lg ">
          <div className="px-4 py-6 max-h-40 overflow-y-scroll">
            {options
              .filter((m) => m.value !== 'other_+=')
              .map((op, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setter(op.value);
                    setToggle(!toggle);
                  }}
                  className={`${
                    op.value === state ? ' bg-lightblue text-bblue' : ' text-bash'
                  } hover:bg-lightblue cursor-pointer px-4 rounded py-2`}>
                  {op.label}
                </div>
              ))}
          </div>
          <div
            onClick={() => {
              onSelectNew();
              setToggle(false);
            }}
            className="w-full cursor-pointer py-4 border-t border-t-ashShade-3 text-center text-bblue">
            + New Folder
          </div>
        </div>
      ) : null}
    </div>
  );
};

interface DropDownOptionsProps {
  options: { value: string; label: string }[];
  value: any;
  closer: () => void;
  onSelect: (x: any) => void;
  onSelectNew?: () => void;
  newButtonLabel?: string;
  showSearch?: boolean;
}
const DropDownOptions = ({
  options,
  value,
  closer,
  onSelect,
  onSelectNew,
  newButtonLabel,
  showSearch
}: DropDownOptionsProps) => {
  const [toggle, setToggle] = useState(false);
  const [filter, setFilter] = useState('');

  const list = useMemo(() => {
    return options.filter(
      (m) => m.value.toLowerCase().includes(filter) || m.label.toLowerCase().includes(filter)
    );
  }, [filter]);

  const checkforLabel = (val: string) => {
    for (let i = 0; i < options.length; i++) {
      if (options[i]['value'] === val) {
        return options[i]['label'];
      }
    }
  };
  return (
    <div className=" bg-white border border-ashShade-2 py-6 rounded-lg shadow-bnkle ">
      <div className="px-3">
        {showSearch && (
          <div className="w-full rounded-md flex items-center py-2 px-4 border border-ashShade-2 ">
            <TbSearch className="text-bash" />
            <input
              value={filter}
              placeholder="search"
              onChange={(e) => {
                setFilter(e.target.value);
              }}
              className="flex-1 ml-2  border-0 outline-none"
            />
          </div>
        )}

        <div className="w-full bg-white py-2 z-20   mt-1 ">
          <div className=" max-h-40 overflow-y-scroll">
            {list.map((op, i) => (
              <div
                key={i}
                onClick={() => {
                  onSelect(op);
                  closer();
                }}
                className={`${
                  op.value === value ? ' bg-lightblue text-bblue' : ' text-bash'
                } hover:bg-lightblue  cursor-pointer px-4 rounded-md py-2`}>
                {op.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          if (onSelectNew) onSelectNew();
          // setToggle(false);
        }}
        className="w-full cursor-pointer py-2 border-t border-t-ashShade-3 text-center text-bblue">
        + {newButtonLabel ? newButtonLabel : ''}
      </div>
    </div>
  );
};

export { DocSelectBox, DropDownOptions };
export default SelectBox;
