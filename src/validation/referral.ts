import * as yup from 'yup';

export const redeemCashSchema = yup
  .object({
    amount: yup.string().required('Provide the amount'),
    currency: yup.string().notRequired()
  })
  .required();
