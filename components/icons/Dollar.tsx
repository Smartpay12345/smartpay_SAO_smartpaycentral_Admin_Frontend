import * as React from "react";
import type { SVGProps } from "react";
const SvgDollar = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="#CD0102"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="M10 6.667c-1.38 0-2.5.745-2.5 1.666S8.62 10 10 10s2.5.746 2.5 1.667c0 .92-1.12 1.666-2.5 1.666m0-6.666c.925 0 1.733.335 2.166.833M10 6.667v-.834m0 .834v6.666m0 0v.834m0-.834c-.925 0-1.733-.335-2.166-.833M17.5 10c0 4.14-3.36 7.5-7.5 7.5S2.5 14.14 2.5 10 5.86 2.5 10 2.5s7.5 3.36 7.5 7.5L10 6.667"
    />
  </svg>
);
export default SvgDollar;
