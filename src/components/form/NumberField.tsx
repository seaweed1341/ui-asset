import {
  forwardRef,
  useId,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconClose, IconSearch, IconSort } from '../../icons';

/**
 * Figma: Components / `input_number` (5 variants)
 *   height : h48 (Figma 실측 160×24 — 입력 p 4/10, gap 10, 10px Regular)
 *   type   : default
 *   status : enabled(1px neutral-40) | active(:focus-within, 1px neutral-70 + ic_close)
 *            | error(1px error-60) | disabled(bg neutral-20, 투명도 40%) | text(테두리 없음, readOnly)
 *   props  : ♦ label(8px neutral-70) · ♦ left icon(ic_search 12, swap) · ♦ right-text(unit 12px Medium)
 *            · ♦ bottom(♦ bottom-text · ♦ bottom-count, 10px, p 0/10, gap 5) · text(placeholder)
 *   오른쪽 스테퍼 : arrow/ic_arrow_table_fill 16 (위쪽 절반 = 증가, 아래쪽 절반 = 감소), 오른쪽 묶음 gap 6
 *   키보드 : ↑/↓ = step, PageUp/PageDown = step×10, Home/End = min/max
 */
const field = cva('flex w-full items-center gap-2.5 bg-neutral-10 px-2.5 py-1 text-body-5 transition-shadow', {
  variants: {
    status: {
      enabled: 'ring-1 ring-inset ring-neutral-40 focus-within:ring-neutral-70',
      error: 'ring-1 ring-inset ring-error-60',
      disabled: 'bg-neutral-20 ring-1 ring-inset ring-neutral-40',
      text: '',
    },
  },
  defaultVariants: { status: 'enabled' },
});

const iconBox = 'inline-flex shrink-0 [&>svg]:size-full';

export interface NumberFieldProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'size' | 'type' | 'height' | 'value' | 'defaultValue' | 'onChange' | 'min' | 'max' | 'step'
  > {
  /** 입력창 위 라벨 (Figma: ♦ label) */
  label?: ReactNode;
  /** Figma height 베리언트. 현재 h48 하나 */
  height?: 'h48';
  /** 제어 값. 비어 있으면 null */
  value?: number | null;
  /** 비제어 초기값 */
  defaultValue?: number | null;
  /** 값이 바뀔 때 (빈 칸이면 null) */
  onChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  /** 왼쪽 아이콘: true면 기본(ic_search), ReactNode면 교체 (Figma: ♦ left icon) */
  icon?: IconProp;
  /** 오른쪽 단위 텍스트 (Figma: ♦ right-text / unit) */
  unit?: ReactNode;
  /** 값이 있고 포커스 중일 때 지우기(ic_close) 버튼 (Figma: status=active) */
  clearable?: boolean;
  /** 하단 보조 문구 (Figma: ♦ bottom-text) */
  helperText?: ReactNode;
  /** 오류 상태. 문자열이면 하단 문구를 오류 문구로 대체 */
  error?: boolean | string;
  /** 하단 글자 수 (Figma: ♦ bottom-count). maxLength 필요 */
  showCount?: boolean;
  disabled?: boolean;
  /** 테두리 없는 읽기 전용 텍스트 (Figma: status=text) */
  plain?: boolean;
}

