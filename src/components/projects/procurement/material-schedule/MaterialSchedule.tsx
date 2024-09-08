import Button from 'components/shared/Button';
import { useEffect, useState, useMemo, useContext } from 'react';
import { TbPlus } from 'react-icons/tb';
import { useAppSelector } from 'store/hooks';
import MaterialScheduleTable from './MaterialScheduleTable';
import { MaterialRecord, MaterialScheduleRecord } from './types';
import ProcurementTabs from '../layout/ProcurementTabs';
import { BsFunnel } from 'react-icons/bs';
import { TbAccessible } from 'react-icons/tb';
import AddMaterialRecord from './components/MaterialHeader';
import Filter from './Filter';
import { convertToProper } from 'components/shared/utils';
import { MaterialTableCard } from './components/MaterialTableCard';
import { HiOutlineCash } from 'react-icons/hi';
import { TbListNumbers } from 'react-icons/tb';
import { formatWithComma } from 'Utils';
import { StoreContext } from 'context';
import useMaterialSchedule from 'Hooks/useMaterialSchedule';
import SuperModal from 'components/shared/SuperModal';
import { FaUserGroup } from "react-icons/fa6";
import TabsMaterialSchedule from './components/TabsMaterialSchedule';
import NoContent from 'components/projects/photos/NoContent';
import CreateMaterialModal from './components/CreateMaterialModal';

const MaterialSchedule = () => {
  const [activeTab, setActiveTab] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  // const [scheduleId, setScheduleId] = useState<string | null>(null);
  
  const [editing, setEditing] = useState<MaterialRecord | undefined>(undefined);
  const [editingSchedule, setEditingSchedule] = useState<MaterialScheduleRecord | undefined>(undefined);

  const [filters, setFilters] = useState<{ [key: string]: (Date | string)[] }>({
    material: [],
    category: [],
    date: []
  });
  const { getRecords, getScheduleMaterials, scheduleMaterials,  setScheduleMaterialsId} = useMaterialSchedule();
  let { selectedProject } = useContext(StoreContext);
  const { selectedData } = useContext(StoreContext);
  let { data, loading } = useAppSelector((m) => m.materialSchedule);
 

  useEffect(() => {
    if (data.length < 1) {
      getRecords();
    }
  }, [data, activeTab]);

  useEffect(() => {
    if (data.length > 0 && !activeTab) {
      setActiveTab(data[0]._id);
      getScheduleMaterials(data[0]._id);
      // loading = true;
      getScheduleMaterials(activeTab)
      // .finally(() => loading = false);
    } else if (activeTab) {
      getScheduleMaterials(activeTab); 
    }
  }, [data, activeTab]);


 

  console.log('Data:', data)

  // const handleAddMaterial = (data: any) => {
  //   // Call function to set scheduleMaterialsId here
  //   setScheduleMaterialsId(scheduleId);
  // };

  const onMaterialClick = (material: MaterialRecord) => {
    setActiveTab(material._id);
  };
  

  const handleEditing = (x: MaterialRecord) => {
    setEditing(x);
    setShowModal(true);
  };

  const handleTabsEditing = (x: MaterialScheduleRecord) => {
    setEditingSchedule(x);
    setShowModal(true);
  }

  const toggleAddMaterial = () => {
    setShowAddMaterial((prev) => !prev);
  };

  // const handleTabChange = (index: number) => {
  //   if (data[index]?._id !== scheduleId) {
  //     setScheduleId(data[index]._id);
  //   }
  //   setActiveTab(index);
  // };



  return (
    <>
      <ProcurementTabs
        buttons={
          <>
            <div className="relative">
              <div className="flex gap-2 pb-2">
                <Button
                  className="border-ashShade-2 border px-0 mx-0"
                  text=""
                  type="plain"
                  style={{
                    padding: '9px 18px'
                  }}
                  onClick={() => {
                    setShowFilter(!showFilter);
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
                  onClick={() => toggleAddMaterial()}
                  text=""
                  style={{
                    padding: '9px 18px'
                  }}
                  LeftIcon={<TbPlus color="white" />}
                />
              </div>
              {showAddMaterial && <AddMaterialRecord onClose={() => setShowAddMaterial(false)} activeTab={activeTab}  />}
                {/* onAdd={handleAddMaterial} */}
            </div>
          </>
        }
      />

      <div className=" ">
        <div className="">
          <div className="flex items-center justify-between">
            <h2 className="font-Medium text-2xl">Material Schedule</h2>
          </div>
        </div>

        {showModal && (
        <CreateMaterialModal
          // onAdd={() => triggerRefresh()}
          isEditing={Boolean(editing)}
          value={editingSchedule}
          closer={() => {
            setShowModal(false);
            setEditing(undefined);
          }}
        />
      )}

      



      <TabsMaterialSchedule item={data} data={data} activeTab={activeTab} onMaterialClick={onMaterialClick} setEditingSchedule={handleTabsEditing} />

      <MaterialScheduleTable
          data={scheduleMaterials}
          loading={loading}
          setEditing={handleEditing}
          activeTab={activeTab}
        />
    
      
   {/* {scheduleMaterials && Array.isArray(scheduleMaterials) && scheduleMaterials.length > 0 ? ( */}
        {/* <MaterialScheduleTable
          data={scheduleMaterials}
          loading={loading}
          setEditing={handleEditing}
          activeTab={activeTab}
        /> */}
{/* ) : (
  <NoContent
  subtitle="Keep a record of materials needed to complete the project"
  title="No Material recorded Yet"
/>
)} */}
      
      </div>
    </>
  );
};

export default MaterialSchedule;
