import { useState, type HTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconAdd, IconClose, IconProfile } from '../../icons';

/**
 * Figma: Components / `avarta` (8 variants — Figma 이름 오타 그대로)
 *   type : icon | text      (+ 코드 전용: src를 주면 이미지)
 *   size : x-large(64) | large(42) | medium(32) | small(20)
 *   props: 인스턴스(아이콘 swap) · ♦ edit icon(우하단, ic_add) · ♦ close icon(우상단, ic_close)
 *   - 바탕 neutral-20, 원형. ic_profile 28/24/16/10px neutral-70
 *   - 이니셜: 15 Medium / 12 Medium / 10 Regular / 8 Regular, neutral-70
 *   - 편집/닫기 버튼: 16px(x-large) · 12px(large·medium), 원형 neutral-10 + stroke neutral-40, small에는 없음
 */
const avatar = cva('relative inline-flex shrink-0 items-center justify-center rounded-full bg-neutral-20 text-neutral-70', {
  variants: {
    size: {
      'x-large': 'size-16 text-body-3',
      large: 'size-[42px] text-body-4',
      medium: 'size-8 text-body-5',
      small: 'size-5 text-body-6',
    },
  },
  defaultVariants: { size: 'x-large' },
});

const iconSize = { 'x-large': 'size-7', large: 'size-6', medium: 'size-4', small: 'size-2.5' } as const;
const btnSize = { 'x-large': 'size-4', large: 'size-3 p-0.5', medium: 'size-3 p-0.5', small: 'hidden' } as const;

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** icon | text */
  type?: 'icon' | 'text';
  size?: 'x-large' | 'large' | 'medium' | 'small';
  /** 이미지 주소. 주면 type과 관계없이 이미지를 보여 주고, 실패하면 type으로 돌아갑니다. */
  src?: string;
  /** 사용자 이름 — 이미지 alt와 접근성 이름에 씁니다. */
  name?: string;
  /** type="text"일 때 표시할 글자(예: 이니셜). 생략하면 name에서 앞 두 글자 */
  initials?: ReactNode;
  /** type="icon"일 때 아이콘 교체 (Figma: 인스턴스). 기본 ic_profile */
  icon?: ReactNode;
  /** ♦ edit icon — 우하단 편집 버튼. true=ic_add, ReactNode=교체 */
  editIcon?: IconProp;
  onEdit?: () => void;
  editLabel?: string;
  /** ♦ close icon — 우상단 삭제 버튼 */
  closeIcon?: IconProp;
  onClose?: () => void;
  closeLabel?: string;
}

function CornerButton({
  icon,
  label,
  onClick,
  className,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'absolute right-0 inline-flex items-center justify-center rounded-full bg-neutral-10 p-[3px] text-neutral-100',
        'ring-1 ring-inset ring-neutral-40 [&>svg]:size-full',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-70',
        className,
      )}
    >
      {icon}
    </button>
  );
}

export function Avatar({
  type = 'icon',
  size = 'x-large',
  src,
  name,
  initials,
  icon,
  editIcon,
  onEdit,
  editLabel = '편집',
  closeIcon,
  onClose,
  closeLabel = '삭제',
  className,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const edit = size === 'small' ? null : resolveIcon(editIcon, <IconAdd />);
  const close = size === 'small' ? null : resolveIcon(closeIcon, <IconClose />);
  const showImage = !!src && !failed;
  const text = initials ?? (name ? name.slice(0, 2).toUpperCase() : 'AC');

  return (
    <span className={cn(avatar({ size }), className)} {...rest}>
      {showImage ? (
        <img src={src} alt={name ?? ''} onError={() => setFailed(true)} className="size-full rounded-full object-cover" />
      ) : type === 'icon' ? (
        <span role="img" aria-label={name} aria-hidden={name ? undefined : true} className={cn('inline-flex [&>svg]:size-full', iconSize[size])}>
          {icon ?? <IconProfile />}
        </span>
      ) : (
        <span role="img" aria-label={name} aria-hidden={name ? undefined : true} className={cn('select-none', size === 'x-large' || size === 'large' ? 'font-medium' : 'font-regular')}>
          {text}
        </span>
      )}
      {close && <CornerButton icon={close} label={closeLabel} onClick={onClose} className={cn('top-0', btnSize[size])} />}
      {edit && <CornerButton icon={edit} label={editLabel} onClick={onEdit} className={cn('bottom-0', btnSize[size])} />}
    </span>
  );
}
