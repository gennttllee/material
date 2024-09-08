import { DocumentInput } from 'components/projects/management/POW/Components/NewPowBtn';
import InputField from 'components/shared/InputField';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { IoAttach } from 'react-icons/io5';
import * as yup from 'yup';

export type BidData = {
  name: string;
  description: string;
  files: File[];
};

interface Props {
  handleData: (x: BidData) => void;
}
const CreatePow = ({ handleData }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  let inputRef = useRef<any>();
  const {
    touched,
    errors,
    values,
    handleBlur,
    handleChange,
    setTouched,
    setFieldValue,
    setFieldTouched
  } = useFormik({
    initialValues: {
      name: '',
      description: ''
    },
    validationSchema: yup.object({
      name: yup.string().required('This field is required'),
      description: yup.string().required('This field is required')
    }),
    validateOnBlur: true,
    onSubmit: (data) => {

    }
  });

  useEffect(() => {
    handleData({ ...values, files });
  }, [values, files]);


  return (
    <div>
      <p className=" mt-4 text-bblack-1 font-medium">Add POW details </p>
      <div className=" flex  gap-x-4 ">
        <InputField
          error={(touched.name && errors.name) || ''}
          value={values.name}
          label="Name"
          onChange={handleChange}
          onBlur={handleBlur}
          name="name"
        />

        <InputField
          onChange={(e) => {
            setFiles(Object.values(e.target.files || {}));
          }}
          className=" !py-1 "
          label="Bid Document"
          IconProp={<IoAttach size={24} />}
          multiple
          error={files.length < 1 ? 'Please select a file' : ''}
          type="file"
        />
      </div>

      <InputField
        error={(touched.description && errors.description) || ''}
        value={values.description}
        label="Description"
        isTextArea
        onChange={handleChange}
        onBlur={handleBlur}
        name="description"
      />
    </div>
  );
};

export default CreatePow;
