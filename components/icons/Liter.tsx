import * as React from "react";
import type { SVGProps } from "react";
const SvgLiter = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 20"
    className="props.className"
    {...props}
  >
    <path
      fill="#1E5EAC"
      d="M8.275 17q.3-.025.512-.238A.7.7 0 0 0 9 16.25a.74.74 0 0 0-.225-.562.72.72 0 0 0-.575-.188q-1.024.075-2.175-.562-1.15-.638-1.45-2.313a.74.74 0 0 0-.263-.45.75.75 0 0 0-.487-.175.72.72 0 0 0-.575.262q-.225.263-.15.613.425 2.275 2 3.25T8.275 17M8 20q-3.424 0-5.712-2.35T0 11.8q0-2.5 1.988-5.438T8 0q4.025 3.425 6.012 6.363Q16 9.3 16 11.8q0 3.5-2.287 5.85T8 20"
    />
  </svg>
);
export default SvgLiter;
