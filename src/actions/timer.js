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

export const setTimerId = number => ({
    type: consts.SET_TIMER_ID,
    payload: number
});

export const setWeekTimer = string => ({
    type: consts.SET_WEEK_TIMER,
    payload: string
});

export const toggleTimer = (isTrue, previousTime = null) => (dispatch, getState) => {
    console.log('istrue', isTrue);
    if (isTrue) {
        const now = Date.now();
        let start = previousTime ? previousTime : now;
        let initialWeekTime = getState().timer.weekTimerNum;

        dispatch(batchActions([
            setTimerId(now),
            setIsRunning(true)
        ]));

        const getFormattedDuration = (mSeconds) => {
            const number = mSeconds / 1000;
            const string = moment.duration(mSeconds).format('h:mm:ss', { stopTrim: "hh mm ss" });

            return { number, string };
        };

        const interval = (timerId, sum = 0, prevTstamp = 0) =>
            setTimeout(() => {
                const tstamp = Date.now();

                const diff = prevTstamp ? (tstamp - prevTstamp) : 0;
                sum += diff;

                const state = getState();
                const { isTabActive } = state.global;

                if (!isTabActive && state.user.settings.shouldShowTimerOnTitle) {
                    const time = getFormattedDuration(tstamp - start).string;
                    document.title = `${time} - ProjectT`;
                }
                else if (sum >= 1000) {
                    sum = 0;

                    if (previousTime && initialWeekTime === 0) {
                        initialWeekTime = state.timer.weekTimerNum;
                    }

                    const time = getFormattedDuration(tstamp - start).string;
                    const weekTime = getFormattedDuration(Math.round((initialWeekTime + (tstamp - start))));

                    dispatch(batchActions([
                        setTimer(time),
                        setWeekTimer(weekTime)
                    ]));

                    if (state.user.settings.shouldShowTimerOnTitle) {
                        document.title = `${time} - ProjectT`;
                    }
                    else if (document.title !== 'ProjectT') {
                        document.title = 'ProjectT';
                    }
                }

                prevTstamp = tstamp;

                if (state.global.isRunning && state.timer.timerId === timerId) {
                    interval(timerId, sum, prevTstamp);
                } else {
                    if (document.title !== 'ProjectT') document.title = 'ProjectT';
                }
            }, 1000 / 60);

        interval(now);
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

        dispatch(batchActions([
            setIsRunning(false),
            setTimerId(null),
            setTimer('0:00:00'),
            setBillable(false)
        ]));
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
