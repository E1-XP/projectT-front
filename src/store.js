import { applyMiddleware, createStore, compose } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { enableBatching } from 'redux-batched-actions';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import history from './history';

const initialState = {
    global: {
        isLoading: true,
        isRunning: false,
        isFetching: false,
        isUserLoggedIn: false,
        hasErrored: false,
        daysToShowLength: 10,
        allEntriesFetched: false,
        isTabActive: true,
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
        timerId: null,
        weekTimer: '0:00:00',
        weekTimerNum: 0
    }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(enableBatching(connectRouter(history)(rootReducer)), initialState,
    composeEnhancers(applyMiddleware(thunk, routerMiddleware(history))));

//store.subscribe(() => console.log('STORE UPDATED.', store.getState()));
//store.dispatch(actions.entry.createNewEntry('5aed60ebf94ad304ec8fc130', { start: 1544125670 }));
export default store;