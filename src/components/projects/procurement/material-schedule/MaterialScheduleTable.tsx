import { useMemo, useState, useEffect } from "react";
import { MaterialScheduleRecord, MaterialRecord } from "./types";
import MaterialTableItem from "./components/MaterialTableItem";
import NoContent from "components/projects/photos/NoContent";
import { LoaderX } from "components/shared/Loader";
import PaginationComponent from "./components/PaginationComponent";
import ArrowIcons from "./components/ArrowIcons";

interface Props {
  data: MaterialRecord[];

  loading?: boolean;
  setEditing: (x: MaterialRecord) => void;
  activeTab: string;
}
const numberperPage = 10;
const MaterialScheduleTable = ({
  data,
  setEditing,
  loading,
  activeTab,
}: Props) => {
  let numberofPages = Math.ceil(data?.length / numberperPage);

  // const materialRecords = useAppSelector((state: RootState) => state.materialSchedule.data);
  const [current, setCurrent] = useState(0);

  const _data = useMemo(() => {
    return data?.slice(current * numberperPage, (current + 1) * numberperPage);
  }, [current, data]);

  return (
    <div className="rounded-md">
      {loading ? (
        <div className=" w-full flex rounded-md bg-white  items-center justify-center p-10">
          <LoaderX color="blue" />
        </div>
      ) : data?.length > 0 ? (
        <>
          <table className="  bg-white w-full ">
            <thead>
              <tr className="  border-b  font-semibold">
                <td className=" py-4 pl-4">S/N</td>
                <td className="py-4">Item</td>
                <td className="py-4">Quantity</td>
                <td className="py-4">Rate</td>
                <td className="py-4 flex">
                  Amount <ArrowIcons />
                </td>
                <td className="py-4">Notes</td>
                <td className="py-4 flex">
                  Date <ArrowIcons />
                </td>
                <td className="py-4"></td>
              </tr>
            </thead>
            <tbody>
              {_data?.map((m, i) => (
                <MaterialTableItem
                  key={i}
                  s_n={current * numberperPage + i + 1}
                  {...m}
                  setEditing={setEditing}
                  activeTab={activeTab}
                />
              ))}
            </tbody>
          </table>
          <PaginationComponent
            pageIndex={current}
            pageCount={numberofPages}
            setPageIndex={setCurrent}
          />
        </>
      ) : (
        <NoContent
          subtitle="Keep a record of materials needed to complete the project"
          title="No Material recorded Yet"
        />
      )}
    </div>
  );
};

export default MaterialScheduleTable;
