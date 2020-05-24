import { Reducer, AnyAction } from 'redux';
import { Items } from './items.constants';
import { IState, IMindMapData } from './items.types';

const INITIAL_STATE: IState = {
  items: null
};

const INITIAL_DATA: IMindMapData = {
  meta: {
    author: 'Kazantseva Ksenia',
    name: 'Jupyter mind-map'
  },
  format: 'node_array',
  isOpen: true,
  data: [{ id: 'root', topic: 'Главная тема', isroot: true }]
};

const OPEN_DATA: IMindMapData = {
  meta: {
    author: 'Kazantseva Ksenia',
    name: 'Jupyter mind-map'
  },
  format: 'node_array',
  isOpen: true,
  data: []
};

export const itemsReducer: Reducer = (
  state: IState = INITIAL_STATE,
  action: AnyAction
): IState => {
  switch (action.type) {
    case Items.INIT: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.file]: INITIAL_DATA
        }
      };
    }
    case Items.OPEN: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.file]: OPEN_DATA
        }
      };
    }
    case Items.SET: {
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.file]: action.payload.data
        }
      };
    }
    case Items.ADD_CELL: {
      const fileNodes = state.items[action.payload.file].data;
      const newNodes = fileNodes.map(item => {
        if (item.id === action.payload.nodeId) {
          return {
            ...item,
            cell: action.payload.cellId,
            'background-color': '#7bcbff'
          };
        }
        return item;
      });

      const newData = {
        ...state.items[action.payload.file],
        data: newNodes
      };

      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.file]: newData
        }
      };
    }
    case Items.REMOVE_CELL: {
      const fileNodes = state.items[action.payload.file].data;
      const newNodes = fileNodes.map(item => {
        if (item.id === action.payload.nodeId) {
          return {
            ...item,
            cell: '',
            'background-color': null
          };
        }
        return item;
      });

      const newData = {
        ...state.items[action.payload.file],
        data: newNodes
      };

      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.file]: newData
        }
      };
    }
    default:
      return state;
  }
};
