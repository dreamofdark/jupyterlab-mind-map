import { IState } from './load.types';

const getLoadState = (state: any): IState => state.load;

export const isLoaded = (state: any) => getLoadState(state).loaded;
