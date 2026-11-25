import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { resolveIcon, type IconProp } from '../lib/icon-slot';
import { IconArrowDown, IconArrowUp, IconInfoFill } from '../icons';

/**
 * Figma: Components / Dropdown / `dropdown` (4 variants)
 *   status : normal | selected(열림) | disabled | text(테두리·화살표 없음)
 *   props  : ♦ label · left_icon
 *   열림 목록 : popup_list > list_depth (default neutral-10 / selected neutral-20, 12px Medium, 하단 divider)
 */
export interface DropdownOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** 선택 전 표시 문구 (Figma: Text) */
  placeholder?: ReactNode;
  /** 위 라벨 (Figma: ♦ label) */
  label?: ReactNode;
  /** 왼쪽 아이콘: true면 기본 아이콘, ReactNode면 교체 (Figma: left_icon) */
  icon?: IconProp;
  disabled?: boolean;
  /** 테두리·화살표 없는 텍스트형 (Figma: status=text) */
  plain?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Text',
  label,
  icon,
  disabled,
  plain = false,
  className,
}: DropdownProps) {
  const [inner, setInner] = useState(defaultValue);
  const selected = value ?? inner;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const labelId = useId();

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const pick = (opt: DropdownOption) => {
    if (opt.disabled) return;
    if (value === undefined) setInner(opt.value);
    onChange?.(opt.value);
    setOpen(false);
  };

  const current = options.find((o) => o.value === selected);
  const iconNode = resolveIcon(icon, <IconInfoFill />);
  const interactive = !disabled && !plain;

  const onKeyDown = (e: KeyboardEvent) => {
    if (!interactive) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) return setOpen(true);
      const step = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + step + options.length) % options.length);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (open && active >= 0) pick(options[active]);
      else setOpen((o) => !o);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn('relative inline-flex w-[121px] flex-col gap-0.5', className)}>
      {label != null && (
        <span id={labelId} className="px-[1.34px] text-body-6 text-neutral-70">
          {label}
        </span>
      )}

      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={label != null ? labelId : undefined}
        disabled={disabled}
        onClick={() => interactive && setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full items-center gap-0.5 py-[5px] pl-1.5 pr-1 text-left text-body-5 text-neutral-70',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70',
          plain ? 'bg-neutral-10 cursor-default' : 'bg-neutral-10 ring-1 ring-inset ring-neutral-40',
          disabled && 'cursor-not-allowed bg-neutral-20 opacity-40',
        )}
      >
        {iconNode && <span className="inline-flex size-3 shrink-0 [&>svg]:size-full">{iconNode}</span>}
        <span className="min-w-0 flex-1 truncate">{current?.label ?? placeholder}</span>
        {!plain && (
          <span className="inline-flex size-2.5 shrink-0 [&>svg]:size-full">
            {open ? <IconArrowUp /> : <IconArrowDown />}
          </span>
        )}
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-10 mt-0.5 max-h-36 w-full overflow-auto bg-neutral-10 shadow-[inset_0_0_0_0.67px_var(--color-neutral-40)]"
        >
          {options.map((opt, i) => {
            const isSel = opt.value === selected;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSel}
                aria-disabled={opt.disabled || undefined}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(opt)}
                className={cn(
                  'cursor-pointer border-b border-neutral-40 px-2 py-1 text-body-4 text-neutral-70 last:border-b-0',
                  isSel || i === active ? 'bg-neutral-20' : 'bg-neutral-10',
                  opt.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                {opt.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
