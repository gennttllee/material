import { convertToProper, toDecimalPlaceWithCommas } from 'components/shared/utils';
import { StoreContext } from 'context';
import { differenceInDays, differenceInMonths } from 'date-fns';
import { useContext } from 'react';

interface Props {
  amount: number;
  contractor: string;
  dueDate: string;
}

const UpcomingPayments = ({ amount, contractor, dueDate }: Props) => {
  const { selectedProject } = useContext(StoreContext);
  const days = differenceInDays(new Date(dueDate), new Date());
  const findMonth = () => {
    const years = new Date(dueDate).getFullYear() - new Date().getFullYear();
    if (years <= 0) {
      if (new Date().getMonth() === new Date(dueDate).getMonth()) {
        return 'This Month';
      } else if (new Date().getMonth() - new Date(dueDate).getMonth() === -1) {
        return 'Next Month';
      } else {
        return `in ${differenceInMonths(new Date(), new Date(dueDate))} months`;
      }
    } else {
      return `${years === 1 ? 'Next Year' : `Next ${years} years`}`;
    }
  };
  return (
    <div className="w-full rounded-md px-3 py-4 bg-bbg">
      <div className="flex items-center justify-between font-semibold">
        <span>To {convertToProper(contractor)}</span>
      </div>
      <div className="flex mt-4 items-center text-xs justify-between font-semibold">
        <span className=" text-bblack-0 font-semibold text-xl">
          {selectedProject.currency?.code} {toDecimalPlaceWithCommas(amount)}
        </span>
        <span className="text-white bg-byellow-1 p-2 rounded-2xl ">
          {days > 0 ? `DUE in ${days} Day${days > 1 ? 's' : ''}` : 'Due today'}
        </span>
      </div>
    </div>
  );
};

export default UpcomingPayments;
