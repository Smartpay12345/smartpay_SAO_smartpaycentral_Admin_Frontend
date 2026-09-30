import * as React from "react";
import type { SVGProps } from "react";
const SvgSuccess = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    className="props.className"
    {...props}
  >
    <path
      fill="#006926"
      d="m17.2 29.2 14.1-14.1-2.8-2.8-11.3 11.3-5.7-5.7-2.8 2.8zM20 40q-4.15 0-7.8-1.575T5.85 34.15 1.575 27.8 0 20t1.575-7.8T5.85 5.85t6.35-4.275T20 0t7.8 1.575 6.35 4.275 4.275 6.35T40 20t-1.575 7.8-4.275 6.35-6.35 4.275T20 40"
    />
  </svg>
);
export default SvgSuccess;
