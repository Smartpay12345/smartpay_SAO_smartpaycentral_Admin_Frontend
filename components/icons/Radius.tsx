import * as React from "react";
import type { SVGProps } from "react";
const SvgRadius = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#E50019"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M3.332 5.833v8.334c0 1.841 2.985 3.333 6.667 3.333s6.666-1.492 6.666-3.333V5.833m-13.333 0c0 1.842 2.985 3.334 6.667 3.334s6.666-1.492 6.666-3.334m-13.333 0c0-1.841 2.985-3.333 6.667-3.333s6.666 1.492 6.666 3.333m0 4.167c0 1.842-2.985 3.333-6.666 3.333S3.332 11.842 3.332 10"
    />
  </svg>
);
export default SvgRadius;
