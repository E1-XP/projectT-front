import types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.SET_USER_DATA: return Object.assign({}, state, { userData: action.payload });
        case types.SET_ENTRIES: {
            const userData = Object.assign({}, state.userData, { entries: action.payload });
            return Object.assign({}, state, { userData });
        };
        default: return state;
    }
};





