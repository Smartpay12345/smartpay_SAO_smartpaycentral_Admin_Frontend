import * as React from "react";
import type { SVGProps } from "react";
const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 19 18"
    className="props.className"
    {...props}
  >
    <path
      fill="#B8001D"
      d="M2 18q-.824 0-1.412-.587A1.93 1.93 0 0 1 0 16V2Q0 1.176.588.588A1.93 1.93 0 0 1 2 0h14q.824 0 1.413.588Q18 1.175 18 2h-8Q8.225 2 7.113 3.112T6 6v6q0 1.775 1.112 2.887T10 16h8q0 .824-.587 1.413A1.93 1.93 0 0 1 16 18zm8-4q-.825 0-1.412-.588A1.93 1.93 0 0 1 8 12V6q0-.824.588-1.412A1.93 1.93 0 0 1 10 4h7q.824 0 1.413.588Q19 5.175 19 6v6q0 .825-.587 1.412A1.93 1.93 0 0 1 17 14zm3-3.5q.65 0 1.075-.425T14.5 9t-.425-1.075T13 7.5t-1.075.425T11.5 9t.425 1.075T13 10.5"
    />
  </svg>
);
export default SvgWallet;
