import Button from 'components/shared/Button';
import InputField from 'components/shared/InputField';
import { errorStyle, flexer, spacer } from 'constants/globalStyles';
import React from 'react';
import { HiPlus } from 'react-icons/hi';

import { MdOutlineClose } from 'react-icons/md';
import { RiCloseCircleFill } from 'react-icons/ri';
import SpaceAdder from './SpaceAdder';
import { Brief } from 'types';

interface FacilitiesModalProps {
  submitHandler: any;
  isCommercial: boolean;
  toggleEditing: any;
  getValues: any;
  resetField: any;
  register: any;
  allFacilities: any[];
  errors: any;
  isLoading?: boolean;
  isValid: boolean;
  error: any;
  handleFacilityRemoval: any;
  project: Brief;
  toggleFacility: () => void;
}
const FacilitiesModalForm = ({
  submitHandler,
  isCommercial,
  toggleEditing,
  getValues,
  resetField,
  register,
  allFacilities,
  errors,
  isLoading,
  isValid,
  error,
  handleFacilityRemoval,
  project,
  toggleFacility
}: FacilitiesModalProps) => {
  return (
    <form
      onSubmit={submitHandler}
      className="w-11/12 lg:w-2/5 py-6 rounded-lg bg-white relative z-10">
      <div className={flexer + ' px-6'}>
        <h3 className="font-semibold text-xl">{!isCommercial ? 'Facilities' : 'Spaces'}</h3>
        <span
          className="text-bash hover:text-borange hover:underline text-sm cursor-pointer"
          onClick={toggleEditing}>
          Close
        </span>
      </div>
      {!isCommercial ? (
        <div className="grid px-6 grid-cols-2 gap-x-6 gap-y-0 max-h-96 overflow-scroll">
          <InputField
            handleChange={(val) => resetField('numberOfBedrooms', { defaultValue: Number(val) })}
            value={String(getValues('numberOfBedrooms'))}
            error={errors.numberOfBedrooms?.message}
            register={register('numberOfBedrooms')}
            placeholder="e.g 152370"
            label="Bedroom"
            type="number"
          />
          <InputField
            handleChange={(val) => resetField('numberOfLivingRooms', { defaultValue: Number(val) })}
            value={String(getValues('numberOfLivingRooms'))}
            error={errors.numberOfLivingRooms?.message}
            register={register('numberOfLivingRooms')}
            placeholder="+234"
            label="Living room"
            type="number"
          />
          <InputField
            handleChange={(val) => resetField('numberOfDiningRooms', { defaultValue: Number(val) })}
            value={String(getValues('numberOfDiningRooms'))}
            error={errors.numberOfDiningRooms?.message}
            register={register('numberOfDiningRooms')}
            placeholder="e.g 2"
            label="Dinning room"
            type="number"
          />
          <InputField
            handleChange={(val) => resetField('numberOfToilets', { defaultValue: Number(val) })}
            value={String(getValues('numberOfToilets'))}
            error={errors.numberOfToilets?.message}
            register={register('numberOfToilets')}
            label="Toilet / Bathroom"
            placeholder="e.g 2"
            type="number"
          />
          <InputField
            handleChange={(val) => resetField('numberOfKitchens', { defaultValue: Number(val) })}
            value={String(getValues('numberOfKitchens'))}
            error={errors.numberOfKitchens?.message}
            register={register('numberOfKitchens')}
            placeholder="e.g 2"
            label="Kitchen"
            type="number"
          />
          <InputField
            handleChange={(val) => resetField('numberOfStorage', { defaultValue: Number(val) })}
            value={String(getValues('numberOfStorage'))}
            error={errors.numberOfStorage?.message}
            register={register('numberOfStorage')}
            placeholder="e.g 2"
            type="number"
            label="Store"
          />
          {React.Children.toArray(
            allFacilities?.map((one) => (
              <div className="relative">
                <div
                  className={`absolute bg-white top-9 -right-2 z-10 cursor-pointer`}
                  onClick={() => handleFacilityRemoval(one)}>
                  <RiCloseCircleFill className="text-red-700 text-xl hover:opacity-80" />
                </div>
                <InputField disabled value="1" label={one} type="number" />
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="w-full p-10">
          <SpaceAdder
            initialList={project.commercialSpaces.map((m) => ({ name: m.name, quantity: m.value }))}
            onListChange={() => {}}
          />
        </div>
      )}
      <hr className="outline-top-2 w-full" />
      {error ? (
        <p className={errorStyle + 'my-2 text-center px-6'}>{error}</p>
      ) : (
        <div className={spacer} />
      )}
      <div className={flexer + ' px-6'}>
        <div
          onClick={toggleFacility}
          className={flexer + 'cursor-pointer hover:opacity-90' + isCommercial ? ' invisible' : ''}>
          <HiPlus className="text-borange" />
          <span className="text-borange ml-1">Add Facility</span>
        </div>
        <Button
          text="Update"
          className="w-1/3"
          isLoading={isLoading}
          type={isValid ? 'primary' : 'muted'}
        />
      </div>
    </form>
  );
};

interface ModalProps {
  allFacilities: any[];
  handleAddFacility: any;
  handleFacilityRemoval: any;
  setNewFacility: any;
  error: any;
  newFacility: any;
  toggleFacility: any;
  toggleEditing: any;
}
const FacilityModal = ({
  allFacilities,
  handleAddFacility,
  handleFacilityRemoval,
  setNewFacility,
  error,
  newFacility,
  toggleFacility,
  toggleEditing
}: ModalProps) => (
  <div className="w-11/12 lg:w-2/5 p-6 rounded-lg bg-white relative z-10">
    <div className={flexer}>
      <div />
      <span className="text-borange text-sm cursor-pointer" onClick={toggleEditing}>
        Close
      </span>
    </div>
    <p className="text-2xl font-Medium w-11/12 mb-2">
      What other types of spaces would you like your dream home to have?
    </p>
    <div className="flex items-center overflow-x-scroll">
      {allFacilities?.map((one) => (
        <div
          onClick={() => handleFacilityRemoval(one)}
          className={'px-2 py-1 bg-blue-100 mr-2 rounded-md hover:opacity-90' + flexer}>
          <p className="text-bblue capitalize text-sm font-Medium truncate">{one}</p>
          <MdOutlineClose className="text-gray-500 ml-2 cursor-pointer" />
        </div>
      ))}
    </div>
    <form onSubmit={handleAddFacility} className={flexer}>
      <InputField
        onChange={(e) => setNewFacility(e.target.value)}
        placeholder="e.g Dining"
        value={newFacility}
        className="py-2"
        type="text"
        label=""
      />
      <Button text="add" className="w-auto ml-2 mt-2" type={newFacility ? 'primary' : 'muted'} />
    </form>
    {error ? (
      <p className={errorStyle + 'my-2 text-center'}>{error}</p>
    ) : (
      <div className={spacer} />
    )}
    <div className={flexer}>
      <div />
      <Button text="Update" className="w-1/3" onClick={toggleFacility} />
    </div>
  </div>
);
export { FacilityModal };
export default FacilitiesModalForm;
