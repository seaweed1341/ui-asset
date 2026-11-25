import { useMemo, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { ChartLegend } from './ChartLegend';
import { seriesColor, type ChartColor, type ChartPalette } from './palette';
import { defaultFormat, useChartWidth } from './scale';

/** 막대·선·면 차트 공통 계열 */
export interface ChartSeries {
  name: string;
  /** categories와 같은 순서의 값 */
  data: number[];
  /** 색 토큰. 생략하면 palette 순서 */
  color?: ChartColor;
}

/** 막대·선·면 차트 공통 props */
export interface CartesianChartProps {
  /** x축(가로 막대는 y축) 항목 이름 */
  categories: string[];
  series: ChartSeries[];
  /** 축 최댓값. 생략하면 데이터에 맞춰 보기 좋은 값으로 올림 */
  max?: number;
  /** 눈금 줄 수 — Figma axis `count` 베리언트(3~11) */
  tickCount?: number;
  /** SVG 높이(px). 폭은 컨테이너를 따라갑니다. (Figma graph 156) */
  height?: number;
  /** ♦ x축 */
  showXAxis?: boolean;
  /** ♦ y축 */
  showYAxis?: boolean;
  /** ♦ x unit — x축 아래 단위 문구 */
  xUnit?: string;
  /** ♦ y unit — y축 왼쪽 세로 단위 문구 */
  yUnit?: string;
  palette?: ChartPalette;
  /** 내장 범례(♦ legend, 클릭으로 계열 토글). 기본: 계열이 2개 이상일 때 표시 */
  legend?: boolean;
  /** 숨긴 계열 이름(제어) */
  hiddenSeries?: string[];
  /** 숨긴 계열 이름(비제어 초기값) */
  defaultHiddenSeries?: string[];
  onHiddenSeriesChange?: (hidden: string[]) => void;
  formatValue?: (value: number) => string;
  /** 스크린리더용 요약. 생략하면 자동 생성 */
  'aria-label'?: string;
  className?: string;
}

export interface ColoredSeries extends ChartSeries {
  token: ChartColor;
  hidden: boolean;
}

/** 계열 색(엔티티 고정) + 표시/숨김 상태 */
export function useSeriesState(props: CartesianChartProps) {
  const { series, palette = 'neutral', hiddenSeries, defaultHiddenSeries, onHiddenSeriesChange } = props;
  const [inner, setInner] = useState<string[]>(defaultHiddenSeries ?? []);
  const hidden = hiddenSeries ?? inner;
  const toggle = (name: string) => {
    const next = hidden.includes(name) ? hidden.filter((n) => n !== name) : [...hidden, name];
    if (hiddenSeries === undefined) setInner(next);
    onHiddenSeriesChange?.(next);
  };
  const colored: ColoredSeries[] = series.map((s, i) => ({
    ...s,
    token: seriesColor(i, palette, s.color),
    hidden: hidden.includes(s.name),
  }));
  return { colored, visible: colored.filter((s) => !s.hidden), toggle };
}

export interface ChartDatumRow {
  label: string;
  values: { name: string; value: number }[];
}

interface ChartFigureProps {
  /** 스크린리더 요약 */
  label: string;
  rows: ChartDatumRow[];
  columns: string[];
  format?: (v: number) => string;
  legend?: ReactNode;
  active: number | null;
  onActiveChange: (i: number | null) => void;
  fallbackWidth?: number;
  className?: string;
  children: (width: number) => ReactNode;
}

/**
 * 차트 공통 껍데기
 *  - 컨테이너 폭 측정(viewBox = 실제 px 폭)
 *  - role="img" + aria-label 요약, 숨긴 데이터 표(sr-only), 키보드(←→ Home End Esc)로 항목 탐색 + aria-live 안내
 */
export function ChartFigure({
  label,
  rows,
  columns,
  format = defaultFormat,
  legend,
  active,
  onActiveChange,
  fallbackWidth,
  className,
  children,
}: ChartFigureProps) {
  const [ref, width] = useChartWidth<HTMLDivElement>(fallbackWidth);
  const [keyboard, setKeyboard] = useState(false);
  const n = rows.length;

  const onKeyDown = (e: KeyboardEvent) => {
    if (!n) return;
    let next: number | null | undefined;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === null ? 0 : (active + 1) % n;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === null ? n - 1 : (active - 1 + n) % n;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = n - 1;
    else if (e.key === 'Escape') next = null;
    if (next === undefined) return;
    e.preventDefault();
    setKeyboard(true);
    onActiveChange(next);
  };

  const live = useMemo(() => {
    if (!keyboard || active === null || !rows[active]) return '';
    const r = rows[active];
    return `${r.label}: ${r.values.map((v) => `${v.name} ${format(v.value)}`).join(', ')}`;
  }, [keyboard, active, rows, format]);

  return (
    <figure className={cn('m-0 flex w-full min-w-0 flex-col gap-1', className)}>
      {legend}
      <div
        ref={ref}
        role="img"
        aria-label={`${label} 화살표 키로 항목별 값을 확인할 수 있습니다.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => {
          setKeyboard(false);
          onActiveChange(null);
        }}
        onMouseLeave={() => onActiveChange(null)}
        className="relative w-full min-w-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70"
      >
        {children(width)}
      </div>
      {/* table 요소는 sr-only의 1px 폭을 무시하고 내용만큼 넓어지므로 래퍼에 sr-only를 둔다 */}
      <div className="sr-only">
      <table>
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">항목</th>
            {columns.map((c) => (
              <th key={c} scope="col">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row">{r.label}</th>
              {r.values.map((v) => (
                <td key={v.name}>{format(v.value)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
    </figure>
  );
}

/** 계열 범례(토글형, 오른쪽 정렬) — Figma 카드의 ♦ legend: Horizon series / 가로 */
export function SeriesLegend({ colored, onToggle }: { colored: ColoredSeries[]; onToggle: (name: string) => void }) {
  return (
    <ChartLegend
      align="end"
      itemType="hug"
      showValue={false}
      showButton={false}
      items={colored.map((s) => ({ label: s.name, color: s.token, hidden: s.hidden }))}
      onToggle={(i) => onToggle(colored[i].name)}
      aria-label="계열 (눌러서 표시/숨김)"
    />
  );
}

/** 표·라이브 안내용 행 데이터 */
export const toRows = (categories: string[], series: ChartSeries[]): ChartDatumRow[] =>
  categories.map((c, i) => ({ label: c, values: series.map((s) => ({ name: s.name, value: s.data[i] ?? 0 })) }));

/** 자동 요약 문구 */
export function summarize(kind: string, categories: string[], series: ChartSeries[], format: (v: number) => string) {
  if (!series.length || !categories.length) return `${kind}: 데이터 없음.`;
  const parts = series.map((s) => {
    let mi = 0;
    s.data.forEach((v, i) => {
      if (v > (s.data[mi] ?? -Infinity)) mi = i;
    });
    return `${s.name} 최댓값 ${format(s.data[mi] ?? 0)}(${categories[mi]})`;
  });
  return `${kind}: 항목 ${categories.length}개(${categories[0]}~${categories[categories.length - 1]}), 계열 ${series.length}개. ${parts.join(', ')}.`;
}
