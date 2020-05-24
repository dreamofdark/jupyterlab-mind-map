import { Cell } from '@jupyterlab/cells';

export interface INotebookCell {
  type: string;
  cellRef: Cell;
  text: string;
  id: string;
  onClick: () => void;
}
