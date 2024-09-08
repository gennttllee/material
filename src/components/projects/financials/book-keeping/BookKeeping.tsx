import Button from 'components/shared/Button';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BsArrowLeft } from 'react-icons/bs';
import { TbPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import AddRecordModal from './AddRecordModal';
import { useAppSelector } from 'store/hooks';
import BookKeepingTable from './BookKeepingTable';
import { Record } from './types';
import useBookKeeping from 'Hooks/useBookKeeping';
import StatCard from './StatCard';
import { StoreContext } from 'context';
import { formatWithComma } from 'Utils';
import Filter from './filter';
import { convertToProper } from 'components/shared/utils';

const BookKeeping = () => {
  let navigate = useNavigate();
  const { getRecords } = useBookKeeping();
  let { selectedProject } = useContext(StoreContext);
  let { data, loading } = useAppSelector((m) => m.bookKeeping);

  useEffect(() => {
    if (data.length < 1) {
      getRecords();
    }
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [editing, setEditing] = useState<Record | undefined>(undefined);
  const [filters, setFilters] = useState<{ [key: string]: (Date | string)[] }>({
    material: [],
    vendor: [],
    date: []
  });

  const handleEditing = (x: Record) => {
    setEditing(x);
    setShowModal(true);
  };

  let { materialData, vendorData } = useMemo(() => {
    let materialAcc: { [key: string]: boolean } = {};
    let vendorAcc: { [key: string]: boolean } = {};

    data.forEach((m) => {
      materialAcc[m.item] = true;
      if (m?.vendor) {
        vendorAcc[m.vendor] = true;
      }
    });

    const convertToOption = (list: string[]) => {
      return list.map((m) => ({ value: m, label: convertToProper(m) }));
    };

    return {
      materialData: convertToOption(Object.keys(materialAcc)),
      vendorData: convertToOption(Object.keys(vendorAcc))
    };
  }, [data]);

  const handleFilter = () => {
    let _data = [...data];
    if (filters?.vendor && filters?.vendor.length > 0) {
      let vendors = filters?.vendor as string[];
      let _vendors = vendors?.map((m) => m.toLowerCase());
      _data = _data.filter((m) => _vendors.includes(m?.vendor?.toLowerCase() as string));
    }

    if (filters?.material && filters.material.length > 0) {
      let materials = filters?.material as string[];
      let _materials = materials?.map((m) => m.toLowerCase());
      _data = _data.filter((m) => _materials.includes(m?.item?.toLowerCase() as string));
    }

    if (filters?.date && filters?.date.length > 0) {
      let dates = filters?.date as Date[];
      let _dates = dates.map((m) => m.getTime());
      if (_dates[0] !== _dates[1]) {
        _data = _data.filter((m) => {
          let date = new Date(m.date).getTime();
          return _dates[0] <= date && date <= _dates[1];
        });
      }
    }

    return _data;
  };

  const filtered = useMemo(handleFilter, [data, filters]);

  const { totalAmount, items } = useMemo(() => {
    let totalAmount = 0;
    let items = filtered.length;

    filtered.forEach((m) => (totalAmount += m.amount));

    return {
      totalAmount,
      items
    };
  }, [filtered]);

  return (
    <div className=" ">
      {showModal && (
        <AddRecordModal
          isEditing={Boolean(editing)}
          value={editing}
          closer={() => {
            setShowModal(false);
            setEditing(undefined);
          }}
        />
      )}
      <div className=" flex items-center">
        <span
          onClick={() => navigate(-1)}
          className="text-borange mr-2 flex cursor-pointer  items-center">
          <BsArrowLeft className=" mr-2" /> Back
        </span>
      </div>

      <div className=" mb-4 ">
        <div className="flex items-center justify-between">
          <p className=" text-2xl font-semibold ">Book Keeping</p>
          <div className=" flex items-center gap-x-1  ">
            <Button
              onClick={() => {
                setShowFilter(!showFilter);
              }}
              textStyle=" text-bash "
              text="Filter"
              className=" bg-transparent text-bash "
            />
            <Button
              onClick={() => setShowModal(true)}
              text="Add Record"
              LeftIcon={<TbPlus color="white" />}
            />
          </div>
        </div>
      </div>

      {showFilter && (
        <div className="w-full my-4">
          <Filter
            onChange={(val: { [key: string]: (string | Date)[] }) => {
              setFilters(val);
            }}
            materialData={materialData}
            vendorData={vendorData}
          />
        </div>
      )}

      <div className=" mb-4  items-center grid grid-cols-2 gap-x-4 ">
        <StatCard
          label="Total Expenditure:"
          value={`${selectedProject?.currency?.code} ${formatWithComma(totalAmount)}`}
        />
        <StatCard label="Number of Materials:" value={`${items} Materials`} />
      </div>

      <BookKeepingTable data={filtered} loading={loading} setEditing={handleEditing} />
    </div>
  );
};

export default BookKeeping;
