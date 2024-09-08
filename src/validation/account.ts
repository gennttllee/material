import * as yup from 'yup';

export const resetPasswordSchema = yup
  .object({
    confirmPassword: yup.string().required('Provide this field'),
    currentPassword: yup.string().required('Provide this field'),
    newPassword: yup.string().required('Provide this field')
  })
  .required();

export const preferencesSchema = (isContractor: boolean) =>
  yup
    .object(
      isContractor
        ? {
            unitOfMeasurement: yup.string().required('Provide this field'),
            weekDaysOff: yup.array()
          }
        : {
            unitOfMeasurement: yup.string().required('Provide this field')
          }
    )
    .required();

export const personalInfoSchema = ({
  requireCity = true,
  requireState = true
}: {
  requireState: boolean;
  requireCity: boolean;
}) =>
  yup
    .object({
      state: requireState ? yup.string().required('Provide the state') : yup.string(),
      city: requireCity ? yup.string().required('Provide the city') : yup.string(),
      phoneNumber: yup.string().required('Provide this field'),
      firstName: yup.string().required('Provide this field'),
      lastName: yup.string().required('Provide this field'),
      country: yup.string().required('Provide this field'),
      companyName: yup.string(),
      photo: yup.string()
    })
    .required();
