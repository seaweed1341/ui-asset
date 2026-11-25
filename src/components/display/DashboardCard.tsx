import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconArrowDown, IconInfo } from '../../icons';
import { BadgeDot } from '../BadgeDot';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { Thumbnail1x1 } from './Thumbnail';
import { CardHitArea, IconSlot, ProgressLine, cardStroke, focusRing, hitContent, useControllable } from './internal';

/* --------------------------------------------------------------------------
 * 공통: 클릭 가능한 카드 루트 (onClick → button, href → a, 그 외 div)
 * -------------------------------------------------------------------------- */

interface PressableRootProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}

function PressableRoot({ onClick, href, disabled, className, children, ...aria }: PressableRootProps) {
  const interactive = !!onClick || !!href;
  const cls = cn(
    className,
    interactive && cn('text-left transition-colors', focusRing),
    interactive && !disabled && 'cursor-pointer active:bg-neutral-20',
    disabled && 'cursor-not-allowed opacity-40',
  );
  if (href && !disabled) {
    return (
      <a href={href} onClick={onClick} className={cls} {...aria}>
        {children}
      </a>
    );
  }
  if (onClick || href) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={cls} {...aria}>
        {children}
      </button>
    );
  }
  return <div className={cls}>{children}</div>;
}

/* --------------------------------------------------------------------------
 * dashboard card
 * -------------------------------------------------------------------------- */

