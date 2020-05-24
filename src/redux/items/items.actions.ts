import { AnyAction } from 'redux';
import { Items } from './items.constants';

export const setItem = (payload: any): AnyAction => {
  const newPay = {
    file: payload.file,
    data: {
      ...payload.data,
      isOpen: true
    }
  };

  return {
    type: Items.SET,
    payload: newPay
  };
};

export const initItems = (payload: object): AnyAction => ({
  type: Items.INIT,
  payload
});

export const openFile = (payload: object): AnyAction => ({
  type: Items.OPEN,
  payload
});

export const addCell = (payload: {
  file: string;
  nodeId: string;
  cellId: string;
}): AnyAction => ({
  type: Items.ADD_CELL,
  payload
});
export const removeCell = (payload: {
  file: string;
  nodeId: string;
}): AnyAction => ({
  type: Items.REMOVE_CELL,
  payload
});
