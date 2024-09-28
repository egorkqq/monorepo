import type { SvgProps } from "@/utils/svg-wrapper";

import React from "react";

import { Svg } from "@/utils/svg-wrapper";

export const Wallet2Icon: React.FC<SvgProps> = ({ className }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path
      d="M22.3 10.9702V13.0302C22.3 13.5802 21.86 14.0302 21.3 14.0502H19.34C18.26 14.0502 17.27 13.2602 17.18 12.1802C17.12 11.5502 17.36 10.9602 17.78 10.5502C18.15 10.1702 18.66 9.9502 19.22 9.9502H21.3C21.86 9.9702 22.3 10.4202 22.3 10.9702Z"
      fill="inherit"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.7798 10.55C17.3598 10.96 17.1198 11.55 17.1798 12.18C17.2698 13.26 18.2598 14.05 19.3398 14.05H21.2998V15.5C21.2998 18.5 19.2998 20.5 16.2998 20.5H7.2998C4.2998 20.5 2.2998 18.5 2.2998 15.5V8.5C2.2998 5.78 3.93981 3.88 6.48981 3.56C6.74981 3.52 7.0198 3.5 7.2998 3.5H16.2998C16.5598 3.5 16.8098 3.50999 17.0498 3.54999C19.6298 3.84999 21.2998 5.76 21.2998 8.5V9.95001H19.2198C18.6598 9.95001 18.1498 10.17 17.7798 10.55Z"
      fill="inherit"
      stroke="inherit"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13.2998 9H7.2998" stroke="inherit" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
