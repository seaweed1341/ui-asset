import { useState, type ReactNode } from 'react';
import { ChartAxisUnit, ChartAxisX, ChartAxisY, ChartGridLines } from './ChartAxes';
import {
  ChartFigure,
  SeriesLegend,
  summarize,
  toRows,
  useSeriesState,
  type CartesianChartProps,
  type ColoredSeries,
} from './ChartFigure';
import { ChartTooltip, ChartTooltipRow } from './ChartTooltip';
import { chartColor } from './palette';
import { defaultFormat, niceScale, textWidth } from './scale';

/**
 * Figma: `graph/line` · `graph/area` · `element/line_graph` (count 2~10 × color default|dark|light|grey)
 *   element/line_start · line_center · line_end : 열 가운데를 잇는 1px 선 조각 → 여기서는 실제 polyline으로 그립니다.
 *   line_graph color : dark neutral-100 · grey neutral-70 · default neutral-40 · light neutral-20
 *   element/dot_chart: normal 지름 5.4 (계열 색) / selected neutral-10 채움 + 1.34px neutral-100 테두리 (+ ♦ tootip)
 *   graph/area       : 면 neutral-70 @50% + 윗선 1.34px neutral-70, 그래프 폭 전체(좌우 끝까지)를 채움
 */
export interface LineChartProps extends CartesianChartProps {
  /** element/dot_chart 점 표시 */
  showPoints?: boolean;
}

export interface AreaChartProps extends CartesianChartProps {
  /** 계열을 위로 누적 */
  stacked?: boolean;
  /** 면 윗선 표시 (Figma graph/area: 1.34px) */
  showLine?: boolean;
}

const DOT_R = 2.7;

interface Layout {
  pl: number;
  pr: number;
  pt: number;
  pb: number;
  x: (i: number) => number;
  y: (v: number) => number;
  band: number;
}

/** 선·면 차트 공통 축/격자/hover 틀 */
function CartesianPlot({
  props,
  kind,
  colored,
  visible,
  toggle,
  dataMax,
  render,
  anchorY,
}: {
  props: CartesianChartProps;
  kind: string;
  colored: ColoredSeries[];
  visible: ColoredSeries[];
  toggle: (name: string) => void;
  dataMax: number;
  render: (l: Layout, active: number | null) => ReactNode;
  anchorY: (i: number, l: Layout) => number;
}) {
  const {
    categories,
    max: fixedMax,
    tickCount = 6,
    height = 156,
    showXAxis = true,
    showYAxis = true,
    xUnit,
    yUnit,
    formatValue = defaultFormat,
    className,
  } = props;
  const [active, setActive] = useState<number | null>(null);
  const { max, ticks } = niceScale(dataMax, tickCount, fixedMax);
  const n = categories.length;
  const showLegend = props.legend ?? colored.length > 1;
  const label = props['aria-label'] ?? summarize(kind, categories, visible, formatValue);

  return (
    <ChartFigure
      className={className}
      label={label}
      rows={toRows(categories, visible)}
      columns={visible.map((s) => s.name)}
      format={formatValue}
      legend={showLegend ? <SeriesLegend colored={colored} onToggle={toggle} /> : undefined}
      active={active}
      onActiveChange={setActive}
    >
      {(W) => {
        const unitW = yUnit ? 14 : 0;
        const yLabelW = showYAxis ? Math.max(...ticks.map((t) => textWidth(formatValue(t), 8)), 5) : 0;
        const pl = unitW + yLabelW + (showYAxis ? 5 : 0);
        const pr = Math.max(pl + 10, W - 2);
        const pt = 7;
        const pb = Math.max(pt + 10, height - (showXAxis ? 15 : 2) - (xUnit ? 14 : 0));
        const band = (pr - pl) / Math.max(1, n);
        const l: Layout = {
          pl,
          pr,
          pt,
          pb,
          band,
          x: (i) => pl + band * (i + 0.5),
          y: (v) => pb - (Math.max(0, v) / max) * (pb - pt),
        };
        const tickPos = ticks.map((t) => l.y(t));
        return (
          <>
            <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} overflow="visible" aria-hidden="true" className="block">
              <ChartGridLines positions={tickPos.slice(1)} from={pl} to={pr} baseline={pb} />
              {showYAxis && <ChartAxisY x={pl - 5} labels={ticks.map((t, i) => ({ at: tickPos[i], text: formatValue(t) }))} />}
              {showXAxis && <ChartAxisX y={pb + 1} labels={categories.map((c, i) => ({ at: l.x(i), text: c }))} />}
              {yUnit && <ChartAxisUnit text={yUnit} x={6} y={(pt + pb) / 2} rotate />}
              {xUnit && <ChartAxisUnit text={xUnit} x={(pl + pr) / 2} y={height - 7} />}
              {active !== null && (
                <line
                  x1={l.x(active)}
                  x2={l.x(active)}
                  y1={pt}
                  y2={pb}
                  stroke={chartColor('neutral-40')}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  shapeRendering="crispEdges"
                />
              )}
              {render(l, active)}
              {categories.map((c, i) => (
                <rect
                  key={c + i}
                  x={l.x(i) - band / 2}
                  y={pt}
                  width={band}
                  height={pb - pt}
                  fill="transparent"
                  onMouseEnter={() => setActive(i)}
                />
              ))}
            </svg>
            {active !== null && active < n && visible.length > 0 && (
              <ChartTooltip x={l.x(active)} y={anchorY(active, l) - DOT_R - 3} title={categories[active]}>
                {visible.map((s) => (
                  <ChartTooltipRow
                    key={s.name}
                    color={visible.length > 1 ? chartColor(s.token) : undefined}
                    name={visible.length > 1 ? s.name : undefined}
                    value={formatValue(s.data[active] ?? 0)}
                  />
                ))}
              </ChartTooltip>
            )}
          </>
        );
      }}
    </ChartFigure>
  );
}

