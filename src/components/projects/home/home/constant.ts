import bedroom from 'assets/bedroom.svg';
import diningroom from 'assets/diningroom.svg';
import livingroom from 'assets/livingroom.svg';
import toilet from 'assets/toilet.svg';
import kitchen from 'assets/kitchen.svg';

let titlecomponents = [
  { label: 'Location', value: 'Lagos' },
  { label: 'Project Type', value: 'Residential' },
  { label: 'Building Type', value: 'Bungalow' },
  { label: 'Number of Units', value: '1' }
];

let facilities = [
  { icon: bedroom, label: 'Bedrooms', value: 4 },
  { icon: livingroom, label: 'Living Room', value: 2 },
  { icon: diningroom, label: 'Dining Room', value: 2 },
  { icon: toilet, label: 'Toilet / Bathroom', value: 2 },
  { icon: kitchen, label: 'Kitchen', value: 2 },
  { icon: bedroom, label: 'Store', value: 2 },
  { icon: bedroom, label: 'Study', value: 2 },
  { icon: bedroom, label: 'Garage', value: 2 }
];

let drawings = [
  'Architectural drawings',
  'Structural drawings',
  'Mechanical drawings',
  'Electrical drawings'
];

export { titlecomponents, facilities, drawings };
