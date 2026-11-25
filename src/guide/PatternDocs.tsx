import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  Button,
  Dropdown,
  IconAdd,
  IconApps,
  IconButton,
  IconDashboard,
  IconDelete,
  IconDownload,
  IconEdit,
  IconError,
  IconExport,
  IconFilter,
  IconInfo,
  IconMore,
  IconOk,
  IconSettings,
  IconTime,
  IconWarning,
  InfoTip,
  Switch,
  Tag,
  TextField,
  type Column,
} from '../components';
import { ConfirmPopup, FormRow, KeyValueList, Panel, formatDate } from '../patterns/shared';
import { ListPage, PageHeader, PageTabs, WebAppShell } from '../patterns/web-app';
import { ConsoleHeader, DashboardBody, FilterChips, GroupContainer, KpiGroup, StatPanel, StatRow, Widget, WorkspaceBar } from '../patterns/dashboard';
import { DesktopSideNav, DesktopToast, DesktopWindow, GroupedList, OnboardingLayout, SettingsCard, TabPage, ThreePane } from '../patterns/desktop';
import { CodeBlock } from './ui';

/** 1280 기준 화면을 컨테이너 폭에 맞게 축소해서 보여 줍니다. */
function ScaledFrame({ width = 1280, children, label }: { width?: number; children: ReactNode; label: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const update = () => {
      if (!outer.current || !inner.current) return;
      const s = Math.min(1, outer.current.clientWidth / width);
      setScale(s);
      setHeight(inner.current.offsetHeight * s);
    };
    update();
    const ro = new ResizeObserver(update);
    if (outer.current) ro.observe(outer.current);
    if (inner.current) ro.observe(inner.current);
    return () => ro.disconnect();
  }, [width]);

  return (
    <figure className="flex flex-col gap-2">
      <div ref={outer} className="relative w-full overflow-hidden ring-1 ring-inset ring-neutral-40" style={{ height }}>
        <div ref={inner} style={{ width, transform: `scale(${scale})`, transformOrigin: 'top left' }} className="absolute left-0 top-0">
          {children}
        </div>
      </div>
      <figcaption className="text-body-5 text-neutral-70">
        {label} (실제 {width}px, 화면에서는 {Math.round(scale * 100)}%로 축소. 모두 조작할 수 있습니다)
      </figcaption>
    </figure>
  );
}

