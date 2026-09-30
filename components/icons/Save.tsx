import * as React from "react";
import type { SVGProps } from "react";
const SvgSave = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 11 11"
    className="props.className"
    {...props}
  >
    <path
      fill="#fff"
      d="M10.5 2.333v7q0 .482-.343.824a1.12 1.12 0 0 1-.824.343H1.167q-.482 0-.824-.343A1.12 1.12 0 0 1 0 9.333V1.167Q0 .685.343.343.685 0 1.167 0h7zm-1.167.496L7.671 1.167H1.167v8.166h8.166zM5.25 8.75q.73 0 1.24-.51T7 7t-.51-1.24q-.51-.51-1.24-.51t-1.24.51T3.5 7q0 .73.51 1.24t1.24.51m-3.5-4.667H7V1.75H1.75zM1.167 2.83v6.504-8.166z"
    />
  </svg>
);
export default SvgSave;
