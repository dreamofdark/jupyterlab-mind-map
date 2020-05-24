import React, { PureComponent, ReactElement } from 'react';

interface IHeaderProps {
  title: string;
}

export class Header extends PureComponent<IHeaderProps> {
  static defaultProps: IHeaderProps = {
    title: ''
  };

  public render(): ReactElement {
    return <div className="title">{this.props.title}</div>;
  }
}
