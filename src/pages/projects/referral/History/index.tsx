import { FiChevronDown, FiChevronLeft } from 'react-icons/fi';
import { flexer, hoverFade } from 'constants/globalStyles';
import { normalUserColumn } from '../columns/index';
import { useOutletContext } from 'react-router-dom';
import LineChart from 'components/shared/LineChart';
import BarChart from 'components/shared/BarChart';
import Table from 'components/shared/Table';
import { ReferralContext } from '../types';
import InputField from 'components/shared/InputField';
import { TbSearch } from 'react-icons/tb';
import Button from 'components/shared/Button';
import { useMemo, useState } from 'react';

interface Filters {
  query: string;
}

const initialFilter: Filters = {
  query: ''
};
const ReferralHistory = () => {
  const { dashboard, activeTab, setActiveTab } = useOutletContext<ReferralContext>();
  const [query, setQuery] = useState(initialFilter);
  const handleQueryChange = (field: keyof Filters, value: string) => {
    let copy = { ...query };
    copy[field] = value;
    setQuery(copy);
  };

  let data = useMemo(() => {
    return dashboard.referrals.filter((m) => {
      let str = query.query.toLowerCase();
      let email = m.email.includes(str);
      let user = m?.user
      let name =
        user?.name?.toLowerCase().includes(str) ||
        user?.firstName?.toLowerCase().includes(str) ||
        user?.lastName?.toLowerCase().includes(str);
      return email || name;
    });
  }, [query, dashboard]);
  return (
    <div className="h-fit">
      {activeTab ? (
        <div className={hoverFade} onClick={() => setActiveTab(undefined)}>
          <div className="flex gap-2 items-center">
            <FiChevronLeft className="text-bash" />
            <p className="text-base text-bash font-Demibold">Back</p>
          </div>
          <p className="font-Demibold text-xl text-black mt-5">{activeTab.title}</p>
        </div>
      ) : (
        <div className={'flex flex-col md:flex-row items-center justify-between gap-5 w-full'}>
          {/* <div className="bg-white rounded-md flex-1 p-5">
            <div className={flexer + 'mb-2'}>
              <p className="font-Medium">Referrals</p>
              <button className={flexer + 'gap-2' + hoverFade}>
                <p className="text-black text-sm">Yearly</p>
                <FiChevronDown className="text-bash text-sm" />
              </button>
            </div>
            <BarChart />
          </div>
          <div className="bg-white rounded-md flex-1 p-5">
            <div className={flexer + 'mb-2'}>
              <p className="font-Medium">Referrals converted</p>
              <button className={flexer + 'gap-2' + hoverFade}>
                <p className="text-black text-sm">Yearly</p>
                <FiChevronDown className="text-bash text-sm" />
              </button>
            </div>
            <LineChart />
          </div> */}
        </div>
      )}

      <div>
        <div className={flexer}>
          <InputField
            label=""
            ContainerClassName="!w-fit"
            className="!bg-transparent"
            onChange={(el) => handleQueryChange('query', el.target.value)}
            placeholder="Search by name, location, type, ...etc"
            LeftIconProp={<TbSearch className="text-bash mr-2" />}
          />
          <Button
            type="secondary"
            text="Clear filter"
            textStyle="!text-bash"
            onClick={() => setQuery(initialFilter)}
            className="!px-4 !border-ashShade-4 md:px-8"
          />
        </div>
        {/* {activeTab?.type !== ActiveTabTypes.ACTIVE_USERS && (
          <div className={flexer + 'mt-3 bg-white p-4 gap-5 rounded-md'}>
            <ConditionalFilters />
          </div>
        )} */}
      </div>

      <Table data={data} columns={normalUserColumn} label="" />
    </div>
  );
};

export default ReferralHistory;
