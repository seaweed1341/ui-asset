/**
 * Windows 데스크톱 앱 패턴 — 기준: LG gram Claw v1.0.2 화면설계서
 *   기준 창 1280×720 (타이틀바 40 + 본문 680), 최대화 가능 → 메인 컬럼은 유동 폭
 *   고밀도 마우스 중심 UI: 본문 최소 10px, 행 28/41, 버튼 20/26/33
 */
import { useState, type ReactNode } from 'react';
import {
  Button,
  IconArrowDoubleLeft,
  IconArrowDoubleRight,
  IconArrowDownFill,
  IconClose,
  IconInfo,
  IconWindowMaximize,
  IconWindowMinimize,
  SideBar,
  Toast,
  type SideNavItem,
} from '../components';
import { cn } from '../lib/cn';

/* ------------------------------------------------------------------------------------------------
 * DesktopWindow — 창 셸 (P1)
 *   외곽: 직각, 그림자 없음, 1px 테두리(실측 #555555 → neutral-70 토큰)
 *   커스텀 타이틀바 `title bar` type=app: h40, bg neutral-20, p 0/16
 *     왼쪽 [앱 아이콘 16][앱 이름 15px neutral-70] / 오른쪽 gap10 [최소화][최대화][닫기] 24 (Windows 순서)
 *   Electron/Tauri 등에서는 타이틀바에 drag 영역(-webkit-app-region)을 지정, 버튼은 no-drag
 * ---------------------------------------------------------------------------------------------- */
