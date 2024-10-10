import type { SvgProps } from "@/utils/svg-wrapper";

import { Svg } from "@/utils/svg-wrapper";

export const LogoutIcon: React.FC<SvgProps> = ({ className, onClick }) => (
  <Svg width="24" height="24" viewBox="0 0 24 24" className={className} onClick={onClick}>
    <path
      d="M17.4399 14.62L19.9999 12.06L17.4399 9.5"
      stroke="inherit"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.76001 12.06L19.93 12.06"
      stroke="inherit"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.76 20C7.34001 20 3.76001 17 3.76001 12C3.76001 7 7.34001 4 11.76 4"
      stroke="inherit"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
