/**
 * 차트 색 — 모두 theme.css 토큰(CSS 변수)만 사용합니다.
 *
 * Figma 실측
 *   - graph/donut chart 세그먼트 : neutral-100 → neutral-70 → neutral-40 → neutral-20 (세그먼트 외곽 1px neutral-20)
 *   - element/line_graph color   : dark=neutral-100 · grey=neutral-70 · default=neutral-40 · light=neutral-20
 *   - element/bar_count_chart    : neutral-70 (단일 계열 막대)
 *   - graph/area                 : neutral-70 @50% 면 + 1.34px neutral-70 선
 *
 * `neutral` 팔레트는 Figma 와이어프레임 그대로, `brand` 팔레트는 서비스 화면용 컬러 계열입니다.
 * brand 순서는 dataviz 검증기(CVD 인접 쌍 ΔE ≥ 8)를 통과하도록 정했습니다:
 * primary-70 → warning-60 → info-60 → error-60 → primary-90 → success-60.
 */
export type ChartColor =
  | 'neutral-100'
  | 'neutral-70'
  | 'neutral-40'
  | 'neutral-20'
  | 'neutral-10'
  | 'primary-15'
  | 'primary-70'
  | 'primary-90'
  | 'info-60'
  | 'success-60'
  | 'warning-60'
  | 'error-60';

export type ChartPalette = 'neutral' | 'brand';

export const CHART_PALETTES: Record<ChartPalette, readonly ChartColor[]> = {
  neutral: ['neutral-70', 'neutral-100', 'neutral-40', 'neutral-20'],
  brand: ['primary-70', 'warning-60', 'info-60', 'error-60', 'primary-90', 'success-60'],
};

/** 도넛(원형) 차트 전용 — Figma graph/donut chart 세그먼트 순서 */
export const DONUT_PALETTES: Record<ChartPalette, readonly ChartColor[]> = {
  neutral: ['neutral-100', 'neutral-70', 'neutral-40', 'neutral-20'],
  brand: CHART_PALETTES.brand,
};

/** 토큰 이름 → CSS 색 값 */
export const chartColor = (c: ChartColor) => `var(--color-${c})`;

/** 계열 i의 색. 명시 색이 우선, 없으면 팔레트 순서대로(순환하지 않고 마지막 색 유지) */
export const seriesColor = (
  i: number,
  palette: ChartPalette = 'neutral',
  explicit?: ChartColor,
  table: Record<ChartPalette, readonly ChartColor[]> = CHART_PALETTES,
): ChartColor => {
  if (explicit) return explicit;
  const list = table[palette];
  return list[Math.min(i, list.length - 1)];
};
