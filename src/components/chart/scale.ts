import { useLayoutEffect, useRef, useState } from 'react';

/** 0부터 시작하는 눈금. count = Figma axis `count` 베리언트(3~11, 눈금 줄 수) */
export function niceScale(dataMax: number, count = 6, fixedMax?: number) {
  const steps = Math.max(1, count - 1);
  let max: number;
  if (fixedMax !== undefined && fixedMax > 0) {
    max = fixedMax;
  } else {
    const raw = Math.max(dataMax, 1) / steps;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const norm = raw / mag;
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
    max = nice * mag * steps;
  }
  const ticks = Array.from({ length: steps + 1 }, (_, i) => +((max / steps) * i).toFixed(10));
  return { max, ticks };
}

/**
 * 컨테이너 폭을 따라가는 SVG 폭. viewBox를 실제 px 폭과 같게 맞춰 글자(8·10px)가 늘어나지 않게 합니다.
 * ResizeObserver가 없으면 fallback 폭으로 그립니다.
 */
export function useChartWidth<T extends HTMLElement>(fallback = 322) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const read = () => {
      const w = el.clientWidth;
      if (w > 0) setWidth((prev) => (Math.abs(prev - w) > 0.5 ? w : prev));
    };
    read();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

/** 대략적인 글자 폭(px) — 숫자·영문 0.6em, 한글 등 전각 1em */
export const textWidth = (text: string, fontSize: number) => {
  let em = 0;
  for (const ch of text) em += /[\u1100-\u11ff\u2e80-\ua4cf\uac00-\ud7af\uf900-\ufaff\uff00-\uffef]/.test(ch) ? 1 : 0.6;
  return Math.ceil(em * fontSize);
};

/** 한쪽 끝만 둥근 막대 path (Figma bar_count_chart: 끝 모서리 r1.34) */
export function barPath(x: number, y: number, w: number, h: number, r: number, end: 'top' | 'right' | 'none') {
  if (w <= 0 || h <= 0) return '';
  if (end === 'none' || r <= 0) return `M${x},${y}h${w}v${h}h${-w}Z`;
  if (end === 'top') {
    const rr = Math.min(r, w / 2, h);
    return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
  }
  const rr = Math.min(r, h / 2, w);
  return `M${x},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h - rr}Q${x + w},${y + h} ${x + w - rr},${y + h}H${x}Z`;
}

export const defaultFormat = (v: number) => v.toLocaleString();
