import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import types from '../actions/types';

import getMappedItems from '../services/getMappedItems';

export default (state = {}, action) => {
    switch (action.type) {
        case types.SET_USER_DATA: {
            if (!action.payload.data) return Object.assign({},
                { entries: [], mappedItems: {}, projects: [], settings: {}, userData: {} });

            if (!action.payload.data.entries && action.payload.data.projects) {
                return Object.assign({}, state, { projects: action.payload.data.projects });
            }

            if (Object.keys(action.payload.data)
                .every(key => !['settings', 'entries', 'projects'].includes(key))) {
                return Object.assign({}, state, { userData: action.payload.data });
            }

            const omitEntries = (acc, key) => {
                if (key !== 'entries' && key !== 'projects') acc[key] = action.payload.data[key]
                return acc;
            };
            const userData = Object.keys(action.payload.data).reduce(omitEntries, {});
            const entries = action.payload.data.entries;
            const mappedItems = getMappedItems(entries);
            const projects = action.payload.data.projects;

            return Object.assign({}, state,
                { userData: { ...state.userData, ...userData }, entries, mappedItems, projects })
        };

        case types.SET_SETTINGS: return Object.assign({}, state, { settings: action.payload });

        case types.SET_MAPPED_ITEMS: {
            return Object.assign({}, state, { mappedItems: action.payload });
        };

        case types.ADD_ENTRIES: {
            const payload = action.payload.data
                .filter(itm => state.entries.findIndex(el => el._id === itm._id) < 0);
            const entries = state.entries.concat(payload);
            const mappedEntriesCombined = Object.assign({},
                state.mappedItems, getMappedItems(action.payload.data));
            const mappedItems = mappedEntriesCombined;

            console.log(action.payload.daysToShowLength, 'added itms');
            return Object.assign({}, state, { entries, mappedItems });
        };

        case types.EDIT_ENTRIES: {
            const getDayStr = itm => moment(itm).format('ddd, Do MMM');
            const getDayStart = itm => moment(itm).startOf('day').valueOf();
            const getDayEnd = itm => moment(itm).endOf('day').valueOf();

            if (!Array.isArray(action.payload) && !action.payload.stop) return state;

            let found = false;
            const dayToModify = Array.isArray(action.payload) ? getDayStr(action.payload[0].start) :
                getDayStr(action.payload.start);
            const unixDayStart = getDayStart(Array.isArray(action.payload) ? action.payload[0].start :
                action.payload.start);
            const unixDayEnd = getDayEnd(Array.isArray(action.payload) ? action.payload[0].start :
                action.payload.start);
            const prevMappedItems = Object.assign({}, state.mappedItems);

            //replace modified items in entries array
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

            //if modified entry is not found in store push it here 
            if (found) {
                prevMappedItems[dayToModify] = (dayStr => {
                    const itemsFromThisDay = entriesCpy
                        .filter(itm => itm.start >= unixDayStart && itm.stop <= unixDayEnd);

                    return getMappedItems(itemsFromThisDay)[dayStr];
                })(dayToModify);
            } else {
                const keyStr = `${action.payload.project} \n${action.payload.description || '$empty#'} `;
                console.log('actio prep', action.payload, getMappedItems([action.payload]))
                const prepEntry = getMappedItems([action.payload])[dayToModify][keyStr][0];

                entriesCpy.push(action.payload);
                if (!prevMappedItems[dayToModify]) prevMappedItems[dayToModify] = {};

                prevMappedItems[dayToModify][keyStr] ?
                    prevMappedItems[dayToModify][keyStr] = prevMappedItems[dayToModify][keyStr]
                        .concat([prepEntry]) :
                    prevMappedItems[dayToModify][keyStr] = [prepEntry];
            }

            const mappedItems = Object.assign({}, prevMappedItems);

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
                    if (!Object.keys(acc[key]).length) delete acc[key];
                    return acc;
                }, {});

            return Object.assign({}, state, { entries, mappedItems: mappedItemsMod });
        };

        default: return state;
    }
};