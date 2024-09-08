import React, { useState, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addRecord, updateRecord } from 'store/slices/supplySlice';
import { Record } from 'components/projects/procurement/supply/types';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import SelectDate from 'components/shared/SelectDate';
import Button from 'components/shared/Button';
import { TbMinus, TbPlus } from 'react-icons/tb';
import { format, parseISO } from 'date-fns';

interface AddSupplyModalProps {
  onClose: () => void;
  initialData?: Record | null;
}

const initialValue: Record = {
  _id: '',
  date: format(new Date(), 'yyyy-MM-dd'),
  material: '',
  quantity: 0,
  unit: '',
  orderNumber: '',
  rate: 0,
  amount: 0,
  acknowledgedBy: '',
  description: '',
  vendor: 0,
  category: '',
  notes: '',
  s_n: ''
};

const AddSupplyModal: React.FC<AddSupplyModalProps> = ({ onClose, initialData }) => {
  const [form, setForm] = useState<Record>(initialData || initialValue);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const isEditing = Boolean(initialData);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.date) newErrors.date = 'Date is required';
    if (!form.orderNumber?.trim()) newErrors.material = 'Order Number is required';
    if (!form.material?.trim()) newErrors.material = 'Material is required';
    if (!form.unit?.trim()) newErrors.unit = 'Unit is required';
    if (form.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';
    if (!form.vendor?.trim()) newErrors.vendor = 'Vendor is required';
    if (!form.category?.trim()) newErrors.category = 'Category is required';
    if (!form.acknowledgedBy?.trim()) newErrors.acknowledgedBy = 'Acknowledged By is required';
    if (!form.notes?.trim()) newErrors.notes = 'Notes are required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleNumberChange = (name: keyof Record) => (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      setForm((prevForm) => ({
        ...prevForm,
        [name]: numberValue
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  const handleIncrement = () => {
    const newQuantity = form.quantity + 1;
    setForm((prevForm) => ({ ...prevForm, quantity: newQuantity }));
    setErrors((prevErrors) => ({ ...prevErrors, quantity: '' }));
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(0, form.quantity - 1);
    setForm((prevForm) => ({ ...prevForm, quantity: newQuantity }));
    setErrors((prevErrors) => ({ ...prevErrors, quantity: '' }));
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (isEditing) {
        dispatch(updateRecord(form));
      } else {
        dispatch(addRecord({ ...form, _id: Date.now().toString() }));
      }
      onClose();
    }
  };

  return (
    <SuperModal
      classes="bg-black bg-opacity-60 flex flex-col items-center overflow-y-auto"
      closer={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-md p-6 mt-20 w-full max-w-lg">
        <div className="flex items-center justify-between">
          <p className="text-xl font-medium">{isEditing ? 'Edit Supply' : 'Record Supply'}</p>
          <span className="cursor-pointer text-sm text-bash" onClick={onClose}>
            Close
          </span>
        </div>
        <InputField
          name="orderNumber"
          value={form.orderNumber || ''}
          onChange={handleChange}
          label="Order Number"
          placeholder="e.g RJI4345HJK"
          className="mt-1 "
          error={errors.orderNumber}
        />
        <InputField
          name="material"
          value={form.material || ''}
          onChange={handleChange}
          label="Material"
          placeholder="e.g Cement"
          className="mt-1"
          error={errors.material}
        />
        <InputField
          name="acknowledgedBy"
          value={form.acknowledgedBy || ''}
          onChange={handleChange}
          label="Recieved By"
          placeholder="Receiver’s name"
          className="mt-1"
          error={errors.acknowledgedBy}
        />
        <div className="flex gap-x-4 items-center mt-4">
          <div>
            <p className="text-[#77828D]">Quantity</p>
            <div className="flex rounded-md border px-2 py-1 items-center text-[#77828D] gap-x-2 border-ashShade-4 mt-1">
              <span
                onClick={handleDecrement}
                className="p-2  hover:bg-ashShade-0 rounded-full cursor-pointer">
                <TbMinus />
              </span>

              <input
                className="outline-none w-1/4 "
                name="quantity"
                value={form.quantity.toLocaleString()}
                onChange={handleNumberChange('quantity')}
                type="text"
                placeholder="Quantity"
              />

              <span
                onClick={handleIncrement}
                className="p-2 hover:bg-ashShade-0 rounded-full cursor-pointer">
                <TbPlus />
              </span>
            </div>
            {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
          </div>

          <InputField
            name="unit"
            value={form.unit || ''}
            onChange={handleChange}
            label="Unit"
            placeholder="e.g Bags"
            className="flex-1 "
            error={errors.unit}
          />
        </div>
        <SelectDate
          className="mt-8"
          placeholder="Select date"
          minDate={new Date(0)}
          value={parseISO(form.date)}
          label="Supplied Date"
          onChange={(date) =>
            date && setForm((prevForm) => ({ ...prevForm, date: format(date, 'yyyy-MM-dd') }))
          }
        />
        {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}

        <div className="flex gap-x-4 mt-4">
          <InputField
            name="vendor"
            value={form.vendor || ''}
            onChange={handleChange}
            label="Vendor"
            placeholder="eg. Setraco"
            className="flex-1"
            error={errors.vendor}
          />

          <InputField
            name="category"
            value={form.category || ''}
            onChange={handleChange}
            label="Category"
            placeholder="eg. Materials"
            className="flex-1"
            error={errors.category}
          />
        </div>

        <InputField
          isTextArea
          name="notes"
          value={form.notes || ''}
          onChange={handleChange}
          label="Notes (Optional)"
          placeholder="Enter a description..."
          className="mt-1"
          error={errors.notes}
        />

        <div className="flex justify-end gap-x-4 mt-6">
          <Button onClick={onClose} type="secondary" text="Cancel" />
          <Button onClick={handleSubmit} text={isEditing ? 'Save Changes' : 'Record Supply'} />
        </div>
      </div>
    </SuperModal>
  );
};

export default AddSupplyModal;
