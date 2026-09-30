import * as React from "react";
import type { SVGProps } from "react";
const SvgHouse = (props: SVGProps<SVGSVGElement>) => (
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
      d="m2.5 10 1.667-1.667m0 0L10 2.5l5.833 5.833m-11.666 0v8.334c0 .46.373.833.833.833h2.5m8.333-9.167L17.5 10m-1.667-1.667v8.334c0 .46-.373.833-.833.833h-2.5m-5 0c.46 0 .833-.373.833-.833v-3.334c0-.46.373-.833.834-.833h1.666c.46 0 .834.373.834.833v3.334c0 .46.373.833.833.833m-5 0h5"
    />
  </svg>
);
export default SvgHouse;
