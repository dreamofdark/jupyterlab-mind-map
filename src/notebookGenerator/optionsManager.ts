import { ISanitizer } from '@jupyterlab/apputils';
import { INotebookTracker } from '@jupyterlab/notebook';
import { MindMapCreatorPanel } from '../mindMapCreator';

interface IOptions {
  sanitizer: ISanitizer;
}

// Class for managing notebook  generator options.
class OptionsManager {
  constructor(
    widget: MindMapCreatorPanel,
    notebook: INotebookTracker,
    options: IOptions
  ) {
    this._widget = widget;
    this.sanitizer = options.sanitizer;
  }

  readonly sanitizer: ISanitizer;

  updateWidget() {
    this._widget.update();
  }

  initializeOptions() {
    this._widget.update();
  }

  private _widget: MindMapCreatorPanel;
}

export { OptionsManager };
