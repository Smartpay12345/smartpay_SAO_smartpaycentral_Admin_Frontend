import * as React from "react";
import type { SVGProps } from "react";
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 16"
    className="props.className"
    {...props}
  >
    <path
      fill="#1E5EAC"
      d="M17 10V7h-3V5h3V2h2v3h3v2h-3v3zM8 8Q6.35 8 5.175 6.825T4 4t1.175-2.825T8 0t2.825 1.175T12 4t-1.175 2.825T8 8m-8 8v-2.8q0-.85.438-1.562.437-.713 1.162-1.088a15 15 0 0 1 3.15-1.163A13.8 13.8 0 0 1 8 9q1.65 0 3.25.387 1.6.388 3.15 1.163.724.375 1.162 1.087Q16 12.35 16 13.2V16zm2-2h12v-.8a.973.973 0 0 0-.5-.85q-1.35-.675-2.725-1.012a11.6 11.6 0 0 0-5.55 0Q3.85 11.675 2.5 12.35a.97.97 0 0 0-.5.85zm6-8q.825 0 1.412-.588Q10 4.826 10 4q0-.824-.588-1.412A1.93 1.93 0 0 0 8 2q-.824 0-1.412.587A1.93 1.93 0 0 0 6 4q0 .824.588 1.412Q7.175 6 8 6"
    />
  </svg>
);
export default SvgAdd;
