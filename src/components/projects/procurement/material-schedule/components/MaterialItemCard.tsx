import { FC, useContext } from 'react';
import { MaterialScheduleRecord, MaterialRecord } from '../types';
import { formatWithComma } from 'Utils';
import { StoreContext } from 'context';

const Details: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between border-b py-4">
    <p className="text-sm font-satoshi font-medium text-bblack-1">{label}</p>
    <p className="text-sm font-satoshi font-medium text-bash">{value}</p>
  </div>
);

interface MaterialItemCardProps {
  item: MaterialRecord;
}

const MaterialItemCard: FC<MaterialItemCardProps> = ({ item}) => {
  let { data, activeProject } = useContext(StoreContext);
  return (
    <div className="flex flex-col gap-4 p-6 rounded-md  absolute z-10 bg-white shadow-bnkle top-10 w-[28rem] right-16 mb-20 ">
      <p className="text-2xl font-satoshi font-medium text-black">Material details</p>

      <div className="flex flex-col px-4  bg-ashShade-0 rounded-md ">
        <Details label="Name" value={item.material} />
        <Details label="Quantity" value={`${formatWithComma(item.quantity)} ${item.unit}`} />
        <Details
          label="Rate"
          value={`${activeProject?.currency?.code} ${formatWithComma(item.rate)}`}
        />
        <Details
          label="Amount"
          value={`${activeProject?.currency?.code} ${formatWithComma(item.amount)}`}
        />
        <Details label="Date" value={new Date(item.purchaseDate).toDateString().slice(4)} />
        <Details label="Category" value={item.category} />
      </div>
      <div className="flex flex-col gap-2 ">
        <p className="text-sm font-satoshi font-medium text-bblack-1">Notes</p>
        <p className="text-sm font-satoshi font-medium text-bash">{item.notes}</p>
      </div>
    </div>
  );
};

export default MaterialItemCard;
