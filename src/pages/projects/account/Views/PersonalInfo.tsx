import {
  centered,
  errorStyle,
  flexer,
  responsiveFlex,
  spacer
} from '../../../../constants/globalStyles';
import Button from '../../../../components/shared/Button';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { personalInfoSchema } from '../../../../validation/account';
import InputField from 'components/shared/InputField/InputField';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useEffect, useMemo, useState } from 'react';
import useFetch from 'Hooks/useFetch';
import { Country } from 'react-app-env';
import { getAllCountries, getCities, getStates } from 'apis/countries';
import SelectField from 'components/shared/SelectField';
import { TOption } from 'components/shared/SelectField/SelectField';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { updateUserProfile } from 'apis/user';
import useRole, { UserRoles } from 'Hooks/useRole';
import ImagePicker from 'components/shared/ImagePicker';
import { uploadToAws } from 'helpers/uploader';
import { BucketNames } from '../../../../constants';
import useUserDetails from 'Hooks/useUserDetails';

interface Form {
  companyName?: string;
  phoneNumber: string;
  firstName?: string;
  lastName?: string;
  country: string;
  state: string;
  city: string;
}

const PersonalInfo = () => {
  let { getUserDetails } = useUserDetails();
  const [hasFormChanged, setHasFormChanged] = useState(false);
  const { user } = useAppSelector((state) => state);
  const { isProfessional, isOfType } = useRole();
  const [userLogo, setUserLogo] = useState<string | File | undefined>(user.logo);
  const {
    load: loadCities,
    successResponse: cities,
    usageCount: CityAPICount,
    isLoading: areCitiesLoading
  } = useFetch<string[]>({
    initialData: []
  });
  const {
    successResponse: StatesRes,
    isLoading: areStateLoading,
    usageCount: StateAPICount,
    load: loadStates
  } = useFetch<{
    states: { name: string; state_code: string }[];
  }>({
    initialData: { states: [] }
  });
  const {
    load: loadCountries,
    successResponse: allCountries,
    isLoading: areCountriesLoading
  } = useFetch<{ [key: number]: Country }>({
    storeWholeResponse: true
  });

  const { isLoading, setLoader } = useFetch();
  const { load, success } = useFetch({
    onSuccess: () => {
      setHasFormChanged(false);
    }
  });

  const defaultValues = useMemo(
    () => ({
      lastName: user.lastName || user.name.split(' ')[1],
      firstName: user.firstName || user.name.split(' ')[0],
      phoneNumber: user.phoneNumber,
      companyName: user.companyName,
      country: user.country || '',
      state: user.state || '',
      city: user.city || '',
      logo: user.logo || ''
    }),
    [user]
  );

  const {
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(
      personalInfoSchema({
        requireState: StateAPICount > 0 && !StatesRes ? false : true,
        requireCity: CityAPICount > 0 && !cities ? false : true
      })
    )
  });

  const country = watch('country');

  useEffect(() => {
    loadCountries(getAllCountries());

    if (user.country) {
      loadStates(getStates(user.country));
      if (user.state) loadCities(getCities({ country: user.country, state: user.state }));
    }
  }, []);

  const cca2 = useMemo(() => {
    if (!allCountries || !country) return 'ng';

    const hasAmatch = Object.values(allCountries).find(
      (one) =>
        country ===
        (one.name?.common ||
          one.name?.official ||
          one.name?.nativeName['0'].common ||
          one.name?.nativeName['0'].official)
    );

    if (hasAmatch) return hasAmatch.cca2.toLowerCase();
    return 'ng';
  }, [country]);

  const countries = useMemo(() => {
    if (!allCountries) return [];

    const temp = Object.values(allCountries)
      .map((country) => ({
        value:
          country.name?.common ||
          country.name?.official ||
          country.name?.nativeName['0'].common ||
          country.name?.nativeName['0'].official,
        icon: country.flag
      }))
      .sort((a, b) => (a.value || '').localeCompare(b.value));

    let data: TOption[] = [];

    for (const country of temp) {
      if (!country.value) continue;
      if (country.value.toLocaleLowerCase() === 'nigeria') {
        // puts nigeria at the first position
        data = [country, ...data];
      } else {
        data.push(country);
      }
    }

    return data;
  }, [allCountries]);
  const submitHandler = handleSubmit(async (data) => {
    let imageKey: string | null = null;

    setLoader(true);

    if (userLogo && typeof userLogo !== 'string') {
      imageKey = await uploadToAws({ value: userLogo, bucketName: BucketNames[1] });
    }
    // code here
    const payload = isProfessional
      ? {
          ...data,
          firstName: undefined,
          lastName: undefined,
          name: `${data.firstName} ${data.lastName}`
        }
      : { ...data, logo: imageKey || user.logo, photo: undefined };
    setHasFormChanged(false);
    load(updateUserProfile(user._id, payload))
      .then((e) => {
        getUserDetails();
      })
      .finally(() => setLoader(false));
  });

  const stateData = useMemo(() => {
    return StatesRes
      ? StatesRes.states
          .map((one) => ({ value: one.name }))
          .sort((a, b) => a.value.localeCompare(b.value))
      : [];
  }, [StatesRes?.states]);

  const CitiesData = useMemo(() => {
    return cities
      ? cities?.map((one) => ({ value: one })).sort((a, b) => a.value.localeCompare(b.value))
      : [];
  }, [cities]);

  return (
    <div className="h-full w-full flex">
      <form
        onSubmit={submitHandler}
        onChange={() => {
          if (!hasFormChanged) setHasFormChanged(true);
        }}
        className="bg-white py-6 px-7  h-fit rounded-md w-full md:w-fit">
        <h2 className="font-Medium text-xl text-center text-ashShade-4 mb-5">Personal info</h2>
        <div className={centered + `${isProfessional ? 'hidden' : ''}`}>
          <ImagePicker
            label=""
            value={userLogo}
            placeholder="Profile"
            onChange={(vl) => setUserLogo(vl)}
          />
        </div>
        <div className={responsiveFlex}>
          <InputField
            label="First Name"
            placeholder="John"
            register={register('firstName')}
            error={errors.firstName?.message}
          />
          <div className={spacer} />
          <InputField
            label="Last Name"
            placeholder="Doe"
            register={register('lastName')}
            error={errors.lastName?.message}
          />
        </div>

        {isOfType(UserRoles.Developer) ? (
          <InputField
            label="Company Name"
            placeholder="e.g Google"
            register={register('companyName')}
            error={errors.companyName?.message}
          />
        ) : null}

        <div className={responsiveFlex}>
          <SelectField
            showSearch
            value={country}
            label="Country"
            error={errors.country?.message}
            isLoading={areCountriesLoading}
            placeholder="Select your country"
            className="w-full md:!w-[200px]"
            onChange={(val) => {
              if (!hasFormChanged) setHasFormChanged(true);
              loadStates(getStates(val));
              setValue('country', val);
              setValue('state', '');
              setValue('city', '');
            }}
            data={countries}
          />
          <div className="spacer" />
          <Controller
            control={control}
            name="state"
            render={({ field: { value, onChange } }) => (
              <SelectField
                showSearch
                value={value}
                data={stateData}
                label="State/Province"
                isLoading={areStateLoading}
                error={errors.state?.message}
                disabled={!country || !StatesRes || !stateData[0]}
                className="w-full md:!w-[200px]"
                placeholder="Select your state / province"
                onChange={(val) => {
                  if (!hasFormChanged) setHasFormChanged(true);
                  loadCities(getCities({ country, state: val }));
                  onChange(val);
                  setValue('city', '');
                }}
              />
            )}
          />
        </div>
        <div className={responsiveFlex}>
          <Controller
            control={control}
            name="city"
            render={({ field: { value, onChange } }) => (
              <SelectField
                showSearch
                label="City"
                value={value}
                data={CitiesData}
                disabled={!watch('state') || !cities || !CitiesData[0]}
                isLoading={areCitiesLoading}
                error={errors.city?.message}
                placeholder="Select your city"
                className="w-full md:!w-[200px]"
                onChange={(val) => {
                  if (!hasFormChanged) setHasFormChanged(true);
                  onChange(val);
                }}
              />
            )}
          />
          <div className="spacer" />
          <div className="w-full md:!w-[200px] flex flex-col items-start">
            <label className="capitalize font-Medium text-bash text-sm mb-1">Phone number</label>
            <PhoneInput
              country={cca2}
              containerClass="w-full"
              value={watch('phoneNumber')}
              inputClass="!w-full !flex-1 !py-6 !border-bash"
              onChange={(phone: any) => {
                if (!hasFormChanged) setHasFormChanged(true);
                setValue('phoneNumber', phone);
              }}
            />
            <p className={errorStyle}>{errors.phoneNumber?.message}</p>
          </div>
        </div>
        <div className={responsiveFlex}>
          <div />
          <Button
            className="mt-7 w-full md:w-auto"
            {...{ isLoading }}
            text="Save Changes"
            onClick={submitHandler}
            success={success && !hasFormChanged}
            type={hasFormChanged ? 'primary' : 'muted'}
          />
        </div>
      </form>
    </div>
  );
};

export default PersonalInfo;
