import { Reducer, AnyAction } from 'redux';
import { Load } from './load.constants';
import { IState } from './load.types';

const INITIAL_STATE: IState = {
  loaded: false
};

export const loadReducer: Reducer = (
  state: IState = INITIAL_STATE,
  action: AnyAction
): IState => {
  switch (action.type) {
    case Load.LOADED: {
      return {
        ...state,
        loaded: true
      };
    }
    default:
      return state;
  }
};
