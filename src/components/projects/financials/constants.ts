import { TbWallet, TbReceipt } from 'react-icons/tb';
import { HiOutlineCash } from 'react-icons/hi';
import { GroupCardProps, TransactionProps } from './types';

let bids = [
  {
    contractor: 'Airtable',
    name: 'Substructure',
    start: '08/05/2022',
    end: '19/05/2022',
    status: 'Not Started'
  },
  {
    contractor: 'Cobuildit',
    name: 'Roofing',
    start: '08/05/2022',
    end: '19/05/2022',
    status: 'In Progress'
  },
  {
    contractor: 'Monzo',
    name: 'The Node',
    start: '08/05/2022',
    end: '19/05/2022',
    status: 'Not Started'
  }
];

let summaryCards: GroupCardProps[] = [
  {
    icon: TbWallet,
    title: 'Project Cost Estimate',
    // amount: "300,000,000",
    btn: true,
    btntitle: 'Update budget',
    bgColor: '#F6E8ED',
    iconColor: '#A7194B'
  },
  {
    icon: TbReceipt,
    title: 'Expenditure till date',
    // amount: "0.00",
    btn: true,
    btntitle: 'Record Expenditure',
    bgColor: '#F3F9E8',
    iconColor: '#4F7411'
  },
  {
    icon: HiOutlineCash,
    title: 'Total Amount Disbursed',
    // amount: "0.00",
    bgColor: '#ECF2FB',
    iconColor: '#437ADB'
  }
];

let paymentSchedules = [
  { amount: '300,000.00', confirmed: true, date: 'Jun 28, 2022' },
  { amount: '300,000.00', confirmed: false, date: 'Jun 28, 2022' },
  { amount: '300,000.00', confirmed: false, date: 'Jun 28, 2022' },
  { amount: '300,000.00', confirmed: false, date: 'Jun 28, 2022' },
  { amount: '300,000.00', confirmed: false, date: 'Jun 28, 2022' }
];

let transactionHistory: TransactionProps[] = [
  {
    amount: '1,750,000.00',
    last_updated: '13 April 2023',
    label: 'Foundation'
  },
  {
    amount: '1,850,000.00',
    last_updated: '13 April 2023',
    label: 'Ground Columns'
  },
  {
    amount: '1,650,000.00',
    last_updated: '13 April 2023',
    label: '1st floor plans, beautifully'
  },
  {
    amount: '1,700,000.00',
    last_updated: '13 April 2023',
    label: '2nd Floor Columns'
  },
  {
    amount: '1,950,000.00',
    last_updated: '13 April 2023',
    label: 'Lucrenzia Plumbing'
  }
];

export { bids, summaryCards, paymentSchedules, transactionHistory };
