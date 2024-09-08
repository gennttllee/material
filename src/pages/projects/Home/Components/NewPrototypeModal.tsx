import Button from 'components/shared/Button/Button';
import TextArea from 'components/shared/TextArea/TextArea';
import InputField from 'components/shared/InputField/InputField';
import Modal, { ModalProps } from 'components/shared/Modal/Modal';
import { TbArmchair, TbBath, TbBed, TbCar, TbNotebook } from 'react-icons/tb';
import { MdOutlineLocalDining, MdOutlineTableBar } from 'react-icons/md';
import { centered, errorStyle, flexer, hoverFade } from 'constants/globalStyles';
import { TbArrowLeft, TbMinus, TbPlus } from 'react-icons/tb';
import placeholder from '../../../../assets/placeholder.svg';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { RxBoxModel } from 'react-icons/rx';
import { Controller, useForm } from 'react-hook-form';
import { IconType } from 'react-icons';
import SelectField, { TOption } from 'components/shared/SelectField/SelectField';
import NumericInput from 'components/shared/NumericInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { protoTypeFacilitySchema, newProtoTypeSchema } from 'validation/prototype';
import { createProtoType, editProtoType } from 'apis/prototypes';
import { GetDownloadSignedUrls } from 'apis/AwsFiles';
import { currencies } from '../../../../constants';
import { uploadToAws } from 'helpers/uploader';
import useFetch from 'Hooks/useFetch';
import { displayError } from 'Utils';
import { Prototype } from 'types';

interface Form {
  name: string;
  type: string;
  desc: string;
  rooms: number;
  currency: string;
  images: TImage[];
  floorArea: number;
  defaultUnitOfMeasurement: string;
  facilities: Facility[];
}

interface FacilityForm {
  name: string;
  count: number;
}

type Facility = FacilityForm & {
  isDefault: boolean;
  Icon?: IconType;
};

type TImage = {
  path?: string;
  url?: string;
  file?: File;
};

export enum ResidentialType {
  Duplex = 'duplex',
  Bungalow = 'bungalow',
  TownHouse = 'townhouse',
  Other = 'other'
}

const buildingOPtions: TOption[] = Object.entries(ResidentialType).map(([key, value]) => ({
  label: key,
  value: value
}));

const initialFacilities = [
  {
    count: 1,
    Icon: TbBed,
    name: 'BedRoom',
    isDefault: true
  },
  {
    count: 1,
    name: 'KitChen',
    isDefault: true,
    Icon: MdOutlineLocalDining
  },
  {
    count: 1,
    name: 'Living Room',
    Icon: TbArmchair,
    isDefault: true
  },
  {
    count: 1,
    Icon: TbBath,
    isDefault: true,
    name: 'Toilet/Bathroom'
  },
  {
    count: 1,
    isDefault: true,
    name: 'Dining Room',
    Icon: MdOutlineTableBar
  },
  {
    count: 1,
    name: 'Store',
    Icon: RxBoxModel,
    isDefault: false
  },
  {
    count: 1,
    Icon: TbCar,
    name: 'Garage',
    isDefault: false
  },
  {
    count: 1,
    name: 'Study',
    Icon: TbNotebook,
    isDefault: false
  }
];

const initialForm: Form = {
  name: '',
  type: '',
  rooms: 0,
  desc: '',
  currency: '',
  floorArea: 0,
  defaultUnitOfMeasurement: '',
  facilities: initialFacilities,
  images: []
};

interface _Modal extends ModalProps {
  addPrototype: (prototype: Prototype) => void;
  initialValue?: Prototype;
}

