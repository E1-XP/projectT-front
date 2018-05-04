import consts from './types';

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

import { setIsRunning } from './global';
import { setBillable } from './entry';

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
            document.title = `${time} - ProjectT`;
        }, 450);
    }
    else {
        clearInterval(window.interval);
        dispatch(setIsRunning(false));
        dispatch(setTimer('0:00:00'));
        dispatch(setBillable(false));
        document.title = 'ProjectT';
    }
};