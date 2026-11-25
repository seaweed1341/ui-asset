import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconAdd, IconInfo } from '../../icons';
import { IconButton } from '../IconButton';
import { TextField } from '../TextField';
import { IconSubtract } from './icons';

/**
 * Figma: Components / `slider` (4 variants) + `element/rail_slider` (6) + `element/handler_slider` (12) + `Tick Mark` (5)
 *   case         : text(양쪽 button_icon outlined h24: ic_subtract / ic_add, gap 8)
 *                  | icon(양쪽 24×40 라벨 칸: alert/ic_info 16 + 12px Medium 글자, gap 12)
 *   num-position : downside | upside  →  numPosition (눈금 숫자 element/x-axis_number 위치, 10px Regular neutral-70)
 *   ♦ legend · ♦ tickmark · ♦ right-area(input_text h36 48×24) · ♦ right-text(단위 10px) · ♦ text label · ♦ icon label
 *   rail_slider  : style bar(4px — 채움 neutral-70 / 배경 neutral-20) | point(1px neutral-40), 레일 좌우 여백 4px
 *   handler      : circle(10px neutral-70) | point(8×13 오각형), over = 20px 후광 neutral-70 25%, pressed = 50%
 *                  tooltip=on → 손잡이 위 tootip_text(bg neutral-20, 0.5px neutral-100, 10px)
 *   Tick Mark    : 1px neutral-40, 투명도 40%, 양 끝 정렬(space-between). count 5 베리언트는 실제 9개
 *   네이티브 input[type=range]를 투명하게 덮어 키보드(←/→/↑/↓/PageUp/PageDown/Home/End)와 스크린리더를 지원합니다.
 */
export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** text = 양쪽 −/+ 버튼, icon = 양쪽 아이콘·글자 라벨 (Figma: case) */
  case?: 'text' | 'icon';
  /** 눈금 숫자 위치 (Figma: num-position) */
  numPosition?: 'downside' | 'upside';
  /** 눈금 숫자. true면 [min, 중간, max], 배열이면 그 값을 양 끝 정렬로 표시, false면 숨김 (Figma: ♦ legend) */
  legend?: boolean | ReactNode[];
  /** 눈금선. true면 9개(Figma 기본), 숫자면 그 개수 (Figma: ♦ tickmark) */
  tickmark?: boolean | number;
  /** 레일 모양 (Figma: rail_slider style) */
  railStyle?: 'bar' | 'point';
  /** 손잡이 위 값 말풍선 (Figma: handler_slider tooltip=on) */
  tooltip?: boolean;
  /** 말풍선·스크린리더용 값 표시 형식 */
  formatValue?: (value: number) => string;
  /** 오른쪽 숫자 입력칸 (Figma: ♦ right-area) */
  input?: boolean;
  /** 입력칸 옆 단위 (Figma: ♦ right-text) */
  unit?: ReactNode;
  /** case=icon: 왼쪽/오른쪽 글자 라벨 (Figma: ♦ text label) */
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  /** case=icon: 라벨 아이콘. true면 기본(ic_info), ReactNode면 교체 (Figma: ♦ icon label) */
  icon?: IconProp;
  disabled?: boolean;
  /** 슬라이더 이름 (스크린리더) */
  'aria-label'?: string;
  className?: string;
}

const PointHandle = () => (
  <svg width="8" height="13" viewBox="0 0 8 13" aria-hidden className="absolute left-px -top-px fill-current">
    <path d="M0 4.5L4 0L8 4.5V12.5H0V4.5Z" />
  </svg>
);

