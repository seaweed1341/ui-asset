import { Fragment, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconAdd } from '../../icons';
import { BadgeDot } from '../BadgeDot';

/* ------------------------------------------------------------------------------------------------
 * 공통: 제어/비제어 선택 + 화살표 키 이동(roving tabindex)
 * ---------------------------------------------------------------------------------------------- */
interface Selectable {
  value: string;
  disabled?: boolean;
}

function useRovingSelection<T extends Selectable>(
  items: T[],
  value: string | undefined,
  defaultValue: string | undefined,
  onChange: ((v: string) => void) | undefined,
) {
  const [inner, setInner] = useState(defaultValue ?? items.find((i) => !i.disabled)?.value);
  const selected = value ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    if (v !== selected) onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const enabled = items.map((it, k) => (it.disabled ? -1 : k)).filter((k) => k >= 0);
    if (!enabled.length) return;
    let n: number;
    if (e.key === 'Home') n = enabled[0];
    else if (e.key === 'End') n = enabled[enabled.length - 1];
    else {
      const step = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1;
      const pos = enabled.indexOf(i);
      n = enabled[(pos + step + enabled.length) % enabled.length];
    }
    refs.current[n]?.focus();
    select(items[n].value);
  };

  /** 선택된 항목이 없거나 비활성이면 첫 활성 항목이 Tab 진입점 */
  const focusable = items.some((it) => it.value === selected && !it.disabled)
    ? selected
    : items.find((it) => !it.disabled)?.value;

  return { selected, select, refs, onKeyDown, focusable };
}

const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70';

/* ------------------------------------------------------------------------------------------------
 * element/tab_segment — 박스/세그먼트 탭의 한 칸
 * ---------------------------------------------------------------------------------------------- */
export interface TabSegmentItem {
  value: string;
  /** 라벨 (Figma: text). 생략하면 아이콘만 — 이때 ariaLabel 필수 */
  label?: ReactNode;
  ariaLabel?: string;
  /** Figma icon on/off + icon change. true면 기본 ic_add */
  icon?: IconProp;
  /** 좌측 알림 점 (Figma: badge, element/badgedot medium 6px) */
  badge?: boolean;
  /** 라벨 뒤 보조 숫자 (Figma: subnum + num, 예: "(3)") */
  count?: ReactNode;
  disabled?: boolean;
}

/**
 * Figma: `element/tab_segment` (4 variants) — status default | select · icon on | off
 *   h26 · p6 · gap3 · 테두리 neutral-40 (0.67 → 1px) · 모서리 직각
 *   default : bg neutral-10, 아이콘/텍스트 neutral-70, 10px Regular
 *   select  : bg neutral-70, 아이콘/텍스트 neutral-10, 10px Bold (보조 숫자는 Regular)
 *   아이콘 12×12(기본 ic_add) · badge 6px · num "(3)" 10px Regular
 */
function SegmentButton({
  item,
  selected,
  role,
  tabIndex,
  onSelect,
  onKeyDown,
  btnRef,
  className,
}: {
  item: TabSegmentItem;
  selected: boolean;
  role: 'tab' | 'radio';
  tabIndex: number;
  onSelect: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  btnRef: (el: HTMLButtonElement | null) => void;
  className?: string;
}) {
  const icon = resolveIcon(item.icon, <IconAdd />);
  return (
    <button
      ref={btnRef}
      type="button"
      role={role}
      aria-selected={role === 'tab' ? selected : undefined}
      aria-checked={role === 'radio' ? selected : undefined}
      aria-label={item.label == null ? item.ariaLabel : undefined}
      tabIndex={tabIndex}
      disabled={item.disabled}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      className={cn(
        'relative inline-flex h-[26px] shrink-0 items-center justify-center gap-[3px] whitespace-nowrap border border-neutral-40 p-1.5 text-body-5 transition-colors',
        selected ? 'bg-neutral-70 font-bold text-neutral-10' : 'bg-neutral-10 text-neutral-70',
        'disabled:cursor-not-allowed disabled:opacity-40',
        focusRing,
        className,
      )}
    >
      {item.badge && <BadgeDot aria-label="새 항목" />}
      {icon && (
        <span aria-hidden className="inline-flex size-3 shrink-0 [&>svg]:size-full">
          {icon}
        </span>
      )}
      {item.label != null && <span>{item.label}</span>}
      {item.count != null && <span className="font-regular">{item.count}</span>}
    </button>
  );
}

