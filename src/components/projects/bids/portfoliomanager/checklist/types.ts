export interface Checklist {
  _id: string;
  type: string;
  user: string;
  projectId: string;
  title: string;
  items: Items[];
  __v: number;
  bidId?: string;
}

export interface Items {
  name: string;
  status: boolean;
  _id: string;
}
