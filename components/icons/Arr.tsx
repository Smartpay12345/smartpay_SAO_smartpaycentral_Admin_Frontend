import * as React from "react";
import type { SVGProps } from "react";
const SvgArr = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 12"
    className="props.className"
    {...props}
  >
    <g clipPath="url(#a)">
      <g clipPath="url(#b)">
        <path
          stroke="#16A34A"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={0.953}
          d="m2.383 4.93 3.5-3.5m0 0 3.5 3.5m-3.5-3.5v9"
        />
      </g>
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h11.442v11.442H0z" />
      </clipPath>
      <clipPath id="b">
        <path fill="#fff" d="M0 0h11.442v11.442H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgArr;
