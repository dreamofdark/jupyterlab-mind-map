import React, { PureComponent, ReactElement } from 'react';
import { INotebookCell } from '../cell';

interface IListProps {
  cells: INotebookCell[];
}

export class List extends PureComponent<IListProps> {
  static defaultProps: IListProps = {
    cells: []
  };

  handleOnItemClick = (cell: INotebookCell) => () => {
    cell.cellRef.node.classList.remove('border');
    cell.onClick();
  };

  handleOnMouseEnter = (cellRef: any) => () => {
    cellRef.node.classList.add('border');
  };

  handleOnMouseLeave = (cellRef: any) => () => {
    cellRef.node.classList.remove('border');
  };

  render(): ReactElement {
    const { cells } = this.props;

    const noCells =
      !cells || !cells.length || (cells.length === 1 && !cells[0].text);

    return (
      <div className="list">
        {noCells ? (
          <div className="listEmpty">Пока ячеек нет</div>
        ) : (
          <ol>
            {cells.map((cell: INotebookCell) => {
              if (!cell.text) {
                return;
              }
              return (
                <li
                  onClick={this.handleOnItemClick(cell)}
                  key={cell.cellRef.model.id}
                  onMouseLeave={this.handleOnMouseLeave(cell.cellRef)}
                  onMouseEnter={this.handleOnMouseEnter(cell.cellRef)}
                >
                  <div className="listText">
                    {cell.text.slice(0, 150)}
                    {cell.text.length > 150 ? '...' : ''}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }
}
