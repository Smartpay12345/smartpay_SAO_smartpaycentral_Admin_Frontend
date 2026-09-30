import * as React from "react";
import type { SVGProps } from "react";
const SvgBTank = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 11 8"
    className="props.className"
    {...props}
  >
    <path
      fill="#00468B"
      d="M2.5 8q-.625 0-1.062-.437A1.45 1.45 0 0 1 1 6.5H0V1Q0 .588.294.294A.96.96 0 0 1 1 0h7v2h1.5L11 4v2.5h-1q0 .624-.437 1.063A1.45 1.45 0 0 1 8.5 8q-.625 0-1.062-.437A1.45 1.45 0 0 1 7 6.5H4q0 .624-.437 1.063A1.45 1.45 0 0 1 2.5 8m0-1q.212 0 .356-.144A.48.48 0 0 0 3 6.5a.48.48 0 0 0-.144-.356A.48.48 0 0 0 2.5 6a.48.48 0 0 0-.356.144A.48.48 0 0 0 2 6.5q0 .213.144.356A.48.48 0 0 0 2.5 7M1 5.5h.4q.212-.225.488-.362A1.35 1.35 0 0 1 2.5 5q.338 0 .612.138.276.137.488.362H7V1H1zM8.5 7q.212 0 .356-.144A.48.48 0 0 0 9 6.5a.48.48 0 0 0-.144-.356A.48.48 0 0 0 8.5 6a.48.48 0 0 0-.356.144A.48.48 0 0 0 8 6.5q0 .213.144.356A.48.48 0 0 0 8.5 7M8 4.5h2.125L9 3H8z"
    />
  </svg>
);
export default SvgBTank;
