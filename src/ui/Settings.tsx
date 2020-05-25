import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { noop } from '../utils/helpers';

interface ISettingsProps {
  onZoomIn: Function;
  onZoomOut: Function;
  zoomInEnable: boolean;
  zoomOutEnable: boolean;
  onSave: Function;
}

export class Settings extends PureComponent<ISettingsProps> {
  static defaultProps = {
    zoomInEnable: true,
    zoomOutEnable: true,
    onZoomIn: noop,
    onZoomOut: noop,
    onSave: Function
  };

  handleZoomIn = (): void => {
    if (this.props.zoomInEnable) {
      this.props.onZoomIn();
    }
  };

  handleZoomOut = (): void => {
    if (this.props.zoomOutEnable) {
      this.props.onZoomOut();
    }
  };

  handleSave = (): void => {
    this.props.onSave();
  };

  render() {
    const { zoomInEnable, zoomOutEnable } = this.props;
    return (
      <div className="settingsBlock">
        <div
          className={classNames({
            settingsButton: true,
            settingsButtonRed: true
          })}
          title="Сохранить"
          onClick={this.handleSave}
        >
          <div className="settingsButtonIcon">
            <div className="iconSave" />
          </div>
        </div>
        <div
          className={classNames({
            settingsButton: true,
            settingsButtonDisable: !zoomInEnable
          })}
          title="Приблизить"
          onClick={this.handleZoomIn}
        >
          <div className="settingsButtonIcon">
            <div className="iconZoom" />
          </div>
        </div>
        <div
          className={classNames({
            settingsButton: true,
            settingsButtonDisable: !zoomOutEnable
          })}
          title="Отдалить"
          onClick={this.handleZoomOut}
        >
          <div className="settingsButtonIcon">
            <div className="iconMinus" />
          </div>
        </div>
      </div>
    );
  }
}