export function Slider({
  value,
  defaultValue,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  case: caseVariant = 'text',
  numPosition = 'downside',
  legend = true,
  tickmark = true,
  railStyle = 'bar',
  tooltip = false,
  formatValue = String,
  input = true,
  unit,
  startLabel,
  endLabel,
  icon,
  disabled,
  'aria-label': ariaLabel = '값',
  className,
}: SliderProps) {
  const inputId = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const [inner, setInner] = useState(() => clamp(defaultValue ?? min));
  const current = clamp(value ?? inner);
  const pct = max > min ? (current - min) / (max - min) : 0;

  const commit = (n: number) => {
    const next = clamp(Number.isFinite(n) ? n : current);
    if (value === undefined) setInner(next);
    if (next !== current) onChange?.(next);
  };

  // 오른쪽 입력칸: 입력 중에는 문자열로 두고 blur/Enter에서 반영
  const [draft, setDraft] = useState(String(current));
  useEffect(() => setDraft(String(current)), [current]);
  const commitDraft = () => {
    const n = Number(draft);
    if (draft.trim() === '' || Number.isNaN(n)) setDraft(String(current));
    else commit(Math.round((n - min) / step) * step + min);
  };

  const legendItems =
    legend === true ? [min, (min + max) / 2, max] : Array.isArray(legend) ? legend : null;
  const tickCount = tickmark === true ? 9 : typeof tickmark === 'number' ? tickmark : 0;
  const iconNode = resolveIcon(icon, <IconInfo />);

  const legendRow = legendItems && (
    <div aria-hidden className="flex justify-between text-body-5 text-neutral-70">
      {legendItems.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );

  const side = (label: ReactNode) => (
    <div className="flex h-10 w-6 shrink-0 flex-col items-center justify-center px-1 text-neutral-70">
      {iconNode && <span className="inline-flex size-4 [&>svg]:size-full">{iconNode}</span>}
      {label != null && <span className="text-body-4">{label}</span>}
    </div>
  );

  const pos: CSSProperties = { left: `calc(${pct} * (100% - 10px))` };

  return (
    <div
      className={cn(
        'inline-flex items-center',
        caseVariant === 'text' ? 'gap-2' : 'gap-3',
        disabled && 'opacity-40',
        className,
      )}
    >
      {caseVariant === 'text' ? (
        <IconButton
          height="h24"
          label="감소"
          icon={<IconSubtract className="text-neutral-70" />}
          disabled={disabled || current <= min}
          onClick={() => commit(current - step)}
          className={cn(disabled && 'disabled:opacity-100')}
        />
      ) : (
        side(startLabel)
      )}

      <div className="flex min-w-[200px] flex-1 basis-[200px] flex-col">
        {numPosition === 'upside' && legendRow}

        <div className="relative h-2.5 px-1">
          {tickCount > 0 && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-1 top-1/2 flex h-3 -translate-y-1/2 justify-between opacity-40"
            >
              {Array.from({ length: tickCount }, (_, i) => (
                <span key={i} className="h-full w-px bg-neutral-40" />
              ))}
            </div>
          )}

          <div className="relative h-full">
            {/* 배경 레일 */}
            <span
              aria-hidden
              className={cn(
                'absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-full',
                railStyle === 'bar' ? 'h-1 bg-neutral-20' : 'h-px bg-neutral-40',
              )}
            />
            {/* 채움 */}
            {railStyle === 'bar' && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-70"
                style={{ width: `calc(5px + ${pct} * (100% - 10px))` }}
              />
            )}

            <input
              id={inputId}
              type="range"
              min={min}
              max={max}
              step={step}
              value={current}
              disabled={disabled}
              aria-label={ariaLabel}
              aria-valuetext={formatValue(current)}
              onChange={(e) => commit(Number(e.target.value))}
              className={cn(
                'peer absolute inset-0 m-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 disabled:cursor-not-allowed',
                '[&::-webkit-slider-thumb]:size-2.5 [&::-webkit-slider-thumb]:appearance-none',
                '[&::-moz-range-thumb]:size-2.5 [&::-moz-range-thumb]:border-0',
              )}
            />

            {/* 손잡이 (element/handler_slider) */}
            <span
              aria-hidden
              style={pos}
              className={cn(
                'pointer-events-none absolute top-0 size-2.5 text-neutral-70',
                'before:absolute before:-inset-[5px] before:rounded-full before:bg-neutral-70 before:opacity-0 before:transition-opacity motion-reduce:before:transition-none',
                'peer-enabled:peer-hover:before:opacity-25 peer-enabled:peer-active:before:opacity-50',
                'rounded-full peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-primary-70',
              )}
            >
              {railStyle === 'bar' ? (
                <span className="absolute inset-0 rounded-full bg-current" />
              ) : (
                <PointHandle />
              )}
              {tooltip && (
                <span className="absolute bottom-[calc(100%+3px)] left-1/2 flex -translate-x-1/2 flex-col items-center">
                  <span className="whitespace-nowrap bg-neutral-20 px-1.5 py-1 text-body-5 text-neutral-100 shadow-[0_0_0_0.5px_var(--color-neutral-100)]">
                    {formatValue(current)}
                  </span>
                  <svg width="6" height="4" viewBox="0 0 6 4" className="-mt-px fill-neutral-20 stroke-neutral-100" strokeOpacity={0.335} strokeWidth={0.5}>
                    <path d="M0 0L3 4L6 0" />
                  </svg>
                </span>
              )}
            </span>
          </div>
        </div>

        {numPosition === 'downside' && legendRow}
      </div>

      {caseVariant === 'text' ? (
        <IconButton
          height="h24"
          label="증가"
          icon={<IconAdd />}
          disabled={disabled || current >= max}
          onClick={() => commit(current + step)}
          className={cn(disabled && 'disabled:opacity-100')}
        />
      ) : (
        side(endLabel)
      )}

      {input && (
        <div className="flex shrink-0 items-center gap-1">
          <TextField
            height="h36"
            className={cn('w-12', disabled && 'opacity-100')}
            aria-label={`${ariaLabel} 입력`}
            inputMode="decimal"
            placeholder=""
            disabled={disabled}
            value={draft}
            onValueChange={setDraft}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitDraft();
            }}
          />
          {unit != null && <span className="text-body-5 text-neutral-70">{unit}</span>}
        </div>
      )}
    </div>
  );
}
