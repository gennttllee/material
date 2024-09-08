import React, { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { AiOutlineFile } from 'react-icons/ai';
import { useNavigate, useParams, useRoutes } from 'react-router-dom';
import { paymentSchedules, summaryCards, transactionHistory } from './constants';
import GroupCard from './GroupCard';
import ScheduleItem from './ScheduleItem';
import Transaction from './Transaction';
import { VscChecklist } from 'react-icons/vsc';
import RecentPaymentsModal from './RecentPaymentsModal';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import UpcomingPayments from './UpcomingPayments';
import { updateField, openModal, closeModal } from 'store/slices/financeSlice';
import BudgetModal from './BudgetModal';
import { StoreContext } from 'context';
import useRole from 'Hooks/useRole';
import { TbBook, TbChecklist } from 'react-icons/tb';
import nocontent from 'assets/nocontent.svg';
import ExpenditureModal from './ExpenditureModal';
import Button from 'components/shared/Button';
const FinancialInfoPage = () => {
  const { projectId } = useParams();
  let { isProfessional } = useRole();
  let dispatch = useAppDispatch();
  const setRecentPayments = useState(false)[1];
  const setBudgetModal = useState(false)[1];
  let finance = useAppSelector((m) => m.finance);
  let navigateTo = useNavigate();
  let user = useAppSelector((m) => m.user);

  const tally = useMemo(() => {
    const mtally = [finance.data.estimatedBudget, 0, 0];

    if (finance.data.payments) {
      let total = 0;
      let payments = finance.data.payments;
      for (let i = 0; i < payments.length; i++) {
        if (payments[i].isConfirmed === true) {
          total += payments[i].amount;
        }
      }
      mtally[2] = total;
    }

    if (finance.data.expenditure) {
      let total = 0;
      for (const exp of finance.data.expenditure) {
        total += exp.amount;
      }
      mtally[1] = total;
    }

    return mtally;
  }, [finance]);

  const findUpcoming = useCallback(() => {
    let { disbursements } = finance.data;
    let upcoming: any[] | undefined = [
      ...(disbursements?.filter((m) => {
        let today = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
        let nextDate = Math.floor(new Date(m.dueDate).getTime() / (1000 * 60 * 60 * 24));
        return today <= nextDate;
      }) as [])
    ].sort((a: any, b: any) => (a.dueDate > b.dueDate ? 1 : b.dueDate > a.dueDate ? -1 : 0));
    if (upcoming && upcoming.length > 0) {
      return upcoming[0];
    } else if (disbursements) {
      return disbursements[disbursements.length - 1];
    } else {
      return undefined;
    }
  }, [finance.data]);

  useEffect(() => {
    if (!finance.data.bidId) {
      navigateTo(`/projects/${projectId}/financials`);
    }
  }, []);

  const sortedExpenditures = useMemo(() => {
    if (!finance.data.expenditure) return [];
    else return [...finance.data.expenditure].reverse();
  }, [finance.data.expenditure]);

  return (
    <div className="w-full flex-1 h-full  flex-col pb-10 ">
      {finance.modal.open && finance.modal.name === 'payment' && (
        <RecentPaymentsModal setter={setRecentPayments} />
      )}
      {finance.modal.open && finance.modal.name === 'budget' && (
        <BudgetModal setter={setBudgetModal} />
      )}
      {finance.modal.open && finance.modal.name === 'expenditure' && <ExpenditureModal />}
      <div className="flex sticky bg-projectBg top-0 z-20 items-center pb-2  text-sm cursor-pointer">
        <span onClick={() => navigateTo(-1)} className="text-borange mr-2 flex  items-center">
          Financials <BsChevronRight className="text-borange ml-2" />{' '}
        </span>
        <span className="text-bash ">{`${finance.data.bidName} Finance`}</span>
      </div>
      <div
        className="mt-6 flex items-center justify-between
      ">
        <span className="text-black text-2xl font-Medium">{finance.data.bidName} Financials</span>
        <span className="rounded-md flex font-Medium items-center py-2 px-8 border-bblue border-2 text-bblue">
          {' '}
          <AiOutlineFile size={16} className="mr-2" />
          Download financial report
        </span>
      </div>
      <div className="grid grid-cols-3 gap-5 mt-5">
        {summaryCards.map((m, i) => (
          <GroupCard {...m} key={i} amount={tally[i]} />
        ))}
      </div>
      <div className="grid  grid-cols-3   gap-5 mt-5 pb-10">
        <div className=" bg-white col-span-2  py-8 px-6 rounded-md">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Recorded Payments</span>
            {finance.data.payments && finance.data?.payments?.length > 0 ? (
              !isProfessional ? (
                <span
                  onClick={() => {
                    dispatch(openModal({ name: 'payment', isEditing: false }));
                  }}
                  className=" hover:underline  cursor-pointer text-bblue text-sm font-semibold border-bblue  ">
                  + Record New Payment
                </span>
              ) : null
            ) : null}
          </div>

          <div className="w-full h-full pt-4">
            {finance.data.payments &&
              finance.data.payments.length > 0 &&
              finance.data.payments?.map((m, i: number) => (
                <ScheduleItem
                  {...m}
                  _id={m._id}
                  isfirst={i === 0}
                  key={m._id}
                  id={i}
                  islast={finance.data.payments && finance.data.payments.length - 1 === i}
                />
              ))}
            {finance.data.payments && finance.data.payments?.length > 0 ? null : (
              <div className="w-full  flex flex-col items-center mt-20 justify-center ">
                <img src={nocontent} alt="" className="margin-auto w-2/5 " />
                <span className=" mt-3 text-bash">No Payments recorded yet</span>
                {['contractor', 'consultant'].includes(user.role) ? null : (
                  <span
                    onClick={() => {
                      dispatch(openModal({ isEditing: false, name: 'payment' }));
                    }}
                    className=" border cursor-pointer text-bblue font-semibold border-bblue px-8 py-2 rounded-md mt-8">
                    Record New Payment
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <div className=" col-span-1 h-full ">
          <div className="bg-white pb-3 pt-2 px-6 rounded-md">
            {finance.data.disbursements && finance.data.disbursements.length > 0 ? (
              <>
                <div className="flex my-4 items-center justify-between text-sm">
                  <span className="font-semibold">Upcoming Payment</span>
                </div>
                {findUpcoming() ? (
                  <>
                    <UpcomingPayments
                      {...findUpcoming()}
                      contractor={finance.data.contractor || ''}
                    />
                    <span
                      onClick={() => navigateTo('disbursement-plan')}
                      className="text-bblue  w-full flex items-center justify-center mt-2 hover:underline cursor-pointer">
                      <TbChecklist className="mr-2" size={16} />
                      <span className="font-semibold ">View disbursement plan</span>
                    </span>
                  </>
                ) : (
                  <p className="text-center mt-4 py-2 bg-ashShade-0 rounded-md">
                    No Disbursement Plan yet
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-col justify-center items-center">
                <div className=" bg-ashShade-0 mt-6 my-4 rounded-lg w-full flex flex-col items-center py-5">
                  <VscChecklist size={32} color="#77828D" />
                  <span className=" mt-3 text-bash">No Payments recorded yet</span>
                </div>
                <span
                  onClick={() => navigateTo('disbursement-plan')}
                  className="text-bblue font-Medium cursor-pointer hover:underline">
                  {'+  Create disbursement plan'}
                </span>
              </div>
            )}
          </div>
        
          <div className="mt-5 rounded-md bg-white px-4 py-6  relative overflow-y-auto">
            <p className="font-Medium mt-3  ">Transaction History</p>
            {sortedExpenditures ? (
              sortedExpenditures.map((m) => <Transaction key={m.title} {...m} />)
            ) : (
              <div className="  mt-6 my-10 rounded-lg w-full flex flex-col items-center py-5">
                <img src={nocontent} alt="" className="margin-auto w-4/5 " />
                <span className=" text-bblack-0">No Transaction Done yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialInfoPage;
