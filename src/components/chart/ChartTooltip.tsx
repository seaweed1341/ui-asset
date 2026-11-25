import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * Figma: `tootip/default/bottom/center` · `tootip/default/left/center` (차트 막대·점의 ♦ tootip)
 *   textbox : bg neutral-70, r2.68, p 4.02/6.7, gap 2.68
 *   text    : 10px Regular neutral-10 / 보조 줄 8px Regular
 *             (Figma 보조 줄 색 neutral-70은 배경과 같아 보이지 않으므로 neutral-20으로 매핑)
 *   arrow   : 4×2.7 삼각형
 * 차트 영역(relative) 안에 절대 위치로 띄우는 HTML 오버레이입니다.
 */
export interface ChartTooltipProps {
  /** 기준점 x, y (차트 컨테이너 기준 px) */
  x: number;
  y: number;
  /** top = 기준점 위(화살표 아래쪽), right = 기준점 오른쪽(화살표 왼쪽) */
  placement?: 'top' | 'right';
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function ChartTooltip({ x, y, placement = 'top', title, children, className }: ChartTooltipProps) {
  const top = placement === 'top';
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute z-20 flex',
        top ? '-translate-x-1/2 -translate-y-full flex-col items-center pb-1' : '-translate-y-1/2 flex-row items-center pl-1',
        className,
      )}
      style={{ left: x, top: y }}
    >
      <svg
        width={top ? 4 : 2.7}
        height={top ? 2.7 : 4}
        viewBox={top ? '0 0 4 2.7' : '0 0 2.7 4'}
        className={cn('shrink-0 text-neutral-70', top ? 'order-last' : 'order-first')}
      >
        <path d={top ? 'M0 0H4L2 2.7Z' : 'M2.7 0V4L0 2Z'} fill="currentColor" />
      </svg>
      <div className="flex w-max max-w-48 flex-col gap-[2.68px] rounded-[2.68px] bg-neutral-70 px-[6.7px] py-[4.02px] text-body-5 text-neutral-10">
        {title != null && <div className="text-body-6 text-neutral-20">{title}</div>}
        {children}
      </div>
    </div>
  );
}

/** 툴팁 안 한 줄: 계열 점 + 이름 + 값 */
export function ChartTooltipRow({ color, name, value }: { color?: string; name?: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      {color && <span className="size-1.5 shrink-0 rounded-full ring-1 ring-neutral-10" style={{ background: color }} />}
      {name != null && <span>{name}</span>}
      <span className="font-bold">{value}</span>
    </div>
  );
}
