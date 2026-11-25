import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconClose } from '../../icons';
import { Button } from '../Button';

/**
 * Figma: `snackbar` (737:80183) — 456×29
 *   컨테이너 : bg neutral-100, p 4/12, gap 16, 가로 MIN 정렬(텍스트 → 버튼 순)
 *   텍스트   : 10px Regular neutral-10 (body-5)
 *   buttons  : SLOT — button h20 (첫 번째 primary, 나머지 secondary), gap 5.36
 *              (슬롯 안 divider/02/vertical 은 Figma에서 HIDDEN → 그리지 않음)
 *   닫기     : button_icon 16×16 ABS (right 6, 세로 가운데), p2.68, common/ic_close 11 · neutral-10
 */
export interface SnackbarAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface SnackbarProps {
  /** 메시지 (Figma: TextTextText) */
  message: ReactNode;
  /** 버튼 슬롯. 첫 번째가 primary, 나머지는 secondary. 최대 maxActions개까지 그립니다. */
  actions?: SnackbarAction[];
  /** 버튼 최대 개수 (기본 3) */
  maxActions?: number;
  /** 닫기(×) 버튼. 주면 표시되고, 포커스가 안에 있을 때 Esc로도 닫힙니다. */
  onClose?: () => void;
  /** 폭(px). Figma 456 */
  width?: number | 'auto';
  className?: string;
}

export function Snackbar({ message, actions = [], maxActions = 3, onClose, width = 456, className }: SnackbarProps) {
  const shown = actions.slice(0, maxActions);
  return (
    <div
      role="status"
      aria-live="polite"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
      style={width === 'auto' ? undefined : { width }}
      className={cn(
        'relative flex min-h-[29px] max-w-full items-center gap-4 bg-neutral-100 px-3 py-1 text-body-5 text-neutral-10',
        onClose && 'pr-7',
        className,
      )}
    >
      <span className="min-w-0">{message}</span>
      {shown.length > 0 && (
        <span className="flex shrink-0 items-center gap-[5.36px]">
          {shown.map((a, i) => (
            <Button
              key={a.label}
              height="h20"
              variant={i === 0 ? 'primary' : 'secondary'}
              label={a.label}
              onClick={a.onClick}
              disabled={a.disabled}
            />
          ))}
        </span>
      )}
      {onClose && (
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className={cn(
            'absolute right-1.5 top-1/2 inline-flex size-4 -translate-y-1/2 items-center justify-center p-[2.68px] text-neutral-10',
            '[&>svg]:size-[11px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
          )}
        >
          <IconClose />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

export interface SnackbarOptions extends Omit<SnackbarProps, 'onClose' | 'className'> {
  /** 자동으로 닫히기까지의 시간(ms). 0이면 자동으로 닫지 않습니다. 기본 4000 */
  duration?: number;
  /** 닫기(×) 버튼 표시 (기본 true) */
  closable?: boolean;
  /** 닫힌 뒤 호출 */
  onClose?: () => void;
}

interface QueueItem extends SnackbarOptions {
  id: number;
}

/**
 * 스낵바 큐 — 한 번에 하나만 보여 주고, 닫히면(× · 시간 초과 · 버튼 클릭) 다음 것을 보여 줍니다.
 * `element`를 화면 아무 곳에 한 번 렌더링하면 화면 하단 중앙에 고정 표시됩니다.
 *
 * const snackbar = useSnackbar();
 * snackbar.show({ message: '삭제했습니다.', actions: [{ label: '실행 취소', onClick: undo }] });
 * return <>{...}{snackbar.element}</>;
 */
export function useSnackbar() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const seq = useRef(0);
  const current = queue[0];
  const currentRef = useRef(current);
  currentRef.current = current;

  const dismiss = useCallback(() => {
    const head = currentRef.current;
    if (!head) return;
    head.onClose?.();
    setQueue((q) => (q[0]?.id === head.id ? q.slice(1) : q));
  }, []);

  const show = useCallback((options: SnackbarOptions) => {
    const id = ++seq.current;
    setQueue((q) => [...q, { ...options, id }]);
    return id;
  }, []);

  const clear = useCallback(() => setQueue([]), []);

  useEffect(() => {
    if (!current) return;
    const ms = current.duration ?? 4000;
    if (!ms) return;
    const t = setTimeout(dismiss, ms);
    return () => clearTimeout(t);
  }, [current, dismiss]);

  const element = current ? (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <Snackbar
        key={current.id}
        message={current.message}
        width={current.width}
        maxActions={current.maxActions}
        actions={current.actions?.map((a) => ({
          ...a,
          onClick: () => {
            a.onClick();
            dismiss();
          },
        }))}
        onClose={current.closable === false ? undefined : dismiss}
        className="pointer-events-auto"
      />
    </div>
  ) : null;

  return { show, dismiss, clear, element, count: queue.length };
}
