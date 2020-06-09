import { IApplicationState } from './index';
import { IAction, ACTIONS } from '../common/types';

export const initialState = {
    beSoon: 'beSoon'
};

const appReducer = (
    state: IApplicationState = initialState,
    action: IAction
) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default appReducer;
