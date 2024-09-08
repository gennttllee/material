/* eslint-disable react/prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { deleteProjectBrief, getOneProjectBrief, updateProjectBrief } from 'apis/projectBrief';
import Button from 'components/shared/Button/Button';
import { centered, errorStyle, flexer, hoverFade } from 'constants/globalStyles';
import useFetch from 'Hooks/useFetch';
import React, { useContext, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TbClockRecord, TbGridDots, TbHome2, TbMinus, TbPlus } from 'react-icons/tb';
import { Props } from './PrototypeModal';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { protoTypeUsageSchema } from 'validation/prototype';
import { InputFieldWithRef_ } from 'components/shared/InputField/InputField';
import InputSectionWithBorder from './InputSectionWithBorder';
import Calendly from 'components/shared/Calendry/Calendly';
import NumericInput from 'components/shared/NumericInput';
import RadioInput from 'components/shared/RadioInput';
import LocationPicker from './LocationPicker';
import CustomSection from './CustomSection';
import { displayError } from 'Utils';
import { formatNumberWithCommas, parseNumberWithoutCommas } from 'helpers';
import SelectField from 'components/shared/SelectField';
import { currencies } from '../../../../constants';
import { StoreContext } from 'context';
import { setNewProject } from 'store/slices/newprojectSlice';

export type YesOrNo = 'yes' | 'no';
interface Form {
  state: string;
  facilities: string[];
  unitOfMeasurement: string;
  projectType: string;
  country: string;
  units: number;
  currency: { code: string; label: string };
  city: string;
  //
  hasLand: YesOrNo;
  landSize: number;
  desiredLandSize: number;
  wantHelpWithLandAcquisition: YesOrNo;
  scheduleCall: Response;
  budget: number;
}

const UsePrototypeForm = (
  allProps: Props & {
    toggleModalType: () => void;
    projectId: string;
    setNewProject: (val: any) => void;
  }
) => {
  const { toggleModal, toggleEditModal, toggleModalType, logo, name, ...props } = allProps;
  const { projectName } = props;
  const navigate = useNavigate();
  const { setContext } = useContext(StoreContext);
  const [ownsLand, setOwnsLand] = useState<YesOrNo>('no');
  const [landAcquisition, setLandAcquisition] = useState<YesOrNo>('no');
  const facilityInputRef = useRef<HTMLInputElement>(null);
  const [updateBanner, setUpdateBanner] = useState(true);
  const { load: loadDelete, isLoading: isDeleting } = useFetch({
    onSuccess: () => {
      setContext((prev) => ({
        ...prev,
        // remove the brief from other stored brief
        data: prev.data.filter((one) => one._id !== allProps.projectId),
        menuProjects: prev.menuProjects.filter((one) => one._id !== allProps.projectId)
      }));
      toggleModalType();
    }
  });

  const { load } = useFetch({
    onSuccess: (briefs) => {
      const brief = briefs[0];
      setContext((prev) => ({
        ...prev,
        data: prev.data.map((one) => (one._id === brief._id ? brief : one)),
        menuProjects: prev.menuProjects.map((one) => (one._id === brief._id ? brief : one))
      }));
      navigate(`/projects/${allProps.projectId}/home`);
    },
    showDisplayError: false
  });

  const {
    isLoading: isProjectUpdating,
    load: loadProjectUpdate,
    success
  } = useFetch({
    onSuccess: () => {
      load(getOneProjectBrief(allProps.projectId));
    },
    showDisplayError: false
  });

  const {
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    reValidateMode: 'onChange',
    defaultValues: {
      units: 1,
      currency: {
        code: '',
        label: ''
      },
      facilities: props.otherSpaces.map((one) => one.name)
    },
    resolver: yupResolver(protoTypeUsageSchema(ownsLand, landAcquisition))
  });

  const {
    register,
    setValue: setFacilityValue,
    handleSubmit: handleFacilitySubmit
  } = useForm<{
    facility: string;
  }>();

  const submitPrototype = handleSubmit((data) => {
    const payload: { [key: string]: any } = {
      projectType: data.projectType,
      projectLocation: {
        country: data.country,
        city: data.city,
        state: data.state
      },
      currency: data.currency,
      numberOfUnits: data.units,
      defaultUnitOfMeasurement: data.unitOfMeasurement,
      otherSpaces: data.facilities.map((one) => one),
      land: {
        isLandAcquired: data.hasLand === 'yes',
        location: {
          country: data.country,
          city: data.city,
          state: data.state
        },
        landAcquisition: {
          isLandAgentHelpNeeded: data.wantHelpWithLandAcquisition === 'yes',
          location: {
            country: data.country,
            city: data.city,
            state: data.state
          },
          sizeTo: {
            from: 1234,
            to: data.wantHelpWithLandAcquisition === 'yes' ? data.desiredLandSize : data.landSize
          },
          budget: {
            from: 1234,
            to: data.wantHelpWithLandAcquisition === 'yes' ? data.budget : 0
          }
        }
      }
    };
    // turn every number to string
    for (const [key, value] of Object.entries(payload)) {
      if (typeof value === 'number') {
        payload[key] = String(value);
      }
    }
    loadProjectUpdate(updateProjectBrief(allProps.projectId, payload));
  });

  const submitFacility = handleFacilitySubmit(({ facility }) => {
    const prevFacilities = getValues('facilities');
    /**
     * 1. check if the facility exists already
     */
    const exists = prevFacilities.find((one) => one === facility);
    if (exists) return displayError('Facility already exists');

    const newFacilities = [...prevFacilities, facility];
    setValue('facilities', newFacilities);
    setFacilityValue('facility', '');
  });

  const OtherSpaces = () => (
    <Controller
      control={control}
      name="facilities"
      render={({ field: { onChange, value } }) => (
        <InputSectionWithBorder
          placeholder=" "
          clickablePlaceholder
          value={String(value)}
          labelClassName="text-bash"
          label="Other spaces (optional)"
          error={errors.facilities?.message}
          header="Do you other spaces you would like to add?"
          placeholderSub={
            value[0] ? (
              <div className="flex items-center flex-nowrap gap-4 overflow-x-scroll">
                {React.Children.toArray(
                  value.map((one) => (
                    <div className="bg-pbg rounded px-2 py-1">
                      <p className="text-black">{one}</p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <button className="font-Medium text-bblue text-base">Add other spaces +</button>
            )
          }
          Children={() => (
            <div>
              <div className="flex items-center flex-nowrap gap-4 overflow-x-scroll">
                {React.Children.toArray(
                  value.map((one) => (
                    <div
                      onClick={() => onChange(value.filter((el) => el !== one))}
                      className={'bg-blue-100 rounded px-2 py-1' + flexer + hoverFade}>
                      <p className="text-bblue">{one}</p>
                      <IoIosClose className="text-black ml-1 text-lg" />
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={submitFacility} className={'gap-5' + flexer}>
                <InputFieldWithRef_
                  label=""
                  required
                  className="flex-1"
                  ref={facilityInputRef}
                  placeholder="e.g Garage"
                  register={register('facility')}
                />
                <Button type="transparent" text="Add" />
              </form>
            </div>
          )}
        />
      )}
    />
  );

  return (
    <div className="w-full">
      <div className={flexer + 'items-start gap-5 flex-col md:flex-row'}>
        <h1 className="text-xl transform -translate-y-1 flex-1 font-Demibold mb-5 capitalize whitespace-nowrap">
          {projectName}
        </h1>
        {updateBanner && (
          <div className="bg-bblue !text-white rounded-md px-3 lg:px-6 py-2 lg:py-4">
            <div className={flexer}>
              <h4 className="font-Demibold">Update Prototype</h4>
              <span
                onClick={() => {
                  setUpdateBanner(false);
                }}>
                <IoIosClose className={hoverFade} />
              </span>
            </div>
            <p>
              Own this prototype by making your preferred changes to it and completing you details
            </p>
          </div>
        )}
      </div>
      <CustomSection
        hasBorder
        Icon={TbHome2}
        title="Project Brief"
        description="This section of the form requires you to input a bit more details about the project itself which you are looking to undertake."
        Children={
          <>
            <InputSectionWithBorder
              label="Project Type"
              value={watch('projectType')}
              error={errors.projectType?.message}
              header="Is this a commercial or residential project?"
              Children={() => (
                <RadioInput
                  value={watch('projectType')}
                  onChange={(vl) => setValue('projectType', vl)}
                  options={[{ value: 'residential' }, { value: 'commercial' }]}
                />
              )}
            />

            <Controller
              name="currency"
              {...{ control }}
              render={({ field: { onChange, value } }) => (
                <InputSectionWithBorder
                  autoSave
                  label="Currency"
                  error={errors.currency?.message}
                  value={value.label ? `${value.label} (${value.code})` : undefined}
                  header="What currency is going to be used on this projects?"
                  Children={() => (
                    <SelectField
                      showSearch
                      value={value.code}
                      data={currencies.map((one) => ({
                        ...one,
                        label: `${one.label}  (${one.value})`
                      }))}
                      onChange={(val) => {
                        const currency = currencies.find((one) => one.value === val);
                        if (currency) onChange({ code: currency.value, label: currency.label });
                      }}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="units"
              control={control}
              render={({ field: { onChange, value } }) => (
                <InputSectionWithBorder
                  autoSave
                  label="Units"
                  value={value}
                  error={errors.units?.message}
                  header="How many units will there be?"
                  Children={() => (
                    <div className="flex items-center">
                      <div
                        onClick={() => {
                          if (value > 1) onChange(value - 1);
                        }}
                        className={'border rounded-full w-10 h-10' + centered + hoverFade}>
                        <TbMinus className="text-slate-700" />
                      </div>
                      <p className="text-lg mx-4 text-black font-Medium">{value}</p>
                      <div
                        onClick={() => onChange(value + 1)}
                        className={'border rounded-full w-10 h-10' + centered + hoverFade}>
                        <TbPlus className="text-slate-700" />
                      </div>
                    </div>
                  )}
                />
              )}
            />
            <InputSectionWithBorder
              label="Unit of Measurement"
              value={watch('unitOfMeasurement')}
              error={errors.unitOfMeasurement?.message}
              header="Is this a project using metrics or imperial ?"
              Children={() => (
                <RadioInput
                  onChange={(vl) => setValue('unitOfMeasurement', vl)}
                  options={[
                    { label: 'Metrics(sqm)', value: 'Metric' },
                    { label: 'Imperial(Ft)', value: 'Imperial' }
                  ]}
                  value={watch('unitOfMeasurement')}
                />
              )}
            />
            <OtherSpaces />
          </>
        }
      />
      <CustomSection
        hasBorder
        title="Land"
        Icon={TbGridDots}
        description="In this section you are to state if there is an availability of a piece of land for the project, and in the case there is not one provisions are made to aid in land acquisition."
        Children={
          <Controller
            control={control}
            name="hasLand"
            render={({ field: { value: hasLand, onChange } }) => {
              if (ownsLand !== hasLand) {
                setOwnsLand(hasLand);
              }
              return (
                <>
                  <InputSectionWithBorder
                    value={hasLand}
                    hasBorderBottom={!!hasLand}
                    error={errors.hasLand?.message}
                    label="Do you have a piece of land"
                    header="Do you have a piece of land for this project?"
                    Children={() => (
                      <RadioInput
                        value={hasLand}
                        onChange={(vl) => onChange(vl as YesOrNo)}
                        options={[
                          { value: 'yes', label: 'Yes' },
                          { value: 'no', label: 'No' }
                        ]}
                      />
                    )}
                  />
                  {hasLand === 'no' ? (
                    /**
                     * ! render conditionally,
                     * ? if the project owner doesn't already have a land
                     */
                    <Controller
                      control={control}
                      name="wantHelpWithLandAcquisition"
                      render={({ field: { onChange, value: wantHelpWithLandAcquisition } }) => {
                        if (landAcquisition !== wantHelpWithLandAcquisition) {
                          setLandAcquisition(wantHelpWithLandAcquisition);
                        }
                        return (
                          <>
                            <InputSectionWithBorder
                              label="Land acquisition"
                              value={wantHelpWithLandAcquisition}
                              hasBorderBottom={wantHelpWithLandAcquisition === 'yes'}
                              error={errors.wantHelpWithLandAcquisition?.message}
                              header="Would you like us to help you get a piece of land?"
                              Children={() => (
                                <RadioInput
                                  onChange={(vl) => onChange(vl as YesOrNo)}
                                  value={wantHelpWithLandAcquisition}
                                  options={[
                                    { value: 'yes', label: 'Yes' },
                                    { value: 'no', label: 'No' }
                                  ]}
                                />
                              )}
                            />
                            {wantHelpWithLandAcquisition === 'yes' && (
                              /**
                               *!  Only show this if the user,
                               *? wants help finding the land
                               */
                              <>
                                <InputSectionWithBorder
                                  localizeText
                                  value={watch('desiredLandSize')}
                                  label="Desired size of land"
                                  error={errors.desiredLandSize?.message}
                                  header="the desired size of the land in square meters"
                                  Children={() => (
                                    <Controller
                                      name="desiredLandSize"
                                      control={control}
                                      render={({ field: { onChange, onBlur, value } }) => (
                                        <NumericInput
                                          autoFocus
                                          onBlur={onBlur}
                                          value={formatNumberWithCommas(value)}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const newValue = parseNumberWithoutCommas(
                                              e.target.value
                                            );
                                            if (/^[0-9e]*$/.test(newValue)) {
                                              onChange(newValue);
                                            }
                                          }}
                                          error={errors.budget?.message}
                                          placeholder="2500"
                                          label=""
                                          type="text"
                                        />
                                      )}
                                    />
                                  )}
                                />
                                <LocationPicker {...{ watch, setValue, errors }} />
                                <Controller
                                  name="budget"
                                  control={control}
                                  render={({ field: { onChange, onBlur, value } }) => (
                                    <InputSectionWithBorder
                                      localizeText
                                      value={value}
                                      label="Budget for land"
                                      hasBorderBottom={false}
                                      error={errors.budget?.message}
                                      header="the budget of the project in $ ( US Dollars )"
                                      Children={() => (
                                        <NumericInput
                                          autoFocus
                                          onBlur={onBlur}
                                          error={errors.budget?.message}
                                          value={formatNumberWithCommas(value)}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const newValue = parseNumberWithoutCommas(
                                              e.target.value
                                            );
                                            if (/^[0-9e]*$/.test(newValue)) {
                                              onChange(newValue);
                                            }
                                          }}
                                          placeholder="20,000,000"
                                          label=""
                                          type="text"
                                        />
                                      )}
                                    />
                                  )}
                                />
                              </>
                            )}
                          </>
                        );
                      }}
                    />
                  ) : (
                    hasLand === 'yes' && (
                      /**
                       * ! render conditionally,
                       * ? if the project owner has a land that s/he could provide the size
                       */
                      <>
                        <InputSectionWithBorder
                          localizeText
                          label="Size of land"
                          value={watch('landSize')}
                          error={errors.landSize?.message}
                          header="the size of the land in square meters"
                          Children={() => (
                            <Controller
                              name="landSize"
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <NumericInput
                                  autoFocus
                                  onBlur={onBlur}
                                  value={formatNumberWithCommas(value)}
                                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const newValue = parseNumberWithoutCommas(e.target.value);
                                    if (/^[0-9e]*$/.test(newValue)) {
                                      onChange(newValue);
                                    }
                                  }}
                                  error={errors.landSize?.message}
                                  placeholder="2,500"
                                  label=""
                                  type="text"
                                />
                              )}
                            />
                          )}
                        />
                        <LocationPicker
                          label="Land Location"
                          hasBorderBottom={false}
                          {...{ watch, setValue, errors }}
                        />
                      </>
                    )
                  )}
                </>
              );
            }}
          />
        }
      />
      <CustomSection
        Icon={TbClockRecord}
        title="Schedule meeting"
        description="Now you are all done, all that is left is to select a time of your convenience to set a meeting time to wrap this up."
        Children={
          <div className={flexer + 'items-start mt-5'}>
            <div>
              <p className="font-Medium text-black text-base">Are you ready to wrap this up</p>
              {watch('scheduleCall') ? (
                <p className="text-green-700 text-base">Meeting Scheduled</p>
              ) : (
                <p className="text-red-700 text-base">No Meeting Set</p>
              )}
              <p className={errorStyle + 'mt-3'}>{errors.scheduleCall?.status?.message}</p>
            </div>
            <Calendly
              projectId={allProps.projectId}
              callBack={(schedule) => {
                setValue('scheduleCall', schedule);
              }}
              placeholder={
                <button className={'text-bblue text-base font-Medium' + hoverFade}>
                  Schedule Meeting
                </button>
              }
            />
          </div>
        }
      />
      <div className="flex items-center justify-end relative mt-5 z-0">
        <Button
          text="Cancel"
          type="secondary"
          isLoading={isDeleting}
          onClick={() => {
            loadDelete(deleteProjectBrief(allProps.projectId)).then(() => {
              allProps.setNewProject(undefined);
              toggleModalType();
            });
          }}
        />
        <Button
          text="Submit"
          onClick={() =>
            success
              ? null // close modal
              : submitPrototype()
          }
          isLoading={isProjectUpdating}
          success={success}
          className="ml-4"
        />
      </div>
    </div>
  );
};

export default UsePrototypeForm;
