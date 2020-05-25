import React, { PureComponent, ReactNode, createRef, Fragment } from 'react';
import { Dropdown } from './Dropdown';
import { noop } from '../utils/helpers';
import classNames from 'classnames';
import { INotebookCell } from '../cell';

interface IToolbarItemProps {
  disable: boolean;
  text: string;
  icon?: ReactNode;
  onItemClick: Function;
  id: string;
  list?: INotebookCell[] | null;
  listClick?: Function;
}

interface IToolbarItemState {
  isOpen: boolean;
}

export class ToolbarItem extends PureComponent<
  IToolbarItemProps,
  IToolbarItemState
> {
  private rootRef = createRef<HTMLDivElement>();

  static defaultProps = {
    disable: false,
    text: '',
    onItemClick: noop,
    id: 'item',
    listClick: noop
  };

  state = {
    isOpen: false
  };

  handleOnItemClick = () => {
    const { onItemClick, list, disable } = this.props;

    onItemClick(this.props.id);

    if (list && !disable) {
      this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }
  };

  closeDropdown = () => {
    this.setState({ isOpen: false });
  };

  render() {
    const { disable, text, icon, list, listClick } = this.props;
    const { isOpen } = this.state;

    return (
      <div
        className={classNames({
          toolbarItem: true,
          toolbarItemActive: isOpen,
          toolbarItemDisable: disable
        })}
        title={text}
        onClick={this.handleOnItemClick}
        ref={this.rootRef}
      >
        {icon ? (
          <div className="toolbarItemIcon">{icon}</div>
        ) : (
          <div className="toolbarItemText">{text}</div>
        )}
        {list && (
          <Fragment>
            <div className="toolbarDropdownIcon">
              <div className="iconDown" />
              {isOpen && (
                <Dropdown
                  parentRef={this.rootRef}
                  close={this.closeDropdown}
                  list={list}
                  onItemClick={listClick}
                />
              )}
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}
