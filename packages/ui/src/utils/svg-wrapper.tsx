import type { SVGAttributes } from "react";

export type SvgProps = SVGAttributes<SVGSVGElement>;

export const Svg: React.FC<SvgProps> = ({ children, ...otherProps }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20px" {...otherProps}>
    {children}
  </svg>
);
