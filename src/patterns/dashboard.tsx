/**
 * 대시보드 패턴 — 기준: LGBC 3.0 Dashboard v1.0.10 화면설계서 (클라우드 포털 웹)
 *   화면 폭 1280 고정, 사이드바 없음. 위젯은 1열 전폭(1240)으로 세로 스택.
 *   접근성 400% 확대(400px)에서는 서브카드를 세로로 쌓음 → 컨테이너 폭 기준 반응형으로 구현.
 */
import type { ReactNode } from 'react';
import {
  BadgeDot,
  Button,
  Dropdown,
  EmptyState,
  HeaderIconButton,
  IconArrowRight,
  IconButton,
  IconNotification,
  IconProfile,
  IconRefresh,
  IconSettings,
  Switch,
} from '../components';
import { cn } from '../lib/cn';

/* ------------------------------------------------------------------------------------------------
 * ConsoleHeader — `header_console` (1280×74 = title bar 40 + GNB 34), bg neutral-10
 *   title bar p 4/16: "LG Business Cloud"(15px) ↔ [Business ▾] | [⏱ Extend] | [아이콘 버튼] | [프로필·알림·설정]
 *   GNB p 4/36: button h26 text × N (하위 메뉴가 있으면 icon-right ▾)
 * ---------------------------------------------------------------------------------------------- */
export interface GnbItem {
  id: string;
  label: string;
  hasMenu?: boolean;
}

export function ConsoleHeader({
  appTitle = 'LG Business Cloud',
  gnb,
  activeGnb,
  onGnb,
  businessOptions,
  business,
  onBusinessChange,
}: {
  appTitle?: string;
  gnb: GnbItem[];
  activeGnb?: string;
  onGnb?: (id: string) => void;
  businessOptions?: { value: string; label: string }[];
  business?: string;
  onBusinessChange?: (v: string) => void;
}) {
  return (
    <header className="shrink-0 bg-neutral-10 shadow-[inset_0_-1px_0_var(--color-neutral-20)]">
      <div className="flex h-10 items-center justify-between px-4 py-1">
        <span className="text-body-3 text-neutral-100">{appTitle}</span>
        <div className="flex items-center gap-2.5">
          {businessOptions && <Dropdown className="w-[108px]" value={business} onChange={onBusinessChange} options={businessOptions} />}
          <span aria-hidden className="h-3 w-px bg-neutral-40" />
          <HeaderIconButton tone="light" label="프로필" icon={<IconProfile />} />
          <HeaderIconButton tone="light" label="알림" icon={<IconNotification />} badge />
          <HeaderIconButton tone="light" label="설정" icon={<IconSettings />} />
        </div>
      </div>
      <nav aria-label="주 메뉴" className="flex h-[34px] items-center gap-1 px-9 py-1">
        {gnb.map((g) => (
          <Button
            key={g.id}
            variant="text"
            height="h26"
            label={g.label}
            icon={g.hasMenu ? <ChevronDown /> : undefined}
            iconPosition="right"
            aria-current={g.id === activeGnb ? 'page' : undefined}
            onClick={() => onGnb?.(g.id)}
            className={cn('min-w-[120px]', g.id === activeGnb && 'font-bold')}
          />
        ))}
      </nav>
    </header>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path fill="currentColor" d="M12.0001 15.7854L18.7176 9.06787L19.7783 10.1285L13.0608 16.846C12.475 17.4318 11.5252 17.4318 10.9394 16.846L4.22192 10.1285L5.28258 9.06787L12.0001 15.7854Z" />
    </svg>
  );
}

/* ------------------------------------------------------------------------------------------------
 * DashboardBody — 바디 (bg neutral-20, p 12/0/24/0)
 *   body_title h50 p 12/20: 제목 18px ↔ 오른쪽 h26 secondary 버튼(서브텍스트로 현재 값)
 *   흰 콘텐츠 카드: 좌우 여백 20 → 폭 1240, 위젯 사이 gap 8, p 12 상하. 그림자 없음
 * ---------------------------------------------------------------------------------------------- */
