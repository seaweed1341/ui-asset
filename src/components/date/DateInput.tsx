import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { DatePicker, type DatePickerProps } from './DatePicker';
import { IconCalendar } from './icons';
import { formatYmd, formatYmdRange, parseYmd, parseYmdRange, type DateRange, type WeekStart } from './utils';

interface DateInputCommonProps {
  /** 입력창 위 라벨 (Figma: ♦ label, 8px Regular neutral-70) */
  label?: ReactNode;
  /** 비어 있을 때 문구. 기본 "YYYY.MM.DD" / range "YYYY.MM.DD ~ YYYY.MM.DD" */
  placeholder?: string;
  /** 오류 상태 (Figma: status=error). 문자열이면 하단 오류 문구 */
  error?: boolean | string;
  /** 비활성 (Figma: status=over 화면 — bg neutral-20, 글자 neutral-40, 전체 60%) */
  disabled?: boolean;
  /** 테두리 없는 읽기 전용 (Figma: status=text). 달력도 열리지 않습니다. */
  plain?: boolean;
  /** 키보드 입력 허용 (기본 true). false면 달력으로만 고릅니다. */
  editable?: boolean;
  /** 달력 열림 (제어) */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  today?: Date;
  weekStartsOn?: WeekStart;
  /** 달력 요일 머리글 (DatePicker weekdays) */
  weekdays?: DatePickerProps['weekdays'];
  /** 달력 팝업 정렬 */
  popupAlign?: 'left' | 'right';
  id?: string;
  name?: string;
  className?: string;
  'aria-label'?: string;
}

interface DateInputSingleProps {
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
}

interface DateInputRangeProps {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  onChange?: (value: DateRange) => void;
}

export type DateInputProps = DateInputCommonProps & (DateInputSingleProps | DateInputRangeProps);

/**
 * Figma: `Date input` (5 variants) — 열면 `popup_date`
 *   input_date : 180×24, p 5/8, gap 4, 10px Regular, 오른쪽 common/ic_calendar 12
 *   status     : enabled — bg neutral-10, 테두리 neutral-40 1px, 글자 neutral-70
 *                active  — 테두리 neutral-100, 글자 neutral-100 Bold (달력 열림 / 포커스)
 *                error   — 반경 4, 테두리 error-60, 아래 supporting-text 8px Regular error-80-text (p 0/8, gap 2)
 *                text    — 테두리 없음 (plain)
 *                over    — bg neutral-20, 글자 neutral-40, 아이콘 50%, 전체 60% → disabled로 사용
 *   label      : 8px Regular neutral-70, 좌우 1.34
 *   popup      : 입력창 아래 4px(active gap 4)
 * 값 형식: 단일 YYYY.MM.DD, 기간 YYYY.MM.DD ~ YYYY.MM.DD. 직접 입력 후 Enter/blur 시 해석, 틀리면 이전 값으로 되돌립니다.
 * 키보드: ↓ 또는 Alt+↓ 달력 열기(날짜로 포커스), Esc 닫기(입력창으로 포커스 복귀)
 */
