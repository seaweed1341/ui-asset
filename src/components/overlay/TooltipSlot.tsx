import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { useControllable, useOverlayFocus } from './useOverlayFocus';

/**
 * Figma: `tootip_slot` (27995:27606, 8 variants) + `element/arrow_tooltip` (703:69833)
 *   type     : default
 *   position : left | right | top | bottom  — 말풍선 꼬리(arrow)가 붙는 변
 *   align    : start | center              — 꼬리 위치 (start: 상하 5.36px / 좌우 4.02px 들여쓰기)
 *   textbox  : SLOT — bg neutral-20, stroke neutral-100 0.5px, p 4/6, 10px Regular neutral-100
 *   arrow    : 6×4, fill neutral-20 + stroke neutral-100 0.5px, 상자와 -1px 겹침(테두리 가림)
 *
 * 코드에서는 말풍선이 트리거의 어느 쪽에 뜨는지를 `placement`로 받습니다.
 * 꼬리는 그 반대 변에 붙습니다 → Figma position = placement의 반대
 * (placement="bottom" ⇔ Figma position=top).
 */
export type TooltipSlotPlacement = 'top' | 'bottom' | 'left' | 'right';
export type TooltipSlotAlign = 'start' | 'center';

const ARROW_SIDE: Record<TooltipSlotPlacement, TooltipSlotPlacement> = {
  bottom: 'top',
  top: 'bottom',
  right: 'left',
  left: 'right',
};

const ARROW_PATH = {
  top: { box: '0 0 6 4', w: 6, h: 4, d: 'M0 4L3 0L6 4' },
  bottom: { box: '0 0 6 4', w: 6, h: 4, d: 'M0 0L3 4L6 0' },
  left: { box: '0 0 4 6', w: 4, h: 6, d: 'M4 0L0 3L4 6' },
  right: { box: '0 0 4 6', w: 4, h: 6, d: 'M0 0L4 3L0 6' },
} as const;

/** element/arrow_tooltip */
function Arrow({ side, align }: { side: TooltipSlotPlacement; align: TooltipSlotAlign }) {
  const a = ARROW_PATH[side];
  const vertical = side === 'top' || side === 'bottom';
  return (
    <svg
      aria-hidden
      width={a.w}
      height={a.h}
      viewBox={a.box}
      className={cn(
        'relative z-[1] shrink-0 overflow-visible',
        align === 'center' ? 'self-center' : vertical ? 'ml-[5.36px] self-start' : 'mt-[4.02px] self-start',
        { top: '-mb-px', bottom: '-mt-px', left: '-mr-px', right: '-ml-px' }[side],
      )}
    >
      <path d={`${a.d}Z`} fill="var(--color-neutral-20)" />
      <path d={a.d} fill="none" stroke="var(--color-neutral-100)" strokeWidth={0.5} />
    </svg>
  );
}

export interface TooltipSlotBoxProps {
  /** Figma position — 꼬리가 붙는 변 */
  position?: TooltipSlotPlacement;
  align?: TooltipSlotAlign;
  children: ReactNode;
  className?: string;
  /** 꼬리 숨김 */
  arrow?: boolean;
}

