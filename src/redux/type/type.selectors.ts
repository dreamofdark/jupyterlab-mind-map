import { IState } from './type.types';

const getTypeState = (state: any): IState => state.type;

export const getTabTypes = (state: any) => getTypeState(state).type;
