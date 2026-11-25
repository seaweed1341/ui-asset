import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconArrowRight } from '../../icons';
import { IconChartBullet } from './icons';
import { chartColor, type ChartColor } from './palette';

/**
 * Figma: `element/legend_item` (3 variants) + `legend` (4 variants)
 *
 * legend_item
 *   type=horizon 01_fix : 148×16, 좌(불릿 10 + 10px Regular neutral-70, gap 2) ↔ 우(값 10px Bold + ic_arrow_right 16, gap 2), 사이 gap 10
 *   type=horizon 02_hug : 내용 폭, p 2/0, gap 5, 값 10px Bold
 *   type=vertical       : 68 폭 세로, 위(불릿 + 라벨) / 아래 값 18px Bold neutral-70
 *   ♦ Show num → showValue · ♦ Show button → showButton
 * legend
 *   type   : Horizon series | Vertical series → itemType (fix·hug | vertical)
 *   정렬    : 가로 | 세로 → direction row | column
 *   간격    : Horizon 가로 8 / 세로 4, Vertical 가로·세로 16
 *
 * 불릿 색은 계열 색(토큰)을 따릅니다. 글자는 항상 텍스트 토큰(neutral-70)입니다.
 */
export interface ChartLegendItemData {
  label: ReactNode;
  value?: ReactNode;
  color?: ChartColor;
  /** 계열이 숨겨진 상태(토글 off) — 투명도 40% */
  hidden?: boolean;
}

export type ChartLegendItemType = 'fix' | 'hug' | 'vertical';

export interface ChartLegendItemProps extends ChartLegendItemData {
  /** Figma legend_item type: horizon 01_fix | horizon 02_hug | vertical */
  type?: ChartLegendItemType;
  /** ♦ Show num */
  showValue?: boolean;
  /** ♦ Show button (오른쪽 화살표, fix 타입만) */
  showButton?: boolean;
  /** 주면 항목 전체가 버튼이 됩니다. toggle=true면 aria-pressed로 계열 표시/숨김을 알립니다. */
  onClick?: () => void;
  toggle?: boolean;
  className?: string;
}

function Bullet({ color }: { color?: ChartColor }) {
  return (
    <span
      className="inline-flex size-2.5 shrink-0 [&>svg]:size-full"
      style={{ color: chartColor(color ?? 'neutral-70') }}
    >
      <IconChartBullet />
    </span>
  );
}

export function ChartLegendItem({
  label,
  value,
  color,
  hidden,
  type = 'fix',
  showValue = true,
  showButton = true,
  onClick,
  toggle,
  className,
}: ChartLegendItemProps) {
  const hasValue = showValue && value != null;
  let body: ReactNode;
  if (type === 'vertical') {
    body = (
      <>
        <span className="flex items-center justify-center">
          <Bullet color={color} />
          <span className="truncate text-body-5 text-neutral-70">{label}</span>
        </span>
        {hasValue && <span className="text-body-2 font-bold text-neutral-70">{value}</span>}
      </>
    );
  } else if (type === 'hug') {
    body = (
      <>
        <span className="flex items-center gap-0.5">
          <Bullet color={color} />
          <span className="whitespace-nowrap text-body-5 text-neutral-70">{label}</span>
        </span>
        {hasValue && <span className="text-body-5 font-bold text-neutral-70">{value}</span>}
      </>
    );
  } else {
    body = (
      <>
        <span className="flex min-w-0 items-center gap-0.5">
          <Bullet color={color} />
          <span className="truncate text-body-5 text-neutral-70">{label}</span>
        </span>
        {(hasValue || showButton) && (
          <span className="flex shrink-0 items-center justify-end gap-0.5">
            {hasValue && <span className="text-body-5 font-bold text-neutral-70">{value}</span>}
            {showButton && (
              <span className="inline-flex size-4 text-neutral-100 [&>svg]:size-full">
                <IconArrowRight />
              </span>
            )}
          </span>
        )}
      </>
    );
  }

  const layout = cn(
    type === 'vertical' && 'flex w-[68px] flex-col items-center',
    type === 'hug' && 'flex items-center gap-[5px] py-0.5',
    type === 'fix' && 'flex h-4 w-[148px] max-w-full items-center justify-between gap-2.5',
    hidden && 'opacity-40',
    className,
  );

  if (!onClick) return <div className={layout}>{body}</div>;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={toggle ? !hidden : undefined}
      className={cn(
        layout,
        'cursor-pointer rounded-sm text-left transition-opacity hover:opacity-80',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
        hidden && 'hover:opacity-60',
      )}
    >
      {body}
    </button>
  );
}

export interface ChartLegendProps {
  items: ChartLegendItemData[];
  /** Figma legend type: horizon(Horizon series) | vertical(Vertical series) */
  type?: 'horizon' | 'vertical';
  /** horizon일 때 항목 모양: fix(148 고정) | hug(내용 폭) */
  itemType?: 'fix' | 'hug';
  /** Figma 정렬: row(가로) | column(세로) */
  direction?: 'row' | 'column';
  showValue?: boolean;
  showButton?: boolean;
  /** 주면 항목이 토글 버튼이 됩니다(계열 표시/숨김). */
  onToggle?: (index: number) => void;
  /** 주면 항목이 이동 버튼이 됩니다(화살표 → 상세). onToggle이 우선합니다. */
  onItemClick?: (index: number) => void;
  /** 가로 정렬 */
  align?: 'start' | 'center' | 'end';
  className?: string;
  'aria-label'?: string;
}

export function ChartLegend({
  items,
  type = 'horizon',
  itemType = 'fix',
  direction = 'row',
  showValue = true,
  showButton = true,
  onToggle,
  onItemClick,
  align = 'start',
  className,
  'aria-label': ariaLabel = '범례',
}: ChartLegendProps) {
  const vertical = type === 'vertical';
  const gap = vertical ? 'gap-4' : direction === 'row' ? 'gap-2' : 'gap-1';
  return (
    <ul
      aria-label={ariaLabel}
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row flex-wrap items-center' : 'flex-col',
        gap,
        direction === 'row' && { start: 'justify-start', center: 'justify-center', end: 'justify-end' }[align],
        direction === 'column' && { start: 'items-start', center: 'items-center', end: 'items-end' }[align],
        className,
      )}
    >
      {items.map((it, i) => {
        const handler = onToggle ? () => onToggle(i) : onItemClick ? () => onItemClick(i) : undefined;
        return (
          <li key={i} className="flex">
            <ChartLegendItem
              {...it}
              type={vertical ? 'vertical' : itemType}
              showValue={showValue}
              showButton={showButton}
              onClick={handler}
              toggle={!!onToggle}
            />
          </li>
        );
      })}
    </ul>
  );
}
