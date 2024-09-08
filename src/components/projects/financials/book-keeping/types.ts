type Record = {
  date: string;
  item: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  description: string;
  _id:string;
  vendor?:string;
  category?:string
};

export { type Record };
