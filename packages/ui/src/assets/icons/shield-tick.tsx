import type { SvgProps } from "@/utils/svg-wrapper";

import React from "react";

import { Svg } from "@/utils/svg-wrapper";

export const ShieldTickIcon: React.FC<SvgProps> = ({ className }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M10.49 2.23 5.5 4.11c-1.15.43-2.09 1.79-2.09 3.01v7.43c0 1.18.78 2.73 1.73 3.44l4.3 3.21c1.41 1.06 3.73 1.06 5.14 0l4.3-3.21c.95-.71 1.73-2.26 1.73-3.44V7.12c0-1.23-.94-2.59-2.09-3.02l-4.99-1.87c-.85-.31-2.21-.31-3.04 0Z"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m9.05 11.87 1.61 1.61 4.3-4.3"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
