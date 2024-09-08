import React, { useContext, useState, useEffect, useCallback } from 'react';
import GhostBids from '../bids/projectowner/bid/GhostBids';
import NoneBids from 'components/shared/none';
import { POW } from '../management/types';
import { postForm } from 'apis/postForm';
import ProjectCard from './ProjectCard';
import { StoreContext } from 'context';
import { Bid, ProjectID } from 'types';
import Button from 'components/shared/Button';
import { TbBook, TbReceipt, TbReceipt2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import useRole from 'Hooks/useRole';

const Projects = () => {
  const [financials, setFinancials] = useState<(Bid<string> | Bid<ProjectID>)[]>([]);
  const { data, selectedProjectIndex } = useContext(StoreContext);
  const [resolved, setResolved] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const { canUseBookKeeping } = useRole();

  const getPows = async () => {
    const { response, e } = await postForm('get', 'pows/project/' + data[selectedProjectIndex]._id);
    const Bids = await postForm('get', 'bids/project/' + data[selectedProjectIndex]._id);
    if (response && Bids.response) {
      const res: POW[] = response.data.data;
      const existingPows = res.map((m: POW) => m._id);
      const finance = Bids.response.data.data.filter((m: Bid<string> | Bid<ProjectID>) => m.pow);
      const activeFinancials = [...finance].filter((m: Bid) =>
        existingPows.includes(m?.pow as string)
      );
      const financeWithAcceptedBids = activeFinancials.filter((m) => {
        const completed = m.winningBid.filter((m: { status: string }) => m.status === 'accepted')[0]
          ?.id;
        return completed ? true : false;
      });

      setFinancials((_) => financeWithAcceptedBids);
    }
    setDone((_) => true);
  };

  useEffect(() => {
    getPows();
  }, []);

  const register = useCallback((some: any) => {
    let newVal = [...resolved];
    newVal.push(some);
    setResolved((_) => newVal);
  }, []);


  return (
    <div className="flex-1 ">
      <div className="flex items-center justify-between mb-7">
        <p className="font-Medium text-3xl">Financials</p>
        {canUseBookKeeping && (
          <Button
            onClick={() => {
              navigate('book-keeping');
            }}
            type="plain"
            className=" !text-bblue hover:underline  items-center my-4 !border-0"
            text="Book Keeping"
            LeftIcon={<TbReceipt2 className=" mr-1" />}
          />
        )}
      </div>

      <div
        className={`w-full grid-cols-1 grid md:grid-cols-2 xl:grid-cols-3  2xl:grid-cols-4 gap-5  ${
          resolved.includes(true) && financials.length > 0 ? '' : ''
        }`}>
        {financials.length > 0 &&
          financials.map((m, i) => (
            <ProjectCard
              autoload={financials.length === 1}
              index={i}
              register={register}
              bidType={m.type}
              bid={m._id}
              key={i}
              name={m.name}
              end={m.schedule?.end}
              start={m.schedule?.start}
              submissionId={m.winningBid.filter((m) => m.status === 'accepted')[0].id}
              // status={m?.status}
            />
          ))}
      </div>

      {!done ? (
        <GhostBids />
      ) : financials.length < 1 ? (
        <NoneBids
          title="No POW Created Yet on this Project"
          subtitle="Wait for the Contractor to create Program of Works"
          showBtn={false}
        />
      ) : null}
    </div>
  );
};

export default Projects;
