import { ErrorOption, useForm } from 'react-hook-form';
import { flexer } from '../../../../constants/globalStyles';
import { resetPasswordSchema } from '../../../../validation/account';
import { changePasswordAPI, ResetPasswordPayload } from 'apis/user';
import PasswordInput from '../../../../components/shared/PasswordInput';
import { yupResolver } from '@hookform/resolvers/yup';
import useRole from '../../../../Hooks/useRole';
import Button from '../../../../components/shared/Button';
import { displaySuccess } from 'Utils';
import useFetch from 'Hooks/useFetch';

interface Passwords {
  newPassword: string;
  currentPassword: string;
  confirmPassword: string;
}

const intialState: Passwords = {
  confirmPassword: '',
  currentPassword: '',
  newPassword: ''
};

export default function Security() {
  const { isProfessional } = useRole();
  const { isLoading, load, success, setSuccess } = useFetch();

  const {
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Passwords>({
    reValidateMode: 'onChange',
    defaultValues: intialState,
    resolver: yupResolver(resetPasswordSchema)
  });

  const submitHandler = handleSubmit((creds) => {
    if (success) {
      return reset();
    }
    // code here
    if (creds.newPassword !== creds.confirmPassword) {
      const error: ErrorOption = {
        message: 'Should match the new password'
      };
      return setError('confirmPassword', error);
    }

    const payload: ResetPasswordPayload = {
      password: creds.newPassword,
      currentPassword: creds.currentPassword,
      persona: isProfessional ? 'professionals' : 'users'
    };

    load(changePasswordAPI(payload)).then((res) => {
      displaySuccess(res.message);
      const id = setTimeout(() => {
        reset();
        setSuccess(false);
        clearTimeout(id);
      }, 10000);
    });
  });

  return (
    <div className="h-full flex w-full">
      <form
        onSubmit={submitHandler}
        className="bg-white py-6 px-7 w-full sm:w-1/2 md:w-2/5 h-fit rounded-md">
        <h2 className="font-Medium text-xl">Change Password</h2>
        <PasswordInput
          label="Current Password"
          placeholder="••••••••••••"
          ContainerClassName="mt-6"
          register={register('currentPassword')}
          error={errors.currentPassword?.message}
        />
        <PasswordInput
          label="New Password"
          placeholder="••••••••••••"
          ContainerClassName="mt-6"
          register={register('newPassword')}
          error={errors.newPassword?.message}
        />
        <PasswordInput
          label="Re-type New Password"
          placeholder="••••••••••••"
          ContainerClassName="mt-6"
          register={register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
        <div className={flexer}>
          <div />
          <Button
            success={success}
            isLoading={isLoading}
            text="Update password"
            className="w-full sm:w-1/2 md:w-auto mt-7"
          />
        </div>
      </form>
    </div>
  );
}
