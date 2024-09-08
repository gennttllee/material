import React, { useEffect, useState } from "react";
import SelectMultiple from "components/shared/SelectMultipleField/SelectMultiple";
import { TOption } from "components/shared/SelectField/SelectField";
import DateFilter from "components/projects/financials/book-keeping/filter/datefilter";

type FilterProps = {
  materialData: TOption[];
  categoryData: TOption[];
  onChange: (val: Record<string, (string | Date)[]>) => void;
};

const Filter = ({ materialData, categoryData, onChange }: FilterProps) => {
  const [filters, setFilters] = useState({
    material: [],
    category: [],
    date: [],
  });

  const handleChange =
    (field: keyof typeof filters) => (val: (string | Date)[]) => {
      setFilters({ ...filters, [field]: val });
    };

  useEffect(() => {
    onChange(filters);
  }, [filters]);

  return (
    <div className="w-full grid-cols-3 gap-x-3 grid p-5 bg-white rounded-md">
      <SelectMultiple
        label="Material"
        onChange={handleChange("material")}
        data={materialData}
      />
      <SelectMultiple
        label="Category"
        onChange={handleChange("category")}
        data={categoryData}
      />
      <DateFilter
        placeholder="Select Date"
        label="Date"
        onChange={handleChange("date")}
      />
    </div>
  );
};

export default Filter;
