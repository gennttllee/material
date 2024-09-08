// import React, { useState } from 'react'
// import { centered } from '../../../../../constants/globalStyles'
// import { ProfessionalBrief } from '../../../../../types';
// import BidCard from './BidCard'

export default function BidsGrid() {
  //   const [allBids, setAllBids] = useState<ProfessionalBrief['literalBids']>([]);
  //   const handleAllBids = (bid:ProfessionalBrief['literalBids'][number],type:'global'|'local') => {
  //     setAllBids(prev => {
  //       const bids =
  //       prev.map(one => {
  //         if(one._id !== bid._id) return one
  //         return bid
  //       })
  //       // update the context
  //       if(type === 'global'){
  //         const newProjects = menuProjects.map((project,index) => {
  //           if(index === selectedProjectIndex){
  //             return { ...project, literalBids: bids }
  //           }else{
  //             return project
  //           }
  //         })
  //         handleContext("menuProjects",newProjects)
  //       }
  //       // update the state
  //       return bids
  //     });
  //   };
  //   return (
  //     <div className="w-full h-full">
  //         {allBids[0] ? (
  //             <div className="grid md:grid-cols-3 gap-3 md:gap-5 w-full">
  //             {
  //                 React.Children.toArray(
  //                     allBids.map((one) => (
  //                         <BidCard
  //                           bid={one}
  //                           setAllBids={handleAllBids}
  //                           setMainBid={(val)=> setActiveBid(val)}
  //                         />
  //                     ))
  //                 )
  //             }
  //             </div>
  //         ) : (
  //             <div className={centered + "h-5/6"}>
  //             <h1 className="text-3xl font-semibold text-bash">No Bids Found</h1>
  //             </div>
  //         )}
  //     </div>
  //   )
}
