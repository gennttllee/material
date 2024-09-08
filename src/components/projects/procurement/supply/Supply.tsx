import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { record, removeRecord } from 'store/slices/supplySlice';
import AddSupplyModal from './AddSupplyModal';
import SupplyTable from './SupplyTable';
import { Record } from 'components/projects/procurement/supply/types';
import Button from 'components/shared/Button';
import { TbPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';
import Filter from './filter';
import { convertToProper } from 'components/shared/utils';
import StatCard from './Statcard';
import { StoreContext } from 'context';
import { formatWithComma } from 'Utils';
import Sum from '../../../../assets/StatSum.png';
import MaterialStat from '../../../../assets/MaterialStat.png';
import ProcurementTabs from '../layout/ProcurementTabs';
import { BsFunnel } from 'react-icons/bs';
import { TbAccessible } from 'react-icons/tb';
const Supply: React.FC = () => {
  let { selectedProject } = useContext(StoreContext);
  const [showModal, setShowModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
  const { data, loading } = useSelector(record);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: (Date | string)[] }>({
    material: [],
    vendor: [],
    date: []
  });

  const dispatch = useDispatch();
  let navigate = useNavigate();

  const handleAddRecord = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRecord(null);
  };

  const setEditing = (record: Record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    dispatch(removeRecord(id));
  };

  let { materialData, vendorData } = useMemo(() => {
    let materialAcc: { [key: string]: boolean } = {};
    let vendorAcc: { [key: string]: boolean } = {};

    data.forEach((m) => {
      materialAcc[m.material] = true;
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
      _data = _data.filter((m) => _materials.includes(m?.material?.toLowerCase() as string));
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

  const { totalVendor, items } = useMemo(() => {
    let totalVendor = '';
    let items = filtered.length;

    filtered.forEach((m) => (totalVendor += m.vendor));

    return {
      totalVendor,
      items
    };
  }, [filtered]);

  return (
    <>
      <ProcurementTabs
        buttons={
          <>
            <div className="flex gap-2 pb-2">
              <Button
                onClick={() => setShowFilter(!showFilter)}
                className="border-ashShade-2 border px-0 mx-0"
                text=""
                type="plain"
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<BsFunnel color="#9099A8" />}
              />
              <Button
                className="border-ashShade-2 border px-0 mx-0"
                text=""
                type="plain"
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<TbAccessible color="#9099A8" />}
              />
              <Button
                onClick={handleAddRecord}
                text=""
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<TbPlus color="white" />}
              />
            </div>
          </>
        }
      />

      <div className="">
        {showModal && <AddSupplyModal onClose={handleCloseModal} initialData={editingRecord} />}

        <div className=" mb-4 mx-4 ">
          <div className="flex items-center justify-between">
            <p className=" text-2xl font-semibold  ">Supply</p>
          </div>
        </div>

        {showFilter && (
          <div className="w-full my-4">
            <Filter
              onChange={(val: { [key: string]: (string | Date)[] }) => setFilters(val)}
              materialData={materialData}
              vendorData={vendorData}
            />
          </div>
        )}
        <div className=" mb-4  items-center grid grid-cols-2 gap-x-4 ">
          <StatCard
            image={Sum}
            label="Sum"
            // value={`${selectedProject?.currency?.code} ${formatWithComma(Number(totalVendor))}`}
            value={`${items} Sum`}
          />
          <StatCard image={MaterialStat} label="Number of Items" value={`${items} Materials`} />
        </div>
        <SupplyTable
          data={filtered}
          loading={loading ?? false}
          setEditing={setEditing}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default Supply;
