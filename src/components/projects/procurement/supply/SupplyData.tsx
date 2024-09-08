
import { format } from 'date-fns';
import { Record } from 'components/projects/procurement/supply/types';

const generateDummyData = (numEntries: number): Record[] => {
  const data2: Record[] = [];
  const materials = ['Cement', 'Bricks', 'Steel', 'Timber', 'Sand'];
  const units = ['Bags', 'Pieces', 'Tonnes', 'Cubic Meters'];
  const vendors = ['CostCo', 'HomeDepot', "Lowe's", 'Ace Hardware'];
  const categories = ['Struts', 'Pillars', 'Beams', 'Slabs'];
  const acknowledgedBy = ['Project Manager', 'Site Supervisor', 'Foreman'];

  for (let i = 1; i <= numEntries; i++) {
    data2.push({
      _id: i.toString(),
      date: format(new Date(), 'yyyy-MM-dd'),
      material: materials[Math.floor(Math.random() * materials.length)],
      quantity: Math.floor(Math.random() * 1000) + 1,
      unit: units[Math.floor(Math.random() * units.length)],
      rate: Math.floor(Math.random() * 100) + 1,
      amount: Math.floor(Math.random() * 10000) + 1,
      description: `Description for item ${i}`,
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      notes: `Notes for item ${i}`,
      acknowledgedBy: acknowledgedBy[Math.floor(Math.random() * acknowledgedBy.length)],
      s_n: i.toString()
    });
  }

  return data2;
};

export default generateDummyData;
