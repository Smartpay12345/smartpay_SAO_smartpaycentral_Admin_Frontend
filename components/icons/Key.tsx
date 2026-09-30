import * as React from "react";
import type { SVGProps } from "react";
const SvgKey = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 12"
    className="props.className"
    {...props}
  >
    <path
      fill="#B8001D"
      d="M6 12q-2.5 0-4.25-1.75T0 6t1.75-4.25T6 0q1.65 0 3.025.825A6.2 6.2 0 0 1 11.2 3H22v6h-2v3h-6V9h-2.8a6.2 6.2 0 0 1-2.175 2.175A5.77 5.77 0 0 1 6 12m0-2q1.65 0 2.65-1.012T9.85 7H16v3h2V7h2V5H9.85q-.2-.975-1.2-1.987T6 2 3.175 3.175 2 6t1.175 2.825T6 10m0-2q.824 0 1.412-.588Q8 6.826 8 6q0-.824-.588-1.412A1.93 1.93 0 0 0 6 4q-.824 0-1.412.588A1.93 1.93 0 0 0 4 6q0 .824.588 1.412Q5.175 8 6 8"
    />
  </svg>
);
export default SvgKey;