export function LineChart(props: LineChartProps) {
  const { showPoints = true, categories } = props;
  const { colored, visible, toggle } = useSeriesState(props);
  const dataMax = Math.max(0, ...visible.flatMap((s) => s.data));
  return (
    <CartesianPlot
      props={props}
      kind="선 차트"
      colored={colored}
      visible={visible}
      toggle={toggle}
      dataMax={dataMax}
      anchorY={(i, l) => l.y(Math.max(0, ...visible.map((s) => s.data[i] ?? 0)))}
      render={(l, active) => (
        <>
          {visible.map((s) => {
            const pts = categories.map((_, i) => `${l.x(i)},${l.y(s.data[i] ?? 0)}`);
            return (
              <polyline
                key={s.name}
                points={pts.join(' ')}
                fill="none"
                stroke={chartColor(s.token)}
                strokeWidth={1}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
          {visible.map((s) =>
            categories.map((_, i) => {
              const sel = active === i;
              if (!showPoints && !sel) return null;
              return (
                <circle
                  key={`${s.name}-${i}`}
                  cx={l.x(i)}
                  cy={l.y(s.data[i] ?? 0)}
                  r={DOT_R}
                  fill={chartColor(sel ? 'neutral-10' : s.token)}
                  stroke={sel ? chartColor('neutral-100') : undefined}
                  strokeWidth={sel ? 1.34 : undefined}
                />
              );
            }),
          )}
        </>
      )}
    />
  );
}

export function AreaChart(props: AreaChartProps) {
  const { stacked = false, showLine = true, categories } = props;
  const { colored, visible, toggle } = useSeriesState(props);
  const n = categories.length;
  // 누적이면 아래 계열 합 위에 올립니다.
  const bases = visible.map((_, si) =>
    categories.map((__, i) => (stacked ? visible.slice(0, si).reduce((a, s) => a + Math.max(0, s.data[i] ?? 0), 0) : 0)),
  );
  const tops = visible.map((s, si) => categories.map((_, i) => bases[si][i] + Math.max(0, s.data[i] ?? 0)));
  const dataMax = Math.max(0, ...tops.flat());

  return (
    <CartesianPlot
      props={props}
      kind={stacked ? '누적 영역 차트' : '영역 차트'}
      colored={colored}
      visible={visible}
      toggle={toggle}
      dataMax={dataMax}
      anchorY={(i, l) => l.y(Math.max(0, ...tops.map((t) => t[i] ?? 0)))}
      render={(l, active) => {
        // Figma graph/area: 면이 그래프 좌우 끝까지 — 첫·마지막 값을 끝까지 수평 연장
        const xs = [l.pl, ...categories.map((_, i) => l.x(i)), l.pr];
        const ext = (arr: number[]) => (n ? [arr[0], ...arr, arr[n - 1]] : []);
        // 큰(위) 계열부터 그려 작은 면이 위에 보이게 합니다.
        const order = visible.map((_, i) => i).reverse();
        return (
          <>
            {order.map((si) => {
              const s = visible[si];
              const top = ext(tops[si]);
              const base = ext(bases[si]);
              const upper = xs.map((x, j) => `${x},${l.y(top[j])}`);
              const lower = xs.map((x, j) => `${x},${l.y(base[j])}`).reverse();
              return (
                <g key={s.name}>
                  <path d={`M${upper.join('L')}L${lower.join('L')}Z`} fill={chartColor(s.token)} fillOpacity={0.5} />
                  {showLine && (
                    <polyline points={upper.join(' ')} fill="none" stroke={chartColor(s.token)} strokeWidth={1.34} strokeLinejoin="round" />
                  )}
                </g>
              );
            })}
            {active !== null &&
              visible.map((s, si) => (
                <circle
                  key={s.name}
                  cx={l.x(active)}
                  cy={l.y(tops[si][active] ?? 0)}
                  r={DOT_R}
                  fill={chartColor('neutral-10')}
                  stroke={chartColor('neutral-100')}
                  strokeWidth={1.34}
                />
              ))}
          </>
        );
      }}
    />
  );
}
