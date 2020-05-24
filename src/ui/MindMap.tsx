import React, { PureComponent, createRef, ReactElement } from 'react';
import { Toolbar } from './Toolbar';
import { Settings } from './Settings';
import { connect } from 'react-redux';
import { noop } from '../utils/helpers';
import { getItemsForMap } from '../redux/items/items.selectors';
import { pathOr, eqProps } from 'ramda';
import { AnyAction } from 'redux';
import { setItem, addCell, removeCell } from '../redux/items/items.actions';
import { INotebookCell } from '../cell';

interface IMindMapProps {
  path: string;
  items: any | null;
  allData: any;
  setMap: Function;
  cells: INotebookCell[];
  addCellToNode: Function;
  removeCellFromNode: Function;
  onSaveDocument: Function;
}

interface IMindMapState {
  jm: any | null;
  selectedNode: any;
  zoomIn: boolean;
  zoomOut: boolean;
}

interface IMindMapMapProps {
  items: any | null;
  allData: any;
}

const mapStateToProps = (
  state: any,
  props: IMindMapProps
): IMindMapMapProps => {
  const data = pathOr(null, [props.path], getItemsForMap(state));
  const items = pathOr(null, [props.path, 'data'], getItemsForMap(state));
  return {
    items: items,
    allData: data
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setMap: (file: string, data: object): AnyAction =>
    dispatch(setItem({ file, data })),
  addCellToNode: (file: string, nodeId: string, cellId: string): AnyAction =>
    dispatch(addCell({ file, nodeId, cellId })),
  removeCellFromNode: (file: string, nodeId: string): AnyAction =>
    dispatch(removeCell({ file, nodeId }))
});

export class MindMapComp extends PureComponent<IMindMapProps, IMindMapState> {
  private root = createRef<HTMLDivElement>();

  state: IMindMapState = {
    jm: null,
    selectedNode: null,
    zoomIn: true,
    zoomOut: true
  };

  static defaultProps: IMindMapProps = {
    path: '',
    allData: null,
    items: null,
    setMap: noop,
    cells: [],
    addCellToNode: noop,
    removeCellFromNode: noop,
    onSaveDocument: noop
  };

  componentDidMount(): void {
    if (this.root.current) {
      const options = {
        container: this.root.current,
        editable: true,
        theme: 'default'
      };

      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const jm = new jsMind(options);
      jm.show(this.props.allData);

      this.setState({ jm });
      console.log('JN = ', jm);
    }
  }

  componentDidUpdate(prevProps: IMindMapProps, prevState: IMindMapState): void {
    if (!eqProps('data', this.props.allData, prevProps.allData)) {
      console.log('COMPONENT DID UPDATE');
      this.state.jm.show(this.props.allData);
    }
  }

  componentWillUnmount(): void {
    const { path, setMap } = this.props;
    setMap(path, this.state.jm.get_data('node_array'));
  }

  handleOnClick = (): void => {
    const node = this.state.jm.get_selected_node();

    if (node) {
      if (node.data.cell) {
        const cell = this.props.cells.find(
          (item: any) => item.id === node.data.cell
        );
        if (cell) {
          cell.onClick();
        }
      }
      this.setState({ selectedNode: node });
    } else if (this.state.selectedNode !== null) {
      const { path, setMap } = this.props;
      setMap(path, this.state.jm.get_data('node_array'));

      this.setState({ selectedNode: null });
    }
  };

  handleOnBlur = (): void => {
    const { path, setMap } = this.props;
    setMap(path, this.state.jm.get_data('node_array'));
  };

  handleOnAdd = (): void => {
    const { selectedNode, jm } = this.state;
    if (selectedNode) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const id = jsMind.util.uuid.newid();
      const topic = `Тема ${selectedNode.children.length + 1}`;

      jm.add_node(selectedNode, id, topic);

      const { path, setMap } = this.props;
      setMap(path, jm.get_data('node_array'));
    }
  };

  handleOnDelete = (): void => {
    const { selectedNode, jm } = this.state;
    if (selectedNode) {
      jm.remove_node(selectedNode);
      this.setState({ selectedNode: null });

      const { path, setMap } = this.props;
      setMap(path, jm.get_data('node_array'));
    }
  };

  handleOnDownload = (): void => {
    this.state.jm.screenshot.shootDownload();
  };

  handleOnDeleteCell = (): void => {
    const { removeCellFromNode, path } = this.props;
    if (this.state.selectedNode) {
      removeCellFromNode(path, this.state.selectedNode.id);
    }
  };

  handleOnAddCell = (cellId: string): void => {
    const { selectedNode } = this.state;
    const { addCellToNode, path } = this.props;

    if (selectedNode) {
      addCellToNode(path, selectedNode.id, cellId);
    }
  };

  handleZoomIn = (): void => {
    if (this.state.jm.view.zoomIn()) {
      this.setState({ zoomOut: true });
    } else {
      this.setState({ zoomIn: false });
    }
  };

  handleZoomOut = (): void => {
    if (this.state.jm.view.zoomOut()) {
      this.setState({ zoomIn: true });
    } else {
      this.setState({ zoomOut: false });
    }
  };

  handleSave = (): void => {
    const { path, setMap, onSaveDocument } = this.props;
    setMap(path, this.state.jm.get_data('node_array'));
    onSaveDocument(this.state.jm.get_data('node_array'));
  };

  render(): ReactElement {
    const { selectedNode, zoomIn, zoomOut } = this.state;

    return (
      <div className="mindmap_root">
        <Toolbar
          isRoot={selectedNode && selectedNode.id === 'root'}
          isEnabled={selectedNode}
          onAdd={this.handleOnAdd}
          onAddCell={this.handleOnAddCell}
          onDelete={this.handleOnDelete}
          onDeleteCell={this.handleOnDeleteCell}
          onDownload={this.handleOnDownload}
          cells={this.props.cells}
        />
        <div className="mindmap_settings">
          <div
            ref={this.root}
            onClick={this.handleOnClick}
            className="mindmap_container"
            onBlur={this.handleOnBlur}
          />
          <Settings
            zoomInEnable={zoomIn}
            zoomOutEnable={zoomOut}
            onZoomIn={this.handleZoomIn}
            onZoomOut={this.handleZoomOut}
            onSave={this.handleSave}
          />
        </div>
      </div>
    );
  }
}

export const MindMap = connect(
  mapStateToProps,
  mapDispatchToProps
)(MindMapComp);
