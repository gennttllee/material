import { useState, useEffect, useMemo } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import CitySelector from 'components/shared/CitySelector';
import StateSelector from 'components/shared/StateSelector';
import CountrySelector from 'components/shared/CountrySelector';
import ProfessionalCard from './ProfessionalCard';
import { useAppSelector } from 'store/hooks';
import Select from './Select';
import { LoaderX } from 'components/shared/Loader';
import { getAllProfessionals } from '../Snapshot';
import Verified from './Verified';
import { convertToProper } from 'components/shared/utils';
import { IoMdClose } from 'react-icons/io';
import { centered } from 'constants/globalStyles';
import SelectField from 'components/shared/SelectField';
import UserTable from './UserTable';
import { tHeaders } from './constants';

type Options = {
  string: string;
  status: string;
  state: string;
  country: string;
  city: string;
  Type: string;
};
export type Profs = 'consultant' | 'contractor';
interface ProfListProps {
  handleModal: (x: boolean) => void;
  setViewing: (id: string, type: Profs) => void;
  initialType?: Profs;
  showSelector?: boolean;
}
const ProfList = ({ handleModal, setViewing, initialType, showSelector }: ProfListProps) => {
  const [allconsultants, setAllConsultants] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState(false);
  const [profId, setProfId] = useState('');
  const bid = useAppSelector((m) => m.bid);
  let professionals = useAppSelector((m) => m.professionals);
  let initial = {
    string: '',
    status: 'All',
    country: '',
    state: '',
    city: '',
    Type: initialType || 'All'
  };
  const [options, setOptions] = useState<Options>(initial);
  let itemsPerPage = 10;
  const condition = (x: 1 | 2 | 3 | 4, m: any) => {
    if (x === 1) {
      if (options.string === '') return true;
      return (m.name && m.name.toLowerCase().includes(options.string.toLowerCase())) ||
        m.email.toLowerCase().includes(options.string.toLowerCase())
        ? true
        : false;
    } else if (x === 2) {
      if (options.status === 'All') {
        return true;
      } else {
        return options.status === 'verified' ? m.isVerified?.account : !m.isVerified?.account;
      }
    } else if (x === 3) {
      if (!options.state && !options.country && !options.city) return true;
      let countryStateCity =
        m?.state &&
        m?.state.toLowerCase().includes(options.state.toLowerCase()) &&
        m.country &&
        m?.country.toLowerCase().includes(options.country.toLowerCase()) &&
        m.city &&
        m?.city.toLowerCase().includes(options.city.toLowerCase());
      return countryStateCity;
    } else if (x === 4) {
      if (options.Type === 'All') return true;
      return m.type && m.type.toLowerCase() === options.Type.toLowerCase();
    } else {
      return true;
    }
  };
  useEffect(() => {
    setPages(Math.ceil(filtered.length / 10));
    if (currentPage > Math.ceil(filtered.length / 10) - 1) {
      setCurrentPage(0);
    }
  }, [filtered]);

  const filter = () => {
    let consultants = allconsultants.slice();
    let correct = consultants.filter((m: any) => {
      let condition1 = condition(1, m);
      let condition2 = condition(2, m);
      let condition3 = condition(3, m);
      let condition4 = condition(4, m);
      return condition1 && condition2 && condition3 && condition4;
    });
    setFiltered(correct);
  };

  useEffect(() => {
    filter();
  }, [options, professionals]);
  const nav = (type: string) => {
    if (type === 'next' && currentPage + 1 <= pages - 1) {
      setCurrentPage((current) => current + 1);
    }
    if (type === 'prev' && currentPage - 1 >= 0) {
      setCurrentPage((current) => current - 1);
    }
  };

  const call = async () => {
    setAllConsultants(professionals.data);
    setFiltered(professionals.data);
  };
  useEffect(() => {
    call();
  }, [professionals]);

  const setter = (prop: string) => {
    let newOptions: any = { ...options };
    return (val: string) => {
      newOptions[prop] = val;
      setOptions((prev) => newOptions);
    };
  };

  const [_modal, _setModal] = useState(false);

  return (
    <div className="w-full">
      <div className="w-full mt-8 justify-between flex items-center">
        <div className=" border border-ashShade-4 py-2  px-4 flex items-center rounded-md ">
          <AiOutlineSearch size={16} color="#C8CDD4" className="mr-2" />
          <input
            value={options.string}
            onChange={(e) => {
              setter('string')(e.target.value);
            }}
            placeholder="Search"
            type="text"
            className="border-0 bg-transparent  focus:outline-none font-Medium"
          />
        </div>

        <button
          onClick={() => {
            setOptions(initial);
          }}
          className="px-8 rounded-md py-2 border border-ashShade-4 text-bash">
          Clear Filter
        </button>
      </div>

      <div className=" mt-10 w-full  p-6 flex items-center justify-between gap-x-3 bg-white rounded-lg ">
        <div className="flex-1">
          <SelectField
            value={options.Type}
            label="Professional"
            onChange={setter('Type')}
            data={[
              { value: 'All', label: 'All' },
              { value: 'consultant', label: 'Consultant' },
              { value: 'contractor', label: 'Contractor' }
            ]}
          />
        </div>
        <div className="flex-1">
          <SelectField
            label="Status"
            value={options.status}
            onChange={setter('status')}
            data={[
              { value: 'All', label: 'All' },
              { value: 'verified', label: 'Verified' },
              { value: 'unverified', label: 'Unverified' }
            ]}
          />
        </div>
        <div className={'flex-1' + centered}>
          <CountrySelector
            showClearButton
            onClear={() => {
              setOptions({ ...options, state: '', city: '', country: '' });
            }}
            placeholder="Select"
            value={options.country}
            onChange={(vl) => {
              setOptions({ ...options, country: vl });
            }}
          />
        </div>
        <div className={'flex-1' + centered}>
          <StateSelector
            showClearButton
            onClear={() => {
              setOptions({ ...options, state: '', city: '' });
            }}
            placeholder="Select"
            value={options.state}
            country={options.country}
            onChange={(vl) => {
              setOptions({
                ...options,
                state: vl
              });
            }}
          />
        </div>
        <div className={'flex-1' + centered}>
          <CitySelector
            showClearButton
            onClear={() => {
              setOptions({ ...options, city: '' });
            }}
            placeholder="Select"
            value={options.city}
            country={options.country}
            state={options.state}
            onChange={(vl) => {
              setOptions({ ...options, city: vl });
            }}
          />
        </div>
      </div>
      <UserTable
        showSelector={showSelector}
        setViewing={setViewing}
        setModal={handleModal}
        loading={fetching}
        headers={tHeaders.professionals}
        data={filtered}
      />
    </div>
  );
};

export default ProfList;
