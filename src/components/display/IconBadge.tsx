import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconNotification } from '../../icons';
import { focusRing } from './internal';

/**
 * Figma: Components / `icon_badge` (4 variants)
 *   type  : large(24×24) | small(16×16)
 *   color : black(neutral-100) | white(neutral-10)
 *   props : icon(swap, 기본 alert/ic_notification) · badge(BOOLEAN)
 *   - 배지: element/badgedot, error-60 원.
 *     large = 8×8(우상단 x16,y0, 숫자 6.7px), small = 4×4 점(x12,y0)
 *   - Navigation.tsx의 HeaderIconButton(버튼 24px + 아이콘 18px)과 달리 아이콘이 칸을 꽉 채웁니다.
 *   onClick을 주면 버튼(포커스 링 포함), 아니면 그림(role="img")으로 렌더링합니다.
 */
export interface IconBadgeProps {
  /** 접근성 이름 (예: "알림 3건") */
  label: string;
  type?: 'large' | 'small';
  color?: 'black' | 'white';
  /** 아이콘 교체. 기본 ic_notification */
  icon?: ReactNode;
  /** 배지 표시 (Figma: badge) */
  badge?: boolean;
  /** type="large" 배지 안 숫자(선택) */
  count?: number | string;
  onClick?: () => void;
  className?: string;
}

export function IconBadge({
  label,
  type = 'large',
  color = 'black',
  icon,
  badge = true,
  count,
  onClick,
  className,
}: IconBadgeProps) {
  const cls = cn(
    'relative inline-flex shrink-0 items-center justify-center [&>svg]:size-full',
    type === 'large' ? 'size-6' : 'size-4',
    color === 'black' ? 'text-neutral-100' : 'text-neutral-10',
    className,
  );
  const content = (
    <>
      {icon ?? <IconNotification />}
      {badge && (
        <span
          aria-hidden
          className={cn(
            'absolute right-0 top-0 inline-flex items-center justify-center rounded-full bg-error-60 font-regular leading-none text-neutral-10',
            type === 'large' ? 'size-2 text-[6.7px]' : 'size-1',
          )}
        >
          {type === 'large' ? count : null}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" aria-label={label} title={label} onClick={onClick} className={cn(cls, 'rounded-[3px]', focusRing)}>
        {content}
      </button>
    );
  }
  return (
    <span role="img" aria-label={label} className={cls}>
      {content}
    </span>
  );
}
