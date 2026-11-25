import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Figma: Components / Tab / `tab_group_line` + `element/tab_line`
 *   hight  : h48 | h36
 *   type   : flex(내용 너비) | full(균등 분할)
 *   tab_line status : default | selected,  divider on/off
 *     h48 — 15px (selected Bold / default Medium), py 8 px 16
 *     h36 — 10px (selected Bold / default Regular), py 4 px 16
 *     selected 하단 3px neutral-70 / default 하단 1px neutral-40(divider)
 */
export interface TabItem {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  height?: 'h48' | 'h36';
  type?: 'flex' | 'full';
  /** 비선택 탭 하단 구분선 (Figma: divider on/off) */
  divider?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  height = 'h48',
  type = 'flex',
  divider = true,
  className,
  ...aria
}: TabsProps) {
  const [inner, setInner] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? inner;
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
  };

  const onKeyDown = (e: KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const step = e.key === 'ArrowRight' ? 1 : -1;
    for (let k = 1; k <= items.length; k++) {
      const n = (i + step * k + items.length) % items.length;
      if (!items[n].disabled) {
        refs.current[n]?.focus();
        select(items[n].value);
        break;
      }
    }
  };

  return (
    <div role="tablist" className={cn('flex', type === 'full' ? 'w-full' : 'w-fit', className)} {...aria}>
      {items.map((item, i) => {
        const isSel = item.value === selected;
        return (
          <button
            key={item.value}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            aria-selected={isSel}
            tabIndex={isSel ? 0 : -1}
            disabled={item.disabled}
            onClick={() => select(item.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              'relative flex flex-col items-center justify-center whitespace-nowrap px-4 text-neutral-70',
              'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70',
              'disabled:cursor-not-allowed disabled:opacity-40',
              type === 'full' && 'flex-1',
              height === 'h48' ? 'py-2 text-body-3' : 'py-1 text-body-5',
              isSel && 'font-bold',
            )}
          >
            {item.label}
            {isSel ? (
              <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-neutral-70" />
            ) : (
              divider && <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-neutral-40" />
            )}
          </button>
        );
      })}
    </div>
  );
}
