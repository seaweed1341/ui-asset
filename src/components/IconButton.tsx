import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { IconAdd } from '../icons';

/**
 * Figma: Components / Buttons / `button_icon` (27 variants)
 *   style  : outlined | filled | onlyicon
 *   hight  : h32 | h24 | h16
 *   status : normal | pressed(:active) | disable(disabled)
 *   props  : icon(swap)
 */
const iconButton = cva(
  [
    'inline-flex shrink-0 items-center justify-center select-none transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70',
    'disabled:cursor-not-allowed disabled:opacity-40',
    '[&>svg]:size-full',
  ],
  {
    variants: {
      style: {
        outlined: [
          'bg-neutral-10 text-neutral-100 ring-1 ring-inset ring-neutral-40',
          'enabled:active:bg-neutral-20 disabled:bg-neutral-20',
        ],
        filled: 'bg-neutral-70 text-neutral-10 ring-1 ring-inset ring-neutral-40 enabled:active:bg-neutral-100',
        onlyicon: 'bg-transparent text-neutral-100 enabled:active:bg-neutral-20 disabled:bg-neutral-20',
      },
      height: {
        h32: 'size-8 p-1.5',
        h24: 'size-6 p-1',
        h16: 'size-4 p-[3px]',
      },
    },
    defaultVariants: { style: 'outlined', height: 'h32' },
  },
);

type IconButtonVariants = VariantProps<typeof iconButton>;

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** 스크린리더용 이름 (아이콘만 있는 버튼이므로 필수) */
  label: string;
  /** outlined | filled | onlyicon */
  variant?: NonNullable<IconButtonVariants['style']>;
  /** h32 | h24 | h16 (Figma: hight) */
  height?: NonNullable<IconButtonVariants['height']>;
  /** 아이콘 교체. 생략하면 Figma 기본 아이콘(ic_add) */
  icon?: ReactNode;
  disabled?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, variant = 'outlined', height = 'h32', icon, disabled, className, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={cn(iconButton({ style: variant, height }), className)}
      {...rest}
    >
      {icon ?? <IconAdd />}
    </button>
  );
});
