import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

//const baseUrl = `http://localhost:3001`;
const baseUrl = `https://project--t.herokuapp.com`;

import { loadingError } from './global';


export const setUserData = data => ({
    type: consts.SET_USER_DATA,
    payload: data
});

export const setEntries = data => ({
    type: consts.SET_ENTRIES,
    payload: data
});

export const fetchData = url => dispatch => {
    dispatch(setIsLoading(true));

    axios.post(url).then(res => {

        dispatch(setUserData(res.data));
        dispatch(setIsLoading(false));

    }).catch(err => dispatch(loadingError(err)));
}

export const fetchEntries = userid => dispatch => {
    const url = `${baseUrl}/users/${userid}/entries`;

    axios.get(url).then(res => {
        dispatch(setEntries(res.data));
    }).catch(err => {
        dispatch(loadingError(err));
    });

    return new Promise((res, rej) => res(true));
}