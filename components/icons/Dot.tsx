import * as React from "react";
import type { SVGProps } from "react";
const SvgDot = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 8 8"
    className="props.className"
    {...props}
  >
    <rect width={7.716} height={7.716} fill="#006926" rx={3.858} />
  </svg>
);
export default SvgDot;
