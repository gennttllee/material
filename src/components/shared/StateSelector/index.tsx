import React, { useEffect, useMemo, useState } from 'react';
import SelectField from '../SelectField';
import useFetch from 'Hooks/useFetch';
import { getStates } from 'apis/countries';
import { SelectProps } from '../SelectField/SelectField';

interface StateSelectorProps {
  error?: string;
  value?: string;
  country?: string;
  onChange: (vl: string) => void;
  showClearButton?: boolean;
  onClear?: () => void;
  placeholder?: string;
}

function StateSelector({
  error,
  onChange,
  country,
  value,
  showClearButton,
  onClear,
  placeholder
}: StateSelectorProps) {
  const [localValue, setLocalValue] = useState('');

  const {
    load,
    isLoading: isStatesLoading,
    successResponse: StatesRes
  } = useFetch<{
    states: { name: string; state_code: string }[];
  }>({
    initialData: { states: [] },
    showDisplayError: false
  });

  useEffect(() => {
    if (country) {
      setLocalValue('');
      load(getStates(country));
    }
  }, [country]);

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
      error={error}
      value={localValue}
      disabled={!country}
      placeholder={placeholder ?? 'choose'}
      onChange={setLocalValue}
      label="State / Province"
      isLoading={isStatesLoading}
      data={StatesRes?.states.map((one) => ({
        value: one.name
      }))}
      showClearButton={showClearButton}
      onClear={onClear}
    />
  );
}

export default StateSelector;
