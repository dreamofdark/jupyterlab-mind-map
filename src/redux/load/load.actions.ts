import { AnyAction } from 'redux';
import { Load } from './load.constants';

export const setLoaded = (): AnyAction => ({
  type: Load.LOADED
});
