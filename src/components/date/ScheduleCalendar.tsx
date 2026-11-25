import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import type { IconProp } from '../../lib/icon-slot';
import { IconArrowLeft, IconArrowRight } from '../../icons';
import { Button } from '../Button';
import { Dropdown } from '../Dropdown';
import { IconBullet } from './icons';
import {
  CalendarDayCell,
  CalendarEventCard,
  CalendarHeaderCell,
  CalendarNowIndicator,
  ScheduleItem,
  type ScheduleColor,
} from './ScheduleParts';
import {
  WEEKDAY_SHORT,
  addDays,
  addMonths,
  formatHm,
  formatTime12,
  formatYmd,
  isSameDay,
  isSameMonth,
  monthGrid,
  pad2,
  spokenDate,
  startOfDay,
  startOfWeek,
  type WeekStart,
} from './utils';

export interface CalendarEvent {
  id: string;
  /** 카드 제목 (Figma: Campaign Name) */
  title: ReactNode;
  start: Date;
  end: Date;
  /** 카드 caption (Figma: Channel Name) */
  caption?: ReactNode;
  /** 월·주(default) 보기 일정 줄 텍스트. 기본 "HH:mm ~ HH:mm" */
  label?: ReactNode;
  /** 일정 색. 기본 primary */
  color?: ScheduleColor;
  /** 종일 일정 — 시간표에서는 머리글 아래 줄에 표시 */
  allDay?: boolean;
  /** 흐리게 (Figma: schedule type=dimmed) */
  dimmed?: boolean;
  disabled?: boolean;
  /** 시간표 5x 카드 썸네일 */
  thumbnail?: boolean | ReactNode;
  /** 카드 "+N" 배지 */
  more?: number;
  /** 일정 줄 오른쪽 아이콘 (ScheduleItem icon) */
  icon?: IconProp;
}

export interface CalendarLegendItem {
  label: ReactNode;
  color: ScheduleColor;
}

export type CalendarView = 'month' | 'week' | 'day';

export interface ScheduleCalendarProps {
  events?: CalendarEvent[];
  /** month | week | day (Figma: weekly/monthly + 일간은 시간표 1열) */
  view?: CalendarView;
  defaultView?: CalendarView;
  onViewChange?: (view: CalendarView) => void;
  /** 주 보기 형태 (Figma: type). default = 요일별 일정 목록, time = 시간표. day 보기는 항상 시간표 */
  type?: 'default' | 'time';
  /** 기준 날짜 (제어). 월 보기에서는 이 날짜 칸이 focused */
  date?: Date;
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
  /** 오늘 (기본 new Date()) */
  today?: Date;
  /** 아래 범례 (Figma: ♦ legend). 없으면 숨김 */
  legend?: CalendarLegendItem[];
  /** Today 버튼 (Figma: ♦ button_today) */
  todayButton?: boolean;
  /** 보기 전환 드롭다운 (Figma: ♦ dropdown) */
  viewSelect?: boolean;
  /** 월·주(default) 보기 일정 줄 모양 (Figma: area_schedule style) */
  itemStyle?: 'dot' | 'fill';
  /** 월 칸에 보이는 최대 일정 수. 넘치면 "+N" (Figma area_schedule 최대 5) */
  maxItemsPerCell?: number;
  weekStartsOn?: WeekStart;
  /** 시간표 시작·끝 시(0~24) */
  startHour?: number;
  endHour?: number;
  /** 시간표를 처음 이 시각으로 스크롤 */
  scrollToHour?: number;
  /** 시간표 본문 높이(px). Figma 436 */
  bodyHeight?: number;
  /** 현재 시각 표시 (Figma: element/focus_time) */
  showNow?: boolean;
  /** 현재 시각 (기본 new Date(), 테스트·문서용) */
  now?: Date;
  selectedEventId?: string;
  onEventClick?: (event: CalendarEvent) => void;
  /** 월 보기 날짜 숫자를 누를 때 */
  onDateClick?: (date: Date) => void;
  className?: string;
}

const HOUR = 34; // element/time_calendar 높이
const DAY_MS = 86_400_000;

