import Button from 'components/shared/Button';
import React, { useState, useMemo } from 'react';
import { TbAccessible, TbPlus } from 'react-icons/tb';
import { BsFunnel } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import AddInventoryModal from './AddInventoryModal';
import { useAppSelector } from 'store/hooks';
import InventoryTable from './InventoryTable';
import ActivitySelector from './ActivitySelector';
import { Inventory, ActivityType } from './types';
import { convertToProper } from 'components/shared/utils';
import InventoryFilter from './InventoryFilter';
import ProcurementTabs from '../layout/ProcurementTabs';

const InventoryRegister = () => {
  let navigate = useNavigate();

  let { data, loading } = useAppSelector((m) => m.inventoryRegister);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Inventory | undefined>(undefined);
  const [showActivitySelector, setShowActivitySelector] = useState(false);
  const [activity, setActivity] = useState<ActivityType>('Disburse');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<{ [key: string]: (Date | string)[] }>({
    material: [],
    receiver: [],
    date: []
  });

  const handleEditing = (x: Inventory) => {
    setEditing(x);
    setShowModal(true);
  };

  let { materialData, receiverData } = useMemo(() => {
    let materialAcc: { [key: string]: boolean } = {};
    let receiverAcc: { [key: string]: boolean } = {};

    data.forEach((m) => {
      materialAcc[m.material] = true;
      receiverAcc[m.receivedBy] = true;
    });

    const convertToOption = (list: string[]) => {
      return list.map((m) => ({ value: m, label: convertToProper(m) }));
    };

    return {
      materialData: convertToOption(Object.keys(materialAcc)),
      receiverData: convertToOption(Object.keys(receiverAcc))
    };
  }, [data]);

  const handleFilter = () => {
    let _data = [...data];
    if (filters?.receiver && filters?.receiver.length > 0) {
      let receiver = filters?.receiver as string[];
      let _receiver = receiver?.map((m) => m.toLowerCase());
      _data = _data.filter((m) => _receiver.includes(m?.receivedBy?.toLowerCase() as string));
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

  return (
    <>
      <ProcurementTabs
        buttons={
          <>
            <div className="relative flex gap-2 pb-2">
              <Button
                className="border-ashShade-2 border px-0 mx-0"
                text=""
                type="plain"
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<BsFunnel color="#9099A8" />}
                onClick={() => setShowFilter(!showFilter)}
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
                text=""
                style={{
                  padding: '9px 18px'
                }}
                LeftIcon={<TbPlus color="white" />}
                onClick={() => setShowActivitySelector(!showActivitySelector)}
              />
              {showActivitySelector && (
                <ActivitySelector setActivity={setActivity} setShowModal={setShowModal} />
              )}
            </div>
          </>
        }
      />

      <div className=" ">
        {showModal && (
          <AddInventoryModal
            activity={activity}
            setShowActivitySelector={setShowActivitySelector}
            isEditing={Boolean(editing)}
            value={editing}
            closer={() => {
              setShowModal(false);
              setEditing(undefined);
            }}
          />
        )}

        {showFilter && (
          <div className="w-full my-4">
            <InventoryFilter
              onChange={(val: { [key: string]: (string | Date)[] }) => {
                setFilters(val);
              }}
              materialData={materialData}
              receiverData={receiverData}
            />
          </div>
        )}

        <InventoryTable
          data={filtered}
          loading={loading}
          setEditing={handleEditing}
          activity={activity}
        />
      </div>
    </>
  );
};

export default InventoryRegister;
