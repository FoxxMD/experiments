import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from "connected-react-router";
import { applyMiddleware, compose, createStore } from 'redux';
import createReducer from './reducers';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore( initialState = {}, history ){
  const historyMiddleware = routerMiddleware( history );
  
  const middlewares = [
	sagaMiddleware,
	historyMiddleware,
	// sseMiddleware
  ];
  
  const enhancers = [ applyMiddleware( ...middlewares ) ];
  
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  const store = createStore(
	  createReducer(),
	  {},
	  composeEnhancers( ...enhancers ) );
  
  store.runSaga          = sagaMiddleware.run;
  store.injectedReducers = {}; // Reducer registry
  store.injectedSagas    = {}; // Saga registry
  
  return store;
}
