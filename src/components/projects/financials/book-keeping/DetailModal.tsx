import React from 'react';

interface Props {
  fieldset: Record<string, any>[];
  header?: string;
  description?: string;
}
const DetailModal = ({ fieldset, header, description }: Props) => {
  return (
    <div className=" border-ashShade-0 border-3 rounded-md shadow-bnkle bg-white p-6 w-full">
      <p className="  text-black text-lg ">{header ?? 'Item Details'}</p>
      <div className=" bg-ashShade-0 mt-4 rounded-md px-4 w-full ">
        {fieldset.map((m, i) => {
          let vals = Object.entries(m)[0];

          return <Item label={vals[0]} value={vals[1]} underline={i !== fieldset.length - 1} />;
        })}
      </div>
      <div className=" mt-6">
        <p className=" text-black text-sm ">Description</p>
        <div className=" text-black text-sm">{description}</div>
      </div>
    </div>
  );
};

const Item = ({
  label,
  value,
  underline
}: {
  label?: string;
  value?: string;
  underline?: boolean;
}) => {
  return (
    <div
      className={` py-4  flex items-center justify-between ${
        underline ? ' border-b-2 border-ashShade-3  ' : ''
      } `}>
      <span className=" text-black text-sm font-semibold ">{label}</span>
      <span className=" text-bash ">{value}</span>
    </div>
  );
};

export default DetailModal;
