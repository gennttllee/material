import team from '../../assets/team.svg';
import photos from '../../assets/photos.svg';
import dash from '../../assets/dashboard.svg';
import financials from '../../assets/financials.svg';
import documents from '../../assets/documents.svg';
import project from '../../assets/project.svg';
import referal from '../../assets/referal.svg';
import bids from '../../assets/bids.svg';

const menuitems = [
  { image: dash, name: 'Dashboard', path: 'home' },
  { image: team, name: 'Communication', path: 'communication' },
  { image: financials, name: 'Procurement', path: 'procurement' },
  { image: bids, name: 'Bid', path: 'bid' },
  { image: financials, name: 'Budget', path: 'financials' },
  { image: project, name: 'Schedule', path: 'management' },
  { image: documents, name: 'Documents', path: 'documents' },
  { image: photos, name: 'Photos', path: 'photos' }
];

const ref = { image: referal, name: 'Referrals', path: 'referrals' };

export { menuitems, ref };
