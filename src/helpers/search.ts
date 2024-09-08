// Define the type for the object
type NestedValue = string | number | NestedObject | NestedObject[];

type NestedObject = {
  [key: string | number]: NestedValue;
};

// Function to search for a query in an array of objects
const searchArrayOfObjects = <T = NestedValue[]>(array: T[], query: string): T[] => {
  /** return the whole thing if the query is empty */
  if (!query) return array;
  const responses = [];
  for (const obj of array as NestedObject[]) {
    const hasAMatch = searchObjectValues(obj, query);
    if (hasAMatch) {
      responses.push(obj);
    }
  }
  return responses as typeof array;
};

// Function to search for a query in object attribute values
const searchObjectValues = (obj: NestedObject, query: string) => {
  // Iterate through each attribute  in the object
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];

      if (Array.isArray(value)) {
        // If the value is an array, recursively search the array
        searchArrayOfObjects(value, query);
      } else if (
        typeof value === 'string' &&
        value.toLocaleLowerCase().includes(query.toLowerCase())
      ) {
        // Check if the attribute value is a string and contains the query
        return true;
      } else if (typeof value === 'object' && value !== null) {
        // Check if the attribute value is an object and recursively search
        searchObjectValues(value as NestedObject, query); // Recursively search nested object
      }
    }
  }
};

export { searchArrayOfObjects, searchObjectValues };
