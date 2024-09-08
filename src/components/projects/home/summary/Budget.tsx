import useProjectFinancials from 'Hooks/useProjectFinancials';
import { summaryCards } from 'components/projects/financials/constants';
import { GroupCardProps } from 'components/projects/financials/types';
import { StoreContext } from 'context';
import React, { useContext, useMemo } from 'react';

const Budget = () => {
  const { financials } = useProjectFinancials();

  const tally_ = useMemo(() => {
    const _tally = [0, 0, 0];
    financials.forEach((m) => {
      _tally[0] += m.estimatedBudget || 0;
      // 1.
      if (m.expenditure)
        for (const one of m.expenditure) {
          _tally[1] += one.amount;
        }
      // 2.
      if (m.payments) {
        let payments: { isConfirmed: boolean; amount: number }[] = m.payments.filter(
          (m: { isConfirmed: boolean; amount: number }) => m.isConfirmed
        );
        let payment = payments.map((m: { amount: number }) => m.amount);
        _tally[2] = payment.length > 0 ? payment.reduce((x, y) => x + y) : 0;
      }
    });

    return _tally;
  }, [financials]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3  gap-4">
      {summaryCards.map((m, i) => (
        <BudgetCard key={i} {...m} amount={tally_[i]} />
      ))}
    </div>
  );
};

const BudgetCard = ({ amount, title, icon }: GroupCardProps) => {
  const { selectedProject } = useContext(StoreContext);
  return (
    <div className="p-6 flex-1 bg-white rounded-md">
      <div className="w-full h-full flex items-center">
        <div className="p-4 rounded-full bg-blueShades-1 flex justify-center items-center">
          {React.createElement(icon, {
            size: 24,
            color: '#437ADB'
          })}
        </div>
        <div className="ml-4 flex flex-col">
          <p className="text-bash text-sm">{title}</p>
          <p className="text-bblack-1 text-2xl mt-1 font-semibold">
            {selectedProject.currency?.code} {formatter.format(amount as number)}
          </p>
        </div>
      </div>
    </div>
  );
};

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
export { formatter };
export default Budget;
