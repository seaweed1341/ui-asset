import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Figma: Components / Radio button / `radio button` (6 variants) + `radio_label`
 *   style  : selected | unselected  →  checked (네이티브 :checked)
 *   status : normal | over(:hover) | disable(disabled)
 *   radio_label : 라디오 + 라벨(gap 6px, 12px Medium, neutral-70)
 */
export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode;
  disabled?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, disabled, className, ...rest },
  ref,
) {
  return (
    <label
      className={cn(
        'group inline-flex items-center gap-1.5 align-middle',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        className,
      )}
    >
      <input ref={ref} type="radio" className="peer sr-only" disabled={disabled} {...rest} />
      <span
        aria-hidden
        className={cn(
          'relative inline-flex size-[13px] shrink-0 items-center justify-center rounded-full transition-colors',
          // unselected: neutral-10 + 1.34px neutral-40 (over: neutral-100)
          'bg-neutral-10 shadow-[inset_0_0_0_1.34px_var(--color-neutral-40)]',
          'peer-enabled:group-hover:shadow-[inset_0_0_0_1.34px_var(--color-neutral-100)]',
          // selected: primary-70 (over: primary-90) + 흰 점
          'peer-checked:bg-primary-70 peer-checked:shadow-none',
          'peer-checked:peer-enabled:group-hover:bg-primary-90 peer-checked:peer-enabled:group-hover:shadow-none',
          'after:size-1.5 after:rounded-full after:bg-neutral-10 after:opacity-0 peer-checked:after:opacity-100',
          'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-70',
        )}
      />
      {label != null && <span className="text-body-4 text-neutral-70">{label}</span>}
    </label>
  );
});
