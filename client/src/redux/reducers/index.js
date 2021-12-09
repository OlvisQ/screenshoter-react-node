import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';

const rootReducer = combineReducers({
  auth: authentication,
});

export default rootReducer;
