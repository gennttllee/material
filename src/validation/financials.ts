import * as yup from 'yup';

export const expenditureSchema = (shouldHaveTitle?: boolean) =>
  yup
    .object({
      taskId: yup.string().required('Select a task'),
      amount: yup.number().required('Provide the amount'),
      description: yup.string().required('Provide a description'),
      title: shouldHaveTitle ? yup.string().required('Provide the title') : yup.string()
    })
    .required();
