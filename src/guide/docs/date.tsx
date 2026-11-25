import { useMemo, useState, type ReactNode } from 'react';
import {
  CalendarDayCell,
  CalendarEventCard,
  CalendarHeaderCell,
  CalendarNowIndicator,
  DateInput,
  DatePicker,
  DatePickerDay,
  DatePickerMonth,
  DatePickerYear,
  MonthPicker,
  ScheduleCalendar,
  ScheduleItem,
  formatYmd,
  formatYmdRange,
  type CalendarEvent,
  type CalendarView,
  type DateRange,
} from '../../components/date';
import type { ComponentDoc } from '../ComponentDocs';
import type { PropRow } from '../ui';

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </div>
  );
}

const Value = ({ children }: { children: ReactNode }) => (
  <span className="font-mono text-[12px] text-neutral-70">{children}</span>
);

const CLASS: PropRow = { name: 'className', type: 'string', description: '바깥 요소에 덧붙일 클래스.' };
const PICKER_LIMITS: PropRow[] = [
  { name: 'minDate / maxDate', type: 'Date', description: '고를 수 있는 기간. 밖의 날짜·월은 40% 투명도로 비활성.' },
  { name: 'isDateDisabled', type: '(date: Date) => boolean', description: '개별 날짜 비활성 판정(주말·공휴일 등).' },
  { name: 'today', type: 'Date', defaultValue: 'new Date()', description: '오늘 표시 기준일.' },
  { name: 'weekStartsOn', type: '0 | 1', defaultValue: '0', description: '주 시작 요일(0=일, 1=월).' },
  { name: 'weekdays', type: 'boolean | string[]', defaultValue: 'false', description: '요일 머리글. Figma에는 없어 기본 숨김.' },
];

const d = (base: Date, days: number, h = 0, m = 0) =>
  new Date(base.getFullYear(), base.getMonth(), base.getDate() + days, h, m);

function useSampleEvents(): CalendarEvent[] {
  return useMemo(() => {
    const t = new Date();
    return [
      { id: 'e1', title: 'Campaign Name', caption: 'Channel Name', start: d(t, 0, 9), end: d(t, 0, 11), color: 'primary' },
      { id: 'e2', title: 'Campaign Name', start: d(t, 0, 13), end: d(t, 0, 14), color: 'info' },
      { id: 'e3', title: 'Campaign Name', caption: 'Channel Name', start: d(t, 1, 8), end: d(t, 1, 13), color: 'info', more: 3, thumbnail: true },
      { id: 'e4', title: 'Campaign Name', start: d(t, -1, 10), end: d(t, -1, 12), color: 'primary' },
      { id: 'e5', title: 'Campaign Name', start: d(t, -1, 11), end: d(t, -1, 12, 30), color: 'infoStrong' },
      { id: 'e6', title: '정기 점검', start: d(t, 2, 0), end: d(t, 3, 0), allDay: true, color: 'neutral' },
      { id: 'e7', title: 'Campaign Name', start: d(t, -3, 9), end: d(t, -3, 10), color: 'primary', dimmed: true },
      { id: 'e8', title: 'Campaign Name', start: d(t, 5, 15), end: d(t, 5, 16), color: 'info', disabled: true },
      { id: 'e9', title: 'Campaign Name', start: d(t, 0, 16), end: d(t, 0, 17), color: 'infoStrong' },
      { id: 'e10', title: 'Campaign Name', start: d(t, 0, 18), end: d(t, 0, 19), color: 'primary' },
    ];
  }, []);
}

const LEGEND = [
  { label: 'legend 01', color: 'primary' as const },
  { label: 'legend 02', color: 'info' as const },
  { label: 'legend 03', color: 'infoStrong' as const },
  { label: 'legend 04', color: 'neutral' as const },
];

