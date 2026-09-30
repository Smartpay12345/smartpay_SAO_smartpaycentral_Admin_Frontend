import * as React from "react";
import type { SVGProps } from "react";
const SvgStreamline = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M.715 10H15m-5-5 5 5-5 5m9.285-10v10"
    />
  </svg>
);
export default SvgStreamline;
