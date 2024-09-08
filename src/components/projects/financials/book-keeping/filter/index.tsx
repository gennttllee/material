import SelectField from 'components/shared/SelectField';
import React, { useEffect, useState } from 'react';
import DateFilter from './datefilter';
import SelectMultiple from 'components/shared/SelectMultipleField/SelectMultiple';
import { TOption } from 'components/shared/SelectField/SelectField';

type Filter = {
  materialData: TOption[];
  vendorData: TOption[];
  onChange: (val: Record<string, (string | Date)[]>) => void;
};

const Index = ({ materialData, vendorData, onChange }: Filter) => {
  const [filters, setFilters] = useState({
    material: [],
    vendor: [],
    date: []
  });

  const handleChange = (field: keyof typeof filters) => (val: (string | Date)[]) => {
    setFilters({ ...filters, [field]: val });
  };

  useEffect(() => {
    onChange(filters);
  }, [filters]);

  return (
    <div className="w-full grid-cols-3 gap-x-3 grid p-5 bg-white rounded-md">
      <SelectMultiple label="Material" onChange={handleChange('material')} data={materialData} />
      <SelectMultiple label="Vendor" onChange={handleChange('vendor')} data={vendorData} />
      <DateFilter placeholder="Select Date" label="Date" onChange={handleChange('date')} />
    </div>
  );
};

export default Index;
