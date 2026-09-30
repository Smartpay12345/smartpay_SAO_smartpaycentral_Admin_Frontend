import * as React from "react";
import type { SVGProps } from "react";
const SvgCooking = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 18"
    className="props.className"
    {...props}
  >
    <path
      fill="#916F6C"
      d="M6 13h10q1.65 0 2.825-1.175T20 9t-1.175-2.825T16 5H6Q4.35 5 3.175 6.175T2 9t1.175 2.825T6 13M9 3h4V2H9zM6 18v-3q-2.5 0-4.25-1.75T0 9t1.75-4.25T6 3h1V2q0-.824.588-1.412A1.93 1.93 0 0 1 9 0h4q.825 0 1.412.588Q15 1.175 15 2v1h1q2.5 0 4.25 1.75T22 9t-1.75 4.25T16 15v3h-2v-3H8v3z"
    />
  </svg>
);
export default SvgCooking;
