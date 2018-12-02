import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

// const baseUrl = `http://localhost:3001`;
const baseUrl = `https://project--t.herokuapp.com`;

import { loadingError, setAllEntriesFetched, setIsFetching } from './global';

export const setUserData = data => (dispatch, getState) => {

    const payload = {
        data,
        daysToShowLength: getState().global.daysToShowLength
    }

    return dispatch({
        type: consts.SET_USER_DATA,
        payload
    });
};

export const setSettings = data => ({
    type: consts.SET_SETTINGS,
    payload: data
});

export const setMappedItems = data => ({
    type: consts.SET_MAPPED_ITEMS,
    payload: data
});

export const addEntries = data => (dispatch, getState) => {
    const stateDaysLength = getState().global.daysToShowLength;

    const payload = {
        data,
        daysToShowLength: stateDaysLength ? stateDaysLength + 10 : stateDaysLength
    }
    console.log(payload, 'ACTUAL VAL');

    return dispatch({
        type: consts.ADD_ENTRIES,
        payload
    });
};

export const editEntries = data => ({
    type: consts.EDIT_ENTRIES,
    payload: data
});

export const removeEntries = data => ({
    type: consts.REMOVE_ENTRIES,
    payload: data
});

export const setPassword = (userid, data) => dispatch => {
    const url = `${baseUrl}/users/${userid}/password`;
    dispatch(setIsFetching(true));

    return new Promise((res, rej) => {
        axios.put(url, data)
            .then(resp => {
                dispatch(setIsFetching(false));
                res(resp.data.result);
            })
            .catch(err => console.log(err));
    });
};

export const setUserInfo = (userid, data) => (dispatch, getState) => {
    const url = `${baseUrl}/users/${userid}/`;
    dispatch(setIsFetching(true));

    axios.put(url, data)
        .then(resp => {
            console.log(resp.data);
            dispatch(setIsFetching(false));

            const newSettings = resp.data.settings;
            const filteredData = Object.keys(resp.data).reduce((acc, itm) => {
                if (!['settings', 'entries', 'projects'].includes(itm)) acc[itm] = resp.data[itm];
                return acc;
            }, {});
            const newData = Object.assign({}, getState().user.userData, filteredData);

            dispatch(setUserData(newData));
            resp.data.settings && dispatch(setSettings(newSettings));
        }).catch(err => console.log(err));
};

export const sendAvatar = (userid, data) => dispatch => {
    const url = `${baseUrl}/users/${userid}/avatar`;
    const config = {
        onUploadProgress: progressEvent => console.log(progressEvent.loaded)
    }
    //const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    return new Promise((res, rej) => {
        console.log(url, data);
        dispatch(setIsFetching(true));

        axios.put(url, data, config).then(resp => {
            console.log(resp.data, 'RESP');
            dispatch(setIsFetching(false));

            const filteredData = Object.keys(resp.data).reduce((acc, itm) => {
                if (!['settings', 'entries', 'projects'].includes(itm)) acc[itm] = resp.data[itm];
                return acc;
            }, {});

            dispatch(setUserData(filteredData));
            res();
        });
    });
};

export const fetchEntries = (userId, beginAt, endAt, dayCount) => dispatch => {
    let url = `${baseUrl}/users/${userId}/entries?`;
    if (beginAt) url += `begin=${beginAt}`;
    if (endAt) url += `&end=${endAt}`;
    if (dayCount) url += `&days=${dayCount}`;
    console.log(url);

    dispatch(setIsFetching(true));

    return new Promise((res, rej) => {

        axios.get(url).then(resp => {
            console.log(resp.data, 'new entries');
            dispatch(setIsFetching(false));

            if (resp.data.length) {
                console.log('should dispatch')
                dispatch(addEntries(resp.data));
                res(1);
            }
            else {
                setTimeout(() => {
                    dispatch(setAllEntriesFetched(true));
                    res(0);
                }, 300);
            }

        }).catch(err => dispatch(loadingError(err)));
    });
}