import { createStore, applyMiddleware } from 'redux'

import thunk from 'redux-thunk'
import logger from 'redux-logger'
import promise from 'redux-promise-middleware'

import reducer from './reducers'

const initialState = {};
const middleware = applyMiddleware(promise, thunk, logger);

export default createStore(
    reducer,
    initialState,
    middleware
);
