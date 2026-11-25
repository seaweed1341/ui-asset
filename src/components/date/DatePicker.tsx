import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { IconArrowDown, IconArrowLeft, IconArrowRight } from '../../icons';
import {
  MONTH_SHORT,
  WEEKDAY_SHORT,
  addDays,
  addMonths,
  compareDay,
  isSameDay,
  isSameMonth,
  monthGrid,
  spokenDate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type DateRange,
  type WeekStart,
} from './utils';

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70';
/** popup_date 컨테이너: bg neutral-10, 외곽선 neutral-40 0.67px, 반경 없음 */
export const datePopupBox = 'flex flex-col bg-neutral-10 shadow-[0_0_0_0.67px_var(--color-neutral-40)]';
const navBtn = cn(
  'inline-flex size-4 shrink-0 text-neutral-70 [&>svg]:size-full hover:text-neutral-100',
  'disabled:cursor-not-allowed disabled:opacity-40',
  focusRing,
);

/* -------------------------------------------------------------------------- */
/* element/date                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/date` (6 variants) + `element/highlight` (start | end)
 *   셀 32×32, 숫자 10px Regular, 원 26×26(셀 안 3px 여백)
 *   type   : default  — neutral-70 글자
 *            today    — neutral-100 글자 + 원 테두리 neutral-70 0.94px
 *            selected — 원 채움 neutral-70 + 글자 neutral-10, ♦ highlight면 반쪽 띠(element/highlight)
 *            range    — 높이 26 띠 neutral-20 (셀 전체 폭), 글자 neutral-70
 *   status : normal | disable(opacity 40%)
 *   hover  : Figma 미정의 — default/today 원 자리에 neutral-20 채움 (구현 추가)
 */
export interface DatePickerDayProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** 날짜 숫자 */
  day: ReactNode;
  type?: 'default' | 'today' | 'selected' | 'range';
  /** selected일 때 기간 띠 반쪽 (Figma: ♦ highlight + element/highlight type). start=오른쪽, end=왼쪽 */
  highlight?: false | 'start' | 'end';
  /** 선택 불가 (Figma: status=disable). 포커스는 받되 클릭은 무시합니다. */
  disabled?: boolean;
}

