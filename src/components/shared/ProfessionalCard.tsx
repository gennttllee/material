import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BsFillPatchCheckFill, BsPatchCheckFill } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import useContractorDetails from 'Hooks/useContractorDetails';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { useAppSelector } from 'store/hooks';
import { TbChevronUp, TbChevronDown } from 'react-icons/tb';
import { Persona } from 'types';
import useProfessionals from 'Hooks/useProfessionals';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
interface Prop {
  self: any;
  islist?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const ProfessionalCard = ({ self, islist, onClick, isSelected }: Prop) => {
  const [loaderror, setLoaderror] = useState(false);

  let image = self?.businessInfromation?.logo;
  return (
    <div
      onClick={(e) => {
        if (onClick) onClick();
      }}
      className={
        'w-full items-center cursor-pointer flex justify-between py-2 px-3 rounded-lg hover:bg-ashShade-0'
      }>
      <div className="flex items-center">
        <span className=" mr-2 rounded-full bg-ashShade-3">
          {!image || loaderror ? (
            <TbBuildingSkyscraper size={32} className="m-2" />
          ) : (
            <img
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-full object-cover "
              src={image}
              onError={() => setLoaderror(true)}
              alt="img"
            />
          )}
        </span>
        <div>
          <div className="flex items-center ">
            <span className="mr-2 font-semibold text-bblack-0">
              {self?.name ? self.name : self?.firstName}
            </span>
            {self?.isVerified?.account && <BsPatchCheckFill color="green" size={14} />}
          </div>
          <div className=" text-bash text-sm">({self.email})</div>
        </div>
      </div>
    </div>
  );
};

interface ProfessionalSelectListProps {
  onSelect: (x: string) => void;
  type?: string;
  label?: string;
  placeholder?: string;
  error?: string;
}

const ProfessionalSelectList = ({
  onSelect,
  type,
  placeholder,
  label,
  error
}: ProfessionalSelectListProps) => {
  useProfessionals();
  const [value, setValue] = useState('');
  const [showList, setShowList] = useState(false);
  const [filter, setFilter] = useState('');
  let professionals = useAppSelector((m) => m.professionals);
  let selected = useMemo(() => {
    for (let i = 0; i < professionals.data.length; i++) {
      if (professionals.data[i]._id === value) {
        return professionals.data[i] as unknown as Persona;
      }
    }
  }, [value]);

  let display = useMemo(() => {
    let list = professionals.data.filter((m: any) => {
      const isType = !type ? true : m?.type.includes(type);
      const hasName = m?.name.toLowerCase().includes(filter.toLowerCase());
      return isType && hasName;
    }) as unknown as Persona[];
    return list;
  }, [professionals.data, type, filter]);
  useEffect(() => {
    onSelect(value);
  }, [value]);

  const toggle = () => {
    setShowList(!showList);
  };
  let optionsRef = useRef<HTMLDivElement>(null);
  useClickOutSideComponent(optionsRef, () => {
    setShowList(false);
  });

  return (
    <div className=" w-full relative cursor-pointer flex flex-col ">
      <div>
        <p className="text-bash">{label ? label : 'Professional'}</p>
        <div
          onClick={toggle}
          className="flex border border-ashShade-3 items-center w-full rounded-md mt-2 justify-between p-2 text-bash">
          <p className={` ${value ? 'text-black' : 'text-bash'}`}>
            {value ? selected?.name : 'Select'}
          </p>
          {React.createElement(showList ? TbChevronUp : TbChevronDown, {
            size: 16,
            color: '#77828D'
          })}
        </div>
      </div>

      {!showList && <p>{error}</p>}

      {showList && (
        <div
          ref={optionsRef}
          className=" w-full flex-1  absolute top-20 p-2 border rounded-md border-ashShade-3  z-20 bg-white">
          <input
            placeholder="Search"
            className="p-2 w-full rounded-md outline-ashShade-3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          <div className="w-full max-h-40 overflow-y-auto ">
            {display.length > 0 ? (
              display.map((m) => (
                <ProfessionalCard
                  self={m}
                  isSelected={value === m?._id}
                  onClick={() => {
                    setValue(m?._id);
                    toggle();
                  }}
                />
              ))
            ) : (
              <span>No Professionals to display</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { ProfessionalSelectList };
export default ProfessionalCard;
