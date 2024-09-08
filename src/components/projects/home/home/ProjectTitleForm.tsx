import React, { useContext, useEffect, useMemo, useState } from 'react';
import { HiOutlinePencilAlt, HiPlus } from 'react-icons/hi';
import Modal from '../../../shared/Modal';
import { errorStyle, flexer, spacer } from '../../../../constants/globalStyles';
import InputField from '../../../shared/InputField';
import Button from '../../../shared/Button';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ProjectTitleSchema,
  getProjectSchema,
  newProjectTitleSchema
} from '../../../../validation/projectBrief';
import { updateProjectBrief } from '../../../../apis/projectBrief';
import SelectField from '../../../shared/SelectField';
import { displayError, displaySuccess } from 'Utils';
import { StoreContext } from '../../../../context';
import { ResidentialType } from 'pages/projects/Home/Components/NewPrototypeModal';
import NumericInput from 'components/shared/NumericInput';
import useFetch from 'Hooks/useFetch';
import CountrySelector from 'components/shared/CountrySelector';
import StateSelector from 'components/shared/StateSelector';
import CitySelector from 'components/shared/CitySelector';
import SpaceAdder from './SpaceAdder';
import { CommercialSpaceType } from 'components/projectbrief/AddOthers';
import { RiCloseCircleFill } from 'react-icons/ri';
import { removeemptyFields } from 'pages/projectform/utils';
import { IoCloseSharp } from 'react-icons/io5';

interface Form {
  city: string;
  state: string;
  units: number;
  country: string;
  ProjectType: string;
  buildingType: string;
  pseudoProjectName: string;
  numberOfBedrooms: string | number;
  numberOfLivingRooms: string | number;
  numberOfDiningRooms: string | number;
  numberOfToilets: string | number;
  numberOfKitchens: string | number;
  numberOfStorage: string | number;
  numberOfBaths: string | number;
}

