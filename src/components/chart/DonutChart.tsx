import { useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ChartCard } from './ChartCard';
import { ChartFigure } from './ChartFigure';
import { ChartLegend } from './ChartLegend';
import { ChartTooltip, ChartTooltipRow } from './ChartTooltip';
import { DONUT_PALETTES, chartColor, seriesColor, type ChartColor, type ChartPalette } from './palette';
import { defaultFormat } from './scale';

/**
 * Figma: `graph/donut chart` (type bold | light | pie, ♦ text) + `element/circle_segments` (light | bold | pie)
 *   128×128, 12시 방향에서 시계 방향으로 세그먼트를 쌓음
 *   안쪽 반지름 : light 0.70 · bold 0.40 · pie 0
 *   세그먼트    : neutral-100 → neutral-70 → neutral-40 → neutral-20, 외곽선 1px neutral-20
 *   ♦ text      : 가운데 라벨 10px Regular neutral-70 + 값 18px Medium neutral-100 (light 타입)
 */
export interface DonutDatum {
  label: string;
  value: number;
  color?: ChartColor;
}

export interface DonutChartProps {
  data: DonutDatum[];
  /** Figma type: light(얇은 링) | bold(두꺼운 링) | pie */
  variant?: 'light' | 'bold' | 'pie';
  /** 지름(px). 기본 128 */
  size?: number;
  /** ♦ text — 가운데 라벨/값 (light에서만 표시) */
  showText?: boolean;
  /** 가운데 위 라벨 (기본 'Total') */
  centerLabel?: ReactNode;
  /** 가운데 값 (기본: 합계) */
  centerValue?: ReactNode;
  palette?: ChartPalette;
  formatValue?: (v: number) => string;
  'aria-label'?: string;
  className?: string;
}

const INNER = { light: 0.7, bold: 0.4, pie: 0 } as const;

function sector(cx: number, cy: number, r: number, ir: number, a0: number, a1: number): string {
  // a: 0 = 12시, 시계 방향(라디안)
  const pt = (rad: number, a: number) => [cx + rad * Math.sin(a), cy - rad * Math.cos(a)];
  if (a1 - a0 >= Math.PI * 2 - 1e-6) {
    // 전체 원: 반원 두 개
    const mid = a0 + Math.PI;
    return sector(cx, cy, r, ir, a0, mid) + sector(cx, cy, r, ir, mid, a0 + Math.PI * 2);
  }
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const [x0, y0] = pt(r, a0);
  const [x1, y1] = pt(r, a1);
  if (ir <= 0) return `M${cx},${cy}L${x0},${y0}A${r},${r} 0 ${large} 1 ${x1},${y1}Z`;
  const [x2, y2] = pt(ir, a1);
  const [x3, y3] = pt(ir, a0);
  return `M${x0},${y0}A${r},${r} 0 ${large} 1 ${x1},${y1}L${x2},${y2}A${ir},${ir} 0 ${large} 0 ${x3},${y3}Z`;
}

export function DonutChart({
  data,
  variant = 'light',
  size = 128,
  showText = true,
  centerLabel = 'Total',
  centerValue,
  palette = 'neutral',
  formatValue = defaultFormat,
  'aria-label': ariaLabel,
  className,
}: DonutChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const total = data.reduce((a, d) => a + Math.max(0, d.value), 0);
  const r = size / 2 - 0.5;
  const ir = r * INNER[variant];
  const colors = data.map((d, i) => seriesColor(i, palette, d.color, DONUT_PALETTES));

  let acc = 0;
  const arcs = data.map((d) => {
    const v = Math.max(0, d.value);
    const a0 = total ? (acc / total) * Math.PI * 2 : 0;
    acc += v;
    const a1 = total ? (acc / total) * Math.PI * 2 : 0;
    return { a0, a1 };
  });

  const label =
    ariaLabel ??
    `${variant === 'pie' ? '파이' : '도넛'} 차트: 합계 ${formatValue(total)}. ` +
      data.map((d) => `${d.label} ${formatValue(d.value)}(${total ? Math.round((d.value / total) * 100) : 0}%)`).join(', ') +
      '.';

  return (
    <ChartFigure
      className={cn('w-auto shrink-0', className)}
      label={label}
      rows={data.map((d) => ({ label: d.label, values: [{ name: '값', value: d.value }] }))}
      columns={['값']}
      format={formatValue}
      active={active}
      onActiveChange={setActive}
      fallbackWidth={size}
    >
      {() => {
        let tooltip: ReactNode = null;
        if (active !== null && data[active]) {
          const { a0, a1 } = arcs[active];
          const mid = (a0 + a1) / 2;
          const rr = (r + ir) / 2;
          const d = data[active];
          tooltip = (
            <ChartTooltip x={size / 2 + rr * Math.sin(mid)} y={size / 2 - rr * Math.cos(mid) - 2} title={d.label}>
              <ChartTooltipRow
                value={`${formatValue(d.value)} (${total ? Math.round((d.value / total) * 100) : 0}%)`}
              />
            </ChartTooltip>
          );
        }
        return (
          <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true" className="block">
              {data.map((d, i) => {
                const { a0, a1 } = arcs[i];
                if (a1 <= a0) return null;
                return (
                  <path
                    key={d.label + i}
                    d={sector(size / 2, size / 2, r, ir, a0, a1)}
                    fill={chartColor(colors[i])}
                    stroke={chartColor('neutral-20')}
                    strokeWidth={1}
                    opacity={active !== null && active !== i ? 0.6 : 1}
                    onMouseEnter={() => setActive(i)}
                    className="transition-opacity motion-reduce:transition-none"
                  />
                );
              })}
            </svg>
            {showText && variant === 'light' && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
              >
                <span className="max-w-20 truncate text-body-5 text-neutral-70">{centerLabel}</span>
                <span className="max-w-20 truncate text-body-2 font-medium text-neutral-100">
                  {centerValue ?? formatValue(total)}
                </span>
              </div>
            )}
            {tooltip}
          </div>
        );
      }}
    </ChartFigure>
  );
}

