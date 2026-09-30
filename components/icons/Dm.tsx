import * as React from "react";
import type { SVGProps } from "react";
const SvgDm = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 17 18"
    className="props.className"
    {...props}
  >
    <path
      fill="#006926"
      d="M2.5 12v-1H0V9h5V7H1a.97.97 0 0 1-.712-.287A.97.97 0 0 1 0 6V2q0-.424.288-.712A.97.97 0 0 1 1 1h1.5V0h2v1H7v2H2v2h4q.424 0 .713.287Q7 5.576 7 6v4q0 .424-.287.713A.97.97 0 0 1 6 11H4.5v1zm7.45 6L5.7 13.75l1.4-1.4 2.85 2.85 5.65-5.65 1.4 1.4z"
    />
  </svg>
);
export default SvgDm;
