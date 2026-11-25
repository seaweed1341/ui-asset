import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Figma: Components / Switch / `switch` (4 variants) + `switch_label`
 *   on/off : on | off        →  checked / defaultChecked
 *   status : normal | disable →  disabled
 *   switch_label : 스위치 + 라벨(gap 6px, 10px Regular, neutral-70)
 */
export interface SwitchProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  label?: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { label, checked, defaultChecked = false, onChange, disabled, className, onClick, ...rest },
  ref,
) {
  const [inner, setInner] = useState(defaultChecked);
  const on = checked ?? inner;

  const track = (
    <span
      aria-hidden
      className={cn(
        'relative inline-block h-[17px] w-[31px] shrink-0 rounded-[9px] transition-colors',
        on ? 'bg-primary-70' : 'bg-neutral-40',
      )}
    >
      <span
        className={cn(
          'absolute left-0.5 top-0.5 size-[13px] rounded-full bg-neutral-10 transition-transform',
          on && 'translate-x-[14px]',
        )}
      />
    </span>
  );

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        if (checked === undefined) setInner(!on);
        onChange?.(!on);
      }}
      className={cn(
        'inline-flex items-center gap-1.5 align-middle',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70 rounded-[9px]',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
      {...rest}
    >
      {track}
      {label != null && <span className="text-body-5 text-neutral-70">{label}</span>}
    </button>
  );
});
