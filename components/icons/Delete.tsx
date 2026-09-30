import * as React from "react";
import type { SVGProps } from "react";
const SvgDelete = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 12"
    className="props.className"
    {...props}
  >
    <path
      fill="#1A1C1E"
      d="M11.25 5.25v-1.5h4.5v1.5zM6 6a2.9 2.9 0 0 1-2.119-.881A2.9 2.9 0 0 1 3 3q0-1.237.881-2.119A2.9 2.9 0 0 1 6 0q1.237 0 2.119.881Q8.999 1.763 9 3q0 1.237-.881 2.119A2.9 2.9 0 0 1 6 6m-6 6V9.9q0-.638.328-1.172.329-.534.872-.816a11 11 0 0 1 2.363-.871Q4.763 6.75 6 6.75q1.238 0 2.438.29 1.2.291 2.362.872.543.282.872.816T12 9.9V12zm1.5-1.5h9v-.6a.73.73 0 0 0-.375-.638 9.8 9.8 0 0 0-2.044-.759 8.7 8.7 0 0 0-4.162 0 9.8 9.8 0 0 0-2.044.76.73.73 0 0 0-.375.637zm4.5-6q.619 0 1.06-.44.44-.44.44-1.06t-.44-1.06A1.44 1.44 0 0 0 6 1.5q-.618 0-1.06.44Q4.5 2.383 4.5 3q0 .62.44 1.06.442.44 1.06.44"
    />
  </svg>
);
export default SvgDelete;
