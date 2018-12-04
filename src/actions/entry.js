import { batchActions } from 'redux-batched-actions';
import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

//const baseUrl = `http://localhost:3001`;
 const baseUrl = `https://project--t.herokuapp.com`;

import { toggleTimer } from './timer';
import { editEntries, removeEntries, setUserData } from './user';
import { loadingError, setIsFetching } from './global';

export const setBillable = bool => ({
    type: consts.SET_BILLABLE,
    payload: bool
});

export const setProject = object => ({
    type: consts.SET_PROJECT,
    payload: object
});

export const setRunningEntry = id => ({
    type: consts.SET_RUNNING_ENTRY,
    payload: id
});

export const setRunningEntryDescription = desc => ({
    type: consts.SET_RUNNING_ENTRY_DESCRIPTION,
    payload: desc
});

export const createNewEntry = (userid, queryParams, ignoreIsRunning = false, multiDayMode = false) =>
    (dispatch, getState) => {
        let queryStr = ``;
        Object.keys(queryParams).map(key => queryStr += `${key}=${queryParams[key]}&`);
        if (!multiDayMode) queryStr += `start=${Date.now()}`;

        const url = `${baseUrl}/users/${userid}/entries?${queryStr}`;
        console.log(url, 'NEW');

        const projects = getState().user.projects;
        const projectObj = projects[projects.map(itm => itm.name)
            .findIndex(itm => itm === queryParams.project)];

        const createEntry = () => {
            !multiDayMode && dispatch(toggleTimer(true));

            if (!queryParams.stop) {
                dispatch(batchActions([
                    setProject(projectObj),
                    setRunningEntryDescription(queryParams.description || ""),
                    setBillable(queryParams.billable)
                ]));
            }

            dispatch(setIsFetching(true));
            axios.post(url).then(resp => {

                //dispatch(editEntries(resp.data));
                (!queryParams.stop) && dispatch(setRunningEntry(resp.data._id));
                dispatch(setIsFetching(false));

            }).catch(err => dispatch(loadingError(err)));
        }

        if (!ignoreIsRunning && getState().global.isRunning && !multiDayMode) {
            const state = getState();
            const params = { stop: Date.now() };

            dispatch(toggleTimer(false));
            dispatch(updateEntry(state.user.userData._id, state.entry.runningEntry, params));
        }
        createEntry();
    }

export const updateEntry = (userid, runningEntryId, queryParams) => (dispatch, getState) => {
    let queryStr = ``;
    Object.keys(queryParams).map(key => queryStr += `${key}=${queryParams[key]}&`);

    const URL = `${baseUrl}/users/${userid}/entries/${runningEntryId}?${queryStr}`;
    dispatch(setIsFetching(true));

    axios.put(URL).then(resp => {
        dispatch(editEntries(resp.data));
        dispatch(setIsFetching(false));
        const state = getState().global;

        if (!state.isRunning && queryParams.stop && state.runningEntry === resp._id) {
            dispatch(setRunningEntry(null));
        }

    }).catch(err => dispatch(loadingError(err)));
}

export const removeEntry = (userid, entryid) => dispatch => {
    if (entryid.length !== 24) entryid = JSON.stringify(entryid);

    const url = `${baseUrl}/users/${userid}/entries/${entryid}/`;
    dispatch(setIsFetching(true));

    axios.delete(url).then(res => {
        let response;
        if (!Array.isArray(res.data)) response = [res.data];
        else response = res.data;

        dispatch(removeEntries(response));
        dispatch(setIsFetching(false));

    }).catch(err => dispatch(loadingError(err)));
}

export const createProject = (userid, name, color, client) => dispatch => {
    console.log(userid, name, color);
    color = color.split('').splice(1).join('');

    const url = `${baseUrl}/users/${userid}/projects/?name=${name}&color=${color}&client=${client}`;
    console.log(url);
    dispatch(setIsFetching(true));

    axios.post(url).then(res => {
        dispatch(setUserData(res.data));
        dispatch(setIsFetching(false));
    }).catch(err => dispatch(loadingError(err)));
}

export const removeProject = (userid, name) => dispatch => {
    name = JSON.stringify(name);

    const url = `${baseUrl}/users/${userid}/projects/?name=${name}`;
    console.log(url);
    dispatch(setIsFetching(true));

    axios.delete(url).then(res => {
        dispatch(setUserData(res.data));
        dispatch(setIsFetching(false));
    }).catch(err => dispatch(loadingError(err)));
}