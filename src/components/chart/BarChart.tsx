import { useState, type ReactNode } from 'react';
import { ChartAxisUnit, ChartAxisX, ChartAxisY, ChartGridLines } from './ChartAxes';
import {
  ChartFigure,
  SeriesLegend,
  summarize,
  toRows,
  useSeriesState,
  type CartesianChartProps,
} from './ChartFigure';
import { ChartTooltip, ChartTooltipRow } from './ChartTooltip';
import { chartColor } from './palette';
import { barPath, defaultFormat, niceScale, textWidth } from './scale';

/**
 * Figma: `graph/bar` (shape vertical | horizontal) 와 구성 요소
 *   element/bar_vertical · bar_horizontal (count 2~10) : 항목을 열(행)마다 균등 배치, 막대는 열 가운데
 *   element/bar_group_vertical (bar count 1~3)         : 1개 6px 폭 / 2~3개 4px 폭, 간격 4
 *   element/bar_group_horizontal (bar count 1~3)       : 6px 두께, 2~3개는 12.5px 간격으로 쌓음
 *   element/bar_chart (type y | x)                     : ♦ count 값 라벨 8px Regular (세로 neutral-40 위 / 가로 neutral-70 오른쪽, 간격 2.68), ♦ tootip
 *   element/bar_count_chart (count 1~10)               : 누적 막대 — 조각 사이 0.7px neutral-10, 끝 모서리 r1.34
 *   charts_bar ♦ average                               : 기준선 1px primary-70 + 라벨(bg primary-70, r4, p 2.68/8.04, 8px neutral-10)
 * 막대 색: 단일 계열 neutral-70(Figma), 여러 계열은 palette 순서.
 */
export interface BarChartProps extends CartesianChartProps {
  /** Figma shape: vertical(세로 막대) | horizontal(가로 막대) */
  shape?: 'vertical' | 'horizontal';
  /** 누적 막대 (Figma bar_count_chart) */
  stacked?: boolean;
  /** ♦ count — 막대 끝 값 라벨 */
  showValues?: boolean;
  /** ♦ average — 기준선 */
  average?: number | { value: number; label?: ReactNode };
}

const BAR_W = 6;
const GROUP_BAR_W = 4;
const GROUP_GAP = 4;
const H_GROUP_STEP = 12.5;
const RADIUS = 1.34;
const SEG_GAP = 0.7;
const LABEL_GAP = 2.68;

