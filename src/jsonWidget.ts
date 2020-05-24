import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { ActivityMonitor } from '@jupyterlab/coreutils';
import { IDocumentManager } from '@jupyterlab/docmanager';

const RENDER_TIMEOUT = 1000;

export class JsonWidget extends Widget {
  private path: string;
  private dirname: string;
  private docmanager: IDocumentManager;
  private monitor: ActivityMonitor<any, any> | null;
  private data: any;
  private current: JsonWidget.ICurrentWidget | null;

  constructor(options: JsonWidget.IOptions) {
    super();
    this.docmanager = options.docmanager;
    this.path = options.path;
    this.dirname = options.dirname;
  }

  openDoc(): any {
    return new Promise((res, rej) => {
      const dataFile = this.docmanager.open(this.path);

      if (dataFile) {
        this.setCurrent({ widget: dataFile });

        dataFile.context.ready.then(() => {
          this.data = dataFile.context.model.toJSON();
          this.docmanager.closeFile(this.path);
          res(this.data);
        });
      } else {
        rej('no data file');
      }
    });
  }

  createDoc(): void {
    let createdPath: string;

    this.docmanager
      .newUntitled({
        ext: 'json',
        type: 'file',
        path: this.dirname
      })
      .then(data => {
        createdPath = data.path;
        return createdPath;
      })
      .then(path => {
        return this.docmanager.rename('/' + path, this.path);
      })
      .catch(() => {
        this.docmanager.deleteFile('/' + createdPath);
      });
  }

  getCurrent(): JsonWidget.ICurrentWidget | null {
    return this.current;
  }

  setCurrent(value: JsonWidget.ICurrentWidget | null) {
    if (value && this.current && this.current.widget === value.widget) {
      return;
    }

    this.current = value;

    if (this.monitor) {
      this.monitor.dispose();
      this.monitor = null;
    }

    if (!this.current) {
      this.update();
      return;
    }

    const context = this.docmanager.contextForWidget(this.current.widget);

    if (!context || !context.model) {
      throw Error('Could not find a context for json widget');
    }

    this.monitor = new ActivityMonitor({
      signal: context.model.contentChanged,
      timeout: RENDER_TIMEOUT
    });

    this.monitor.activityStopped.connect(this.update, this);
    this.update();
  }

  getData(): any {
    return this.data;
  }

  setData(data: any): void {
    const dataFile = this.docmanager.open(this.path);

    if (dataFile) {
      dataFile.context.ready.then(() => {
        dataFile.context.model.fromJSON(data);
        this.node.innerText = JSON.stringify(data);
        dataFile.context.save().then(() => {
          this.data = data;
          this.docmanager.closeFile(this.path);
        });
        this.update();
      });
    }
  }

  protected onAfterShow(msg: Message): void {
    this.update();
  }
}

export namespace JsonWidget {
  export interface IOptions {
    docmanager: IDocumentManager;
    path: string;
    dirname: string;
  }

  export interface ICurrentWidget<W extends Widget = Widget> {
    widget: W;
  }
}
