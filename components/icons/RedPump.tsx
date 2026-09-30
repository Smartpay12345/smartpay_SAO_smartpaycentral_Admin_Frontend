import * as React from "react";
import type { SVGProps } from "react";
const SvgRedPump = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 15 15"
    className="props.className"
    {...props}
  >
    <path
      fill="#B8001D"
      d="M3.75 13.333 5.833 10h-1.25V7.5L2.5 10.833h1.25zm-2.083-7.5h5V1.667h-5zm0 7.5h5V7.5h-5zM0 15V1.667Q0 .979.49.49.979 0 1.667 0h5q.687 0 1.177.49.49.489.49 1.177V7.5h1.041q.604 0 1.031.427.427.428.427 1.031v3.855q0 .353.292.645t.646.292q.375 0 .656-.292t.281-.646V5H12.5a.8.8 0 0 1-.594-.24.8.8 0 0 1-.24-.593V2.5h.417V1.25h.834V2.5h.833V1.25h.833V2.5H15v1.667q0 .354-.24.593a.8.8 0 0 1-.593.24h-.209v7.813q0 .874-.635 1.53A2.08 2.08 0 0 1 11.77 15a2.09 2.09 0 0 1-1.542-.656q-.645-.657-.646-1.531V8.958q0-.104-.052-.156t-.156-.052H8.333V15zm6.667-1.667h-5z"
    />
  </svg>
);
export default SvgRedPump;