export function BarChart(props: BarChartProps) {
  const {
    categories,
    shape = 'vertical',
    stacked = false,
    showValues = true,
    average,
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
  const { colored, visible, toggle } = useSeriesState(props);
  const [active, setActive] = useState<number | null>(null);
  const horizontal = shape === 'horizontal';
  const n = categories.length;
  const k = visible.length;

  const totals = categories.map((_, i) =>
    stacked ? visible.reduce((a, s) => a + Math.max(0, s.data[i] ?? 0), 0) : Math.max(0, ...visible.map((s) => s.data[i] ?? 0)),
  );
  const avg = typeof average === 'number' ? { value: average } : average;
  const { max, ticks } = niceScale(Math.max(0, ...totals, avg?.value ?? 0), tickCount, fixedMax);

  const showLegend = props.legend ?? colored.length > 1;
  const label =
    props['aria-label'] ??
    summarize(`${horizontal ? '가로' : '세로'} ${stacked ? '누적 ' : ''}막대 차트`, categories, visible, formatValue);

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
        const catLabels = horizontal ? categories : ticks.map(formatValue);
        const yLabelW = showYAxis ? Math.max(...catLabels.map((t) => textWidth(t, 8)), 5) : 0;
        const left = unitW + yLabelW + (showYAxis ? 5 : 0);
        const valueLabelW = showValues ? textWidth(formatValue(max), 8) + LABEL_GAP : 0;
        const right = horizontal ? Math.max(10, valueLabelW) : 2;
        const top = 7;
        const bottom = (showXAxis ? 15 : 2) + (xUnit ? 14 : 0);
        const pl = left;
        const pr = Math.max(pl + 10, W - right);
        const pt = top;
        const pb = Math.max(pt + 10, height - bottom);
        const pw = pr - pl;
        const ph = pb - pt;
        const vScale = (v: number) => (Math.max(0, v) / max) * (horizontal ? pw : ph);
        const band = (horizontal ? ph : pw) / Math.max(1, n);
        const center = (i: number) => (horizontal ? pt : pl) + band * (i + 0.5);

        // 그룹 막대 두께/간격
        const thick = stacked || k <= 1 ? BAR_W : horizontal ? BAR_W : GROUP_BAR_W;
        let step = stacked || k <= 1 ? 0 : horizontal ? H_GROUP_STEP : GROUP_BAR_W + GROUP_GAP;
        const groupSpan = stacked || k <= 1 ? thick : step * (k - 1) + thick;
        const fit = band * 0.8;
        const shrink = groupSpan > fit ? fit / groupSpan : 1;
        const t = thick * shrink;
        step *= shrink;
        const span = groupSpan * shrink;
        const perBarLabels = showValues && (stacked || k <= 1 || (horizontal ? step >= 9 : band / k >= 12));

        const marks: ReactNode[] = [];
        const labels: ReactNode[] = [];
        const ends: number[] = [];
        categories.forEach((_, i) => {
          const c = center(i);
          let far = 0; // 막대 끝(값 방향) 최대 길이
          if (stacked) {
            let acc = 0;
            visible.forEach((s, si) => {
              const v = Math.max(0, s.data[i] ?? 0);
              const len = vScale(v);
              if (len <= 0) return;
              const isEnd = si === visible.length - 1 || visible.slice(si + 1).every((o) => (o.data[i] ?? 0) <= 0);
              const gap = isEnd ? 0 : SEG_GAP;
              const d = horizontal
                ? barPath(pl + vScale(acc), c - t / 2, Math.max(0, len - gap), t, RADIUS, isEnd ? 'right' : 'none')
                : barPath(c - t / 2, pb - vScale(acc) - len + gap, t, Math.max(0, len - gap), RADIUS, isEnd ? 'top' : 'none');
              marks.push(<path key={`${i}-${s.name}`} d={d} fill={chartColor(s.token)} />);
              acc += v;
            });
            far = vScale(acc);
            if (perBarLabels && acc > 0) labels.push(valueLabel(`${i}`, formatValue(acc), c, far));
          } else {
            visible.forEach((s, si) => {
              const v = s.data[i] ?? 0;
              const len = vScale(v);
              const off = c - span / 2 + si * step + t / 2;
              const d = horizontal
                ? barPath(pl, off - t / 2, len, t, RADIUS, 'right')
                : barPath(off - t / 2, pb - len, t, len, RADIUS, 'top');
              if (d) marks.push(<path key={`${i}-${s.name}`} d={d} fill={chartColor(s.token)} />);
              far = Math.max(far, len);
              if (perBarLabels) labels.push(valueLabel(`${i}-${s.name}`, formatValue(v), off, len));
            });
          }
          ends.push(far);
        });

        function valueLabel(key: string, text: string, at: number, len: number) {
          return horizontal ? (
            <text key={key} x={pl + len + LABEL_GAP} y={at} dominantBaseline="central" fill={chartColor('neutral-70')}>
              {text}
            </text>
          ) : (
            <text key={key} x={at} y={pb - len - LABEL_GAP} textAnchor="middle" fill={chartColor('neutral-40')}>
              {text}
            </text>
          );
        }

        const tickPos = ticks.map((tv) => (horizontal ? pl + vScale(tv) : pb - vScale(tv)));
        const avgPos = avg ? (horizontal ? pl + vScale(avg.value) : pb - vScale(avg.value)) : 0;

        let tooltip: ReactNode = null;
        if (active !== null && active < n && k > 0) {
          const c = center(active);
          const far = ends[active] + (showValues ? (horizontal ? valueLabelW : 11) : 0);
          tooltip = (
            <ChartTooltip
              placement={horizontal ? 'right' : 'top'}
              x={horizontal ? pl + far + 2 : c}
              y={horizontal ? c : pb - far - 2}
              title={categories[active]}
            >
              {visible.map((s) => (
                <ChartTooltipRow
                  key={s.name}
                  color={k > 1 ? chartColor(s.token) : undefined}
                  name={k > 1 ? s.name : undefined}
                  value={formatValue(s.data[active] ?? 0)}
                />
              ))}
            </ChartTooltip>
          );
        }

        return (
          <>
            <svg width="100%" height={height} viewBox={`0 0 ${W} ${height}`} overflow="visible" aria-hidden="true" className="block">
              {horizontal ? (
                <ChartGridLines orientation="vertical" positions={tickPos.slice(1)} from={pt} to={pb} baseline={pl} />
              ) : (
                <ChartGridLines positions={tickPos.slice(1)} from={pl} to={pr} baseline={pb} />
              )}
              {showYAxis &&
                (horizontal ? (
                  <ChartAxisY x={pl - 5} labels={categories.map((c, i) => ({ at: center(i), text: c }))} />
                ) : (
                  <ChartAxisY x={pl - 5} labels={ticks.map((tv, i) => ({ at: tickPos[i], text: formatValue(tv) }))} />
                ))}
              {showXAxis &&
                (horizontal ? (
                  <ChartAxisX y={pb + 3} labels={ticks.map((tv, i) => ({ at: tickPos[i], text: formatValue(tv) }))} />
                ) : (
                  <ChartAxisX y={pb + 1} labels={categories.map((c, i) => ({ at: center(i), text: c }))} />
                ))}
              {yUnit && <ChartAxisUnit text={yUnit} x={6} y={(pt + pb) / 2} rotate />}
              {xUnit && <ChartAxisUnit text={xUnit} x={(pl + pr) / 2} y={height - 7} />}
              <g>{marks}</g>
              <g fontFamily="var(--font-family-sans)" fontSize={8} aria-hidden="true">
                {labels}
              </g>
              {avg && (
                <line
                  x1={horizontal ? avgPos : pl}
                  x2={horizontal ? avgPos : pr}
                  y1={horizontal ? pt : avgPos}
                  y2={horizontal ? pb : avgPos}
                  stroke={chartColor('primary-70')}
                  strokeWidth={1}
                  shapeRendering="crispEdges"
                />
              )}
              {/* hover 영역: 열(행) 전체 */}
              {categories.map((c, i) => (
                <rect
                  key={c + i}
                  x={horizontal ? pl : center(i) - band / 2}
                  y={horizontal ? center(i) - band / 2 : pt}
                  width={horizontal ? pw : band}
                  height={horizontal ? band : ph}
                  fill="transparent"
                  onMouseEnter={() => setActive(i)}
                />
              ))}
            </svg>
            {avg && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute whitespace-pre rounded bg-primary-70 px-[8.04px] py-[2.68px] text-body-6 text-neutral-10"
                style={
                  horizontal
                    ? { left: avgPos, top: pt, transform: 'translate(-50%, -100%)' }
                    : { left: pr, top: avgPos, transform: 'translate(-100%, -50%)' }
                }
              >
                {avg.label ?? `평균 ${formatValue(avg.value)}`}
              </span>
            )}
            {tooltip}
          </>
        );
      }}
    </ChartFigure>
  );
}
