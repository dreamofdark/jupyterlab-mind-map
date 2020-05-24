import { combineReducers } from 'redux';
import { typeReducer } from '../redux/type/type.reducers';
import { loadReducer } from '../redux/load/load.reducers';
import { itemsReducer } from '../redux/items/items.reducers';

export default combineReducers({
  type: typeReducer,
  load: loadReducer,
  items: itemsReducer
});
