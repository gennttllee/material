let userRoles: { name: string; role: string; email: string }[] = [
  { name: 'John Cena', role: 'contractor', email: 'olola@mailinator.com' },
  { name: 'Tom Cruise', role: 'contractor', email: 'olola@mailinator.com' },
  { name: 'John Doe', role: 'consultant', email: 'olola@mailinator.com' },
  { name: 'Steph Curry', role: 'contractor', email: 'olola@mailinator.com' },
  { name: 'John Cena', role: 'contractor', email: 'olola@mailinator.com' }
];
type stringArr = string[];
let roles: stringArr = ['Admin', 'Project owner', 'Project manager', 'Board members'];
let names: stringArr = ['John Doe', 'Janet Doe'];
let names2 = Array(8).fill(names).flat();

let permissions = [
  { permission: 'Can edit a bid', allowed: true },
  { permission: 'Can start the bid process', allowed: true },
  { permission: 'Can view professionals profile', allowed: true },
  { permission: 'Can Select a bid winner', allowed: true },
  { permission: 'Can modify a bid date', allowed: false },
  { permission: "Can't invite professionals to bid", allowed: false }
];
let actions = [
  { permission: 'Edit a bid', allowed: true },
  { permission: 'Start the bid process', allowed: true },
  { permission: 'View professionals profile', allowed: true },
  { permission: 'Select a bid winner', allowed: true },
  { permission: 'Modify a bid date', allowed: false }
  //   { permission: "Can't invite professionals to bid", allowed: false },
];
export { userRoles, roles, names2, permissions, actions };
