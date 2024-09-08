import React, { useContext, useEffect } from 'react';
import { centered, flexer } from '../../../constants/globalStyles';
import noContentImg from '../../../assets/nocontent.svg';
import useFetch from '../../../Hooks/useFetch';
import { getPowsByProject } from '../../../apis/pow';
import { StoreContext } from '../../../context';
import PowCard from './POW/Components/PowCard';
import Loader from '../../shared/Loader';
import { PMStoreContext } from './Context';
import { useNavigate } from 'react-router-dom';
import NewPowBtn from './POW/Components/NewPowBtn';
import { POW } from './types';
import useRole from 'Hooks/useRole';
import MessagesModal from './POW/Components/MessagesModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setMessageModal } from 'store/slices/taskMessagesModalSlice';

export default function POWS() {
  const navigate = useNavigate();
  const { selectedProject } = useContext(StoreContext);
  const { setContext, pows, hasFetchedAllPows } = useContext(PMStoreContext);
  //
  const { isLoading, load } = useFetch<POW[]>({
    showDisplayError: false
  });

  let { isOwner, canSeeSnapshot } = useRole();

  useEffect(() => {
    if ((!pows || !pows[0]) && !hasFetchedAllPows) {
      load(getPowsByProject(selectedProject._id))
        .then((powRes) => {
          setContext((prev) => ({
            ...prev,
            hasFetchedAllPows: true,
            pows: powRes.data
          }));
        })
        .catch(() =>
          setContext((prev) => ({
            ...prev,
            hasFetchedAllPows: true,
            pows: []
          }))
        );
    }
    // eslint-disable-next-line
  }, [selectedProject, pows]);
  let dispatch = useAppDispatch();
  let messageModal = useAppSelector((m) => m.messageModal);
  const NoPOWView = () => (
    <div className={centered + 'h-[80%] flex-col'}>
      <img alt="" loading="lazy" decoding="async" src={noContentImg} className=" w-56 h-56" />
      <h1 className="font-bold text-2xl mt-6 mb-2">No Program created yet</h1>
      <p className="text-bash text-base text-center mb-5">
        As soon as a Program of Works has been submitted, you would see the POWs desciption here
      </p>
      {isOwner ? null : <NewPowBtn isEmpty={canSeeSnapshot} />}
    </div>
  );

  const header = (
    <header className={'my-5' + flexer}>
      <h5 className="font-Medium text-3xl text-black">Program</h5>
      {isOwner ? null : pows[0] && <NewPowBtn isEmpty={canSeeSnapshot} />}
    </header>
  );

  const PowGrid = () => (
    <div className="h-fit max-h-full overflow-x-scroll grid gap-3 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 w-full pb-10">
      {React.Children.toArray(
        pows.map((pow) => <PowCard {...{ pow }} onClick={() => navigate(pow._id)} />)
      )}
    </div>
  );

  return (
    <>
      {messageModal.isOpen && (
        <MessagesModal
          taskId={messageModal.taskId || ''}
          closer={() => dispatch(setMessageModal({ isOpen: false, taskId: '' }))}
        />
      )}

      <div className="h-full">
        {header}
        {isLoading ? <Loader /> : pows[0] ? <PowGrid /> : <NoPOWView />}
      </div>
    </>
  );
}
