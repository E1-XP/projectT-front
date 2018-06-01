import types from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case types.SET_USER_DATA: {
            return Object.assign({}, state, { userData: { ...state.userData, ...action.payload } })
        };
        case types.SET_SETTINGS: return Object.assign({}, state, { settings: action.payload });
        case types.SET_ENTRIES: {
            const userData = Object.assign({}, state.userData, { entries: action.payload });

            return Object.assign({}, state, { userData });
        };
        case types.ADD_ENTRIES: {
            const payload = action.payload.filter(itm => state.userData.entries
                .findIndex(el => el._id === itm._id) < 0);
            const entries = state.userData.entries.concat(payload);
            const userData = Object.assign({}, state.userData, { entries });

            return Object.assign({}, state, { userData });
        };
        case types.EDIT_ENTRIES: {
            let found = false;

            const entriesCpy = state.userData.entries.map(itm => {
                if (Array.isArray(action.payload)) {
                    if (action.payload.findIndex(elem => elem._id === itm._id) !== -1) {
                        found = true;
                        return action.payload[action.payload.findIndex(elem => elem._id === itm._id)]
                    } else return itm;
                }
                else {
                    if (itm._id === action.payload._id) {
                        found = true;
                        return action.payload;
                    }
                    return itm;
                }
            });
            !found && entriesCpy.push(action.payload);

            const userData = {
                ...state.userData,
                entries: entriesCpy
            }

            return Object.assign({}, state, { userData });
        };
        case types.REMOVE_ENTRIES: {
            console.log(action.payload, 'APL');
            const userData = {
                ...state.userData,
                entries: state.userData.entries
                    .filter(itm => !action.payload.some(elem => elem === itm._id))
            };

            return Object.assign({}, state, { userData });
        };
        default: return state;
    }
};