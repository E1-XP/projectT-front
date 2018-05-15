import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl = `http://localhost:3001`;
//const baseUrl = `https://project--t.herokuapp.com`;

import { push } from 'react-router-redux'
import { setUserData, setSettings } from './user';
import { setTimer } from './timer';

export const setIsLoading = bool => ({
    type: consts.IS_LOADING,
    payload: bool
});

export const setIsRunning = bool => ({
    type: consts.IS_RUNNING,
    payload: bool
});

export const setIsAuthenticated = bool => ({
    type: consts.IS_AUTHENTICATED,
    payload: bool
});

export const allEntriesFetched = bool => ({
    type: consts.ALL_ENTRIES_FETCHED,
    payload: bool
});

export const loadingError = err => ({
    type: consts.LOADING_ERROR,
    payload: err
});

export const handleAuth = (type, formData) => (dispatch, getState) => {
    const url = `${baseUrl}/auth/${type}`;

    dispatch(setIsLoading(true));

    axios.post(url, formData).then(res => {
        console.log(res);
        if (res.status === 200) {
            //sessionStorage.setItem('session', JSON.stringify(res.data));
            localStorage.setItem('isAuth', true);

            const newSettings = res.data.settings;
            const filteredData = Object.keys(res.data).reduce((acc, itm) => {
                if (itm !== 'settings') acc[itm] = res.data[itm];
                return acc;
            }, {});
            const newData = Object.assign({}, getState().user.userData, filteredData);

            dispatch(setUserData(newData));
            newSettings && dispatch(setSettings(newSettings));
            dispatch(setIsAuthenticated(true));
            dispatch(setIsLoading(false));
        }
        else dispatch(setIsLoading(false));
    }).catch(err => {
        dispatch(setIsLoading(false));
        dispatch(loadingError(err));
    });
}

export const handleReAuth = () => (dispatch, getState) => {
    const url = `${baseUrl}/auth/refresh`;

    axios.post(url).then(res => {
        if (res.status === 200) {

            const newSettings = res.data.settings;
            const filteredData = Object.keys(res.data).reduce((acc, itm) => {
                if (itm !== 'settings') acc[itm] = res.data[itm];
                return acc;
            }, {});
            const newData = Object.assign({}, getState().user.userData, filteredData);

            dispatch(setUserData(newData));
            newSettings && dispatch(setSettings(newSettings));

            dispatch(setIsAuthenticated(true));
            dispatch(setIsLoading(false));
        }
        else {
            dispatch(push('/login'));
            dispatch(setIsLoading(false));
        }
    }).catch(err => {
        dispatch(setIsLoading(false));
        dispatch(loadingError(err));
    });
}

export const handleLogout = () => dispatch => {
    const url = `${baseUrl}/auth/logout`;

    dispatch(setIsLoading(true));

    axios.post(url).then(res => {
        //sessionStorage.removeItem('session');
        localStorage.removeItem('isAuth');

        dispatch(setIsAuthenticated(false));
        setTimeout(() => dispatch(setIsLoading(false)), 1000);
        if (window.interval) {
            clearInterval(window.interval);
            dispatch(setIsRunning(false));
            dispatch(setTimer('0:00:00'));
            document.title = 'ProjectT';
        }
        dispatch(setUserData(null));
        // dispatch(push('/login'));        

    }).catch(err => dispatch(loadingError(err)));
}