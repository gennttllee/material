import { UserRoles } from 'Hooks/useRole';

export type CommercialSpace = {
  name: string;
  value: number;
};
export interface CommercialBrief {
  commercialType: string;
  commercialSpaces: CommercialSpace[];
}

export interface Brief<T = Bid<ProjectID>[] | undefined>
  extends BriefTitle,
    BriefFacilities,
    CommercialBrief {
  documents: Documents;
  land: Land;
  _id: string;
  user: string;
  otherSpaces: string[];
  bids: Bid<string>[];

  __v: number;
  team: Team[];
  literalBids: T;
  createdAt: Date;
  scheduledCall?: CallType;
  status: StatusEnum;
  currency?: {
    code: string;
    label: string;
  };
  defaultUnitOfMeasurement: string;
  clusterId?: string;
}

export enum StatusEnum {
  notStarted = 'Not started',
  ongoing = 'In progress',
  completed = 'Completed'
}

export type CallType = {
  email: string;
  firstName: string;
  joiningInfo: {
    eventUri: string;
    eventUrl: string;
  };

  lastName: string;
  startTime: string;
};

export type BriefTitle = {
  projectLocation: ProjectLocation;
  pseudoProjectName: string;
  projectType: string;
  numberOfUnits: number;
  residentialType: string;
};

export type BriefFacilities = {
  numberOfBedrooms: number;
  numberOfBaths: number;
  numberOfLivingRooms: number;
  numberOfDiningRooms: number;
  numberOfToilets: number;
  numberOfKitchens: number;
  numberOfStorage: number;
};

export interface ProjectID extends BriefTitle, BriefFacilities, CommercialBrief {
  documents: Documents;
  land: Land;
  _id: string;
  user: string;
  otherSpaces: string[];
  bids: string[];
  defaultUnitOfMeasurement: string;
  team: Team[];
  createdAt: Date;
  __v: number;
}

export type BriefByRole = {
  Professional: Bid<ProjectID>[];
  OtherUsers: undefined;
};

export type ProfessionalBrief = Brief<BriefByRole['Professional']>;
export type ProfessionalBids = ProfessionalBrief['literalBids'];
export type ProfessionalBid = ProfessionalBrief['literalBids'][number];
export type Submissions = SubmittedBid<string>[];

export interface Bid<T = ProjectID | string> {
  schedule?: Schedule;
  _id: string;
  name: string;
  bidDocuments: BidDocument[];
  type: string;
  pow: string | null | undefined;
  projectId: T;
  description: string;
  invites: Invite[];
  winningBid: WinningBid[];
  submittedBid: SubmittedBid<string> | null | undefined;
  __v: number;
}

export type SubmissionDoc<T> = {
  name: string;
  key: string;
  parentDoc: string;
  _id: T;
  meta: DocumentMeta;
};

export type SubmittedBid<T = string | undefined> = {
  docs: SubmissionDoc<T>[];
  bid: string;
  bidder: T;
  _id: T;
  __v: T;
};

export interface BidDocument {
  name: string;
  key?: string;
  isAvailable?: boolean;
  requiresResponse: boolean;
  meta?: DocumentMeta;
  _id: string;
}

export interface DocumentMeta {
  size: number;
  type: string;
  name: string;
  isAdditional?: boolean;
}

export interface Invite {
  bidder: string;
  rsvpStatus: RsvpStatus;
  _id: string;
}

export enum RsvpStatus {
  Accepted = 'accepted',
  Declined = 'declined',
  Unanswered = 'unanswered'
}

export interface Schedule {
  start: Date;
  end: Date;
  duration: number;
}

export interface WinningBid {
  id: string;
  status: RsvpStatus;
  _id: string;
}

export interface Documents {
  areThereAnyStructuralDocs: boolean;
  areThereAnyMechAndElcDocs: boolean;
  areThereAnyArchitectureDocs: boolean;
}

export interface Land {
  isLandAcquired: string;
  location: string;
}

export interface ProjectLocation {
  state: string;
  country: string;
  city: string;
}

export interface Team {
  id: string;
  _id: string;
  name: string;
  role: UserRoles;
}

export interface User {
  businessInformation: BusinessInformation;
  isVerified: IsVerified;
  _id: string;
  email: string;
  name: string;
  password: string;
  companyName?: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  disabled: boolean;
  country?: string;
  state?: string;
  city?: string;
  type: string;
  logo?: string;
  unitOfMeasurement?: string;
  inactiveDays?: { _id: string; day: string }[];
  plantsAndEquipments: string[];
  portFolioProjects: string[];
  teamMembers: string[];
  role: UserRoles;
  __v: number;
}

export interface BusinessInformation {
  locations: string[];
  rcNo: string;
  address: string;
  contactPersonName: string;
  email: string;
  about: string;
  phoneNumber: string;
  businessPhoneNumber: string;
  boardMembers: BoardMember[];
  constructionMethodology: string;
  letterFromBankers: string;
  taxClearance: string;
  logo: string;
}

export interface BoardMember {
  firstName: string;
  lastName: string;
  designation: string;
  _id: string;
}

export interface IsVerified {
  account: boolean;
  email: boolean;
}

export interface Facilities {
  name: string;
  number: number;
}

export interface prototypeImage {
  key: string;
  meta: object;
}

export interface Prototype {
  _id: string;
  projectName: string;
  projectType: string;
  overview: string;
  units: number;
  numberOfRooms: number;
  description: string;
  numberOfBedRooms: number;
  numberOfLivingRooms: number;
  numberOfDiningRooms: number;
  numberOfToilets: number;
  numberOfKitchens: number;
  numberOfStorage: number;
  unitOfMeasurement: 'Metric' | 'Imperial';
  floorArea: number;
  otherSpaces: Facilities[];
  prototypeImages: prototypeImage[];
  owner: string;
}

export interface Role {
  _id: string;
  name: string;
  denyingPolicies: string[];
  allowingPolicies: string[];
}

export interface Persona {
  isVerified: {
    account: boolean;
    email: boolean;
  };
  _id: string;
  email: string;
  lastName: string;
  firstName: string;
  country: string;
  state: string;
  city: string;
  role: string;
  logo?: string;
  rolename: string;
  createdAt: string;
  disabled: boolean;
  suspended: boolean;
  companyName: string;
  phoneNumber: string;
  name: string;
  status: 'active' | 'inactive';
}

export interface ClusterType {
  _id: string;
  user: string;
  clusterName: string;
  totalUnits: number;
  team: Team[];
  projects: string[];
  status: string;
  types: ClusterTypes[];
  createdAt: string;
  __v: number;
}

// export interface Team {
//   id: string;
//   role: UserRoles;
//   _id: string;
// }

export interface ClusterTypes {
  name: string;
  numberOfUnits: number;
  status: string;
  _id: string;
}
