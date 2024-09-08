export interface FileFolder {
  name: string;
  alias: string;
  project: string;
  access: Access[];
  createdBy: string;
  _id: string;
  files: any[];
  timestamp: string;
  __v: number;
  parentFolder?: string;
}

export interface Access {
  userId: string;
  role: string;
  accessType: string;
  _id: string;
  timestamp: string;
}