export const DatePickerDay = forwardRef<HTMLButtonElement, DatePickerDayProps>(function DatePickerDay(
  { day, type = 'default', highlight = false, disabled, className, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(
        'group relative flex size-8 shrink-0 items-center justify-center text-body-5 outline-none',
        disabled && 'cursor-not-allowed opacity-40',
        className,
      )}
      {...rest}
    >
      {type === 'range' && <span aria-hidden className="absolute inset-x-0 top-[3px] h-[26px] bg-neutral-20" />}
      {type === 'selected' && highlight && (
        <span
          aria-hidden
          className={cn('absolute top-[3px] h-[26px] w-4 bg-neutral-20', highlight === 'start' ? 'left-4' : 'left-0')}
        />
      )}
      <span
        aria-hidden
        className={cn(
          'absolute left-[3px] top-[3px] size-[26px] rounded-full',
          type === 'selected' && 'bg-neutral-70',
          type === 'today' && 'shadow-[inset_0_0_0_0.94px_var(--color-neutral-70)]',
          !disabled && (type === 'default' || type === 'today') && 'group-hover:bg-neutral-20',
          'group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-primary-70',
        )}
      />
      <span
        className={cn(
          'relative',
          type === 'selected' ? 'text-neutral-10' : type === 'today' ? 'text-neutral-100' : 'text-neutral-70',
        )}
      >
        {day}
      </span>
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/* element/month_02                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/month_02` (4 variants)
 *   51×26, p 7/10, 12px Medium
 *   type   : default(bg neutral-10, 글자 neutral-70) | selected(bg neutral-70, 글자 neutral-10)
 *   status : normal | disabled(opacity 40%)
 *   popup_date(type=month) 안에서는 70×42로 늘려 씁니다(className).
 *   hover  : Figma 미정의 — default에 neutral-20 (구현 추가)
 */
export interface DatePickerMonthProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label: ReactNode;
  selected?: boolean;
  disabled?: boolean;
}

export const DatePickerMonth = forwardRef<HTMLButtonElement, DatePickerMonthProps>(function DatePickerMonth(
  { label, selected = false, disabled, className, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={disabled ? undefined : onClick}
      className={cn(
        'inline-flex h-[26px] min-w-[51px] items-center justify-center px-2.5 py-[7px] text-body-4',
        selected ? 'bg-neutral-70 text-neutral-10' : 'bg-neutral-10 text-neutral-70',
        !selected && !disabled && 'hover:bg-neutral-20',
        disabled && 'cursor-not-allowed opacity-40',
        focusRing,
        className,
      )}
      {...rest}
    >
      {label}
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/* element/list_year                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/list_year` — 펼침형 연도 행 (popup_date flow=2)
 *   210×26 (popup 안 219), p 6/6/6/8, gap 5, 10px Regular neutral-100, ic_arrow_down 10
 *   펼침(expanded) bg neutral-20 / 접힘 bg neutral-10. 펼치면 화살표가 위를 봅니다.
 */
export interface DatePickerYearProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  label: ReactNode;
  expanded?: boolean;
}

export const DatePickerYear = forwardRef<HTMLButtonElement, DatePickerYearProps>(function DatePickerYear(
  { label, expanded = false, className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      className={cn(
        'flex h-[26px] w-[210px] items-center gap-[5px] py-1.5 pl-2 pr-1.5 text-left text-body-5 text-neutral-100',
        expanded ? 'bg-neutral-20' : 'bg-neutral-10 hover:bg-neutral-20',
        focusRing,
        'focus-visible:-outline-offset-2',
        className,
      )}
      {...rest}
    >
      <span className="min-w-0 flex-1">{label}</span>
      <span aria-hidden className={cn('inline-flex size-2.5 shrink-0 [&>svg]:size-full', expanded && 'rotate-180')}>
        <IconArrowDown />
      </span>
    </button>
  );
});

/* -------------------------------------------------------------------------- */
/* popup_date                                                                 */
/* -------------------------------------------------------------------------- */

type PickerView = 'date' | 'month' | 'year';

interface DatePickerCommonProps {
  /**
   * 처음 보여줄 화면 (Figma: popup_date type). 제목을 누르면 date → month → year로 올라가고,
   * 고르면 다시 type 화면까지 내려옵니다. type="month"/"year"는 그 화면에서 멈춥니다.
   */
  type?: PickerView;
  /** 표시 중인 달 (제어) */
  month?: Date;
  /** 표시 중인 달 초기값 (비제어). 기본: 선택값 → 오늘 */
  defaultMonth?: Date;
  /** 표시 달이 바뀔 때 (월/연도 화면에서 고른 경우 포함). 항상 1일로 전달 */
  onMonthChange?: (month: Date) => void;
  /** 오늘 기준일 (기본 new Date()) */
  today?: Date;
  minDate?: Date;
  maxDate?: Date;
  /** 개별 날짜 비활성 판정 */
  isDateDisabled?: (date: Date) => boolean;
  /** 요일 머리글. Figma에는 없어 기본 false. true면 SUN~SAT, 배열이면 그 글자 */
  weekdays?: boolean | string[];
  /** 주 시작 요일 0=일, 1=월 */
  weekStartsOn?: WeekStart;
  /** 월 이름 (제목·월 화면). 기본 Jan~Dec */
  monthLabels?: string[];
  /** 연도 목록 범위 [시작, 끝]. 기본: 오늘 ±10년(min/maxDate가 있으면 그 범위) */
  yearRange?: [number, number];
  /** Esc 키 */
  onClose?: () => void;
  /** 마운트 시 현재 날짜 칸으로 포커스 */
  autoFocus?: boolean;
  className?: string;
  'aria-label'?: string;
}

interface DatePickerSingleProps {
  /** single(기본) | range */
  mode?: 'single';
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date) => void;
}

interface DatePickerRangeProps {
  mode: 'range';
  value?: DateRange;
  defaultValue?: DateRange;
  /** 첫 클릭은 [시작, null], 두 번째 클릭에 [시작, 끝](순서 자동 정렬) */
  onChange?: (value: DateRange) => void;
}

export type DatePickerProps = DatePickerCommonProps & (DatePickerSingleProps | DatePickerRangeProps);

const yearBounds = (today: Date, month: Date, yearRange?: [number, number], min?: Date | null, max?: Date | null) => {
  if (yearRange) return yearRange;
  const y = today.getFullYear();
  let from = min ? min.getFullYear() : y - 10;
  let to = max ? max.getFullYear() : y + 10;
  from = Math.min(from, month.getFullYear());
  to = Math.max(to, month.getFullYear());
  return [from, to] as [number, number];
};

/**
 * Figma: `popup_date` (type: date | month | year, flow: -)
 *   date  : 250×240. top 40(제목 x16·y18 / 화살표 16×16 gap 13.4, 오른쪽 14.5) → gap 12 → 날짜 7열×32, 행 간격 4, 좌우 13, 하단 12
 *           제목 = element/title_date (12px Bold neutral-70 + ic_arrow_up 12 회전 = 아래 화살표)
 *   month : 250×244. 제목 "2023"(12px Bold) · 3열×4행 70×42, 열 간격 5.36 · 행 간격 8, 좌 15
 *   year  : 138×240. element/list_item 110×30(p 8/0, 10px Regular neutral-70, 선택 bg neutral-20), 왼쪽 8, 스크롤바
 *   컨테이너 bg neutral-10 · 외곽선 neutral-40 0.67px · 반경 0
 *
 * 키보드: 날짜 ←→↑↓(하루/한 주), Home/End(주 시작/끝), PageUp/PageDown(달, Shift=연), Enter·Space 선택, Esc 닫기
 *        월 ←→↑↓(±1/±3), 연도 ↑↓, Enter 선택
 */
export function DatePicker(props: DatePickerProps) {
  const {
    type = 'date',
    month: monthProp,
    defaultMonth,
    onMonthChange,
    today: todayProp,
    minDate,
    maxDate,
    isDateDisabled,
    weekdays = false,
    weekStartsOn = 0,
    monthLabels = MONTH_SHORT,
    yearRange,
    onClose,
    autoFocus = false,
    className,
    'aria-label': ariaLabel,
  } = props;

  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const min = minDate ? startOfDay(minDate) : null;
  const max = maxDate ? startOfDay(maxDate) : null;

  /* 선택값 (제어 + 비제어) */
  const [innerSingle, setInnerSingle] = useState<Date | null>(props.mode !== 'range' ? props.defaultValue ?? null : null);
  const [innerRange, setInnerRange] = useState<DateRange>(props.mode === 'range' ? props.defaultValue ?? [null, null] : [null, null]);
  const isRange = props.mode === 'range';
  const single = props.mode !== 'range' ? (props.value !== undefined ? props.value : innerSingle) : null;
  const range: DateRange = props.mode === 'range' ? (props.value !== undefined ? props.value : innerRange) : [null, null];

  /* 표시 달 */
  const [innerMonth, setInnerMonth] = useState(() => startOfMonth(monthProp ?? defaultMonth ?? single ?? range[0] ?? today));
  const month = monthProp ? startOfMonth(monthProp) : innerMonth;
  const setMonth = (d: Date) => {
    const m = startOfMonth(d);
    if (!monthProp) setInnerMonth(m);
    if (!isSameMonth(m, month)) onMonthChange?.(m);
  };

  const [view, setView] = useState<PickerView>(type);
  useEffect(() => setView(type), [type]);

  /* 로빙 포커스 */
  const [focusDate, setFocusDate] = useState<Date>(() => startOfDay(single ?? range[0] ?? today));
  const activeFocus = isSameMonth(focusDate, month) ? focusDate : isSameMonth(today, month) ? today : month;
  const [focusMonthIdx, setFocusMonthIdx] = useState(month.getMonth());
  const [focusYear, setFocusYear] = useState(month.getFullYear());
  const [hover, setHover] = useState<Date | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef(autoFocus);
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    rootRef.current?.querySelector<HTMLElement>('[data-roving="true"]')?.focus();
  });

  // 연도 화면: 현재 연도를 목록 가운데로
  useEffect(() => {
    if (view !== 'year') return;
    const list = yearListRef.current;
    const el = list?.querySelector<HTMLElement>('[data-roving="true"]');
    if (list && el) list.scrollTop = el.offsetTop - list.clientHeight / 2 + el.offsetHeight / 2;
  }, [view]);

  const isDisabled = (d: Date) =>
    !!((min && compareDay(d, min) < 0) || (max && compareDay(d, max) > 0) || isDateDisabled?.(d));

  const select = (d: Date) => {
    if (isDisabled(d)) return;
    setFocusDate(d);
    if (!isSameMonth(d, month)) setMonth(d);
    if (props.mode === 'range') {
      const [s, e] = range;
      const next: DateRange = !s || e ? [d, null] : compareDay(d, s) < 0 ? [d, s] : [s, d];
      if (props.value === undefined) setInnerRange(next);
      setHover(null);
      props.onChange?.(next);
    } else {
      if (props.value === undefined) setInnerSingle(d);
      props.onChange?.(d);
    }
  };

  const moveFocus = (d: Date) => {
    setFocusDate(d);
    if (!isSameMonth(d, month)) setMonth(d);
    if (isRange && range[0] && !range[1]) setHover(d);
    pendingFocus.current = true;
  };

  const onDayKey = (e: KeyboardEvent, d: Date) => {
    const moves: Record<string, () => Date> = {
      ArrowLeft: () => addDays(d, -1),
      ArrowRight: () => addDays(d, 1),
      ArrowUp: () => addDays(d, -7),
      ArrowDown: () => addDays(d, 7),
      Home: () => startOfWeek(d, weekStartsOn),
      End: () => addDays(startOfWeek(d, weekStartsOn), 6),
      PageUp: () => addMonths(d, e.shiftKey ? -12 : -1),
      PageDown: () => addMonths(d, e.shiftKey ? 12 : 1),
    };
    if (moves[e.key]) {
      e.preventDefault();
      moveFocus(moves[e.key]());
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      select(d);
    }
  };

  const onRootKey = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    const order: PickerView[] = ['date', 'month', 'year'];
    if (order.indexOf(view) > order.indexOf(type)) {
      // 위 단계에서 Esc → 원래 화면으로
      e.stopPropagation();
      setView(type);
      pendingFocus.current = true;
    } else if (onClose) {
      e.stopPropagation();
      onClose();
    }
  };

  const goView = (v: PickerView) => {
    setView(v);
    setFocusMonthIdx(month.getMonth());
    setFocusYear(month.getFullYear());
    pendingFocus.current = true;
  };

  const shiftMonth = (n: number) => {
    setMonth(addMonths(month, n));
    setFocusDate(addMonths(activeFocus, n));
  };

  const monthDisabled = (y: number, m: number) =>
    !!((max && compareDay(new Date(y, m, 1), max) > 0) || (min && compareDay(new Date(y, m + 1, 0), min) < 0));

  const pickMonth = (m: number) => {
    const y = month.getFullYear();
    if (monthDisabled(y, m)) return;
    setMonth(new Date(y, m, 1));
    setFocusDate(new Date(y, m, Math.min(activeFocus.getDate(), new Date(y, m + 1, 0).getDate())));
    if (type === 'date') goView('date');
    else pendingFocus.current = true;
  };

  const pickYear = (y: number) => {
    setMonth(new Date(y, month.getMonth(), 1));
    setFocusMonthIdx(month.getMonth());
    setFocusYear(y);
    if (type !== 'year') setView('month');
    pendingFocus.current = true;
  };

  /* ---------------------------------- year ---------------------------------- */
  if (view === 'year') {
    const [from, to] = yearBounds(today, month, yearRange, min, max);
    const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);
    const onYearKey = (e: KeyboardEvent, y: number) => {
      const next =
        e.key === 'ArrowUp' ? y - 1 : e.key === 'ArrowDown' ? y + 1 : e.key === 'Home' ? from : e.key === 'End' ? to : null;
      if (next != null) {
        e.preventDefault();
        setFocusYear(Math.min(to, Math.max(from, next)));
        pendingFocus.current = true;
      }
    };
    return (
      <div
        ref={rootRef}
        role="dialog"
        aria-label={ariaLabel ?? '연도 선택'}
        onKeyDown={onRootKey}
        className={cn(datePopupBox, 'h-[240px] w-[138px] py-1 pl-2 pr-1', className)}
      >
        <div
          ref={yearListRef}
          role="listbox"
          aria-label="연도"
          className="h-full overflow-y-auto pr-1 [scrollbar-color:var(--color-neutral-70)_var(--color-neutral-20)] [scrollbar-width:thin]"
        >
          {years.map((y) => {
            const sel = y === month.getFullYear();
            const focus = y === focusYear;
            return (
              <button
                key={y}
                type="button"
                role="option"
                aria-selected={sel}
                tabIndex={focus ? 0 : -1}
                data-roving={focus || undefined}
                onClick={() => pickYear(y)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    pickYear(y);
                  } else onYearKey(e, y);
                }}
                className={cn(
                  'flex h-[30px] w-full items-center px-0.5 py-2 text-left text-body-5 text-neutral-70',
                  sel ? 'bg-neutral-20' : 'hover:bg-neutral-20',
                  focusRing,
                  'focus-visible:-outline-offset-2',
                )}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------------------------- month --------------------------------- */
  if (view === 'month') {
    const y = month.getFullYear();
    const onMonthKey = (e: KeyboardEvent, m: number) => {
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -3, ArrowDown: 3 }[e.key];
      if (step === undefined) return;
      e.preventDefault();
      const n = m + step;
      if (n < 0 || n > 11) {
        setMonth(addMonths(month, n < 0 ? -12 : 12));
        setFocusMonthIdx((n + 12) % 12);
      } else setFocusMonthIdx(n);
      pendingFocus.current = true;
    };
    return (
      <div
        ref={rootRef}
        role="dialog"
        aria-label={ariaLabel ?? '월 선택'}
        onKeyDown={onRootKey}
        className={cn(datePopupBox, 'w-[250px] gap-3 pb-1', className)}
      >
        <div className="flex h-10 items-start justify-between pl-4 pr-[14.5px] pt-[18px]">
          <button
            type="button"
            onClick={() => goView('year')}
            aria-label={`${y}년, 연도 선택`}
            className={cn('text-body-4 font-bold text-neutral-70 hover:text-neutral-100', focusRing)}
          >
            {y}
          </button>
          <div className="flex gap-[13.4px]">
            <button type="button" aria-label="이전 연도" className={navBtn} onClick={() => setMonth(addMonths(month, -12))}>
              <IconArrowLeft />
            </button>
            <button type="button" aria-label="다음 연도" className={navBtn} onClick={() => setMonth(addMonths(month, 12))}>
              <IconArrowRight />
            </button>
          </div>
        </div>
        <div role="group" aria-label={`${y}년 월`} className="grid w-[220px] grid-cols-3 gap-x-[5.36px] gap-y-2 pl-[15px]">
          {monthLabels.map((label, m) => {
            const focus = m === focusMonthIdx;
            return (
              <DatePickerMonth
                key={m}
                label={label}
                selected={m === month.getMonth()}
                disabled={monthDisabled(y, m)}
                tabIndex={focus ? 0 : -1}
                data-roving={focus || undefined}
                aria-label={`${y}년 ${m + 1}월`}
                onClick={() => pickMonth(m)}
                onKeyDown={(e) => onMonthKey(e, m)}
                className="h-[42px] w-[70px]"
              />
            );
          })}
        </div>
      </div>
    );
  }

  /* ---------------------------------- date ---------------------------------- */
  const days = monthGrid(month, weekStartsOn);
  const rows = Array.from({ length: days.length / 7 }, (_, i) => days.slice(i * 7, i * 7 + 7));
  let [ra, rb] = [range[0], range[1] ?? (range[0] && hover ? hover : null)];
  if (ra && rb && compareDay(ra, rb) > 0) [ra, rb] = [rb, ra];
  const weekLabels = Array.isArray(weekdays)
    ? weekdays
    : Array.from({ length: 7 }, (_, i) => WEEKDAY_SHORT[(i + weekStartsOn) % 7]);
  const prevDisabled = !!min && compareDay(new Date(month.getFullYear(), month.getMonth(), 0), min) < 0;
  const nextDisabled = !!max && compareDay(new Date(month.getFullYear(), month.getMonth() + 1, 1), max) > 0;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label={ariaLabel ?? '날짜 선택'}
      onKeyDown={onRootKey}
      className={cn(datePopupBox, 'w-[250px] gap-3 pb-3', className)}
    >
      <div className="flex h-10 items-start justify-between pl-4 pr-[14.5px] pt-[18px]">
        {/* element/title_date */}
        <button
          type="button"
          onClick={() => goView('month')}
          aria-label={`${month.getFullYear()}년 ${month.getMonth() + 1}월, 월 선택`}
          className={cn('inline-flex items-center gap-0.5 text-body-4 font-bold text-neutral-70 hover:text-neutral-100', focusRing)}
        >
          {monthLabels[month.getMonth()]} {month.getFullYear()}
          <span aria-hidden className="inline-flex size-3 [&>svg]:size-full">
            <IconArrowDown />
          </span>
        </button>
        <div className="flex gap-[13.4px]">
          <button type="button" aria-label="이전 달" className={navBtn} disabled={prevDisabled} onClick={() => shiftMonth(-1)}>
            <IconArrowLeft />
          </button>
          <button type="button" aria-label="다음 달" className={navBtn} disabled={nextDisabled} onClick={() => shiftMonth(1)}>
            <IconArrowRight />
          </button>
        </div>
      </div>

      <div
        role="grid"
        aria-label={`${month.getFullYear()}년 ${month.getMonth() + 1}월`}
        aria-multiselectable={isRange || undefined}
        className="flex flex-col gap-1 px-[13px]"
        onMouseLeave={() => setHover(null)}
      >
        {weekdays !== false && (
          <div role="row" className="flex">
            {weekLabels.map((w) => (
              <span
                key={w}
                role="columnheader"
                className="flex h-5 w-8 items-center justify-center text-body-6 font-bold text-neutral-40"
              >
                {w}
              </span>
            ))}
          </div>
        )}
        {rows.map((row, i) => (
          <div role="row" key={i} className="flex">
            {row.map((d) => {
              const outside = !isSameMonth(d, month);
              const dis = outside || isDisabled(d);
              const sel = isRange ? isSameDay(d, ra) || isSameDay(d, rb) : isSameDay(d, single);
              const between = !!(isRange && ra && rb && compareDay(d, ra) > 0 && compareDay(d, rb) < 0);
              const isToday = isSameDay(d, today);
              const cellType = sel ? 'selected' : between ? 'range' : isToday ? 'today' : 'default';
              const highlight = sel && ra && rb && !isSameDay(ra, rb) ? (isSameDay(d, ra) ? 'start' : 'end') : false;
              const focus = !outside && isSameDay(d, activeFocus);
              return (
                <div role="gridcell" key={d.getTime()} aria-selected={sel || between}>
                  <DatePickerDay
                    day={d.getDate()}
                    type={cellType}
                    highlight={highlight}
                    disabled={dis}
                    tabIndex={focus ? 0 : -1}
                    data-roving={focus || undefined}
                    aria-label={spokenDate(d)}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => select(d)}
                    onKeyDown={(e) => onDayKey(e, d)}
                    onMouseEnter={() => isRange && range[0] && !range[1] && !dis && setHover(d)}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* popup_date flow=2 — 연도 펼침형 월 선택                                     */
/* -------------------------------------------------------------------------- */

export interface MonthPickerProps {
  /** 선택한 달 (1일 기준) */
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (month: Date) => void;
  today?: Date;
  minDate?: Date;
  maxDate?: Date;
  /** 연도 목록 범위. 기본 오늘 ±10년 */
  yearRange?: [number, number];
  /** 월 표기. 기본 1~12 숫자(Figma) */
  monthLabels?: string[];
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Figma: `popup_date` (type=date, flow=2) — 250×263
 *   top 40 : p 18/16/0/16, 제목(element/title_date) ↔ 화살표(gap 12) 양끝 정렬
 *   list   : x15.5, 219×211 세로 스크롤, element/list_year 행 + 펼친 연도 아래 element/month_02 4열(51×26, gap 5, 위아래 5)
 *   화살표는 펼친 연도를 앞뒤로 옮깁니다.
 */
export function MonthPicker({
  value,
  defaultValue = null,
  onChange,
  today: todayProp,
  minDate,
  maxDate,
  yearRange,
  monthLabels = Array.from({ length: 12 }, (_, i) => String(i + 1)),
  onClose,
  autoFocus = false,
  className,
}: MonthPickerProps) {
  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const [inner, setInner] = useState<Date | null>(defaultValue);
  const selected = value !== undefined ? value : inner;
  const base = selected ?? today;
  const [from, to] = yearBounds(today, base, yearRange, minDate, maxDate);
  const [openYear, setOpenYear] = useState(base.getFullYear());
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    const el = list?.querySelector<HTMLElement>(`[data-year="${openYear}"]`);
    if (list && el) list.scrollTop = el.offsetTop - 4;
  }, [openYear]);

  useEffect(() => {
    if (autoFocus) rootRef.current?.querySelector<HTMLElement>('[aria-pressed="true"], [aria-expanded="true"]')?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const disabled = (y: number, m: number) =>
    !!((maxDate && compareDay(new Date(y, m, 1), maxDate) > 0) || (minDate && compareDay(new Date(y, m + 1, 0), minDate) < 0));

  const pick = (y: number, m: number) => {
    if (disabled(y, m)) return;
    const d = new Date(y, m, 1);
    if (value === undefined) setInner(d);
    onChange?.(d);
  };

  const years = Array.from({ length: to - from + 1 }, (_, i) => from + i);

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="월 선택"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
      className={cn(datePopupBox, 'w-[250px] gap-3', className)}
    >
      <div className="flex h-10 items-start justify-between px-4 pt-[18px]">
        <span className="inline-flex items-center gap-0.5 text-body-4 font-bold text-neutral-70">
          {selected ? `${MONTH_SHORT[selected.getMonth()]} ${selected.getFullYear()}` : openYear}
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            aria-label="이전 연도"
            className={navBtn}
            disabled={openYear <= from}
            onClick={() => setOpenYear((y) => Math.max(from, y - 1))}
          >
            <IconArrowLeft />
          </button>
          <button
            type="button"
            aria-label="다음 연도"
            className={navBtn}
            disabled={openYear >= to}
            onClick={() => setOpenYear((y) => Math.min(to, y + 1))}
          >
            <IconArrowRight />
          </button>
        </div>
      </div>
      <div
        ref={listRef}
        className="relative h-[211px] w-[234.5px] overflow-y-auto pl-[15.5px] [scrollbar-color:var(--color-neutral-70)_var(--color-neutral-20)] [scrollbar-width:thin]"
      >
        <div className="flex w-[219px] flex-col gap-[3px]">
          {years.map((y) => {
            const open = y === openYear;
            return (
              <div key={y} data-year={y}>
                <DatePickerYear label={y} expanded={open} className="w-full" onClick={() => setOpenYear(open ? -1 : y)} />
                {open && (
                  <div role="group" aria-label={`${y}년 월`} className="grid grid-cols-4 gap-[5px] py-[5px]">
                    {monthLabels.map((label, m) => (
                      <DatePickerMonth
                        key={m}
                        label={label}
                        aria-label={`${y}년 ${m + 1}월`}
                        selected={!!selected && selected.getFullYear() === y && selected.getMonth() === m}
                        disabled={disabled(y, m)}
                        onClick={() => pick(y, m)}
                        className="w-full min-w-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
