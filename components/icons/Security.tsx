import * as React from "react";
import type { SVGProps } from "react";
const SvgSecurity = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 20"
    className="props.className"
    {...props}
  >
    <path
      fill="#5D3F3D"
      d="M8 20q-3.476-.875-5.737-3.988Q0 12.9 0 9.1V3l8-3 8 3v6.1q0 3.8-2.262 6.913Q11.475 19.124 8 20m0-2.1q2.6-.825 4.3-3.3T14 9.1V4.375l-6-2.25-6 2.25V9.1q0 3.025 1.7 5.5T8 17.9M6 14h4q.424 0 .713-.287A.97.97 0 0 0 11 13v-3a.97.97 0 0 0-.287-.713A.97.97 0 0 0 10 9V8q0-.824-.588-1.412A1.93 1.93 0 0 0 8 6q-.824 0-1.412.588A1.93 1.93 0 0 0 6 8v1a.97.97 0 0 0-.713.287A.97.97 0 0 0 5 10v3q0 .424.287.713Q5.576 14 6 14m1-5V8q0-.424.287-.713A.97.97 0 0 1 8 7q.424 0 .713.287Q9 7.576 9 8v1z"
    />
  </svg>
);
export default SvgSecurity;
