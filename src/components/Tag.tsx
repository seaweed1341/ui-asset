import type { HTMLAttributes, ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { resolveIcon, type IconProp } from '../lib/icon-slot';
import { IconInfoFill } from '../icons';

/**
 * Figma: Components / Badge&Tag / `tag_text` (12 variants)
 *   size   : medium | small
 *   status : primary | secondary | error
 *   ♦ icon : off | on (+ icon swap)
 */
const tag = cva('inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full text-neutral-10', {
  variants: {
    status: {
      primary: 'bg-primary-70',
      secondary: 'bg-primary-90',
      error: 'bg-error-60',
    },
    size: {
      medium: 'px-1.5 py-0.5 text-body-4',
      small: 'px-[5px] py-px text-body-5',
    },
    withIcon: { true: 'gap-0.5', false: '' },
  },
  compoundVariants: [
    { size: 'medium', withIcon: true, className: 'pr-[7px]' },
    { size: 'small', withIcon: true, className: 'pr-1.5' },
  ],
  defaultVariants: { status: 'primary', size: 'medium', withIcon: false },
});

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  label?: ReactNode;
  status?: NonNullable<VariantProps<typeof tag>['status']>;
  size?: NonNullable<VariantProps<typeof tag>['size']>;
  /** true면 기본 아이콘(ic_info_fill), ReactNode면 교체 */
  icon?: IconProp;
}

export function Tag({ label, children, status = 'primary', size = 'medium', icon, className, ...rest }: TagProps) {
  const iconNode = resolveIcon(icon, <IconInfoFill />);
  return (
    <span className={cn(tag({ status, size, withIcon: !!iconNode }), className)} {...rest}>
      {iconNode && <span className="inline-flex size-2.5 shrink-0 [&>svg]:size-full">{iconNode}</span>}
      {children ?? label}
    </span>
  );
}
