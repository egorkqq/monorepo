import type { SvgProps } from "@/utils/svg-wrapper";

import React from "react";

import { Svg } from "@/utils/svg-wrapper";

export const AddIcon: React.FC<SvgProps> = ({ className }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M6.125 12H18.125" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.125 18V6" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
