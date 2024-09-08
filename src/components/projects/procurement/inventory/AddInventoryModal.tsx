import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Inventory, ActivityType } from './types';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import Button from 'components/shared/Button';
import SelectDate from 'components/shared/SelectDate';
import { useFormik } from 'formik';
import { useAppDispatch } from 'store/hooks';
import { addRecord, updateRecord } from 'store/slices/inventorySlice';
import * as yup from 'yup';
import { convertToNumber, formatWithComma } from 'Utils';
import { TbMinus, TbPlus } from 'react-icons/tb';

interface Props {
  closer: () => void;
  isEditing?: boolean;
  value?: Inventory;
  activity: ActivityType;
  setShowActivitySelector: React.Dispatch<React.SetStateAction<boolean>>;
}

const initialValue = {
  date: new Date(),
  material: '',
  quantity: '0',
  unit: '',
  workArea: '',
  disbursedBy: '',
  location: '',
  notes: '',
  receivedBy: ''
};

const convertInventory = (val: Inventory) => {
  let newVal: { [key: string]: any } = { ...val };
  newVal.quantity = val.quantity.toString();

  return newVal as Inventory;
};

const AddInventoryModal = ({
  closer,
  isEditing,
  value,
  activity,
  setShowActivitySelector
}: Props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  let { errors, values, setFieldValue, handleChange, handleSubmit, touched, resetForm } = useFormik(
    {
      initialValues: value ? convertInventory(value) : initialValue,
      onSubmit: (data) => {
        let _data: Inventory & { _id?: string } = { ...data } as Inventory;
        if (!_data?._id) {
          _data._id = Math.random().toString();
        }
        _data.quantity = convertToNumber(data.quantity as unknown as string);
        _data.activityType = activity;
        if (isEditing) {
          dispatch(updateRecord(_data));
          resetForm();
          closer();
        } else {
          console.log(_data);
          dispatch(addRecord(_data));
          resetForm();
          closer();
        }
      },
      validationSchema: yup.object({
        date: yup.string().required(),
        material: yup.string().required(),
        quantity: yup.string().required().not(['0'], 'Field cannot be zero'),
        unit: yup.string().required(),
        workArea: yup.string().required(),
        disbursedBy: yup.string().required(),
        location: yup.string().required(),
        notes: yup.string(),
        receivedBy: yup.string().required()
      }),
      validateOnBlur: true
    }
  );

  const _handleNumberChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val === '') {
      setFieldValue(field, '0');
      return;
    }
    let notString = /[^0-9.,]/i.test(val);
    if (notString) {
      return;
    }
    if (val[val.length - 1] === '.' && val[val.length - 2] !== '.') {
      setFieldValue(field, val);
      return;
    }
    if (val.endsWith('0') && /\.[\d]{1,}/i.test(val)) {
      setFieldValue(field, val);
      return;
    }

    let num = convertToNumber(val);
    if (!isNaN(num)) {
      let formatedValue = new Intl.NumberFormat('en-US').format(num);
      setFieldValue(field, formatedValue);
    }
  };

  const date = useMemo(() => {
    return new Date(values.date);
  }, [values.date]);

  return (
    <SuperModal
      classes=" bg-black bg-opacity-60 flex flex-col items-center overflow-y-auto"
      closer={closer}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" bg-white rounded-md p-6 mt-20 w-1/2 max-w-[500px] ">
        <div className="flex items-center justify-between">
          <p className=" text-xl font-medium">
            {isEditing
              ? 'Edit Inventory'
              : activity === 'Disburse'
                ? 'Disburse from Inventory'
                : 'Return to Inventory'}
          </p>

          <span className=" cursor-pointer text-sm text-bash" onClick={closer}>
            Close
          </span>
        </div>

        <InputField
          error={(touched?.material && errors?.material) || ''}
          name="material"
          value={values.material}
          onChange={handleChange}
          label="Material"
          placeholder="e.g Cement"
          className=" !text-bblack-1 "
        />
        <InputField
          error={(touched?.receivedBy && errors?.receivedBy) || ''}
          name="receivedBy"
          value={values.receivedBy}
          onChange={handleChange}
          label="Received By"
          placeholder="Receiver's name"
          className=" !text-bblack-1 "
        />
        <div className="flex gap-x-4 items-center">
          <div>
            <p className=" text-bash">Quantity</p>
            <div className="flex rounded-md border px-2 py-1 items-center gap-x-2 border-ashShade-4 mt-1">
              <span
                onClick={(e) => {
                  let val = convertToNumber(values.quantity as string);
                  if (val > 0) {
                    setFieldValue('quantity', formatWithComma(val - 1));
                  }
                }}
                className="  p-2 hover:bg-ashShade-0 rounded-full ">
                <TbMinus />
              </span>

              <input
                className=" outline-none w-1/2 text-bblack-1 "
                name="quantity"
                value={values.quantity}
                onChange={_handleNumberChange('quantity')}
                type="text"
                placeholder="quantity"
              />
              <span
                onClick={(e) => {
                  let val = convertToNumber(values.quantity as string);
                  setFieldValue('quantity', formatWithComma(val + 1));
                }}
                className=" p-2 hover:bg-ashShade-0 rounded-full ">
                <TbPlus />
              </span>
            </div>
          </div>

          <InputField
            error={(touched.unit && errors.unit) || ''}
            name="unit"
            value={values.unit}
            onChange={handleChange}
            label="Unit"
            placeholder="e.g Sacks"
            className=" !flex-1 !text-bblack-1"
          />
        </div>

        <div className=" flex items-center gap-x-4">
          <InputField
            error={(touched.workArea && errors.workArea) || ''}
            name="workArea"
            value={values.workArea}
            onChange={handleChange}
            type="text"
            label="Work area"
            placeholder="e.g Foundation"
            className=" !text-bblack-1 "
          />
          <InputField
            error={(touched?.disbursedBy && errors.disbursedBy) || ''}
            name="disbursedBy"
            value={values.disbursedBy}
            onChange={handleChange}
            type="text"
            label="Disbursed By"
            placeholder="e.g John"
            className=" !text-bblack-1 "
          />
        </div>

        <InputField
          error={(touched.location && errors.location) || ''}
          name="location"
          value={values.location}
          onChange={handleChange}
          type="text"
          label="Location"
          placeholder="e.g Setraco"
          className=" !text-bblack-1 "
        />

        <SelectDate
          className=" mt-8 text-bash"
          error={((touched.date && errors?.date) || '') as string}
          placeholder="Select date"
          wrapperClassName=" !border-ashShade-4"
          minDate={new Date(0)}
          initialValue={value?.date ? new Date(value.date) : new Date()}
          value={date}
          label="Date Received"
          onChange={(e) => {
            if (e) {
              setFieldValue('date', e.toISOString());
            }
          }}
        />

        <InputField
          isTextArea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          label="Notes (Optional)"
          placeholder="Enter a description..."
          className=" !text-bash "
        />

        <div className=" flex justify-end gap-x-4">
          <Button
            onClick={() => {
              closer();
              setShowActivitySelector(false);
            }}
            text="Cancel"
            type="secondary"
            className="border border-ashShade-4 text-bblack-1"
          />
          <Button
            isLoading={loading}
            onClick={() => {
              handleSubmit();
              setShowActivitySelector(false);
            }}
            className={`${
              isEditing ? 'bg-bblue' : activity === 'Disburse' ? 'bg-redShades-2' : 'bg-bgreen-0'
            }`}
            text={isEditing ? 'Save Changes' : activity === 'Disburse' ? 'Disburse' : 'Return'}
          />
        </div>
      </div>
    </SuperModal>
  );
};

export default AddInventoryModal;
