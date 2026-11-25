import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { IconClose, IconInfo, IconWarning } from '../icons';

/**
 * Figma: `loading` — size large(36 + 15px) | small(14 + 10px), style stroke | dot
 */
export function Loading({ size = 'large', label = 'Loading...', className }: { size?: 'large' | 'small'; label?: ReactNode; className?: string }) {
  return (
    <div
      role="status"
      className={cn('inline-flex items-center text-neutral-70', size === 'large' ? 'flex-col gap-3 text-body-3' : 'gap-1.5 text-body-5', className)}
    >
      <span
        aria-hidden
        className={cn(
          'inline-block animate-spin rounded-full border-neutral-40 border-t-neutral-70 motion-reduce:animate-none',
          size === 'large' ? 'size-9 border-[3px]' : 'size-3.5 border-2',
        )}
      />
      {label}
    </div>
  );
}

/**
 * Figma: `toast` — 185×32, p 8/12, r4, 아이콘 16 + 10px 텍스트 + 닫기, 약한 그림자
 *   tone neutral : DS 기본(neutral-70 bg, neutral-20 text)
 *   tone light   : gram Claw 하단 중앙 토스트(neutral-20 bg)
 *   tone warning : 첨부 실패 등(warning-10 bg + ⚠)
 */
export function Toast({
  children,
  tone = 'neutral',
  icon = true,
  onClose,
  action,
  className,
}: {
  children: ReactNode;
  tone?: 'neutral' | 'light' | 'warning' | 'success';
  icon?: boolean;
  onClose?: () => void;
  action?: ReactNode;
  className?: string;
}) {
  const tones = {
    neutral: 'bg-neutral-70 text-neutral-20 ring-neutral-100',
    light: 'bg-neutral-20 text-neutral-100 ring-neutral-40',
    warning: 'bg-warning-10 text-warning-80-text ring-warning-60',
    success: 'bg-success-10 text-success-80-text ring-success-60',
  } as const;
  return (
    <div
      role="status"
      className={cn(
        'inline-flex max-w-[421px] items-center gap-1 rounded px-3 py-2 text-body-4 ring-1 ring-inset shadow-[0_3px_10px_rgb(0_0_0/0.05)]',
        tones[tone],
        className,
      )}
    >
      {icon && <span className="inline-flex size-4 shrink-0 [&>svg]:size-full">{tone === 'warning' ? <IconWarning /> : <IconInfo />}</span>}
      <span className="min-w-0 flex-1">{children}</span>
      {action}
      {onClose && (
        <button type="button" aria-label="닫기" onClick={onClose} className="inline-flex size-4 shrink-0 [&>svg]:size-full">
          <IconClose />
        </button>
      )}
    </div>
  );
}

/**
 * Empty / 상태 블록 — 세 화면설계서의 빈 상태를 하나로 정리
 *   variant text    : LCS "There is no item." 문구만 (표·카드를 그리지 않음)
 *   variant panel   : LGBC 위젯 Data 없음 / 라이선스 없음 (bg neutral-20, r8, p 20/40, gap 24, 썸네일 60)
 *   variant center  : gram Claw · LGBC 화면 단위 (아이콘 + 제목 + 설명 + 버튼, 가운데 정렬)
 */
export function EmptyState({
  title,
  description,
  action,
  icon,
  variant = 'center',
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: ReactNode;
  variant?: 'text' | 'panel' | 'center';
  className?: string;
}) {
  if (variant === 'text') {
    return <p className={cn('py-16 text-center text-body-4 font-bold text-neutral-100', className)}>{title}</p>;
  }
  if (variant === 'panel') {
    return (
      <div className={cn('flex items-center gap-6 rounded-lg bg-neutral-20 px-10 py-5', className)}>
        <span aria-hidden className="inline-flex size-[60px] shrink-0 items-center justify-center bg-neutral-40 text-neutral-10 [&>svg]:size-6">
          {icon ?? <IconInfo />}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-body-3 text-neutral-100">{title}</p>
          {description && <p className="text-body-4 text-neutral-70">{description}</p>}
          {action && <div className="mt-2">{action}</div>}
        </div>
      </div>
    );
  }
  return (
    <div className={cn('flex flex-col items-center gap-4 px-6 py-6 text-center', className)}>
      <span aria-hidden className="inline-flex size-16 items-center justify-center text-neutral-40 [&>svg]:size-12">
        {icon ?? <IconInfo />}
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-body-3 text-neutral-100">{title}</p>
        {description && <p className="max-w-md text-body-4 text-neutral-70">{description}</p>}
      </div>
      {action}
    </div>
  );
}
