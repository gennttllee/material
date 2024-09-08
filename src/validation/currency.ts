import * as yup from 'yup';

export const currencySchema = yup
  .object({
    currency: yup
      .object({
        code: yup.string().required('provide the currency code'),
        label: yup.string().required('provide the currency label')
      })
      .required('Provide the project currency')
  })
  .required();
