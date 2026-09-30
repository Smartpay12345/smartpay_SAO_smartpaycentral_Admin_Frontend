import * as React from "react";
import type { SVGProps } from "react";
const SvgComplete = (props: SVGProps<SVGSVGElement>) => (
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
      fill="#006926"
      d="m12.5 18.925-4.25-4.25 1.4-1.4 2.85 2.85 5.65-5.65 1.4 1.4zM18 9h-2V4h-2v3H4V4H2v14h6v2H2q-.824 0-1.412-.587A1.93 1.93 0 0 1 0 18V4q0-.824.588-1.412A1.93 1.93 0 0 1 2 2h4.175Q6.45 1.126 7.25.563A2.98 2.98 0 0 1 9 0a3 3 0 0 1 1.787.563q.788.563 1.063 1.437H16q.824 0 1.413.587Q18 3.176 18 4zM9 4q.424 0 .713-.288A.97.97 0 0 0 10 3a.97.97 0 0 0-.287-.712A.97.97 0 0 0 9 2a.97.97 0 0 0-.713.288A.97.97 0 0 0 8 3q0 .424.287.712Q8.576 4 9 4"
    />
  </svg>
);
export default SvgComplete;
