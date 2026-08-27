import { ScaleLinear } from "d3";
import { DataPoint } from "@/hooks/useTypingGame";

type GraphTooltipProps = {
  data: DataPoint;
  xScale: ScaleLinear<number, number>;
  innerWidth: number;
  showRaw: boolean;
  showBurst: boolean;
  showErrors: boolean;
};

export default function GraphTooltip({
  data,
  xScale,
  innerWidth,
  showRaw,
  showBurst,
  showErrors,
}: GraphTooltipProps) {
  const rows: { label: string; value: number; color: string }[] = [
    { label: "wpm", value: data.wpm, color: "var(--color-accent)" },
  ];

  // other optional data:
  if (showErrors) {
    rows.push({
      label: "errors",
      value: data.errors,
      color: "var(--color-incorrect)",
    });
  }
  if (showRaw) {
    rows.push({ label: "raw", value: data.raw, color: "var(--color-correct)" });
  }
  if (showBurst) {
    rows.push({
      label: "burst",
      value: data.burst,
      color: "var(--color-untyped)",
    });
  }

  // row dimensions:
  const rowHeight = 16;
  const padding = 8;
  const boxWidth = 90;
  const boxHeight = padding * 2 + 16 + rows.length * rowHeight;

  const rawX = xScale(data.second) + 10;
  const boxX = Math.min(rawX, innerWidth - boxWidth);
  const boxY = 10;

  return (
    <g
      transform={`translate(${boxX}, ${boxY})`}
      style={{ transition: "transform 120ms ease-out", pointerEvents: "none" }}
    >
      <rect
        width={boxWidth}
        height={boxHeight}
        rx={4}
        fill="#000"
        fillOpacity={0.85}
      />
      <text
        x={padding}
        y={padding + 12}
        fill="#fff"
        fontSize={11}
        fontWeight="bold"
      >
        {data.second}
      </text>
      {rows.map((row, i) => (
        <g
          key={row.label}
          transform={`translate(${padding}, ${padding + 16 + i * rowHeight + 10})`}
        >
          <rect width={8} height={8} fill={row.color} />
          <text x={12} y={8} fill="#fff" fontSize={10}>
            {row.label}: {row.value}
          </text>
        </g>
      ))}
    </g>
  );
}
