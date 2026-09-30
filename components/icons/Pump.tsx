import * as React from "react";
import type { SVGProps } from "react";
const SvgPump = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 17 18"
    className="props.className"
    {...props}
  >
    <path
      fill="#1E5EAC"
      d="M0 18V2Q0 1.176.588.588A1.93 1.93 0 0 1 2 0h6q.825 0 1.412.588Q10 1.175 10 2v7h1q.825 0 1.412.588Q13 10.175 13 11v4.5q0 .424.287.712.288.288.713.288.424 0 .713-.288A.97.97 0 0 0 15 15.5V8.3q-.225.125-.475.162A3.5 3.5 0 0 1 14 8.5q-1.05 0-1.775-.725T11.5 6q0-.8.438-1.437.437-.638 1.162-.913L11 1.55 12.05.5l3.7 3.6q.375.375.563.875T16.5 6v9.5q0 1.05-.725 1.775T14 18t-1.775-.725T11.5 15.5v-5H10V18zM2 7h6V2H2zm12 0q.424 0 .713-.287A.97.97 0 0 0 15 6a.97.97 0 0 0-.287-.713A.97.97 0 0 0 14 5a.97.97 0 0 0-.713.287A.97.97 0 0 0 13 6q0 .424.287.713Q13.576 7 14 7M2 16h6V9H2zm6 0H2z"
    />
  </svg>
);
export default SvgPump;
