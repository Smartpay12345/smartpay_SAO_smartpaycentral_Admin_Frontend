import * as React from "react";
import type { SVGProps } from "react";
const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 19 19"
    className="props.className"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#F97316"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.509}
        d="M9.759 7.263V8.93m0 3.334h.008m-5.781 3.333h11.546a1.667 1.667 0 0 0 1.444-2.5l-5.774-10a1.667 1.667 0 0 0-2.886 0l-5.774 10c-.641 1.11.16 2.5 1.444 2.5l5.773-8.334"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h18.106v18.106H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgWarning;
