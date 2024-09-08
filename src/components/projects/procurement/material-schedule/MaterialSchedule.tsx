import Button from "components/shared/Button";
import { useEffect, useState, useMemo, useContext } from "react";
import { TbPlus } from "react-icons/tb";
import { useAppSelector } from "store/hooks";
import MaterialScheduleTable from "./MaterialScheduleTable";
import { MaterialRecord, MaterialScheduleRecord } from "./types";
import ProcurementTabs from "../layout/ProcurementTabs";
import { BsFunnel } from "react-icons/bs";
import { TbAccessible } from "react-icons/tb";
import AddMaterialRecord from "./components/MaterialHeader";
import Filter from "./Filter";
import { convertToProper } from "components/shared/utils";
import { MaterialTableCard } from "./components/MaterialTableCard";
import { HiOutlineCash } from "react-icons/hi";
import { TbListNumbers } from "react-icons/tb";
import { formatWithComma } from "Utils";
import { StoreContext } from "context";
import useMaterialSchedule from "Hooks/useMaterialSchedule";
import SuperModal from "components/shared/SuperModal";
import { FaUserGroup } from "react-icons/fa6";
import TabsMaterialSchedule from "./components/TabsMaterialSchedule";
import NoContent from "components/projects/photos/NoContent";
import CreateMaterialModal from "./components/CreateMaterialModal";
import { TOption } from "components/shared/SelectField/SelectField";

const MaterialSchedule = () => {
  const [activeTab, setActiveTab] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  // const [scheduleId, setScheduleId] = useState<string | null>(null);

  const [editing, setEditing] = useState<MaterialRecord | undefined>(undefined);
  const [editingSchedule, setEditingSchedule] = useState<
    MaterialScheduleRecord | undefined
  >(undefined);

  const [filters, setFilters] = useState<{ [key: string]: (Date | string)[] }>({
    material: [],
    category: [],
    date: [],
  });
  const {
    getRecords,
    getScheduleMaterials,
    scheduleMaterials,
    setScheduleMaterialsId,
  } = useMaterialSchedule();
  let { selectedProject } = useContext(StoreContext);
  const { selectedData } = useContext(StoreContext);
  let { data, loading } = useAppSelector((m) => m.materialSchedule);

  const answer = data?.find((item, index) => item._id === activeTab);

  useEffect(() => {
    if (data.length < 1) {
      getRecords();
    }
  }, [data, activeTab, getRecords]);

  useEffect(() => {
    if (data.length > 0 && !activeTab) {
      setActiveTab(data[0]._id);
      getScheduleMaterials(data[0]._id);
      // loading = true;
      getScheduleMaterials(activeTab);
      // .finally(() => loading = false);
    } else if (activeTab) {
      getScheduleMaterials(activeTab);
    }
  }, [data, activeTab, getScheduleMaterials]);

  // const handleAddMaterial = (data: any) => {
  //   // Call function to set scheduleMaterialsId here
  //   setScheduleMaterialsId(scheduleId);
  // };

  const onMaterialClick = (material: MaterialRecord) => {
    setActiveTab(material._id);
  };

  const handleEditing = (x: MaterialRecord) => {
    setEditing(x);
    // setShowModal(true);
  };

  const handleTabsEditing = (x: MaterialScheduleRecord) => {
    setEditingSchedule(x);
    setShowModal(true);
  };

  const toggleAddMaterial = () => {
    setShowAddMaterial((prev) => !prev);
  };

  let { materialData, categoryData } = useMemo(() => {
    const tempMaterial = answer?.materials.map((item, index) => ({
      value: item.material,
      icon: "",
      label: item.material,
    }));
    const categoryTemp = answer?.materials.map((item, index) => ({
      value: item.category,
      label: item.category,
      icon: "",
    }));

    return {
      materialData: tempMaterial,
      categoryData: categoryTemp,
    };
  }, [answer?.materials]);

  const handleFilter = () => {
    let _data = answer?.materials;

    if (filters?.material && filters.material.length > 0) {
      let materials = filters?.material as string[];
      let _materials = materials?.map((m) => m.toLowerCase());
      _data = answer?.materials?.filter((m) =>
        _materials.includes(m?.material?.toLowerCase())
      );
    }

    if (filters?.category && filters?.category.length > 0) {
      let categories = filters?.category as string[];
      let _categories = categories?.map((m) => m.toLowerCase());
      _data = answer?.materials?.filter((m) =>
        _categories.includes(m?.category.toLowerCase())
      );
    }

    if (filters?.date && filters?.date.length > 0) {
      let dates = filters?.date as Date[];
      let _dates = dates.map((m) => m.getTime());
      if (_dates[0] !== _dates[1]) {
        _data = answer?.materials?.filter((m) => {
          let date = new Date(m.purchaseDate).getTime();
          return _dates[0] <= date && date <= _dates[1];
        });
      }
    }

    return _data;
  };

  const filtered = useMemo(handleFilter, [answer, filters]);

  const { totalAmount, items } = useMemo(() => {
    let totalAmount = 0;
    let items = filtered?.length || 0;

    filtered?.forEach((m) => {
      if (m) {
        totalAmount += Number(m.amount);
      }
    });

    return {
      totalAmount,
      items,
    };
  }, [filtered]);

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
                    padding: "9px 18px",
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
                    padding: "9px 18px",
                  }}
                  LeftIcon={<TbAccessible color="#9099A8" />}
                />
                <Button
                  onClick={() => toggleAddMaterial()}
                  text=""
                  style={{
                    padding: "9px 18px",
                  }}
                  LeftIcon={<TbPlus color="white" />}
                />
              </div>
              {showAddMaterial && (
                <AddMaterialRecord
                  onClose={() => setShowAddMaterial(false)}
                  activeTab={activeTab}
                />
              )}
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

        {showFilter && (
          <div className="w-full my-4">
            <Filter
              onChange={(val: { [key: string]: (string | Date)[] }) => {
                setFilters(val);
              }}
              materialData={materialData as TOption[]}
              categoryData={categoryData as TOption[]}
            />
          </div>
        )}

        {data.length > 0 && (
          <div className="my-[1.2em] flex items-center  w-full justify-between gap-5">
            <MaterialTableCard
              className="bg-[#F3F9E8]"
              icon={<HiOutlineCash fontSize={24} color="#4F7411" />}
              label="Total Amount"
              value={`${selectedProject?.currency?.code} ${totalAmount}`}
            />

            <MaterialTableCard
              className="bg-[#ECF2FB]"
              icon={<TbListNumbers fontSize={24} color="#437ADB" />}
              label="Number of Items"
              value={`${items} ${items > 0 ? "materials" : "material"}`}
            />
          </div>
        )}

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

        <TabsMaterialSchedule
          item={data}
          data={data}
          activeTab={activeTab}
          onMaterialClick={onMaterialClick}
          setEditingSchedule={handleTabsEditing}
        />

        <MaterialScheduleTable
          data={filtered && filtered?.length > 0 ? filtered : scheduleMaterials}
          loading={loading}
          setEditing={handleEditing}
          activeTab={activeTab}
        />
      </div>
    </>
  );
};

export default MaterialSchedule;
