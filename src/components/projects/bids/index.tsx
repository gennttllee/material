import React from 'react';
import Contractor from './contractor';
import PortfolioManager from './portfoliomanager';
import useRole from 'Hooks/useRole';

const Bids = () => {
  const { isProfessional, canSeeSnapshot, isOwner } = useRole();

  return canSeeSnapshot || isOwner ? <PortfolioManager /> : <Contractor />;
};

export default Bids;
