 type MaterialScheduleRecord = {
  _id: string;
  project: string;
  name: string;
  materials: MaterialRecord[];
  description: string;
};

type MaterialRecord = {
material: string;
quantity: number;
  _id: string;
  category: string;
  unit: string;
  rate: number;
  amount: number;
  notes?: string;
  purchaseDate: string;
};


export { type MaterialScheduleRecord, type MaterialRecord}