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
export type picItem = {
  type: string;
  url: string;
  name: string;
};
let pic: any = {
  'Thursday, 09 Apr, 2022': [
    {
      type: 'image',
      url: 'https://picsum.photos/200/300',
      name: 'IMG-20220719.jpg'
    },
    {
      type: 'image',
      url: 'https://picsum.photos/400/600',
      name: 'IMG-20220719.jpg'
    },
    {
      type: 'video',
      url: 'https://picsum.photos/250/350',
      name: 'IMG-20220719.mp4'
    },
    {
      type: 'image',
      url: 'https://picsum.photos/500/1000',
      name: 'IMG-20220719.jpg'
    },
    {
      type: 'image',
      url: 'https://picsum.photos/203/304',
      name: 'IMG-20220719.jpg'
    },
    {
      type: 'video',
      url: 'https://picsum.photos/203/302',
      name: 'IMG-20220719.mp4'
    }
  ],
  'Tuesday, 07 Apr, 2022': [
    {
      type: 'image',
      url: 'https://picsum.photos/204/304',
      name: 'IMG-20220719.jpg'
    },
    {
      type: 'video',
      url: 'https://picsum.photos/204/305',
      name: 'IMG-20220719.mp4'
    },
    {
      type: 'image',
      url: 'https://picsum.photos/205/306',
      name: 'IMG-20220719.jpeg'
    },
    {
      type: 'video',
      url: 'https://picsum.photos/204/307',
      name: 'IMG-20220719.mkv'
    }
  ]
};

let timeframe = ['All time', 'This Week', 'Last Week', 'Last month'];
let format = ['Photo & Video', 'Video', 'Photo'];

export { repo, drawings, pic, timeframe, format };
