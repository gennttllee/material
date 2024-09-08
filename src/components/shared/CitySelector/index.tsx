import React, { useEffect, useMemo, useState } from 'react';
import SelectField from '../SelectField';
import useFetch from 'Hooks/useFetch';
import { getCities } from 'apis/countries';

interface CitySelectorProps {
  error?: string;
  value?: string;
  state?: string;
  country?: string;
  onChange: (vl: string) => void;
  showClearButton?: boolean;
  onClear?: () => void;
  placeholder?: string;
}

function CitySelector({
  error,
  onChange,
  state,
  country,
  value,
  showClearButton,
  onClear,
  placeholder
}: CitySelectorProps) {
  const [localValue, setLocalValue] = useState('');

  const {
    load,
    successResponse: cities,
    isLoading: isCitiesLoading
  } = useFetch<string[]>({
    showDisplayError: false,
    initialData: []
  });

  useEffect(() => {
    if (state && country) {
      setLocalValue('');
      load(getCities({ country, state }));
    }
  }, [state, country]);

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
      showClearButton={showClearButton}
      onClear={onClear}
      showSearch
      label="City"
      error={error}
      disabled={!state}
      value={localValue}
      placeholder={placeholder ?? 'choose'}
      onChange={setLocalValue}
      isLoading={isCitiesLoading}
      data={cities?.map((one) => ({ value: one }))}
    />
  );
}

export default CitySelector;
