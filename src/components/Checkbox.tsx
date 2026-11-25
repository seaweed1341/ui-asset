import { forwardRef, useEffect, useImperativeHandle, useRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';

/**
 * Figma: Components / Checkbox / `checkbox` (14 variants) + `checkbox_label`
 *   style  : unselected | selected | indeterminate   →  checked / indeterminate
 *   status : normal | disable                       →  disabled
 *   type   : Default | only icon | Number           →  type="default" | "onlyIcon" | "number"
 *   checkbox_label : 체크박스 + 라벨(gap 5px, 12px Medium, neutral-70)
 */
const box = cva(
  [
    'relative inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] transition-colors',
    'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-70',
  ],
  {
    variants: {
      type: { default: '', onlyIcon: '', number: '' },
      state: { unselected: '', selected: '', indeterminate: '' },
    },
    compoundVariants: [
      { type: ['default', 'number'], state: 'unselected', className: 'bg-neutral-10 ring-1 ring-inset ring-neutral-70' },
      { type: ['default', 'number'], state: 'selected', className: 'bg-primary-70 text-neutral-10' },
      { type: ['default', 'number'], state: 'indeterminate', className: 'bg-neutral-70 text-neutral-10' },
      { type: 'onlyIcon', state: 'unselected', className: 'bg-neutral-10' },
      { type: 'onlyIcon', state: 'selected', className: 'text-primary-70' },
      { type: 'onlyIcon', state: 'indeterminate', className: 'text-neutral-70' },
    ],
  },
);

const CheckGlyph = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden>
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9954 4.42793C11.2769 4.7224 11.2663 5.18922 10.9717 5.47062L6.28705 9.94565C6.00051 10.2194 5.54884 10.2179 5.26414 9.94226L3.02433 7.77406C2.73163 7.49072 2.72413 7.02383 3.00757 6.73124C3.29102 6.43865 3.75807 6.43115 4.05077 6.71449L5.78076 8.38916L9.95237 4.40425C10.2469 4.12286 10.7139 4.13346 10.9954 4.42793Z"
    />
  </svg>
);

const CheckGlyphLarge = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden>
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.708 3.34484C13.1102 3.79026 13.095 4.49638 12.6742 4.92201L5.98177 11.691C5.57244 12.105 4.9272 12.1027 4.52047 11.6858L1.32075 8.40622C0.902613 7.97763 0.891895 7.27142 1.29681 6.82884C1.70173 6.38626 2.36896 6.37492 2.7871 6.8035L5.2585 9.33662L11.2179 3.30902C11.6388 2.88339 12.3059 2.89943 12.708 3.34484Z"
    />
  </svg>
);

const DashGlyph = () => (
  <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden>
    <path
      fill="currentColor"
      d="M3.11523 7.00014C3.11523 6.59421 3.44431 6.26514 3.85023 6.26514H10.1502C10.5562 6.26514 10.8852 6.59421 10.8852 7.00014C10.8852 7.40607 10.5562 7.73514 10.1502 7.73514H3.85023C3.44431 7.73514 3.11523 7.40607 3.11523 7.00014Z"
    />
  </svg>
);

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** 라벨 텍스트. 주면 checkbox_label 형태로 렌더링 */
  label?: ReactNode;
  /** 일부 선택 상태 (Figma: style=indeterminate) */
  indeterminate?: boolean;
  /** default | onlyIcon | number */
  type?: 'default' | 'onlyIcon' | 'number';
  /** type="number"일 때 박스 안에 표시할 숫자 */
  number?: number | string;
  disabled?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, type = 'default', number = 1, disabled, className, checked, defaultChecked, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <label
      className={cn(
        'group inline-flex items-center gap-[5px] align-middle',
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        className="peer sr-only"
        disabled={disabled}
        checked={checked}
        defaultChecked={defaultChecked}
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...rest}
      />
      {indeterminate ? (
        <span className={box({ type, state: 'indeterminate' })}>
          <DashGlyph />
        </span>
      ) : (
        <>
          {/* 제어/비제어 모두 지원: 선택 표시는 :checked(peer-checked)로 전환 */}
          <span className={cn(box({ type, state: 'unselected' }), 'peer-checked:hidden')} />
          <span className={cn(box({ type, state: 'selected' }), 'hidden peer-checked:inline-flex')}>
            {type === 'number' ? (
              <span className="text-body-5">{number}</span>
            ) : type === 'onlyIcon' ? (
              <CheckGlyphLarge />
            ) : (
              <CheckGlyph />
            )}
          </span>
        </>
      )}
      {label != null && <span className="text-body-4 text-neutral-70">{label}</span>}
    </label>
  );
});