export const dateDocs: ComponentDoc[] = [
  {
    id: 'date-input',
    name: 'DateInput',
    figma: 'Date input, 5 variants + popup_date',
    description:
      '날짜 또는 기간을 YYYY.MM.DD 형식으로 입력합니다. 직접 입력하거나 달력(popup_date)에서 고릅니다. 기간은 "YYYY.MM.DD ~ YYYY.MM.DD"로 두 날짜를 차례로 고르면 닫힙니다. ↓ 키로 달력을 열고 Esc로 닫습니다.',
    Preview: function DateInputPreview() {
      const [one, setOne] = useState<Date | null>(new Date());
      const [range, setRange] = useState<DateRange>([null, null]);
      return (
        <>
          <Stage label="mode=single · mode=range">
            <div className="flex flex-col gap-1">
              <DateInput label="시작일" value={one} onChange={setOne} />
              <Value>{formatYmd(one) || '—'}</Value>
            </div>
            <div className="flex flex-col gap-1">
              <DateInput label="조회 기간" mode="range" value={range} onChange={setRange} />
              <Value>{formatYmdRange(range) || '—'}</Value>
            </div>
          </Stage>
          <Stage label="status: enabled · error · text(plain) · over(disabled)">
            <DateInput aria-label="날짜" />
            <DateInput aria-label="날짜" error="error text" defaultValue={new Date()} />
            <DateInput aria-label="날짜" plain mode="range" defaultValue={[new Date(2023, 4, 1), new Date(2023, 4, 31)]} />
            <DateInput aria-label="날짜" disabled mode="range" />
          </Stage>
          <Stage label="minDate/maxDate + 주말 비활성 + 요일 머리글">
            <DateInput
              aria-label="예약일"
              minDate={new Date()}
              maxDate={d(new Date(), 60)}
              isDateDisabled={(x) => x.getDay() === 0 || x.getDay() === 6}
              weekdays
            />
          </Stage>
        </>
      );
    },
    code: `const [date, setDate] = useState<Date | null>(null);
<DateInput label="시작일" value={date} onChange={setDate} />

const [range, setRange] = useState<DateRange>([null, null]);
<DateInput label="조회 기간" mode="range" value={range} onChange={setRange} />

<DateInput error="error text" />
<DateInput plain defaultValue={new Date()} />
<DateInput disabled />`,
    props: [
      { name: 'mode', type: "'single' | 'range'", defaultValue: "'single'", description: '단일 날짜 또는 기간.' },
      { name: 'value / defaultValue', type: 'Date | null  ·  [Date | null, Date | null]', description: '선택값(제어/비제어). range는 두 날짜를 다 고른 뒤에 onChange가 불립니다.' },
      { name: 'onChange', type: '(value) => void', description: '값이 바뀔 때. 입력창에서 지우면 null / [null, null].' },
      { name: 'label', type: 'ReactNode', description: 'Figma ♦ label. 위 8px 라벨.' },
      { name: 'placeholder', type: 'string', defaultValue: "'YYYY.MM.DD'", description: 'range 기본값은 "YYYY.MM.DD ~ YYYY.MM.DD".' },
      { name: 'error', type: 'boolean | string', description: 'status=error. 문자열이면 아래 오류 문구.' },
      { name: 'plain', type: 'boolean', defaultValue: 'false', description: 'status=text. 테두리 없는 읽기 전용, 달력 안 열림.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'status=over 모양(bg neutral-20, 60%)으로 비활성.' },
      { name: 'editable', type: 'boolean', defaultValue: 'true', description: 'false면 키보드 입력 없이 달력으로만 선택.' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean · (open) => void', description: '달력 열림 제어.' },
      { name: 'popupAlign', type: "'left' | 'right'", defaultValue: "'left'", description: '달력 팝업 정렬.' },
      ...PICKER_LIMITS,
      CLASS,
    ],
  },
  {
    id: 'date-picker',
    name: 'DatePicker',
    figma: 'popup_date (type=date|month|year), element/date, element/title_date, element/highlight',
    description:
      '달력 팝업 본체입니다. 제목을 누르면 월 → 연도 화면으로 올라가고, 고르면 다시 내려옵니다. 오늘은 테두리 원, 선택일은 채운 원, 기간 사이는 회색 띠로 표시합니다. 방향키로 날짜를 옮기고 Enter로 고르며, PageUp/PageDown으로 달을 넘깁니다.',
    Preview: function DatePickerPreview() {
      const [one, setOne] = useState<Date | null>(new Date());
      const [range, setRange] = useState<DateRange>([d(new Date(), -3), d(new Date(), 4)]);
      const [month, setMonth] = useState(new Date());
      return (
        <>
          <Stage label="type=date · single / range">
            <div className="flex flex-col gap-1">
              <DatePicker value={one} onChange={setOne} />
              <Value>{formatYmd(one)}</Value>
            </div>
            <div className="flex flex-col gap-1">
              <DatePicker mode="range" value={range} onChange={setRange} weekdays />
              <Value>{formatYmdRange(range)}</Value>
            </div>
          </Stage>
          <Stage label="type=month · type=year (그 화면에서 멈춤)">
            <DatePicker type="month" month={month} onMonthChange={setMonth} />
            <DatePicker type="year" month={month} onMonthChange={setMonth} />
            <Value>{`${month.getFullYear()}.${String(month.getMonth() + 1).padStart(2, '0')}`}</Value>
          </Stage>
        </>
      );
    },
    code: `<DatePicker value={date} onChange={setDate} />
<DatePicker mode="range" value={range} onChange={setRange} weekdays />
<DatePicker type="month" month={month} onMonthChange={setMonth} />
<DatePicker type="year" month={month} onMonthChange={setMonth} />`,
    props: [
      { name: 'type', type: "'date' | 'month' | 'year'", defaultValue: "'date'", description: 'Figma popup_date type. 처음 화면이자 내려오는 마지막 화면.' },
      { name: 'mode', type: "'single' | 'range'", defaultValue: "'single'", description: '단일 / 기간 선택. 기간은 첫 클릭 [시작, null], 두 번째 클릭 [시작, 끝].' },
      { name: 'value / defaultValue / onChange', type: 'Date | null · DateRange', description: '선택값.' },
      { name: 'month / defaultMonth / onMonthChange', type: 'Date', description: '표시 중인 달(항상 1일로 전달).' },
      { name: 'yearRange', type: '[number, number]', description: '연도 목록 범위. 기본 오늘 ±10년.' },
      { name: 'monthLabels', type: 'string[]', defaultValue: 'Jan~Dec', description: '제목·월 화면 월 이름.' },
      { name: 'onClose', type: '() => void', description: 'Esc 키. 위 단계 화면에서는 먼저 원래 화면으로 돌아갑니다.' },
      { name: 'autoFocus', type: 'boolean', defaultValue: 'false', description: '마운트 시 현재 날짜 칸으로 포커스.' },
      ...PICKER_LIMITS,
      CLASS,
    ],
  },
  {
    id: 'month-picker',
    name: 'MonthPicker',
    figma: 'popup_date (flow=2), element/list_year, element/month_02',
    description: '연도를 펼쳐 월을 고르는 팝업입니다. 펼친 연도 아래 1~12월이 4열로 나옵니다. 좌우 화살표로 펼친 연도를 옮깁니다.',
    Preview: function MonthPickerPreview() {
      const [m, setM] = useState<Date | null>(new Date());
      return (
        <Stage label="flow=2">
          <MonthPicker value={m} onChange={setM} />
          <Value>{m ? `${m.getFullYear()}.${String(m.getMonth() + 1).padStart(2, '0')}` : '—'}</Value>
        </Stage>
      );
    },
    code: `<MonthPicker value={month} onChange={setMonth} />`,
    props: [
      { name: 'value / defaultValue / onChange', type: 'Date | null', description: '선택한 달(1일).' },
      { name: 'yearRange', type: '[number, number]', description: '연도 목록 범위. 기본 오늘 ±10년.' },
      { name: 'minDate / maxDate', type: 'Date', description: '범위 밖 월 비활성.' },
      { name: 'monthLabels', type: 'string[]', defaultValue: "'1'~'12'", description: '월 칸 글자.' },
      { name: 'onClose', type: '() => void', description: 'Esc 키.' },
      CLASS,
    ],
  },
  {
    id: 'date-picker-parts',
    name: 'DatePickerDay · DatePickerMonth · DatePickerYear',
    figma: 'element/date (6), element/highlight (2), element/month_02 (4), element/list_year',
    description: '달력 팝업을 이루는 칸입니다. 직접 달력을 조립할 때 씁니다. 비활성 칸은 포커스는 받지만 클릭은 무시합니다.',
    Preview: () => (
      <>
        <Stage label="element/date — default · today · selected · range · selected+highlight(start/end) · disable">
          <div className="flex">
            <DatePickerDay day={1} />
            <DatePickerDay day={2} type="today" />
            <DatePickerDay day={3} type="selected" />
            <DatePickerDay day={4} type="default" disabled />
            <DatePickerDay day={5} type="today" disabled />
          </div>
          <div className="flex">
            <DatePickerDay day={8} type="selected" highlight="start" />
            <DatePickerDay day={9} type="range" />
            <DatePickerDay day={10} type="range" />
            <DatePickerDay day={11} type="selected" highlight="end" />
          </div>
        </Stage>
        <Stage label="element/month_02 — default · selected · disabled">
          <DatePickerMonth label="1" />
          <DatePickerMonth label="2" selected />
          <DatePickerMonth label="3" disabled />
          <DatePickerMonth label="4" selected disabled />
        </Stage>
        <Stage label="element/list_year — 접힘 · 펼침">
          <div className="flex flex-col">
            <DatePickerYear label="2018" />
            <DatePickerYear label="2019" expanded />
          </div>
        </Stage>
      </>
    ),
    code: `<DatePickerDay day={6} type="today" />
<DatePickerDay day={8} type="selected" highlight="start" />
<DatePickerDay day={9} type="range" />
<DatePickerMonth label="Feb" selected />
<DatePickerYear label="2019" expanded />`,
    props: [
      { name: 'day', type: 'ReactNode', description: 'DatePickerDay 숫자.' },
      { name: 'type', type: "'default' | 'today' | 'selected' | 'range'", defaultValue: "'default'", description: 'DatePickerDay 상태(Figma type).' },
      { name: 'highlight', type: "false | 'start' | 'end'", defaultValue: 'false', description: 'selected 칸의 기간 띠 반쪽(Figma ♦ highlight).' },
      { name: 'label', type: 'ReactNode', description: 'DatePickerMonth · DatePickerYear 글자.' },
      { name: 'selected', type: 'boolean', defaultValue: 'false', description: 'DatePickerMonth 선택(neutral-70 채움).' },
      { name: 'expanded', type: 'boolean', defaultValue: 'false', description: 'DatePickerYear 펼침(neutral-20, 화살표 위).' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '투명도 40%, 클릭 무시.' },
    ],
  },
  {
    id: 'schedule-calendar',
    name: 'ScheduleCalendar',
    figma: 'calendar (weekly/monthly × default/time), element/base_calendar, element/column_calendar',
    description:
      '월 / 주 / 일 일정 달력입니다. 월 보기는 날짜 칸에 일정 줄(ScheduleItem)을, 주 보기(type=time)와 일 보기는 시간표 위에 일정 카드(CalendarEventCard)를 그립니다. 겹치는 일정은 나란히 놓고, 오늘 열은 회색으로, 현재 시각은 가로선으로 표시합니다.',
    Preview: function ScheduleCalendarPreview() {
      const events = useSampleEvents();
      const [view, setView] = useState<CalendarView>('month');
      const [picked, setPicked] = useState<string>();
      return (
        <>
          <Stage label="view 전환 (드롭다운) · 월 보기 itemStyle=dot">
            <ScheduleCalendar
              events={events}
              view={view}
              onViewChange={setView}
              type="time"
              legend={LEGEND}
              selectedEventId={picked}
              onEventClick={(e) => setPicked(e.id)}
            />
          </Stage>
          <Stage label="monthly · itemStyle=fill">
            <ScheduleCalendar events={events} itemStyle="fill" viewSelect={false} legend={LEGEND} />
          </Stage>
          <Stage label="weekly · type=default">
            <ScheduleCalendar events={events} defaultView="week" type="default" viewSelect={false} />
          </Stage>
          <Stage label="daily (시간표 1열)">
            <ScheduleCalendar events={events} defaultView="day" todayButton={false} viewSelect={false} className="w-[400px]" />
          </Stage>
        </>
      );
    },
    code: `const events: CalendarEvent[] = [
  { id: '1', title: 'Campaign Name', caption: 'Channel Name',
    start: new Date(2023, 4, 9, 9), end: new Date(2023, 4, 9, 11), color: 'primary' },
  { id: '2', title: 'Campaign Name', start: …, end: …, color: 'info', more: 3, thumbnail: true },
];

<ScheduleCalendar
  events={events}
  view={view}
  onViewChange={setView}
  type="time"
  legend={[{ label: 'legend 01', color: 'primary' }]}
  onEventClick={(e) => open(e.id)}
/>`,
    props: [
      { name: 'events', type: 'CalendarEvent[]', description: '{ id, title, start, end, caption?, label?, color?, allDay?, dimmed?, disabled?, thumbnail?, more?, icon? }' },
      { name: 'view / defaultView / onViewChange', type: "'month' | 'week' | 'day'", defaultValue: "'month'", description: 'Figma weekly/monthly. day는 시간표 1열.' },
      { name: 'type', type: "'default' | 'time'", defaultValue: "'default'", description: '주 보기 형태(Figma type). time = 시간표.' },
      { name: 'date / defaultDate / onDateChange', type: 'Date', description: '기준 날짜. 화살표·Today·월 칸 날짜 클릭으로 바뀝니다.' },
      { name: 'legend', type: '{ label, color }[]', description: 'Figma ♦ legend. 아래 오른쪽 범례.' },
      { name: 'todayButton', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ button_today.' },
      { name: 'viewSelect', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ dropdown (Monthly / Weekly / Daily).' },
      { name: 'itemStyle', type: "'dot' | 'fill'", defaultValue: "'dot'", description: '월·주(default) 일정 줄 모양(area_schedule style).' },
      { name: 'maxItemsPerCell', type: 'number', defaultValue: '3', description: '월 칸 최대 일정 수, 넘치면 "+N".' },
      { name: 'startHour / endHour / scrollToHour', type: 'number', defaultValue: '0 / 24 / 8', description: '시간표 범위와 처음 스크롤 위치.' },
      { name: 'bodyHeight', type: 'number', defaultValue: '436', description: '시간표 본문 높이(px).' },
      { name: 'showNow / now', type: 'boolean · Date', defaultValue: 'true', description: '현재 시각 선(element/focus_time).' },
      { name: 'selectedEventId', type: 'string', description: '선택된 카드(테두리 neutral-70).' },
      { name: 'onEventClick', type: '(event) => void', description: '일정 클릭. 있으면 일정이 버튼이 됩니다.' },
      { name: 'onDateClick', type: '(date) => void', description: '월 보기 날짜 숫자 클릭.' },
      { name: 'today / weekStartsOn', type: 'Date · 0 | 1', description: '오늘 기준일, 주 시작 요일.' },
      CLASS,
    ],
  },
  {
    id: 'schedule-item',
    name: 'ScheduleItem',
    figma: 'element/schedule, 12 variants · element/area_schedule',
    description: '월 달력 칸에 들어가는 일정 한 줄입니다. dot은 점 + 시간, fill은 색 배경입니다. 색은 ScheduleColor 토큰(primary·info·infoStrong·neutral)으로 고릅니다.',
    Preview: () => (
      <>
        <Stage label="style=dot — default · dimmed · disabled · 색 · ♦ icon · 클릭(hover 배경)">
          <ScheduleItem label="00:00 ~ 00:00" />
          <ScheduleItem label="00:00 ~ 00:00" type="dimmed" />
          <ScheduleItem label="00:00 ~ 00:00" disabled />
          <ScheduleItem label="00:00 ~ 00:00" color="primary" icon />
          <ScheduleItem label="00:00 ~ 00:00" color="info" onClick={() => {}} />
          <ScheduleItem label="00:00 ~ 00:00" color="infoStrong" onClick={() => {}} />
        </Stage>
        <Stage label="style=fill — neutral · primary · info · infoStrong · disabled · 클릭(over/pressed 음영)">
          <ScheduleItem variant="fill" label="00:00 ~ 00:00" icon />
          <ScheduleItem variant="fill" color="primary" label="00:00 ~ 00:00" />
          <ScheduleItem variant="fill" color="info" label="00:00 ~ 00:00" onClick={() => {}} />
          <ScheduleItem variant="fill" color="infoStrong" label="00:00 ~ 00:00" onClick={() => {}} />
          <ScheduleItem variant="fill" label="00:00 ~ 00:00" disabled />
        </Stage>
      </>
    ),
    code: `<ScheduleItem label="09:00 ~ 10:00" color="primary" />
<ScheduleItem variant="fill" color="info" label="09:00 ~ 10:00" icon onClick={open} />
<ScheduleItem label="09:00 ~ 10:00" type="dimmed" />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '표시 텍스트(보통 "HH:mm ~ HH:mm").' },
      { name: 'variant', type: "'dot' | 'fill'", defaultValue: "'dot'", description: 'Figma 🚫 style.' },
      { name: 'type', type: "'default' | 'dimmed'", defaultValue: "'default'", description: 'dimmed = 글자 neutral-40 (dot).' },
      { name: 'color', type: "'neutral' | 'primary' | 'info' | 'infoStrong'", defaultValue: "'neutral'", description: '점/배경 색 토큰.' },
      { name: 'icon', type: 'boolean | ReactNode', description: 'true면 alert/ic_info(♦ icon).' },
      { name: 'onClick', type: '() => void', description: '있으면 button(hover·pressed 표현).' },
      { name: 'title', type: 'string', description: '툴팁·접근성 이름.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'dot 40% / fill 배경 30%.' },
    ],
  },
  {
    id: 'calendar-event-card',
    name: 'CalendarEventCard',
    figma: 'element/weekly_item, 22 variants',
    description: '시간표 위 일정 카드입니다. length(1x·2x·5x)에 따라 제목만 / caption·제목·시간 / 썸네일까지 보여줍니다. single은 primary-15, multi는 info-20 배경이며 +N 배지를 붙일 수 있습니다.',
    Preview: () => (
      <>
        <Stage label="type=single — 1x · 2x · 5x · selected · disabled">
          <CalendarEventCard title="Campaign Name" />
          <CalendarEventCard length="2x" caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" />
          <CalendarEventCard length="5x" thumbnail caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" />
          <CalendarEventCard length="2x" selected caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" />
          <CalendarEventCard length="2x" disabled caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" />
        </Stage>
        <Stage label="type=multi — 1x · 2x · 5x(+3) · 클릭">
          <CalendarEventCard type="multi" title="Campaign Name" onClick={() => {}} />
          <CalendarEventCard type="multi" length="2x" caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" onClick={() => {}} />
          <CalendarEventCard type="multi" length="5x" thumbnail more={3} caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" onClick={() => {}} />
        </Stage>
      </>
    ),
    code: `<CalendarEventCard title="Campaign Name" />
<CalendarEventCard length="2x" caption="Channel Name" title="Campaign Name" subtitle="4:00 AM ~ 8:00 AM" />
<CalendarEventCard type="multi" length="5x" thumbnail more={3} title="Campaign Name" onClick={open} />`,
    props: [
      { name: 'title / subtitle / caption', type: 'ReactNode', description: 'Figma title · sub title · caption (♦로 켜고 끔 = 생략).' },
      { name: 'captionIcon', type: 'boolean | ReactNode', defaultValue: 'true', description: 'caption 앞 아이콘(alert/ic_info).' },
      { name: 'type', type: "'single' | 'multi'", defaultValue: "'single'", description: '배경 primary-15 / info-20.' },
      { name: 'color', type: 'ScheduleColor', description: '배경 색 직접 지정(type보다 우선).' },
      { name: 'length', type: "'1x' | '2x' | '5x'", defaultValue: "'1x'", description: '내용 구성과 기본 높이(25·59·159px). style.height로 덮어씀.' },
      { name: 'thumbnail', type: 'boolean | ReactNode', description: '5x 썸네일(107×54).' },
      { name: 'more', type: 'number', description: '"+N" 배지.' },
      { name: 'selected', type: 'boolean', defaultValue: 'false', description: '테두리 neutral-70 1.34px.' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '투명도 40%.' },
      { name: 'onClick', type: '() => void', description: '있으면 button.' },
    ],
  },
  {
    id: 'calendar-cells',
    name: 'CalendarHeaderCell · CalendarDayCell · CalendarNowIndicator',
    figma: 'element/cate_calendar (3), element/cell_calendar (7), element/time_calendar (2), element/focus_time',
    description: '일정 달력의 머리글, 날짜 칸, 현재 시각 표시입니다. ScheduleCalendar가 내부에서 쓰며, 다른 달력 레이아웃을 조립할 때 직접 쓸 수 있습니다.',
    Preview: () => (
      <>
        <Stage label="cate_calendar — default · today · none">
          <div role="row" className="flex">
            <CalendarHeaderCell label="SUN 6" className="w-[104px]" />
            <CalendarHeaderCell label="WED 9" type="today" className="w-[104px]" />
            <CalendarHeaderCell type="none" className="w-[73px]" />
          </div>
        </Stage>
        <Stage label="cell_calendar — normal · today · focused · dimmed · none">
          <div role="row" className="flex gap-px bg-neutral-20">
            {(['normal', 'today', 'focused', 'dimmed'] as const).map((s, i) => (
              <CalendarDayCell key={s} date={i + 1} status={s} className="w-[101px]">
                <ScheduleItem label="00:00 ~ 00:00" color="primary" type={s === 'dimmed' ? 'dimmed' : 'default'} />
                <ScheduleItem label="00:00 ~ 00:00" color="info" type={s === 'dimmed' ? 'dimmed' : 'default'} />
              </CalendarDayCell>
            ))}
            <CalendarDayCell type="none" className="w-[101px]" />
          </div>
        </Stage>
        <Stage label="focus_time">
          <CalendarNowIndicator label="5:00 AM" className="w-[300px]" />
        </Stage>
      </>
    ),
    code: `<CalendarHeaderCell label="WED 9" type="today" />
<CalendarDayCell date={9} status="today">
  <ScheduleItem label="09:00 ~ 10:00" color="primary" />
</CalendarDayCell>
<CalendarNowIndicator label="5:00 AM" />`,
    props: [
      { name: 'label', type: 'ReactNode', description: 'CalendarHeaderCell 글자 · CalendarNowIndicator 시각.' },
      { name: 'type (Header)', type: "'default' | 'today' | 'none'", defaultValue: "'default'", description: '머리글 상태.' },
      { name: 'type (DayCell)', type: "'none' | 'schedule'", defaultValue: "'schedule'", description: 'Figma none | num/schedule.' },
      { name: 'status', type: "'normal' | 'today' | 'focused' | 'dimmed'", defaultValue: "'normal'", description: '날짜 칸 상태.' },
      { name: 'date / showDate', type: 'ReactNode · boolean', defaultValue: '— / true', description: '날짜 숫자와 표시 여부(♦ date).' },
      { name: 'itemStyle', type: "'dot' | 'fill'", defaultValue: "'dot'", description: '일정 간격 5.36 / 2.01.' },
      { name: 'onDateClick / dateLabel', type: '() => void · string', description: '날짜 숫자를 버튼으로.' },
      { name: 'children', type: 'ReactNode', description: '칸 안 일정(ScheduleItem).' },
    ],
  },
];
