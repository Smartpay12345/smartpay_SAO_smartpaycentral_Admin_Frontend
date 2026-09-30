import * as React from "react";
import type { SVGProps } from "react";
const SvgActivity = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.501 4.167H5.835c-.92 0-1.667.746-1.667 1.666v10c0 .92.746 1.667 1.667 1.667h8.333c.92 0 1.667-.746 1.667-1.667v-10c0-.92-.747-1.666-1.667-1.666h-1.667m-5 0c0 .92.746 1.666 1.667 1.666h1.667c.92 0 1.666-.746 1.666-1.666m-5 0c0-.92.746-1.667 1.667-1.667h1.667c.92 0 1.666.746 1.666 1.667M10.001 10h2.5m-2.5 3.333h2.5m-5-3.333h.009M7.5 13.333h.009"
    />
  </svg>
);
export default SvgActivity;
