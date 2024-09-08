import { DashboardResponse } from './types';

const dashboardData: DashboardResponse[] = [
  {
    _id: '1a2b3c4d',
    material: 'Steel Rods',
    budget: 100,
    purchase: 100,
    inStock: 0,
    unit: 'kg'
  },
  {
    _id: '2b3c4d5e',
    material: 'Cement Bags',
    budget: 50,
    purchase: 50,
    inStock: 0,
    unit: 'bags'
  },
  {
    _id: '3c4d5e6f',
    material: 'Bricks',
    budget: 500,
    purchase: 500,
    inStock: 0,
    unit: 'pieces'
  },
  {
    _id: '4d5e6f7g',
    material: 'Pipes',
    budget: 200,
    purchase: 200,
    inStock: 0,
    unit: 'meters'
  },
  {
    _id: '5e6f7g8h',
    material: 'Electrical Wires',
    budget: 300,
    purchase: 300,
    inStock: 0,
    unit: 'meters'
  },
  {
    _id: '6f7g8h9i',
    material: 'Tiles',
    budget: 1000,
    purchase: 1000,
    inStock: 0,
    unit: 'pieces'
  },
  {
    _id: '7g8h9i0j',
    material: 'Glass Panels',
    budget: 50,
    purchase: 50,
    inStock: 0,
    unit: 'sheets'
  },
  {
    _id: '8h9i0j1k',
    material: 'Paint',
    budget: 200,
    purchase: 200,
    inStock: 0,
    unit: 'liters'
  },
  {
    _id: '9i0j1k2l',
    material: 'Sand',
    budget: 500,
    purchase: 500,
    inStock: 0,
    unit: 'kg'
  },
  {
    _id: '9i0j1k2l1',
    material: 'Sand',
    budget: 500,
    purchase: 500,
    inStock: 0,
    unit: 'kg'
  },
  {
    _id: '0j1k2l3m',
    material: 'Wood Planks',
    budget: 150,
    purchase: 150,
    inStock: 0,
    unit: 'pieces'
  }
];

const columns = [
  { name: 'S/N' },
  { name: 'Material' },
  { name: 'Budget' },
  { name: 'Purchase' },
  { name: 'In Stock' }
];

export { dashboardData, columns };
