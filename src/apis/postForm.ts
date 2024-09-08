import axios from 'axios';

export const MESSAGING_SOCKETS = process.env.REACT_APP_MESSAGING_SOCKETS || '';
export const MESSAGING_REST = MESSAGING_SOCKETS + '/express';
// export const MESSAGING_REST = 'http://localhost:9001';
// export const MESSAGING_SOCKETS = 'http://localhost:9000';

let host = process.env.REACT_APP_API_PROJECTS;
// let host = "http://localhost:8001/";
let host2 = process.env.REACT_APP_API_IAM;

let token = async () => {
  return (await Promise.resolve(localStorage.getItem('token'))) || '';
};

export type PostForm = (
  method: string,
  url: string,
  body?: any,
  iam?: string,
  controller?: any
) => Promise<{ e: any; response: any }>;

const postForm: PostForm = async (method, url, body, iam) => {
  let e: any, response: any;
  let headers = {
    headers: {
      // "ngrok-skip-browser-warning": "nil",
      Authorization: 'Bearer ' + (await token()),
      'Content-Type': 'application/json'
      // "ngrok-skip-browser-warning": "nil"
    }
  };

  try {
    let res: any;
    switch (method.toLowerCase()) {
      case 'post':
        res = await axios.post<any>((iam ? host2 : host) + url, { ...body }, headers);
        break;
      case 'get':
        res = await axios.get<any>((iam ? host2 : host) + url, headers);
        break;
      case 'patch':
        res = await axios.patch<any>((iam ? host2 : host) + url, { ...body }, headers);
        break;
      case 'delete':
        res = await axios.delete<any>((iam ? host2 : host) + url, {
          data: { ...body },
          headers: headers.headers
        });
        break;
    }

    response = res;
  } catch (err: any) {
    e = err?.response?.data ? err.response.data : err;
  }

  return { e, response };
};

const postFormWithAbortController: PostForm = async (method, url, body, iam, controller) => {
  const backupcontroller = new AbortController();
  let e: any, response: any;
  let headers = {
    signal: controller ? controller.signal : backupcontroller.signal,
    headers: {
      // "ngrok-skip-browser-warning": "nil",
      Authorization: 'Bearer ' + (await token()),
      'Content-Type': 'application/json'
    }
  };

  try {
    let res: any;
    switch (method.toLowerCase()) {
      case 'post':
        res = await axios.post<any>((iam ? host2 : host) + url, { ...body }, headers);
        break;
      case 'get':
        res = await axios.get<any>((iam ? host2 : host) + url, headers);
        break;
      case 'patch':
        res = await axios.patch<any>((iam ? host2 : host) + url, { ...body }, headers);
        break;
      case 'delete':
        res = await axios.delete<any>((iam ? host2 : host) + url, {
          data: { ...body },
          headers: headers.headers
        });
        break;
    }

    response = res;
  } catch (err: any) {
    e = err?.response?.data ? err.response.data : err;
  }

  return { e, response };
};

export { postForm, postFormWithAbortController };
