import React, { useContext, useState } from 'react'
import { useFormik } from 'formik';
import { MaterialScheduleRecord } from '../types';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import Button from 'components/shared/Button';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import * as yup from 'yup';
import { useAppDispatch } from 'store/hooks';
import { addRecord, updateRecord } from 'store/slices/materialScheduleSlice';
import { displayError, displaySuccess } from 'Utils';

interface CreateMaterialModalProps {
  onAdd?: () => void;
  closer: () => void;
  isEditing?: boolean;
  value?: MaterialScheduleRecord;
}

const initialValue = {
name: "",
description: "",
}
const CreateMaterialModal = ({ onAdd, closer, isEditing, value }: CreateMaterialModalProps) => {
  const [loading, setLoading] = useState(false); 
  const { selectedData } = useContext(StoreContext);
  const dispatch = useAppDispatch();
  

  let { errors, values, handleChange, handleSubmit, touched, resetForm } = useFormik(
    {
      initialValues: value || initialValue,
      onSubmit: (data) => {
        let _data: MaterialScheduleRecord & { _id?: string } = {
          ...data
        } as MaterialScheduleRecord;
        if (!_data?._id) {
          _data._id = Math.random().toString();
        }
        if (isEditing) {
          _edit(_data);
        } else _submit(_data);
      },
      validationSchema: yup.object({
        name: yup.string().required('Please enter name of Material Schedule'),
        description: yup.string().required('Please enter description'),
       }),
      validateOnBlur: true
    }
  );

  const _submit = async (data: Omit<MaterialScheduleRecord, '_id'> & { _id?: string }) => {
    setLoading(true);
    let _id = data._id;
    if (!isEditing) {
      delete data?._id;
    }

    const payload = {
      name: data.name,
      project: selectedData?._id,
      description: data.description,
    };

    const { e, response } = await postForm('post', `procurements/material-schedule/add`, payload);
    if (response) {
      displaySuccess('Material added successfully');
      dispatch(addRecord(response.data.data[0]));
      resetForm();
      // onAdd();
      closer();
    } else {
      console.log(e.message);
      displayError(e?.message || '');
    }

    setLoading(false);
  };

  const _edit = async (
    data: Omit<MaterialScheduleRecord, '_id'> & { _id?: string;}
  ) => {
    setLoading(true);
    let _data: any = { ...data };

    for (let x of ['_id', 'project', '__v', 'createdBy', 'createdAt']) {
      delete _data[x];
    }

    const payload = {
      scheduleId: value?._id, // Use the appropriate ID for the schedule
      name: data.name,
      description: data.description,
      
    };

    const { e, response } = await postForm('patch', `procurements/material-schedule/update`, payload);
    if (response) {
      displaySuccess('Material updated successfully');
      dispatch(updateRecord(response.data.data));
      resetForm();
      closer();
    } else displayError(e?.message || '');

    setLoading(false);
  };



  return (
    <SuperModal
    classes=" bg-black bg-opacity-60 flex flex-col items-center overflow-y-auto"
    closer={closer}>
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className=" bg-white rounded-md p-6 mt-20 mb-10 w-1/2 max-w-[500px] ">
      <div className="flex items-center justify-between mb-8">
        <p className=" text-xl font-medium">{isEditing ? 'Edit Material' : 'Add Material Schedule'}</p>

        <span className=" cursor-pointer text-sm text-bash" onClick={closer}>
          Close
        </span>
      </div>

      <InputField
        error={(touched?.name && errors?.name) || ''}
        name="name"
        value={values.name}
        onChange={handleChange}
        label="Name"
        placeholder="Material Schedule 1"
        className=" !text-bblack-1"
      />

<InputField
        isTextArea
        error={(touched.description && errors.description) || ''}
        name="description"
        value={values.description}
        onChange={handleChange}
        label="Description"
        placeholder="e.g Comments"
        className=" !text-bblack-1 "
      />

      

      

      <div className=" flex justify-end gap-x-4">
        <Button onClick={closer} type="secondary" text="Cancel" />
        <Button
          isLoading={loading}
          onClick={() => {
            handleSubmit();
          }}
          text={isEditing ? 'Save Changes' : 'Add Material Schedule'}
        />
      </div>
    </div>
  </SuperModal>
  )
}

export default CreateMaterialModal;