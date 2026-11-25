/**
 * 날짜 유틸 — 네이티브 Date만 사용합니다. 모든 계산은 로컬 시간 기준 "날짜(자정)" 단위입니다.
 * 표기 규칙: 화면설계서 관례 YYYY.MM.DD
 */

export type DateRange = [Date | null, Date | null];
export type WeekStart = 0 | 1;

export const pad2 = (n: number) => String(n).padStart(2, '0');

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** 월 이동. 일자는 대상 월의 마지막 날로 맞춥니다(1/31 + 1개월 = 2/28). */
export const addMonths = (d: Date, n: number) => {
  const y = d.getFullYear();
  const m = d.getMonth() + n;
  const t = new Date(y, m, 1);
  return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), daysInMonth(t.getFullYear(), t.getMonth())));
};

export const isSameDay = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export const isSameMonth = (a?: Date | null, b?: Date | null) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** 날짜 단위 비교: a < b → 음수 */
export const compareDay = (a: Date, b: Date) => startOfDay(a).getTime() - startOfDay(b).getTime();

export const startOfWeek = (d: Date, weekStartsOn: WeekStart = 0) => {
  const diff = (d.getDay() - weekStartsOn + 7) % 7;
  return addDays(startOfDay(d), -diff);
};

/** 해당 월을 덮는 주 단위 날짜 배열 (앞뒤 달 날짜 포함, 28·35·42개) */
export function monthGrid(month: Date, weekStartsOn: WeekStart = 0): Date[] {
  const first = startOfMonth(month);
  const start = startOfWeek(first, weekStartsOn);
  const total = Math.ceil(((first.getDay() - weekStartsOn + 7) % 7 + daysInMonth(first.getFullYear(), first.getMonth())) / 7) * 7;
  return Array.from({ length: total }, (_, i) => addDays(start, i));
}

/** Date → "YYYY.MM.DD" */
export const formatYmd = (d?: Date | null, sep = '.') =>
  d ? `${d.getFullYear()}${sep}${pad2(d.getMonth() + 1)}${sep}${pad2(d.getDate())}` : '';

/** "YYYY.MM.DD" (· - / 구분자, 또는 YYYYMMDD) → Date. 잘못된 날짜면 null */
export function parseYmd(text: string): Date | null {
  const m = text.trim().match(/^(\d{4})[.\-/]?\s*(\d{1,2})[.\-/]?\s*(\d{1,2})\.?$/);
  if (!m) return null;
  const [y, mo, da] = [Number(m[1]), Number(m[2]) - 1, Number(m[3])];
  const d = new Date(y, mo, da);
  return d.getFullYear() === y && d.getMonth() === mo && d.getDate() === da ? d : null;
}

/** "YYYY.MM.DD ~ YYYY.MM.DD" → DateRange. 형식이 틀리면 null */
export function parseYmdRange(text: string): DateRange | null {
  const parts = text.split('~').map((s) => s.trim());
  if (parts.length !== 2) return null;
  const a = parseYmd(parts[0]);
  const b = parseYmd(parts[1]);
  if (!a || !b) return null;
  return compareDay(a, b) <= 0 ? [a, b] : [b, a];
}

export const formatYmdRange = (r: DateRange) => (r[0] || r[1] ? `${formatYmd(r[0])} ~ ${formatYmd(r[1])}` : '');

/** 24시간 "HH:mm" */
export const formatHm = (d: Date) => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

/** 12시간 "h:mm AM" (Figma 시간표 표기) */
export const formatTime12 = (d: Date) => {
  const h = d.getHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${pad2(d.getMinutes())} ${h < 12 ? 'AM' : 'PM'}`;
};

export const WEEKDAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTH_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 화면 읽기용 날짜 이름: "2023년 5월 6일 토요일" */
export const spokenDate = (d: Date) =>
  `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${'일월화수목금토'[d.getDay()]}요일`;
