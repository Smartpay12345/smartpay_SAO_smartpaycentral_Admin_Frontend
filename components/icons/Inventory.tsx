import * as React from "react";
import type { SVGProps } from "react";
const SvgInventory = (props: SVGProps<SVGSVGElement>) => (
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
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M7.501 14.167V12.5m2.5 1.667v-3.334m2.5 3.334v-5m1.667 8.333H5.835c-.92 0-1.667-.746-1.667-1.667V4.167c0-.92.746-1.667 1.667-1.667h4.655c.22 0 .433.088.589.244l4.512 4.512a.83.83 0 0 1 .244.589v7.988c0 .92-.747 1.667-1.667 1.667l-6.667-3.333"
    />
  </svg>
);
export default SvgInventory;