export default function NewPrototypeModal(props: _Modal) {
  const { toggle, visible } = props;
  const [showModal, setModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultValues = useMemo(() => {
    if (props.initialValue) {
      return {
        name: props.initialValue.projectName,
        type: props.initialValue.projectType,
        rooms: props.initialValue.numberOfRooms,
        desc: props.initialValue.description,
        floorArea: props.initialValue.floorArea,
        defaultUnitOfMeasurement: props.initialValue.unitOfMeasurement,
        facilities: [
          {
            count: props.initialValue.numberOfBedRooms,
            Icon: TbBed,
            name: 'BedRoom',
            isDefault: true
          },
          {
            count: props.initialValue.numberOfKitchens,
            name: 'KitChen',
            isDefault: true,
            Icon: MdOutlineLocalDining
          },
          {
            count: props.initialValue.numberOfLivingRooms,
            name: 'Living Room',
            Icon: TbArmchair,
            isDefault: true
          },
          {
            count: props.initialValue.numberOfToilets,
            Icon: TbBath,
            isDefault: true,
            name: 'Toilet/Bathroom'
          },
          {
            count: props.initialValue.numberOfDiningRooms,
            isDefault: true,
            name: 'Dining Room',
            Icon: MdOutlineTableBar
          },
          {
            count: props.initialValue.numberOfStorage,
            name: 'Store',
            Icon: RxBoxModel,
            isDefault: false
          },
          ...props.initialValue.otherSpaces.map(({ name, number }) => ({
            name,
            count: number
          }))
        ],
        images: []
      };
    } else {
      return initialForm;
    }
  }, [props.initialValue]);

  const {
    watch,
    control,
    register,
    setValue,
    setError,
    getValues,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(newProtoTypeSchema)
  });

  useEffect(() => {
    (async () => {
      if (props.initialValue) {
        const images: Form['images'] = [];

        for (let { key } of props.initialValue.prototypeImages) {
          const res = await GetDownloadSignedUrls(key);
          if (res.data) {
            images.push({ url: res.data.url, path: key });
          }
        }

        setValue('images', images);
      }
    })();
  }, [props]);

  const {
    reset: resetFacilityForm,
    register: facilityRegister,
    handleSubmit: submitFacility,
    formState: { errors: FacilityErrors }
  } = useForm<FacilityForm>({
    shouldFocusError: true,
    reValidateMode: 'onChange',
    defaultValues: initialForm,
    resolver: yupResolver(protoTypeFacilitySchema)
  });

  const { isLoading, setLoader, success } = useFetch();

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const submitFacilityForm = submitFacility(({ name, count }) => {
    const facilities = getValues('facilities');
    setValue('facilities', [...facilities, { name, count, isDefault: false }]);
    resetFacilityForm();
    toggleModal();
  });

  const submitPrototype = handleSubmit(async (data) => {
    setLoader(true);
    // 1. upload images
    const prototypeImages: { key: string; meta: {} }[] = [];

    const images = getValues('images');
    for (const image of images) {
      if (image.url) {
        prototypeImages.push({
          key: image.path as string,
          meta: props.initialValue?.prototypeImages.find((one) => one.key === image.path)
            ?.meta as {}
        });
      } else {
        const imageKey = await uploadToAws({ value: image.file });

        if (!imageKey || !image.file) {
          // if value key is null
          setLoader(false);
          return displayError('An error occured');
        }

        prototypeImages.push({
          key: imageKey,
          meta: {
            name: image.file.name,
            size: image.file.size,
            type: image.file.type
          }
        });
      }
    }

    const isNotOneOf = (facility: string) => {
      return (
        facility !== 'BedRoom' &&
        facility !== 'Living Room' &&
        facility !== 'Dining Room' &&
        facility !== 'Toilet/Bathroom' &&
        facility !== 'KitChen' &&
        facility !== 'Store'
      );
    };

    // 2. prepare the payload
    const payload = {
      projectName: data.name,
      projectType: data.type,
      numberOfRooms: data.rooms,
      floorArea: data.floorArea,
      unitOfMeasurement: data.defaultUnitOfMeasurement,
      numberOfBedRooms: data.facilities.find((one) => one.name === 'BedRoom')?.count,
      numberOfLivingRooms: data.facilities.find((one) => one.name === 'Living Room')?.count,
      numberOfDiningRooms: data.facilities.find((one) => one.name === 'Dining Room')?.count,
      numberOfToilets: data.facilities.find((one) => one.name === 'Toilet/Bathroom')?.count,
      numberOfKitchens: data.facilities.find((one) => one.name === 'KitChen')?.count,
      numberOfStorage: data.facilities.find((one) => one.name === 'Store')?.count,
      description: data.desc,
      otherSpaces: data.facilities
        .filter((one) => isNotOneOf(one.name))
        .map(({ name, count }) => ({ name, number: count })),
      prototypeImages
    };

    // 3. prototype ops
    if (props.initialValue) {
      editProtoType<Prototype[]>(props.initialValue._id, payload).then((res) => {
        if (res.status === 200) {
          props.addPrototype(res.data[0]);
        }
      });
    } else {
      createProtoType<Prototype>(payload)
        .then((res) => {
          if (res.status === 201) {
            props.addPrototype(res.data);
          }
        })
        .finally(() => setLoader(false));
    }
  });

  const Section = ({
    title,
    Children,
    description
  }: {
    title: string;
    description: string;
    Children?: ReactNode;
  }) => (
    <section className="flex justify-between flex-col md:flex-row px-6 md:px-14 py-10 h-fit w-full relative">
      <div className="w-full md:w-[45%] mb-3 md:mb-0">
        <p className="font-semibold text-2xl text-center">{title}</p>
        <p className="text-bash text-base mt-3 text-justify">{description}</p>
      </div>
      <div className="w-full md:w-1/2">{Children}</div>
      <div className="w-full border-t absolute bottom-0 right-0" />
    </section>
  );

  const ChildOne = (
    <form>
      <InputField
        label="Name of project"
        register={register('name')}
        error={errors.name?.message}
        placeholder="3 Bedroom semi detached Duplex"
      />
      <div className="flex">
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange } }) => (
            <SelectField
              label="Building Type"
              data={buildingOPtions}
              error={errors.type?.message}
              {...{ value, onChange }}
            />
          )}
        />

        <div className="mx-2 md:mx-5" />
        <NumericInput
          type="number"
          placeholder="e.g 3"
          label="Number of Rooms"
          register={register('rooms')}
          error={errors.rooms?.message}
        />
      </div>
      <div className="flex">
        <NumericInput
          type="number"
          label="Floor area"
          placeholder="e.g 100"
          register={register('floorArea')}
          error={errors.floorArea?.message}
        />
        <div className="mx-2 md:mx-5" />
        <Controller
          control={control}
          name="defaultUnitOfMeasurement"
          render={({ field: { value, onChange } }) => (
            <SelectField
              placeholder="choose"
              {...{ value, onChange }}
              label="Unit of measurement"
              error={errors.defaultUnitOfMeasurement?.message}
              data={['sqft', 'sqm'].map((one) => ({
                value: one
              }))}
            />
          )}
        />
      </div>
      <Controller
        name="currency"
        control={control}
        render={({ field: { value, onChange } }) => (
          <SelectField
            showSearch
            label="Currency"
            data={currencies}
            {...{ value, onChange }}
            error={errors.currency?.message}
          />
        )}
      />
      <TextArea
        register={register('desc')}
        error={errors.desc?.message}
        wrapperClassName="min-h-[100px]"
        label="About the prototype (brief description)"
        className="min-h-[100px] w-full rounded outline-none p-2"
      />
    </form>
  );

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files) {
      const paths: TImage[] = [];

      for (let i = 0; i < ev.target.files.length; i++) {
        const file = ev.target.files[i];
        paths.push({
          file,
          url: '',
          path: URL.createObjectURL(file)
        });
      }
      const images = getValues('images');
      setValue('images', [...images, ...paths]);
      setError('images', { message: undefined });
    }
  };

  const handleImage = (path: string) => {
    const images = getValues('images');
    const newImages = images.filter((one) => one.path !== path);
    setValue('images', newImages);
    if (!newImages[0])
      setError('images', {
        message: 'images field must have at least 1 items',
        type: 'min'
      });
  };

  const ChildTwo = (
    <>
      <p className="font-Medium text-sm text-bash">Prototype Images (Upload at least 2 images)</p>
      <div className="grid grid-cols-3 gap-6 mt-2 w-fit relative">
        <div
          className={'rounded bg-pbg flex-col h-[120px] w-[140px]' + centered + hoverFade}
          onClick={() => {
            inputRef.current?.click();
          }}>
          <input
            multiple
            type="file"
            ref={inputRef}
            accept="image/*"
            className="hidden"
            onChange={handleInput}
          />
          <img
            alt=""
            loading="lazy"
            decoding="async"
            src={placeholder}
            className="w-[33px] mb-4 h-[33px]"
          />
          <p className="text-bblue text-sm font-Medium">Click to upload</p>
        </div>
        {React.Children.toArray(
          watch('images').map(({ path, url }) => (
            <div className="h-[120px] w-[140px] bg-pbg rounded overflow-hidden relative">
              <div
                className="absolute top-1 right-1"
                onClick={() => {
                  if (path || url) handleImage(path || url || '');
                }}>
                <IoCloseCircleSharp className={hoverFade + 'text-bred shadow text-base ml-1'} />
              </div>
              <img
                alt=""
                loading="lazy"
                src={url || path}
                className="w-full h-full object-cover object-top rounded"
                decoding="async"
              />
            </div>
          ))
        )}
        <div className="absolute top-full left-0">
          <p className={errorStyle}>{errors.images?.message}</p>
        </div>
      </div>
    </>
  );

  const handleFacility = ({ name, count, isDefault }: Facility, type: 'mutate' | 'delete') => {
    const facilities = getValues('facilities');
    const newFacilities =
      type === 'mutate'
        ? facilities.map((one) => (one.name === name ? { ...one, name, count, isDefault } : one))
        : facilities.filter((one) => one.name !== name);

    setValue('facilities', newFacilities);
  };

  const ChildThree = (
    <>
      <p className="font-Medium text-sm text-bash">Facilities</p>
      <div className="flex flex-wrap gap-4 mt-4 items-center max-w-full">
        {React.Children.toArray(
          watch('facilities').map(({ name, count, Icon, isDefault }) => (
            <div className="flex items-center">
              <div className={flexer + `border px-3 py-2 rounded-full w-fit`}>
                {!Icon ? null : <Icon className="text-ashShade-2 text-lg mr-2" />}
                <p className={`whitespace-nowrap capitalize text-sm font-Medium`}>{name}</p>
                <div className={flexer + `text-bash text-base ml-1`}>
                  <TbMinus
                    className={`${!count ? 'opacity-30' : 'hover:text-black'} cursor-pointer`}
                    onClick={() => {
                      if (count)
                        handleFacility(
                          {
                            name,
                            count: count - 1,
                            isDefault
                          },
                          'mutate'
                        );
                    }}
                  />
                  <p className="mx-2">{count}</p>
                  <TbPlus
                    className="hover:text-black cursor-pointer"
                    onClick={() => {
                      handleFacility({ name, count: count + 1, isDefault }, 'mutate');
                    }}
                  />
                </div>
              </div>
              {!isDefault && (
                <IoCloseCircleSharp
                  className={hoverFade + 'text-bash text-base ml-1'}
                  onClick={() => {
                    handleFacility({ name, count, isDefault }, 'delete');
                  }}
                />
              )}
            </div>
          ))
        )}
        <div
          onClick={toggleModal}
          className={
            flexer +
            `border border-bblue text-bblue
             px-3 py-2 rounded-full w-fit`
          }>
          <p className="whitespace-nowrap cursor-pointer text-sm font-Medium">Add Facility</p>
          <TbPlus className="cursor-pointer ml-1" />
        </div>
      </div>
    </>
  );

  const ModalView = (
    <div className="bg-white max-w-5xl p-6 rounded z-10 w-[495px]">
      <div className={flexer}>
        <p className="font-semibold font-base">Add facility</p>
        <button className="font-Medium text-bash font-sm" onClick={toggleModal}>
          Close
        </button>
      </div>
      <form onSubmit={submitFacilityForm}>
        <InputField
          label="Title"
          placeholder="e.g Garage"
          error={FacilityErrors.name?.message}
          register={facilityRegister('name')}
        />
        <NumericInput
          type="number"
          label="Number"
          placeholder="e.g 1"
          register={facilityRegister('count')}
          error={FacilityErrors.count?.message}
        />
        <div className="flex justify-end mt-6">
          <div className="mr-auto" />
          <Button text="Cancel" type="secondary" btnType="button" onClick={toggle} />
          <Button text="Add facility" className="ml-5" />
        </div>
      </form>
    </div>
  );

  if (!visible) return <></>;

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-[#FFFFFF] flex flex-col z-20 ">
      <header className="container pt-10 pb-5 max-w-[calc(90%)] 2xl:max-w-[1184px] mx-auto">
        <div
          onClick={toggle}
          className="hover:text-black text-bash font-Medium text-base flex items-center cursor-pointer w-fit">
          <TbArrowLeft />
          <p className="ml-2">Back</p>
        </div>
        <p className="font-semibold text-2xl px-2 md:px-14 mt-5">Create Prototype</p>
      </header>
      <div className="w-full border-t" />
      <div className="container flex-1 overflow-y-scroll max-w-[calc(100%)] md:max-w-[calc(90%)]  2xl:max-w-[1184px] mx-auto">
        <Section
          title="Description"
          description="It's important to write a clear and concise description that accurately reflects the property. A good description can help potential buyers understand the property's features and decide whether it's right for them.
                Be sure to use descriptive language and avoid vague or overly technical terms. A well-written description can make all the difference in attracting interested parties and ultimately closing a deal."
          Children={ChildOne}
        />
        <Section
          title="Upload images"
          description="Don't forget to upload high-quality images of your prototypes! Potential clients want to see clear, detailed photos that accurately represent the property's features. Good images can make a huge difference in attracting interest and closing a deal."
          Children={ChildTwo}
        />
        <Section
          title="Select Facilities"
          description="Update or add facilities that match the design that you are showcasing."
          Children={ChildThree}
        />
        <div className="flex justify-end px-14 py-10">
          <Button text="Cancel" type="secondary" onClick={toggle} />
          <Button
            className="ml-5"
            text="Publish Prototype"
            onClick={submitPrototype}
            {...{ isLoading, success }}
          />
        </div>
        <div className="my-24" />
      </div>
      <Modal visible={showModal} toggle={toggleModal}>
        {ModalView}
      </Modal>
    </div>
  );
}
