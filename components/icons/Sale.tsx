import * as React from "react";
import type { SVGProps } from "react";
const SvgSale = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.5 15.833v-5c0-.92-.746-1.666-1.667-1.666H4.167c-.92 0-1.667.746-1.667 1.666v5c0 .92.746 1.667 1.667 1.667h1.666c.92 0 1.667-.746 1.667-1.667m0 0V7.5c0-.92.746-1.667 1.667-1.667h1.666c.92 0 1.667.747 1.667 1.667v8.333m-5 0c0 .92.746 1.667 1.667 1.667h1.666c.92 0 1.667-.746 1.667-1.667m0 0V4.167c0-.92.746-1.667 1.667-1.667h1.666c.92 0 1.667.746 1.667 1.667v11.666c0 .92-.746 1.667-1.667 1.667h-1.666c-.92 0-1.667-.746-1.667-1.667h-5"
    />
  </svg>
);
export default SvgSale;
