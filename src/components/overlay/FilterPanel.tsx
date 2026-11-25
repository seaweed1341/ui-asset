import { useId, useRef, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconClose } from '../../icons';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { IconCalendar } from './icons';
import { useControllable, useOverlayFocus } from './useOverlayFocus';

/**
 * Figma: `filter` (2200:43499) — 300×720
 *   title    : element/title_popup size=large — p 16/12, 15px Bold neutral-100, 닫기 ic_close 14 neutral-70
 *   divider  : neutral-40 1px
 *   body     : SLOT p 16/20/0/16, gap 28 (element/section_filter 반복), ♦ scroll(세로 스크롤)
 *   bottom   : divider + p12 gap8 — [Reset secondary h26][Apply primary h26] 같은 폭
 *   컨테이너 : bg neutral-10, stroke neutral-40 1px
 *   LCS 화면설계서: 246px 폭 오른쪽 사이드 패널로 밀려 들어옴 → placement="right", width={246}
 */
export interface FilterPanelProps {
  title?: ReactNode;
  /** 필터 섹션들 (FilterSection) */
  children: ReactNode;
  /** inline: 제자리 / right: 화면 오른쪽에 고정되어 밀려 들어오는 사이드 패널 */
  placement?: 'inline' | 'right';
  /** placement="right"일 때 열림 여부 */
  open?: boolean;
  onClose?: () => void;
  onReset?: () => void;
  onApply?: () => void;
  resetLabel?: string;
  applyLabel?: string;
  /** 폭(px). Figma 300, LCS 246 */
  width?: number;
  /** inline일 때 높이(px). 생략하면 내용만큼 (right는 화면 높이) */
  height?: number;
  /** ♦ scroll — 본문 세로 스크롤 */
  scroll?: boolean;
  className?: string;
}

