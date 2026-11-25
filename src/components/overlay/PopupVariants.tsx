import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Popup, type PopupAction } from '../Popup';
import { TextField } from '../TextField';
import { useControllable } from './useOverlayFocus';

/* 기존 Popup의 본문 래퍼는 `px-4 py-2`라서, Figma 본문 패딩에 맞추려고 음수 여백으로 보정합니다. */

interface PopupBaseProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  /** 왼쪽 secondary (취소) */
  cancel?: PopupAction;
  /** 오른쪽 primary (확인) */
  confirm?: PopupAction;
  /** 제목 앞 아이콘 (Figma ♦ icon) */
  titleIcon?: boolean | ReactNode;
  /** dim 없이 제자리에 그리기 (가이드 미리보기용) */
  inline?: boolean;
  width?: number;
  className?: string;
}

/** 이미지 자리(thumbnail_variable type=default/none) — bg neutral-20 */
export function PopupThumbnail({
  src,
  alt = '',
  height,
  className,
}: {
  src?: string;
  alt?: string;
  /** 높이(px) */
  height?: number;
  className?: string;
}) {
  return src ? (
    <img src={src} alt={alt} style={{ height }} className={cn('block w-full bg-neutral-20 object-cover', className)} />
  ) : (
    <div
      style={{ height }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      className={cn('flex w-full items-center justify-center bg-neutral-20 text-body-5 font-bold text-neutral-40', className)}
    >
      IMG
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Figma: `popup_image` (1471:27614) — 456×321
 *   title_popup size=large (h53) → body SLOT p 0/16/16/16, gap 6.7 → thumbnail 424×194
 *   → bottom_popup type=2 buttons (h26, [secondary][primary])
 */
export interface PopupImageProps extends PopupBaseProps {
  src?: string;
  alt?: string;
  /** 이미지 높이(px). Figma 194 */
  imageHeight?: number;
  /** 이미지 아래 설명 (10px Regular neutral-70) */
  description?: ReactNode;
  /** 본문 슬롯을 직접 구성할 때 (src/description 대신) */
  children?: ReactNode;
}

export function PopupImage({
  src,
  alt,
  imageHeight = 194,
  description,
  children,
  width = 456,
  ...popup
}: PopupImageProps) {
  return (
    <Popup {...popup} size="large" width={width}>
      <div className="-mt-2 flex flex-col gap-[6.7px] pb-2">
        {children ?? (
          <>
            <PopupThumbnail src={src} alt={alt} height={imageHeight} className="shrink-0" />
            {description != null && <p>{description}</p>}
          </>
        )}
      </div>
    </Popup>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Figma: `popup` type=slot (1782:27189) — 300×211
 *   title_popup size=small (h33) → body p 0/12, Slot 276×120 (gap 10) + ♦ scroll(세로 스크롤바)
 *   → bottom_popup type=2 buttons
 */
export interface PopupSlotProps extends PopupBaseProps {
  children: ReactNode;
  /** 본문 최대 높이(px). 넘치면 스크롤 (Figma 120) */
  bodyHeight?: number;
  /** ♦ scroll — false면 높이 제한 없이 늘어남 */
  scroll?: boolean;
}

export function PopupSlot({ children, bodyHeight = 120, scroll = true, width = 300, ...popup }: PopupSlotProps) {
  return (
    <Popup {...popup} size="small" width={width}>
      <div
        tabIndex={scroll ? 0 : undefined}
        style={scroll ? { maxHeight: bodyHeight } : undefined}
        className={cn(
          '-mx-1 -my-2 flex flex-col gap-2.5 text-body-5 text-neutral-70',
          scroll && 'overflow-y-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
        )}
      >
        {children}
      </div>
    </Popup>
  );
}

/* ------------------------------------------------------------------------ */

export interface PopupListItem {
  value: string;
  label: ReactNode;
  /** 검색에 쓸 문자열 (label이 문자열이 아니면 지정) */
  searchText?: string;
  disabled?: boolean;
}

/**
 * Figma: `popup_list` (1109:151539) — 252×234
 *   ♦ title  : title_popup size=small (h33)
 *   search   : input_text h36 (p4 래퍼, 기본 숨김)
 *   list     : Slot 242 + scroll bar 10 → 높이 143, 행 = list_depth (h29)
 *              content p 4/8/4/4, element pl4 gap4, 10px Regular neutral-70, 아래 divider neutral-40
 *              selected : bg neutral-20 (list_depth state=selected), type=checkbox 면 체크박스 14
 *   ♦ bottom : bottom_popup type=1 button (w210 primary)
 */
export interface PopupListProps extends Omit<PopupBaseProps, 'confirm'> {
  items: PopupListItem[];
  /** 체크박스 다중 선택 (Figma list_depth type=checkbox). false면 단일 선택 */
  multiple?: boolean;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** 검색창 표시 (Figma: search) */
  search?: boolean;
  searchPlaceholder?: string;
  /** 목록 높이(px). 넘치면 스크롤 (Figma 143) */
  listHeight?: number;
  /** 하단 확인 버튼 (Figma ♦ bottom). 선택값을 받습니다 */
  onConfirm?: (value: string[]) => void;
  confirmLabel?: string;
  /** 검색 결과가 없을 때 문구 */
  emptyText?: ReactNode;
}

export function PopupList({
  items,
  multiple = false,
  value,
  defaultValue = [],
  onValueChange,
  search = false,
  searchPlaceholder = '검색',
  listHeight = 143,
  onConfirm,
  confirmLabel = '확인',
  emptyText = '검색 결과가 없습니다.',
  width = 252,
  ...popup
}: PopupListProps) {
  const listId = useId();
  const [selected, setSelected] = useControllable(value, defaultValue, onValueChange);
  const [query, setQuery] = useState('');
  const listRef = useRef<HTMLUListElement>(null);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      (it.searchText ?? (typeof it.label === 'string' ? it.label : it.value)).toLowerCase().includes(q),
    );
  }, [items, query]);

  const toggle = (v: string) => {
    if (multiple) setSelected(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    else setSelected([v]);
  };

  const onKey = (e: KeyboardEvent<HTMLLIElement>, index: number) => {
    const opts = Array.from(listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const move = (i: number) => opts[(i + opts.length) % opts.length]?.focus();
    if (e.key === 'ArrowDown') (e.preventDefault(), move(index + 1));
    else if (e.key === 'ArrowUp') (e.preventDefault(), move(index - 1));
    else if (e.key === 'Home') (e.preventDefault(), move(0));
    else if (e.key === 'End') (e.preventDefault(), move(opts.length - 1));
    else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      const it = visible[index];
      if (it && !it.disabled) toggle(it.value);
    }
  };

  const focusIndex = Math.max(0, visible.findIndex((it) => selected.includes(it.value)));

  return (
    <Popup
      {...popup}
      size="small"
      width={width}
      confirm={onConfirm ? { label: confirmLabel, onClick: () => onConfirm(selected) } : undefined}
    >
      <div className="-mx-4 -my-2 flex flex-col">
        {search && (
          <div className="p-1">
            <TextField
              height="h36"
              icon
              clearable
              value={query}
              onValueChange={setQuery}
              placeholder={searchPlaceholder}
              aria-controls={listId}
              className="w-full"
            />
          </div>
        )}
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable={multiple || undefined}
          aria-label={typeof popup.title === 'string' ? popup.title : undefined}
          style={{ maxHeight: listHeight }}
          className="overflow-y-auto pr-2.5"
        >
          {visible.length === 0 && <li className="px-2 py-2 text-body-5 text-neutral-70">{emptyText}</li>}
          {visible.map((it, i) => {
            const on = selected.includes(it.value);
            return (
              <li
                key={it.value}
                role="option"
                aria-selected={on}
                aria-disabled={it.disabled || undefined}
                tabIndex={i === focusIndex ? 0 : -1}
                onClick={() => !it.disabled && toggle(it.value)}
                onKeyDown={(e) => onKey(e, i)}
                className={cn(
                  'flex min-h-[29px] cursor-pointer items-center border-b border-neutral-40 py-1 pl-1 pr-2 text-body-5 text-neutral-70',
                  'focus-visible:outline focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary-70',
                  on ? 'bg-neutral-20' : 'bg-neutral-10 hover:bg-neutral-20',
                  it.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                <span className="flex min-w-0 flex-1 items-center gap-1 pl-1">
                  {multiple && (
                    <span
                      aria-hidden
                      className={cn(
                        'inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px]',
                        on ? 'bg-primary-70 text-neutral-10' : 'bg-neutral-10 ring-1 ring-inset ring-neutral-70',
                      )}
                    >
                      {on && (
                        <svg viewBox="0 0 14 14" className="size-3.5">
                          <path
                            fill="currentColor"
                            d="M10.9954 4.42793C11.2769 4.7224 11.2663 5.18922 10.9717 5.47062L6.28705 9.94565C6.00051 10.2194 5.54884 10.2179 5.26414 9.94226L3.02433 7.77406C2.73163 7.49072 2.72413 7.02383 3.00757 6.73124C3.29102 6.43865 3.75807 6.43115 4.05077 6.71449L5.78076 8.38916L9.95237 4.40425C10.2469 4.12286 10.7139 4.13346 10.9954 4.42793Z"
                          />
                        </svg>
                      )}
                    </span>
                  )}
                  <span className="min-w-0 flex-1 truncate">{it.label}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </Popup>
  );
}
