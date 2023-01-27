import { StrictMode } from 'react';
import ReactDOM from 'react-dom';

import { random } from '@swarmion-full-stack/frontend-shared';

import App from './App';

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root'),
);

export const rng = random.rng;
