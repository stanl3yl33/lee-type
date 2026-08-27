import { useState } from "react";
import { scaleLinear, line, curveMonotoneX, max, area } from "d3";
import { DataPoint } from "@/hooks/useTypingGame";
import GraphTooltip from "./GraphTooltip";
import AxisBottom from "./AxisBottom";
import AxisLeft from "./AxisLeft";
import AxisRight from "./AxisRight";

type ResultGraphProps = {
  wpmHistory: DataPoint[];
};

const margin = { top: 20, right: 55, bottom: 30, left: 45 };
const width = 600;
const height = 200;
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// picks sec for the x-axis
function getXTickValue(
  dataLength: number,
  targetTickCount: number = 12,
): number[] {
  if (dataLength <= targetTickCount) {
    return Array.from({ length: dataLength }, (_, i) => i + 1);
  }

  const step = Math.ceil(dataLength / targetTickCount);
  const values: number[] = [];
  for (let sec = 1; sec <= dataLength; sec += step) {
    values.push(sec);
  }
  return values;
}

// pick errors for error axis to prevent invalid tick selection from d3
function getErrorTickValues(
  maxErrors: number,
  targetTickCount: number = 4,
): number[] {
  if (maxErrors <= targetTickCount) {
    return Array.from({ length: maxErrors + 1 }, (_, i) => i);
  }

  const step = Math.ceil(maxErrors / targetTickCount);
  const values: number[] = [];
  for (let v = 0; v <= maxErrors; v += step) {
    values.push(v);
  }
  return values;
}

