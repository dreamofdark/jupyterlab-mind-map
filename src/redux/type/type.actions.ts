import { AnyAction } from 'redux';
import { Type } from './type.constants';

export const setType = (payload: object): AnyAction => ({
  type: Type.SET,
  payload
});

export const initType = (payload: string): AnyAction => ({
  type: Type.INIT,
  payload
});
