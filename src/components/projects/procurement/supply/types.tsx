type Record = {
  s_n: any;
  date: string;
  material: string;
  quantity: number;
  unit: string;
  rate?: number;
  amount?: number;
  description?: string;
  _id: string;
  vendor?: any;
  category?: string;
  notes?: string;
  acknowledgedBy: string;
  orderNumber?: string;
};

export { type Record };
