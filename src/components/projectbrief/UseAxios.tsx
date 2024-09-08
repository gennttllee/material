import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Prop {
  method: string;
  url: string;
  config?: any;
  requestobj: any;
}
let host = process.env.REACT_APP_API_PROJECTS;
let token = localStorage.getItem('token')
  ? localStorage.getItem('token')
  : 'f7fca480f11d415f37056ddcbbba8560++//++//++e86df9d98d3ee754e62323120964362e4f66a8cf8c75b7141547ee70916f050452225f8f358c93c02cfb6faac02e6e33f23ccba0383cf8a11068df5beccc11b4e4163dfb4b15a80487095cfe8796b3b936ed051b946257af5fd5cef2c765749a3920b2041dabb54b8fc8437931d91577edf8b4a896a5bb3f0883742dff0ffe1a1e8efa';

const UseAxios = ({ method, url, requestobj }: Prop) => {
  const [fetching, setFectching] = useState(false);
  const [err, setError] = useState<any>();
  const [response, setResponse] = useState<any>();
  let controller = new AbortController();
  let postForm = async () => {
    setFectching(true);
    try {
      let res: any =
        method.toLowerCase() === 'post'
          ? await axios.post<any>(
              host + url,
              { ...requestobj },
              {
                headers: {
                  Authorization: 'Bearer ' + token
                }
              }
            )
          : axios.get<any>(host || '');

      setResponse(res.data);
      setFectching(false);
    } catch (error: any) {
      setError(error);
      setFectching(false);
    } finally {
      setFectching(false);
    }
  };

  useEffect(() => {
    return controller.abort();
  }, []);

  return { fetching, err, response, postForm };
};

export default UseAxios;
