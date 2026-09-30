import * as React from "react";
import type { SVGProps } from "react";
const SvgUpdate = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 18"
    className="props.className"
    {...props}
  >
    <path
      fill="#5D3F3D"
      d="M9 18q-1.874 0-3.512-.712a9.2 9.2 0 0 1-2.85-1.925 9.2 9.2 0 0 1-1.925-2.85A8.7 8.7 0 0 1 0 9q0-1.874.713-3.512a9.2 9.2 0 0 1 1.925-2.85A9.2 9.2 0 0 1 5.488.713 8.7 8.7 0 0 1 9 0a8.9 8.9 0 0 1 3.887.875A8.7 8.7 0 0 1 16 3.35V1h2v6h-6V5h2.75a7.4 7.4 0 0 0-2.525-2.2A6.75 6.75 0 0 0 9 2Q6.075 2 4.038 4.037T2 9t2.037 4.963T9 16q2.625 0 4.588-1.7Q15.55 12.6 15.9 10h2.05q-.376 3.425-2.937 5.713Q12.45 18 9 18m2.8-4.8L8 9.4V4h2v4.6l3.2 3.2z"
    />
  </svg>
);
export default SvgUpdate;
