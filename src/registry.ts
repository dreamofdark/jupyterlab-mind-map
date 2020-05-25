import { IWidgetTracker } from '@jupyterlab/apputils';
import { Token } from '@lumino/coreutils';
import { Widget } from '@lumino/widgets';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
export type IMinMapRegistry = MindMapRegistry;

/* tslint:disable */
export const IMinMapRegistry = new Token<MindMapRegistry>(
  'jupyterlab_extension/mindmapcreator:IMinMapRegistry'
);
/* tslint:enable */

export class MindMapRegistry {
  private generator: MindMapRegistry.IGenerator;

  hasGenerator(widget: Widget): MindMapRegistry.IGenerator | undefined {
    if (this.generator.tracker.has(widget)) {
      return this.generator;
    }
  }

  add(generator: MindMapRegistry.IGenerator): void {
    this.generator = generator;
  }
}

export namespace MindMapRegistry {
  export abstract class IOptionsManager {}

  export interface IGenerator<W extends Widget = Widget> {
    tracker: IWidgetTracker<W>;
    isEnabled?: (widget: W) => boolean;
    options?: IOptionsManager;
    generate(widget: W): any;
  }
}
