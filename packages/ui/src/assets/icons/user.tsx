import type { SvgProps } from "@/utils/svg-wrapper";

import React from "react";

import { Svg } from "@/utils/svg-wrapper";

export const UserIcon: React.FC<SvgProps> = ({ className }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path
      d="M12.7002 12C15.4616 12 17.7002 9.76142 17.7002 7C17.7002 4.23858 15.4616 2 12.7002 2C9.93877 2 7.7002 4.23858 7.7002 7C7.7002 9.76142 9.93877 12 12.7002 12Z"
      fill="inherit"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M21.2903 22C21.2903 18.13 17.4403 15 12.7003 15C7.96035 15 4.11035 18.13 4.11035 22" fill="inherit" />
    <path
      d="M21.2903 22C21.2903 18.13 17.4403 15 12.7003 15C7.96035 15 4.11035 18.13 4.11035 22"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