/**
 * Figma: `charts_circle/circle` (Property 1 = type1 | type2 | type3 | type4, ♦ title, ♦ right) — 356×254
 *   카드 외곽선 1px neutral-40, data 높이 218
 *   type1 : 도넛(light) 왼쪽 + 세로 범례(fix, 값 + 화살표), gap 12
 *   type2 : 도넛 왼쪽 + 2열 범례(hug, 값), 열 간격 16 · 행 간격 5.36
 *   type3 : 도넛 위 + 아래 2열 범례(fix, 값 + 화살표), 열 간격 13.4 · 행 간격 4
 *   type4 : 도넛 위 + 아래 Vertical series 범례(값 18px Bold), 간격 16
 */
export interface DonutChartCardProps extends Omit<DonutChartProps, 'className' | 'size'> {
  /** Figma Property 1 */
  type?: 'type1' | 'type2' | 'type3' | 'type4';
  /** ♦ title */
  title?: ReactNode;
  /** ♦ right — 보통 <ChartTrailing /> */
  trailing?: ReactNode;
  /** 범례 화살표(이동) 클릭. 주면 범례 항목이 버튼이 됩니다. */
  onItemClick?: (index: number) => void;
  className?: string;
}

export function DonutChartCard({
  type = 'type1',
  title,
  trailing,
  onItemClick,
  className,
  ...donut
}: DonutChartCardProps) {
  const palette = donut.palette ?? 'neutral';
  const format = donut.formatValue ?? defaultFormat;
  const items = donut.data.map((d, i) => ({
    label: d.label,
    value: format(d.value),
    color: seriesColor(i, palette, d.color, DONUT_PALETTES),
  }));
  const chart = <DonutChart {...donut} />;
  const half = Math.ceil(items.length / 2);

  let body: ReactNode;
  if (type === 'type1') {
    body = (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {chart}
        <ChartLegend items={items} direction="column" onItemClick={onItemClick} />
      </div>
    );
  } else if (type === 'type2') {
    body = (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {chart}
        <ul aria-label="범례" className="grid grid-cols-2 gap-x-4 gap-y-[5.36px]">
          {items.map((it, i) => (
            <li key={i} className="flex">
              <ChartLegend items={[it]} itemType="hug" showButton={false} onItemClick={onItemClick && (() => onItemClick(i))} aria-label={it.label} />
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (type === 'type3') {
    body = (
      <div className="flex flex-col items-center gap-3">
        {chart}
        <div className="flex flex-wrap justify-center gap-x-[13.4px] gap-y-1">
          <ChartLegend items={items.slice(0, half)} direction="column" onItemClick={onItemClick} />
          <ChartLegend
            items={items.slice(half)}
            direction="column"
            onItemClick={onItemClick && ((i) => onItemClick(i + half))}
          />
        </div>
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col items-center gap-3">
        {chart}
        <ChartLegend items={items} type="vertical" onItemClick={onItemClick} align="center" />
      </div>
    );
  }

  return (
    <ChartCard
      title={title}
      trailing={trailing}
      className={cn('shadow-[inset_0_0_0_1px_var(--color-neutral-40)]', className)}
      bodyClassName="min-h-[218px] items-center justify-center px-3 py-3"
    >
      {body}
    </ChartCard>
  );
}
