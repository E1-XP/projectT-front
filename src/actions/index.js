import consts from './constants';
import axios from 'axios';
axios.defaults.withCredentials = true;

import moment from 'moment';
import momentDFPlugin from 'moment-duration-format';
momentDFPlugin(moment);

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

export const setUserData = data => ({
    type: consts.SET_USER_DATA,
    payload: data
});

export const setEntries = data => ({
    type: consts.SET_ENTRIES,
    payload: data
});

export const setTimer = string => ({
    type: consts.SET_TIMER,
    payload: string
});

export const setRunningEntry = id => ({
    type: consts.SET_RUNNING_ENTRY,
    payload: id
});

export const setRunningEntryDescription = desc => ({
    type: consts.SET_RUNNING_ENTRY_DESCRIPTION,
    payload: desc
});

export const loadingError = err => ({
    type: consts.LOADING_ERROR,
    payload: err
});

export const toggleTimer = bool => dispatch => {
    if (bool) {
        const start = moment().format();
        dispatch(setIsRunning(true));

        window.interval = setInterval(() => {
            const time = moment.duration(moment().diff(start)).format('h:mm:ss', { stopTrim: "hh mm ss" });
            dispatch(setTimer(time));
            document.title = `${time} - ProjectT`;
        }, 500);
    }
    else {
        clearInterval(window.interval);
        dispatch(setIsRunning(false));
        dispatch(setTimer('0:00:00'));
        document.title = 'ProjectT';
    }
}

export const createNewEntry = (userid, param, pval) => dispatch => {
    const url = `http://localhost:3001/users/${userid}/entries/new?${param}=${pval}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(setRunningEntry(res.data._id));
    }).catch(err => dispatch(loadingError(err)));
}

export const updateEntry = (userid, runningEntryId, queryParams) => dispatch => {
    let queryStr = ``;
    Object.keys(queryParams).map(key => queryStr += `${key}=${queryParams[key]}&`);

    const url = `http://localhost:3001/users/${userid}/entries/${runningEntryId}/update?${queryStr}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(setEntries(res.data));
        if (queryParams.stop) dispatch(setRunningEntry(null));
    }).catch(err => dispatch(loadingError(err)));
}

export const removeEntry = (userid, entryid) => dispatch => {
    if (entryid.length !== 24) entryid = JSON.stringify(entryid);

    const url = `http://localhost:3001/users/${userid}/entries/${entryid}/delete`;

    axios.post(url).then(res => {
        dispatch(setEntries(res.data));
    }).catch(err => dispatch(loadingError(err)));
}

export const fetchData = url => dispatch => {
    dispatch(setIsLoading(true));

    axios.post(url).then(res => {

        dispatch(setUserData(res.data));
        dispatch(setIsLoading(false));

    }).catch(err => dispatch(loadingError(err)));
}

export const fetchEntries = userid => dispatch => {
    const url = `http://localhost:3001/users/${userid}/entries`;

    axios.get(url).then(res => {
        dispatch(setEntries(res.data));
    }).catch(err => {
        dispatch(loadingError(err));
    });

    return new Promise((res, rej) => res(true));
}

export const fetchAuthentication = () => dispatch => {
    const url = `http://localhost:3001/auth/refresh`;

    //dispatch(setIsLoading(true));

    axios.post(url).then(res => {
        if (res.status === 200) {
            dispatch(setUserData(res.data));// setTimeout(dispatch(setUserData(null)), 5000);
            dispatch(setIsAuthenticated(true));
            dispatch(setIsLoading(false));
        }
    }).catch(err => {
        dispatch(loadingError(err));
    });
}

export const handleAuth = (type, formData) => dispatch => {
    const url = `http://localhost:3001/auth/${type}`;
    const headers = { 'Content-Type': "application/x-www-form-urlencoded" }

    setTimeout(() => dispatch(setIsLoading(true)), 500);

    axios.post(url, formData, headers).then(res => {
        if (res.status === 200) {
            sessionStorage.setItem('session', JSON.stringify(res.data));
            localStorage.setItem('isAuth', true);

            dispatch(setUserData(res.data));
            dispatch(setIsAuthenticated(true));
            dispatch(setIsLoading(false));
        }
    }).catch(err => {
        dispatch(loadingError(err));
    });
}

export const handleLogout = () => dispatch => {
    const url = `http://localhost:3001/auth/logout`;

    dispatch(setIsLoading(true));

    axios.post(url).then(res => {
        sessionStorage.removeItem('session');
        localStorage.removeItem('isAuth');

        dispatch(setIsAuthenticated(false));
        setTimeout(() => dispatch(setIsLoading(false)), 1000);

    }).catch(err => {
        dispatch(loadingError(err));
    });
}

export const createProject = (userid, name, color, client) => dispatch => {
    console.log(userid, name, color);
    color = color.split('').splice(1).join('');

    const url = `http://localhost:3001/users/${userid}/projects/new?name=${name}&color=${color}&client=${client}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(setUserData(res.data));
    }).catch(err => dispatch(loadingError(err)));
}

export const removeProject = (userid, name) => dispatch => {
    name = JSON.stringify(name);

    const url = `http://localhost:3001/users/${userid}/projects/delete?name=${name}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(setUserData(res.data));
    }).catch(err => dispatch(loadingError(err)));
}