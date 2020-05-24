export interface IMeta {
  name: string;
  author: string;
}

export interface IItem {
  id?: string;
  topic?: string;
  direction?: string;
  parentid?: string;
  expanded?: boolean;
  cell?: string;
  isroot?: boolean;
  'background-color'?: string;
}

export interface IMindMapData {
  meta: IMeta;
  format: 'node_array';
  data: IItem[];
  isOpen: boolean;
}

export interface IState {
  items: { [key: string]: IMindMapData | null };
}
