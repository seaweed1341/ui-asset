import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { resolveIcon, type IconProp } from '../lib/icon-slot';
import { IconAdd } from '../icons';

/**
 * Figma: Components / Buttons / `button` (81 variants)
 *   height : h33 | h26 | h20
 *   style  : primary | secondary | text
 *   status : normal | pressed(:active) | disable(disabled)
 *   icon-left / icon-right : off | on  →  icon + iconPosition
 *   props  : text(label) · icon(swap) · ♦ badge · subtext
 */
const button = cva(
  [
    'relative inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full',
    'select-none transition-colors',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70',
    'disabled:cursor-not-allowed disabled:opacity-40',
  ],
  {
    variants: {
      style: {
        primary: 'bg-neutral-70 text-neutral-10 enabled:active:bg-neutral-100',
        secondary: [
          'bg-neutral-10 text-neutral-100 ring-1 ring-inset ring-neutral-40',
          'enabled:active:bg-neutral-20 enabled:active:ring-neutral-70',
          'disabled:bg-neutral-40 disabled:text-neutral-70 disabled:ring-neutral-70',
        ],
        text: 'bg-transparent text-neutral-100 disabled:text-neutral-70',
      },
      height: {
        h33: 'gap-1 py-1.5 px-2.5 text-body-3',
        h26: 'gap-1 py-1.5 px-2.5 text-body-5',
        h20: 'gap-1 py-[5px] px-[9px] text-body-6',
      },
      iconPosition: { left: '', right: '', none: '' },
    },
    compoundVariants: [
      // 아이콘 쪽 패딩은 6px로 줄어듭니다.
      { height: ['h33', 'h26', 'h20'], iconPosition: 'left', className: 'pl-1.5' },
      { height: ['h33', 'h26', 'h20'], iconPosition: 'right', className: 'pr-1.5' },
    ],
    defaultVariants: { style: 'primary', height: 'h33', iconPosition: 'none' },
  },
);

const contentGap = { h33: 'gap-[3px]', h26: 'gap-[3px]', h20: 'gap-0.5' } as const;
const iconSize = { h33: 'size-3.5', h26: 'size-3.5', h20: 'size-2.5' } as const;

type ButtonVariants = VariantProps<typeof button>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  /** 버튼 텍스트 (Figma: text). children을 주면 children이 우선합니다. */
  label?: ReactNode;
  /** primary | secondary | text */
  variant?: NonNullable<ButtonVariants['style']>;
  /** h33 | h26 | h20 */
  height?: NonNullable<ButtonVariants['height']>;
  /** true면 기본 아이콘(ic_add), ReactNode면 교체, false/생략이면 아이콘 없음 */
  icon?: IconProp;
  /** 아이콘 위치 (Figma: icon-left / icon-right) */
  iconPosition?: 'left' | 'right';
  /** 비활성화 (Figma: status=disable) */
  disabled?: boolean;
  /** 우상단 알림 점 (Figma: ♦ badge) */
  badge?: boolean;
  /** 보조 텍스트 (Figma: subtext) */
  subtext?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    label,
    children,
    variant = 'primary',
    height = 'h33',
    icon,
    iconPosition = 'left',
    disabled,
    badge,
    subtext,
    className,
    type = 'button',
    ...rest
  },
  ref,
) {
  const iconNode = resolveIcon(icon, <IconAdd />);
  const text = children ?? label;
  const position = iconNode ? iconPosition : 'none';

  const iconEl = iconNode ? (
    <span className={cn('inline-flex shrink-0 [&>svg]:size-full', iconSize[height])}>{iconNode}</span>
  ) : null;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={cn(button({ style: variant, height, iconPosition: position }), className)}
      {...rest}
    >
      {/* ♦ badge — element/badgedot(medium) 인스턴스를 4×4로 축소해 사용 */}
      {badge && <span aria-hidden className="absolute right-0 top-0 size-1 rounded-full bg-error-60" />}
      <span className={cn('inline-flex items-center', contentGap[height])}>
        {position === 'left' && iconEl}
        {text}
        {position === 'right' && iconEl}
      </span>
      {subtext && <span className="text-body-6 font-bold">{subtext}</span>}
    </button>
  );
});