export interface DashboardCardProps {
  /** Large(아이콘 위·텍스트 아래) | small(아이콘·텍스트 한 줄) */
  size?: 'Large' | 'small';
  /** icon(swap) — 기본 ic_info 16px */
  icon?: IconProp;
  /** ♦ text — 제목 (12px Bold neutral-100) */
  label?: ReactNode;
  /** num — 큰 숫자 (24px Bold neutral-100) */
  value?: ReactNode;
  /** ♦ supporting text — 숫자 뒤 보조 (12px Medium neutral-70, 예: "/ 100") */
  supportingText?: ReactNode;
  /** ♦ progress — 0~100. 주면 숫자 아래 진행 막대 */
  progress?: number;
  /** ♦ badge — 우상단 tag_text(small) 텍스트 */
  badge?: ReactNode;
  /** 카드 클릭 (status=pressed → :active 바탕 neutral-20) */
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Figma: Components / `dashboard card` (4 variants)
 *   status : normal | pressed(:active, 바탕 neutral-20)
 *   size   : Large(text 세로 gap4) | small(text 가로 gap4)
 *   props  : ♦ text · ♦ progress · ♦ badge · icon(swap) · ♦ supporting text · num
 *   - 180×120, p12, 위아래 양끝 정렬, stroke neutral-40 1px
 *   - 숫자 줄: 오른쪽 아래 정렬, gap5 / progress bar_line(medium) 156×6
 *   - 배지 tag_text small: top -6 · right -9 (카드 밖으로 걸침)
 */
export function DashboardCard({
  size = 'Large',
  icon = true,
  label,
  value,
  supportingText,
  progress,
  badge,
  onClick,
  href,
  disabled,
  className,
}: DashboardCardProps) {
  const iconNode = resolveIcon(icon, <IconInfo />);
  return (
    <PressableRoot
      onClick={onClick}
      href={href}
      disabled={disabled}
      className={cn(
        'relative flex h-[120px] w-[180px] flex-col justify-between gap-3 bg-neutral-10 p-3',
        cardStroke,
        'after:border-neutral-40',
        className,
      )}
    >
      <span className={cn('flex w-full gap-1', size === 'Large' ? 'flex-col justify-center' : 'items-center')}>
        {iconNode && <IconSlot className="size-4 text-neutral-100">{iconNode}</IconSlot>}
        {label != null && <span className="truncate text-body-4 font-bold text-neutral-100">{label}</span>}
      </span>
      <span className="flex w-full flex-col items-end justify-end">
        <span className="flex w-full items-end justify-end gap-[5px]">
          {value != null && <span className="min-w-0 truncate text-right text-heading-4 text-neutral-100">{value}</span>}
          {supportingText != null && <span className="shrink-0 pb-1 text-body-4 text-neutral-70">{supportingText}</span>}
        </span>
        {progress !== undefined && <ProgressLine value={progress} className="mt-[5px]" />}
      </span>
      {badge != null && <Tag size="small" label={badge} className="absolute -right-[9px] -top-1.5 z-[4]" />}
    </PressableRoot>
  );
}

/* --------------------------------------------------------------------------
 * dashboard card_L_Progress
 * -------------------------------------------------------------------------- */

export interface DashboardProgressCardProps {
  /** 제목 (15px Medium neutral-70) */
  label?: ReactNode;
  /** 큰 숫자 (28px Bold neutral-70) */
  value?: ReactNode;
  /** ♦ supporting text (15px Medium neutral-40) */
  supportingText?: ReactNode;
  /** ♦ progress — 0~100 */
  progress?: number;
  /** ♦ badge — 우상단 tag_text(medium) */
  badge?: ReactNode;
  /** 왼쪽 아래 thumbnail_1:1(40×40) 이미지. 없으면 자리표시 */
  thumbnailSrc?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Figma: Components / `dashboard card_L_Progress` (2 variants)
 *   status : normal | pressed(:active, 바탕 neutral-20)
 *   props  : ♦ supporting text · ♦ progress · ♦ badge
 *   - 214×134, p12, gap39(위아래 양끝), stroke neutral-40 1px
 *   - count: thumbnail_1:1 40px + (숫자 줄 gap5 / progress 5px) gap8, gap10
 *   - 배지 tag_text medium: top -5 · right -11
 */
export function DashboardProgressCard({
  label,
  value,
  supportingText,
  progress,
  badge,
  thumbnailSrc,
  onClick,
  href,
  disabled,
  className,
}: DashboardProgressCardProps) {
  return (
    <PressableRoot
      onClick={onClick}
      href={href}
      disabled={disabled}
      className={cn(
        'relative flex h-[134px] w-[214px] flex-col justify-between gap-[39px] bg-neutral-10 p-3',
        cardStroke,
        'after:border-neutral-40',
        className,
      )}
    >
      {label != null && <span className="line-clamp-3 w-full text-body-3 text-neutral-70">{label}</span>}
      <span className="mt-auto flex w-full items-end gap-2.5">
        <Thumbnail1x1 src={thumbnailSrc} className="size-10 bg-neutral-10" />
        <span className="flex min-w-0 flex-1 flex-col items-end justify-end gap-2">
          <span className="flex w-full items-end justify-end gap-[5px]">
            {value != null && <span className="min-w-0 truncate text-right text-heading-3 text-neutral-70">{value}</span>}
            {supportingText != null && <span className="shrink-0 pb-0.5 text-body-3 text-neutral-40">{supportingText}</span>}
          </span>
          {progress !== undefined && <ProgressLine value={progress} className="h-[5px]" />}
        </span>
      </span>
      {badge != null && <Tag label={badge} className="absolute -right-[11px] -top-[5px] z-[4]" />}
    </PressableRoot>
  );
}

/* --------------------------------------------------------------------------
 * dashboard card_Noti
 * -------------------------------------------------------------------------- */

export interface DashboardNotiCardProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** left(왼쪽 정렬, 왼쪽 여백 24) | center(가운데 정렬) */
  type?: 'left' | 'center';
  /** state=selected — 바탕 neutral-20. 제어 */
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** 카드 전체 클릭으로 선택(aria-pressed). selected 관련 prop을 주면 자동으로 켜집니다. */
  selectable?: boolean;
  /** alert badge — 왼쪽(9,32) 6px 빨간 점(읽지 않음) */
  alertBadge?: boolean;
  /** thumbnail — thumbnail_1:1(36px, 80%) 이미지. true=자리표시, false=숨김 */
  thumbnail?: boolean | string;
  title?: ReactNode;
  /** subtitle (10px Regular neutral-70) */
  subtitle?: ReactNode;
  /** 본문 (10px Regular neutral-70, 2줄) */
  description?: ReactNode;
  /** date — 메타 줄 날짜/시간. 주면 메타 줄 표시 */
  date?: ReactNode;
  /** 메타 줄 오른쪽 버튼(button secondary h20) */
  actionLabel?: ReactNode;
  onAction?: () => void;
  /** more — 하단 전체폭 텍스트 버튼(오른쪽 ic_arrow_down) */
  moreLabel?: ReactNode;
  onMore?: () => void;
}

/**
 * Figma: Components / `dashboard card_Noti` (4 variants)
 *   type  : center | left
 *   state : default | selected(바탕 neutral-20)
 *   props : alert badge · more · thumbnail · subtitle · date
 *   - 270 폭, 반경 8, stroke neutral-40 1px, overflow hidden
 *   - 본문 p12(left는 왼쪽 24) gap8 / 제목 줄: 썸네일 36 + 제목(12 Medium neutral-100)·부제 gap2
 *   - more: 높이 34, 위쪽 1px 선(raw #a1a1a1 @67% → neutral-40), text 버튼 h26 + 오른쪽 아이콘
 */
export function DashboardNotiCard(props: DashboardNotiCardProps) {
  const {
    type = 'left',
    selected: selectedProp,
    defaultSelected,
    onSelectedChange,
    selectable: selectableProp,
    alertBadge,
    thumbnail = true,
    title,
    subtitle,
    description,
    date,
    actionLabel,
    onAction,
    moreLabel,
    onMore,
    className,
    ...rest
  } = props;
  const id = useId();
  const [selected, setSelected] = useControllable(selectedProp, defaultSelected ?? false, onSelectedChange);
  const selectable = selectableProp ?? (selectedProp !== undefined || defaultSelected !== undefined || !!onSelectedChange);
  const center = type === 'center';
  const content = selectable && hitContent;

  return (
    <article
      className={cn(
        'relative flex w-[270px] flex-col overflow-hidden rounded-lg',
        cardStroke,
        'after:border-neutral-40',
        selected ? 'bg-neutral-20' : 'bg-neutral-10',
        className,
      )}
      {...rest}
    >
      {selectable && <CardHitArea labelledBy={id} pressed={selected} onClick={() => setSelected(!selected)} />}
      {alertBadge && <BadgeDot role="img" aria-label="읽지 않음" className="absolute left-[9px] top-8 z-[4]" />}

      <div className={cn('flex flex-col gap-2 p-3', !center && 'pl-6', content)}>
        <div className={cn('flex items-center gap-2', center && 'justify-center')}>
          {thumbnail !== false && (
            <Thumbnail1x1 src={typeof thumbnail === 'string' ? thumbnail : undefined} type={typeof thumbnail === 'string' ? 'default' : 'none'} className="size-9 opacity-80" />
          )}
          <span className={cn('flex min-w-0 flex-col gap-0.5', !center && 'flex-1')}>
            {title != null && (
              <span id={id} className={cn('truncate text-body-4', selected && center ? 'text-neutral-70' : 'text-neutral-100')}>
                {title}
              </span>
            )}
            {subtitle != null && <span className="truncate text-body-5 text-neutral-70">{subtitle}</span>}
          </span>
        </div>
        {description != null && (
          <p className={cn('line-clamp-2 text-body-5 text-neutral-70', center && 'text-center')}>{description}</p>
        )}
        {(date != null || actionLabel != null) && (
          <div className="flex items-center gap-2.5">
            <span className="min-w-0 flex-1 truncate text-body-5 text-neutral-70">{date}</span>
            {actionLabel != null && <Button variant="secondary" height="h20" label={actionLabel} onClick={onAction} />}
          </div>
        )}
      </div>

      {moreLabel != null && (
        <div className={cn('border-t border-[color-mix(in_srgb,var(--color-neutral-40)_67%,transparent)]', content)}>
          <Button
            variant="text"
            height="h26"
            label={moreLabel}
            icon={<IconArrowDown />}
            iconPosition="right"
            onClick={onMore}
            className={cn('h-[33px] w-full rounded-none text-body-5', selected && center && 'text-neutral-70')}
          />
        </div>
      )}
    </article>
  );
}
