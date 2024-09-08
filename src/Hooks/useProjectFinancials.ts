import React, { useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { StoreContext } from 'context';
import NoneBids from 'components/shared/none';
import useRole from 'Hooks/useRole';
import { getPowsByProject } from 'apis/pow';
import { postForm } from 'apis/postForm';
import { Bid, ProjectID } from 'types';
import { POW } from 'components/projects/management/types';
import { TFinance } from 'store/slices/financeSlice';

const useProjectFinancials = () => {
  const [loading, setLoading] = useState(true);
  const { data, selectedProjectIndex } = useContext(StoreContext);
  let { bids, literalBids } = data[selectedProjectIndex];
  let { isProfessional } = useRole();
  const [financials, setFinancials] = useState<TFinance[]>([]);
  const [pows, setPows] = useState<any>();

  let getPows = async () => {
    let { response, e } = await postForm('get', 'pows/project/' + data[selectedProjectIndex]._id);
    if (response) {
      let res: POW[] = response.data.data;
      let existingPows = res.map((m: POW) => m._id);
      let finces = isProfessional
        ? literalBids
          ? literalBids?.filter((m) => m.pow)
          : []
        : bids.filter((m) => m.pow);
      let activeFinancials = [...finces].filter((m: Bid) =>
        existingPows.includes(m?.pow as string)
      );
      let fins: any[] = [];
      // let financeWithAcceptedBids = activeFinancials.filter((m) => {
      //   let completed = m.winningBid.filter((m) => m.status === "accepted")[0]
      //     ?.id;
      //   return completed ? true : false;
      // });
      let financeWithAcceptedBids = activeFinancials.forEach((m) => {
        let completed = m.winningBid.filter((m) => m.status === 'accepted')[0]?.id;
        if (completed) {
          fins.push({ ...m, winningBid: completed });
        }
      });
      return fins;
    }
  };

  const getFinancials = async (m: string, bid: string) => {
    let contractor = '';
    let { e, response } = await postForm('get', 'financials/?bidId=' + m);
    let res = await postForm('get', 'submissions/bid/' + m);
    if (res.response) {
      let { data } = res.response;
      let bidder = data.data.filter((m: any) => m._id === bid)[0];
      contractor = bidder.bidder;
    }

    return { e, response, contractor };
  };

  const getAllFinancials = async () => {
    let acc: any[] = [];
    let all = await getPows();
    setPows(all);
    if (all) {
      let finance = await Promise.all(
        all?.map(async (m) => await getFinancials(m._id, m.winningBid))
      );
      finance.forEach((m, i) => {
        if (m.response) {
          acc.push({ ...m.response.data.data, contractor: m.contractor });
        }
      });
    }

    setFinancials(acc);
    setLoading(false);
  };
  useEffect(() => {
    // getPows();
    // getFinancials();
    getAllFinancials();
  }, [data, selectedProjectIndex]);

  return { loading, financials, pows };
};

export default useProjectFinancials;
