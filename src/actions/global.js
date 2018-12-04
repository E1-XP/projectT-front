import { batchActions } from 'redux-batched-actions';
import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl = `http://localhost:3001`;
//const baseUrl = `https://project--t.herokuapp.com`;

import { push } from 'connected-react-router';
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

export const setIsFetching = bool => ({
    type: consts.IS_FETCHING,
    payload: bool
});

export const setIsOnline = bool => ({
    type: consts.IS_ONLINE,
    payload: bool
});

export const setIsAuthenticated = bool => ({
    type: consts.IS_AUTHENTICATED,
    payload: bool
});

export const setDaysToShowLength = num => ({
    type: consts.SET_DAYS_TO_SHOW_LENGTH,
    payload: num
});

export const setAllEntriesFetched = bool => ({
    type: consts.ALL_ENTRIES_FETCHED,
    payload: bool
});

export const loadingError = err => dispatch => {

    dispatch({
        type: consts.PAGE_ERROR,
        payload: err
    });
    dispatch(push('/500'));
};

export const handleAuth = (type, formData) => (dispatch, getState) => {
    const URL = `${baseUrl}/auth/${type}`;

    return axios.post(URL, formData).then(resp => {
        console.log(resp);
        if (resp.status === 200) {
            dispatch(setIsLoading(true));

            if (type === 'login') {
                const userId = resp.data.userId;
                console.log(resp.data);
                const URL = `${baseUrl}/users/${userId}`;

                return axios.get(URL).then(resp => {
                    console.log(URL);
                    if (resp.status === 200) {
                        localStorage.setItem('isAuth', true);

                        const newSettings = resp.data.settings;
                        const filteredData = Object.keys(resp.data).reduce((acc, itm) => {
                            if (itm !== 'settings') acc[itm] = resp.data[itm];
                            return acc;
                        }, {});
                        const newData = Object.assign({}, getState().user.userData, filteredData);

                        dispatch(setUserData(newData));
                        newSettings && dispatch(setSettings(newSettings));
                        dispatch(setIsAuthenticated(true));
                        dispatch(setIsLoading(false));

                        return Promise.resolve({ status: resp.status })
                    }
                    else return Promise.resolve({ status: resp.status });
                });
            }
            else {
                if (resp.status === 200) {
                    localStorage.setItem('isAuth', true);

                    const newSettings = resp.data.settings;
                    const filteredData = Object.keys(resp.data).reduce((acc, itm) => {
                        if (itm !== 'settings') acc[itm] = resp.data[itm];
                        return acc;
                    }, {});
                    const newData = Object.assign({}, getState().user.userData, filteredData);

                    dispatch(setUserData(newData));
                    newSettings && dispatch(setSettings(newSettings));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setIsLoading(false));

                    return Promise.resolve({ status: resp.status })
                }
                else return Promise.resolve({ status: resp.status });
            }
        }
        else return Promise.resolve({ status: resp.status });//dispatch(setIsLoading(false));
    }).catch(err => {
        if (err.response) {
            console.log(err.response);

            if (err.response.status === 401) return Promise.resolve({ status: err.response.status });
            if (err.response.status !== 401) dispatch(loadingError(err));
        }
        else dispatch(loadingError(err));
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
            batchActions([
                push('/login'),
                setIsLoading(false)
            ]);
        }
    }).catch(err => {
        err.response && err.response.status !== 401 && dispatch(loadingError(err));
        dispatch(setIsLoading(false));
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

            batchActions([
                setIsRunning(false),
                setTimer('0:00:00')
            ]);
            document.title = 'ProjectT';
        }
        dispatch(setUserData(null));
        // dispatch(push('/login'));        

    }).catch(err => {
        err.response && err.response.status !== 401 && dispatch(loadingError(err));
        dispatch(setIsLoading(false));
    });
}