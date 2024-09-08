export const controller = new AbortController();

// enum Methods { 'GET','POST','PATCH','PUT','DELETE' }

export type Response<T = any | undefined> = {
  status: number;
  message: string;
  error: string;
  data: T;
};

type M = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export const Fetcher = async <T>(
  url: string,
  method: M = 'GET',
  body?: {}
): Promise<Response<T>> => {
  const { signal } = controller;
  const token = localStorage.getItem('token');

  const headers: any = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
    // "ngrok-skip-browser-warning":"nil"
  };

  /**
   * If there's no token in the cache
   * Remove the auth header
   * */
  if (token) headers.Authorization = `Bearer ${token}`;

  const request = await fetch(url, {
    headers,
    method,
    signal,
    cache: 'default',
    body: JSON.stringify(body)
  });
  const response: Response<T> = await request.json();
  let message;
  /**
   * if a response got an error
   * it will be thrown by the below if conditions
   */
  if (!String(request.status).startsWith('2')) {
    if (response.error && response.message) {
      if (response.error.length > response.message.length) {
        message = response.error;
      } else {
        message = response.message;
      }
    } else {
      let longestOptionalMessage = '';
      for (const value of Object.values(response)) {
        if (String(value).length > longestOptionalMessage.length) {
          longestOptionalMessage = String(value);
        }
      }
      message = longestOptionalMessage;
    }
    //
    throw new Error(message);
  }

  return { ...response, status: request.status };
};
