import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes';
import GlobalStyles from './styles/global';
import Header from './components/Header';
import { CartProvider } from './hooks/useCart';
import { ToastAnimated } from './components/Toast';
import { ToastContainer } from 'react-toastify';

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <CartProvider>
        <ToastContainer autoClose={3000} />
        <GlobalStyles />
        <Header />
        <Routes />
        <ToastAnimated />
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
