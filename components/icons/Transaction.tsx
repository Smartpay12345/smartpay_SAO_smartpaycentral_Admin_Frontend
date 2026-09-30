import * as React from "react";
import type { SVGProps } from "react";
const SvgTransaction = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    className="props.className"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M6.665 5.833h10m0 0L13.332 2.5m3.333 3.333-3.333 3.334m0 5h-10m0 0L6.665 17.5m-3.333-3.333 3.333-3.334"
    />
  </svg>
);
export default SvgTransaction;
