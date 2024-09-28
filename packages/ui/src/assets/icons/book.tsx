import type { SvgProps } from "@/utils/svg-wrapper";

import React from "react";

import { Svg } from "@/utils/svg-wrapper";

export const BookIcon: React.FC<SvgProps> = ({ className }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path
      d="M3.59961 18V7C3.59961 3 4.59961 2 8.59961 2H15.5996C19.5996 2 20.5996 3 20.5996 7V17C20.5996 17.14 20.5996 17.28 20.5896 17.42"
      fill="inherit"
    />
    <path
      d="M3.59961 18V7C3.59961 3 4.59961 2 8.59961 2H15.5996C19.5996 2 20.5996 3 20.5996 7V17C20.5996 17.14 20.5996 17.28 20.5896 17.42"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.44961 15H20.5996V18.5C20.5996 20.43 19.0296 22 17.0996 22H7.09961C5.16961 22 3.59961 20.43 3.59961 18.5V17.85C3.59961 16.28 4.87961 15 6.44961 15Z"
      fill="inherit"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8.09961 7H16.0996" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.09961 10.5H13.0996" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
