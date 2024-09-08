import * as yup from 'yup';

export const subTaskSchema = yup
  .object({
    budget: yup.string(),
    startDate: yup.date(),
    dependencies: yup.array(),
    plannedStartDate: yup.date(),
    name: yup.string().required("Provide the task's name"),
    duration: yup.string().required("Provide the task's duration in days")
  })
  .required();

export const reasonSchema = yup
  .object({
    reason: yup.string().required('Provide the reason for decline')
  })
  .required();

export const messageSchema = (isRequired: boolean) =>
  yup
    .object({
      message: isRequired ? yup.string().required('Provide the reason for decline') : yup.string()
    })
    .required();

export const taskSchema = yup
  .object({
    name: yup.string().required("Provide the task's name"),
    dependencies: yup.array()
  })
  .required();

export const powSchema = yup
  .object({
    bidId: yup.string().required('Provide this field'),
    name: yup.string().required("Provide the pow's name")
  })
  .required();

export const expressPOW = yup.object({
  name: yup.string().required('this field is required'),
  type: yup.string().required('this field is required'),
  description: yup.string().required('this field is required'),
  professional: yup.string().required('this field is required'),
  docs: yup.array().min(1, 'You must attach at least a file')
});

export const editPowSchema = yup
  .object({
    name: yup.string().required('Provide this field')
  })
  .required();
