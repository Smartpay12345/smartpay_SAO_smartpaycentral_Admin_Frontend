import * as React from "react";
import type { SVGProps } from "react";
const SvgInv = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#E50019"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M15.833 17.5V4.167c0-.92-.746-1.667-1.666-1.667H5.833c-.92 0-1.666.746-1.666 1.667V17.5m11.666 0H17.5m-1.667 0h-4.166m-7.5 0H2.5m1.667 0h4.166M7.5 5.833h.833M7.5 9.167h.833m2.5-3.334h.834m-.834 3.334h.834M7.5 15.833h6.667"
    />
  </svg>
);
export default SvgInv;
