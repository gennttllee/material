import { useEffect, useState } from 'react';
import { displayError } from 'Utils';
import { Response } from '../helpers/fetcher';

interface FetchProps<T> {
  initialData?: T;
  showDisplayError?: boolean;
  initialLoading?: boolean;
  storeWholeResponse?: boolean;
  onSuccess?: (data: T) => void;
  onLoadRequest?: Promise<Response<T>>;
}

const useFetch = <T = any | undefined>(props?: FetchProps<T>) => {
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<number>();
  const [usageCount, setUsageCount] = useState(0);
  const [successResponse, setSuccessResponse] = useState<T | undefined>(props?.initialData);
  const [isLoading, setLoader] = useState(
    props?.initialLoading === undefined ? false : props.initialLoading
  );
  // show video
  const showDisplayError = props?.showDisplayError === undefined ? true : props.showDisplayError;

  useEffect(() => {
    // run the a callback on success
    if (successResponse && props && props.onSuccess) props.onSuccess(successResponse);
  }, [successResponse]);

  useEffect(() => {
    if (props?.onLoadRequest && !usageCount) {
      load(props.onLoadRequest);
    }
  }, [usageCount]);

  const clearError = () => {
    if (error) setError('');
  };

  const load = async (aPromise: Promise<Response<T>>) => {
    setLoader(true);
    clearError();
    return aPromise
      .then((res) => {
        if (String(res.status).startsWith('2')) {
          setSuccess(true);
          setSuccessResponse(props?.storeWholeResponse ? (res as T) : res.data);
        }
        return res;
      })
      .catch((er: Response) => {
        setStatus(er.status);
        setSuccessResponse(undefined);

        if (er.data) {
          setSuccessResponse(er.data);
        }
        if (er.message) {
          if (showDisplayError) {
            displayError(er.message);
          }
          setError(er.message);
          throw new Error(er.message || '');
        } else {
          if (showDisplayError) {
            displayError(er.error);
          }
          setError(er.error);
          throw new Error(er.error);
        }
      })
      .finally(() => {
        setUsageCount((prev) => prev + 1);
        setLoader(false);
      });
  };

  const refetch = () => {
    if (props?.onLoadRequest) load(props.onLoadRequest);
  };

  return {
    load,
    error,
    status,
    success,
    refetch,
    setError,
    setLoader,
    isLoading,
    usageCount,
    clearError,
    setSuccess,
    setUsageCount,
    successResponse,
    setSuccessResponse
  } as const;
};

export default useFetch;
