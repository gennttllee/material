import axios from 'axios';

let host = process.env.REACT_APP_API_PROJECTS;
let host2 = process.env.REACT_APP_API_IAM;

let token = async () => {
  return (await localStorage.getItem('token')) || '';
};

export type PostForm = (
  method: string,
  url: string,
  controller: AbortController,
  body?: any,
  iam?: string
) => Promise<{ e: any; response: any }>;

const postForm: PostForm = async (method, url, controller, body, iam) => {
  let e: any, response: any;
  let headers = {
    headers: {
      Authorization: 'Bearer ' + (await token()),
      'Content-Type': 'application/json'
    },
    signal: controller?.signal
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

export { postForm };
