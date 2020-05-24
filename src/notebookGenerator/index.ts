import { INotebookTracker, NotebookPanel } from '@jupyterlab/notebook';
import { ISanitizer } from '@jupyterlab/apputils';
import { CodeCellModel, Cell } from '@jupyterlab/cells';
import CryptoJS from 'crypto-js';

import { MindMapCreatorPanel } from '../mindMapCreator';
import { INotebookCell } from '../cell';
import { OptionsManager } from './optionsManager';

function createNotebookGenerator(
  tracker: INotebookTracker,
  widget: MindMapCreatorPanel,
  sanitizer: ISanitizer
): any {
  const options = new OptionsManager(widget, tracker, {
    sanitizer: sanitizer
  });

  return {
    tracker,
    options: options,
    generate: generate
  };

  function generate(panel: NotebookPanel): any {
    const notebookCells: INotebookCell[] = [];

    for (let i = 0; i < panel.content.widgets.length; i++) {
      const cell: Cell = panel.content.widgets[i];
      const model = cell.model;

      const onClick = (line: number) => {
        return () => {
          panel.content.activeCellIndex = i;
          cell.node.scrollIntoView();
        };
      };

      const notebookCell: INotebookCell = {
        text: (model as CodeCellModel).value.text,
        onClick: onClick(0),
        cellRef: cell,
        type: model.type,
        id: CryptoJS.MD5((model as CodeCellModel).value.text)
          .toString()
          .slice(0, 13)
      };

      notebookCells.push(notebookCell);
    }

    return notebookCells;
  }
}

export { createNotebookGenerator };