const decimals = (n: number) => {
  const s = String(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
};

export const NumberField = forwardRef<HTMLInputElement, NumberFieldProps>(function NumberField(
  {
    label,
    height = 'h48',
    value,
    defaultValue = null,
    onChange,
    min,
    max,
    step = 1,
    icon,
    unit,
    clearable = true,
    helperText,
    error,
    showCount = false,
    disabled,
    plain = false,
    maxLength,
    className,
    id,
    placeholder = 'placeholder',
    onKeyDown,
    onBlur,
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helpId = `${inputId}-help`;

  const controlled = value !== undefined;
  const [inner, setInner] = useState<number | null>(defaultValue);
  const current = controlled ? value : inner;
  // 입력 중인 문자열 ("-", "1." 같은 중간 상태 보존)
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? (current == null ? '' : String(current));

  const status = disabled ? 'disabled' : error ? 'error' : plain ? 'text' : 'enabled';
  const interactive = !disabled && !plain;
  const iconNode = resolveIcon(icon, <IconSearch />);
  const bottomText = typeof error === 'string' ? error : helperText;
  const hasBottom = bottomText != null || (showCount && maxLength != null);

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  const commit = (next: number | null) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  const stepBy = (delta: number) => {
    const base = current ?? (delta > 0 ? (min ?? 0) - step : (max ?? 0) + step);
    const digits = Math.max(decimals(step), decimals(base));
    commit(clamp(Number((base + delta).toFixed(digits))));
    setDraft(null);
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !interactive) return;
    const map: Record<string, () => void> = {
      ArrowUp: () => stepBy(step),
      ArrowDown: () => stepBy(-step),
      PageUp: () => stepBy(step * 10),
      PageDown: () => stepBy(-step * 10),
      Home: () => min != null && commit(min),
      End: () => max != null && commit(max),
    };
    const fn = map[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  const atMax = max != null && current != null && current >= max;
  const atMin = min != null && current != null && current <= min;

  return (
    <div data-height={height} className={cn('inline-flex w-40 flex-col gap-0.5', disabled && 'opacity-40', className)}>
      {label != null && (
        <label htmlFor={inputId} className="px-[1.34px] text-body-6 text-neutral-70">
          {label}
        </label>
      )}

      <div className={cn(field({ status }), 'group/num')}>
        {iconNode && <span className={cn(iconBox, 'size-3 text-neutral-100')}>{iconNode}</span>}

        <input
          ref={ref}
          id={inputId}
          type="text"
          inputMode="decimal"
          role="spinbutton"
          aria-valuenow={current ?? undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-invalid={!!error || undefined}
          aria-describedby={hasBottom ? helpId : undefined}
          disabled={disabled}
          readOnly={plain || rest.readOnly}
          value={text}
          maxLength={maxLength}
          placeholder={placeholder}
          onKeyDown={handleKey}
          onChange={(e) => {
            const raw = e.target.value;
            if (!/^-?\d*\.?\d*$/.test(raw)) return;
            setDraft(raw);
            if (raw === '') commit(null);
            else if (!Number.isNaN(Number(raw)) && raw !== '-' && !raw.endsWith('.')) commit(Number(raw));
          }}
          onBlur={(e) => {
            onBlur?.(e);
            if (draft != null && current != null && clamp(current) !== current) commit(clamp(current));
            setDraft(null);
          }}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-neutral-70 outline-none placeholder:text-neutral-40',
            'disabled:cursor-not-allowed disabled:placeholder:text-neutral-70',
          )}
          {...rest}
        />

        <span className="flex shrink-0 items-center gap-1.5">
          {unit != null && <span className="text-body-4 text-neutral-70">{unit}</span>}

          {clearable && interactive && current != null && (
            <button
              type="button"
              aria-label="지우기"
              tabIndex={-1}
              className={cn(iconBox, 'hidden size-3 text-neutral-70 group-focus-within/num:inline-flex')}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                commit(null);
                setDraft(null);
              }}
            >
              <IconClose />
            </button>
          )}

          {!plain && (
            <span className="relative inline-flex size-4 shrink-0 text-neutral-70 [&>svg]:size-full">
              <IconSort />
              {/* 스테퍼: 키보드는 입력창의 ↑/↓로 조작하므로 탭 순서에서 뺍니다 */}
              <button
                type="button"
                tabIndex={-1}
                aria-label="증가"
                disabled={disabled || atMax}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => stepBy(step)}
                className="absolute inset-x-0 top-0 h-1/2 cursor-pointer disabled:cursor-not-allowed"
              />
              <button
                type="button"
                tabIndex={-1}
                aria-label="감소"
                disabled={disabled || atMin}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => stepBy(-step)}
                className="absolute inset-x-0 bottom-0 h-1/2 cursor-pointer disabled:cursor-not-allowed"
              />
            </span>
          )}
        </span>
      </div>

      {hasBottom && (
        <div
          id={helpId}
          className={cn(
            'flex items-center justify-end gap-[5px] px-2.5 text-body-5',
            error ? 'text-error-80-text' : 'text-neutral-70',
          )}
        >
          {bottomText != null && <span className="flex-1">{bottomText}</span>}
          {showCount && maxLength != null && (
            <span className="shrink-0">
              {text.length} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
