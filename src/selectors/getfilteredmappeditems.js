import { createSelector } from 'reselect';

import getMappedItems from './getmappeditems';
const getItemsLength = state => state.global.daysToShowLength;

const getMappedItemsFn = (entries, daysToShowLength) => {
    const filtered = {};

    if (!daysToShowLength) return entries;

    Object.keys(entries).some(key => {
        filtered[key] = entries[key];

        return Object.keys(filtered).length === daysToShowLength ? true : false;
    });

    return filtered;
}

const getFilteredMappedItems = createSelector([getMappedItems, getItemsLength], getMappedItemsFn);

export default getFilteredMappedItems;