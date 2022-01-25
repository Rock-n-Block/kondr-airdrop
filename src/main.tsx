import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import { setupStore } from 'store';

import App from 'App';

import { combineProviders } from 'utils';

import { Connect, Contract, ModalsProvider } from 'services';

import 'styles/index.scss';

const store = setupStore();

const Providers = combineProviders([
  Connect,
  Contract,
  ModalsProvider,
  [Provider, { store }],
  BrowserRouter,
]);

const root = document.getElementById('root');
const app = (
  <Providers>
    <App />
  </Providers>
);

ReactDOM.render(app, root);
