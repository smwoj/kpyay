import * as React from "react";

const isVersion = (s: string): boolean => {
  return s.match(/\d+\.\d+\.\d+/g) !== null;
};

export const CustomizedAxisTick = (props: {
  x: number;
  y: number;
  payload: { value: string };
}) => {
  const { x, y, payload } = props;
  const tickValue = payload.value;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={10}
        textAnchor="end"
        fill="#666"
        transform="rotate(-45)"
        fontSize={10}
      >
        {isVersion(tickValue) ? tickValue : tickValue.slice(0, 10)}
      </text>
    </g>
  );
};
