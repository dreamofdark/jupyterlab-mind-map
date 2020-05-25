import React, { PureComponent, ReactElement } from 'react';
import classNames from 'classnames';
import { noop } from '../utils/helpers';

export enum ISwitchType {
  list = 'list',
  map = 'map'
}

interface ISwitchProps {
  tab: ISwitchType;
  onClick: Function;
}

export class Switch extends PureComponent<ISwitchProps> {
  static defaultProps = {
    tab: 'list',
    onClick: noop
  };

  handleOnClick = (id: string) => () => {
    if (this.props.tab !== id) {
      this.props.onClick(id);
    }
  };

  render(): ReactElement {
    const { tab } = this.props;
    return (
      <div className="switch">
        <div
          className={classNames({
            switchTab: true,
            switchTabActive: tab === ISwitchType.list
          })}
          onClick={this.handleOnClick(ISwitchType.list)}
        >
          Список
        </div>
        <div
          className={classNames({
            switchTab: true,
            switchTabActive: tab === ISwitchType.map
          })}
          onClick={this.handleOnClick(ISwitchType.map)}
        >
          Карта
        </div>
      </div>
    );
  }
}
