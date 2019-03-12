import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import history from './Utils/history';
import configureStore from './configureStore';
import { ConnectedRouter } from 'connected-react-router';

import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';
// import sseMiddleware from './Global/SSE/sseMiddleware';

const initialState = {};
const store        = configureStore( initialState, history );

ReactDOM.render( <Provider store={store}>
  <ConnectedRouter history={history}>
	<App/>
  </ConnectedRouter>
</Provider>, document.getElementById( 'root' ) );
registerServiceWorker();
