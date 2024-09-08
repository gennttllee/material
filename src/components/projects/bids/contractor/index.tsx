import React, { useContext } from 'react';
import { centered } from '../../../../constants/globalStyles';
import noContentImg from '../../.././../assets/nocontent.svg';
import { StoreContext } from '../../../../context';
import BidCard from './components/BidCard';
import 'moment-timezone';

const Contractor = () => {
  const {
    selectedData: { literalBids }
  } = useContext(StoreContext);

  const GridBids = () => (
    <div className="w-full h-full">
      {literalBids[0] ? (
        <div className="grid md:grid-cols-3 gap-3 md:gap-5 w-full">
          {React.Children.toArray(literalBids.map((bid) => <BidCard {...bid} />))}
        </div>
      ) : (
        <div className={centered + 'h-5/6'}>
          <h1 className="text-3xl font-semibold text-bash">No Bids Found</h1>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full h-full pb-10">
      <h5 className="font-semibold text-2xl text-black">Bids</h5>
      {literalBids[0] ? (
        <GridBids />
      ) : (
        <div className={centered + 'h-full flex-col'}>
          <img loading="lazy" decoding="async" src={noContentImg} alt="" className=" w-56 h-56" />
          <h1 className="font-bold text-2xl my-5">No Bid created</h1>
          <p className="text-bash text-base">
            As soon as a bid has been submitted, you would see the bid documents here
          </p>
        </div>
      )}
    </div>
  );
};

export default Contractor;
