import { Fragment, useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconArrowRight } from '../../icons';

/**
 * Figma: Components / `element/breadcrumb` (6 variants)
 *   type   : link(텍스트) | overflow("…", 접힌 항목)
 *   status : normal | over(:hover 밑줄) | pressed(밑줄 + popup_list 펼침)
 *   ♦ arrow: 오른쪽 ic_arrow_right 11×11 (구분자) — 기본 on
 *   실측: 텍스트 10px Regular neutral-100, 텍스트↔화살표 gap 3, 화살표 neutral-100
 *   popup_list: 폭 128(overflow 200) bg neutral-10, 테두리 neutral-40(0.67 → 1px),
 *     항목 list_depth h29 · p 4/8/4/8 · 12px Medium neutral-70 · 하단 divider neutral-40
 */
export interface BreadcrumbMenuItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface BreadcrumbItem {
  /** 고유 키 (생략 시 index) */
  id?: string;
  label: ReactNode;
  /** 링크 주소. 있으면 <a>, 없고 onClick만 있으면 <button>으로 렌더 */
  href?: string;
  onClick?: () => void;
  /** pressed 상태에서 펼칠 형제 메뉴 (Figma: popup_list). 있으면 클릭 시 메뉴가 열림 */
  menu?: BreadcrumbMenuItem[];
  onMenuSelect?: (value: string) => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** 구분 화살표 (Figma: ♦ arrow). 기본 true. 마지막 항목 뒤에는 그리지 않음 */
  arrow?: boolean;
  /** 이 개수를 넘으면 첫 항목과 마지막 (maxItems-1)개 사이를 "…"(type=overflow)로 접음 */
  maxItems?: number;
  className?: string;
  'aria-label'?: string;
}

const linkCls = cn(
  'inline-flex items-center whitespace-nowrap text-body-5 text-neutral-100 underline-offset-2',
  'hover:underline active:underline aria-expanded:underline',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-70',
);

function Separator() {
  return (
    <span aria-hidden className="inline-flex size-[11px] shrink-0 text-neutral-100 [&>svg]:size-full">
      <IconArrowRight />
    </span>
  );
}

/** popup_list — 브레드크럼 항목 아래로 펼쳐지는 목록 (Esc 닫기, ↑↓ 이동) */
function CrumbMenu({
  trigger,
  items,
  onSelect,
  width,
  triggerLabel,
}: {
  trigger: ReactNode;
  items: BreadcrumbMenuItem[];
  onSelect: (value: string) => void;
  width: number;
  triggerLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    const first = items.findIndex((i) => !i.disabled);
    itemRefs.current[first]?.focus();
    return () => document.removeEventListener('mousedown', onDown);
    // 열릴 때 한 번만 첫 항목으로 포커스 (items는 열린 시점 값)
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const close = () => {
    setOpen(false);
    btnRef.current?.focus();
  };

  const onMenuKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      if (e.key === 'Escape') e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault();
    const enabled = items.map((it, i) => (it.disabled ? -1 : i)).filter((i) => i >= 0);
    const cur = enabled.indexOf(itemRefs.current.findIndex((el) => el === document.activeElement));
    let next = cur;
    if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = enabled.length - 1;
    else next = (cur + (e.key === 'ArrowDown' ? 1 : -1) + enabled.length) % enabled.length;
    itemRefs.current[enabled[next]]?.focus();
  };

  return (
    <span ref={rootRef} className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={triggerLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={linkCls}
      >
        {trigger}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          onKeyDown={onMenuKey}
          style={{ width }}
          className="absolute left-0 top-full z-20 mt-1 flex max-h-[201px] flex-col overflow-y-auto border border-neutral-40 bg-neutral-10"
        >
          {items.map((it, i) => (
            <button
              key={it.value}
              ref={(el) => (itemRefs.current[i] = el)}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={it.disabled}
              onClick={() => {
                onSelect(it.value);
                close();
              }}
              className={cn(
                'flex h-[29px] w-full shrink-0 items-center border-b border-neutral-40 px-2 py-1 text-left text-body-4 text-neutral-70 last:border-b-0',
                'hover:bg-neutral-20 focus-visible:bg-neutral-20 focus-visible:outline-none disabled:opacity-40',
              )}
            >
              <span className="truncate">{it.label}</span>
            </button>
          ))}
        </div>
      )}
    </span>
  );
}

export function Breadcrumb({ items, arrow = true, maxItems, className, ...aria }: BreadcrumbProps) {
  const collapse = maxItems != null && maxItems >= 2 && items.length > maxItems;
  const tailCount = collapse ? maxItems! - 1 : 0;
  const hidden = collapse ? items.slice(1, items.length - tailCount) : [];
  const visible: (BreadcrumbItem | 'overflow')[] = collapse
    ? [items[0], 'overflow', ...items.slice(items.length - tailCount)]
    : items;

  const renderItem = (item: BreadcrumbItem, isLast: boolean) => {
    if (item.menu?.length) {
      return (
        <CrumbMenu
          trigger={item.label}
          items={item.menu}
          width={128}
          onSelect={(v) => item.onMenuSelect?.(v)}
        />
      );
    }
    if (isLast && !item.href && !item.onClick) {
      return (
        <span aria-current="page" className="whitespace-nowrap text-body-5 text-neutral-100">
          {item.label}
        </span>
      );
    }
    if (item.href) {
      return (
        <a href={item.href} onClick={item.onClick} aria-current={isLast ? 'page' : undefined} className={linkCls}>
          {item.label}
        </a>
      );
    }
    return (
      <button type="button" onClick={item.onClick} aria-current={isLast ? 'page' : undefined} className={linkCls}>
        {item.label}
      </button>
    );
  };

  return (
    <nav aria-label={aria['aria-label'] ?? '현재 위치'} className={className}>
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1">
        {visible.map((item, i) => {
          const isLast = i === visible.length - 1;
          return (
            <li key={item === 'overflow' ? '__overflow' : item.id ?? i} className="inline-flex items-center gap-[3px]">
              {item === 'overflow' ? (
                <CrumbMenu
                  trigger="..."
                  triggerLabel={`숨겨진 경로 ${hidden.length}개`}
                  width={200}
                  items={hidden.map((h, k) => ({ value: String(k), label: h.label }))}
                  onSelect={(v) => {
                    const h = hidden[Number(v)];
                    if (h.onClick) h.onClick();
                    else if (h.href) window.location.assign(h.href);
                  }}
                />
              ) : (
                <Fragment>{renderItem(item, isLast)}</Fragment>
              )}
              {arrow && !isLast && <Separator />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
