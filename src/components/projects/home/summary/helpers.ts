type DisbursementType = {
  amount: number;
  dueDate: string;
  isConfirmed: boolean;
};

export type FinancesType = {};

const getUpcoming = (disbursements: DisbursementType[]) => {
  let upcoming: any[] | undefined = [
    ...(disbursements?.filter((m) => {
      let today = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
      let nextDate = Math.floor(new Date(m.dueDate).getTime() / (1000 * 60 * 60 * 24));
      return today <= nextDate;
    }) as [])
  ].sort((a: any, b: any) => (a.dueDate > b.dueDate ? 1 : b.dueDate > a.dueDate ? -1 : 0));
  if (upcoming && upcoming.length > 0) {
    return upcoming[0];
  } else if (disbursements) {
    return disbursements[disbursements.length - 1];
  } else {
    return undefined;
  }
};

const getStrictlyUpcoming = (disbursements: DisbursementType[]) => {
  let upcoming: any[] | undefined = [
    ...(disbursements?.filter((m) => {
      let today = Math.floor(new Date().getTime() / (1000 * 60 * 60 * 24));
      let nextDate = Math.floor(new Date(m.dueDate).getTime() / (1000 * 60 * 60 * 24));
      return today <= nextDate;
    }) as [])
  ].sort((a: any, b: any) => (a.dueDate > b.dueDate ? 1 : b.dueDate > a.dueDate ? -1 : 0));
  if (upcoming && upcoming.length > 0) {
    return upcoming[0];
  } else {
    return undefined;
  }
};

export { getUpcoming, getStrictlyUpcoming };
