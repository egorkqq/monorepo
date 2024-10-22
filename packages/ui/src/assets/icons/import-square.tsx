import type { SvgProps } from "@/utils/svg-wrapper";

import React from "react";

import { Svg } from "@/utils/svg-wrapper";

export const ImportSquareIcon: React.FC<SvgProps> = ({ className }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      stroke="inherit"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M22 2l-8.2 8.2M13 6.17V11h4.83"
    />
    <path
      stroke="inherit"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M11 2H9C4 2 2 4 2 9v6c0 5 2 7 7 7h6c5 0 7-2 7-7v-2"
    />
  </Svg>
);
