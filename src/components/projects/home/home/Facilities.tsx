import React, { useContext, useEffect, useMemo, useState } from 'react';
import Title from './Title';
import Facility from './Facility';
import bedroom from 'assets/bedroom.svg';
import { HiOutlinePencilAlt, HiPlus } from 'react-icons/hi';
import { MdOutlineClose } from 'react-icons/md';
import diningroom from 'assets/diningroom.svg';
import livingroom from 'assets/livingroom.svg';
import numberOfToilets from 'assets/toilet.svg';
import numberOfKitchens from 'assets/kitchen.svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { errorStyle, flexer, spacer } from '../../../../constants/globalStyles';
import InputField from '../../../shared/InputField';
import Button from '../../../shared/Button';
import { facilitiesSchema } from '../../../../validation/projectBrief';
import Modal from '../../../shared/Modal';
import { RiCloseCircleFill } from 'react-icons/ri';
import { displayError, displaySuccess } from 'Utils';
import useFetch from '../../../../Hooks/useFetch';
import { updateProjectBrief } from '../../../../apis/projectBrief';
import useRole from '../../../../Hooks/useRole';
import { StoreContext } from '../../../../context';
import { Brief, BriefFacilities, CommercialSpace, ProfessionalBrief } from '../../../../types';
import { CommercialSpaceType, EditableComponent } from 'components/projectbrief/AddOthers';
import SpaceAdder from './SpaceAdder';

interface Prop {
  className?: string;
  toggleEditing: () => void;
}

const initialForm = ({
  numberOfBedrooms,
  numberOfBaths,
  numberOfLivingRooms,
  numberOfDiningRooms,
  numberOfToilets,
  numberOfKitchens,
  numberOfStorage
}: ProfessionalBrief): BriefFacilities => ({
  numberOfBedrooms,
  numberOfBaths,
  numberOfLivingRooms,
  numberOfDiningRooms,
  numberOfToilets,
  numberOfKitchens,
  numberOfStorage
});

