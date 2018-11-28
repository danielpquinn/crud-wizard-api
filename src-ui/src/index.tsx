import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from './Home';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Home />,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
