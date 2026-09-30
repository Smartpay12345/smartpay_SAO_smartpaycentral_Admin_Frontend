import * as React from "react";
import type { SVGProps } from "react";
const SvgCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 16"
    className="props.className"
    {...props}
  >
    <path
      fill="#1A1C1E"
      d="M8.45 11.5q.626.625 1.575.588.95-.038 1.375-.688L17 3 8.6 8.6q-.65.45-.712 1.363-.063.912.562 1.537M3.1 16q-.55 0-1.013-.238a1.8 1.8 0 0 1-.737-.712 11.2 11.2 0 0 1-1-2.437A9.7 9.7 0 0 1 0 10q0-2.074.788-3.9a10.1 10.1 0 0 1 2.137-3.175Q4.275 1.575 6.1.788A9.7 9.7 0 0 1 10 0a9.6 9.6 0 0 1 3.85.775q1.8.775 3.15 2.113 1.35 1.337 2.15 3.125a9.6 9.6 0 0 1 .825 3.837 10 10 0 0 1-.312 2.688 9.8 9.8 0 0 1-1.038 2.512q-.275.475-.738.712a2.2 2.2 0 0 1-1.012.238z"
    />
  </svg>
);
export default SvgCircle;
