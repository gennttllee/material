import { TReferral } from 'pages/projects/referral/types';
import { toast } from 'react-toastify';

export const dateHelper = (date: Date, opt: Intl.DateTimeFormatOptions) => {
  /**
   * @params
   *  Todo # Provide
   *  1. a date instance
   *  2. Options
   *
   * @returns {string}
   */
  return date.toLocaleDateString('default', opt);
};

export const generateId = () => {
  /**
   * @return {string}
   * used as an id
   * e.g 4yg020wn
   * * Of length 10
   */
  const len = 10;
  return Math.random()
    .toString(36)
    .substring(2, len + 2);
};

export const displaySuccess = (message: string) => {
  toast(message, {
    position: 'top-center',
    bodyClassName: '  !text-black',
    className: ' !bg-bgreen-1   !border !border-bgreen-3 !rounded-md',
    autoClose: 1500
  });
};

export const displayError = (message: string) => {
  toast(message, {
    position: 'top-center',
    bodyClassName: ' !text-black ',
    className: '  !bg-redShades-1 !border !border-bred !rounded-md',
    autoClose: 3000
  });
};

export const displayWarning = (message: string) => {
  toast(message, {
    position: 'top-center',
    bodyClassName: '!text-black',
    className: '  !bg-orange-200 !border !border-borange !rounded-md',
    autoClose: 3000
  });
};

export const displayInfo = (message: string) => {
  toast(message, {
    position: 'top-center',
    bodyClassName: ' !text-black',
    className: '  !bg-lightblue !border !border-bblue !rounded-md',
    autoClose: 3000
  });
};

export const isReferralConverted = (ref: TReferral) => {
  let convertedStatus = ['Project created', 'Project in-progress'];
  let res = convertedStatus.includes(ref.status);
  return res;
};

export const cleanError = (
  e: Error | any,
  alternateText = 'Something went wrong. Please try  again later'
) => {
  return (e?.response?.data?.message as string) || alternateText;
};

export const formatCurrency = (amount: number = 0, currency: string = 'USD') => {
  let Format = new Intl.NumberFormat('en-US', {
    currency,
    style: 'currency'
  });

  return Format.format(amount);
};

export const convertToNumber = (val: string = '0') => {
  let _val = val;
  _val = _val.replaceAll(',', '');
  let num = parseFloat(_val);
  return num;
};

export const formatWithComma = (val: number) => {
  return new Intl.NumberFormat('en-US').format(val);
};

export const getDayStart = (date: Date = new Date()) => {
  return new Date(new Date(date).setHours(0, 0, 0, 0));
};
export const getdayEnd = (date: Date = new Date()) => {
  return new Date(new Date(date).setHours(23, 59, 59, 999));
};
