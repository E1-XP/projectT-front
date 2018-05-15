import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl = `http://localhost:3001`;
//const baseUrl = `https://project--t.herokuapp.com`;

import { loadingError, allEntriesFetched } from './global';

export const setUserData = data => ({
    type: consts.SET_USER_DATA,
    payload: data
});

export const setSettings = data => ({
    type: consts.SET_SETTINGS,
    payload: data
});

export const setEntries = data => ({
    type: consts.SET_ENTRIES,
    payload: data
});

export const addEntries = data => ({
    type: consts.ADD_ENTRIES,
    payload: data
});

export const editEntries = data => ({
    type: consts.EDIT_ENTRIES,
    payload: data
});

export const removeEntries = data => ({
    type: consts.REMOVE_ENTRIES,
    payload: data
});

export const setPassword = (userid, data) => dispatch => {
    const url = `${baseUrl}/users/${userid}/passwordedit`;

    return new Promise((res, rej) => {
        axios.put(url, data)
            .then(resp => res(resp.data.result))
            .catch(err => console.log(err));
    });
};

export const setUserInfo = (userid, data) => (dispatch, getState) => {
    const url = `${baseUrl}/users/${userid}/`;

    axios.put(url, data)
        .then(resp => {
            const newSettings = resp.data.settings;
            const filteredData = Object.keys(resp.data).reduce((acc, itm) => {
                if (itm !== 'settings') acc[itm] = resp.data[itm];
                return acc;
            }, {});
            const newData = Object.assign({}, getState().user.userData, filteredData);

            dispatch(setUserData(newData));
            dispatch(setSettings(newSettings));
        }).catch(err => console.log(err));
};

export const sendAvatar = (userid, data) => dispatch => {
    const url = `${baseUrl}/users/${userid}/avatar`;
    const config = {
        onUploadProgress: progressEvent => console.log(progressEvent.loaded)
    }
    //const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    console.log(url, data);
    axios.put(url, data, config).then(res => {
        dispatch(setUserData(res.data));
    });
};

export const fetchEntries = (userid, beginat, endat) => dispatch => {
    let url = `${baseUrl}/users/${userid}/entries?`;
    if (beginat) url += `begin=${beginat}`;
    if (endat) url += `&end=${endat}`;
    console.log(url);

    axios.get(url).then(res => {
        if (res.data.length) dispatch(addEntries(res.data));
        else dispatch(allEntriesFetched(true));
    }).catch(err => dispatch(loadingError(err)));
}