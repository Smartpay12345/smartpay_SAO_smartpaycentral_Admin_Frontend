import * as React from "react";
import type { SVGProps } from "react";
const SvgPerson = (props: SVGProps<SVGSVGElement>) => (
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
      d="M13.335 5.833A3.335 3.335 0 0 1 10 9.167a3.335 3.335 0 0 1-3.333-3.334A3.335 3.335 0 0 1 10.001 2.5a3.335 3.335 0 0 1 3.334 3.333M10 11.667A5.836 5.836 0 0 0 4.168 17.5h11.667A5.836 5.836 0 0 0 10 11.667"
    />
  </svg>
);
export default SvgPerson;
