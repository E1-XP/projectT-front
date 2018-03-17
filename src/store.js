import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {
    isLoading: true,
    isUserLoggedIn: false,
    isRunning: false,
    userData: {},
    timer: '0:00:00',
    runningEntry: null
}

const store = createStore(rootReducer, initialState, applyMiddleware(thunk));

store.subscribe(() => console.log('STORE UPDATED.', store.getState()));

export default store;