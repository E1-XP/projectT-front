import types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.IS_LOADING: return Object.assign({}, state, { isLoading: action.payload });
        case types.IS_RUNNING: return Object.assign({}, state, { isRunning: action.payload });
        case types.IS_ONLINE: return Object.assign({}, state, { isOnline: action.payload });
        case types.IS_AUTHENTICATED: return Object.assign({}, state, { isUserLoggedIn: action.payload });
        case types.SET_DAYS_TO_SHOW_LENGTH: return Object.assign({}, state, { daysToShowLength: action.payload });
        case types.ALL_ENTRIES_FETCHED: return Object.assign({}, state, { allEntriesFetched: action.payload });
        case types.LOADING_ERROR: { console.log('LOADING ERROR', action.payload); return state };
        default: return state;
    }
};