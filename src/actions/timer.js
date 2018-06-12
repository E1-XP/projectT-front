import { batchActions } from 'redux-batched-actions';
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
    console.log('istrue', isTrue);
    if (isTrue) {
        let start = moment().format();
        let initialWeekTime = getState().timer.weekTimer;
        const shouldShowTimerOnTitle = getState().user.settings.shouldShowTimerOnTitle;

        window.interval && clearInterval(window.interval);

        if (previousTime) start = previousTime;
        dispatch(setIsRunning(true));

        window.interval = setInterval(() => {
            if (previousTime && initialWeekTime === '0:00:00') initialWeekTime = getState().timer.weekTimer;

            const state = getState().timer;
            const time = moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
            const weekTime = moment.duration(initialWeekTime).add(moment().diff(moment(start)))
                .format('h:mm:ss', { stopTrim: "hh mm ss" });

            if (state.timer !== time) {
                dispatch(batchActions([
                    setTimer(time),
                    setWeekTimer(weekTime)
                ]));

                if (shouldShowTimerOnTitle) document.title = `${time} - ProjectT`;
            }
        }, 350);
    }
    else {
        const entryThatStillRuns = getState().user.entries.find(itm => !itm.stop);
        const runningEntry = getState().entry.runningEntry;
        const dayStart = moment().startOf('day');

        if (entryThatStillRuns && entryThatStillRuns.start < dayStart.valueOf()) {
            const state = getState().entry;
            const entryState = {
                project: state.currentProject.name || '',
                description: state.runningEntryDescription,
                billable: state.billable
            };
            handleMultipleDaysBetweenStop(entryThatStillRuns, entryState, dispatch);

        }
        else if (runningEntry) {
            const now = moment().valueOf();
            const state = getState().entry;
            const project = (state.currentProject && state.currentProject.name) ? state.currentProject.name : '';

            const payload = {
                stop: now,
                description: state.runningEntryDescription,
                project,
                billable: state.billable
            };

            dispatch(updateEntry(getState().user.userData._id, state.runningEntry, payload));
        }

        clearInterval(window.interval);
        dispatch(batchActions([
            setIsRunning(false),
            setTimer('0:00:00'),
            setBillable(false)
        ]));

        document.title = 'ProjectT';
    }
};

const handleMultipleDaysBetweenStop = (entryThatStillRuns, entryState, dispatch) => {
    const userId = entryThatStillRuns.userId;
    const dayStart = moment().startOf('day');
    let dayDiff = moment(dayStart.valueOf()).diff(entryThatStillRuns.start, 'days');
    const stop = moment(entryThatStillRuns.start).clone().endOf('day').valueOf();

    console.log(stop, dayDiff, 'stop and daydiff');
    const currentEntryParams = {
        ...entryState,
        stop
    };
    console.log('DISPATCH 1 UPDATE');
    dispatch(updateEntry(userId, entryThatStillRuns._id, currentEntryParams));

    while (dayDiff > 0) {
        const startOfDay = dayStart.clone().subtract(dayDiff, 'day');
        const newEntryParams = {
            ...entryState,
            start: startOfDay.valueOf(),
            stop: moment(startOfDay).endOf('day').valueOf()
        };

        console.log('DISPATCH 2 IN LOOP CREATE');
        dispatch(createNewEntry(userId, newEntryParams, true, true));
        dayDiff -= 1;
    }

    const newEntryParams = {
        ...entryState,
        start: dayStart.valueOf(), stop: Date.now()
    };
    console.log('DISPATCH 3 CREATE');
    dispatch(createNewEntry(userId, newEntryParams, true, true));
}
