import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface OverlayFocusOptions {
  /** 열려 있는 동안만 동작 */
  open: boolean;
  /** Esc 키로 닫기 */
  onEscape?: () => void;
  /** 열릴 때 컨테이너 안 첫 컨트롤로 포커스 이동 (기본 true) */
  autoFocus?: boolean;
  /** Tab 키 포커스를 컨테이너 안에 가둠 (모달일 때) */
  trap?: boolean;
  /** 닫힐 때 열기 전 위치로 포커스 복귀 (기본 true) */
  restoreFocus?: boolean;
}

/**
 * 오버레이 공통 포커스 관리 — 열릴 때 포커스를 안으로, Esc로 닫기, 닫히면 원래 위치로 복귀.
 * 모달이면 trap=true로 Tab 순환을 컨테이너 안에 가둡니다.
 */
export function useOverlayFocus<T extends HTMLElement>(
  ref: RefObject<T>,
  { open, onEscape, autoFocus = true, trap = false, restoreFocus = true }: OverlayFocusOptions,
) {
  const escRef = useRef(onEscape);
  escRef.current = onEscape;

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const root = ref.current;
    if (autoFocus && root && !root.contains(document.activeElement)) {
      const first = root.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? root).focus({ preventScroll: true });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escRef.current) {
        e.stopPropagation();
        escRef.current();
        return;
      }
      if (trap && e.key === 'Tab' && ref.current) {
        const items = Array.from(ref.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (restoreFocus && prev && document.contains(prev)) prev.focus({ preventScroll: true });
    };
  }, [open, autoFocus, trap, restoreFocus, ref]);
}

/** 제어(value) + 비제어(defaultValue) 공용 상태 */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = useCallback(
    (next: T) => {
      if (value === undefined) setInner(next);
      onChange?.(next);
    },
    [value, onChange],
  );
  return [current, set] as const;
}