export function DashboardBody({ title, actions, children }: { title: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-neutral-20 pb-6 pt-3">
      <div className="flex h-[50px] items-center justify-between gap-2 px-5 py-3">
        <h1 className="text-body-2 text-neutral-100">{title}</h1>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="mx-5 flex flex-col gap-2 bg-neutral-10 py-3">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * WorkspaceBar — 범위 선택 + 갱신 (h76, p 12/24)
 *   왼쪽 "Workspace"(10) / "Workspace 01 ▾"(18)
 *   오른쪽 Last Update Time(12) + YYYY.MM.dd hh:mm:ss(10) + 새로고침 h24
 *         Auto Refresh switch(기본 OFF) + 주기 dropdown(30초/1분(기본)/5분/10분/30분)
 *   규칙: 수동 새로고침 시 자동 타이머 리셋. 마지막 선택·주기는 사용자별 저장
 * ---------------------------------------------------------------------------------------------- */
export function WorkspaceBar({
  workspaces,
  workspace,
  onWorkspaceChange,
  updatedAt,
  onRefresh,
  autoRefresh,
  onAutoRefreshChange,
  interval,
  onIntervalChange,
}: {
  workspaces: { value: string; label: string }[];
  workspace: string;
  onWorkspaceChange: (v: string) => void;
  updatedAt: string;
  onRefresh: () => void;
  autoRefresh: boolean;
  onAutoRefreshChange: (on: boolean) => void;
  interval: string;
  onIntervalChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
      <div className="flex flex-col">
        <span className="text-body-5 text-neutral-70">Workspace</span>
        <Dropdown plain={false} className="w-[200px] [&_button]:text-body-2 [&_button]:ring-0" value={workspace} onChange={onWorkspaceChange} options={workspaces} />
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <span className="text-body-4 text-neutral-100">Last Update Time</span>
          <span className="text-body-5 text-neutral-70">{updatedAt}</span>
          <IconButton label="새로고침" height="h24" icon={<IconRefresh />} onClick={onRefresh} />
        </div>
        <div className="flex items-center gap-2">
          <Switch label="Auto Refresh" checked={autoRefresh} onChange={onAutoRefreshChange} />
          <Dropdown
            className="w-[80px]"
            value={interval}
            onChange={onIntervalChange}
            disabled={!autoRefresh}
            options={['30 sec', '1 min', '5 min', '10 min', '30 min'].map((v) => ({ value: v, label: v }))}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Widget — 위젯 셸 (P1)
 *   widget_title h56 p12: 제목 15px ↔ 헤더 액션(View All = onlyicon h32 ">" / 관리 = h26 secondary)
 *   본문: 가로 서브카드(gap 12). 좌우 p12, 흰 배경, 위젯 자체 테두리 없음
 *   상태: ready | empty(There is no data.) | no-license(헤더 액션 비활성 + CPQ Portal 버튼)
 * ---------------------------------------------------------------------------------------------- */
export type WidgetState = 'ready' | 'empty' | 'no-license';

export function Widget({
  title,
  onViewAll,
  actions,
  state = 'ready',
  emptyTitle = 'There is no data.',
  emptyDescription,
  onLicense,
  children,
}: {
  title: string;
  onViewAll?: () => void;
  actions?: ReactNode;
  state?: WidgetState;
  emptyTitle?: string;
  emptyDescription?: string;
  onLicense?: () => void;
  children?: ReactNode;
}) {
  const locked = state === 'no-license';
  return (
    <section aria-label={title} className="px-3">
      <header className="flex h-14 items-center justify-between gap-2 p-3">
        <h2 className="text-body-3 text-neutral-100">{title}</h2>
        <div className={cn('flex items-center gap-2', locked && 'pointer-events-none opacity-40')} aria-disabled={locked || undefined}>
          {actions}
          {onViewAll && <IconButton variant="onlyicon" height="h32" label="View All" icon={<IconArrowRight />} onClick={onViewAll} disabled={locked} />}
        </div>
      </header>
      {state === 'ready' && children}
      {state === 'empty' && <EmptyState variant="panel" title={emptyTitle} description={emptyDescription} />}
      {locked && (
        <EmptyState
          variant="panel"
          className="bg-neutral-10 ring-1 ring-inset ring-neutral-40"
          title="This widget is not available with your current license."
          description="To use this widget, go to the portal and update your license."
          action={<Button variant="secondary" height="h26" label="CPQ Portal" icon={<IconArrowRight />} iconPosition="right" onClick={onLicense} />}
        />
      )}
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * StatPanel — 서브카드 (P2): p12, gap 8~10, bg neutral-10, r8, 1px neutral-40, 그림자 없음
 *   flex 비율로 폭 지정 (Connection Status: 도넛 208 / Online 266 / Standby 526 / Offline 180)
 * ---------------------------------------------------------------------------------------------- */
export function StatPanel({ title, grow = 1, children, className }: { title?: ReactNode; grow?: number; children: ReactNode; className?: string }) {
  return (
    <div style={{ flexGrow: grow, flexBasis: 0 }} className={cn('flex min-w-[180px] flex-col gap-2 rounded-lg bg-neutral-10 p-3 ring-1 ring-inset ring-neutral-40', className)}>
      {title && <h3 className="text-body-4 text-neutral-100">{title}</h3>}
      {children}
    </div>
  );
}

/** 위젯 본문의 가로 서브카드 줄. 좁아지면(400% 확대) 세로로 쌓임 */
export function StatRow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex flex-wrap gap-3 pb-3', className)}>{children}</div>;
}

/* ------------------------------------------------------------------------------------------------
 * KpiGroup / KpiCell — KPI 지표 셀 (P3)
 *   [● badgedot + 라벨 12] / [값 15 Bold + ">"] 세로 gap4, 셀 사이 세로 divider(1×54 neutral-40)
 *   규칙: 수량을 누르면 해당 필터가 적용된 목록 페이지로 이동
 * ---------------------------------------------------------------------------------------------- */
const dotTone = {
  success: 'bg-success-60',
  warning: 'bg-warning-60',
  error: 'bg-error-60',
  info: 'bg-info-60',
  neutral: 'bg-neutral-40',
} as const;

export interface KpiItem {
  label: string;
  value: number | string;
  tone?: keyof typeof dotTone;
  onClick?: () => void;
}

export function KpiGroup({ items }: { items: KpiItem[] }) {
  return (
    <div className="flex items-stretch">
      {items.map((it, i) => (
        <div key={it.label} className={cn('flex flex-1 flex-col gap-1 px-3 first:pl-0', i > 0 && 'border-l border-neutral-40')}>
          <span className="flex items-center gap-1 text-body-4 text-neutral-70">
            {it.tone && <span aria-hidden className={cn('size-1.5 rounded-full', dotTone[it.tone])} />}
            {it.label}
          </span>
          {it.onClick ? (
            <button type="button" onClick={it.onClick} className="inline-flex w-fit items-center gap-0.5 text-body-3 font-bold text-neutral-100 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70">
              {it.value}
              <span aria-hidden className="inline-flex size-3 [&>svg]:size-full">
                <IconArrowRight />
              </span>
            </button>
          ) : (
            <span className="text-body-3 font-bold text-neutral-100">{it.value}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * FilterChips — 필터 칩 행 (P5): button h26, 선택 = primary(neutral-70 채움), 미선택 = secondary, gap4
 *   라벨 + 카운트(Bold). 단일 선택
 * ---------------------------------------------------------------------------------------------- */
export function FilterChips({
  items,
  value,
  onChange,
  'aria-label': ariaLabel = '필터',
}: {
  items: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
  'aria-label'?: string;
}) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-1">
      {items.map((it) => {
        const on = it.value === value;
        return (
          <Button
            key={it.value}
            role="radio"
            aria-checked={on}
            variant={on ? 'primary' : 'secondary'}
            height="h26"
            onClick={() => onChange(it.value)}
          >
            {it.label}
            {it.count != null && <b className="ml-1">{it.count}</b>}
          </Button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * GroupContainer — 회색 그룹 컨테이너 (P4): bg neutral-20, r8, p 8~12, 상단 "Total NN" + 흰 카드 나열(gap12)
 * ---------------------------------------------------------------------------------------------- */
export function GroupContainer({ summary, children }: { summary?: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-3 flex flex-col gap-2 rounded-lg bg-neutral-20 p-2">
      {summary && <p className="text-body-4 text-neutral-70">{summary}</p>}
      <div className="flex flex-wrap gap-3">{children}</div>
    </div>
  );
}

/** 상태 표기 규칙: "Online (20)" — 라벨 뒤 괄호 개수 */
export function StatusCount({ label, count, tone }: { label: string; count: number; tone: keyof typeof dotTone }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-body-4 text-neutral-100">
      <BadgeDot className={dotTone[tone]} />
      {label} ({count})
    </span>
  );
}
