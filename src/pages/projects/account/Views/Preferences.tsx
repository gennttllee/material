import React, { useMemo, useState } from 'react';
import useRole, { UserRoles } from 'Hooks/useRole';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Button from '../../../../components/shared/Button';
import { flexer } from '../../../../constants/globalStyles';
import { preferencesSchema } from '../../../../validation/account';
import SelectField from '../../../../components/shared/SelectField';
import LabelPicker from '../../../../components/shared/LabelPicker';
import useFetch from 'Hooks/useFetch';
import { updateUserPreferences } from 'apis/user';
import { useAppDispatch } from 'store/hooks';
import { User } from 'types';
import { setUser } from 'store/slices/userSlice';

interface Form {
  unitOfMeasurement: string;
  weekDaysOff: string[];
}

export default function Preferences() {
  const dispatch = useAppDispatch();
  const { isOfType, user } = useRole();
  const [hasChanges, setChanges] = useState(false);

  const { load, isLoading, success, setSuccess } = useFetch<User[]>({
    onSuccess: (response) => {
      const id = setTimeout(() => {
        setSuccess(false);
        setChanges(false);
        dispatch(setUser({ ...response[0], role: user.role }));
        clearTimeout(id);
      }, 500);
    }
  });

  const defaultValues = useMemo(
    () => ({
      unitOfMeasurement: user.unitOfMeasurement,
      weekDaysOff: user.inactiveDays?.map(({ day }) => day)
    }),
    [user]
  );

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(preferencesSchema(isOfType(UserRoles.Contractor)))
  });

  const submitHandler = handleSubmit((preferences) => {
    // code here
    const payload = {
      unitOfMeasurement: preferences.unitOfMeasurement,
      inactiveDays: preferences.weekDaysOff ? preferences.weekDaysOff.map((day) => ({ day })) : []
    };
    load(updateUserPreferences(payload));
  });

  return (
    <div className="h-full w-full flex">
      <form
        onSubmit={submitHandler}
        className="bg-white py-6 px-7 w-full md:w-2/5 h-fit rounded-md">
        <h2 className="font-Medium text-xl mb-5">Preferences</h2>
        <Controller
          {...{ control }}
          name="unitOfMeasurement"
          render={({ field: { onChange, value } }) => (
            <SelectField
              value={value}
              placeholder="Select unit"
              label="Unit of measurement"
              error={errors.unitOfMeasurement?.message}
              onChange={(val: string) => {
                if (!hasChanges) setChanges(true);
                onChange(val);
              }}
              data={[
                { label: 'Metrics (sqm)', value: 'metric' },
                { label: 'Imperial (ft)', value: 'imperial' }
              ]}
            />
          )}
        />
        {isOfType(UserRoles.Contractor) ? (
          <Controller
            {...{ control }}
            name="weekDaysOff"
            render={({ field: { onChange, value } }) => (
              <LabelPicker
                className="mt-6"
                {...{ value }}
                onChange={(val) => {
                  if (!hasChanges) setChanges(true);
                  onChange(val);
                }}
                placeholder="Select days"
                label="Weekdays off (max 3)"
                error={errors.weekDaysOff?.message}
                data={[
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                  'Sunday'
                ]}
              />
            )}
          />
        ) : null}
        <div className={flexer}>
          <div />
          <Button
            text="Save Changes"
            onClick={submitHandler}
            {...{ isLoading, success }}
            className="mt-7 w-full md:w-auto"
            type={hasChanges ? 'primary' : 'muted'}
          />
        </div>
      </form>
    </div>
  );
}
