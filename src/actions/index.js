import consts from './constants';
import axios from 'axios';
axios.defaults.withCredentials = true;

export const setIsLoading = bool => ({
    type: consts.IS_LOADING,
    payload: bool
});

export const setIsAuthenticated = bool => ({
    type: consts.IS_AUTHENTICATED,
    payload: bool
});

export const setIsRunning = bool => ({
    type: consts.IS_RUNNING,
    payload: bool
});

export const setUserData = data => ({
    type: consts.SET_USER_DATA,
    payload: data
});

export const setTimer = time => ({
    type: consts.SET_TIMER,
    payload: time
});

export const setRunningEntry = id => ({
    type: consts.SET_RUNNING_ENTRY,
    payload: id
});

export const createNewEntry = userid => dispatch => {
    const url = `http://localhost:3001/users/${userid}/entries/new`;
    console.log(userid);
    axios.post(url).then(res => {

        dispatch(setRunningEntry(res.data._id));
    }).catch(err => {
        dispatch(loadingError(err));
    });
}

export const updateEntryStopField = (userid, runningEntry, stopTime) => dispatch => {
    const url = `http://localhost:3001/users/${userid}/entries/${runningEntry}/update?stop=${stopTime}`;

    axios.post(url)
        .catch(err => {
            dispatch(loadingError(err));
        });
}

export const removeEntry = (userid, entryid) => dispatch => {
    const url = `http://localhost:3001/users/${userid}/entries/${entryid}/delete`;

    axios.post(url).then(res => {
        //refresh state
    }).catch(err => {
        dispatch(loadingError(err));
    });
}

export const loadingError = err => ({
    type: consts.LOADING_ERROR,
    payload: err
});

export const fetchData = url => dispatch => {
    dispatch(setIsLoading(true));

    axios.post(url).then(res => {

        dispatch(setUserData(res.data));
        dispatch(setIsLoading(false));

    }).catch(err => {
        dispatch(loadingError(err));
    });
}

export const fetchAuthentication = (url, authFlag) => dispatch => {
    dispatch(setIsLoading(true));

    axios.post(url).then(res => {

        if (authFlag) dispatch(setUserData(res.data));
        //(authFlag) ? dispatch(setUserData(res.data)) : dispatch(setUserData(null));
        dispatch(setIsLoading(false));
        dispatch(setIsAuthenticated(authFlag));

    }).catch(err => {
        dispatch(loadingError(err));
    });
}


