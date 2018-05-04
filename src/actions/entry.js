import consts from './types';
import axios from 'axios';
axios.defaults.withCredentials = true;

const baseUrl = `http://localhost:3001`;
//const baseUrl = `https://project--t.herokuapp.com`;

import { toggleTimer } from './timer';
import { setEntries, editEntries, removeEntries, setUserData } from './user';
import { loadingError } from './global';

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

export const createNewEntry = (userid, queryParams) => (dispatch, getState) => {
    let queryStr = ``;
    Object.keys(queryParams).map(key => queryStr += `${key}=${queryParams[key]}&`);

    const url = `${baseUrl}/users/${userid}/entries/new?${queryStr}`;
    console.log(url);

    axios.post(url).then(res => {
        const projects = getState().user.userData.projects;
        const projectObj = projects[projects.map(itm => itm.name)
            .findIndex(itm => itm === queryParams.project)];

        dispatch(setProject(projectObj));
        dispatch(setRunningEntry(res.data._id));
        dispatch(setRunningEntryDescription(queryParams.description || ""));
        dispatch(toggleTimer(true));
        dispatch(setBillable(queryParams.billable));

    }).catch(err => dispatch(loadingError(err)));
}

export const updateEntry = (userid, runningEntryId, queryParams) => dispatch => {
    let queryStr = ``;
    Object.keys(queryParams).map(key => queryStr += `${key}=${queryParams[key]}&`);

    const url = `${baseUrl}/users/${userid}/entries/${runningEntryId}/update?${queryStr}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(editEntries(res.data));
        if (queryParams.stop) dispatch(setRunningEntry(null));

    }).catch(err => dispatch(loadingError(err)));
}

export const removeEntry = (userid, entryid) => dispatch => {
    if (entryid.length !== 24) entryid = JSON.stringify(entryid);

    const url = `${baseUrl}/users/${userid}/entries/${entryid}/delete`;

    axios.post(url).then(res => {
        let response;
        if (!Array.isArray(res.data)) response = [res.data];
        else response = res.data;

        dispatch(removeEntries(response));
    }).catch(err => dispatch(loadingError(err)));
}

export const createProject = (userid, name, color, client) => dispatch => {
    console.log(userid, name, color);
    color = color.split('').splice(1).join('');

    const url = `${baseUrl}/users/${userid}/projects/new?name=${name}&color=${color}&client=${client}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(setUserData(res.data));
    }).catch(err => dispatch(loadingError(err)));
}

export const removeProject = (userid, name) => dispatch => {
    name = JSON.stringify(name);

    const url = `${baseUrl}/users/${userid}/projects/delete?name=${name}`;
    console.log(url);

    axios.post(url).then(res => {
        dispatch(setUserData(res.data));
    }).catch(err => dispatch(loadingError(err)));
}