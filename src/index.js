import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { Provider } from 'react-redux';
import store from './Redux/Store'; // Make sure you have set up your Redux store
import App from './App';

const root = createRoot(document.getElementById('root')); // Create a root
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
