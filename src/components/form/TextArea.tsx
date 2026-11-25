import { forwardRef, useId, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';

/**
 * Figma: Components / `input_text_multi` (5 variants)
 *   status : normal(1px neutral-40) | active(:focus, 1px neutral-70) | error(1px error-80-text)
 *            | disabled(bg neutral-20, 투명도 40%) | text(테두리 없음, readOnly)
 *   크기   : 160×82 — textfield 160×68, p 5/8, 10px Regular (placeholder neutral-40, 값 neutral-70)
 *   props  : ♦ bottom(♦ bottom-text · ♦ bottom-count — 8px Regular, p 0/8, gap 5.36) · text(placeholder)
 *   label  : Figma 세트에는 없지만 TextField와 같은 형태(8px neutral-70)로 추가
 */
const box = cva(
  'block h-[68px] w-full resize-none bg-neutral-10 px-2 py-[5px] text-body-5 text-neutral-70 outline-none transition-shadow placeholder:text-neutral-40',
  {
    variants: {
      status: {
        normal: 'ring-1 ring-inset ring-neutral-40 focus:ring-neutral-70',
        error: 'ring-1 ring-inset ring-error-80-text',
        disabled: 'cursor-not-allowed bg-neutral-20 ring-1 ring-inset ring-neutral-40',
        text: '',
      },
    },
    defaultVariants: { status: 'normal' },
  },
);

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'defaultValue'> {
  /** 입력창 위 라벨 */
  label?: ReactNode;
  value?: string;
  defaultValue?: string;
  /** 하단 보조 문구 (Figma: ♦ bottom-text) */
  helperText?: ReactNode;
  /** 오류 상태. 문자열이면 하단 문구를 오류 문구로 대체 */
  error?: boolean | string;
  /** 하단 글자 수 (Figma: ♦ bottom-count). maxLength 필요 */
  showCount?: boolean;
  disabled?: boolean;
  /** 테두리 없는 읽기 전용 텍스트 (Figma: status=text) */
  plain?: boolean;
  onValueChange?: (value: string) => void;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  {
    label,
    value,
    defaultValue,
    helperText,
    error,
    showCount = false,
    disabled,
    plain = false,
    maxLength,
    onChange,
    onValueChange,
    className,
    id,
    placeholder = 'placeholder',
    ...rest
  },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const helpId = `${inputId}-help`;
  const [inner, setInner] = useState(defaultValue ?? '');
  const current = value ?? inner;

  const status = disabled ? 'disabled' : error ? 'error' : plain ? 'text' : 'normal';
  const bottomText = typeof error === 'string' ? error : helperText;
  const hasBottom = bottomText != null || (showCount && maxLength != null);

  return (
    <div className={cn('inline-flex w-40 flex-col gap-0.5', disabled && 'opacity-40', className)}>
      {label != null && (
        <label htmlFor={inputId} className="px-[1.34px] text-body-6 text-neutral-70">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        disabled={disabled}
        readOnly={plain || rest.readOnly}
        value={current}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={!!error || undefined}
        aria-describedby={hasBottom ? helpId : undefined}
        onChange={(e) => {
          onChange?.(e);
          if (value === undefined) setInner(e.target.value);
          onValueChange?.(e.target.value);
        }}
        className={box({ status })}
        {...rest}
      />

      {hasBottom && (
        <div
          id={helpId}
          className={cn(
            'flex items-center justify-end gap-[5.36px] px-2 text-body-6',
            error ? 'text-error-80-text' : 'text-neutral-70',
          )}
        >
          {bottomText != null && <span className="flex-1">{bottomText}</span>}
          {showCount && maxLength != null && (
            <span className="shrink-0">
              {current.length} / {maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
