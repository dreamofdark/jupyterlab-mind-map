import {
  ILabShell,
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { INotebookTracker } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';

import { MindMapCreatorPanel } from './mindMapCreator';
import { createNotebookGenerator } from './notebookGenerator';
import { IMinMapRegistry, MindMapRegistry as Registry } from './registry';
import '../style/index.css';

enum CommandIDs {
  open = 'mind-map:open'
}

/**
 *
 * @private
 * @param app - Jupyter application
 * @param docmanager - document manager
 * @param labShell - Jupyter lab shell
 * @param restorer - application layout restorer
 * @param notebookTracker - notebook tracker
 * @param rendermime - rendered MIME registry
 * @returns mind map widget
 */
function activateMindMap(
  app: JupyterFrontEnd,
  docmanager: IDocumentManager,
  labShell: ILabShell,
  restorer: ILayoutRestorer,
  notebookTracker: INotebookTracker,
  rendermime: IRenderMimeRegistry
): IMinMapRegistry {
  const mindMap = new MindMapCreatorPanel({ docmanager });
  const registry = new Registry();
  const command = CommandIDs.open;
  const label = 'Open Mind-map Creator';

  mindMap.title.caption = 'Mind-map creator';
  mindMap.id = 'mind-map';
  mindMap.title.label = 'Mind-map creator';

  labShell.add(mindMap, 'left', { rank: 300 });
  restorer.add(mindMap, 'jyputerlab-mind-map');

  const notebookGenerator = createNotebookGenerator(
    notebookTracker,
    mindMap,
    rendermime.sanitizer
  );
  registry.add(notebookGenerator);

  app.commands.addCommand(command, {
    label: label,
    execute: () => {
      labShell.activateById(mindMap.id);
    }
  });

  labShell.currentChanged.connect(onConnect);

  app.contextMenu.addItem({
    command: CommandIDs.open,
    selector: '.jp-Notebook'
  });

  return registry;

  function onConnect() {
    const widget = app.shell.currentWidget;
    if (!widget) {
      return;
    }
    const generator = registry.hasGenerator(widget);
    if (!generator) {
      if (mindMap.current && mindMap.current.widget.isDisposed) {
        mindMap.current = null;
      }
      return;
    }
    mindMap.current = { widget, generator };
  }
}

const extension: JupyterFrontEndPlugin<IMinMapRegistry> = {
  id: 'jupyterlab-toc',
  autoStart: true,
  provides: IMinMapRegistry,
  requires: [
    IDocumentManager,
    ILabShell,
    ILayoutRestorer,
    INotebookTracker,
    IRenderMimeRegistry
  ],
  activate: activateMindMap
};

export default extension;
