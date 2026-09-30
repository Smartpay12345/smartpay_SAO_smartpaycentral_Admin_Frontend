import * as React from "react";
import type { SVGProps } from "react";
const SvgHand = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 36 32"
    className="props.className"
    {...props}
  >
    <path fill="#111827" d="M0 25.68h24v-24H0z" />
  </svg>
);
export default SvgHand;
