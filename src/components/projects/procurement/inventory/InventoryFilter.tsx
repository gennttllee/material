import React, { useEffect, useState } from 'react';
import DateFilter from '../../financials/book-keeping/filter/datefilter';
import SelectMultiple from 'components/shared/SelectMultipleField/SelectMultiple';
import { TOption } from 'components/shared/SelectField/SelectField';

type Filter = {
  materialData: TOption[];
  receiverData: TOption[];
  onChange: (val: Record<string, (string | Date)[]>) => void;
};

const InventoryFilter = ({ materialData, receiverData, onChange }: Filter) => {
  const [filters, setFilters] = useState({
    material: [],
    receiver: [],
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
      <SelectMultiple
        label="Name of Receiver"
        onChange={handleChange('receiver')}
        data={receiverData}
      />
      <DateFilter placeholder="Select Date" label="Date" onChange={handleChange('date')} />
    </div>
  );
};

export default InventoryFilter;
