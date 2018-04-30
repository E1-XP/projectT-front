import types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.SET_TIMER: return Object.assign({}, state, { timer: action.payload });
        case types.SET_WEEK_TIMER: return Object.assign({}, state, { weekTimer: action.payload });
        default: return state;
    }
};

