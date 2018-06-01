import { createSelector } from 'reselect';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

const getEntries = state => state.user.userData.entries;

const getMappedItemsFn = entries => {
    const getReadable = item => moment(item.start).format('ddd, Do MMM');
    const getDuration = item => moment.duration(moment(item.stop).diff(item.start)).format('h:mm:ss', { stopTrim: "hh mm ss" });

    const reduceItems = (acc, item) => {
        if (item.stop !== undefined) {
            const mapped = {
                start: item.start,
                stop: item.stop,
                description: item.description || '',
                project: item.project || '',
                billable: item.billable,
                userId: item.userId,
                id: item._id,
                readable: getReadable(item),
                duration: getDuration(item)
            };

            acc[mapped.readable] ? acc[mapped.readable].push(mapped) : acc[mapped.readable] = [mapped];
        }
        return acc;
    }

    return entries
        .sort((a, b) => b.start - a.start)
        .reduce(reduceItems, {});
}

const getMappedItems = createSelector([getEntries], getMappedItemsFn);

export default getMappedItems;
