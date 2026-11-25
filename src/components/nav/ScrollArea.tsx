import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import './scroll-area.css';

/**
 * Figma: Components / `scroll bar` (12 variants)
 *   orientation : vertical | horizontal  → orientation prop (both = 양방향)
 *   size 25|50|75% · reverse            → 썸 길이·위치. 실제 스크롤 양에 따라 브라우저가 계산하므로 prop 없음
 *   실측: 두께 10 (트랙 2 + 좌우 4), 양 끝 여백 6, 트랙 neutral-20 r2, 썸 neutral-70 50% r2
 *   CSS 스크롤바 스타일(::-webkit-scrollbar + Firefox scrollbar-color)로 구현 → ./scroll-area.css
 */
export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** 스크롤 방향. 기본 vertical */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** 최대 높이 (vertical/both). 숫자는 px */
  maxHeight?: number | string;
  /** 최대 폭 (horizontal/both). 숫자는 px */
  maxWidth?: number | string;
  /**
   * 스크롤 영역 이름. 지정하면 role="region" + tabIndex=0 으로 키보드(방향키/PageDown)로도 스크롤할 수 있습니다.
   * 내부에 포커스 가능한 요소가 없는 긴 텍스트 영역이라면 지정하세요.
   */
  label?: string;
}

const overflow = {
  vertical: 'overflow-y-auto overflow-x-hidden',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
} as const;

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', maxHeight, maxWidth, label, className, style, children, ...rest },
  ref,
) {
  const s: CSSProperties = { maxHeight, maxWidth, ...style };
  return (
    <div
      ref={ref}
      role={label ? 'region' : undefined}
      aria-label={label}
      tabIndex={label ? 0 : undefined}
      style={s}
      className={cn(
        'ds-scroll-area',
        overflow[orientation],
        label && 'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
