import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconDelete } from '../../icons';
import { IconNull } from './icons';
import { PopupThumbnail } from './PopupVariants';
import { useControllable } from './useOverlayFocus';

/**
 * Figma: `gram_fileselect` (27710:13974, gram Only) — 236×110
 *   Property 1 : Default | focus_del | Select
 *     Default   : stroke neutral-40 1px, 오른쪽 위 아이콘 24 (alert/ic_null, right6 top6)
 *     focus_del : stroke error-60 2px, 오른쪽 아래 삭제 아이콘 24 (common/ic_delete, right6 bottom8) → :hover / :focus-within
 *     Select    : stroke error-60 2px, 왼쪽 위 체크박스 24 (primary-70, r2, left8 top8) → selected
 *   icon(BOOLEAN) → icon · text(BOOLEAN)+텍스트(TEXT) → label (12px Medium neutral-100, left8 bottom8)
 *   썸네일: thumbnail_variable type=none (bg neutral-20)
 */
export interface GramFileSelectProps {
  src?: string;
  alt?: string;
  /** 아래쪽 파일 이름 등 (Figma: text + 텍스트) */
  label?: ReactNode;
  /** 오른쪽 위 아이콘. 기본 true(ic_null), ReactNode면 교체, false면 숨김 */
  icon?: IconProp;
  /** 선택 가능 여부. false면 선택 토글 없이 보기 전용 */
  selectable?: boolean;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** 주면 hover/focus 시 삭제 버튼 표시 (Figma focus_del) */
  onDelete?: () => void;
  deleteLabel?: string;
  /** 폭·높이(px). Figma 236×110, multi_image 안에서는 124×80 */
  width?: number;
  height?: number;
  disabled?: boolean;
  className?: string;
}

export function GramFileSelect({
  src,
  alt = '',
  label,
  icon = true,
  selectable = true,
  selected,
  defaultSelected = false,
  onSelectedChange,
  onDelete,
  deleteLabel = '삭제',
  width = 236,
  height = 110,
  disabled,
  className,
}: GramFileSelectProps) {
  const [on, setOn] = useControllable(selected, defaultSelected, onSelectedChange);
  const iconNode = resolveIcon(icon, <IconNull />);
  const name = alt || (typeof label === 'string' ? label : '파일');

  return (
    <div
      style={{ width, height }}
      className={cn(
        'group/file relative shrink-0 overflow-hidden bg-neutral-10',
        on || (onDelete && !disabled)
          ? on
            ? 'shadow-[inset_0_0_0_2px_var(--color-error-60)]'
            : 'shadow-[inset_0_0_0_1px_var(--color-neutral-40)] hover:shadow-[inset_0_0_0_2px_var(--color-error-60)] focus-within:shadow-[inset_0_0_0_2px_var(--color-error-60)]'
          : 'shadow-[inset_0_0_0_1px_var(--color-neutral-40)]',
        disabled && 'opacity-40',
        className,
      )}
    >
      <PopupThumbnail src={src} alt="" className="pointer-events-none absolute inset-0 -z-0 h-full" />

      {selectable ? (
        <button
          type="button"
          aria-pressed={on}
          aria-label={name}
          disabled={disabled}
          onClick={() => setOn(!on)}
          className="absolute inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70 disabled:cursor-not-allowed"
        />
      ) : (
        alt && <span className="sr-only">{alt}</span>
      )}

      {on && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-2 top-2 inline-flex size-6 items-center justify-center rounded-sm bg-primary-70 text-neutral-10"
        >
          <svg viewBox="0 0 14 14" className="size-5">
            <path
              fill="currentColor"
              d="M10.9954 4.42793C11.2769 4.7224 11.2663 5.18922 10.9717 5.47062L6.28705 9.94565C6.00051 10.2194 5.54884 10.2179 5.26414 9.94226L3.02433 7.77406C2.73163 7.49072 2.72413 7.02383 3.00757 6.73124C3.29102 6.43865 3.75807 6.43115 4.05077 6.71449L5.78076 8.38916L9.95237 4.40425C10.2469 4.12286 10.7139 4.13346 10.9954 4.42793Z"
            />
          </svg>
        </span>
      )}

      {iconNode && (
        <span
          aria-hidden
          className={cn(
            'pointer-events-none absolute right-1.5 top-1.5 inline-flex size-6 text-neutral-100 [&>svg]:size-full',
            on && 'opacity-0',
            onDelete && !disabled && 'group-hover/file:opacity-0 group-focus-within/file:opacity-0',
          )}
        >
          {iconNode}
        </span>
      )}

      {label != null && (
        <span className="pointer-events-none absolute inset-x-2 bottom-2 truncate text-body-4 text-neutral-100">{label}</span>
      )}

      {onDelete && !disabled && (
        <button
          type="button"
          aria-label={`${name} ${deleteLabel}`}
          onClick={onDelete}
          className={cn(
            'absolute bottom-2 right-1.5 inline-flex size-6 text-neutral-100 opacity-0 [&>svg]:size-full',
            'group-hover/file:opacity-100 group-focus-within/file:opacity-100 focus-visible:opacity-100',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
          )}
        >
          <IconDelete />
        </button>
      )}
    </div>
  );
}
