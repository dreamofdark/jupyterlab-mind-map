import React, { createRef, PureComponent, ReactElement } from 'react';
import { connect } from 'react-redux';
import { pathOr, isEmpty } from 'ramda';
import { AnyAction } from 'redux';
import { INotebookCell } from './cell';
import { Header } from './ui/Header';
import { ISwitchType, Switch } from './ui/Switch';
import { List } from './ui/List';
import { noop } from './utils/helpers';
import { EmptyMap } from './ui/EmptyMap';
import { MindMap } from './ui/MindMap';
import { getTabTypes } from './redux/type/type.selectors';
import { setType } from './redux/type/type.actions';
import { isLoaded } from './redux/load/load.selectors';
import { setLoaded } from './redux/load/load.actions';
import { getItemsForMap } from './redux/items/items.selectors';
import { openFile, setItem } from './redux/items/items.actions';

interface IAppProps {
  title: string;
  cells: INotebookCell[];
  onUpdate: Function;
  onOpen: Function;
  onCreate: Function;
  setType: Function;
  setLoaded: Function;
  isList: boolean;
  isLoad: boolean;
  items: any | null;
  openFile: Function;
  allData: any;
  setData: Function;
  path: string;
}

interface IAppMapProps {
  isList: boolean;
  isLoad: boolean;
  items: any | null;
  allData: any;
}

const mapStateToProps = (state: any, props: IAppProps): IAppMapProps => {
  const type = pathOr('list', [props.path], getTabTypes(state));
  const items = pathOr(null, [props.path, 'data'], getItemsForMap(state));
  const allData = pathOr(null, [props.path], getItemsForMap(state));
  return {
    isList: type === 'list',
    isLoad: isLoaded(state),
    items: items,
    allData: allData
  };
};

const mapDispatchToProps = (dispatch: any) => ({
  setType: (file: string, tab: string): AnyAction =>
    dispatch(setType({ file, tab })),
  setLoaded: (): AnyAction => dispatch(setLoaded()),
  openFile: (file: string): AnyAction => dispatch(openFile({ file })),
  setData: (file: string, data: any): AnyAction =>
    dispatch(setItem({ file, data }))
});

class AppComponent extends PureComponent<IAppProps> {
  private rootRef = createRef<HTMLDivElement>();

  static defaultProps: IAppProps = {
    title: '',
    cells: [],
    onUpdate: noop,
    onOpen: noop,
    setType: noop,
    isList: true,
    isLoad: false,
    setLoaded: noop,
    items: null,
    openFile: noop,
    allData: null,
    onCreate: noop,
    setData: noop,
    path: ''
  };

  componentDidMount(): void {
    this.createScript('default', 'https://unpkg.com/jsmind@0.4.6/js/jsmind.js');
    this.createScript(
      'drag',
      'https://unpkg.com/jsmind@0.4.6/js/jsmind.draggable.js'
    );
    this.createScript(
      'screen',
      'https://unpkg.com/jsmind@0.4.6/js/jsmind.screenshot.js'
    );
  }

  createScript = (file: string, src: string): void => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    document.head.appendChild(script);

    if (file === 'default') {
      script.onload = (): void => {
        this.props.setLoaded();
      };
    }
  };

  onOpenFile = (): void => {
    const { items, onOpen, allData, openFile, path, setData } = this.props;
    if (!items || isEmpty(items)) {
      if (!allData || (allData && !allData.isOpen)) {
        onOpen().then((data: any) => {
          openFile(path);
          if (data.meta && data.data && data.format) {
            setData(path, data);
          }
        });
      }
    }
  };

  handelSwitch = (tab: string): void => {
    this.props.setType(this.props.path, tab);
    if (tab === ISwitchType.map) {
      this.onOpenFile();
    }
  };

  handleOnSaveClick = (): void => {
    const { allData, onUpdate } = this.props;
    onUpdate(allData);
  };

  public render(): ReactElement {
    const {
      title,
      cells,
      isList,
      isLoad,
      items,
      onCreate,
      path,
      onUpdate
    } = this.props;

    return (
      <div className="app">
        <div className="appHeaderBlock">
          <Header title={title} />
          <Switch
            tab={isList ? ISwitchType.list : ISwitchType.map}
            onClick={this.handelSwitch}
          />
        </div>
        <div>
          {isList ? (
            <List cells={cells} />
          ) : (
            <div className="mapBlock" ref={this.rootRef}>
              {(!items || isEmpty(items)) && (
                <EmptyMap path={path} onClick={onCreate} />
              )}
              {isLoad && (items && !isEmpty(items)) && (
                <MindMap path={path} cells={cells} onSaveDocument={onUpdate} />
              )}
            </div>
          )}
        </div>
        <div className="appCreated">Created by Kazantseva Ksenia</div>
      </div>
    );
  }
}

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent);
