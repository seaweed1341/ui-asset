import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/cn';
import { resolveIcon, type IconProp } from '../lib/icon-slot';
import { IconClose, IconEyeClosed, IconEyeOpen, IconSearch } from '../icons';

/**
 * Figma: Components / Textfields / `input_text` (18 variants)
 *   height : h48 | h36
 *   type   : default | password
 *   status : enabled | active(:focus-within) | error | disabled | text(readOnly)
 *   props  : ♦ label · ♦ left icon(+icon swap) · right icon · ♦ right-text(unit)
 *            ♦ bottom(♦ bottom-text · ♦ bottom-count) · text(placeholder)
 */
const field = cva(
  'flex w-full items-center gap-2.5 bg-neutral-10 transition-shadow',
  {
    variants: {
      height: {
        h48: 'px-2.5 py-2 text-body-4',
        h36: 'px-2 py-[5px] text-body-5',
      },
      status: {
        enabled: 'ring-1 ring-inset ring-neutral-40 focus-within:ring-neutral-70',
        error: 'ring-1 ring-inset ring-error-60',
        disabled: 'bg-neutral-20 ring-1 ring-inset ring-neutral-40',
        text: '',
      },
    },
    defaultVariants: { height: 'h48', status: 'enabled' },
  },
);

const iconBox = 'inline-flex size-3 shrink-0 [&>svg]:size-full';

export interface TextFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'height'> {
  /** 입력창 위 라벨 (Figma: ♦ label) */
  label?: ReactNode;
  /** h48 | h36 */
  height?: 'h48' | 'h36';
  /** default | password */
  type?: 'default' | 'password';
  /** 왼쪽 아이콘: true면 기본(ic_search), ReactNode면 교체 */
  icon?: IconProp;
  /** 오른쪽 단위 텍스트 (Figma: ♦ right-text / unit) */
  unit?: ReactNode;
  /** 입력값이 있을 때 지우기(ic_close) 버튼 표시 (Figma: active 상태의 right icon) */
  clearable?: boolean;
  /** 하단 보조 문구 (Figma: ♦ bottom-text) */
  helperText?: ReactNode;
  /** 오류 상태. 문자열이면 하단 문구를 오류 문구로 대체 */
  error?: boolean | string;
  /** 하단 글자 수 표시 (Figma: ♦ bottom-count). maxLength가 필요 */
  showCount?: boolean;
  disabled?: boolean;
  /** 테두리 없는 읽기 전용 텍스트 (Figma: status=text) */
  plain?: boolean;
  onValueChange?: (value: string) => void;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    height = 'h48',
    type = 'default',
    icon,
    unit,
    clearable = false,
    helperText,
    error,
    showCount = false,
    disabled,
    plain = false,
    value,
    defaultValue,
    onChange,
    onValueChange,
    maxLength,
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

  const [inner, setInner] = useState(String(defaultValue ?? ''));
  const current = value !== undefined ? String(value) : inner;
  const [reveal, setReveal] = useState(false);

  const status = disabled ? 'disabled' : error ? 'error' : plain ? 'text' : 'enabled';
  const iconNode = resolveIcon(icon, <IconSearch />);
  const bottomText = typeof error === 'string' ? error : helperText;
  const hasBottom = bottomText != null || (showCount && maxLength != null);

  const update = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  return (
    <div className={cn('inline-flex w-40 flex-col gap-0.5', disabled && 'opacity-40', className)}>
      {label != null && (
        <label htmlFor={inputId} className="px-[1.34px] text-body-6 text-neutral-70">
          {label}
        </label>
      )}

      <div className={field({ height, status })}>
        {iconNode && <span className={cn(iconBox, 'text-neutral-100')}>{iconNode}</span>}

        <input
          ref={ref}
          id={inputId}
          type={type === 'password' && !reveal ? 'password' : 'text'}
          disabled={disabled}
          readOnly={plain || rest.readOnly}
          value={current}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-invalid={!!error || undefined}
          aria-describedby={hasBottom ? helpId : undefined}
          onChange={(e) => {
            onChange?.(e);
            update(e.target.value);
          }}
          className={cn(
            'min-w-0 flex-1 bg-transparent text-neutral-70 outline-none placeholder:text-neutral-40',
            'disabled:cursor-not-allowed disabled:placeholder:text-neutral-70',
          )}
          {...rest}
        />

        {unit != null && <span className="shrink-0 text-neutral-70">{unit}</span>}

        {clearable && type === 'default' && current && !disabled && !plain && (
          <button
            type="button"
            aria-label="지우기"
            className={cn(iconBox, 'text-neutral-70')}
            onClick={() => update('')}
          >
            <IconClose />
          </button>
        )}

        {type === 'password' && (
          <button
            type="button"
            aria-label={reveal ? '비밀번호 숨기기' : '비밀번호 보기'}
            aria-pressed={reveal}
            disabled={disabled}
            className={cn(iconBox, 'text-neutral-100')}
            onClick={() => setReveal((r) => !r)}
          >
            {reveal ? <IconEyeOpen /> : <IconEyeClosed />}
          </button>
        )}
      </div>

      {hasBottom && (
        <div
          id={helpId}
          className={cn(
            'flex items-center justify-end gap-[5px] text-body-5',
            height === 'h48' ? 'px-2.5' : 'px-2',
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
