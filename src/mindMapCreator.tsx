import React, { ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { ActivityMonitor, PathExt } from '@jupyterlab/coreutils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { MindMapRegistry as Registry } from './registry';
import { App } from './App';
import { ReadonlyPartialJSONValue } from '@lumino/coreutils';
import { JsonWidget } from './jsonWidget';

const RENDER_TIMEOUT = 1000;

export class MindMapCreatorPanel extends Widget {
  private docmanager: IDocumentManager;
  private jsonWidget: JsonWidget;
  private monitor: ActivityMonitor<any, any> | null;
  private _current: MindMapCreator.ICurrentWidget | null;

  constructor(options: MindMapCreator.IOptions) {
    super();
    this.docmanager = options.docmanager;
    this.node.style.backgroundColor = 'white';
    this.node.style.marginTop = '30px';
  }

  get current(): MindMapCreator.ICurrentWidget | null {
    return this._current;
  }

  set current(value: MindMapCreator.ICurrentWidget | null) {
    if (
      value &&
      this._current &&
      this._current.widget === value.widget &&
      this._current.generator === value.generator
    ) {
      return;
    }

    this._current = value;

    if (this.monitor) {
      this.monitor.dispose();
      this.monitor = null;
    }

    if (!this._current) {
      this.update();
      return;
    }

    const context = this.docmanager.contextForWidget(this._current.widget);

    if (!context || !context.model) {
      throw Error('Could not find a context for the Mind-Map');
    }

    this.monitor = new ActivityMonitor({
      signal: context.model.contentChanged,
      timeout: RENDER_TIMEOUT
    });

    this.monitor.activityStopped.connect(this.update, this);
    this.update();

    const title = PathExt.basename(context.localPath);
    const dirname = PathExt.dirname(context.localPath);
    const ext = PathExt.extname(context.localPath);
    const documentName = PathExt.basename(title, ext) + '_mindmap.json';
    const newPath = '/' + dirname + (dirname ? '/' : '') + documentName;

    this.jsonWidget = new JsonWidget({
      docmanager: this.docmanager,
      path: newPath,
      dirname: dirname
    });
  }

  get generator() {
    if (this._current) {
      return this._current.generator;
    }
    return null;
  }

  protected onUpdateRequest(msg: Message): void {
    if (this._current) {
      const cells = this._current.generator.generate(this._current.widget);

      const context = this.docmanager.contextForWidget(this._current.widget);

      const title = PathExt.basename(context.localPath);

      const createDoc = () => {
        const data = this.jsonWidget.getData();

        if (!data) {
          this.jsonWidget.createDoc();
        }
      };

      const updateDoc = (newData: ReadonlyPartialJSONValue) => {
        this.jsonWidget.setData(newData);
      };

      const openDoc = (): any => {
        return new Promise((res, rej) => {
          this.jsonWidget
            .openDoc()
            .then((data: any) => {
              res(data);
            })
            .catch((e: any) => rej(e));
        });
      };

      if (context) {
        const reactHeader: ReactElement = (
          <Provider store={store}>
            <App
              title={title}
              path={context.localPath}
              cells={cells}
              onUpdate={updateDoc}
              onOpen={openDoc}
              onCreate={createDoc}
            />
          </Provider>
        );
        ReactDOM.render(reactHeader, this.node);
      }
    }
  }

  protected onAfterShow(msg: Message): void {
    this.update();
  }
}

export namespace MindMapCreator {
  export interface IOptions {
    docmanager: IDocumentManager;
  }

  export interface ICurrentWidget<W extends Widget = Widget> {
    widget: W;
    generator: Registry.IGenerator<W>;
  }
}
