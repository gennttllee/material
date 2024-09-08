import * as Yup from 'yup';
import { useFormik } from 'formik';
import logo from '../../assets/bnklelogo.svg';
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../../components/shared/PasswordInput';
import InputField from '../../components/shared/InputField';
import Button from '../../components/shared/Button';
import useFetch from 'Hooks/useFetch';
import { loginAPI } from 'apis/user';

let schema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('This field is required'),
  password: Yup.string()
    .required('Please input password')
    .min(4, 'The minimum password length is 4')
});

const Index = () => {
  const navigate = useNavigate();
  const { load, isLoading } = useFetch<{ token: string; role: string }>();

  const submit = async (data: any) => {
    const payload = { ...data, type: undefined };

    load(loginAPI(payload)).then(async (res) => {
      /** checking the role before saving token */
      await Promise.resolve(localStorage.setItem('token', res.data.token));
      await Promise.resolve(localStorage.setItem('role', res.data.role));
      await new Promise((res, _) => {
        const id = setTimeout(() => {
          res(() => clearTimeout(id));
        }, 1000);
      });

      navigate(`/projects?token=${res.data.token}`);
    });
  };

  const formik = useFormik({
    initialValues: {
      password: '',
      email: '',
      type: ''
    },
    validationSchema: schema,
    onSubmit: (val) => submit(val)
  });

  return (
    <div className=" w-screen  p-6 h-screen flex-col flex justify-center  overflow-y-auto">
      <img loading="lazy" decoding="async" src={logo} className="w-20 self-center  " alt="" />
      {process.env.REACT_APP_IS_LOCAL && process.env.REACT_APP_IS_LOCAL === 'true' ? (
        <div className=" mt-10 p-3 relative self-center rounded-lg w-full lg:w-1/3 border">
          <form onSubmit={formik.handleSubmit}>
            <InputField
              label="Email"
              id="Login_username"
              placeholder="tim@example.com"
              onChange={formik.handleChange('email')}
              onBlur={formik.handleBlur('email')}
              value={formik.values.email}
              error={formik.errors.email}
            />
            <PasswordInput
              label="Password"
              id="Login_password"
              placeholder="••••••••••••"
              onChange={formik.handleChange('password')}
              onBlur={formik.handleBlur('password')}
              value={formik.values.password}
              error={formik.errors.password}
            />
            <Button text="Sign In" id="Login_button" {...{ isLoading }} className="w-full mt-5" />
          </form>
        </div>
      ) : (
        <div className=" mt-4 mb-3 self-center flex flex-col items-center p-4">
          <h1 className="my-20 text-3xl text-bborder">You are not Authenticated</h1>
          <p>
            <a
              href={`${process.env.REACT_APP_AUTH_URL}signin`}
              className="underline hover:text-bblue ">
              Signin here
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Index;
