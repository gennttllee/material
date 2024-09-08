import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Record } from './types';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import Button from 'components/shared/Button';
import { DatePicker } from 'components/shared/DatePicker';
import SelectDate from 'components/shared/SelectDate';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addRecord, updateRecord } from 'store/slices/bookKeepingSlice';
import * as yup from 'yup';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { convertToNumber, displayError, displaySuccess, formatWithComma } from 'Utils';
import { TbMinus, TbPlus } from 'react-icons/tb';
import { debounce } from 'lodash';

interface Props {
  closer: () => void;
  isEditing?: boolean;
  value?: Record;
}

const initialValue = {
  date: new Date(),
  item: '',
  quantity: '0',
  unit: '',
  rate: '0',
  amount: '0',
  description: '',
  vendor: '',
  category: ''
};

const convertRecord = (val: Record) => {
  let newVal: { [key: string]: any } = { ...val };
  newVal.amount = val.amount.toString();
  newVal.quantity = val.quantity.toString();
  newVal.rate = val.rate.toString();

  return newVal as Record;
};

const AddRecordModal = ({ closer, isEditing, value }: Props) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const { selectedData } = useContext(StoreContext);
  let { errors, values, setFieldValue, handleChange, handleSubmit, touched, resetForm } = useFormik(
    {
      initialValues: value ? convertRecord(value) : initialValue,
      onSubmit: (data) => {
        let _data: Record & { _id?: string } = { ...data } as Record;
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
        date: yup.string().required(),
        item: yup.string().required(),
        quantity: yup.string().required().not(['0'], 'Field cannot be zero'),
        unit: yup.string().required(),
        rate: yup.string().required().not(['0'], 'Field cannot be zero'),
        amount: yup.string().required().not(['0'], 'Field cannot be zero'),
        description: yup.string().required('please enter description'),
        vendor: yup.string().required(),
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

  const _submit = async (data: Omit<Record, '_id'> & { _id?: string }) => {
    setLoading(true);
    let _id = data._id;
    if (!isEditing) {
      delete data?._id;
    }
    const { e, response } = await postForm('post', `financials/bookkeeping/add`, {
      project: selectedData?._id,
      bookInput: [data]
    });
    if (response) {
      displaySuccess('Record added successfully');
      dispatch(addRecord(response.data.data[0]));
      resetForm();
      closer();
    } else displayError(e?.message || '');

    setLoading(false);
  };

  const _edit = async (data: Omit<Record, '_id'> & { _id?: string }) => {
    setLoading(true);
    let _data: any = { ...data };

    for (let x of ['_id', 'project', '__v', 'createdBy', 'createdAt']) {
      delete _data[x];
    }
    const { e, response } = await postForm('patch', `financials/bookkeeping/update`, {
      ..._data,
      bookId: value?._id
    });
    if (response) {
      displaySuccess('Record updated successfully');
      dispatch(updateRecord(response.data.data));
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
          <p className=" text-xl font-medium">{isEditing ? 'Edit Record' : 'Record Expenditure'}</p>

          <span className=" cursor-pointer text-sm text-bash" onClick={closer}>
            Close
          </span>
        </div>
        <SelectDate
          className=" mt-8"
          error={((touched.date && errors?.date) || '') as string}
          placeholder="select date"
          wrapperClassName=" !border-ashShade-4 "
          minDate={new Date(0)}
          initialValue={value?.date ? new Date(value.date) : new Date()}
          value={date}
          label="Purchased Date"
          onChange={(e) => {
            if (e) {
              setFieldValue('date', e.toISOString());
            }
          }}
        />

        <InputField
          error={(touched?.item && errors?.item) || ''}
          name="item"
          value={values.item}
          onChange={handleChange}
          label="Material"
          placeholder="e.g Cement"
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

        <div className=" flex items-center gap-x-4">
          <InputField
            error={(touched.vendor && errors.vendor) || ''}
            name="vendor"
            value={values.vendor}
            onChange={handleChange}
            type="text"
            label="Vendor"
            placeholder="e.g CostCo"
            className=" !text-bblack-1 "
          />

          <InputField
            error={(touched.category && errors.category) || ''}
            name="category"
            value={values.category}
            onChange={handleChange}
            type="text"
            label="Category"
            placeholder="e.g Struts"
            className=" !text-bblack-1 "
          />
        </div>

        <InputField
          isTextArea
          error={(touched.description && errors.description) || ''}
          name="description"
          value={values.description}
          onChange={handleChange}
          label="Description"
          placeholder="e.g comments"
          className=" !text-bblack-1 "
        />

        <div className=" flex justify-end gap-x-4">
          <Button onClick={closer} type="secondary" text="Cancel" />
          <Button
            isLoading={loading}
            onClick={() => {
              handleSubmit();
            }}
            text={isEditing ? 'Save Changes' : 'Record Expenditure'}
          />
        </div>
      </div>
    </SuperModal>
  );
};

export default AddRecordModal;
