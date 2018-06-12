import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux'
import { enableBatching } from 'redux-batched-actions';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import history from './history';

const initialState = {
    global: {
        isLoading: true,
        isRunning: false,
        isUserLoggedIn: false,
        hasErrored: false,
        daysToShowLength: 10,
        allEntriesFetched: false,
        isOnline: true
    },
    entry: {
        runningEntry: null,
        currentProject: '',
        billable: false,
        runningEntryDescription: ''
    },
    user: {
        userData: {},
        entries: [],
        mappedItems: {},
        projects: [],
        settings: {
            shouldShowTimerOnTitle: true
        }
    },
    timer: {
        timer: '0:00:00',
        weekTimer: '0:00:00'
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(enableBatching(rootReducer), initialState,
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history))));

//store.subscribe(() => console.log('STORE UPDATED.', store.getState()));
//store.dispatch(createNewEntry('5aed60ebf94ad304ec8fc130', { start: 1528231257000 }));
export default store;