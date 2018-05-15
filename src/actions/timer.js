import consts from './types';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import { setIsRunning } from './global';
import { setBillable, createNewEntry, updateEntry } from './entry';

export const setTimer = string => ({
    type: consts.SET_TIMER,
    payload: string
});

export const setWeekTimer = string => ({
    type: consts.SET_WEEK_TIMER,
    payload: string
});

export const toggleTimer = (isTrue, previousTime = null) => (dispatch, getState) => {
    if (isTrue) {
        let start = moment().format();
        let initialWeekTime = getState().timer.weekTimer;
        const shouldShowTimerOnTitle = getState().user.settings.shouldShowTimerOnTitle;

        if (previousTime) start = previousTime;
        dispatch(setIsRunning(true));

        window.interval = setInterval(() => {
            if (previousTime && initialWeekTime === '0:00:00') initialWeekTime = getState().timer.weekTimer;

            const state = getState().timer;
            const time = moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
            const weekTime = moment.duration(initialWeekTime).add(moment().diff(moment(start)))
                .format('h:mm:ss', { stopTrim: "hh mm ss" });

            state.timer !== time && dispatch(setTimer(time));
            state.weekTimer !== weekTime && dispatch(setWeekTimer(weekTime));
            if (shouldShowTimerOnTitle) document.title = `${time} - ProjectT`;
        }, 450);
    }
    else {
        const entryThatStillRuns = getState().user.userData.entries.find(itm => !itm.stop);
        const dayStart = moment().startOf('day');

        entryThatStillRuns && entryThatStillRuns.start < dayStart.valueOf() &&
            handleMultipleDaysBetweenStop(entryThatStillRuns);

        clearInterval(window.interval);
        dispatch(setIsRunning(false));
        dispatch(setTimer('0:00:00'));
        dispatch(setBillable(false));
        document.title = 'ProjectT';
    }
};

const handleMultipleDaysBetweenStop = entryThatStillRuns => {
    const userId = entryThatStillRuns.userId;
    const dayStart = moment().startOf('day');
    let dayDiff = moment(entryThatStillRuns.start).diff(dayStart.valueOf(), 'days');

    const currentEntryParams = { stop: moment(entryThatStillRuns.start).endOf('day').valueOf() };
    dispatch(updateEntry(userId, entryThatStillRuns._id, currentEntryParams));

    dayDiff -= 1;
    while (dayDiff) {
        const startOfDay = dayStart.clone().subtract(dayDiff, 'day');
        const newEntryParams = {
            start: startOfDay.valueOf(), stop: moment(startOfDay).endOf('day').valueOf()
        };

        dispatch(createNewEntry(userId, newEntryParams, true));
        dayDiff -= 1;
    }

    const newEntryParams = { start: dayStart.valueOf(), stop: Date.now() };
    dispatch(createNewEntry(userId, newEntryParams, true));
}
