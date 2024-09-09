import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import App from './App';
import './styles/global.css';
import 'react-loading-skeleton/dist/skeleton.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)