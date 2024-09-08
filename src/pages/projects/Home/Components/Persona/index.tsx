import { useNavigate } from 'react-router-dom';
import React, { useMemo, useState } from 'react';
import { TbChevronLeft, TbSearch } from 'react-icons/tb';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import emptyIcon from '../../../../../assets/emptygallery.svg';
import useRole, { UserRoleConstants, UserRoles } from 'Hooks/useRole';
import InputField from 'components/shared/InputField';
import Button from 'components/shared/Button';
import { useAppSelector } from 'store/hooks';
import InvitePMBtn from './InvitePMBtn';
import SelectField from 'components/shared/SelectField';
import { removeDuplicates } from 'helpers';
import { Persona } from 'types';
import UserTable from '../professionals/UserTable';
import { tHeaders } from '../professionals/constants';
import CountrySelector from 'components/shared/CountrySelector';
import StateSelector from 'components/shared/StateSelector';
import CitySelector from 'components/shared/CitySelector';

const PersonaList = ({ UserRole }: { UserRole: UserRoles }) => {
  const { isOfType } = useRole();
  const navigation = useNavigate();
  const { user } = useAppSelector((state) => state);
  const developers = useAppSelector((m) => m.developers);
  const [filters, setFilter] = useState({
    city: '',
    state: '',
    status: '',
    country: '',
    companyName: ''
  });
  const projectManagers = useAppSelector((m) => m.projectManagers);
  const [searchQuery, setSearchQuery] = useState('');

  const data = useMemo(() => {
    const res = UserRole === UserRoles.Developer ? developers.data : projectManagers.data;
    // as Developers should only see projectManagers that belong to the same company (CompanyName)
    return isOfType(UserRoles.Developer)
      ? res.filter((one) => one.companyName === user.companyName)
      : res;
  }, [UserRole, developers, projectManagers]);

  const searchResults = useMemo(() => {
    return data.filter((user) =>
      Object.values(user).find((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const filteredResults = useMemo(() => {
    return !searchResults
      ? []
      : searchResults.filter((item) => {
          let isAMatchToFilters = true;
          /**
           * Exclusive Filter
           * i.e check all filters fit and return a boolean for each item
           */
          for (const [filterKey, filterValue] of Object.entries(filters) as [
            x: keyof Persona,
            y: string
          ][]) {
            if (!filterValue) continue;
            if (item[filterKey] !== filterValue) {
              isAMatchToFilters = false;
            }
          }
          return isAMatchToFilters;
        });
  }, [searchResults, searchQuery, filters]);

  return (
    <div className="py-10 h-full">
      <button
        onClick={() => navigation('/projects/home')}
        className={'font-Medium flex gap-1 md:gap-3 items-center text-sm' + hoverFade}>
        <TbChevronLeft />
        <p>Back</p>
      </button>
      <div className={flexer + 'my-5'}>
        <h3 className="font-Demibold text-3xl">{UserRoleConstants[UserRole]}</h3>
        <InvitePMBtn role={UserRole} />
      </div>
      <div className={flexer}>
        <InputField
          label=""
          ContainerClassName="flex-[.9] md:!w-96"
          className="!bg-transparent !border-black"
          onChange={(el) => setSearchQuery(el.target.value)}
          placeholder="Search by name, location, type, ...etc"
          LeftIconProp={<TbSearch className="text-gray-500 mr-2" />}
        />
        <Button
          text="Clear filter"
          type="secondary"
          className="!px-4 md:px-8 "
          onClick={() =>
            setFilter({
              city: '',
              state: '',
              status: '',
              country: '',
              companyName: ''
            })
          }
        />
      </div>
      {searchResults[0] ? (
        <div
          className={'py-1 px-5 rounded-md bg-white my-2 md:my-5 gap-5 overflow-scroll' + flexer}>
          {
            /**
             * when a Develope is logged-In the API returns
             * project manager's of the same company name
             * hence this condition (No need for this filter)
             *  */
            !isOfType(UserRoles.Developer) && (
              <SelectField
                label="Company Name"
                showClearButton
                placeholder="Company name"
                value={filters.companyName}
                onClear={() => setFilter((prev) => ({ ...prev, companyName: '' }))}
                data={removeDuplicates(filteredResults.map((one) => one.companyName))}
                onChange={(val) => setFilter((prev) => ({ ...prev, companyName: val }))}
              />
            )
          }
          <SelectField
            label="Status"
            showClearButton
            placeholder="Status"
            value={filters.status}
            onClear={() => setFilter((prev) => ({ ...prev, status: '' }))}
            data={removeDuplicates(filteredResults.map((one) => one.status))}
            onChange={(val) => setFilter((prev) => ({ ...prev, status: val }))}
          />
          <CountrySelector
            // label=""
            showClearButton
            placeholder="Country"
            value={filters.country}
            onClear={() => setFilter((prev) => ({ ...prev, country: '', state: '', city: '' }))}
            // data={removeDuplicates(searchResults.map((one) => one.country))}
            onChange={(val) => setFilter((prev) => ({ ...prev, country: val }))}
          />

          <StateSelector
            // label=""
            showClearButton
            placeholder="State"
            country={filters.country}
            value={filters.state}
            onClear={() => setFilter((prev) => ({ ...prev, state: '', city: '' }))}
            // data={removeDuplicates(searchResults.map((one) => one.state))}
            onChange={(val) => setFilter((prev) => ({ ...prev, state: val }))}
          />
          <CitySelector
            // label=""
            showClearButton
            country={filters.country}
            state={filters.state}
            placeholder="City"
            value={filters.city}
            onClear={() => setFilter((prev) => ({ ...prev, city: '' }))}
            // data={removeDuplicates(searchResults.map((one) => one.city))}
            onChange={(val) => setFilter((prev) => ({ ...prev, city: val }))}
          />
        </div>
      ) : null}
      {!filteredResults[0] ? (
        <div className={centered + 'flex-col'}>
          <img src={emptyIcon} decoding="async" loading="lazy" alt="empty" />
          <p className="font-Demibold text-xl text-bblack-0">
            {searchQuery ? `No match  was found for ${searchQuery}` : 'Invite a Project Manager'}
          </p>
          <p className="text-bash text-lg">
            {searchQuery
              ? 'Check your spelling and try again'
              : 'All Project managers invited to the projects will appear here'}
          </p>
        </div>
      ) : (
        <>
          <UserTable
            loading={UserRole === 'developer' ? developers.loading : projectManagers.loading}
            headers={tHeaders.developersAndManagers}
            data={filteredResults}
          />
        </>
      )}
      <div className="h-10 w-full" />
    </div>
  );
};

export default PersonaList;
