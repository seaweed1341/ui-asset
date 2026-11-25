import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconInfo } from '../../icons';
import { IconBullet } from './icons';

/**
 * 일정 색. Figma 인스턴스에서 실제로 쓰인 변수만 매핑합니다.
 *   neutral    — 점 neutral-100 / 채움 neutral-70 / 카드 neutral-20(구현 추가)
 *   primary    — 점·채움 primary-70 / 카드 primary-15 (weekly_item type=single)
 *   info       — 점·채움 info-60    / 카드 info-20    (weekly_item type=multi)
 *   infoStrong — 점·채움 info-80-text / 카드 info-20
 */
export type ScheduleColor = 'neutral' | 'primary' | 'info' | 'infoStrong';

const dotColor: Record<ScheduleColor, string> = {
  neutral: 'text-neutral-100',
  primary: 'text-primary-70',
  info: 'text-info-60',
  infoStrong: 'text-info-80-text',
};
const fillColor: Record<ScheduleColor, string> = {
  neutral: 'bg-neutral-70',
  primary: 'bg-primary-70',
  info: 'bg-info-60',
  infoStrong: 'bg-info-80-text',
};
const cardColor: Record<ScheduleColor, string> = {
  neutral: 'bg-neutral-20',
  primary: 'bg-primary-15',
  info: 'bg-info-20',
  infoStrong: 'bg-info-20',
};

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70';
/** Figma INNER_SHADOW #000 20%/40% (over/pressed) — 검정 대신 neutral-100 토큰. Tailwind가 읽도록 전체 문자열로 둡니다. */
const fillShade =
  'group-hover:shadow-[inset_0_0_0_100px_color-mix(in_srgb,var(--color-neutral-100)_20%,transparent)] group-active:shadow-[inset_0_0_0_100px_color-mix(in_srgb,var(--color-neutral-100)_40%,transparent)]';
/** weekly_item over/pressed는 Figma 변화가 없어 5%/10% 음영을 둡니다(구현 추가). */
const cardShade =
  'group-hover:shadow-[inset_0_0_0_100px_color-mix(in_srgb,var(--color-neutral-100)_5%,transparent)] group-active:shadow-[inset_0_0_0_100px_color-mix(in_srgb,var(--color-neutral-100)_10%,transparent)]';

/* -------------------------------------------------------------------------- */
/* element/schedule                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/schedule` (12 variants)
 *   style dot  : 87×14, gap 2.68 — common/ic_bullet 11 + "00:00 ~ 00:00" 10px Regular neutral-70 + ♦ icon(alert/ic_info 11)
 *                over/pressed: 뒤에 neutral-20 r2.7 배경(91×17, 사방 2px 확장) · disabled opacity 40%
 *                type=dimmed: 글자 neutral-40
 *   style fill : 90×17, p 1.34/5.36, r2.7, bg neutral-70(색 교체), 글자 neutral-10
 *                over INNER_SHADOW 20% · pressed 40% · disabled 배경만 30%
 */
export interface ScheduleItemProps {
  /** 표시 텍스트 (Figma: "00:00 ~ 00:00") */
  label: ReactNode;
  /** dot | fill (Figma: 🚫 style) */
  variant?: 'dot' | 'fill';
  /** default | dimmed(지난 일정·다른 달) — dot에만 적용 */
  type?: 'default' | 'dimmed';
  /** 점/배경 색. 기본 neutral */
  color?: ScheduleColor;
  /** 오른쪽 아이콘: true면 alert/ic_info (Figma: ♦ icon + icon swap) */
  icon?: IconProp;
  disabled?: boolean;
  /** 있으면 button으로 그립니다(hover/pressed 표현) */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** 마우스 오버 툴팁·스크린리더용 이름 */
  title?: string;
  className?: string;
}

