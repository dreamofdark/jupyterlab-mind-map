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
      <div className="settings_block">
        <div
          className={classNames({
            settings_button: true,
            settings_buttonRed: true
          })}
          title="Сохранить"
          onClick={this.handleSave}
        >
          <div className="settings_buttonIcon">
            <div className="icon_save" />
          </div>
        </div>
        <div
          className={classNames({
            settings_button: true,
            settings_buttonDisable: !zoomInEnable
          })}
          title="Приблизить"
          onClick={this.handleZoomIn}
        >
          <div className="settings_buttonIcon">
            <div className="icon_zoom" />
          </div>
        </div>
        <div
          className={classNames({
            settings_button: true,
            settings_buttonDisable: !zoomOutEnable
          })}
          title="Удалить"
          onClick={this.handleZoomOut}
        >
          <div className="settings_buttonIcon">
            <div className="icon_minus" />
          </div>
        </div>
      </div>
    );
  }
}
