import * as React from "react";
import type { SVGProps } from "react";
const SvgInOut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 14"
    className="props.className"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M3.335 3.333h8m0 0L8.668.667m2.667 2.666L8.668 6m0 4h-8m0 0 2.667 2.666M.668 10l2.667-2.667"
    />
  </svg>
);
export default SvgInOut;
