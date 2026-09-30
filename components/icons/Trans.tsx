import * as React from "react";
import type { SVGProps } from "react";
const SvgTrans = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 20"
    className="props.className"
    {...props}
  >
    <path
      fill="#006926"
      d="M0 20V0l1.5 1.5L3 0l1.5 1.5L6 0l1.5 1.5L9 0l1.5 1.5L12 0l1.5 1.5L15 0l1.5 1.5L18 0v20l-1.5-1.5L15 20l-1.5-1.5L12 20l-1.5-1.5L9 20l-1.5-1.5L6 20l-1.5-1.5L3 20l-1.5-1.5zm3-5h12v-2H3zm0-4h12V9H3zm0-4h12V5H3z"
    />
  </svg>
);
export default SvgTrans;
