import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconClose, IconError, IconInfo, IconOk, IconWarning } from '../../icons';

/**
 * Figma: `notification box` (23349:38589) — 536×29, 인라인 알림 배너
 *   컨테이너 : 세로 p5.36, gap 6.7, bg (raw #f5f6fa → info-10), stroke neutral-20 0.67px
 *   내용 행  : 가로 gap 5.36, 세로 가운데 — alert/ic_info 19 + Text 12px Medium neutral-70 (body-4)
 *   props    : Text(TEXT) → children/title, icon(INSTANCE_SWAP) → icon
 *
 * Figma에는 상태 베리언트가 없어 `status`(info/success/warning/error)는 Theme 변수의
 * 10(배경)·20(테두리)·60(아이콘) 단계로 확장했습니다. status="default"가 Figma 원본입니다.
 */
const box = cva('flex w-full flex-col gap-[6.7px] p-[5.36px]', {
  variants: {
    status: {
      default: 'bg-info-10 shadow-[inset_0_0_0_0.67px_var(--color-neutral-20)]',
      info: 'bg-info-10 shadow-[inset_0_0_0_0.67px_var(--color-info-20)]',
      success: 'bg-success-10 shadow-[inset_0_0_0_0.67px_var(--color-success-20)]',
      warning: 'bg-warning-10 shadow-[inset_0_0_0_0.67px_var(--color-warning-20)]',
      error: 'bg-error-10 shadow-[inset_0_0_0_0.67px_var(--color-error-20)]',
    },
  },
  defaultVariants: { status: 'default' },
});

const iconTone = {
  default: 'text-neutral-100',
  info: 'text-info-60',
  success: 'text-success-60',
  warning: 'text-warning-60',
  error: 'text-error-60',
} as const;

const defaultIcon = {
  default: <IconInfo />,
  info: <IconInfo />,
  success: <IconOk />,
  warning: <IconWarning />,
  error: <IconError />,
} as const;

export type NotificationStatus = keyof typeof iconTone;

export interface NotificationBoxProps {
  /** default(Figma 원본) | info | success | warning | error */
  status?: NotificationStatus;
  /** 굵은 제목 (선택) */
  title?: ReactNode;
  /** 본문 (Figma: Text). title이 없으면 한 줄 메시지로 표시 */
  children?: ReactNode;
  /** 아이콘: 기본 true(상태별 아이콘), ReactNode면 교체, false면 숨김 */
  icon?: IconProp;
  /** 오른쪽 동작(버튼·링크 등) */
  action?: ReactNode;
  /** 주면 닫기(×) 버튼 표시 */
  onClose?: () => void;
  className?: string;
}

export function NotificationBox({
  status = 'default',
  title,
  children,
  icon = true,
  action,
  onClose,
  className,
}: NotificationBoxProps) {
  const iconNode = resolveIcon(icon, defaultIcon[status]);
  const urgent = status === 'warning' || status === 'error';
  return (
    <div role={urgent ? 'alert' : 'status'} className={cn(box({ status }), className)}>
      <div className={cn('flex gap-[5.36px]', title && children ? 'items-start' : 'items-center')}>
        {iconNode && (
          <span aria-hidden className={cn('inline-flex size-[19px] shrink-0 [&>svg]:size-full', iconTone[status])}>
            {iconNode}
          </span>
        )}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 text-body-4 text-neutral-70">
          {title && <p className="font-bold text-neutral-100">{title}</p>}
          {children != null && <div>{children}</div>}
        </div>
        {action && <div className="flex shrink-0 items-center gap-1">{action}</div>}
        {onClose && (
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={onClose}
            className="inline-flex size-3.5 shrink-0 self-center text-neutral-70 [&>svg]:size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
          >
            <IconClose />
          </button>
        )}
      </div>
    </div>
  );
}
