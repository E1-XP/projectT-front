import types from '../actions/types';
import getFilteredMappedItems from '../helpers/getfilteredmappeditems';
import getMappedItems from '../helpers/getmappeditems';

export default (state = {}, action) => {
    switch (action.type) {
        case types.SET_USER_DATA: {
            const omitEntries = (acc, key) => {
                if (key !== 'entries' && key !== 'projects') acc[key] = action.payload.data[key]
                return acc
            };
            const userData = Object.keys(action.payload.data).reduce(omitEntries, {});
            const entries = action.payload.data.entries;
            const mappedItems = getFilteredMappedItems(getMappedItems(entries), action.payload.daysToShowLength);
            const projects = action.payload.data.projects;

            return Object.assign({}, state,
                { userData: { ...state.userData, ...userData }, entries, mappedItems, projects })
        };

        case types.SET_SETTINGS: return Object.assign({}, state, { settings: action.payload });

        case types.ADD_ENTRIES: {
            const payload = action.payload.data.filter(itm => state.entries.findIndex(el => el._id === itm._id) < 0);
            const entries = state.entries.concat(payload);
            const mappedEntriesCombined = Object.assign({}, state.mappedItems, getMappedItems(action.payload.data));
            const mappedItems = getFilteredMappedItems(mappedEntriesCombined, action.payload.daysToShowLength);

            console.log(action.payload.daysToShowLength, 'added itms');
            return Object.assign({}, state, { entries, mappedItems });
        };

        case types.EDIT_ENTRIES: {
            let found = false;

            const entriesCpy = state.entries.map(itm => {

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

            const mappedItems = getFilteredMappedItems(getMappedItems(entriesCpy), action.payload.daysToShowLength);

            return Object.assign({}, state, { entries: entriesCpy, mappedItems });
        };

        case types.REMOVE_ENTRIES: {
            const entries = state.entries.filter(itm => !action.payload.some(elem => elem === itm._id));
            const mappedItems = Object.assign({}, state.mappedItems);

            const shouldStay = itm => action.payload.findIndex(elem => elem === itm.id) === -1;

            const reduceInner = object => {
                return Object.keys(object)
                    .reduce((acc, key) => {
                        acc[key] = object[key].filter(itm => shouldStay(itm));
                        if (!acc[key].length) delete acc[key];
                        return acc;
                    }, {});
            }

            const mappedItemsMod = Object.keys(mappedItems)
                .reduce((acc, key) => {
                    acc[key] = reduceInner(mappedItems[key]);
                    return acc;
                }, {});

            return Object.assign({}, state, { entries, mappedItems: mappedItemsMod });
        };

        default: return state;
    }
};