import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {
    isLoading: true,
    isRunning: false,
    isUserLoggedIn: false,
    userData: {},
    runningEntry: null,
    runningEntryDescription: '',
    timer: '0:00:00'
}

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

store.subscribe(() => console.log('STORE UPDATED.', store.getState()));

export default store;