/** 위치 지정 없이 말풍선(상자 + 꼬리)만 그립니다. 미리보기·커스텀 배치용 */
export function TooltipSlotBox({ position = 'top', align = 'center', arrow = true, children, className }: TooltipSlotBoxProps) {
  const vertical = position === 'top' || position === 'bottom';
  const arrowFirst = position === 'top' || position === 'left';
  const arrowEl = arrow ? <Arrow side={position} align={align} /> : null;
  return (
    <div className={cn('inline-flex', vertical ? 'flex-col' : 'flex-row', className)}>
      {arrowFirst && arrowEl}
      <div className="min-w-0 bg-neutral-20 px-1.5 py-1 text-left text-body-5 text-neutral-100 shadow-[inset_0_0_0_0.5px_var(--color-neutral-100)]">
        {children}
      </div>
      {!arrowFirst && arrowEl}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

// 꼬리 끝이 트리거 가운데를 가리키도록 배치 (start: 꼬리 중심 = 5.36+3 / 4.02+3 px)
const placementStyle = (placement: TooltipSlotPlacement, align: TooltipSlotAlign): CSSProperties => {
  const gap = 4;
  switch (placement) {
    case 'bottom':
    case 'top': {
      const s: CSSProperties = placement === 'bottom' ? { top: '100%', marginTop: gap } : { bottom: '100%', marginBottom: gap };
      return align === 'center'
        ? { ...s, left: '50%', transform: 'translateX(-50%)' }
        : { ...s, left: 'calc(50% - 8.36px)' };
    }
    case 'left':
    case 'right': {
      const s: CSSProperties = placement === 'right' ? { left: '100%', marginLeft: gap } : { right: '100%', marginRight: gap };
      return align === 'center'
        ? { ...s, top: '50%', transform: 'translateY(-50%)' }
        : { ...s, top: 'calc(50% - 7.02px)' };
    }
  }
};

export interface TooltipSlotProps {
  /** 말풍선 안에 넣을 내용 (Figma: textbox SLOT) */
  content: ReactNode;
  /** 트리거 요소. 버튼 같은 포커스 가능한 요소 하나를 권장 */
  children: ReactNode;
  /** 말풍선이 뜨는 쪽 (Figma position의 반대) */
  placement?: TooltipSlotPlacement;
  align?: TooltipSlotAlign;
  /** hover: 마우스 오버·포커스 시 표시(role=tooltip) / click: 클릭으로 토글(role=dialog, 비모달) */
  trigger?: 'hover' | 'click';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** click 모드에서 대화상자 이름 */
  label?: string;
  /** 말풍선 최대 폭(px) */
  maxWidth?: number;
  className?: string;
}

export function TooltipSlot({
  content,
  children,
  placement = 'bottom',
  align = 'center',
  trigger = 'hover',
  open,
  defaultOpen = false,
  onOpenChange,
  label,
  maxWidth = 240,
  className,
}: TooltipSlotProps) {
  const id = useId();
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const rootRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const click = trigger === 'click';

  useOverlayFocus(popRef, {
    open: isOpen,
    onEscape: () => setOpen(false),
    autoFocus: click,
    restoreFocus: click,
  });

  // click 모드: 바깥을 누르면 닫기
  useEffect(() => {
    if (!click || !isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [click, isOpen, setOpen]);

  const a11y = click
    ? { 'aria-expanded': isOpen, 'aria-controls': id, 'aria-haspopup': 'dialog' as const }
    : { 'aria-describedby': isOpen ? id : undefined };

  const triggerEl = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, a11y)
    : children;

  return (
    <span
      ref={rootRef}
      className={cn('relative inline-flex', className)}
      onMouseEnter={click ? undefined : () => setOpen(true)}
      onMouseLeave={click ? undefined : () => setOpen(false)}
      onFocus={click ? undefined : () => setOpen(true)}
      onBlur={
        click
          ? undefined
          : (e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
            }
      }
      onClick={
        click
          ? (e) => {
              if (popRef.current?.contains(e.target as Node)) return;
              setOpen(!isOpen);
            }
          : undefined
      }
    >
      {triggerEl}
      {isOpen && (
        <div
          ref={popRef}
          id={id}
          role={click ? 'dialog' : 'tooltip'}
          aria-label={click ? label : undefined}
          tabIndex={click ? -1 : undefined}
          style={{ ...placementStyle(placement, align), maxWidth }}
          className="absolute z-40 w-max outline-none"
        >
          <TooltipSlotBox position={ARROW_SIDE[placement]} align={align}>
            {content}
          </TooltipSlotBox>
        </div>
      )}
    </span>
  );
}
