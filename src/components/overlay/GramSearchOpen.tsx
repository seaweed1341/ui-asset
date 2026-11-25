import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconClose, IconSearch } from '../../icons';
import { Button } from '../Button';
import { useControllable } from './useOverlayFocus';

/**
 * Figma: `gram_search_open` (27710:14086, gram Only) — 1241×445, r5.4, stroke neutral-70 1px
 *   input_text h48(active) : h33, p 8/10, gap 10, stroke neutral-70 — ic_search 12 + 12px Medium + ic_close 12 neutral-70
 *   Container              : p 8/0, gap 8
 *     ♦ 상단문구            : p 6/11, 12px Medium neutral-70, 가운데
 *     섹션(01 · 2)          : headings_sub (3등분 열: 왼쪽 빈칸 | 가운데 텍스트 | 오른쪽 버튼)
 *       제목 행  : p 4/10.72, 12px Medium neutral-70 밑줄 + "전체 삭제" secondary(h26 크기, 10px)
 *       항목 행  : p 4/4/4/10.72, 12px Medium neutral-70 + 지우기 × 14 (text 버튼)
 *   ♦ 추천검색어 → sections 배열에서 두 번째 섹션
 */
export interface GramSearchItem {
  value: string;
  label: ReactNode;
}

export interface GramSearchSection {
  id: string;
  /** 섹션 제목 (예: 최근 검색어, 추천 검색어) */
  title: ReactNode;
  items: GramSearchItem[];
  onSelect?: (item: GramSearchItem) => void;
  /** 주면 항목마다 지우기(×) 버튼 */
  onRemove?: (item: GramSearchItem) => void;
  /** 주면 제목 행 오른쪽 "전체 삭제" 버튼 */
  onClearAll?: () => void;
  clearAllLabel?: string;
}

export interface GramSearchOpenProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Enter로 검색 */
  onSubmit?: (value: string) => void;
  /** Esc로 닫기 */
  onClose?: () => void;
  placeholder?: string;
  /** ♦ 상단문구 */
  topText?: ReactNode;
  sections?: GramSearchSection[];
  /** 열릴 때 입력창에 포커스 (기본 true) */
  autoFocus?: boolean;
  className?: string;
}

export function GramSearchOpen({
  value,
  defaultValue = '',
  onValueChange,
  onSubmit,
  onClose,
  placeholder = '검색',
  topText,
  sections = [],
  autoFocus = true,
  className,
}: GramSearchOpenProps) {
  const [q, setQ] = useControllable(value, defaultValue, onValueChange);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const items = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('[data-search-item]') ?? []);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape' && onClose) {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const list = items();
    if (!list.length) return;
    e.preventDefault();
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') list[i < 0 ? 0 : Math.min(list.length - 1, i + 1)].focus();
    else if (i <= 0) inputRef.current?.focus();
    else list[i - 1].focus();
  };

  return (
    <div
      ref={rootRef}
      role="search"
      onKeyDown={onKey}
      className={cn('flex w-full flex-col overflow-hidden rounded-[5.4px] bg-neutral-10 shadow-[inset_0_0_0_1px_var(--color-neutral-70)]', className)}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(q);
        }}
        className="flex h-[33px] items-center gap-2.5 rounded-t-[5.4px] px-2.5 py-2 shadow-[inset_0_0_0_1px_var(--color-neutral-70)]"
      >
        <span aria-hidden className="inline-flex size-3 shrink-0 text-neutral-100 [&>svg]:size-full">
          <IconSearch />
        </span>
        <input
          ref={inputRef}
          type="search"
          aria-label={placeholder}
          value={q}
          placeholder={placeholder}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body-4 text-neutral-100 outline-none placeholder:text-neutral-70 [&::-webkit-search-cancel-button]:hidden"
        />
        {(q || onClose) && (
          <button
            type="button"
            aria-label={q ? '검색어 지우기' : '검색 닫기'}
            onClick={() => {
              if (q) {
                setQ('');
                inputRef.current?.focus();
              } else onClose?.();
            }}
            className="inline-flex size-3 shrink-0 text-neutral-70 [&>svg]:size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
          >
            <IconClose />
          </button>
        )}
      </form>

      <div className="flex flex-col gap-2 py-2">
        {topText != null && <p className="px-[11px] py-1.5 text-center text-body-4 text-neutral-70">{topText}</p>}
        {sections.map((s) => {
          const headId = `${baseId}-${s.id}`;
          return (
            <section key={s.id} aria-labelledby={headId} className="flex flex-col">
              <div className="grid grid-cols-3 items-center gap-[5.36px] rounded-[5.4px] px-[10.72px] py-1">
                <span />
                <h3 id={headId} className="text-body-4 text-neutral-70 underline underline-offset-2">
                  {s.title}
                </h3>
                <span className="flex justify-end">
                  {s.onClearAll && <Button variant="secondary" height="h26" label={s.clearAllLabel ?? '전체 삭제'} onClick={s.onClearAll} />}
                </span>
              </div>
              <ul className="flex flex-col">
                {s.items.map((it) => (
                  <li key={it.value} className="grid min-h-8 grid-cols-3 items-center gap-[5.36px] rounded-[5.4px] py-1 pl-[10.72px] pr-1 hover:bg-neutral-20">
                    <span />
                    <button
                      type="button"
                      data-search-item
                      onClick={() => s.onSelect?.(it)}
                      className="truncate text-left text-body-4 text-neutral-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
                    >
                      {it.label}
                    </button>
                    <span className="flex justify-end">
                      {s.onRemove && (
                        <button
                          type="button"
                          aria-label={`${typeof it.label === 'string' ? it.label : it.value} 지우기`}
                          onClick={() => s.onRemove?.(it)}
                          className="inline-flex h-[26px] items-center justify-center rounded-full py-1.5 pl-2.5 pr-1.5 text-neutral-100 [&>svg]:size-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
                        >
                          <IconClose />
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
