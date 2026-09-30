import * as React from "react";
import type { SVGProps } from "react";
const SvgTank = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 17 19"
    className="props.className"
    {...props}
  >
    <path
      fill="#CD0102"
      d="M0 0h3c.28 0 .53.11.71.29l2.08 2.09.8-.79C7 1.2 7.5 1 8 1h6c.5 0 1 .2 1.41.59l1 1C16.8 3 17 3.5 17 4v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-.5.2-1 .59-1.41l.79-.8L2.59 2H0zm8 3v2h6V3zm.41 6-2-2H5v1.41l2 2v3.18l-2 2V17h1.41l2-2h3.18l2 2H15v-1.41l-2-2v-3.18l2-2V7h-1.41l-2 2zM9 11h2v2H9z"
    />
  </svg>
);
export default SvgTank;
