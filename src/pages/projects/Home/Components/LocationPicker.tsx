import useFetch from 'Hooks/useFetch';
import SelectField from 'components/shared/SelectField';
import { TOption } from 'components/shared/SelectField/SelectField';
import React, { useEffect, useMemo } from 'react';
import InputSectionWithBorder from './InputSectionWithBorder';
import { getAllCountries, getCities, getStates } from 'apis/countries';
import { flexer, spacer } from 'constants/globalStyles';
import { Country } from 'react-app-env';

type locations = 'country' | 'state' | 'city';
type LocationPickerProps = {
  watch: (val: locations) => string;
  setValue: (key: locations, val: string) => void;
  useALayout?: boolean;
  label?: string;
  errors: any;
  hasBorderBottom?: boolean;
};

const LocationPicker = ({
  label,
  watch,
  errors,
  setValue,
  useALayout = true,
  hasBorderBottom = true
}: LocationPickerProps) => {
  const city = watch('city');
  const state = watch('state');
  const country = watch('country');

  const initialCountry = useMemo(() => watch('country'), []);
  const initialState = useMemo(() => watch('state'), []);

  const {
    load: loadCities,
    successResponse: cities,
    isLoading: isCitiesLoading
  } = useFetch<string[]>({
    initialData: [],
    showDisplayError: false
  });

  const {
    successResponse: StatesRes,
    isLoading: isStatesLoading,
    load: loadStates
  } = useFetch<{
    states: { name: string; state_code: string }[];
  }>({
    initialData: { states: [] },
    showDisplayError: false
  });

  const {
    load: loadCountries,
    successResponse: allCountries,
    isLoading: areCountriesLoading
  } = useFetch<{ [key: number]: Country }>({
    storeWholeResponse: true
  });

  const countries = useMemo(() => {
    if (!allCountries) return [];

    const temp = Object.values(allCountries)
      .map((country) => ({
        value:
          country.name?.common ||
          country.name?.official ||
          country.name?.nativeName['0'].common ||
          country.name?.nativeName['0'].official,
        icon: country.flag
      }))
      .sort((a, b) => (a.value || '').localeCompare(b.value));

    let data: TOption[] = [];

    for (const country of temp) {
      if (!country.value) continue;
      if (country.value.toLocaleLowerCase() === 'nigeria') {
        // puts nigeria at the first position
        data = [country, ...data];
      } else {
        data.push(country);
      }
    }

    return data;
  }, [allCountries]);

  useEffect(() => {
    loadCountries(getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      if (country !== initialCountry) {
        setValue('city', '');
        setValue('state', '');
      }
      loadStates(getStates(country));
    }
  }, [country, initialCountry]);

  useEffect(() => {
    if (state) {
      loadCities(getCities({ country, state }));
    }
  }, [state, initialState]);

  const Inputs = () => (
    <div className={flexer}>
      <SelectField
        showSearch
        label="Country"
        value={country}
        data={countries}
        placeholder="choose"
        isLoading={areCountriesLoading}
        error={errors.country?.message}
        onChange={(val) => setValue('country', val)}
      />
      <div className={spacer} />
      <SelectField
        showSearch
        value={state}
        disabled={!country}
        placeholder="choose"
        label="State / Province"
        isLoading={isStatesLoading}
        error={errors.state?.message}
        onChange={(val) => {
          setValue('state', val);
          setValue('city', '');
        }}
        data={StatesRes?.states.map((one) => ({
          value: one.name
        }))}
      />
      <div className={spacer} />
      <SelectField
        showSearch
        value={city}
        label="City"
        disabled={!state}
        placeholder="choose"
        isLoading={isCitiesLoading}
        error={errors.city?.message}
        onChange={(val) => setValue('city', val)}
        data={cities?.map((one) => ({ value: one }))}
      />
    </div>
  );

  if (!useALayout) return <Inputs />;

  return (
    <InputSectionWithBorder
      label={label || 'Desired location'}
      error={errors.country?.message || errors.state?.message || errors.city?.message}
      value={country + state + city}
      header={label ? 'where is your land located ?' : 'Where would you like to acquire land ?'}
      {...{ hasBorderBottom }}
      placeholderSub={
        country ? (
          <p className={`text-bash ${hasBorderBottom && 'border-b pb-4'}`}>
            {country} {state ? `, ${state}` : null} {city ? `, ${city}` : null}
          </p>
        ) : null
      }
      Children={Inputs}
    />
  );
};

export default LocationPicker;
