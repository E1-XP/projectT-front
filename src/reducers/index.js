import { combineReducers } from 'redux';
import reduceReducers from 'reduce-reducers';
import { routerReducer } from 'react-router-redux';
import consts from '../actions/constants';

const reducer = (state = {}, action) => {
    switch (action.type) {
        case consts.IS_LOADING: return Object.assign({}, state, { isLoading: action.payload });
        case consts.IS_RUNNING: return Object.assign({}, state, { isRunning: action.payload });
        case consts.IS_AUTHENTICATED: return Object.assign({}, state, { isUserLoggedIn: action.payload });
        case consts.SET_TIMER: return Object.assign({}, state, { timer: action.payload });
        case consts.SET_WEEK_TIMER: return Object.assign({}, state, { weekTimer: action.payload });
        case consts.SET_USER_DATA: return Object.assign({}, state, { userData: action.payload });
        case consts.SET_ENTRIES: {
            const userData = Object.assign({}, state.userData, { entries: action.payload });
            return Object.assign({}, state, { userData });
        };
        case consts.SET_PROJECT: return Object.assign({}, state, { currentProject: action.payload });
        case consts.SET_RUNNING_ENTRY: return Object.assign({}, state, { runningEntry: action.payload });
        case consts.SET_RUNNING_ENTRY_DESCRIPTION: return Object.assign({}, state, { runningEntryDescription: action.payload });
        case consts.LOADING_ERROR: return console.log('LOADING ERROR', action.payload);
        default: return state;
    }
};

const rootReducer = reduceReducers(reducer, routerReducer);

export default rootReducer;