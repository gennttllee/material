import * as yup from 'yup';

export const ProjectTitleSchema = yup.object({}).required();

const notRequiredString = yup.string().notRequired();
const requiredString = yup.string().required('Provide this field');

export const newProjectTitleSchema = yup.object({
  state: requiredString,
  city: requiredString,
  country: requiredString,
  ProjectType: requiredString,
  buildingType: requiredString,
  units: requiredString,
  numberOfBedrooms: notRequiredString,
  numberOfLivingRooms: notRequiredString,
  numberOfDiningRooms: notRequiredString,
  numberOfToilets: notRequiredString,
  numberOfKitchens: notRequiredString,
  numberOfStorage: notRequiredString
  // commercialSpaces: yup
  //   .array()
  //   .of(
  //     yup.object({
  //       name: yup.string().required('Please enter space name'),
  //       quantity: yup.number().required('Please enter quantity'),
  //       iconNumber: yup.number().notRequired()
  //     })
  //   )
  //   .notRequired()
});

const getProjectSchema = (type: string) => {
  const isCommercial = type !== 'residential';
  let residentialFields = {
    numberOfBedrooms: isCommercial
      ? notRequiredString
      : requiredString.not(['0'], ' Number of bedrooms cannot be zero'),
    numberOfLivingRooms: isCommercial ? notRequiredString : requiredString,
    numberOfDiningRooms: isCommercial ? notRequiredString : requiredString,
    numberOfToilets: isCommercial ? notRequiredString : requiredString,
    numberOfKitchens: isCommercial ? notRequiredString : requiredString,
    numberOfStorage: isCommercial ? notRequiredString : requiredString
  };
  let generalFields = {
    state: requiredString,
    city: requiredString,
    country: requiredString,
    ProjectType: requiredString,
    buildingType: requiredString,
    units: requiredString
  };
  if (!isCommercial) generalFields = { ...generalFields, ...residentialFields };
  return yup.object(generalFields);
};

export const facilitiesSchema = yup
  .object({
    numberOfBedrooms: requiredString,
    numberOfLivingRooms: requiredString,
    numberOfDiningRooms: requiredString,
    numberOfToilets: requiredString,
    numberOfKitchens: requiredString,
    numberOfStorage: requiredString
  })
  .required();
export {getProjectSchema}
// export const commercialFacilitiesSchema = yup
// .object({
//   numberOfBedrooms: yup.string().required('Provide this field'),
//   numberOfLivingRooms: yup.string().required('Provide this field'),
//   numberOfDiningRooms: yup.string().required('Provide this field'),
//   numberOfToilets: yup.string().required('Provide this field'),
//   numberOfKitchens: yup.string().required('Provide this field'),
//   numberOfStorage: yup.string().required('Provide this field')
// })
// .required();
