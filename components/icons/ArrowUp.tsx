import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowUp = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#006926"
      d="M.933 8 0 7.067 4.933 2.1 7.6 4.767l3.467-3.434H9.333V0h4v4H12V2.267l-4.4 4.4L4.933 4z"
    />
  </svg>
);
export default SvgArrowUp;
