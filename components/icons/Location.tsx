import * as React from "react";
import type { SVGProps } from "react";
const SvgLocation = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    className="props.className"
    {...props}
  >
    <path
      fill="#007AFD"
      d="M7.999 7.667a1.667 1.667 0 1 1 0-3.334 1.667 1.667 0 0 1 0 3.334m0-6.333A4.667 4.667 0 0 0 3.332 6c0 3.5 4.667 8.667 4.667 8.667S12.665 9.5 12.665 6A4.667 4.667 0 0 0 8 1.334"
    />
  </svg>
);
export default SvgLocation;
