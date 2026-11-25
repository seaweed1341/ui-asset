/**
 * 공용 축·격자 SVG 프리미티브 — <svg> 안에서 사용합니다.
 *
 * Figma 실측
 *   element/bg line (count 3~11)      : axis_line_chart를 SPACE_BETWEEN으로 쌓음
 *   element/axis_line_chart type=1px  : 격자선 1px neutral-20
 *   element/axis_line_chart type=2px  : 기준선(맨 아래) 1.34px neutral-40
 *   element/y-axis_number (count 3~11): 8px Regular neutral-70, 오른쪽 정렬, 위→아래 SPACE_BETWEEN
 *   element/y-axis_text   (count 3~10): 8px Regular neutral-70, 각 행 가운데
 *   element/x-axis_text   (count 2~10): 10px Regular neutral-70, 각 열 가운데
 *   element/x-axis_number (count 3~11): 10px Regular neutral-70, 눈금 위치 가운데
 */
import { chartColor } from './palette';

const AXIS_TEXT = chartColor('neutral-70');
const FONT = 'var(--font-family-sans)';

export interface ChartGridLinesProps {
  /** horizontal = 가로 격자(세로 막대·선), vertical = 세로 격자(가로 막대) */
  orientation?: 'horizontal' | 'vertical';
  /** 격자선 위치(px). 마지막(기준선)은 baseline으로 따로 그립니다. */
  positions: number[];
  /** 격자선이 뻗는 구간 */
  from: number;
  to: number;
  /** 기준선 위치(px). 생략하면 기준선 없음 */
  baseline?: number;
}

export function ChartGridLines({ orientation = 'horizontal', positions, from, to, baseline }: ChartGridLinesProps) {
  const h = orientation === 'horizontal';
  return (
    <g aria-hidden="true" shapeRendering="crispEdges">
      {positions.map((p) => (
        <line
          key={p}
          x1={h ? from : p}
          x2={h ? to : p}
          y1={h ? p : from}
          y2={h ? p : to}
          stroke={chartColor('neutral-20')}
          strokeWidth={1}
        />
      ))}
      {baseline !== undefined && (
        <line
          x1={h ? from : baseline}
          x2={h ? to : baseline}
          y1={h ? baseline : from}
          y2={h ? baseline : to}
          stroke={chartColor('neutral-40')}
          strokeWidth={1.34}
        />
      )}
    </g>
  );
}

export interface ChartAxisLabel {
  /** 라벨 중심 위치(px) */
  at: number;
  text: string;
}

export interface ChartAxisYProps {
  labels: ChartAxisLabel[];
  /** 라벨 오른쪽 끝 x(px) — Figma y-axis는 오른쪽 정렬 */
  x: number;
  /** 8px (Figma y-axis) */
  fontSize?: number;
}

export function ChartAxisY({ labels, x, fontSize = 8 }: ChartAxisYProps) {
  return (
    <g aria-hidden="true" fontFamily={FONT} fontSize={fontSize} fill={AXIS_TEXT} textAnchor="end">
      {labels.map((l, i) => (
        <text key={`${i}-${l.text}`} x={x} y={l.at} dominantBaseline="central">
          {l.text}
        </text>
      ))}
    </g>
  );
}

export interface ChartAxisXProps {
  labels: ChartAxisLabel[];
  /** 라벨 윗변 y(px) */
  y: number;
  /** 10px (Figma x-axis) */
  fontSize?: number;
}

export function ChartAxisX({ labels, y, fontSize = 10 }: ChartAxisXProps) {
  return (
    <g aria-hidden="true" fontFamily={FONT} fontSize={fontSize} fill={AXIS_TEXT} textAnchor="middle">
      {labels.map((l, i) => (
        <text key={`${i}-${l.text}`} x={l.at} y={y} dominantBaseline="hanging">
          {l.text}
        </text>
      ))}
    </g>
  );
}

/** 축 단위(♦ x unit / ♦ y unit): 10px Regular neutral-70 */
export function ChartAxisUnit({ text, x, y, rotate }: { text: string; x: number; y: number; rotate?: boolean }) {
  return (
    <text
      aria-hidden="true"
      x={x}
      y={y}
      fontFamily={FONT}
      fontSize={10}
      fill={AXIS_TEXT}
      textAnchor="middle"
      dominantBaseline="central"
      transform={rotate ? `rotate(-90 ${x} ${y})` : undefined}
    >
      {text}
    </text>
  );
}
