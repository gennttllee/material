import React from 'react';
import CountrySelector from 'components/shared/CountrySelector';
import CitySelector from 'components/shared/CitySelector';
import StateSelector from 'components/shared/StateSelector';

interface Props {
  data: {
    country: string;
    state: string;
    city: string;
  };
  setData: (x: {}) => void;
}
function LocationSelector({ setData, data }: Props) {
  return (
    <>
      <div className="w-full flex gap-x-4 items-center max-w-full">
        <CountrySelector
          onChange={(vl) => {
            setData({ country: vl, city: '', state: '' });
          }}
          value={data.country}
        />
        <StateSelector
          country={data.country}
          value={data.state}
          onChange={(vl) => {
            setData({ ...data, state: vl, city: '' });
          }}
        />
        <CitySelector
          state={data.state}
          value={data.city}
          country={data.country}
          onChange={(vl) => {
            setData({ ...data, city: vl });
          }}
        />
      </div>
      {!(data.country && data.city && data.state) && (
        <p className="text-red-500 w-full text-sm ">Please add Country, city and state</p>
      )}
    </>
  );
}

export default LocationSelector;