const Facilities = ({ className, toggleEditing }: Prop) => {
  const { isProfessional } = useRole();
  const { handleContext, data, selectedProject: project } = useContext(StoreContext);
  const [isValid, setValid] = useState(false);
  const { error, load, isLoading } = useFetch();
  const [isEditing, setEditing] = useState(true);
  const [newFacility, setNewFacility] = useState<string>();
  const [showFacilities, setShowFacilities] = useState(false);
  const [allFacilities, setFacilities] = useState<string[]>(project.otherSpaces);
  const [mainFacilities, setMainFacilities] = useState<{ icon: any; label: string; value: any }[]>(
    []
  );
  const [spaces, setSpaces] = useState<CommercialSpaceType[]>([]);
  const isCommercial = useMemo(() => {
    return project?.projectType === 'commercial';
  }, [project, isEditing]);

  const commercialSpaces = useMemo(() => {
    return project.commercialSpaces.map((m) => ({ name: m.name, quantity: m.value }));
  }, [isEditing, showFacilities]);
  useEffect(() => {
    setMainFacilities([
      {
        icon: bedroom,
        label: 'Bedrooms',
        value: project?.numberOfBedrooms
      },
      {
        icon: livingroom,
        label: 'Living Room',
        value: project?.numberOfLivingRooms
      },
      {
        icon: diningroom,
        label: 'Dining Room',
        value: project?.numberOfDiningRooms
      },
      {
        icon: numberOfToilets,
        label: 'Toilet / Bathroom',
        value: project?.numberOfBaths
      },
      {
        icon: numberOfKitchens,
        label: 'Kitchen',
        value: project?.numberOfKitchens
      },
      {
        icon: bedroom,
        label: 'Store',
        value: project?.numberOfStorage
      }
    ]);
  }, [project, showFacilities, isEditing]);

  const {
    register,
    getValues,
    resetField,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<BriefFacilities>({
    reValidateMode: 'onChange',
    defaultValues: initialForm(project as any),
    resolver: !isCommercial ? yupResolver(facilitiesSchema) : undefined
  });

  useEffect(() => {
    reset();
  }, [isEditing]);
  useEffect(() => {
    const id = setInterval(() => {
      let isComplete = true;
      const currentData: any = getValues();
      for (const value of Object.values(currentData)) {
        if (!value) {
          isComplete = false;
          break;
        }
      }

      setValid((prev) => (prev !== isComplete ? !prev : prev));
    }, 500);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line
  }, []);

  if (!mainFacilities[0]) return null;

  const _toggleEditing = () => {
    if (showFacilities) toggleFacility();

    toggleEditing();
  };

  const toggleFacility = () => {
    setShowFacilities((prev) => !prev);
  };

  const submitHandler = handleSubmit((formData) => {
    if (isCommercial && spaces.length < 1) {
      displayError('Please select at least one space');
      return;
    }
    const payload = {
      otherSpaces: allFacilities,
      ...formData,
      numberOfBaths: formData.numberOfToilets,
      commercialSpaces: isCommercial
        ? spaces.map((m) => ({ name: m.name, value: m.quantity, iconNumber: m.iconNumber }))
        : []
    };

    load(updateProjectBrief(project._id, payload)).then(() => {
      displaySuccess('Updated Successfuly');
      /** onSuccess */
      const updateProject: ProfessionalBrief | Brief = {
        ...project,
        ...payload
      };
      const newProjects = data.map((one) => (one._id === project._id ? updateProject : one));
      handleContext('data', newProjects);
      //
      setMainFacilities([
        {
          icon: bedroom,
          label: 'Bedrooms',
          value: formData.numberOfBedrooms
        },
        {
          icon: livingroom,
          label: 'Living Room',
          value: formData.numberOfLivingRooms
        },
        {
          icon: diningroom,
          label: 'Dining Room',
          value: formData.numberOfDiningRooms
        },
        {
          icon: numberOfToilets,
          label: 'Toilet / Bathroom',
          value: formData.numberOfToilets
        },
        {
          icon: numberOfKitchens,
          label: 'Kitchen',
          value: formData.numberOfKitchens
        },
        {
          icon: bedroom,
          label: 'Store',
          value: formData.numberOfStorage
        }
      ]);
      // close modal
      toggleEditing();
    });
  });

  const handleAddFacility: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    if (newFacility) {
      /** check if a mainFacilities doesn;t already exists */
      const exists = allFacilities.find((one) => one.toLowerCase() === newFacility.toLowerCase());

      if (exists) return displayError('Facility already exists');

      setFacilities((prev) => [...prev, newFacility]);
      /** Reset Facility */
      setNewFacility('');
    }
  };

  const handleFacilityRemoval = (val: string) => {
    setFacilities((prev) => prev.filter((one) => one !== val));
    /** Reset Facility */
  };

  // let isAddDisabled = !(spaces.name && spaces.quantity);
  const ModalForm = (
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
            initialList={commercialSpaces}
            onListChange={(x) => {
              setSpaces(x);
            }}
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
          className={flexer + `cursor-pointer hover:opacity-90 ${isCommercial ? 'invisible' : ''}`}>
          <HiPlus className="text-borange" />
          <span className="text-borange ml-1">Add Facility</span>
        </div>
        <Button
          text="Update"
          className="w-1/3"
          isLoading={isLoading}
          type={isValid || (isCommercial && spaces.length > 0) ? 'primary' : 'muted'}
        />
      </div>
    </form>
  );

  const FacilityModal = (
    <div className="w-11/12 lg:w-2/5 p-6 rounded-lg bg-white relative z-10">
      <div className={flexer}>
        <div />
        <span className="text-borange text-sm cursor-pointer" onClick={_toggleEditing}>
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

  return (
    <>
      <Modal visible={true} toggle={_toggleEditing}>
        {showFacilities ? FacilityModal : ModalForm}
      </Modal>
    </>
  );
};

const FacilityRefactored = () => {
  const { isProfessional } = useRole();
  const { handleContext, data, selectedProject: project } = useContext(StoreContext);
  const [isEditing, setEditing] = useState(false);
  const [showFacilities, setShowFacilities] = useState(false);
  const [allFacilities, setFacilities] = useState<string[]>(project.otherSpaces);
  const [mainFacilities, setMainFacilities] = useState<{ icon: any; label: string; value: any }[]>(
    []
  );
  let className = '';
  const isCommercial = useMemo(() => {
    return project.projectType === 'commercial';
  }, [project, data]);
  useEffect(() => {
    setMainFacilities([
      {
        icon: bedroom,
        label: 'Bedrooms',
        value: project?.numberOfBedrooms
      },
      {
        icon: livingroom,
        label: 'Living Room',
        value: project?.numberOfLivingRooms
      },
      {
        icon: diningroom,
        label: 'Dining Room',
        value: project?.numberOfDiningRooms
      },
      {
        icon: numberOfToilets,
        label: 'Toilet / Bathroom',
        value: project?.numberOfBaths
      },
      {
        icon: numberOfKitchens,
        label: 'Kitchen',
        value: project?.numberOfKitchens
      },
      {
        icon: bedroom,
        label: 'Store',
        value: project?.numberOfStorage
      }
    ]);
    setFacilities(project.otherSpaces);
  }, [project, showFacilities, isEditing, data]);
  const toggleEditing = () => {
    setEditing(!isEditing);
  };
  return (
    <div
      className={
        'w-full flex flex-col justify-between xl:flex-row rounded-lg mt-10 bg-white px-8  sm:px-12 py-8 ' +
        className
      }>
      <Title title={isCommercial ? 'Spaces' : 'Facilities'} description="" />
      <div className="ml-0 md:ml-5 grid md:justify-end mt-6 md:mt-0 ">
        {!isProfessional && (
          <div className="flex justify-end w-full mb-4 ">
            <div onClick={toggleEditing} className="bg-gray-200 p-2 rounded-full cursor-pointer">
              <HiOutlinePencilAlt className="text-gray-500" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 p-1 max-h-80 w-full overflow-y-scroll">
          {isCommercial ? (
            <>
              {React.Children.toArray(
                project?.commercialSpaces?.map((m) => (
                  <Facility icon={bedroom} value={m.value} label={m.name} />
                )) || []
              )}
            </>
          ) : (
            <>
              {React.Children.toArray(
                mainFacilities?.map((m) => (
                  <Facility icon={m.icon} value={m.value} label={m.label} />
                ))
              )}
              {React.Children.toArray(
                allFacilities?.map((one) => <Facility icon={bedroom} value={'1'} label={one} />)
              )}
            </>
          )}
        </div>
      </div>
      {isEditing && <Facilities toggleEditing={toggleEditing} className={className} />}
    </div>
  );
};
export { FacilityRefactored };
export default Facilities;
