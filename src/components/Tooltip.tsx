import { useId, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { IconInfo } from '../icons';

/**
 * Figma: `tootip_text` — position left | right | top | bottom, align start | center
 *   textbox: bg neutral-20, 1px neutral-100 @50%, p 4/6, 10px Regular neutral-100
 *   화면설계서 규칙: 정보 아이콘(alert/ic_info 16) 옆, 잘린 텍스트 hover 시 전문 표시
 */
export interface TooltipProps {
  content: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: ReactNode;
  className?: string;
}

const placement = {
  top: 'bottom-full left-1/2 mb-1.5 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-1.5 -translate-x-1/2',
  left: 'right-full top-1/2 mr-1.5 -translate-y-1/2',
  right: 'left-full top-1/2 ml-1.5 -translate-y-1/2',
} as const;

export function Tooltip({ content, position = 'bottom', children, className }: TooltipProps) {
  const id = useId();
  return (
    <span className={cn('group/tip relative inline-flex', className)} aria-describedby={id}>
      {children}
      <span
        role="tooltip"
        id={id}
        className={cn(
          'pointer-events-none absolute z-30 w-max max-w-60 whitespace-normal bg-neutral-20 px-1.5 py-1 text-left text-body-5 text-neutral-100',
          'shadow-[0_0_0_0.5px_var(--color-neutral-100)] opacity-0 transition-opacity',
          'group-hover/tip:opacity-100 group-focus-within/tip:opacity-100',
          placement[position],
        )}
      >
        {content}
      </span>
    </span>
  );
}

/** 정보 아이콘 + 툴팁 (화면설계서 공통 패턴: alert/ic_info 16 + tootip_text) */
export function InfoTip({ content, position = 'bottom', label = '설명 보기' }: { content: ReactNode; position?: TooltipProps['position']; label?: string }) {
  return (
    <Tooltip content={content} position={position}>
      <button
        type="button"
        aria-label={label}
        className="inline-flex size-4 text-neutral-70 [&>svg]:size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
      >
        <IconInfo />
      </button>
    </Tooltip>
  );
}
