import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { chartColor, type ChartColor } from './palette';

const clamp = (v: number) => Math.min(100, Math.max(0, v));

export interface ProgressSegment {
  value: number;
  color?: ChartColor;
  label?: string;
}

/**
 * Figma: `progress bar_line` (size medium | large × progress 0% | 50% | 100%, ♦ label) — 120×25.4
 *   text  : 라벨 ↔ 퍼센트, 10px Regular neutral-70, gap 5.36
 *   bar   : 높이 6, 양 끝 둥글게, 트랙 neutral-20 / 채움 neutral-70
 *   size  : Figma에서 medium·large의 실측이 같습니다(둘 다 높이 6). prop은 베리언트 호환용으로 유지합니다.
 *   segments : 여러 색 조각을 이어 붙인 다중 진행(합계 ≤ 100)
 */
export interface ProgressBarProps {
  /** 0~100 */
  value?: number;
  /** 다중 조각. 주면 value 대신 사용 */
  segments?: ProgressSegment[];
  label?: ReactNode;
  /** ♦ label — 라벨·퍼센트 줄 표시 */
  showLabel?: boolean;
  /** 퍼센트 대신 보여줄 값 문구 */
  valueText?: string;
  size?: 'medium' | 'large';
  color?: ChartColor;
  className?: string;
}

export function ProgressBar({
  value = 0,
  segments,
  label,
  showLabel = true,
  valueText,
  size = 'medium',
  color = 'neutral-70',
  className,
}: ProgressBarProps) {
  const labelId = useId();
  const parts = segments?.length ? segments : [{ value, color }];
  const total = clamp(parts.reduce((a, s) => a + Math.max(0, s.value), 0));
  const text = valueText ?? `${Math.round(total)}%`;
  return (
    <div className={cn('flex w-[120px] flex-col gap-[5.36px]', className)} data-size={size}>
      {showLabel && (
        <div className="flex items-start justify-between gap-[5.36px] text-body-5 text-neutral-70">
          <span id={labelId} className="min-w-0 truncate">
            {label}
          </span>
          <span className="shrink-0 tabular-nums">{text}</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(total)}
        aria-valuetext={
          segments?.length
            ? `${text} (${segments.map((s) => `${s.label ?? ''} ${Math.round(s.value)}%`.trim()).join(', ')})`
            : text
        }
        aria-labelledby={showLabel && label != null ? labelId : undefined}
        aria-label={!showLabel && typeof label === 'string' ? label : undefined}
        className="flex h-1.5 w-full overflow-hidden rounded-full bg-neutral-20"
      >
        {parts.map((s, i) => (
          <span
            key={i}
            className="h-full shrink-0 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${clamp(s.value)}%`, background: chartColor(s.color ?? color) }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Figma: `progress bar_circle` (size small | large × progress 0% | 50% | 100%)
 *   small : 지름 36.2, 링 두께 3.62(안쪽 반지름 0.8), 아래 캡션 10px Regular neutral-70, gap 5.36
 *   large : 지름 80.4, 링 두께 8.04, 가운데 퍼센트 13.4px Regular neutral-70, 아래 라벨 12px Medium neutral-70
 *   트랙 neutral-20 / 진행 neutral-70, 12시에서 시계 방향
 */
export interface ProgressCircleProps {
  /** 0~100 */
  value?: number;
  segments?: ProgressSegment[];
  /** 아래 라벨(small: 캡션, large: 라벨) */
  label?: ReactNode;
  size?: 'small' | 'large';
  /** large 가운데 문구 (기본: 퍼센트) */
  valueText?: string;
  color?: ChartColor;
  className?: string;
}

const CIRCLE = { small: 36.2, large: 80.4 } as const;

export function ProgressCircle({
  value = 0,
  segments,
  label,
  size = 'small',
  valueText,
  color = 'neutral-70',
  className,
}: ProgressCircleProps) {
  const labelId = useId();
  const d = CIRCLE[size];
  const stroke = (d / 2) * 0.2;
  const r = d / 2 - stroke / 2;
  const circ = 2 * Math.PI * r;
  const parts = segments?.length ? segments : [{ value, color }];
  const total = clamp(parts.reduce((a, s) => a + Math.max(0, s.value), 0));
  const text = valueText ?? `${Math.round(total)}%`;
  let acc = 0;
  return (
    <div className={cn('inline-flex flex-col items-center gap-[5.36px]', className)}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(total)}
        aria-valuetext={text}
        aria-labelledby={label != null ? labelId : undefined}
        className="relative"
        style={{ width: d, height: d }}
      >
        <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} aria-hidden="true" className="block -rotate-90">
          <circle cx={d / 2} cy={d / 2} r={r} fill="none" stroke={chartColor('neutral-20')} strokeWidth={stroke} />
          {parts.map((s, i) => {
            const len = (clamp(s.value) / 100) * circ;
            const off = acc;
            acc += len;
            if (len <= 0) return null;
            return (
              <circle
                key={i}
                cx={d / 2}
                cy={d / 2}
                r={r}
                fill="none"
                stroke={chartColor(s.color ?? color)}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${circ - len}`}
                strokeDashoffset={-off}
                className="transition-[stroke-dasharray] duration-300 motion-reduce:transition-none"
              />
            );
          })}
        </svg>
        {size === 'large' && (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center text-[13.4px] font-regular leading-[1.4] text-neutral-70"
          >
            {text}
          </span>
        )}
      </div>
      {label != null && (
        <span
          id={labelId}
          className={cn('text-center text-neutral-70', size === 'large' ? 'text-body-4 font-medium' : 'text-body-5')}
        >
          {label}
        </span>
      )}
    </div>
  );
}
