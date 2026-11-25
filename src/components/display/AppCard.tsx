import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconArrowRight } from '../../icons';
import { IconBullet } from './icons';
import { IconSlot, cardStroke, focusRing, stroke40a67, useControllable } from './internal';

export interface AppCardItem {
  /** 범례 텍스트 (element/legend_item, 10px Regular neutral-70) */
  label: ReactNode;
  /** 오른쪽 값 (10px Bold neutral-70) */
  value?: ReactNode;
  /** sub text — 값 뒤 단위 (예: "days") */
  unit?: ReactNode;
}

export interface AppCardProps {
  /** 제목 (15px Bold neutral-70) */
  title: ReactNode;
  /** 100%(240 폭, 패딩 16·24) | 400%(172 폭, 패딩 16) */
  layout?: '100%' | '400%';
  /** 범례 목록. 주면 status=normal/selected, 없으면 text를 쓰는 normal_text/selected_text */
  items?: AppCardItem[];
  /** _text 상태의 본문 (12px Medium neutral-70, 가운데) */
  text?: ReactNode;
  /** sub text — 항목의 unit 표시 여부 */
  subText?: boolean;
  /** status=selected* — 바탕 neutral-20, stroke neutral-70 1.34px, 제목 앞 점. 제어 */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** 카드 클릭(선택 토글 포함). selected 관련 prop이나 onClick이 있으면 button으로 렌더링 */
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Figma: Components / `app card_cc` (8 variants)
 *   status : selected | normal | selected_text | normal_text  →  selected + (items | text)
 *   layout : 400% | 100%
 *   props  : sub text
 *   - normal  : neutral-10 바탕, stroke neutral-40 @67% 1px
 *   - selected: neutral-20 바탕, stroke neutral-70 1.34px, 제목 앞 7px(400%: 5px) 점 neutral-70
 *   - 내용 gap12 / 범례 줄 gap8: ic_bullet 10px(neutral-100) + 텍스트 · 값(10 Bold) + ic_arrow_right 12px(neutral-100) gap5
 */
export function AppCard({
  title,
  layout = '100%',
  items,
  text,
  subText,
  selected: selectedProp,
  defaultSelected,
  onSelectedChange,
  onClick,
  disabled,
  className,
}: AppCardProps) {
  const [selected, setSelected] = useControllable(selectedProp, defaultSelected ?? false, onSelectedChange);
  const selectable = selectedProp !== undefined || defaultSelected !== undefined || !!onSelectedChange;
  const interactive = selectable || !!onClick;
  const wide = layout === '100%';

  const body = (
    <>
      <span className={cn('flex w-full items-center', wide ? 'gap-2' : 'gap-[6.7px]')}>
        {selected && <span aria-hidden className={cn('shrink-0 rounded-full bg-neutral-70', wide ? 'size-[7px]' : 'size-[5px]')} />}
        <span className="min-w-0 flex-1 text-left text-body-3 font-bold text-neutral-70">{title}</span>
      </span>
      {items ? (
        <span className="flex w-full flex-col gap-2">
          {items.map((it, i) => (
            <span key={i} className="flex w-full items-center justify-between gap-0.5">
              <span className="flex min-w-0 flex-1 items-center gap-0.5">
                <IconSlot className="size-2.5 text-neutral-100">
                  <IconBullet />
                </IconSlot>
                <span className="truncate text-body-5 text-neutral-70">{it.label}</span>
              </span>
              <span className="flex shrink-0 items-center gap-[5px]">
                <span className="text-right text-body-5 font-bold text-neutral-70">{it.value}</span>
                {subText && it.unit != null && <span className="text-body-4 font-regular text-neutral-100">{it.unit}</span>}
                <IconSlot className="size-3 text-neutral-100">
                  <IconArrowRight />
                </IconSlot>
              </span>
            </span>
          ))}
        </span>
      ) : (
        <span className="w-full text-center text-body-4 text-neutral-70">{text}</span>
      )}
    </>
  );

  const cls = cn(
    'relative flex flex-col items-center justify-center gap-3 py-4 transition-colors',
    wide ? 'w-[240px] px-6' : 'w-[172px] px-4',
    !items && wide && 'justify-start',
    cardStroke,
    selected ? 'bg-neutral-20 after:border-[1.34px] after:border-neutral-70' : cn('bg-neutral-10', stroke40a67),
    disabled && 'cursor-not-allowed opacity-40',
    className,
  );

  if (!interactive) return <div className={cls}>{body}</div>;
  return (
    <button
      type="button"
      aria-pressed={selectable ? selected : undefined}
      disabled={disabled}
      onClick={() => {
        if (selectable) setSelected(!selected);
        onClick?.();
      }}
      className={cn(cls, focusRing)}
    >
      {body}
    </button>
  );
}
