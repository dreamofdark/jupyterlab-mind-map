import React, { PureComponent, createRef, RefObject, Fragment } from 'react';
import classNames from 'classnames';
import { noop } from '../utils/helpers';
import { INotebookCell } from '../cell';

interface IDropdownProps {
  parentRef: RefObject<HTMLDivElement>;
  list: INotebookCell[];
  close: Function;
  onItemClick: Function;
}

export class Dropdown extends PureComponent<IDropdownProps> {
  private rootRef = createRef<HTMLDivElement>();

  static defaultProps = {
    close: noop,
    onItemClick: noop
  };

  componentDidMount(): void {
    if (this.rootRef.current) {
      const right = 0;
      let top = 0;

      if (this.props.parentRef.current) {
        const el = this.props.parentRef.current;
        const elRect = el.getBoundingClientRect();
        top = elRect.height;
      }

      this.rootRef.current.style.top = `${top}px`;
      this.rootRef.current.style.right = `${right}px`;
    }

    document.addEventListener('click', this.handleOnDocumentClick);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.handleOnDocumentClick);
  }

  handleOnItemClick = (id: string, cellRef: any) => () => {
    this.props.onItemClick(id);
    cellRef.node.classList.remove('border');
  };

  handleOnMouseEnter = (cellRef: any) => () => {
    cellRef.node.classList.add('border');
  };

  handleOnMouseLeave = (cellRef: any) => () => {
    cellRef.node.classList.remove('border');
  };

  renderEmptyList = () => {
    return (
      <div
        className={classNames({
          dropdown_item: true,
          dropdown_empty: true
        })}
      >
        Нет ячеек
      </div>
    );
  };

  renderList = () => {
    return (
      <Fragment>
        {this.props.list.map((item: INotebookCell) => {
          if (item.text === '') {
            return;
          }

          let icon = null;

          switch (item.type) {
            case 'code':
              icon = (
                <div className="dropdown_itemIcon">
                  <div className="icon_code" />
                </div>
              );
              break;
            case 'markdown':
              icon = (
                <div className="dropdown_itemIcon">
                  <div className="icon_m" />
                </div>
              );
              break;
            default:
              icon = (
                <div className="dropdown_itemIcon">
                  <div className="icon_par" />
                </div>
              );
          }

          return (
            <div
              className="dropdown_item"
              key={item.id}
              onClick={this.handleOnItemClick(item.id, item.cellRef)}
              onMouseEnter={this.handleOnMouseEnter(item.cellRef)}
              onMouseLeave={this.handleOnMouseLeave(item.cellRef)}
            >
              {icon}
              <div className="dropdown_itemText">{item.text}</div>
            </div>
          );
        })}
      </Fragment>
    );
  };

  handleOnDocumentClick = (e: any): void => {
    let closeIt = true;
    let target = e.target;
    while (target && target.parentNode !== document) {
      if (
        target === this.rootRef.current ||
        (this.props.parentRef && target === this.props.parentRef.current)
      ) {
        closeIt = false;
        break;
      }
      target = target.parentNode;
    }

    if (closeIt) {
      this.props.close();
    }
  };

  render() {
    const { list } = this.props;
    return (
      <div className="dropdown_list" ref={this.rootRef}>
        {(!list || list.length === 0 || (list.length === 1 && !list[0].text)) &&
          this.renderEmptyList()}
        {this.renderList()}
      </div>
    );
  }
}
