import { displayError, displaySuccess } from 'Utils';
import { postForm } from 'apis/postForm';
import React from 'react';
import { useAppDispatch } from 'store/hooks';
import { setUser } from 'store/slices/userSlice';

const useUserDetails = (showtoast = false) => {
  let dispatch = useAppDispatch();

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
      if (showtoast) {
        displaySuccess('User details set successfully');
      }
    } else {
      displayError(e.message);
    }
  };
  return {
    getUserDetails
  };
};

export default useUserDetails;