const VIEW_OPTIONS = [
  { value: 'month', label: 'Monthly' },
  { value: 'week', label: 'Weekly' },
  { value: 'day', label: 'Daily' },
];

const legendDot: Record<ScheduleColor, string> = {
  neutral: 'text-neutral-100',
  primary: 'text-primary-70',
  info: 'text-info-60',
  infoStrong: 'text-info-80-text',
};

const navBtn =
  'inline-flex size-4 shrink-0 text-neutral-70 [&>svg]:size-full hover:text-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70';

const eventsOn = (events: CalendarEvent[], day: Date) => {
  const s = startOfDay(day).getTime();
  const e = s + DAY_MS;
  return events
    .filter((ev) => {
      const a = ev.start.getTime();
      const b = Math.max(ev.end.getTime(), a + 1);
      return a < e && b > s;
    })
    .sort((x, y) => x.start.getTime() - y.start.getTime());
};

const isAllDay = (ev: CalendarEvent) => !!ev.allDay || ev.end.getTime() - ev.start.getTime() >= DAY_MS;
const textOf = (n: ReactNode) => (typeof n === 'string' || typeof n === 'number' ? String(n) : undefined);
const rangeLabel = (ev: CalendarEvent) => `${formatHm(ev.start)} ~ ${formatHm(ev.end)}`;

/** 겹치는 일정을 나란히 놓기 위한 열 배치 */
function layoutLanes(list: CalendarEvent[]) {
  const out = new Map<string, { lane: number; lanes: number }>();
  let cluster: { ev: CalendarEvent; lane: number }[] = [];
  let laneEnds: number[] = [];
  let clusterEnd = -Infinity;
  const flush = () => {
    for (const c of cluster) out.set(c.ev.id, { lane: c.lane, lanes: laneEnds.length });
    cluster = [];
    laneEnds = [];
  };
  for (const ev of list) {
    const a = ev.start.getTime();
    const b = Math.max(ev.end.getTime(), a + 15 * 60_000);
    if (a >= clusterEnd) flush();
    let lane = laneEnds.findIndex((end) => end <= a);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(b);
    } else laneEnds[lane] = b;
    cluster.push({ ev, lane });
    clusterEnd = Math.max(clusterEnd === -Infinity ? b : clusterEnd, b);
  }
  flush();
  return out;
}

/**
 * Figma: `calendar` (weekly/monthly × type default|time) = 상단 바 + `element/base_calendar` + legend
 *   상단 바   : ic_arrow_left 16 · 제목 16.08px Bold neutral-70(→ body-3 Bold) · ic_arrow_right 16 (gap 10.72)
 *               + Today 버튼(button secondary, gap 13.4, ♦ button_today) · 오른쪽 dropdown 80 (♦ dropdown)
 *               제목: 주 "YYYY.MM.DD - MM.DD" / 월 "YYYY.MM" / 일 "YYYY.MM.DD". 본문까지 17px
 *   base_calendar : 804×465, 열 사이 1px neutral-20
 *     weekly·default : element/column_calendar(type=5) 7열 — 오늘 열은 머리글 today + 칸 focused
 *     weekly·time    : 시간 열 73(element/time_calendar 72×34, 10px Regular neutral-40 오른쪽 정렬) + 7열, 1시간 34px
 *                      일정 카드 element/weekly_item: 열 안쪽 4px, 위 4px, 높이 = 시간×34 − 9 (1x 25 / 2x 59 / 5x 159)
 *     monthly        : 7열 × 주, 칸 element/cell_calendar(num/schedule) 높이 87
 *   legend   : 오른쪽 정렬, 본문과 8.04, ic_bullet 7 + 6.7px Regular neutral-70(→ body-6)
 * 일정 색은 ScheduleColor(neutral·primary·info·infoStrong)로 Figma 변수에 매핑합니다.
 */
