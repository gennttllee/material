import SuperModal from 'components/shared/SuperModal';
import React, { useEffect, useMemo, useState } from 'react';
import { ReferralDashboardRes, TAllReferral } from '../types';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess, isReferralConverted } from 'Utils';
import Table from 'components/shared/Table';
import { normalUserColumn } from '../columns';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { LoaderX } from 'components/shared/Loader';
import { flexer } from 'constants/globalStyles';
import InputField from 'components/shared/InputField';
import { TbSearch } from 'react-icons/tb';
import Button from 'components/shared/Button';

interface Props {
  closer: () => void;
  data: TAllReferral;
}

const UserReferralsModal = ({ closer, data }: Props) => {
  const [loading, setLoading] = useState(true);
  const [res, setRes] = useState<ReferralDashboardRes>();
  const [query, setQuery] = useState('');
  const getDetails = async () => {
    setLoading(true);
    let { e, response } = await postForm('get', `referrals/user?userId=${data.user}`, {}, 'true');
    if (response.data.data) {
      setRes(response.data.data);
      displaySuccess('Referrals fetched successfully');
    }

    if (e) {
      displayError(e?.message);
    }
    setLoading(false);
  };
  useEffect(() => {
    getDetails();
  }, []);
  const filtered = useMemo(() => {
    let _query = query.toLowerCase();
    return (
      res?.referrals.filter(
        (m) =>
          m.email.includes(_query) ||
          m?.name?.toLowerCase().includes(_query) ||
          m?.user?.firstName?.toLowerCase().includes(_query) ||
          m?.user?.lastName?.toLowerCase().includes(_query) ||
          m?.user?.name?.toLowerCase().includes(_query) ||
          m?.user?.companyName?.toLowerCase().includes(_query)
      ) || []
    );
  }, [res, query]);
  const stat = useMemo(() => {
    let redeemed =
      res?.withdrawalRequest?.reduce((sum: any, m: any) => {
        if (m.completedOn) {
          return sum + m.amount;
        } else {
          return sum;
        }
      }, 0) ?? 0;

    return [
      {
        percentage: '20%',
        label: 'Total Referrals',
        count: res?.referrals.length || 0
      },
      {
        percentage: '20%',
        label: 'Referrals converted',
        count: res?.referrals.filter((one: any) => isReferralConverted(one)).length || 0
      },
      {
        label: 'Cash earned',
        count: '$ ' + res?.amountEarned
      },
      {
        label: 'cash redeemed',
        count: '$ ' + redeemed
      }
    ];
  }, [res]);
  const name = useMemo(() => {
    let firstname = data.owner.firstName;
    let lastname = data.owner.lastName;
    let _name = data.owner.name;

    return firstname || lastname ? `${firstname || ''} ${lastname || ''}` : `${_name || ''}`;
  }, [res]);

  return (
    <SuperModal classes=" bg-pbg  " closer={closer}>
      <div
        onClick={() => {
          closer();
        }}
        className=" bg-pbg h-full  relative z-0 px-6 md:px-12 lg:px-24 xl:px-40 2xl:px-0 overflow-y-scroll flex-1 w-full no-scrollbar 2xl:max-w-[1440px] mx-auto pb-10">
        <div onClick={(e) => e.stopPropagation()} className="w-full overflow-y-auto mt-20">
          <div className=" my-10 flex items-center">
            <span onClick={closer} className="  hover:underline cursor-pointer ">
              <FaArrowLeftLong size={24} />
            </span>
            <span className=" text-2xl ml-4 font-semibold my-4">{`${name}'s Referrals`}</span>
          </div>

          {loading ? (
            <div className="flex items-center p-20 w-full justify-center">
              <LoaderX color="blue" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 my-4">
                {React.Children.toArray(
                  stat.map(({ label, count }) => (
                    <div className="p-5 rounded-md bg-white">
                      <p className="font-Medium text-base text-black capitalize">{label}</p>
                      <p className="font-Demibold text-3xl text-bash">{count}</p>
                    </div>
                  ))
                )}
              </div>
              <div>
                <div className={flexer}>
                  <InputField
                    label=""
                    ContainerClassName="!w-fit"
                    className="!bg-transparent"
                    onChange={(el) => setQuery(el.target.value)}
                    placeholder="Search by name, email, ...etc"
                    LeftIconProp={<TbSearch className="text-bash mr-2" />}
                  />
                  <Button
                    type="secondary"
                    text="Clear filter"
                    textStyle="!text-bash"
                    onClick={() => setQuery('')}
                    className="!px-4 !border-ashShade-4 md:px-8"
                  />
                </div>
                {/* {activeTab?.type !== ActiveTabTypes.ACTIVE_USERS && (
          <div className={flexer + 'mt-3 bg-white p-4 gap-5 rounded-md'}>
            <ConditionalFilters />
          </div>
        )} */}
              </div>
              <Table label="" data={filtered || []} columns={normalUserColumn} />
            </>
          )}
        </div>
      </div>
    </SuperModal>
  );
};

export default UserReferralsModal;
