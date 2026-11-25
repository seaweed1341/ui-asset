import type { HTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

/**
 * Figma: Components / Badge&Tag / `element/badgedot`
 *   size  : large(숫자 표시, 12px) | medium(점, 6px)
 *   state : primary
 *   props : number
 */
const badgeDot = cva('inline-flex shrink-0 items-center justify-center rounded-full bg-error-60', {
  variants: {
    size: {
      large: 'h-3 min-w-3 px-0.5 text-body-5 text-neutral-10',
      medium: 'size-1.5',
    },
  },
  defaultVariants: { size: 'medium' },
});

export interface BadgeDotProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'large' | 'medium';
  /** size="large"일 때 표시할 숫자 (Figma: number) */
  count?: number | string;
}

export function BadgeDot({ size = 'medium', count = 0, className, ...rest }: BadgeDotProps) {
  return (
    <span className={cn(badgeDot({ size }), className)} {...rest}>
      {size === 'large' ? count : null}
    </span>
  );
}