export function FilterPanel({
  title = 'Filter',
  children,
  placement = 'inline',
  open = true,
  onClose,
  onReset,
  onApply,
  resetLabel = 'Reset',
  applyLabel = 'Apply',
  width = 300,
  height,
  scroll = true,
  className,
}: FilterPanelProps) {
  const titleId = useId();
  const ref = useRef<HTMLElement>(null);
  const side = placement === 'right';
  const shown = side ? open : true;

  useOverlayFocus(ref, { open: side && open, onEscape: onClose });

  return (
    <section
      ref={ref}
      role={side ? 'dialog' : 'region'}
      aria-labelledby={titleId}
      aria-hidden={side && !open ? true : undefined}
      tabIndex={-1}
      style={{ width, height: side ? undefined : height }}
      className={cn(
        'flex max-w-full flex-col bg-neutral-10 shadow-[inset_0_0_0_1px_var(--color-neutral-40)] outline-none',
        side && [
          'fixed inset-y-0 right-0 z-40 transition-[transform,visibility] duration-200 ease-out motion-reduce:transition-none',
          shown ? 'visible translate-x-0' : 'invisible translate-x-full',
        ],
        className,
      )}
    >
      <header className="flex shrink-0 items-start gap-2 px-3 py-4">
        <h2 id={titleId} className="min-w-0 flex-1 text-body-3 font-bold text-neutral-100">
          {title}
        </h2>
        {onClose && (
          <button
            type="button"
            aria-label="필터 닫기"
            onClick={onClose}
            className="mt-[3.5px] inline-flex size-3.5 shrink-0 text-neutral-70 [&>svg]:size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
          >
            <IconClose />
          </button>
        )}
      </header>
      <div aria-hidden className="h-px shrink-0 bg-neutral-40" />

      <div className={cn('flex min-h-0 flex-1 flex-col gap-7 pb-4 pl-4 pr-5 pt-4', scroll && 'overflow-y-auto')}>{children}</div>

      {(onReset || onApply) && (
        <footer className="shrink-0">
          <div aria-hidden className="h-px bg-neutral-40" />
          <div className="flex items-center justify-center gap-2 p-3">
            {onReset && <Button variant="secondary" height="h26" label={resetLabel} onClick={onReset} className="flex-1" />}
            {onApply && <Button height="h26" label={applyLabel} onClick={onApply} className="flex-1" />}
          </div>
        </footer>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------ */

export interface FilterOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

/**
 * Figma: `element/section_filter` (2200:43363) — 240×165, gap 8
 *   ♦ title_divider : 그룹 제목 10px Bold neutral-40 + divider (gap 5)
 *   section         : gap 8 — 제목 12px Medium neutral-100 · ♦ date picker(Date input h24) · list
 *   list (SLOT)     : checkbox_label gap 4. 첫 줄은 전체 선택, 나머지는 pl16 들여쓰기
 *   Date input      : p 5/8, gap 4, stroke neutral-40, 10px Regular neutral-70 + ic_calendar 12
 */
export interface FilterSectionProps {
  /** ♦ title_divider — 위쪽 그룹 제목(회색) + 구분선 */
  groupTitle?: ReactNode;
  title: ReactNode;
  /** ♦ date picker — true면 기본 날짜 범위 필드, ReactNode면 교체 */
  date?: boolean | ReactNode;
  /** date=true일 때 표시할 값 (없으면 placeholder) */
  dateText?: ReactNode;
  onDateClick?: () => void;
  /** ♦ list — 체크박스 목록 */
  options?: FilterOption[];
  /** 주면 맨 위에 전체 선택 체크박스를 두고 나머지를 16px 들여씁니다 */
  allLabel?: ReactNode;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** 목록 대신 직접 구성 (Figma list2 SLOT) */
  children?: ReactNode;
  className?: string;
}

export function FilterSection({
  groupTitle,
  title,
  date,
  dateText,
  onDateClick,
  options,
  allLabel,
  value,
  defaultValue = [],
  onValueChange,
  children,
  className,
}: FilterSectionProps) {
  const titleId = useId();
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  const enabled = (options ?? []).filter((o) => !o.disabled).map((o) => o.value);
  const all = enabled.length > 0 && enabled.every((v) => selected.includes(v));
  const some = !all && enabled.some((v) => selected.includes(v));

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {groupTitle != null && (
        <div className="flex flex-col gap-[5px]">
          <p className="text-body-5 font-bold text-neutral-40">{groupTitle}</p>
          <div aria-hidden className="h-px bg-neutral-40" />
        </div>
      )}
      <div role="group" aria-labelledby={titleId} className="flex flex-col gap-2">
        <p id={titleId} className="text-body-4 text-neutral-100">
          {title}
        </p>
        {date === true ? (
          <button
            type="button"
            onClick={onDateClick}
            className="flex h-6 w-full items-center gap-1 bg-neutral-10 px-2 py-[5px] text-left text-body-5 text-neutral-70 ring-1 ring-inset ring-neutral-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
          >
            <span className="min-w-0 flex-1 truncate">{dateText ?? 'YYYY.MM.DD ~ YYYY.MM.DD'}</span>
            <span aria-hidden className="inline-flex size-3 shrink-0 text-neutral-100 [&>svg]:size-full">
              <IconCalendar />
            </span>
          </button>
        ) : (
          date || null
        )}
        {children ??
          (options && options.length > 0 && (
            <div className="flex flex-col gap-1">
              {allLabel != null && (
                <Checkbox
                  label={allLabel}
                  checked={all}
                  indeterminate={some}
                  onChange={() => setSelected(all ? selected.filter((v) => !enabled.includes(v)) : Array.from(new Set([...selected, ...enabled])))}
                  className="self-start"
                />
              )}
              {options.map((o) => (
                <Checkbox
                  key={o.value}
                  label={o.label}
                  disabled={o.disabled}
                  checked={selected.includes(o.value)}
                  onChange={(e) =>
                    setSelected(e.target.checked ? [...selected, o.value] : selected.filter((v) => v !== o.value))
                  }
                  className={cn('self-start', allLabel != null && 'pl-4')}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}
