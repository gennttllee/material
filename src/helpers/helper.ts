export const isArrayNullOrEmpty = <T>(obj: T[]): boolean => {
  if (obj === undefined || obj === null || obj.length === 0) {
    return true;
  }

  return false;
};
