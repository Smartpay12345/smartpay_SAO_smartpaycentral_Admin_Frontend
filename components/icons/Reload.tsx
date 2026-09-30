import * as React from "react";
import type { SVGProps } from "react";
const SvgReload = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6.667 13.333q-2.792 0-4.73-1.937Q0 9.459 0 6.666q0-2.79 1.938-4.728T6.667 0q1.437 0 2.75.594a6.35 6.35 0 0 1 2.25 1.698V0h1.666v5.833H7.5V4.167H11a4.86 4.86 0 0 0-1.823-1.834 4.94 4.94 0 0 0-2.51-.666q-2.085 0-3.542 1.458-1.458 1.458-1.458 3.542t1.458 3.541q1.458 1.46 3.542 1.459 1.604 0 2.896-.917a4.84 4.84 0 0 0 1.812-2.417h1.75a6.58 6.58 0 0 1-2.375 3.605q-1.792 1.395-4.083 1.395"
    />
  </svg>
);
export default SvgReload;
