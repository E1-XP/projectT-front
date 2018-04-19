import { applyMiddleware, createStore } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers';

import history from './history';

const initialState = {
    isLoading: true,
    isRunning: false,
    isUserLoggedIn: false,
    userData: {},
    settings: {},
    runningEntry: null,
    currentProject: '',
    runningEntryDescription: '',
    timer: '0:00:00',
    weekTimer: '0:00:00'
}

const store = createStore(rootReducer, initialState,
    applyMiddleware(thunk, routerMiddleware(history)));

store.subscribe(() => console.log('STORE UPDATED.', store.getState()));

export default store;