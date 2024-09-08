export const isRoleProfessional = (role: string) => {
  return role === 'consultant' || role === 'contractor' ? true : false;
};

export const formatNumberWithCommas = (value?: number | string) => {
  if (!value) return undefined;
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Remove commas and parse the value to a number for form submission
export const parseNumberWithoutCommas = (value: string) => {
  return value.replace(/,/g, '');
};

export const removeDuplicates = (stringsArray: string[]) => {
  // Create a Set from the array to remove duplicates
  const uniqueSet = new Set(stringsArray);

  // Convert the Set back to an array
  const uniqueArray = Array.from(uniqueSet);

  return uniqueArray.map((one) => ({ value: one }));
};
