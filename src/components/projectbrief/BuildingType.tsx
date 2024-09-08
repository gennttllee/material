import { useState, useEffect, useMemo } from 'react';
import NavButtons from './NavButtons';
import Props from './Props';
import Header from './Header';
import duplex from '../../assets/duplex.svg';
import bungalow from '../../assets/bungalow.svg';
import townhouse from '../../assets/townhouse.svg';
import activetownhouse from '../../assets/active-townhouse.svg';
import hovertownhouse from '../../assets/hover-townhouse.svg';
import normaltownhouse from '../../assets/normal-townhouse.svg';
import normalbungalow from '../../assets/normal-bungalow.svg';
import hoverbungalow from '../../assets/hover-bungalow.svg';
import activebungalow from '../../assets/active-bungalow.svg';
import normalduplex from '../../assets/normal-duplex.svg';
import hoverduplex from '../../assets/hover-duplex.svg';
import activeduplex from '../../assets/active-duplex.svg';
import Error from './Error';
import InputField from 'components/shared/InputField';
import { convertToProper } from 'components/shared/utils';

let images = [bungalow, duplex, townhouse];

const imageMap = {
  bungalow: [activebungalow, hoverbungalow, normalbungalow],
  duplex: [activeduplex, hoverduplex, normalduplex],
  townhouse: [activetownhouse, hovertownhouse, normaltownhouse]
};

const ProjectType = ({ setFormData, formData, current, setCurrent }: Props) => {
  const [data, setData] = useState(formData['brief']['buildingType'].toString());
  const [error, setError] = useState('');
  useEffect(() => {
    if (data != '') {
      setError('');
    }
  }, [data]);

  let isCommercial = useMemo(() => {
    return formData.brief.projectType === 'commercial';
  }, [formData]);
  const next = () => {
    if (data !== '') {
      let form = { ...formData };
      form['brief']['buildingType'] = data;
      setFormData(form);
      setCurrent(current + 1);
    } else {
      setError(isCommercial ? 'Please eneter a project type' : 'Please pick an option');
    }
  };
  const prev = () => {
    setCurrent(current - 1);
  };

  const handleSelect = (x: string) => () => {
    setData(x);
  };

  return (
    <div className="w-full flex flex-col ">
      <Header
        title={
          isCommercial
            ? 'Please enter the kind of project you want to build'
            : 'Select building types'
        }
        heading="What type of building are you thinking about for Project?"
      />
      {isCommercial ? (
        <div>
          <InputField
            error=""
            label=""
            placeholder="5-Star Hotel"
            onChange={(x) => {
              setData(x.target.value);
            }}
          />
        </div>
      ) : (
        <div className=" grid grid-cols-3 gap-x-4 sm:gap-x-6">
          {['bungalow', 'duplex', 'townhouse'].map((el, i) => (
            <HouseCard onSelect={handleSelect(el)} active={data === el} name={el} />
          ))}
        </div>
      )}
      <Error message={error} />
      <NavButtons prev={prev} next={next} disabled={data === ''} />
    </div>
  );
};

interface HouseCardProps {
  active?: boolean;
  onSelect: () => void;
  name: string;
}

const HouseCard = ({ active, onSelect, name }: HouseCardProps) => {
  const [hovered, setHovered] = useState(false);

  const status = useMemo(() => {
    let _status = {
      idx: 2,
      name: 'normal'
    };

    if (active) {
      _status.idx = 0;
      _status.name = 'active';
    } else if (hovered && !active) {
      _status.idx = 1;
      _status.name = 'hover';
    }

    return _status;
  }, [hovered, name, active]);
  return (
    <div
      onMouseLeave={() => {
        setHovered(false);
      }}
      onMouseOver={() => {
        if (!active) {
          setHovered(true);
        }
      }}
      className={` w-full px-4 py-6 ${
        active ? ' bg-bblue' : hovered ? ' hover:bg-lightblue ' : ''
      }  hover:border-bblue hover:border cursor-pointer border rounded-md relative flex flex-col items-center  `}
      onClick={() => {
        onSelect();
      }}>
      <img
        className=" w-1/2 sm:w-1/3"
        loading="lazy"
        decoding="async"
        src={imageMap[name as keyof typeof imageMap][status.idx]}
        alt=""
      />
      <p
        className={`${
          active ? 'text-white' : hovered ? ' text-bblue' : 'text-bash'
        } font-semibold   mt-3`}>
        {convertToProper(name)}
      </p>
    </div>
  );
};

export default ProjectType;