export function ScheduleItem({
  label,
  variant = 'dot',
  type = 'default',
  color = 'neutral',
  icon,
  disabled = false,
  onClick,
  title,
  className,
}: ScheduleItemProps) {
  const iconNode = resolveIcon(icon, <IconInfo />);
  const interactive = !!onClick && !disabled;
  const isDot = variant === 'dot';

  const cls = cn(
    'group relative flex min-w-0 max-w-full items-center gap-[2.68px] text-left text-body-5',
    isDot ? 'h-[14px]' : 'h-[17px] px-[5.36px] py-[1.34px] text-neutral-10',
    isDot && disabled && 'opacity-40',
    disabled && 'cursor-not-allowed',
    focusRing,
    className,
  );

  const content = (
    <>
      {isDot ? (
        interactive && (
          <span
            aria-hidden
            className="absolute -inset-x-0.5 -inset-y-[1.5px] rounded-[2.7px] group-hover:bg-neutral-20 group-active:bg-neutral-20"
          />
        )
      ) : (
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 rounded-[2.7px]',
            fillColor[color],
            disabled && 'opacity-30',
            interactive && fillShade,
          )}
        />
      )}
      {isDot && (
        <span aria-hidden className={cn('relative inline-flex size-[11px] shrink-0 [&>svg]:size-full', dotColor[color])}>
          <IconBullet />
        </span>
      )}
      <span className={cn('relative min-w-0 truncate', isDot && (type === 'dimmed' ? 'text-neutral-40' : 'text-neutral-70'))}>
        {label}
      </span>
      {iconNode && (
        <span
          aria-hidden
          className={cn('relative inline-flex size-[11px] shrink-0 [&>svg]:size-full', isDot ? 'text-neutral-70' : 'text-neutral-10')}
        >
          {iconNode}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button type="button" disabled={disabled} onClick={onClick} title={title} aria-label={title} className={cls}>
        {content}
      </button>
    );
  }
  return (
    <div title={title} className={cls}>
      {content}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* element/weekly_item                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/weekly_item` (22 variants) — 시간표 위 일정 카드
 *   style  : card, r5.4
 *   type   : single — bg primary-15 / multi — bg info-20 (+N 배지)
 *   length : 1x 121×25 (p 8.04/6.7, 제목만)
 *            2x 121×59 (p 8.04/6.7, caption → title → sub title, gap 4.02 / 1.34)
 *            5x 121×159 (p 6.7, gap 8.04, 썸네일 107×54 r2.7 neutral-10 + 2x 내용)
 *   status : normal | over | pressed(Figma 변화 없음 → hover/active에 5%/10% 음영 추가) | selected(테두리 neutral-70 1.34) | disabled(40%)
 *   글자   : caption 8px Regular neutral-70 + alert/ic_info 11 · title 9.38px Bold neutral-100(→ body-5 Bold 10px)
 *            · sub title 10px Regular neutral-70 · 배지 "+3" 9.38px Medium(→ body-5) bg neutral-10 r10.1 p 1.34/5.36
 */
export interface CalendarEventCardProps {
  /** Figma: title (♦ title) */
  title?: ReactNode;
  /** Figma: sub title (♦ sub title) — 보통 "4:00 AM ~ 8:00 AM" */
  subtitle?: ReactNode;
  /** Figma: caption (♦ caption) — 채널명 등, 앞에 info 아이콘 */
  caption?: ReactNode;
  /** caption 앞 아이콘 교체. false면 숨김 */
  captionIcon?: IconProp;
  /** single | multi — color가 없을 때 배경(primary-15 / info-20) */
  type?: 'single' | 'multi';
  /** 배경 색을 직접 지정 (type보다 우선) */
  color?: ScheduleColor;
  /** 1x | 2x | 5x — 내용 구성. 높이는 기본 25·59·159px, style.height로 바꿀 수 있습니다. */
  length?: '1x' | '2x' | '5x';
  /** 5x 썸네일 영역. true면 빈 자리(neutral-10), ReactNode면 그 내용 */
  thumbnail?: boolean | ReactNode;
  /** 오른쪽 아래 "+N" 배지 */
  more?: number;
  selected?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

export function CalendarEventCard({
  title,
  subtitle,
  caption,
  captionIcon = true,
  type = 'single',
  color,
  length = '1x',
  thumbnail,
  more,
  selected = false,
  disabled = false,
  onClick,
  className,
  style,
  'aria-label': ariaLabel,
}: CalendarEventCardProps) {
  const bg = cardColor[color ?? (type === 'multi' ? 'info' : 'primary')];
  const capIcon = resolveIcon(captionIcon, <IconInfo />);
  const fixedH = style?.height === undefined;

  const textBlock = (
    <div className="relative flex min-w-0 flex-col gap-[4.02px]">
      {caption != null && (
        <div className="flex min-w-0 items-center gap-[2.68px] text-body-6 text-neutral-70">
          {capIcon && <span className="inline-flex size-[11px] shrink-0 [&>svg]:size-full">{capIcon}</span>}
          <span className="truncate">{caption}</span>
        </div>
      )}
      {(title != null || subtitle != null) && (
        <div className="flex min-w-0 flex-col gap-[1.34px]">
          {title != null && <span className="truncate text-body-5 font-bold text-neutral-100">{title}</span>}
          {subtitle != null && <span className="truncate text-body-5 text-neutral-70">{subtitle}</span>}
        </div>
      )}
    </div>
  );

  const cls = cn(
    'group relative flex w-[121px] min-w-0 overflow-hidden rounded-[5.4px] text-left',
    bg,
    length === '1x' && cn('items-center px-[6.7px]', type === 'multi' ? 'py-[6.03px]' : 'py-[8.04px]', fixedH && 'h-[25px]'),
    length === '2x' && cn('flex-col px-[6.7px] py-[8.04px]', fixedH && 'h-[59px]'),
    length === '5x' && cn('flex-col gap-[8.04px] p-[6.7px]', fixedH && 'h-[159px]'),
    selected && 'shadow-[inset_0_0_0_1.34px_var(--color-neutral-70)]',
    disabled && 'cursor-not-allowed opacity-40',
    focusRing,
    className,
  );

  const content = (
    <>
      {onClick && !disabled && (
        <span aria-hidden className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', cardShade)} />
      )}
      {length === '1x' ? (
        <span className="relative min-w-0 truncate text-body-5 font-bold text-neutral-100">{title}</span>
      ) : (
        <>
          {length === '5x' && thumbnail && (
            <div className="relative h-[54px] w-full shrink-0 overflow-hidden rounded-[2.7px] bg-neutral-10">
              {thumbnail === true ? null : thumbnail}
            </div>
          )}
          {textBlock}
        </>
      )}
      {more != null && more > 0 && (
        <span className="absolute bottom-[6.7px] right-[6.7px] inline-flex h-[13px] items-center rounded-full bg-neutral-10 px-[5.36px] py-[1.34px] text-body-5 font-medium leading-none text-neutral-70">
          +{more}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        disabled={disabled}
        aria-pressed={selected}
        aria-label={ariaLabel}
        onClick={onClick}
        style={style}
        className={cls}
      >
        {content}
      </button>
    );
  }
  return (
    <div style={style} aria-label={ariaLabel} className={cls}>
      {content}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* element/cate_calendar                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/cate_calendar` (default | today | none) — 열 머리글
 *   높이 29 = 위아래 1px 구분선 neutral-20 + 27 (좌우 p 4.02)
 *   default : bg neutral-10, 10px Bold neutral-40
 *   today   : bg neutral-70, 글자 neutral-10 (내부 p 2.68/8.04 r4)
 *   none    : 빈 칸 (시간표 왼쪽 열)
 */
export interface CalendarHeaderCellProps {
  label?: ReactNode;
  type?: 'default' | 'today' | 'none';
  className?: string;
}

export function CalendarHeaderCell({ label, type = 'default', className }: CalendarHeaderCellProps) {
  return (
    <div
      role="columnheader"
      aria-current={type === 'today' ? 'date' : undefined}
      className={cn(
        'flex h-[29px] items-center justify-center px-[4.02px] shadow-[inset_0_1px_0_var(--color-neutral-20),inset_0_-1px_0_var(--color-neutral-20)]',
        type === 'today' ? 'bg-neutral-70' : 'bg-neutral-10',
        className,
      )}
    >
      {type !== 'none' && (
        <span
          className={cn(
            'whitespace-nowrap text-body-5 font-bold',
            type === 'today' ? 'rounded px-[8.04px] py-[2.68px] text-neutral-10' : 'text-neutral-40',
          )}
        >
          {label}
        </span>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* element/cell_calendar + element/area_schedule                              */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/cell_calendar` (7 variants) + `element/area_schedule` (dot | fill)
 *   101×101, 하단 1px neutral-20
 *   type   : none(빈 칸) | num/schedule(날짜 + 일정)
 *   status : normal — bg neutral-10 / today — 날짜 원 bg neutral-70 + 글자 neutral-10
 *            focused — bg neutral-20 / dimmed — bg neutral-20 + 날짜 40%
 *   날짜   : area_num 높이 22, 원 17×17(r11.4, p 1.675/5.36) x5.36·y5.36, 10px Regular neutral-70 (♦ date)
 *   일정   : area_schedule p 5.36, gap 5.36(dot) | 2.01(fill), 최대 5줄
 */
export interface CalendarDayCellProps {
  /** 날짜 숫자 */
  date?: ReactNode;
  /** 날짜 표시 (Figma: ♦ date) */
  showDate?: boolean;
  /** none | schedule (Figma: num/schedule) */
  type?: 'none' | 'schedule';
  status?: 'normal' | 'today' | 'focused' | 'dimmed';
  /** 일정 간격 (Figma: area_schedule style) */
  itemStyle?: 'dot' | 'fill';
  /** 날짜를 누를 때 (있으면 날짜가 button) */
  onDateClick?: () => void;
  /** 날짜 버튼 이름 (예: "2023년 5월 6일") */
  dateLabel?: string;
  children?: ReactNode;
  className?: string;
}

export function CalendarDayCell({
  date,
  showDate = true,
  type = 'schedule',
  status = 'normal',
  itemStyle = 'dot',
  onDateClick,
  dateLabel,
  children,
  className,
}: CalendarDayCellProps) {
  const numCls = cn(
    'absolute left-[5.36px] top-[5.36px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-[5.36px] py-[1.675px] text-body-5',
    status === 'today' ? 'bg-neutral-70 text-neutral-10' : 'text-neutral-70',
  );
  return (
    <div
      role="gridcell"
      aria-current={status === 'today' ? 'date' : undefined}
      aria-selected={status === 'focused' || undefined}
      className={cn(
        'flex min-h-[101px] min-w-0 flex-col shadow-[inset_0_-1px_0_var(--color-neutral-20)]',
        status === 'focused' || status === 'dimmed' ? 'bg-neutral-20' : 'bg-neutral-10',
        className,
      )}
    >
      {type === 'schedule' && (
        <>
          {showDate && (
            <div className={cn('relative h-[22px] shrink-0', status === 'dimmed' && 'opacity-40')}>
              {onDateClick ? (
                <button
                  type="button"
                  aria-label={dateLabel}
                  onClick={onDateClick}
                  className={cn(numCls, status !== 'today' && 'hover:bg-neutral-20', focusRing)}
                >
                  {date}
                </button>
              ) : (
                <span className={numCls}>{date}</span>
              )}
            </div>
          )}
          <div className={cn('flex min-h-0 min-w-0 flex-1 flex-col p-[5.36px]', itemStyle === 'dot' ? 'gap-[5.36px]' : 'gap-[2.01px]')}>
            {children}
          </div>
        </>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* element/focus_time                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Figma: `element/focus_time` — 시간표의 현재 시각 표시
 *   시각 알약 53×18, r4, bg neutral-70, 9.38px Bold neutral-10(→ body-5 Bold), p 2.68/8.04 + 가로선 1px neutral-70
 */
export interface CalendarNowIndicatorProps {
  /** 표시 시각 (예: "5:00 AM") */
  label: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function CalendarNowIndicator({ label, className, style }: CalendarNowIndicatorProps) {
  return (
    <div aria-hidden className={cn('flex h-[18px] items-center', className)} style={style}>
      <span className="inline-flex h-[18px] shrink-0 items-center rounded bg-neutral-70 px-[8.04px] py-[2.68px] text-body-5 font-bold leading-none text-neutral-10">
        {label}
      </span>
      <span className="h-px flex-1 bg-neutral-70" />
    </div>
  );
}
