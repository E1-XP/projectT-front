import { combineReducers } from 'redux';
import consts from '../actions/constants';

const rootReducer = (state = {}, action) => {
    switch (action.type) {
        case consts.IS_LOADING: return Object.assign({}, state, { isLoading: action.payload });
        case consts.IS_RUNNING: return Object.assign({}, state, { isRunning: action.payload });
        case consts.IS_AUTHENTICATED: return Object.assign({}, state, { isUserLoggedIn: action.payload });
        case consts.SET_USER_DATA: return Object.assign({}, state, { userData: action.payload });
        case consts.SET_ENTRIES: {
            console.log('REDUCER AT WORK');
            const userData = Object.assign({}, state.userData, { entries: action.payload });
            return Object.assign({}, state, { userData });
        };
        case consts.SET_RUNNING_ENTRY: return Object.assign({}, state, { runningEntry: action.payload });
        case consts.SET_TIMER: return Object.assign({}, state, { timer: action.payload });
        case consts.LOADING_ERROR: return console.log(action.payload);
        default: return state;
    }
};

export default rootReducer;