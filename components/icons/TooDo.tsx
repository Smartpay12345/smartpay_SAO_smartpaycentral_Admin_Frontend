import * as React from "react";
import type { SVGProps } from "react";
const SvgTooDo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 106 106"
    className="props.className"
    {...props}
  >
    <g filter="url(#a)">
      <rect
        width={70.629}
        height={70.629}
        x={17.656}
        y={14.126}
        fill="#53E16F"
        fillOpacity={0.2}
        rx={35.314}
        shapeRendering="crispEdges"
      />
      <path
        fill="#006926"
        d="m52.513 60.983 14.1-14.1-2.8-2.8-11.3 11.3-5.7-5.7-2.8 2.8zm2.8 10.8q-4.15 0-7.8-1.575t-6.35-4.275-4.275-6.35q-1.575-3.651-1.575-7.8 0-4.15 1.575-7.8t4.275-6.35 6.35-4.275 7.8-1.575 7.8 1.575 6.35 4.275 4.275 6.35 1.575 7.8-1.576 7.8-4.274 6.35-6.35 4.275-7.8 1.575"
      />
    </g>
    <defs>
      <filter
        id="a"
        width={105.943}
        height={105.943}
        x={-0.001}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={3.531} />
        <feGaussianBlur stdDeviation={8.829} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_439_3728"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_439_3728"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgTooDo;