export function ScheduleCalendar({
  events = [],
  view: viewProp,
  defaultView = 'month',
  onViewChange,
  type = 'default',
  date: dateProp,
  defaultDate,
  onDateChange,
  today: todayProp,
  legend,
  todayButton = true,
  viewSelect = true,
  itemStyle = 'dot',
  maxItemsPerCell = 3,
  weekStartsOn = 0,
  startHour = 0,
  endHour = 24,
  scrollToHour = 8,
  bodyHeight = 436,
  showNow = true,
  now: nowProp,
  selectedEventId,
  onEventClick,
  onDateClick,
  className,
}: ScheduleCalendarProps) {
  const today = useMemo(() => startOfDay(todayProp ?? new Date()), [todayProp]);
  const [innerView, setInnerView] = useState<CalendarView>(defaultView);
  const view = viewProp ?? innerView;
  const setView = (v: CalendarView) => {
    if (viewProp === undefined) setInnerView(v);
    onViewChange?.(v);
  };
  const [innerDate, setInnerDate] = useState(() => startOfDay(defaultDate ?? today));
  const date = dateProp ? startOfDay(dateProp) : innerDate;
  const setDate = (d: Date) => {
    if (dateProp === undefined) setInnerDate(startOfDay(d));
    onDateChange?.(startOfDay(d));
  };

  const timeGrid = view === 'day' || (view === 'week' && type === 'time');
  const weekStart = startOfWeek(date, weekStartsOn);
  const days = view === 'day' ? [date] : view === 'week' ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) : [];

  const shift = (n: number) =>
    setDate(view === 'month' ? addMonths(date, n) : addDays(date, view === 'week' ? 7 * n : n));

  const title =
    view === 'month'
      ? `${date.getFullYear()}.${pad2(date.getMonth() + 1)}`
      : view === 'week'
        ? `${formatYmd(days[0])} - ${pad2(days[6].getMonth() + 1)}.${pad2(days[6].getDate())}`
        : formatYmd(date);
  const unit = view === 'month' ? '달' : view === 'week' ? '주' : '날';

  /* 시간표 스크롤 */
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (timeGrid && scrollRef.current) scrollRef.current.scrollTop = Math.max(0, scrollToHour - startHour) * HOUR;
  }, [timeGrid, view, scrollToHour, startHour]);

  const itemFor = (ev: CalendarEvent, dim = false) => (
    <ScheduleItem
      key={ev.id}
      variant={itemStyle}
      color={ev.color ?? 'primary'}
      label={ev.label ?? rangeLabel(ev)}
      type={ev.dimmed || dim ? 'dimmed' : 'default'}
      disabled={ev.disabled}
      icon={ev.icon}
      title={textOf(ev.title) ?? textOf(ev.label)}
      onClick={onEventClick ? () => onEventClick(ev) : undefined}
      className={itemStyle === 'fill' ? 'w-full' : undefined}
    />
  );

  const items = (list: CalendarEvent[], dim: boolean, limit: number) => (
    <>
      {list.slice(0, limit).map((ev) => itemFor(ev, dim))}
      {list.length > limit && <span className="px-0.5 text-body-6 text-neutral-70">+{list.length - limit}</span>}
    </>
  );

  /* ---------------------------------- body ---------------------------------- */
  let body: ReactNode;

  if (view === 'month') {
    const grid = monthGrid(date, weekStartsOn);
    const weeks = Array.from({ length: grid.length / 7 }, (_, i) => grid.slice(i * 7, i * 7 + 7));
    body = (
      <div role="grid" aria-label={`${date.getFullYear()}년 ${date.getMonth() + 1}월 일정`} className="flex flex-col bg-neutral-10">
        <div role="row" className="grid grid-cols-7 gap-x-px bg-neutral-20">
          {weeks[0].map((d) => (
            <CalendarHeaderCell key={d.getDay()} label={WEEKDAY_SHORT[d.getDay()]} />
          ))}
        </div>
        {weeks.map((week) => (
          <div role="row" key={week[0].getTime()} className="grid grid-cols-7 gap-x-px bg-neutral-20">
            {week.map((d) => {
              const outside = !isSameMonth(d, date);
              const status = outside ? 'dimmed' : isSameDay(d, today) ? 'today' : isSameDay(d, date) ? 'focused' : 'normal';
              return (
                <CalendarDayCell
                  key={d.getTime()}
                  date={d.getDate()}
                  dateLabel={spokenDate(d)}
                  status={status}
                  itemStyle={itemStyle}
                  className="min-h-[87px]"
                  onDateClick={() => {
                    setDate(d);
                    onDateClick?.(d);
                  }}
                >
                  {items(eventsOn(events, d), outside, maxItemsPerCell)}
                </CalendarDayCell>
              );
            })}
          </div>
        ))}
      </div>
    );
  } else if (!timeGrid) {
    /* weekly · default */
    body = (
      <div role="grid" aria-label={`${title} 일정`} className="flex flex-col bg-neutral-10">
        <div role="row" className="grid grid-cols-7 gap-x-px bg-neutral-20">
          {days.map((d) => (
            <CalendarHeaderCell
              key={d.getTime()}
              type={isSameDay(d, today) ? 'today' : 'default'}
              label={`${WEEKDAY_SHORT[d.getDay()]} ${d.getDate()}`}
            />
          ))}
        </div>
        <div role="row" className="grid grid-cols-7 gap-x-px bg-neutral-20">
          {days.map((d) => (
            <CalendarDayCell
              key={d.getTime()}
              showDate={false}
              status={isSameDay(d, today) ? 'focused' : 'normal'}
              itemStyle={itemStyle}
              className="min-h-[435px]"
            >
              {items(eventsOn(events, d), false, Infinity)}
            </CalendarDayCell>
          ))}
        </div>
      </div>
    );
  } else {
    /* 시간표 (weekly · time / daily) */
    const hours = Array.from({ length: Math.max(1, endHour - startHour) }, (_, i) => startHour + i);
    const now = nowProp ?? new Date();
    const nowMin = (now.getHours() - startHour) * 60 + now.getMinutes();
    const showNowLine = showNow && days.some((d) => isSameDay(d, now)) && nowMin >= 0 && nowMin <= hours.length * 60;
    const allDayByDay = days.map((d) => eventsOn(events, d).filter(isAllDay));
    const hasAllDay = allDayByDay.some((l) => l.length > 0);
    const cols = view === 'day' ? 'grid-cols-1' : 'grid-cols-7';

    body = (
      <div role="grid" aria-label={`${title} 시간표`} className="flex flex-col bg-neutral-10">
        <div role="row" className="flex gap-x-px bg-neutral-20">
          <CalendarHeaderCell type="none" className="w-[73px] shrink-0" />
          <div className={cn('grid flex-1 gap-x-px', cols)}>
            {days.map((d) => (
              <CalendarHeaderCell
                key={d.getTime()}
                type={isSameDay(d, today) ? 'today' : 'default'}
                label={`${WEEKDAY_SHORT[d.getDay()]} ${d.getDate()}`}
              />
            ))}
          </div>
        </div>

        {hasAllDay && (
          <div role="row" className="flex gap-x-px bg-neutral-20">
            <div className="flex w-[73px] shrink-0 items-center justify-end bg-neutral-10 pr-[18px] text-body-6 text-neutral-40">
              종일
            </div>
            <div className={cn('grid flex-1 gap-x-px', cols)}>
              {allDayByDay.map((list, i) => (
                <div
                  key={i}
                  role="gridcell"
                  className="flex min-w-0 flex-col gap-[2.01px] bg-neutral-10 p-1 shadow-[inset_0_-1px_0_var(--color-neutral-20)]"
                >
                  {list.map((ev) => (
                    <ScheduleItem
                      key={ev.id}
                      variant="fill"
                      color={ev.color ?? 'primary'}
                      label={ev.title}
                      disabled={ev.disabled}
                      title={textOf(ev.title)}
                      onClick={onEventClick ? () => onEventClick(ev) : undefined}
                      className="w-full"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="relative overflow-y-auto" style={{ maxHeight: bodyHeight }}>
          <div className="relative flex gap-x-px bg-neutral-20" style={{ height: hours.length * HOUR }}>
            {/* element/time_calendar */}
            <div className="w-[73px] shrink-0 bg-neutral-10">
              {hours.map((h) => (
                <div key={h} className="flex h-[34px] items-center justify-end pr-[18px] text-body-5 text-neutral-40">
                  {formatTime12(new Date(2000, 0, 1, h % 24))}
                </div>
              ))}
            </div>

            <div className={cn('grid flex-1 gap-x-px', cols)}>
              {days.map((d) => {
                const isToday = isSameDay(d, today);
                const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate(), startHour).getTime();
                const timed = eventsOn(events, d).filter((ev) => !isAllDay(ev));
                const lanes = layoutLanes(timed);
                return (
                  <div key={d.getTime()} role="gridcell" aria-label={spokenDate(d)} className="relative min-w-0">
                    {hours.map((h) => (
                      <div
                        key={h}
                        className={cn('h-[34px] shadow-[inset_0_-1px_0_var(--color-neutral-20)]', isToday ? 'bg-neutral-20' : 'bg-neutral-10')}
                      />
                    ))}
                    {timed.map((ev) => {
                      const a = Math.max(ev.start.getTime(), dayStart);
                      const b = Math.min(Math.max(ev.end.getTime(), a + 15 * 60_000), dayStart + hours.length * 3_600_000);
                      if (b <= dayStart || a >= dayStart + hours.length * 3_600_000) return null;
                      const top = ((a - dayStart) / 3_600_000) * HOUR + 4;
                      const height = Math.max(17, ((b - a) / 3_600_000) * HOUR - 9);
                      const { lane, lanes: n } = lanes.get(ev.id) ?? { lane: 0, lanes: 1 };
                      const length = height >= 159 && ev.thumbnail ? '5x' : height >= 59 ? '2x' : '1x';
                      return (
                        <CalendarEventCard
                          key={ev.id}
                          title={ev.title}
                          subtitle={`${formatTime12(ev.start)} ~ ${formatTime12(ev.end)}`}
                          caption={ev.caption}
                          color={ev.color ?? 'primary'}
                          type={ev.more ? 'multi' : 'single'}
                          length={length}
                          thumbnail={ev.thumbnail}
                          more={ev.more}
                          disabled={ev.disabled}
                          selected={selectedEventId === ev.id}
                          aria-label={textOf(ev.title)}
                          onClick={onEventClick ? () => onEventClick(ev) : undefined}
                          className="absolute w-auto"
                          style={{
                            top,
                            height,
                            left: `calc(4px + (100% - 8px) * ${lane / n})`,
                            width: `calc((100% - 8px) / ${n} - ${n > 1 ? 2 : 0}px)`,
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {showNowLine && (
              <CalendarNowIndicator
                label={formatTime12(now)}
                className="pointer-events-none absolute left-[9px] right-0 z-10"
                style={{ top: (nowMin / 60) * HOUR - 9 }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section aria-label="일정 달력" className={cn('flex w-[804px] max-w-full flex-col', className)}>
      {/* date+btn · dropdown */}
      <div className="mb-[17px] flex h-6 items-center justify-between gap-4">
        <div className="flex items-center gap-[13.4px]">
          <div className="flex items-center gap-[10.72px]">
            <button type="button" aria-label={`이전 ${unit}`} className={navBtn} onClick={() => shift(-1)}>
              <IconArrowLeft />
            </button>
            <h2 aria-live="polite" className="whitespace-nowrap text-body-3 font-bold text-neutral-70">
              {title}
            </h2>
            <button type="button" aria-label={`다음 ${unit}`} className={navBtn} onClick={() => shift(1)}>
              <IconArrowRight />
            </button>
          </div>
          {todayButton && <Button variant="secondary" height="h20" label="Today" onClick={() => setDate(today)} />}
        </div>
        {viewSelect && (
          <Dropdown
            options={VIEW_OPTIONS}
            value={view}
            onChange={(v) => setView(v as CalendarView)}
            className="w-20"
          />
        )}
      </div>

      {body}

      {legend && legend.length > 0 && (
        <ul className="mt-[8.04px] flex flex-wrap justify-end gap-[5.36px]">
          {legend.map((l, i) => (
            <li key={i} className="flex items-center text-body-6 text-neutral-70">
              <span aria-hidden className={cn('inline-flex size-[7px] [&>svg]:size-full', legendDot[l.color])}>
                <IconBullet />
              </span>
              {l.label}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