export function DesktopWindow({
  title,
  icon,
  onMinimize,
  onMaximize,
  onClose,
  children,
  className,
}: {
  title: string;
  icon?: ReactNode;
  onMinimize?: () => void;
  onMaximize?: () => void;
  /** 온보딩 중에는 바로 닫지 말고 "나가기" 확인 팝업을 띄움 */
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}) {
  const ctrl =
    'inline-flex size-6 items-center justify-center text-neutral-70 hover:bg-neutral-40 [&>svg]:size-[18px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70 [-webkit-app-region:no-drag]';
  return (
    <div className={cn('flex flex-col overflow-hidden bg-neutral-10 ring-1 ring-neutral-70', className)}>
      <header className="flex h-10 shrink-0 select-none items-center justify-between bg-neutral-20 px-4 [-webkit-app-region:drag]">
        <div className="flex items-center gap-1">
          <span aria-hidden className="inline-flex size-4 text-neutral-70 [&>svg]:size-full">
            {icon ?? <IconInfo />}
          </span>
          <span className="text-body-3 text-neutral-70">{title}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" aria-label="최소화" onClick={onMinimize} className={ctrl}>
            <IconWindowMinimize />
          </button>
          <button type="button" aria-label="최대화" onClick={onMaximize} className={ctrl}>
            <IconWindowMaximize />
          </button>
          <button type="button" aria-label="닫기" onClick={onClose} className={ctrl}>
            <IconClose />
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * ThreePane — 3단 레이아웃 (P2)
 *   left-sidebar 240 ↔ 42(접힘) | main fill (p40, 콘텐츠 폭만 변함) | right panel 50(접힘) ↔ 320~504
 *   규칙: 우측 패널 기본 접힘. 우측 패널이 열리면 좌측 패널은 자동으로 접힘
 * ---------------------------------------------------------------------------------------------- */
export function ThreePane({
  left,
  right,
  rightTitle = '패널',
  rightWidth = 320,
  children,
}: {
  /** collapsed 상태를 받아 좌측 패널을 그림 */
  left: (state: { collapsed: boolean; setCollapsed: (c: boolean) => void }) => ReactNode;
  right?: ReactNode;
  rightTitle?: string;
  rightWidth?: number;
  children: ReactNode;
}) {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const openRight = (open: boolean) => {
    setRightOpen(open);
    if (open) setLeftCollapsed(true);
  };

  return (
    <div className="flex min-h-0 flex-1">
      <div className="border-r border-neutral-40">{left({ collapsed: leftCollapsed, setCollapsed: setLeftCollapsed })}</div>
      <main className="min-w-0 flex-1 overflow-y-auto p-10">{children}</main>
      {right && (
        <aside
          aria-label={rightTitle}
          style={{ width: rightOpen ? rightWidth : 50 }}
          className="flex shrink-0 flex-col gap-4 overflow-hidden border-l border-neutral-40 bg-neutral-10 p-4 transition-[width]"
        >
          <button
            type="button"
            aria-expanded={rightOpen}
            aria-label={rightOpen ? `${rightTitle} 닫기` : `${rightTitle} 열기`}
            onClick={() => openRight(!rightOpen)}
            className="inline-flex size-[18px] text-neutral-70 [&>svg]:size-full"
          >
            {rightOpen ? <IconArrowDoubleRight /> : <IconArrowDoubleLeft />}
          </button>
          {rightOpen && right}
        </aside>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * DesktopSideNav — 좌측 패널 (P3)
 *   element/header(메뉴 토글) → 메뉴 4개(h40, 12px) → divider → 접는 그룹(헤더 22: ▾ + 라벨 10 Bold + (N),
 *   항목 h28 12px, gap4) → 맨 아래 설정
 * ---------------------------------------------------------------------------------------------- */
export interface NavGroup {
  id: string;
  label: string;
  items: { id: string; label: string; meta?: ReactNode }[];
}

export function DesktopSideNav({
  menu,
  groups = [],
  activeId,
  onSelect,
  collapsed,
  onCollapsedChange,
  footerItem,
}: {
  menu: SideNavItem[];
  groups?: NavGroup[];
  activeId?: string;
  onSelect: (id: string) => void;
  collapsed: boolean;
  onCollapsedChange: (c: boolean) => void;
  footerItem?: SideNavItem;
}) {
  const [closed, setClosed] = useState<string[]>([]);
  return (
    <SideBar
      header
      items={menu}
      activeId={activeId}
      onSelect={onSelect}
      collapsed={collapsed}
      onCollapsedChange={onCollapsedChange}
      width={240}
      collapsedWidth={42}
      textSize="small"
      footer={
        footerItem && (
          <SideBar items={[footerItem]} activeId={activeId} onSelect={onSelect} collapsed={collapsed} width={232} collapsedWidth={34} textSize="small" className="h-auto bg-transparent [&_nav]:p-0" />
        )
      }
    >
      <span role="separator" className="my-3 block h-px bg-neutral-40" />
      {groups.map((g) => {
        const open = !closed.includes(g.id);
        return (
          <div key={g.id} className="px-2 pb-3">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setClosed((c) => (open ? [...c, g.id] : c.filter((x) => x !== g.id)))}
              className="flex h-[22px] w-full items-center gap-2 text-body-5 font-bold text-neutral-70"
            >
              <span aria-hidden className={cn('inline-flex size-3.5 transition-transform [&>svg]:size-full', !open && '-rotate-90')}>
                <IconArrowDownFill />
              </span>
              {g.label} ({g.items.length})
            </button>
            {open && (
              <ul className="mt-1 flex flex-col gap-1">
                {g.items.map((it) => (
                  <li key={it.id}>
                    <button
                      type="button"
                      aria-current={it.id === activeId ? 'page' : undefined}
                      onClick={() => onSelect(it.id)}
                      className={cn(
                        'flex h-7 w-full items-center justify-between gap-2 px-1 text-left text-body-4 text-neutral-70 hover:bg-neutral-10',
                        it.id === activeId && 'bg-neutral-10 text-neutral-100',
                      )}
                    >
                      <span className="truncate">{it.label}</span>
                      {it.meta && <span className="shrink-0 text-body-5">{it.meta}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </SideBar>
  );
}

/* ------------------------------------------------------------------------------------------------
 * TabPage — 탭 화면 (히스토리/모델/예약/설정, P7)
 *   MainContent p 56/48, gap 24, 콘텐츠 폭 764
 *   제목 Heading3 28 + 부제 Body3 15 neutral-70 (gap 8) ↔ 오른쪽 주 액션 h26 primary icon-left
 *   ※ 세 파일 중 Heading 스타일을 쓰는 유일한 화면 유형
 * ---------------------------------------------------------------------------------------------- */
export function TabPage({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-6 px-12 py-14">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-3 text-neutral-100">{title}</h1>
          {subtitle && <p className="text-body-3 text-neutral-70">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * SettingsCard — 설정 카드 (P9): r12, p18, gap12, 1px neutral-40
 *   헤더: 아이콘 24 + 18px 제목. 행은 FormRow layout="setting" 사용
 * ---------------------------------------------------------------------------------------------- */
export function SettingsCard({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section aria-label={title} className="flex flex-col gap-3 rounded-xl bg-neutral-10 p-[18px] ring-1 ring-inset ring-neutral-40">
      <h2 className="flex items-center gap-2 text-body-2 text-neutral-100">
        {icon && <span aria-hidden className="inline-flex size-6 [&>svg]:size-full">{icon}</span>}
        {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------------------------------------
 * GroupedList — 그룹 리스트 박스 (P8, 히스토리)
 *   그룹 라벨 12px → 박스(r8, 1px neutral-40) 안 행(h41, p 12/16), 행 사이 divider, 오른쪽 메타
 *   hover 시 왼쪽 체크박스·오른쪽 more 메뉴가 나타남(호출 측 trailing으로 구성)
 * ---------------------------------------------------------------------------------------------- */
export function GroupedList({
  groups,
}: {
  groups: { label: string; rows: { id: string; title: ReactNode; meta?: ReactNode; trailing?: ReactNode }[] }[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <section key={g.label} className="flex flex-col gap-2">
          <h3 className="text-body-4 text-neutral-70">{g.label}</h3>
          <ul className="divide-y divide-neutral-40 rounded-lg ring-1 ring-inset ring-neutral-40">
            {g.rows.map((r) => (
              <li key={r.id} className="group flex min-h-[41px] items-center justify-between gap-3 px-4 py-3 text-body-4 text-neutral-100 hover:bg-neutral-20">
                <span className="truncate">{r.title}</span>
                <span className="flex shrink-0 items-center gap-2 text-body-5 text-neutral-70">
                  {r.meta}
                  {r.trailing && <span className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">{r.trailing}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * OnboardingLayout — 온보딩 단계 (P13)
 *   bg neutral-20, 위 64, 블록 gap 34. 스텝(원 32, connector 34) → 제목 28 Bold + 부제 15 → 흰 카드 608(r12, p32)
 *   → 하단 [이전 text h33] ↔ [다음 primary h33 210]. 조건을 채우기 전에는 다음 비활성
 * ---------------------------------------------------------------------------------------------- */
export function OnboardingLayout({
  steps,
  current,
  title,
  subtitle,
  children,
  onPrev,
  onNext,
  nextLabel = '다음',
  nextDisabled,
}: {
  steps?: string[];
  /** 0부터 */
  current?: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onPrev?: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="flex min-h-full w-full flex-col items-center gap-[34px] bg-neutral-20 px-6 pb-10 pt-16">
      {steps && current != null && <Stepper steps={steps} current={current} />}
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-heading-3 text-neutral-100">{title}</h1>
        {subtitle && <p className="text-body-3 text-neutral-70">{subtitle}</p>}
      </div>
      <div className="w-full max-w-[608px] rounded-xl bg-neutral-10 p-8 ring-1 ring-inset ring-neutral-40">{children}</div>
      <div className={cn('flex w-full max-w-[608px] items-center', onPrev ? 'justify-between' : 'justify-end')}>
        {onPrev && <Button variant="text" label="이전" onClick={onPrev} />}
        <Button label={nextLabel} onClick={onNext} disabled={nextDisabled} className="w-[210px]" />
      </div>
    </div>
  );
}

/** 단계 표시 (DS step 대신 화면설계서가 직접 그린 형태): 완료 = 채움 + ✓, 현재/이후 = 테두리 + 숫자 */
export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol aria-label="진행 단계" className="flex items-center">
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li key={s} className="flex items-center" aria-current={now ? 'step' : undefined}>
            {i > 0 && <span aria-hidden className={cn('h-px w-[34px]', done || now ? 'bg-neutral-70' : 'bg-neutral-40')} />}
            <span
              title={s}
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-full text-body-4',
                done ? 'bg-neutral-70 text-neutral-10' : 'bg-neutral-10 text-neutral-70 ring-1 ring-inset',
                now ? 'font-bold text-neutral-100 ring-neutral-100' : !done && 'ring-neutral-40',
              )}
            >
              {done ? '✓' : i + 1}
              <span className="sr-only">{s}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------------------------------------
 * DesktopToast — 위치 규칙
 *   bottom-center : 복사 완료·연결 성공·첨부 실패 등 즉시 피드백
 *   bottom-right  : 예약 작업 결과(421×67, 성공 success / 실패 warning) + [보기] 버튼
 *   OS 알림       : 앱이 백그라운드일 때 작업 완료(설정 "데스크톱 알림", 기본 On)
 * ---------------------------------------------------------------------------------------------- */
export function DesktopToast({
  position = 'bottom-center',
  ...toast
}: Parameters<typeof Toast>[0] & { position?: 'bottom-center' | 'bottom-right' }) {
  return (
    <div className={cn('pointer-events-none absolute z-40 flex', position === 'bottom-center' ? 'inset-x-0 bottom-5 justify-center' : 'bottom-5 right-5')}>
      <Toast {...toast} className={cn('pointer-events-auto', toast.className)} />
    </div>
  );
}
