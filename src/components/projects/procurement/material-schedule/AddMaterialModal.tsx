import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MaterialScheduleRecord, MaterialRecord } from './types';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import Button from 'components/shared/Button';
import SelectDate from 'components/shared/SelectDate';
import { useFormik } from 'formik';
import { useAppDispatch } from 'store/hooks';
import { addMaterialRecord, updateMaterialRecord } from 'store/slices/materialScheduleSlice';
import * as yup from 'yup';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { convertToNumber, displayError, displaySuccess, formatWithComma } from 'Utils';
import { TbMinus, TbPlus } from 'react-icons/tb';
import useMaterialSchedule from 'Hooks/useMaterialSchedule';

interface Props {
  onAdd?: any;
  closer: () => void;
  isEditing?: boolean;
  value?: MaterialRecord;
  // scheduleId?: any; 
  // Add the 'scheduleId' property
  activeTab: string;
}

const initialValue = {
  purchaseDate: new Date(),
  material: '',
  quantity: '0',
  unit: '',
  rate: '0',
  amount: '0',
  notes: '',
  category: ''
};

const convertRecord = (val: MaterialRecord) => {
  let newVal: { [key: string]: any } = { ...val };
  newVal.amount = val.amount.toString();
  newVal.quantity = val.quantity.toString();
  newVal.rate = val.rate.toString();

  return newVal as MaterialRecord;
};

const AddMaterialModal = ({ onAdd, closer, isEditing, value, activeTab }: Props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { getRecords } = useMaterialSchedule();


  const { selectedData } = useContext(StoreContext);
  let { errors, values, setFieldValue, handleChange, handleSubmit, touched, resetForm } = useFormik(
    {
      initialValues: value ? convertRecord(value) : initialValue,
      onSubmit: (data) => {
        let _data: MaterialRecord & { _id?: string } = {
          ...data
        } as MaterialRecord;
        if (!_data?._id) {
          _data._id = Math.random().toString();
        }
        _data.amount = convertToNumber(data.amount as unknown as string);
        _data.quantity = convertToNumber(data.quantity as unknown as string);
        _data.rate = convertToNumber(data.rate as unknown as string);
        if (isEditing) {
          _edit(_data);
        } else _submit(_data);
      },
      validationSchema: yup.object({
        purchaseDate: yup.string().required(),
        material: yup.string().required(),
        quantity: yup.string().required().not(['0'], 'Field cannot be zero'),
        unit: yup.string().required(),
        rate: yup.string().required().not(['0'], 'Field cannot be zero'),
        amount: yup.string().required().not(['0'], 'Field cannot be zero'),
        notes: yup.string().required('Please enter notes'),
        category: yup.string().required()
      }),
      validateOnBlur: true
    }
  );

  useEffect(() => {
    let quantity = convertToNumber(values.quantity as string);
    let rate = convertToNumber(values.rate as string);
    let finalAmount = quantity * rate;
    setFieldValue('amount', formatWithComma(finalAmount));
  }, [values.quantity, values.rate]);


  const _submit = async (data: Omit<MaterialRecord, '_id'> & { _id?: string }) => {
    setLoading(true);
    let _id = data._id;
    if (!isEditing) {
      delete data?._id;
    }

    let _data = {...data} as any

    const payload = {
      scheduleId: activeTab ,
      materials: [
        // _data
        {
          material: data.material,
          quantity: convertToNumber(String(data.quantity)),
          rate: convertToNumber(String(data.rate)),
          unit: data.unit,
          amount: convertToNumber(String(data.amount)),
          category: data.category,
          notes: data.notes
        }
      ]
    };

    const { e, response } = await postForm('patch', `procurements/material-schedule/add-material`, payload);
    if (response) {
      displaySuccess('Material added successfully');
      dispatch(addMaterialRecord(payload));
      resetForm();
      onAdd();
      closer();
    } else {
      console.log(e.message);
      displayError(e?.message || '');
    }

    setLoading(false);
  };

  const _edit = async (
    data: Omit<MaterialRecord, '_id'> & { _id?: string; }
  ) => {
    setLoading(true);
    const { _id, ...restData } = data;
  
    let _data = { ...restData } as any;
  
    for (let x of ['_id', 'project', '__v', 'createdBy', 'createdAt']) {
      delete _data[x];
    }
  
    const payload = {
      scheduleId: activeTab,
      // scheduleId: value?._id, 
      // Use the appropriate ID for the schedule
      materialId: _id,
      ...data
    };
  
    const { e, response } = await postForm('patch', `procurements/material-schedule/update-material`, payload);
    if (response) {
      displaySuccess('Material updated successfully');
      dispatch(updateMaterialRecord({ scheduleId: value?._id, material: { ..._data, _id }}));
      getRecords()
      resetForm();
      closer();
    } else displayError(e?.message || '');
  
    setLoading(false);
  };

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
    return new Date(values.purchaseDate);
  }, [values.purchaseDate]);

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
          <p className=" text-xl font-medium">{isEditing ? 'Edit Material' : 'Add Material'}</p>

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
          className=" !text-bblack-1"
        />
        <div className="flex gap-x-4 items-center">
          <div className="w-[47%]">
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
            placeholder="e.g Bags"
            className=" !flex-1 !text-bblack-1"
          />
        </div>

        <div className=" flex items-center gap-x-4">
          <InputField
            error={(touched.rate && errors.rate) || ''}
            name="rate"
            value={values.rate}
            onChange={_handleNumberChange('rate')}
            type="text"
            label="Rate"
            placeholder="e.g 1000"
            className=" !text-bblack-1 "
          />
          <InputField
            error={(touched?.amount && errors.amount) || ''}
            name="amount"
            value={values.amount}
            onChange={_handleNumberChange('amount')}
            type="text"
            label="Amount"
            placeholder="e.g 100,000"
            className=" !text-bblack-1 "
          />
        </div>

        <SelectDate
          className=""
          error={((touched.purchaseDate && errors?.purchaseDate) || '') as string}
          placeholder="Select date"
          wrapperClassName=" !border-ashShade-4 "
          minDate={new Date(0)}
          initialValue={value?.purchaseDate ? new Date(value.purchaseDate) : new Date()}
          value={date}
          label="Purchased Date"
          onChange={(e) => {
            if (e) {
              setFieldValue('date', e.toISOString());
            }
          }}
        />

        <div className=" flex items-center gap-x-4">
          <InputField
            error={(touched.category && errors.category) || ''}
            name="category"
            value={values.category}
            onChange={handleChange}
            type="text"
            label="Category"
            placeholder="e.g Materials"
            className=" !text-bblack-1 "
          />
        </div>

        <InputField
          isTextArea
          error={(touched.notes && errors.notes) || ''}
          name="notes"
          value={values.notes}
          onChange={handleChange}
          label="Notes"
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
            text={isEditing ? 'Save Changes' : 'Record Material'}
          />
        </div>
      </div>
    </SuperModal>
  );
};

export default AddMaterialModal;
