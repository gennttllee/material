import * as yup from 'yup';

export const initialValues = {
  material: '',
  budget: '0',
  purchase: '0',
  inStock: '0',
  unit: ''
};

export const validationSchema = yup.object({
  material: yup.string().required(),
  budget: yup.string().required().not(['0'], 'Field cannot be zero'),
  quantity: yup.string().required().not(['0'], 'Field cannot be zero'),
  purchase: yup.string().required().not(['0'], 'Field cannot be zero'),
  inStock: yup.string().required().not(['0'], 'Field cannot be zero'),
  unit: yup.string().required(),
});
