import { Reducer, AnyAction } from 'redux';
import { Type } from './type.constants';
import { IState } from './type.types';

const INITIAL_STATE: IState = {
  type: null
};

export const typeReducer: Reducer = (
  state: IState = INITIAL_STATE,
  action: AnyAction
): IState => {
  switch (action.type) {
    case Type.INIT: {
      return {
        ...state,
        type: {
          ...state.type,
          [action.payload.file]: 'list'
        }
      };
    }
    case Type.SET: {
      return {
        ...state,
        type: {
          ...state.type,
          [action.payload.file]: action.payload.tab
        }
      };
    }
    default:
      return state;
  }
};
