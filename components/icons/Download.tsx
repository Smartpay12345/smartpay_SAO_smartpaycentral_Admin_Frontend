import * as React from "react";
import type { SVGProps } from "react";
const SvgDownload = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    className="props.className"
    {...props}
  >
    <path
      fill="#5D3F3D"
      d="M6.667 10 2.5 5.833l1.167-1.208 2.166 2.167V0H7.5v6.792l2.167-2.167 1.166 1.208zm-5 3.333q-.688 0-1.177-.49A1.6 1.6 0 0 1 0 11.668v-2.5h1.667v2.5h10v-2.5h1.666v2.5q0 .687-.49 1.177-.489.49-1.176.49z"
    />
  </svg>
);
export default SvgDownload;
