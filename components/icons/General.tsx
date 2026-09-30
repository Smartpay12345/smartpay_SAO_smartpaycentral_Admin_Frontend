import * as React from "react";
import type { SVGProps } from "react";
const SvgGeneral = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 18"
    className="props.className"
    {...props}
  >
    <path
      fill="#B8001D"
      d="M0 18V0h10v4h10v14zm2-2h6v-2H2zm0-4h6v-2H2zm0-4h6V6H2zm0-4h6V2H2zm8 12h8V6h-8zm2-6V8h4v2zm0 4v-2h4v2z"
    />
  </svg>
);
export default SvgGeneral;