export function DateInput(props: DateInputProps) {
  const {
    label,
    placeholder,
    error,
    disabled = false,
    plain = false,
    editable = true,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    minDate,
    maxDate,
    isDateDisabled,
    today,
    weekStartsOn,
    weekdays,
    popupAlign = 'left',
    id,
    name,
    className,
    'aria-label': ariaLabel,
  } = props;

  const autoId = useId();
  const inputId = id ?? autoId;
  const errId = `${inputId}-error`;
  const popupId = `${inputId}-popup`;
  const isRange = props.mode === 'range';

  const [innerSingle, setInnerSingle] = useState<Date | null>(props.mode !== 'range' ? props.defaultValue ?? null : null);
  const [innerRange, setInnerRange] = useState<DateRange>(props.mode === 'range' ? props.defaultValue ?? [null, null] : [null, null]);
  const single = props.mode !== 'range' ? (props.value !== undefined ? props.value : innerSingle) : null;
  const range: DateRange = props.mode === 'range' ? (props.value !== undefined ? props.value : innerRange) : [null, null];
  const text = isRange ? formatYmdRange(range) : formatYmd(single);

  const [draft, setDraft] = useState<string | null>(null);
  // 기간: 시작만 고른 상태는 내부에만 두고, 끝까지 고르면 onChange
  const [pending, setPending] = useState<DateRange | null>(null);
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = !disabled && !plain && (openProp ?? innerOpen);
  const setOpen = (v: boolean) => {
    if (openProp === undefined) setInnerOpen(v);
    onOpenChange?.(v);
  };

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 바깥 클릭으로 닫기
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setPending(null);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const commitSingle = (d: Date | null) => {
    if (props.mode === 'range') return;
    if (props.value === undefined) setInnerSingle(d);
    props.onChange?.(d);
  };
  const commitRange = (r: DateRange) => {
    if (props.mode !== 'range') return;
    if (props.value === undefined) setInnerRange(r);
    props.onChange?.(r);
  };

  const commitDraft = () => {
    if (draft === null) return;
    const t = draft.trim();
    if (t === '') {
      if (isRange) commitRange([null, null]);
      else commitSingle(null);
    } else if (isRange) {
      const r = parseYmdRange(t);
      if (r) commitRange(r);
    } else {
      const d = parseYmd(t);
      if (d) commitSingle(d);
    }
    setDraft(null);
  };

  const close = (refocus: boolean) => {
    setOpen(false);
    setPending(null);
    if (refocus) inputRef.current?.focus();
  };

  const onInputKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commitDraft();
    } else if (e.key === 'ArrowDown' && !plain) {
      e.preventDefault();
      commitDraft();
      setOpen(true);
      // 열린 뒤 달력의 날짜로 포커스
      requestAnimationFrame(() =>
        rootRef.current?.querySelector<HTMLElement>(`#${CSS.escape(popupId)} [data-roving="true"]`)?.focus(),
      );
    } else if (e.key === 'Escape' && open) {
      e.preventDefault();
      setOpen(false);
    }
  };

  const status = disabled ? 'disabled' : error ? 'error' : plain ? 'text' : open ? 'active' : 'enabled';
  const errorText = typeof error === 'string' ? error : null;
  const ph = placeholder ?? (isRange ? 'YYYY.MM.DD ~ YYYY.MM.DD' : 'YYYY.MM.DD');

  const pickerCommon = {
    autoFocus: false,
    today,
    minDate,
    maxDate,
    isDateDisabled,
    weekStartsOn,
    weekdays,
    onClose: () => close(true),
  };

  return (
    <div ref={rootRef} className={cn('relative inline-flex w-[180px] flex-col gap-0.5', disabled && 'opacity-60', className)}>
      {label != null && (
        <label htmlFor={inputId} className="px-[1.34px] text-body-6 text-neutral-70">
          {label}
        </label>
      )}

      <div
        className={cn(
          'group flex h-6 w-full items-center gap-1 px-2 py-[5px] transition-shadow',
          status === 'enabled' && 'bg-neutral-10 shadow-[inset_0_0_0_1px_var(--color-neutral-40)] focus-within:shadow-[inset_0_0_0_1px_var(--color-neutral-100)]',
          status === 'active' && 'bg-neutral-10 shadow-[inset_0_0_0_1px_var(--color-neutral-100)]',
          status === 'error' && 'rounded bg-neutral-10 shadow-[inset_0_0_0_1px_var(--color-error-60)]',
          status === 'text' && 'bg-neutral-10',
          status === 'disabled' && 'bg-neutral-20 shadow-[inset_0_0_0_1px_var(--color-neutral-40)]',
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          role="combobox"
          aria-label={label == null ? ariaLabel ?? (isRange ? '기간 선택' : '날짜 선택') : undefined}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={open ? popupId : undefined}
          aria-invalid={!!error || undefined}
          aria-describedby={errorText ? errId : undefined}
          disabled={disabled}
          readOnly={plain || !editable}
          placeholder={ph}
          value={draft ?? text}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onClick={() => !plain && setOpen(true)}
          onKeyDown={onInputKey}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-body-5 outline-none placeholder:text-neutral-70',
            status === 'disabled' ? 'text-neutral-40 placeholder:text-neutral-40' : 'text-neutral-100',
            status === 'active' && 'font-bold',
            status === 'enabled' && 'group-focus-within:font-bold',
            !editable && !plain && 'cursor-pointer',
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          aria-label={open ? '달력 닫기' : '달력 열기'}
          disabled={disabled || plain}
          onClick={() => {
            setOpen(!open);
            inputRef.current?.focus();
          }}
          className={cn(
            'inline-flex size-3 shrink-0 text-neutral-100 [&>svg]:size-full',
            status === 'disabled' && 'opacity-50',
            plain && 'cursor-default',
          )}
        >
          <IconCalendar />
        </button>
      </div>

      {errorText && (
        <p id={errId} className="px-2 text-body-6 text-error-80-text">
          {errorText}
        </p>
      )}

      {open && (
        <div id={popupId} className={cn('absolute top-full z-30 mt-1', popupAlign === 'right' ? 'right-0' : 'left-0')}>
          {props.mode === 'range' ? (
            <DatePicker
              {...pickerCommon}
              mode="range"
              value={pending ?? range}
              onChange={(r) => {
                if (r[0] && r[1]) {
                  commitRange(r);
                  close(true);
                } else setPending(r);
              }}
            />
          ) : (
            <DatePicker
              {...pickerCommon}
              value={single}
              onChange={(d) => {
                commitSingle(d);
                close(true);
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
