import React, { PureComponent } from 'react';
import { ToolbarItem } from './ToolbarItem';
import { noop } from '../utils/helpers';
import { INotebookCell } from '../cell';

export interface IToolbarItem {
  text: string;
  icon: any;
  id: string;
}

const toolbarItems: IToolbarItem[] = [
  {
    text: 'Добавить узел',
    icon: <div className="iconPlus" />,
    id: 'add'
  },
  // {
  //   text: 'Add image',
  //   icon: <div className="iconImage" />,
  //   id: 'addImage'
  // },
  {
    text: 'Удалить узел',
    icon: <div className="iconTrash" />,
    id: 'delete'
  },
  {
    text: 'Добавить ссылку',
    icon: <div className="iconLink" />,
    id: 'addCell'
  },
  {
    text: 'Удалить ссылку',
    icon: <div className="iconUnlink" />,
    id: 'deleteCell'
  },
  {
    text: 'Скачать',
    icon: <div className="iconDownload" />,
    id: 'download'
  }
];

export interface IToolbarProps {
  onAdd: Function;
  onAddImage: Function;
  onDelete: Function;
  onDownload: Function;
  onAddCell: Function;
  onDeleteCell: Function;
  isEnabled: boolean;
  isRoot: boolean;
  cells: INotebookCell[];
}

export class Toolbar extends PureComponent<IToolbarProps> {
  static defaultProps: IToolbarProps = {
    onAdd: noop,
    onAddImage: noop,
    onDelete: noop,
    onDownload: noop,
    onAddCell: noop,
    onDeleteCell: noop,
    isEnabled: false,
    isRoot: false,
    cells: []
  };

  handleOnItemClick = (id: string) => {
    const {
      isEnabled,
      onAdd,
      onAddImage,
      onDelete,
      onDeleteCell,
      onDownload,
      isRoot
    } = this.props;

    switch (id) {
      case 'add':
        isEnabled && onAdd();
        break;
      case 'addImage':
        isEnabled && onAddImage();
        break;
      case 'delete':
        isEnabled && !isRoot && onDelete();
        break;
      case 'download':
        onDownload();
        break;
      case 'deleteCell':
        isEnabled && onDeleteCell();
        break;
    }
  };

  renderItem = (item: IToolbarItem) => {
    const { id, text, icon } = item;
    const deleteRoot = id === 'delete' && this.props.isRoot;
    const disableItem =
      id === 'add' ||
      id === 'addImage' ||
      id === 'addCell' ||
      id === 'delete' ||
      id === 'deleteCell';

    return (
      <ToolbarItem
        key={id}
        id={id}
        text={text}
        icon={icon}
        onItemClick={this.handleOnItemClick}
        disable={(!this.props.isEnabled && disableItem) || deleteRoot}
        list={id === 'addCell' ? this.props.cells : null}
        listClick={this.props.onAddCell}
      />
    );
  };

  render() {
    return (
      <div className="toolbar">
        {toolbarItems.map((item: IToolbarItem) => {
          return this.renderItem(item);
        })}
      </div>
    );
  }
}
