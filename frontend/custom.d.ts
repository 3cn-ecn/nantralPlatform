// module declarations for extra file types

declare module '*.svg' {
  import React = require('react');

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}
