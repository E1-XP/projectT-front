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