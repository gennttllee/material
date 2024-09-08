import { TbEye, TbFolderSymlink, TbDownload, TbEdit, TbChevronRight } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
type Repo = {
  name: string;
  isNew: boolean;
};

type Drawings = {
  name: string;
};

let repo: Repo[] = [
  { name: 'Preview', isNew: false },
  { name: 'Drawings', isNew: true },
  { name: 'Bond', isNew: false },
  { name: 'Contracts', isNew: false },
  { name: 'Engagement Letter', isNew: false },
  { name: 'Completion Certificate', isNew: true },
  { name: 'payment Certificate', isNew: false }
];

let drawings: Drawings[] = [
  { name: 'Lorem ipsum dolor' },
  { name: 'Lorem ipsum dolor' },
  { name: 'Lorem ipsum dolor' },
  { name: 'Lorem ipsum dolor' },
  { name: 'Lorem ipsum dolor' },
  { name: 'Lorem ipsum dolor' },
  { name: 'Lorem ipsum dolor' }
];

const cardOptions = [
  {
    name: 'Preview',
    icon: TbEye
  },
  {
    name: 'Move to folder',
    icon: TbFolderSymlink,
    iconRight: TbChevronRight
  },
  {
    name: 'Manage Access',
    icon: TbFolderSymlink,
    iconRight: TbChevronRight
  },
  {
    name: 'Download',
    icon: TbDownload
  },
  {
    name: 'Rename',
    icon: TbEdit
  },
  {
    name: 'Delete',
    icon: RiDeleteBin6Line
  }
];

const generalCardOptions = [
  {
    name: 'Preview',
    icon: TbEye
  },
  {
    name: 'Download',
    icon: TbDownload
  }
] as typeof cardOptions;

export { repo, drawings, cardOptions, generalCardOptions };
