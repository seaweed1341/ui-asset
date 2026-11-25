import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconInfo } from '../../icons';
import { IconSlot, cardStroke } from './internal';

/**
 * Figma: Components / `element/card_none` (2 variants)
 *   type : 01 — neutral-10 바탕, ic_info 32px(neutral-40) + 15px Medium neutral-40, gap 5
 *          02 — neutral-20 바탕, 18px Medium neutral-100 ("There is no item")
 *   공통: 348×200, stroke neutral-40 1px, 내용 가운데 정렬(좌우 16px)
 *   basic card_01 / basic card_02 의 type=none(-) 상태로도 쓰입니다.
 */
export interface CardEmptyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  type?: '01' | '02';
  label?: ReactNode;
  /** type 01 아이콘. 기본 ic_info(true), false면 숨김 */
  icon?: IconProp;
}

export function CardEmpty({ type = '01', label, icon = true, className, ...rest }: CardEmptyProps) {
  const iconNode = type === '01' ? resolveIcon(icon, <IconInfo />) : null;
  return (
    <div
      className={cn(
        'relative flex h-[200px] w-[348px] flex-col items-center justify-center gap-[5px] px-4 text-center',
        cardStroke,
        'after:border-neutral-40',
        type === '01' ? 'bg-neutral-10' : 'bg-neutral-20',
        className,
      )}
      {...rest}
    >
      {iconNode && <IconSlot className="size-8 text-neutral-40">{iconNode}</IconSlot>}
      <p className={type === '01' ? 'text-body-3 text-neutral-40' : 'text-body-2 text-neutral-100'}>
        {label ?? (type === '01' ? '항목이 없습니다' : 'There is no item')}
      </p>
    </div>
  );
}
