import * as yup from 'yup';

const memberSchema = yup
  .object({
    email: yup.string().email('Provide a valid email').required('Provide your email')
  })
  .required();

const meetingSchema = yup.object({
  date: yup.string().required('Please add Date').min(4, 'please input a valid date'),
  title: yup
    .string()
    .required('Please input the title of the meeting')
    .min(4, 'Meeting must have a minimum of 4 characters'),
  time: yup.string().required('Please input the time for the meeting').min(1, 'Please pick a time'),
  description: yup
    .string()
    .required('Please add a description for the meeting')
    .min(4, 'Please input a minimum of 4 characters'),
  duration: yup
    .string()
    .required('Please include duration of the meeting')
    .min(2, 'Please pick a meeting duration'),
  location: yup
    .string()
    .required('Please include location of the meeting')
    .min(4, 'Please select a meeting duration'),
  projectId: yup.string().required(),
  guests: yup
    .array()
    .of(
      yup.object({
        userId: yup.string()
      })
    )
    .min(1),
  timezone: yup.string().notRequired()
});

export { meetingSchema, memberSchema };
