declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.css' {
  interface Classes {
    [className: string]: string;
  }
  const classes: Classes;
  export = classes;
}

declare module 'crypto-js';
