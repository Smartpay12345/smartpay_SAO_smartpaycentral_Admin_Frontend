import * as React from "react";
import type { SVGProps } from "react";
const SvgBell = (props: SVGProps<SVGSVGElement>) => (
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
      d="M12.499 14.167h4.166l-1.17-1.171a1.7 1.7 0 0 1-.496-1.198V9.167a5 5 0 0 0-3.334-4.716v-.284a1.667 1.667 0 0 0-3.333 0v.284a5 5 0 0 0-3.333 4.716v2.632c0 .449-.179.88-.496 1.197l-1.171 1.17h4.167m5 0V15a2.501 2.501 0 0 1-5 0v-.833m5 0h-5"
    />
  </svg>
);
export default SvgBell;
