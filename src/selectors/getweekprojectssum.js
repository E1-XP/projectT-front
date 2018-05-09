import { createSelector } from 'reselect';
import moment from 'moment';

const getEntries = userData => userData.entries;

const getWeekProjectsSum = entries => {
    const startOfWeek = moment().startOf('isoWeek').valueOf();

    return entries.reduce((acc, itm) => {
        if (itm.stop && itm.start >= startOfWeek) {
            acc[itm.project || 'noproject'] ?
                acc[itm.project || 'noproject'] += itm.stop - itm.start :
                acc[itm.project || 'noproject'] = itm.stop - itm.start;
        }
        return acc;
    }, { noproject: 0 });
}

export default createSelector([getEntries], getWeekProjectsSum);
