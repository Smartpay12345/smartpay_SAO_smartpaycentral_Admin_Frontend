import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 8"
    className="props.className"
    {...props}
  >
    <path
      fill="#D16B1E"
      d="M.933 0 0 .933 4.933 5.9 7.6 3.233l3.467 3.434H9.333V8h4V4H12v1.733l-4.4-4.4L4.933 4z"
    />
  </svg>
);
export default SvgArrowDown;
