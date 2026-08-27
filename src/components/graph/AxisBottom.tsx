import { ScaleLinear } from "d3";

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  tickValues: number[];
};

const OVERSHOOT = 6;

export default function AxisBottom({
  xScale,
  innerHeight,
  tickValues,
}: AxisBottomProps) {
  return (
    <>
      {tickValues.map((tickValue) => (
        <g
          key={tickValue}
          //  xScale(tickValue) converts sec to x-pos pixel -> translate g there
          transform={`translate(${xScale(tickValue)}, 0)`}
        >
          {/* Vetical tick */}
          <line y1={-OVERSHOOT} y2={innerHeight + OVERSHOOT} stroke="#555" />

          <text
            y={innerHeight + 15}
            style={{
              textAnchor: "middle",
              fontSize: "10px",
              fill: "var(--color-untyped)",
            }}
          >
            {tickValue}
          </text>
        </g>
      ))}
    </>
  );
}
