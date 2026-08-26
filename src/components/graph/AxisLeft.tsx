import { ScaleLinear } from "d3";

type AxisLeftProps = {
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
  tickValues: number[];
};
const OVERSHOOT = 6;

export default function AxisLeft({
  yScale,
  innerWidth,
  tickValues,
}: AxisLeftProps) {
  return (
    <>
      {tickValues.map((tickValue) => (
        <g key={tickValue} transform={`translate(0, ${yScale(tickValue)})`}>
          <line x1={-OVERSHOOT} x2={innerWidth + OVERSHOOT} stroke="#333" />
          <text
            x={-8}
            dy=".32em"
            style={{
              textAnchor: "end",
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
