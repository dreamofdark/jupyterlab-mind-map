import { IState } from './items.types';

const getItemsState = (state: any): IState => state.items;

export const getItemsForMap = (state: any) => getItemsState(state).items;
