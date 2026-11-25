import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconLoadingDot } from './icons';

/**
 * Figma: `loading` (1137:95774) — style=dot 베리언트 (기존 Loading은 style=stroke만 구현)
 *   size large : 세로, gap 12, loading/dot 36 + "Loading..." 15px Medium neutral-70 (body-3)
 *   size small : 가로, gap 6,  loading/dot 14 + "Loading message..." 10px Regular neutral-70 (body-5)
 *   ♦ text     : label=false 면 텍스트 숨김
 *   loading/dot: 점 12개(불투명도 1 / 0.7 / 0.4), fill raw #000000 → neutral-100
 *   회전: 점 하나씩(12단계) 1초에 한 바퀴. prefers-reduced-motion이면 정지
 */
export interface LoadingDotsProps {
  size?: 'large' | 'small';
  /** 텍스트 (Figma ♦ text). false면 숨기고 aria-label로만 전달 */
  label?: ReactNode | false;
  /** 스크린리더용 이름 (label이 문자열이 아닐 때) */
  ariaLabel?: string;
  className?: string;
}

export function LoadingDots({ size = 'large', label, ariaLabel, className }: LoadingDotsProps) {
  const text = label === undefined ? (size === 'large' ? 'Loading...' : 'Loading message...') : label;
  const name = ariaLabel ?? (typeof text === 'string' ? text : '로딩 중');
  return (
    <div
      role="status"
      aria-label={text === false ? name : undefined}
      className={cn(
        'inline-flex items-center text-neutral-70',
        size === 'large' ? 'flex-col gap-3 text-body-3' : 'gap-1.5 text-body-5',
        className,
      )}
    >
      <IconLoadingDot
        size={size === 'large' ? 36 : 14}
        className="shrink-0 animate-[spin_1s_steps(12,end)_infinite] text-neutral-100 motion-reduce:animate-none"
      />
      {text !== false && text}
    </div>
  );
}