interface SegmentGroupProps {
  items: TabSegmentItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: `tab_group_box` — element/tab_segment 를 gap 6 으로 띄워 나열한 박스형 탭.
 *   role="tablist" / "tab", ←→(↑↓) Home End 로 이동하며 바로 선택(automatic activation).
 *   패널과 연결하려면 items의 value로 id를 만들어 aria-controls를 직접 지정하세요.
 */
export function TabBox({ items, value, defaultValue, onChange, className, ...aria }: SegmentGroupProps) {
  const r = useRovingSelection(items, value, defaultValue, onChange);
  return (
    <div role="tablist" className={cn('flex flex-wrap items-center gap-1.5', className)} {...aria}>
      {items.map((it, i) => (
        <SegmentButton
          key={it.value}
          item={it}
          role="tab"
          selected={it.value === r.selected}
          tabIndex={it.value === r.focusable ? 0 : -1}
          onSelect={() => r.select(it.value)}
          onKeyDown={(e) => r.onKeyDown(e, i)}
          btnRef={(el) => (r.refs.current[i] = el)}
        />
      ))}
    </div>
  );
}

/**
 * Figma: `tab_group_segment` — element/tab_segment 를 gap 0 으로 붙인 세그먼트 컨트롤.
 *   그룹 외곽선 neutral-40 · 칸 사이 테두리는 겹침(-ml-px).
 *   하나만 고르는 값 선택기이므로 role="radiogroup" / "radio" (←→ 이동 = 선택).
 */
export function SegmentedControl({ items, value, defaultValue, onChange, className, ...aria }: SegmentGroupProps) {
  const r = useRovingSelection(items, value, defaultValue, onChange);
  return (
    <div role="radiogroup" className={cn('inline-flex w-fit items-center', className)} {...aria}>
      {items.map((it, i) => (
        <SegmentButton
          key={it.value}
          item={it}
          role="radio"
          selected={it.value === r.selected}
          tabIndex={it.value === r.focusable ? 0 : -1}
          onSelect={() => r.select(it.value)}
          onKeyDown={(e) => r.onKeyDown(e, i)}
          btnRef={(el) => (r.refs.current[i] = el)}
          className={i > 0 ? '-ml-px' : undefined}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * element/tab_text + tab_group_divider
 * ---------------------------------------------------------------------------------------------- */
export interface TextTabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TextTabsProps {
  items: TextTabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 탭 사이 세로 구분선 (Figma: tab_group_divider/Default). 기본 true */
  divider?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: `element/tab_text` (hight=h36 · status default | selected) + `tab_group_divider/Default`
 *   탭: h24 · p 3.35/5.36 → py-[3px] px-[5px] · 12px neutral-70 (default Medium / selected Bold)
 *   그룹: gap 1 · 사이 divider 세로 1×11 neutral-40
 *   밑줄·배경 없이 글자 굵기만으로 선택을 표시하는 가벼운 탭(필터 전환 등).
 */
export function TextTabs({ items, value, defaultValue, onChange, divider = true, className, ...aria }: TextTabsProps) {
  const r = useRovingSelection(items, value, defaultValue, onChange);
  return (
    <div role="tablist" className={cn('flex flex-wrap items-center gap-px', className)} {...aria}>
      {items.map((it, i) => {
        const sel = it.value === r.selected;
        return (
          <Fragment key={it.value}>
            {divider && i > 0 && <span aria-hidden className="h-[11px] w-px shrink-0 bg-neutral-40" />}
            <button
              ref={(el) => (r.refs.current[i] = el)}
              type="button"
              role="tab"
              aria-selected={sel}
              tabIndex={it.value === r.focusable ? 0 : -1}
              disabled={it.disabled}
              onClick={() => r.select(it.value)}
              onKeyDown={(e) => r.onKeyDown(e, i)}
              className={cn(
                'inline-flex h-6 shrink-0 items-center justify-center whitespace-nowrap px-[5px] py-[3px] text-body-4 text-neutral-70',
                'disabled:cursor-not-allowed disabled:opacity-40',
                focusRing,
                sel && 'font-bold',
              )}
            >
              {it.label}
            </button>
          </Fragment>
        );
      })}
    </div>
  );
}
