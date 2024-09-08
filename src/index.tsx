import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-dropdown/style.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { StoreProvider } from 'context';
import { QUERY_CACHE_DURATION, REQUEST_RETRY_DELAY } from './constants';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PMStoreProvider } from 'components/projects/management/Context';
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      gcTime: QUERY_CACHE_DURATION // 5 Days
    },
    mutations: {
      retry: Infinity,
      retryDelay: REQUEST_RETRY_DELAY
    }
  } // configure global cache callbacks to show toast notifications
});
// import FaviconNotificationContextProvider from "react-favicon-notification";
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <StoreProvider>
        <PMStoreProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PMStoreProvider>
      </StoreProvider>
    </Provider>
  </QueryClientProvider>
);
 export { queryClient };

