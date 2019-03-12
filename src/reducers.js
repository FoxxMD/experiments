// import * as constants from './constants';
import { combineReducers } from 'redux';
import {
  connectRouter,
} from "connected-react-router";
import history from './Utils/history';

import preferences from './Global/Preferences/preferencesReducer';
// import sse from './Global/SSE/sseReducer';

export default function createReducer( injectedReducers = {} ){
  return combineReducers( {
	preferences,
	router: connectRouter( history ),
	// sse,
	...injectedReducers,
  } );
}