const ProjectTitleForm = ({ toggleEditing }: { toggleEditing: () => void }) => {
  const { selectedProject, selectedData, setContext, data } = useContext(StoreContext);
  const [isEditing, setEditing] = useState(true);
  const { load, isLoading, error } = useFetch();
  const [spaces, setSpaces] = useState<CommercialSpaceType[]>([]);
  const [other, setOther] = useState<string[]>(selectedProject.otherSpaces);
  const [showOther, setShowOther] = useState(false);
  const [current, setCurrent] = useState('');
  const [_error, _setError] = useState('');

  const defaultValues = useMemo(() => {
    return {
      state: selectedProject.projectLocation?.state,
      city: selectedProject.projectLocation.city || '',
      units: Number(selectedProject.numberOfUnits) || 0,
      pseudoProjectName: selectedProject.pseudoProjectName,
      country: selectedProject.projectLocation.country || '',
      buildingType:
        selectedProject.projectType === 'commercial'
          ? selectedProject.commercialType
          : selectedProject.residentialType,
      ProjectType: selectedProject.projectType,
      numberOfBedrooms: selectedProject['numberOfBedrooms'],
      numberOfBaths: selectedProject['numberOfBaths'],
      numberOfLivingRooms: selectedProject['numberOfLivingRooms'],
      numberOfDiningRooms: selectedProject['numberOfDiningRooms'],
      numberOfToilets: selectedProject['numberOfToilets'],
      numberOfKitchens: selectedProject['numberOfKitchens'],
      numberOfStorage: selectedProject['numberOfStorage']
    };
  }, [isEditing, selectedProject, data]);
  const {
    control,
    getValues,
    register,
    handleSubmit,
    resetField,
    reset,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm<Form>({
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(newProjectTitleSchema)
  });
  let type = watch('ProjectType');
  let values = watch();
  useEffect(() => {
    reset();
  }, [isEditing, data, selectedProject]);

  const formstate = useMemo(() => {
    const isCommercial = values.ProjectType === 'commercial';
    const isValid = Object.keys(errors).length < 1;
    const typechanged = selectedProject.projectType !== values.ProjectType;
    let activateButton = (isCommercial && typechanged ? spaces.length > 0 : true) && isValid;

    return { isValid, isCommercial, typechanged, activateButton };
  }, [type, errors, values, isEditing, spaces, other, data]);

  useEffect(() => {
    let val = formstate.typechanged
      ? ''
      : formstate.isCommercial
        ? selectedProject.commercialType
        : selectedProject.residentialType;
    setValue('buildingType', val);
  }, [type]);

  const submitHandler = handleSubmit((formProject) => {
    //
    if (formstate.isCommercial && formstate.typechanged && spaces.length < 1) {
      _setError('Please include spaces you would like to add');
      displayError('Please include spaces you would like to add');
      return;
    }
    if (values.ProjectType === 'residential' && values.numberOfBedrooms === '0') {
      setError('numberOfBedrooms', {
        message: 'Number of bedrooms cannot be zero',
        type: 'custom'
      });
      return;
    }
    let payload: any = {
      projectLocation: {
        city: formProject.city,
        state: formProject.state,
        country: formProject.country
      },
      pseudoProjectName: formProject.pseudoProjectName,
      projectType: formProject.ProjectType,
      numberOfUnits: formProject.units
    };

    const extradetails = {
      numberOfBedrooms: formProject['numberOfBedrooms'],
      numberOfBaths: formProject['numberOfToilets'],
      numberOfLivingRooms: formProject['numberOfLivingRooms'],
      numberOfDiningRooms: formProject['numberOfDiningRooms'],
      numberOfToilets: formProject['numberOfToilets'],
      numberOfKitchens: formProject['numberOfKitchens'],
      numberOfStorage: formProject['numberOfStorage'],
      commercialSpaces:
        spaces.length > 0 && formstate.isCommercial
          ? spaces.map((m) => ({ name: m.name, value: m.quantity, iconNumber: m.iconNumber }))
          : [],
      otherSpaces: other.length > 0 && !formstate.isCommercial ? other : []
    };
    payload = { ...payload, ...removeemptyFields(extradetails) };
    payload[formProject.ProjectType === 'residential' ? 'residentialType' : 'commercialType'] =
      formProject.buildingType;

    load(updateProjectBrief(selectedProject._id, payload)).then(() => {
      // Alert
      displaySuccess('Updated Successfully');

      /** onSuccess */
      const updateProject = { ...selectedProject, ...payload };
      setContext((prev) => ({
        ...prev,
        newProjects: prev.menuProjects.map((one) =>
          one._id === selectedData._id ? updateProject : one
        ),
        data: prev.data.map((one) => (one._id === selectedProject._id ? updateProject : one))
      }));
      // close modal
      toggleEditing();
    });
  });

  const ModalForm = useMemo(
    () => (
      <form
        onSubmit={submitHandler}
        className="w-11/12 sm:w-1/2  p-6 rounded-lg bg-white relative z-10">
        <div className={flexer}>
          <h3 className="font-semibold text-xl">Project Title</h3>
          <span className="text-borange text-sm cursor-pointer" onClick={toggleEditing}>
            Close
          </span>
        </div>
        <div className={flexer}>
          <InputField
            register={register('pseudoProjectName')}
            error={errors.pseudoProjectName?.message}
            placeholder="Project Title"
            label="Project Title"
          />
          <div className={spacer} />

          <Controller
            {...{ control }}
            name="ProjectType"
            render={({ field: { value: ProjectType, onChange: onProjectTypeChange } }) => (
              <SelectField
                value={ProjectType}
                placeholder="choose"
                label="Project Type"
                onChange={onProjectTypeChange}
                data={['commercial', 'residential'].map((one) => ({
                  value: one
                }))}
              />
            )}
          />
        </div>
        <div className={flexer}>
          <Controller
            {...{ control }}
            name="country"
            render={({ field: { value: country, onChange: onCountryChange } }) => (
              <>
                <CountrySelector
                  value={country}
                  onChange={onCountryChange}
                  error={errors.country?.message}
                />
                <div className={spacer} />
                <Controller
                  {...{ control }}
                  name="state"
                  render={({ field: { value: state, onChange: onStateChange } }) => (
                    <>
                      <StateSelector
                        value={state}
                        country={country}
                        onChange={onStateChange}
                        error={errors.state?.message}
                      />
                      <div className={spacer} />
                      <Controller
                        {...{ control }}
                        name="city"
                        render={({ field: { value: city, onChange: onCityChange } }) => (
                          <CitySelector
                            value={city}
                            state={state}
                            country={country}
                            error={errors.city?.message}
                            onChange={onCityChange}
                          />
                        )}
                      />
                    </>
                  )}
                />
              </>
            )}
          />
        </div>
        <div className={flexer}>
          <Controller
            {...{ control }}
            name="buildingType"
            render={({ field: { value: buildingType, onChange: onBuildingChange } }) =>
              type === 'commercial' ? (
                <InputField
                  placeholder="Enter "
                  label="Building Type"
                  value={buildingType}
                  onChange={onBuildingChange}
                />
              ) : (
                <SelectField
                  placeholder="choose"
                  label="Building Type"
                  value={buildingType}
                  onChange={onBuildingChange}
                  data={Object.values(ResidentialType).map((one) => ({
                    value: one
                  }))}
                />
              )
            }
          />
          <div className={spacer} />
          <NumericInput
            error={errors.units?.message}
            register={register('units')}
            label="Number of Units"
            placeholder="+234"
            type="number"
          />
        </div>
        {error ? (
          <p className={errorStyle + 'my-2 text-center'}>{error}</p>
        ) : (
          <div className={spacer} />
        )}
        {formstate.typechanged && !formstate.isCommercial && (
          <>
            <div className="grid  grid-cols-2 gap-x-6 gap-y-0 max-h-96 ">
              <InputField
                handleChange={(val) =>
                  resetField('numberOfBedrooms', { defaultValue: Number(val) })
                }
                value={String(getValues('numberOfBedrooms'))}
                error={errors.numberOfBedrooms?.message}
                register={register('numberOfBedrooms')}
                placeholder="e.g 152370"
                label="Bedroom"
                type="number"
              />
              <InputField
                handleChange={(val) =>
                  resetField('numberOfLivingRooms', { defaultValue: Number(val) })
                }
                value={String(getValues('numberOfLivingRooms'))}
                error={errors.numberOfLivingRooms?.message}
                register={register('numberOfLivingRooms')}
                placeholder="+234"
                label="Living room"
                type="number"
              />
              <InputField
                handleChange={(val) =>
                  resetField('numberOfDiningRooms', { defaultValue: Number(val) })
                }
                value={String(getValues('numberOfDiningRooms'))}
                error={errors.numberOfDiningRooms?.message}
                register={register('numberOfDiningRooms')}
                placeholder="e.g 2"
                label="Dinning room"
                type="number"
              />
              <InputField
                handleChange={(val) => {
                  resetField('numberOfToilets', { defaultValue: Number(val) });
                  // resetField('numberOfBaths', { defaultValue: Number(val) });
                  setValue('numberOfBaths', val);
                }}
                value={String(getValues('numberOfToilets'))}
                error={errors.numberOfToilets?.message}
                register={register('numberOfToilets')}
                label="Toilet / Bathroom"
                placeholder="e.g 2"
                type="number"
              />
              <InputField
                handleChange={(val) =>
                  resetField('numberOfKitchens', { defaultValue: Number(val) })
                }
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
            </div>
            <div className=" flex items-center my-2 gap-4 flex-wrap">
              {React.Children.toArray(
                other?.map((one, i) => (
                  <span className=" p-2 rounded-md flex items-center bg-lightblue ">
                    <span>{one}</span>
                    <span
                      className={` ml-2 cursor-pointer`}
                      onClick={() => {
                        setOther(other.filter((m) => m !== one));
                      }}>
                      <IoCloseSharp />
                    </span>
                  </span>
                ))
              )}
            </div>
          </>
        )}

        {formstate.typechanged && (
          <div className="w-full ">
            {formstate.isCommercial ? (
              <SpaceAdder
                initialList={selectedProject.commercialSpaces.map((m) => ({
                  name: m.name,
                  quantity: m.value
                }))}
                onListChange={(x) => {
                  setSpaces(x);
                }}
              />
            ) : (
              <>
                {!showOther && (
                  <div className={flexer + ' px-6'}>
                    <div
                      onClick={() => {
                        setShowOther(true);
                      }}
                      className={flexer + 'cursor-pointer hover:opacity-90 '}>
                      <HiPlus className="text-borange" />
                      <span className="text-borange ml-1">Add Facility</span>
                    </div>
                  </div>
                )}
                {showOther && (
                  <div className="w-full flex items-end   ">
                    <InputField
                      value={current}
                      onChange={(x) => {
                        setCurrent(x.target.value);
                      }}
                      label="Enter space"
                      className=" flex-1"
                    />
                    <span
                      className=" ml-4 my-3  cursor-pointer px-4 py-2 whitespace-nowrap  rounded-md bg-bblue  text-white"
                      onClick={(e) => {
                        if (current) {
                          setOther([...other, current]);
                          setCurrent('');
                        }
                      }}>
                      Add Space
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <hr className="outline-top-2 w-full" />
        {_error && formstate.isCommercial && formstate.typechanged && (
          <p className={errorStyle + 'my-2 text-center px-6'}>{_error}</p>
        )}

        {error || _error ? (
          <p className={errorStyle + 'my-2 text-center px-6'}>{error}</p>
        ) : (
          <div className={spacer} />
        )}
        <div className={flexer + ' px-6'}>
          <div
            onClick={() => {}}
            className={
              flexer + 'cursor-pointer hover:opacity-90' + formstate.isCommercial
                ? ' invisible'
                : ''
            }>
            <HiPlus className="text-borange" />
            <span className="text-borange ml-1">Add Facility</span>
          </div>
        </div>
        <div className={flexer}>
          <div />
          <Button
            type={formstate.activateButton ? 'primary' : 'muted'}
            // disabled={formstate.activateButton}
            text="Update"
            className="w-1/3"
            isLoading={isLoading}
          />
        </div>
      </form>
    ),
    [error, errors, isLoading, register, submitHandler, control, isEditing, values]
  );

  return (
    <>
      {
        <Modal visible={true} toggle={toggleEditing}>
          <div className="w-full h-full py-10 flex items-center justify-center  overflow-y-auto">
            {ModalForm}
          </div>
        </Modal>
      }
    </>
  );
};

const ProjectTitleFormToggler = () => {
  const [toggle, setToggle] = useState(false);
  const toggleEditing = () => {
    setToggle(!toggle);
  };
  return (
    <>
      <div className="flex justify-end w-full mr-3">
        <div onClick={toggleEditing} className="bg-gray-200 p-2 rounded-full cursor-pointer">
          <HiOutlinePencilAlt className="text-gray-500" />
        </div>
      </div>
      {toggle && <ProjectTitleForm toggleEditing={toggleEditing} />}
    </>
  );
};

export { ProjectTitleFormToggler };
export default ProjectTitleForm;
