import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';

import reducer, { initialState } from './reducers';

export interface IApplicationState {
    beSoon: string;
}

export default createStore(
    reducer,
    initialState as any,
    applyMiddleware(thunkMiddleware)
);
