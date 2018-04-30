import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import entryReducer from './entry';
import globalReducer from './global';
import userReducer from './user';
import timerReducer from './timer';

const rootReducer = combineReducers({
    global: globalReducer,
    entry: entryReducer,
    user: userReducer,
    timer: timerReducer,
    router: routerReducer
});

export default rootReducer;