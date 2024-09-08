import { CommercialSpaceType, EditableComponent } from 'components/projectbrief/AddOthers';
import InputField from 'components/shared/InputField';
import { ProjectBrief } from 'pages/projectform/utils';
import React, { useEffect, useMemo, useState } from 'react';

interface Props {
  initialList?: ProjectBrief['commercialSpaces'];
  onListChange: (x: CommercialSpaceType[]) => void;
}
const SpaceAdder = ({ initialList, onListChange }: Props) => {
  const [spaceList, setSpaceList] = useState<CommercialSpaceType[]>(
    initialList?.map((m) => ({ name: m.name, quantity: m.quantity })) || []
  );
  const [spaces, setSpaces] = useState<CommercialSpaceType>({
    name: '',
    quantity: 0
  });

  useEffect(() => {
    onListChange(spaceList);
  }, [spaceList]);
  const edit = (idx: number, value: CommercialSpaceType) => {
    let dataCopy = [...spaceList];
    dataCopy[idx] = value;
    setSpaceList(dataCopy);
  };

  const remove = (i: number) => {
    let datacopy = [...spaceList];
    datacopy.splice(i, 1);
    setSpaceList(datacopy);
  };
  let isAddDisabled = useMemo(() => {
    return !(spaces.name && spaces.quantity);
  }, [spaces]);
  return (
    <div className="flex  flex-col items-start">
      <div className=" flex w-full flex-wrap gap-3  py-3">
        {spaceList.map((el: CommercialSpaceType, i: number) => (
          <EditableComponent
            idx={i}
            element={el}
            onRemove={() => remove(i)}
            onEdit={(val: CommercialSpaceType) => edit(i, val)}
          />
        ))}
      </div>
      <div className=" flex w-full   items-end">
        {
          <div className=" flex items-center flex-1 justify-between overflow-auto   ">
            <InputField
              value={spaces.name}
              label="Name"
              onChange={(x) => {
                setSpaces({ ...spaces, name: x.target.value });
              }}
              placeholder="stadium"
              ContainerClassName="  flex-1   "
            />
            <div className=" mx-4 max-w-[100px]">
              <InputField
                value={spaces.quantity.toString()}
                ContainerClassName=" w-auto"
                type="number"
                className=" "
                label="Quantity"
                onChange={(x) => {
                  setSpaces({ ...spaces, quantity: parseInt(x.target.value) });
                }}
                placeholder="2"
              />
            </div>
          </div>
        }
        <button
          disabled={isAddDisabled}
          className={` ${' mb-3 '} bg-bblue ml-1 ${
            isAddDisabled ? ' bg-bbg' : ''
          } text-sm text-white rounded-md px-5 py-3`}
          onClick={() => {
            setSpaceList([...spaceList, spaces]);
            setSpaces({ name: '', quantity: 0 });
          }}>
          Add
        </button>
      </div>
    </div>
  );
};

export default SpaceAdder;
