import * as React from "react";
import type { SVGProps } from "react";
const SvgRLoad = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 8 8"
    className="props.className"
    {...props}
  >
    <path
      fill="#291716"
      d="M0 8V7h1.375l-.2-.175a3.16 3.16 0 0 1-.913-1.312A4.4 4.4 0 0 1 0 4.024q0-1.388.831-2.469A3.9 3.9 0 0 1 3 .125v1.05q-.9.325-1.45 1.106A2.96 2.96 0 0 0 1 4.025q0 .563.212 1.094.213.531.663.981L2 6.225V5h1v3zm5-.125v-1.05a2.96 2.96 0 0 0 1.45-1.106A2.96 2.96 0 0 0 7 3.975q0-.563-.213-1.094a2.9 2.9 0 0 0-.662-.981L6 1.775V3H5V0h3v1H6.625l.2.175A3.88 3.88 0 0 1 8 3.975q0 1.388-.831 2.469A3.9 3.9 0 0 1 5 7.875"
    />
  </svg>
);
export default SvgRLoad;
