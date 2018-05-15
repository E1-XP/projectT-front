import types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.SET_BILLABLE: return Object.assign({}, state, { billable: action.payload });
        case types.SET_PROJECT: return Object.assign({}, state, { currentProject: action.payload || '' });
        case types.SET_RUNNING_ENTRY: return Object.assign({}, state, { runningEntry: action.payload });
        case types.SET_RUNNING_ENTRY_DESCRIPTION: return Object.assign({}, state, { runningEntryDescription: action.payload });
        default: return state;
    }
};