function PatternSection({ id, title, source, children }: { id: string; title: string; source: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-36 border-t border-neutral-100 py-14 md:scroll-mt-6">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id={`${id}-title`} className="text-heading-3 text-neutral-100">
          {title}
        </h2>
        <span className="text-body-4 text-neutral-70">기준: {source}</span>
      </header>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------------- 비교 */

const compareRows = [
  ['기준 크기', '1280×720 (FHD의 2/3 축척)', '1280 고정 폭', '창 1280×720, 최대화 가능'],
  ['상단', 'title bar dark 40', 'header_console 40 + GNB 34', '커스텀 타이틀바 40 + 창 제어'],
  ['내비게이션', '좌측 사이드바 180 / 47', '상단 GNB, 사이드바 없음', '좌측 240 / 42 + 우측 패널'],
  ['페이지 제목', 'Body2 18', 'Body2 18', 'Heading3 28 + 부제'],
  ['피드백', '모달 팝업만', '정의 없음', '토스트 · 배너 · 오류 카드'],
  ['빈 상태', '문구만 "There is no item."', '회색 패널 + 설명', '아이콘 + 문구 + 버튼'],
];

export function PatternCompare() {
  return (
    <PatternSection id="patterns" title="플랫폼 비교" source="화면설계서 3종">
      <p className="max-w-2xl text-body-3 text-neutral-70">
        같은 컴포넌트를 쓰지만 플랫폼마다 골격과 피드백 방식이 다릅니다. 공통 규칙은 <code className="font-mono text-[13px]">patterns/shared</code>, 플랫폼별
        골격은 각 파일에 있습니다. 전체 규칙은 <code className="font-mono text-[13px]">src/patterns/PATTERNS.md</code>에 정리했습니다.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-100 text-body-5 text-neutral-70">
              <th className="py-2 pr-4 font-medium">항목</th>
              <th className="py-2 pr-4 font-medium">웹앱 (LCS Medical)</th>
              <th className="py-2 pr-4 font-medium">대시보드 (LGBC 3.0)</th>
              <th className="py-2 font-medium">Windows 앱 (gram Claw)</th>
            </tr>
          </thead>
          <tbody>
            {compareRows.map(([k, ...v]) => (
              <tr key={k} className="border-b border-neutral-20 align-top">
                <th scope="row" className="py-2.5 pr-4 text-body-4 font-bold text-neutral-100">
                  {k}
                </th>
                {v.map((c, i) => (
                  <td key={i} className="py-2.5 pr-4 text-body-4 text-neutral-70">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h3 className="text-body-2 font-bold text-neutral-100">세 플랫폼 공통 규칙</h3>
        <ul className="mt-3 grid gap-x-8 gap-y-2 text-body-4 text-neutral-70 md:grid-cols-2">
          <li>팝업은 왼쪽 취소(secondary), 오른쪽 실행(primary), 같은 폭</li>
          <li>비활성은 투명도 40%, 필수 입력 전에는 저장·다음 비활성</li>
          <li>입력 오류는 필드 바로 아래 10px 빨간 문구</li>
          <li>표는 헤더 26 · 행 36, 체크·아이콘 열 40</li>
          <li>Primary 버튼은 회색, teal은 선택·태그·차트에만</li>
          <li>화면 UI에는 Body 스타일, Heading은 데스크톱 탭 제목만</li>
        </ul>
      </div>
    </PatternSection>
  );
}

/* ---------------------------------------------------------------- 웹앱 */

interface Device {
  id: string;
  identity: string;
  model: string;
  group: string;
  calibration: 'Passed' | 'Failed' | 'Unknown';
  updated: string;
  connected: boolean;
}

const devices: Device[] = Array.from({ length: 26 }, (_, i) => ({
  id: `d${i + 1}`,
  identity: `Radiology-${String(i + 1).padStart(2, '0')}`,
  model: ['21HQ613D', '32HQ713D', '27HJ713C'][i % 3],
  group: ['Default group', 'ER', 'Radiology A'][i % 3],
  calibration: (['Passed', 'Passed', 'Failed', 'Unknown'] as const)[i % 4],
  updated: `2025-05-${String(27 - (i % 20)).padStart(2, '0')} 1${i % 10}:${String((i * 7) % 60).padStart(2, '0')}`,
  connected: i % 7 !== 3,
}));

const statusIcon = {
  Passed: <IconOk className="size-4 text-success-60" />,
  Failed: <IconError className="size-4 text-error-60" />,
  Unknown: <IconWarning className="size-4 text-neutral-40" />,
};

const deviceColumns: Column<Device>[] = [
  { key: 'identity', header: 'Identity', width: 140, sortable: true },
  { key: 'model', header: 'Model', width: 100, sortable: true },
  { key: 'group', header: 'Group', width: 120, sortable: true },
  {
    key: 'calibration',
    header: 'Calibration',
    width: 110,
    align: 'center',
    render: (d) => (
      <span className="inline-flex items-center gap-0.5">
        {statusIcon[d.calibration]}
        {d.calibration}
      </span>
    ),
  },
  { key: 'updated', header: 'Updated time', width: 130, align: 'center', sortable: true },
  {
    key: 'go',
    header: '',
    width: 40,
    align: 'center',
    render: (d) => <IconButton label={`${d.identity} 상세`} height="h24" icon={<IconExport />} disabled={!d.connected} />,
  },
];

function WebAppDemo() {
  const [nav, setNav] = useState('devices');
  const [tab, setTab] = useState('device');
  const [confirm, setConfirm] = useState<string[] | null>(null);
  const [now, setNow] = useState(() => new Date(2025, 4, 27, 23, 55));
  return (
    <div className="relative h-[760px]">
      <WebAppShell
        appTitle="LG Calibration Studio Medical"
        session={{ remaining: '59:12', onExtend: () => undefined }}
        nav={[
          { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
          { id: 'devices', label: 'Device manager', icon: <IconApps /> },
          { id: 'calibration', label: 'Calibration studio', icon: <IconTime /> },
          { id: 'settings', label: 'Settings', icon: <IconSettings /> },
          { id: 'admin', label: 'Administration', icon: <IconInfo /> },
        ]}
        navDividerBefore={['settings']}
        activeNav={nav}
        onNavigate={setNav}
        className="h-[760px]"
      >
        <PageHeader title="Device manager" lastUpdated={formatDate.minute(now)} onRefresh={() => setNow(new Date())} />
        <PageTabs
          value={tab}
          onChange={setTab}
          items={[
            { value: 'device', label: 'Device' },
            { value: 'policy', label: 'Group policy' },
          ]}
        />
        <Panel padding="px-3 py-2" className="min-h-0 flex-1 overflow-auto">
          <ListPage
            label="Default group"
            rows={devices}
            columns={deviceColumns}
            getRowId={(d) => d.id}
            getRowLabel={(d) => d.identity}
            getSearchText={(d, f) => (f === 'model' ? d.model : f === 'identity' ? d.identity : `${d.identity} ${d.model} ${d.group}`)}
            searchFields={[
              { value: 'all', label: 'All' },
              { value: 'identity', label: 'Identity' },
              { value: 'model', label: 'Model' },
            ]}
            isRowDimmed={(d) => !d.connected}
            toolbarActions={
              <>
                <Button variant="secondary" height="h26" label="Filter" icon={<IconFilter />} />
                <IconButton label="보기 설정" height="h24" icon={<IconSettings />} />
                <Button variant="secondary" height="h26" label="Batch report" icon={<IconDownload />} />
              </>
            }
            selectionActions={(ids) => (
              <>
                <Button variant="secondary" height="h20" label="Move" icon={<IconExport />} />
                <Button variant="secondary" height="h20" label="Delete" icon={<IconDelete />} onClick={() => setConfirm(ids)} />
              </>
            )}
          />
        </Panel>
      </WebAppShell>
      <ConfirmPopup
        open={!!confirm}
        title="Delete"
        message="Do you want to delete selected item(s)?"
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => setConfirm(null)}
      />
    </div>
  );
}

export function PatternWebApp() {
  return (
    <PatternSection id="pattern-web" title="웹앱 목록 화면" source="LCS Medical Server 1.2.1">
      <p className="max-w-2xl text-body-3 text-neutral-70">
        관리 솔루션의 대표 화면입니다. 항목을 체크하면 선택 액션바가 나타나고, 검색 결과가 없으면 표 대신 "There is no item."만 남습니다. 연결이 끊긴
        디바이스 행은 흐리게 표시되고 상세 버튼이 비활성화됩니다.
      </p>
      <ScaledFrame label="WebAppShell + PageHeader + PageTabs + ListPage">
        <WebAppDemo />
      </ScaledFrame>
      <CodeBlock
        code={`<WebAppShell appTitle="…" nav={nav} activeNav={id} onNavigate={go} session={{ remaining, onExtend }}>
  <PageHeader title="Device manager" lastUpdated={formatDate.minute(now)} onRefresh={reload} />
  <PageTabs items={tabs} value={tab} onChange={setTab} />
  <Panel>
    <ListPage rows={rows} columns={columns} getRowId={…} getSearchText={…}
      toolbarActions={…} selectionActions={(ids) => …} isRowDimmed={(d) => !d.connected} />
  </Panel>
</WebAppShell>`}
      />
    </PatternSection>
  );
}

/* ---------------------------------------------------------------- 대시보드 */

const issueRows = [
  { id: 'i1', name: 'Temperature too high', device: 'Lobby-01', time: '2026-11-17 09:12:44', status: 'Unresolved' },
  { id: 'i2', name: 'No signal', device: 'Store-12', time: '2026-11-17 08:51:03', status: 'Resolved' },
  { id: 'i3', name: 'Fan error', device: 'Hall-03', time: '2026-11-16 22:10:19', status: 'Unresolved' },
];

function DashboardDemo() {
  const [ws, setWs] = useState('w1');
  const [auto, setAuto] = useState(false);
  const [interval, setIntervalV] = useState('1 min');
  const [chip, setChip] = useState('all');
  const [stamp, setStamp] = useState(() => new Date(2026, 10, 17, 9, 30, 12));
  return (
    <div className="flex min-h-[900px] flex-col">
      <ConsoleHeader
        gnb={[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'devices', label: 'Devices' },
          { id: 'data', label: 'Data', hasMenu: true },
          { id: 'content', label: 'Content', hasMenu: true },
          { id: 'rules', label: 'Rules' },
          { id: 'schedule', label: 'Schedule', hasMenu: true },
        ]}
        activeGnb="dashboard"
        businessOptions={[{ value: 'b1', label: 'Business 01' }]}
        business="b1"
      />
      <DashboardBody title="Dashboard" actions={<Button variant="secondary" height="h26" label="Dashboard Template" subtext="All Widgets" />}>
        <WorkspaceBar
          workspaces={[
            { value: 'w1', label: 'Workspace 01' },
            { value: 'w2', label: 'Workspace 02' },
          ]}
          workspace={ws}
          onWorkspaceChange={setWs}
          updatedAt={formatDate.dotSecond(stamp)}
          onRefresh={() => setStamp(new Date())}
          autoRefresh={auto}
          onAutoRefreshChange={setAuto}
          interval={interval}
          onIntervalChange={setIntervalV}
        />
        <Widget title="Connection Status">
          <StatRow>
            <StatPanel grow={1} title="Online (20)">
              <KpiGroup items={[{ label: 'Playing', value: 12, tone: 'success', onClick: () => undefined }, { label: 'Broadcasting', value: 8, tone: 'success', onClick: () => undefined }]} />
            </StatPanel>
            <StatPanel grow={2} title="Standby (47)">
              <KpiGroup
                items={[
                  { label: 'Screen Off', value: 21, tone: 'warning', onClick: () => undefined },
                  { label: 'Network Ready', value: 18, tone: 'warning', onClick: () => undefined },
                  { label: 'No Signal', value: 8, tone: 'warning', onClick: () => undefined },
                ]}
              />
            </StatPanel>
            <StatPanel grow={1} title="Offline (5)">
              <KpiGroup items={[{ label: 'Disconnected', value: 5, tone: 'error', onClick: () => undefined }]} />
            </StatPanel>
          </StatRow>
        </Widget>
        <Widget title="Issue Activity" onViewAll={() => undefined}>
          <div className="flex flex-col gap-2 pb-3">
            <FilterChips
              value={chip}
              onChange={setChip}
              items={[
                { value: 'all', label: 'All', count: 128 },
                { value: 'hw', label: 'Hardware', count: 64 },
                { value: 'sw', label: 'Software', count: 41 },
                { value: 'net', label: 'Network', count: 23 },
              ]}
            />
            <GroupContainer summary="Showing the latest 5 issues">
              <div className="w-full overflow-hidden rounded bg-neutral-10">
                <KeyValueList
                  className="p-3"
                  labelWidth={160}
                  items={issueRows.map((r) => ({
                    label: r.name,
                    value: (
                      <span className="flex items-center justify-between gap-3">
                        <span>
                          {r.device} · {r.time}
                        </span>
                        <Tag size="small" status={r.status === 'Resolved' ? 'secondary' : 'error'} label={r.status} />
                      </span>
                    ),
                  }))}
                />
              </div>
            </GroupContainer>
          </div>
        </Widget>
        <Widget title="Publish History" onViewAll={() => undefined} state="empty" emptyDescription="No content has been published in this workspace yet." />
        <Widget
          title="License Overview"
          state="no-license"
          actions={
            <>
              <Button variant="secondary" height="h26" label="Manage License" />
              <Button variant="secondary" height="h26" label="Purchase License" icon />
            </>
          }
        />
      </DashboardBody>
    </div>
  );
}

export function PatternDashboard() {
  return (
    <PatternSection id="pattern-dashboard" title="대시보드 위젯" source="LGBC 3.0 Dashboard 1.0.10">
      <p className="max-w-2xl text-body-3 text-neutral-70">
        사이드바 없이 상단 GNB와 회색 바디 위 흰 카드로 구성합니다. 위젯은 제목 + 가로 서브카드 구조이고, Data 없음과 라이선스 없음 상태를 같은 셸에서
        전환합니다. 라이선스가 없으면 헤더 버튼이 비활성화됩니다.
      </p>
      <ScaledFrame label="ConsoleHeader + DashboardBody + WorkspaceBar + Widget">
        <DashboardDemo />
      </ScaledFrame>
      <CodeBlock
        code={`<Widget title="Connection Status">
  <StatRow>
    <StatPanel title="Online (20)"><KpiGroup items={[{ label: 'Playing', value: 12, tone: 'success', onClick }]} /></StatPanel>
  </StatRow>
</Widget>
<Widget title="Publish History" onViewAll={go} state="empty" />
<Widget title="License Overview" state="no-license" actions={…} onLicense={openPortal} />`}
      />
    </PatternSection>
  );
}

/* ---------------------------------------------------------------- 데스크톱 */

function DesktopDemo() {
  const [active, setActive] = useState('settings');
  const [toast, setToast] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [notify, setNotify] = useState(true);
  return (
    <div className="relative">
      <DesktopWindow title="LG gram Claw" className="h-[720px]">
        <ThreePane
          rightTitle="워크스페이스 패널"
          right={<p className="text-body-4 text-neutral-70">워크스페이스 폴더 트리가 들어갑니다.</p>}
          left={({ collapsed, setCollapsed }) => (
            <DesktopSideNav
              collapsed={collapsed}
              onCollapsedChange={setCollapsed}
              activeId={active}
              onSelect={setActive}
              menu={[
                { id: 'new', label: '새 대화', icon: <IconAdd /> },
                { id: 'history', label: '히스토리', icon: <IconTime /> },
                { id: 'model', label: '모델', icon: <IconApps />, trailing: <Tag size="small" label="12%" /> },
                { id: 'task', label: '예약 태스크', icon: <IconDashboard /> },
              ]}
              groups={[
                { id: 'pin', label: '고정됨', items: [{ id: 'c1', label: '주간 보고서 초안' }] },
                {
                  id: 'recent',
                  label: '최근',
                  items: [
                    { id: 'c2', label: '환율 요약', meta: '16m' },
                    { id: 'c3', label: '회의록 정리', meta: '1hr' },
                  ],
                },
              ]}
              footerItem={{ id: 'settings', label: '설정', icon: <IconSettings /> }}
            />
          )}
        >
          {active === 'history' ? (
            <TabPage title="히스토리" subtitle="지난 대화 기록을 찾아보고 관리합니다.">
              <TextField className="w-full" icon placeholder="대화 검색" />
              <GroupedList
                groups={[
                  { label: '오늘', rows: [{ id: 'r1', title: '환율 요약', meta: '16m', trailing: <IconButton variant="onlyicon" height="h16" label="더보기" icon={<IconMore />} /> }] },
                  { label: '어제', rows: [{ id: 'r2', title: '회의록 정리', meta: '1days', trailing: <IconButton variant="onlyicon" height="h16" label="더보기" icon={<IconMore />} /> }] },
                ]}
              />
            </TabPage>
          ) : (
            <TabPage title="설정" subtitle="앱 동작과 알림을 설정합니다.">
              <SettingsCard title="일반" icon={<IconSettings />}>
                <FormRow layout="setting" label="테마" help="시스템 설정을 따르거나 직접 고릅니다.">
                  <Dropdown
                    className="w-[180px]"
                    defaultValue="system"
                    options={[
                      { value: 'system', label: '시스템' },
                      { value: 'light', label: '라이트' },
                      { value: 'dark', label: '다크' },
                    ]}
                  />
                </FormRow>
                <FormRow layout="setting" label="시스템 부팅 시 자동 시작" help="Windows에 로그인하면 앱을 바로 실행합니다.">
                  <Switch aria-label="자동 시작" checked={autoStart} onChange={setAutoStart} />
                </FormRow>
                <FormRow layout="setting" label="데스크톱 알림" help="앱이 백그라운드에 있을 때 작업이 끝나면 알립니다.">
                  <Switch aria-label="데스크톱 알림" checked={notify} onChange={setNotify} />
                </FormRow>
              </SettingsCard>
              <SettingsCard title="앱 정보" icon={<IconInfo />}>
                <KeyValueList items={[{ label: '버전', value: '1.0.2' }, { label: '제작', value: 'LG Electronics' }]} />
                <div className="flex gap-2">
                  <Button variant="secondary" height="h20" label="오픈 소스 라이선스 보기" />
                  <Button variant="secondary" height="h20" label="버전 정보 복사" icon={<IconEdit />} onClick={() => setToast(true)} />
                </div>
              </SettingsCard>
            </TabPage>
          )}
        </ThreePane>
      </DesktopWindow>
      {toast && (
        <DesktopToast tone="light" onClose={() => setToast(false)}>
          클립보드에 복사되었습니다.
        </DesktopToast>
      )}
    </div>
  );
}

function OnboardingDemo() {
  const [step, setStep] = useState(1);
  const [agree, setAgree] = useState(false);
  return (
    <DesktopWindow title="LG gram Claw" className="h-[620px]">
      <div className="w-full overflow-y-auto">
        <OnboardingLayout
          steps={['약관 동의', '로컬 모델', 'AI 모델', '페르소나', '완료']}
          current={step}
          title="AI 모델을 연결하세요"
          subtitle="하나 이상 선택해야 다음 단계로 넘어갈 수 있습니다."
          onPrev={step > 0 ? () => setStep((s) => s - 1) : undefined}
          onNext={() => setStep((s) => Math.min(s + 1, 4))}
          nextDisabled={!agree}
        >
          <div className="flex flex-col gap-3">
            {['Google Gemini', 'OpenAI', 'Claude'].map((p) => (
              <label key={p} className="flex items-center justify-between rounded-lg px-4 py-3 ring-1 ring-inset ring-neutral-40">
                <span className="text-body-4 text-neutral-100">{p}</span>
                <input type="checkbox" className="size-4 accent-[var(--color-primary-70)]" onChange={(e) => setAgree(e.target.checked || agree)} />
              </label>
            ))}
            <span className="flex items-center gap-1 text-body-5 text-neutral-70">
              API 키는 기기 안에만 저장됩니다 <InfoTip content="연결 테스트 후 저장됩니다." position="right" />
            </span>
          </div>
        </OnboardingLayout>
      </div>
    </DesktopWindow>
  );
}

export function PatternDesktop() {
  return (
    <PatternSection id="pattern-desktop" title="Windows 앱 창과 3단 레이아웃" source="LG gram Claw 1.0.2">
      <p className="max-w-2xl text-body-3 text-neutral-70">
        커스텀 타이틀바와 3단 레이아웃입니다. 오른쪽 패널(»)을 열면 왼쪽 패널이 자동으로 접힙니다. 왼쪽 메뉴에서 히스토리를 누르면 탭 화면이 바뀝니다.
        "버전 정보 복사"는 하단 중앙 토스트로 결과를 알립니다.
      </p>
      <ScaledFrame label="DesktopWindow + ThreePane + DesktopSideNav + TabPage">
        <DesktopDemo />
      </ScaledFrame>
      <ScaledFrame label="OnboardingLayout + Stepper (선택 전에는 다음 비활성)">
        <OnboardingDemo />
      </ScaledFrame>
    </PatternSection>
  );
}

/* ---------------------------------------------------------------- 팝업 */

export function PatternPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  return (
    <PatternSection id="pattern-popup" title="공통 팝업" source="세 화면설계서 공통">
      <p className="max-w-2xl text-body-3 text-neutral-70">
        버튼은 왼쪽 취소, 오른쪽 실행이고 같은 폭입니다. 확인 전용은 버튼 하나만 둡니다. 실제 팝업은 dim 위 정중앙에 뜨고 Esc로 닫힙니다.
      </p>
      <div className="flex flex-wrap items-start gap-6 bg-neutral-20 p-6">
        <ConfirmPopup inline open title="Delete" message="Do you want to delete selected item(s)?" confirmLabel="Delete" onCancel={() => undefined} onConfirm={() => undefined} />
        <ConfirmPopup inline open title="Inform" message={'Result\n[Succeeded / Total] : [8 / 10]'} confirmLabel="OK" single="confirm" onCancel={() => undefined} onConfirm={() => undefined} />
        <ConfirmPopup
          inline
          open
          width={360}
          title="그룹 이름 변경"
          confirmLabel="저장"
          cancelLabel="취소"
          confirmDisabled={!name.trim()}
          onCancel={() => setName('')}
          onConfirm={() => setName('')}
          message={
            <FormRow label="이름" required labelWidth={60} error={name === 'ER' ? '같은 이름의 그룹이 있습니다.' : undefined}>
              <TextField className="w-[220px]" height="h36" value={name} onValueChange={setName} placeholder="그룹 이름" />
            </FormRow>
          }
        />
      </div>
      <div>
        <Button label="실제 팝업 열기" onClick={() => setOpen(true)} />
        <ConfirmPopup
          open={open}
          title="Do you want to leave this page?"
          message="Changes you made may not be saved."
          confirmLabel="Leave"
          onCancel={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </div>
    </PatternSection>
  );
}

export const patternNav = [
  { id: 'patterns', label: '플랫폼 비교' },
  { id: 'pattern-web', label: '웹앱 목록' },
  { id: 'pattern-dashboard', label: '대시보드 위젯' },
  { id: 'pattern-desktop', label: 'Windows 앱' },
  { id: 'pattern-popup', label: '팝업' },
];
