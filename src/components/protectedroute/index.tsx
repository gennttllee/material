import { ReactElement, useContext, useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { postForm } from '../../apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { setUser } from '../../store/slices/userSlice';
import logo from '../../assets/bnklelogo.svg';
import { StoreContext } from '../../context';

interface Props {
  children: ReactElement;
}
const Index = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const user = useAppSelector((s) => s.user);
  const { handleContext } = useContext(StoreContext);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  //
  const getUserDetails = async () => {
    let role = localStorage.getItem('role') || '';
    const baseUrl = ['contractor', 'consultant'].includes(role) ? 'professionals' : 'users';
    let { e, response } = await postForm('get', `${baseUrl}/get-details`, {}, 'iam');
    if (response) {
      let details = {
        ...response.data.data,
        role: await Promise.resolve(localStorage.getItem('role'))
      };
      dispatch(setUser(details));
      setSuccess(true);
      displaySuccess('User details set successfully');
    } else {
      displayError(e.message);
    }
    setFetching(false);
  };

  const getToken = () => {
    if (searchParams.get('role') && searchParams.get('token')) {
      setFetching(true);
      localStorage.setItem('token', searchParams.get('token') || '');
      localStorage.setItem('role', searchParams.get('role') || '');
    }
    handleContext('token', localStorage.getItem('token') || '');
  };

  useEffect(() => {
    getToken();
    getUserDetails();
    //eslint-disable-next-line
  }, []);

  return user && user._id ? (
    children
  ) : fetching ? (
    <div className="w-screen h-screen flex justify-center items-center">
      <img loading="lazy" decoding="async" src={logo} alt="" className="w-1/5 animate-ping" />
    </div>
  ) : success ? (
    children
  ) : (
    <Navigate
      to={`//${process.env.REACT_APP_AUTH_HELPER_URL}/signin?redirect=${window.location.href}`}
    />
  );
};

export default Index;
