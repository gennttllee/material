const roleFunctions = {
  isCompany: (role: string) => ['developer', 'contractor', 'consultant'].includes(role),
  isProfessional: (s: string) => ['contractor', 'consultant'].includes(s),
  canHaveCompanyName: (s: string) => ['projectManager', 'developer'].includes(s)
};

const { isCompany, isProfessional, canHaveCompanyName } = roleFunctions;

export { isCompany, isProfessional, canHaveCompanyName };

export default roleFunctions;
