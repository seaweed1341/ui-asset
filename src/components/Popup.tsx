import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { IconClose, IconInfo } from '../icons';
import { Button } from './Button';

/**
 * Figma: `popup` = `element/title_popup` + body + `element/bottom_popup`
 *   title small : h33, p8, 12px Bold neutral-100, 닫기 ×14
 *   title large : h53, p16/12, 15px Bold
 *   body        : p 8/16, 10px Regular neutral-70
 *   bottom      : p16, gap4, h26 버튼. 2 buttons = 같은 폭 [secondary][primary]
 *   컨테이너    : bg neutral-10, r5 (화면설계서 실측 5.36), dim(overlay) 위 화면 정중앙
 */
export interface PopupAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface PopupProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  size?: 'small' | 'large';
  /** 제목 앞 아이콘 (Figma ♦ icon) */
  titleIcon?: boolean | ReactNode;
  /** 오른쪽 위 닫기(×). 화면설계서는 대부분 표시 */
  closeButton?: boolean;
  /** 왼쪽 secondary (취소·닫기) */
  cancel?: PopupAction;
  /** 오른쪽 primary (실행) */
  confirm?: PopupAction;
  /** 버튼 영역을 직접 구성할 때 */
  footer?: ReactNode;
  /** 팝업 폭(px) */
  width?: number;
  /** dim 위 중앙 배치 대신 인라인으로 그리기 (가이드 미리보기용) */
  inline?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Popup({
  open,
  onClose,
  title,
  size = 'small',
  titleIcon = false,
  closeButton = true,
  cancel,
  confirm,
  footer,
  width = 300,
  inline = false,
  children,
  className,
}: PopupProps) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  // 열릴 때 첫 컨트롤로 포커스, Esc로 닫기, 닫히면 원래 위치로 포커스 복귀
  useEffect(() => {
    if (!open || inline) return;
    const prev = document.activeElement as HTMLElement | null;
    const first = ref.current?.querySelector<HTMLElement>('input, button:not([disabled]), [tabindex]:not([tabindex="-1"])');
    first?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current();
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus();
    };
  }, [open, inline]);

  if (!open) return null;

  const icon = titleIcon === true ? <IconInfo /> : titleIcon || null;
  const single = !!(cancel ? !confirm : confirm);

  const box = (
    <div
      ref={ref}
      role="dialog"
      aria-modal={!inline || undefined}
      aria-labelledby={titleId}
      style={{ width }}
      className={cn('flex max-w-full flex-col overflow-hidden rounded-[5px] bg-neutral-10 shadow-[0_0_0_1px_var(--color-neutral-40)]', className)}
    >
      <div className={cn('relative flex items-center gap-2', size === 'small' ? 'p-2 pr-7' : 'px-3 py-4 pr-9')}>
        {icon && (
          <span className={cn('inline-flex shrink-0 text-neutral-100 [&>svg]:size-full', size === 'small' ? 'size-[13px]' : 'size-4')}>
            {icon}
          </span>
        )}
        <h2 id={titleId} className={cn('min-w-0 flex-1 font-bold text-neutral-100', size === 'small' ? 'text-body-4' : 'text-body-3')}>
          {title}
        </h2>
        {closeButton && (
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className={cn(
              'absolute inline-flex size-3.5 text-neutral-70 [&>svg]:size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
              size === 'small' ? 'right-2 top-[9.5px]' : 'right-3 top-4',
            )}
          >
            <IconClose />
          </button>
        )}
      </div>

      {children != null && <div className="px-4 py-2 text-body-5 text-neutral-70">{children}</div>}

      {footer ?? (
        (cancel || confirm) && (
          <div className="flex items-center justify-center gap-1 p-4">
            {cancel && (
              <Button variant="secondary" height="h26" label={cancel.label} onClick={cancel.onClick} disabled={cancel.disabled} className={single ? 'w-[210px]' : 'flex-1'} />
            )}
            {confirm && (
              <Button height="h26" label={confirm.label} onClick={confirm.onClick} disabled={confirm.disabled} className={single ? 'w-[210px]' : 'flex-1'} />
            )}
          </div>
        )
      )}
    </div>
  );

  if (inline) return box;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dimmer p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {box}
    </div>
  );
}
