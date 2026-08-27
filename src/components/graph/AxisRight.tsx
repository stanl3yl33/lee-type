import { ScaleLinear } from "d3";

type AxisRightProps = {
  scale: ScaleLinear<number, number>;
  innerWidth: number;
  tickValues: number[];
};

export default function AxisRight({
  scale,
  innerWidth,
  tickValues,
}: AxisRightProps) {
  return (
    <>
      {tickValues.map((tickValue) => (
        <g
          key={tickValue}
          transform={`translate(${innerWidth}, ${scale(tickValue)})`}
        >
          <text
            x={10}
            dy=".32em"
            style={{
              textAnchor: "start",
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
