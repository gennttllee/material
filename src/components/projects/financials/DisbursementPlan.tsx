import React, { useEffect, useMemo, useState, useCallback, useContext } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { useNavigate, useParams } from 'react-router-dom';
import Tranches from './Tranches';
import TranchModal from './TranchModal';
import { TranchProps } from './types';
import { TiWarning } from 'react-icons/ti';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { updateField } from 'store/slices/financeSlice';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import Loader, { LoaderX } from 'components/shared/Loader';
import { StoreContext } from 'context';
import useRole from 'Hooks/useRole';
const DisbursementPlan = () => {
  const { canAddTranch } = useRole();
  const { projectId } = useParams();
  let project = useContext(StoreContext);
  const [tranchModal, setTranchModal] = useState(false);
  const [confirming, setConfirming] = useState(false);
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  useCallback(() => {
    navigate(`/projects/${projectId}/financials`);
  }, [project.selectedProject]);

  let { data } = useAppSelector((m) => m.finance);
  let user = useAppSelector((m) => m.user);
  let finance = useAppSelector((m) => m.finance);
  const executor = ({ amount, dueDate, _id, isConfirmed }: TranchProps) => {
    let newTranch = [{ amount, dueDate, _id, isConfirmed }, ...(data?.disbursements || [])];
    dispatch(
      updateField({
        data: newTranch,
        field: 'disbursements'
      })
    );
  };
  useEffect(() => {
    if (!data._id) {
      navigate(`/projects/${projectId}/financials`);
    }
  }, []);
  const checkForUnconfirmedDisbursement = () => {
    if (data.disbursements && data.disbursements.length > 1) {
      let unconfirmed = data.disbursements.filter((m) => m.isConfirmed === false);
      if (unconfirmed.length > 0) return true;

      return false;
    }
    return false;
  };

  let confirmationCheck = useMemo(() => {
    return checkForUnconfirmedDisbursement();
  }, [finance]);
  const confirmDisbursements = async () => {
    setConfirming(true);
    let { response, e } = await postForm('patch', 'financials/' + data._id + '/tranch');
    if (response) {
      dispatch(
        updateField({
          data: response.data.data.reverse(),
          field: 'disbursements'
        })
      );

      displaySuccess('disbursements plan confirmed successfully');
    }
    setConfirming(false);
  };
  return (
    <div className="w-full h-full   flex flex-col ">
      {finance.modal.open && finance.modal.name === 'tranch' && (
        <TranchModal executor={executor} setter={setTranchModal} />
      )}
      <div
        onClick={() => navigate(-1)}
        className="flex  sticky top-0 z-20 items-center pb-2  text-sm cursor-pointer">
        <span className="text-borange mr-2 flex  items-center">
          Financials <BsChevronRight className="text-borange ml-2" />{' '}
        </span>
        <span className="text-bash ">{data.bidName + 'Finance'}</span>
        <span className="text-borange mr-2 flex  items-center">
          <BsChevronRight className="text-borange ml-2" />{' '}
        </span>
        <span className="text-bash ">{'Disbursement Plan'}</span>
      </div>
      <p className="my-6 font-semibold text-2xl">Disbursement Plan</p>
      {confirmationCheck ? (
        <div className="px-6 py-4 bg-lightblue rounded-md my-6 flex items-center justify-between gap-2">
          <div className="flex items-center text-bblue">
            <TiWarning color="#437ADB" size={24} />
            <span>
              <span className="font-semibold">&nbsp; Awaiting Approval</span>
              <span>&nbsp;Newly created Disbursement plan is awaiting approval</span>
            </span>
          </div>
          {confirmationCheck ? (
            canAddTranch ? null : (
              <span
                onClick={() => {
                  if (!confirming) {
                    confirmDisbursements();
                  }
                }}
                className="bg-bblue flex items-center justify-center  cursor-pointer rounded-md p-2 text-white font-semibold min-w-[150px]">
                {confirming ? <LoaderX /> : 'Confirm Disbursement Plan'}
              </span>
            )
          ) : null}
        </div>
      ) : null}
      <div className=" flex flex-1 overflow-y-auto">
        {
          <Tranches
            tranches={data?.disbursements || []}
            modalToggler={() => setTranchModal(true)}
          />
        }
      </div>
    </div>
  );
};

export default DisbursementPlan;