export function ResultGraph({ wpmHistory }: ResultGraphProps) {
  // toggle button states:
  const [autoScale, setAutoScale] = useState<boolean>(false);
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [showRaw, setShowRaw] = useState<boolean>(false);
  const [showBurst, setShowBurst] = useState<boolean>(false);

  // tracking the closest data point near the mouse
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);

  // edge case - no data:
  if (wpmHistory.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-untyped text-sm">
        no data
      </div>
    );
  }

  // convert data points into pixel positions via scaleLinear:
  // x = time | y = wpm
  const xScale = scaleLinear()
    .domain([1, wpmHistory.length]) // data point range
    .range([0, innerWidth]); // pixel range

  // const allWpm = wpmHistory.map((d) => d.wpm);
  // const allWpm = wpmHistory.flatMap((d) => [d.wpm, d.raw, d.burst]);

  const visibleValues = wpmHistory.flatMap((d) => [
    d.wpm,
    ...(showRaw ? [d.raw] : []),
    ...(showBurst ? [d.burst] : []),
  ]);

  const yDomain: [number, number] = autoScale
    ? [Math.min(...visibleValues), Math.max(...visibleValues)]
    : [0, Math.max(...visibleValues)];

  const yScale = scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0]) // reverse order b/c higher value = lower pixel pos
    .nice();

  const maxErrors = max(wpmHistory, (d) => d.errors) ?? 0;
  const hasErrors = maxErrors > 0;

  const errorScale = scaleLinear()
    .domain([0, hasErrors ? maxErrors : 1])
    .range([innerHeight, 0])
    .nice();

  const xTickValues = getXTickValue(wpmHistory.length);
  const yTickValues = yScale.ticks(4);
  const errorTickValues = getErrorTickValues(maxErrors);

  // wpm line based the data:
  const wpmLinePath = line<DataPoint>()
    .x((d) => xScale(d.second))
    .y((d) => yScale(d.wpm))
    .curve(curveMonotoneX)(wpmHistory);

  // raw (dotted line)
  const rawWpmLinePath = line<DataPoint>()
    .x((d) => xScale(d.second))
    .y((d) => yScale(d.raw))
    .curve(curveMonotoneX)(wpmHistory);

  // burst (another line + gradient on bottom of it)
  const burstLinePath = line<DataPoint>()
    .x((d) => xScale(d.second))
    .y((d) => yScale(d.burst))
    .curve(curveMonotoneX)(wpmHistory);

  const burstAreaPath = area<DataPoint>()
    .x((d) => xScale(d.second))
    .y0(innerHeight) // bottom axis
    .y1((d) => yScale(d.burst))
    .curve(curveMonotoneX)(wpmHistory);

  const handleMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect(); // pos of the graph
    const relativeX = e.clientX - rect.left; // pos of the mouse relative to the graph

    // mouse pos to graph pos
    const fraction = relativeX / rect.width;
    const internalX = fraction * innerWidth;

    // convert current pixel / point to second / datapoint
    const hoveredSecond = Math.round(xScale.invert(internalX));
    const clamped = Math.max(1, Math.min(wpmHistory.length, hoveredSecond)); // don't use sec if its out of bounds
    const point = wpmHistory.find((d) => d.second === clamped) ?? null;

    return setHoveredData(point);
    // setHoveredData((prev) => {
    //   if (prev?.second === point?.second) return prev; // same point, no-op
    //   return point;
    // });
  };

  const handleMouseLeave = () => setHoveredData(null);

  return (
    <div className="relative group">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <AxisLeft
            yScale={yScale}
            innerWidth={innerWidth}
            tickValues={yTickValues}
          />
          <AxisBottom
            xScale={xScale}
            innerHeight={innerHeight}
            tickValues={xTickValues}
          />
          {hasErrors && (
            <AxisRight
              scale={errorScale}
              innerWidth={innerWidth}
              tickValues={errorTickValues}
            />
          )}

          {/* labels */}
          <text
            transform={`translate(${-margin.left + 12}, ${innerHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            style={{ fontSize: "10px", fill: "var(--color-untyped)" }}
          >
            Words per Minute
          </text>
          <text
            transform={`translate(${innerWidth + margin.right - 8}, ${innerHeight / 2}) rotate(90)`}
            textAnchor="middle"
            style={{ fontSize: "10px", fill: "var(--color-untyped)" }}
          >
            Errors
          </text>

          {/* wpm line */}
          <path
            d={wpmLinePath ?? undefined}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={2}
          />
          {wpmHistory.map((d) => (
            <circle
              key={d.second}
              cx={xScale(d.second)}
              cy={yScale(d.wpm)}
              r={3}
              fill="var(--color-accent, #facc15)"
            />
          ))}

          {/* burst line */}
          {showBurst && (
            <>
              {/* shadow under line */}
              <path
                d={burstAreaPath ?? undefined}
                fill="var(--color-untyped, #888)"
                fillOpacity={0.15}
                stroke="none"
              />

              {/*  burst line itself */}
              <path
                d={burstLinePath ?? undefined}
                fill="none"
                stroke="var(--color-untyped, #888)"
                strokeWidth={1.5}
              />
              {wpmHistory.map((d) => (
                <circle
                  key={`burst-${d.second}`}
                  cx={xScale(d.second)}
                  cy={yScale(d.burst)}
                  r={3}
                  fill="var(--color-untyped, #888)"
                />
              ))}
            </>
          )}

          {/* raw line */}
          {showRaw && (
            <>
              <path
                d={rawWpmLinePath ?? undefined}
                stroke="var(--color-correct)"
                strokeDasharray="4 2"
                fill="none"
              />
              {wpmHistory.map((d) => (
                <circle
                  key={`raw-${d.second}`}
                  cx={xScale(d.second)}
                  cy={yScale(d.raw)}
                  r={3}
                  fill="var(--color-correct)"
                />
              ))}
            </>
          )}

          {/* error plots */}
          {showErrors &&
            wpmHistory
              .filter((d) => d.errors > 0)
              .map((d) => (
                <text
                  key={`err-${d.second}`}
                  x={xScale(d.second)}
                  y={errorScale(d.errors)}
                  textAnchor="middle"
                  dy=".35em"
                  style={{ fill: "var(--color-incorrect)", fontSize: "10px" }}
                >
                  &#10006;
                </text>
              ))}

          {/* hovering event */}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
          {hoveredData && (
            <GraphTooltip
              data={hoveredData}
              xScale={xScale}
              innerWidth={innerWidth}
              showRaw={showRaw}
              showBurst={showBurst}
              showErrors={showErrors}
            />
          )}
        </g>
      </svg>

      <div
        className="
          absolute bottom-1 right-1 flex gap-2
          opacity-0 group-hover:opacity-100
          transition-opacity duration-150
        "
      >
        <button
          onClick={() => setAutoScale((prev) => !prev)}
          className={`px-2 py-1 rounded text-xs ${
            autoScale ? "text-accent" : "text-untyped hover:text-correct"
          }`}
        >
          scale
        </button>

        <button
          onClick={() => setShowRaw((prev) => !prev)}
          className={`px-2 py-1 rounded text-xs ${
            showRaw ? "text-correct" : "text-untyped/40 line-through"
          }`}
        >
          raw
        </button>

        <button
          onClick={() => setShowBurst((prev) => !prev)}
          className={`px-2 py-1 rounded text-xs ${
            showBurst ? "text-untyped" : "text-untyped/40 line-through"
          }`}
        >
          burst
        </button>

        <button
          onClick={() => setShowErrors((prev) => !prev)}
          className={`px-2 py-1 rounded text-xs ${
            showErrors
              ? "text-[color:var(--color-incorrect)]"
              : "text-untyped/40 line-through"
          }`}
        >
          &#10006; errors
        </button>
      </div>
    </div>
  );
}
