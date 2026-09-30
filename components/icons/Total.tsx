import * as React from "react";
import type { SVGProps } from "react";
const SvgTotal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 23 23"
    className="props.className"
    {...props}
  >
    <path
      stroke="#E50019"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.907}
      d="m19.813 6.86-8-4-8 4m16 0-8 4m8-4v10l-8 4m0-10-8-4m8 4v10m-8-14v10l8 4"
    />
  </svg>
);
export default SvgTotal;
