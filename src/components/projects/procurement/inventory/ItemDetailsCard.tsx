import { Inventory } from './types';

interface Props {
  itemDetails: Inventory;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemDetailsCard = ({ itemDetails, setShowDetails }: Props) => {
  return (
    <div onMouseEnter={() => setShowDetails(true)} onMouseLeave={() => setShowDetails(false)}>
      <h3 className="text-2xl font-medium pb-4">Item details</h3>
      <div className="flex flex-col gap-4 bg-ashShade-0 p-4 rounded-md">
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Material Name</span>
          <span className="text-bash">{itemDetails.material}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Quantity</span>
          <span className="text-bash">{itemDetails.quantity}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Disbursed by</span>
          <span className="text-bash">{itemDetails.disbursedBy}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Location</span>
          <span className="text-bash">{itemDetails.location}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Received by</span>
          <span className="text-bash">{itemDetails.receivedBy}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Work Area</span>
          <span className="text-bash">{itemDetails.workArea}</span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Activity Type</span>
          <span
            className={`text-bash py-1 px-3 rounded-3xl ${
              itemDetails.activityType === 'Disburse'
                ? 'bg-redShades-1 text-redShades-2'
                : 'bg-bgreen-1 text-bgreen-0'
            }`}>
            {itemDetails.activityType}
          </span>
        </div>
        <div className="flex justify-between items-center w-full border-b border-b-ashShade-3 pb-4">
          <span className="text-bblack-1 font-semibold">Activity Date</span>
          <span className="text-bash">{new Date(itemDetails.date).toDateString().slice(4)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-6">
        <span className="text-bblack-1 font-semibold">Notes</span>
        <span className="text-bash">{itemDetails.notes}</span>
      </div>
    </div>
  );
};

export default ItemDetailsCard;
