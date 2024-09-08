import React, { useEffect, useMemo, useState } from 'react';
import SelectField from '../SelectField';
import useFetch from 'Hooks/useFetch';
import { Country } from 'react-app-env';
import { getAllCountries } from 'apis/countries';
import { TOption } from '../SelectField/SelectField';

interface CountrySelectorProps {
  error?: string;
  value?: string;
  onChange: (vl: string) => void;
  showClearButton?: boolean;
  onClear?: () => void;
  placeholder?: string;
}

function CountrySelector({
  error,
  onChange,
  value,
  showClearButton,
  onClear,
  placeholder
}: CountrySelectorProps) {
  const [localValue, setLocalValue] = useState('');

  const {
    load,
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
    load(getAllCountries());
  }, []);

  useEffect(() => {
    if (value) {
      setLocalValue(value);
    } else {
      setLocalValue('');
    }
  }, [value]);

  useEffect(() => {
    onChange(localValue);
  }, [localValue]);

  return (
    <SelectField
      showSearch
      label="Country"
      value={localValue}
      data={countries}
      placeholder={placeholder ?? 'choose'}
      isLoading={areCountriesLoading}
      onChange={setLocalValue}
      error={error}
      showClearButton={showClearButton}
      onClear={onClear}
    />
  );
}

export default CountrySelector;
