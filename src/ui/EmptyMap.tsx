import React, { PureComponent, ReactElement } from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import { initItems } from '../redux/items/items.actions';
import { noop } from '../utils/helpers';

interface IEmptyMapProps {
  path: string;
  initMap: Function;
  onClick: Function;
}

const mapDispatchToProps = (dispatch: any) => ({
  initMap: (file: string): AnyAction => dispatch(initItems({ file }))
});

export class EmptyMapComp extends PureComponent<IEmptyMapProps> {
  static defaultProps = {
    path: '',
    initMap: noop,
    onClick: noop
  };

  handleClick = (): void => {
    const { initMap, path, onClick } = this.props;
    onClick();
    initMap(path);
  };

  render(): ReactElement {
    return (
      <div className="emptymap" onClick={this.handleClick}>
        <div className="emptymap_text">Создать карту</div>
        <div className="emptymap_img" />
      </div>
    );
  }
}

export const EmptyMap = connect(
  null,
  mapDispatchToProps
)(EmptyMapComp);
