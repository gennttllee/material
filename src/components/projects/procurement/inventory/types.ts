type ActivityType = 'Return' | 'Disburse';

type Inventory = {
  date: string;
  material: string;
  quantity: number;
  unit: string;
  workArea: string;
  location: string;
  notes?: string;
  receivedBy: string;
  _id: string;
  disbursedBy: string;
  activityType: ActivityType;
};

export { type Inventory, type ActivityType };
