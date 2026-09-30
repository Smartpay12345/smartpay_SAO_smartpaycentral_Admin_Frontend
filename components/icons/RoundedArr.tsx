import * as React from "react";
import type { SVGProps } from "react";
const SvgRoundedArr = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    className="props.className"
    {...props}
  >
    <path
      fill="#006926"
      d="m5.733 9.733 4.7-4.7L9.5 4.1 5.733 7.867l-1.9-1.9L2.9 6.9zm.934 3.6a6.5 6.5 0 0 1-2.6-.525 6.7 6.7 0 0 1-2.117-1.425A6.7 6.7 0 0 1 .525 9.267 6.5 6.5 0 0 1 0 6.667q0-1.385.525-2.6A6.7 6.7 0 0 1 1.95 1.95q.9-.9 2.117-1.425A6.5 6.5 0 0 1 6.667 0q1.383 0 2.6.525 1.216.525 2.116 1.425t1.425 2.117q.525 1.215.525 2.6 0 1.383-.525 2.6a6.7 6.7 0 0 1-1.425 2.116q-.9.9-2.116 1.425a6.5 6.5 0 0 1-2.6.525m0-1.333q2.233 0 3.783-1.55T12 6.667t-1.55-3.784-3.783-1.55-3.784 1.55-1.55 3.784 1.55 3.783T6.667 12"
    />
  </svg>
);
export default SvgRoundedArr;
