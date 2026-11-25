import { useState, type ReactNode } from 'react';
import { Button, IconDownload, IconEdit } from '../../components';
import { IconFullscreen } from '../../components/nav/icons';
import {
  Breadcrumb,
  DotIndicator,
  HeadingAction,
  HeadingMain,
  HeadingMobile,
  HeadingSub,
  MobileTitleBar,
  NavigationPanel,
  NavigationSide,
  NavListItem,
  PageIndicator,
  ScrollArea,
  SegmentedControl,
  SidebarHeader,
  StepBar,
  StepIndicator,
  StepNumber,
  StepNumberSmall,
  TabBox,
  TextTabs,
  TitleBar,
  type NavSection,
} from '../../components/nav';
import type { ComponentDoc } from '../ComponentDocs';

function Stage({ children, label, column }: { children: ReactNode; label?: string; column?: boolean }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className={column ? 'flex w-full flex-col gap-3' : 'flex flex-wrap items-center gap-4'}>{children}</div>
    </div>
  );
}

const CONTROLLED = (t = 'string') => [
  { name: 'value / defaultValue', type: t, description: '선택 값 (제어 / 비제어). 생략하면 첫 활성 항목.' },
  { name: 'onChange', type: `(value: ${t}) => void`, description: '선택이 바뀔 때.' },
];

/* ---------------------------------------------------------------------------------------------- */
const listSections: NavSection[] = [
  { id: 'all', items: [{ id: 'all', label: 'All Devices', icon: false, count: '(12)' }] },
  {
    id: 'cat',
    title: 'Category',
    divider: true,
    items: [
      {
        id: 'b1',
        label: 'Business 1',
        icon: false,
        count: '(8)',
        children: [
          {
            id: 'p1',
            label: 'Property 1',
            icon: false,
            count: '(5)',
            children: [
              { id: 'g1', label: 'Group 1', icon: false, count: '(3)' },
              { id: 'g2', label: 'Group 2', icon: false, count: '(2)' },
            ],
          },
          { id: 'p2', label: 'Property 2', icon: false, count: '(3)', children: [{ id: 'g3', label: 'Group 3', icon: false, count: '(3)' }] },
        ],
      },
      { id: 'b2', label: 'Business 2', icon: false, count: '(4)', children: [{ id: 'p3', label: 'Property 3', icon: false }] },
      { id: 'b3', label: 'Archived', icon: false, subtext: '보관된 기기', disabled: true },
    ],
  },
];

const sideSections: NavSection[] = [
  { id: 'all', items: [{ id: 'all', label: 'All Workspaces', icon: false }] },
  {
    id: 'ws',
    title: 'index',
    items: [
      { id: 'biz1', label: 'Business 01', icon: true, children: [{ id: 'w0', label: 'Workspace 0', icon: true }] },
      {
        id: 'biz2',
        label: 'Business 02',
        icon: true,
        children: [
          {
            id: 'w1',
            label: 'Workspace 1',
            icon: true,
            children: [
              { id: 'dg', label: 'Default group', icon: true },
              { id: 'ng', label: 'New group', icon: true, count: '12' },
            ],
          },
          { id: 'w2', label: 'Workspace 2', icon: true, children: [{ id: 'g9', label: 'Group 9', icon: true }] },
        ],
      },
    ],
  },
];

export const navigationDocs: ComponentDoc[] = [
  /* -------------------------------------------------------------------------------- breadcrumb */
  {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    figma: 'element/breadcrumb, 6 variants',
    description:
      '현재 화면의 위치를 상위 경로와 함께 보여 줍니다. 항목에 menu를 주면 눌렀을 때 형제 화면 목록(popup_list)이 열리고, maxItems를 넘는 중간 경로는 "…"로 접힙니다.',
    Preview: function BreadcrumbPreview() {
      const [last, setLast] = useState('Workspace 1');
      return (
        <>
          <Stage label="type=link (hover·pressed 밑줄)">
            <Breadcrumb items={[{ label: 'Home', onClick: () => {} }, { label: 'Devices', onClick: () => {} }, { label: 'Lobby-01' }]} />
            <Breadcrumb arrow={false} items={[{ label: 'Home', onClick: () => {} }, { label: 'Devices' }]} />
          </Stage>
          <Stage label="menu (pressed → popup_list)">
            <Breadcrumb
              items={[
                { label: 'Home', onClick: () => {} },
                {
                  label: last,
                  menu: ['Workspace 1', 'Workspace 2', 'Workspace 3'].map((w) => ({ value: w, label: w })),
                  onMenuSelect: setLast,
                },
                { label: 'Default group' },
              ]}
            />
          </Stage>
          <Stage label="type=overflow (maxItems=3)">
            <Breadcrumb
              maxItems={3}
              items={['Home', 'Business 02', 'Workspace 1', 'Group A', 'Lobby-01'].map((l, i, a) => ({
                label: l,
                onClick: i < a.length - 1 ? () => {} : undefined,
              }))}
            />
          </Stage>
        </>
      );
    },
    code: `<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Devices', href: '/devices' }, { label: 'Lobby-01' }]} />
<Breadcrumb maxItems={3} items={items} />
<Breadcrumb items={[{ label: 'Workspace 1', menu: [{ value: 'w2', label: 'Workspace 2' }], onMenuSelect: go }]} />`,
    props: [
      { name: 'items', type: 'BreadcrumbItem[]', description: '{ label, href?, onClick?, menu?, onMenuSelect? }. 마지막 항목은 aria-current="page".' },
      { name: 'arrow', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ arrow — 항목 사이 ic_arrow_right 11px.' },
      { name: 'maxItems', type: 'number', description: '넘으면 첫 항목과 마지막 (maxItems-1)개 사이를 "…"(type=overflow) 메뉴로 접습니다.' },
    ],
  },

  /* -------------------------------------------------------------------------------- Navigation */
  {
    id: 'navigation-panel',
    name: 'NavigationPanel',
    figma: 'Navigation, element/list_navi (30), element/list_navi_item, element/index, bottom_navi',
    description:
      '목록 화면 왼쪽에서 기기·그룹을 계층으로 거르는 내비게이션입니다. role="tree"로 ↑↓ 이동, → 펼치기, ← 접기/부모로, Enter 선택. 섹션마다 소제목(index)과 구분선을 둘 수 있고 하단 버튼은 고정됩니다.',
    Preview: function NavPanelPreview() {
      const [sel, setSel] = useState('g1');
      return (
        <>
          <Stage label="Property 1=example (search · divider · index · 3 depth · bottom_navi)">
            <div className="h-[420px]">
              <NavigationPanel
                search={{ placeholder: 'placeholder' }}
                sections={listSections}
                selectedId={sel}
                onSelect={setSel}
                defaultExpandedIds={['b1', 'p1']}
                bottomActions={[{ label: 'Button' }, { label: 'Button' }]}
              />
            </div>
            <span className="text-body-5 text-neutral-70">선택: {sel}</span>
          </Stage>
          <Stage label="element/list_navi — depth · 2 line · status">
            <div className="flex w-[280px] flex-col border border-neutral-40">
              <NavListItem label="Text" icon count="(n)" arrow="collapsed" />
              <NavListItem label="Text" icon count="(n)" depth={2} arrow="expanded" selected />
              <NavListItem label="Text" subtext="subtexts" icon count="(n)" depth={3} />
              <NavListItem label="Text" icon count="(n)" disabled />
            </div>
          </Stage>
        </>
      );
    },
    code: `<NavigationPanel
  search={{ placeholder: '검색' }}
  sections={[
    { id: 'all', items: [{ id: 'all', label: 'All Devices', count: '(12)' }] },
    { id: 'cat', title: 'Category', divider: true, items: tree },
  ]}
  selectedId={sel}
  onSelect={setSel}
  defaultExpandedIds={['b1']}
  bottomActions={[{ label: '그룹 추가', onClick: add }]}
/>`,
    props: [
      { name: 'sections', type: 'NavSection[]', description: '{ id, title?(index), divider?, items: NavTreeItem[] }.' },
      { name: 'NavTreeItem', type: '{ id, label, subtext?, icon?, count?, trailing?, children?, disabled? }', description: 'icon: true면 ic_info. count는 오른쪽 "(n)". subtext가 있으면 2 line.' },
      { name: 'selectedId / defaultSelectedId', type: 'string', description: '선택 항목 (제어 / 비제어). selected = bg neutral-20.' },
      { name: 'onSelect', type: '(id, item) => void', description: '항목 선택. 하위가 있으면 펼침/접힘도 함께 바뀝니다.' },
      { name: 'defaultExpandedIds', type: 'string[]', description: '처음 펼쳐 둘 항목.' },
      { name: 'search', type: '{ placeholder?, value?, onValueChange? }', description: '상단 검색창 (input_text h36).' },
      { name: 'bottomActions', type: '{ label, onClick?, disabled? }[]', description: 'Figma ♦ bottom_navi — 하단 고정 버튼(h20 secondary).' },
      { name: 'width', type: 'number | string', defaultValue: '214', description: '패널 폭.' },
    ],
  },
  {
    id: 'navigation-side',
    name: 'NavigationSide',
    figma: 'navigation_side, list_depth (type=icon), index',
    description:
      '워크스페이스·그룹을 고르는 사이드 탐색 패널입니다. 상단 필터(세그먼트), 검색+설정, 태그 필터(박스 탭)를 슬롯으로 넣고, 목록은 list_depth 모양의 트리로 그립니다.',
    Preview: function NavSidePreview() {
      const [sel, setSel] = useState('all');
      return (
        <Stage>
          <div className="h-[600px]">
            <NavigationSide
              filter={<SegmentedControl aria-label="연결 상태" items={[{ value: 'c', label: 'Connected' }, { value: 'a', label: 'All' }]} />}
              search={{ onSettings: () => {} }}
              tags={<TabBox aria-label="태그" items={['Tag', 'Tag ', 'Tag  ', 'Tag   ', 'Tag    '].map((t) => ({ value: t, label: t.trim() }))} />}
              sections={sideSections}
              selectedId={sel}
              onSelect={setSel}
              defaultExpandedIds={['biz2', 'w1']}
              bottomActions={[{ label: 'Button' }, { label: 'Button' }]}
            />
          </div>
        </Stage>
      );
    },
    code: `<NavigationSide
  filter={<SegmentedControl items={[{ value: 'c', label: 'Connected' }, { value: 'a', label: 'All' }]} />}
  search={{ placeholder: 'Search', onSettings: openSettings }}
  tags={<TabBox items={tags} />}
  sections={[{ id: 'ws', title: 'index', items: workspaces }]}
  selectedId={sel}
  onSelect={setSel}
/>`,
    props: [
      { name: 'filter', type: 'ReactNode', description: 'Figma filter1 — 보통 <SegmentedControl />.' },
      { name: 'search', type: '{ placeholder?, value?, onValueChange?, onSettings? }', description: '검색 줄. onSettings가 있으면 오른쪽 설정 버튼(h24).' },
      { name: 'tags', type: 'ReactNode', description: 'Figma filter2 — 보통 <TabBox />.' },
      { name: 'sections / selectedId / onSelect / defaultExpandedIds', type: '—', description: 'NavigationPanel과 같습니다. 행은 list_depth(h28, 아이콘 16).' },
      { name: 'bottomActions', type: '{ label, onClick? }[]', description: 'Figma bottom2 — 하단 버튼.' },
      { name: 'width', type: 'number | string', defaultValue: '220', description: '패널 폭.' },
    ],
  },

  /* -------------------------------------------------------------------------------- tabs */
  {
    id: 'tab-box',
    name: 'TabBox · SegmentedControl',
    figma: 'tab_group_box, tab_group_segment, element/tab_segment (4)',
    description:
      'TabBox는 떨어진 상자(gap 6)로 된 탭(role="tablist"), SegmentedControl은 붙은 칸으로 하나의 값을 고르는 선택기(role="radiogroup")입니다. 둘 다 ←→ Home End로 이동하며 바로 선택됩니다.',
    Preview: function TabBoxPreview() {
      const items = [
        { value: 'a', label: 'TextText', icon: true },
        { value: 'b', label: 'TextText', icon: true, badge: true },
        { value: 'c', label: 'TextText', icon: true, count: '(3)' },
        { value: 'd', label: 'TextText', icon: true, disabled: true },
      ];
      return (
        <>
          <Stage label="tab_group_box (icon=on)">
            <TabBox aria-label="보기" items={items} />
          </Stage>
          <Stage label="tab_group_segment (icon=off)">
            <SegmentedControl aria-label="기간" items={['1일', '1주', '1개월', '3개월', '1년'].map((v) => ({ value: v, label: v }))} defaultValue="1주" />
          </Stage>
        </>
      );
    },
    code: `<TabBox aria-label="보기" items={[{ value: 'a', label: '전체', icon: true }, { value: 'b', label: '알림', badge: true, count: '(3)' }]} />
<SegmentedControl aria-label="기간" value={range} onChange={setRange} items={[{ value: 'd', label: '1일' }, { value: 'w', label: '1주' }]} />`,
    props: [
      { name: 'items', type: 'TabSegmentItem[]', description: '{ value, label?, ariaLabel?, icon?, badge?, count?, disabled? }. icon: true면 ic_add.' },
      ...CONTROLLED(),
      { name: 'aria-label', type: 'string', description: '그룹 이름 (권장).' },
    ],
  },
  {
    id: 'text-tabs',
    name: 'TextTabs',
    figma: 'element/tab_text (2), tab_group_divider/Default',
    description: '밑줄·배경 없이 글자 굵기로 선택을 표시하는 가벼운 탭입니다. 탭 사이에 세로 구분선을 둡니다(divider). 표 위 필터 전환처럼 좁은 곳에 씁니다.',
    Preview: () => (
      <>
        <Stage label="tab_group_divider/Default">
          <TextTabs aria-label="정렬" items={['Text', 'Text ', 'Text  ', 'Text   '].map((t) => ({ value: t, label: t.trim() }))} />
        </Stage>
        <Stage label="divider=false">
          <TextTabs aria-label="필터" divider={false} items={[{ value: 'all', label: '전체' }, { value: 'on', label: '온라인' }, { value: 'off', label: '오프라인', disabled: true }]} />
        </Stage>
      </>
    ),
    code: `<TextTabs aria-label="필터" items={[{ value: 'all', label: '전체' }, { value: 'on', label: '온라인' }]} value={f} onChange={setF} />`,
    props: [
      { name: 'items', type: '{ value, label, disabled? }[]', description: '탭 목록.' },
      ...CONTROLLED(),
      { name: 'divider', type: 'boolean', defaultValue: 'true', description: '탭 사이 세로선 1×11 neutral-40.' },
    ],
  },

  /* -------------------------------------------------------------------------------- steps */
  {
    id: 'step-indicator',
    name: 'StepIndicator',
    figma: 'step type 01 (9), element/number_large_step (4)',
    description:
      '마법사·온보딩의 진행 단계를 번호 원과 연결선으로 보여 줍니다. 완료·현재 단계는 채운 원(active), 이후 단계는 회색 원(default)입니다. 현재 단계에 aria-current="step".',
    Preview: () => (
      <>
        <Stage label="3 step · current=0">
          <StepIndicator steps={['text', 'text', 'text']} current={0} />
        </Stage>
        <Stage label="5 step · current=2 (완료 2개)">
          <StepIndicator steps={['계정', '기기', '그룹', '확인', '완료']} current={2} />
        </Stage>
        <Stage label="element/number_large_step">
          <StepNumber number={1} state="active" />
          <StepNumber number={1} />
          <span className="pb-8">
            <StepNumber number={2} state="active" label="text" />
          </span>
        </Stage>
      </>
    ),
    code: `<StepIndicator steps={['계정', '기기', '그룹', '확인']} current={1} />
<StepIndicator steps={labels} current={step} showLabel={false} />`,
    props: [
      { name: 'steps', type: 'ReactNode[]', description: '단계 라벨 (2 ~ 10개 = Figma type).' },
      { name: 'current', type: 'number', description: '현재 단계 index(0부터). 이전 = completed, 이후 = upcoming.' },
      { name: 'showLabel', type: 'boolean', defaultValue: 'true', description: '원 아래 라벨(18px) 표시 (number_large_step text=true).' },
    ],
  },
  {
    id: 'step-bar',
    name: 'StepBar',
    figma: 'step type 02 (9), element/number_small_step (2)',
    description: '패널 상단에 현재 단계 이름과 설명, 오른쪽에 단계 번호들을 한 줄로 보여 주는 단계 바입니다.',
    Preview: () => (
      <>
        <Stage column label="4 step · current=0">
          <StepBar total={4} current={0} description="Text Text Text Text Text" />
        </Stage>
        <Stage column label="10 step · current=6">
          <StepBar total={10} current={6} description="그룹에 넣을 기기를 고르세요." />
        </Stage>
        <Stage label="element/number_small_step">
          <StepNumberSmall number={1} status="active" />
          <StepNumberSmall number={2} />
        </Stage>
      </>
    ),
    code: `<StepBar total={4} current={1} description="그룹에 넣을 기기를 고르세요." />`,
    props: [
      { name: 'total', type: 'number', description: '단계 수 (2 ~ 10 = Figma type).' },
      { name: 'current', type: 'number', description: '현재 단계 index(0부터). 해당 번호만 active.' },
      { name: 'description', type: 'ReactNode', description: '현재 단계 설명(12px Medium).' },
      { name: 'stepLabel', type: 'ReactNode', defaultValue: '`Step ${current+1}.`', description: '앞쪽 굵은 문구.' },
    ],
  },

  /* -------------------------------------------------------------------------------- indicators */
  {
    id: 'dot-indicator',
    name: 'DotIndicator',
    figma: 'element/dot indicator (9), element/dot_pagination (2), bottom_dot indicator',
    description:
      '캐러셀·슬라이드의 현재 위치를 점으로 표시합니다. onChange를 주면 점을 눌러(또는 ←→) 이동할 수 있는 탭 목록이 되고, framed는 흰 바탕 p8 상자(bottom_dot indicator)입니다.',
    Preview: function DotPreview() {
      const [i, setI] = useState(1);
      return (
        <>
          <Stage label="count 2 · 5 · 10 (표시 전용)">
            <DotIndicator count={2} current={1} />
            <DotIndicator count={5} current={1} />
            <DotIndicator count={10} current={1} />
          </Stage>
          <Stage label="interactive + framed (bottom_dot indicator)">
            <span className="bg-neutral-20 p-3">
              <DotIndicator count={8} current={i} onChange={setI} framed />
            </span>
            <span className="text-body-5 text-neutral-70">{i + 1} / 8</span>
          </Stage>
        </>
      );
    },
    code: `<DotIndicator count={5} current={index} />
<DotIndicator count={slides.length} current={index} onChange={setIndex} framed />`,
    props: [
      { name: 'count', type: 'number', description: '점 개수 (Figma count 2 ~ 10).' },
      { name: 'current', type: 'number', description: '현재 index(0부터). current 점 neutral-100, 나머지 neutral-40 60%.' },
      { name: 'onChange', type: '(index) => void', description: '있으면 점이 버튼(role="tab")이 됩니다. 클릭 영역 16px.' },
      { name: 'framed', type: 'boolean', defaultValue: 'false', description: 'bottom_dot indicator — bg neutral-10, p8.' },
      { name: 'getLabel', type: '(index) => string', defaultValue: '"n / 전체"', description: '점의 접근성 이름.' },
    ],
  },
  {
    id: 'page-indicator',
    name: 'PageIndicator',
    figma: 'element/page indicator (2), element/num_pagination (4)',
    description:
      '테두리·페이지 크기 선택 없이 번호 줄만 필요한 곳(카드 목록, 팝업 안)에 쓰는 페이지 이동입니다. 표 아래 전체 바는 Pagination(bottom_page indicator)을 쓰세요.',
    Preview: function PIPreview() {
      const [p, setP] = useState(2);
      const [q, setQ] = useState(12);
      return (
        <>
          <Stage label="type=5">
            <PageIndicator page={p} pageCount={23} onPageChange={setP} />
          </Stage>
          <Stage label="type=10 · double arrow off">
            <PageIndicator type={10} doubleArrow={false} page={q} pageCount={34} onPageChange={setQ} />
          </Stage>
        </>
      );
    },
    code: `<PageIndicator page={page} pageCount={23} onPageChange={setPage} />
<PageIndicator type={10} doubleArrow={false} page={page} pageCount={34} onPageChange={setPage} />`,
    props: [
      { name: 'page', type: 'number', description: '현재 페이지(1부터). selected = neutral-20 + Bold.' },
      { name: 'pageCount', type: 'number', description: '전체 페이지 수.' },
      { name: 'onPageChange', type: '(page) => void', description: '페이지 이동.' },
      { name: 'type', type: '5 | 10', defaultValue: '5', description: '한 번에 보이는 번호 수. 단일 화살표는 이 단위로 이동.' },
      { name: 'doubleArrow', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ double arrow — 처음/마지막 페이지 버튼.' },
    ],
  },

  /* -------------------------------------------------------------------------------- bars */
  {
    id: 'title-bar',
    name: 'TitleBar',
    figma: 'title bar, 4 types (dark | light | lgbc | app)',
    description:
      '앱 최상단 40px 바입니다. dark/light는 웹 앱(세션 타이머·알림·계정·솔루션), lgbc는 가운데 대표 메뉴가 있는 포털, app은 데스크톱 창(최소화·최대화·닫기)입니다.',
    Preview: () => (
      <>
        <Stage column label="type=dark (timeout)">
          <TitleBar type="dark" appTitle="LG Business Cloud" onToggleSidebar={() => {}} timeout={{ remaining: '00:00', onExtend: () => {} }} />
        </Stage>
        <Stage column label="type=light (subtitle · biz button · support)">
          <TitleBar
            type="light"
            appTitle="LG Business Cloud"
            subtitle="Subtitle"
            onToggleSidebar={() => {}}
            bizButton={{ label: 'Business' }}
            timeout={{ remaining: '59:12', onExtend: () => {} }}
            support={{ label: 'Support' }}
          />
        </Stage>
        <Stage column label="type=lgbc (menu)">
          <TitleBar
            type="lgbc"
            appTitle="LG Business Cloud"
            onToggleSidebar={() => {}}
            menu={[
              { label: 'Home', icon: true },
              { label: 'Solutions', hasSubmenu: true },
              { label: 'Use Cases', hasSubmenu: true },
              { label: 'Add-on Service' },
              { label: 'Support', hasSubmenu: true },
              { label: 'Pricing', dividerBefore: true },
              { label: 'For Developer', external: true, dividerBefore: true },
            ]}
          />
        </Stage>
        <Stage column label="type=app">
          <TitleBar type="app" appTitle="LG Business Cloud" brandIcon />
        </Stage>
      </>
    ),
    code: `<TitleBar type="dark" appTitle="LG Business Cloud" onToggleSidebar={toggle}
  timeout={{ remaining: '59:00', onExtend: extend }} />
<TitleBar type="lgbc" appTitle="LG Business Cloud" menu={[{ label: 'Home', icon: true }, { label: 'Solutions', hasSubmenu: true }]} />
<TitleBar type="app" appTitle="My App" onMinimize={min} onMaximize={max} onClose={close} />`,
    props: [
      { name: 'type', type: "'dark' | 'light' | 'lgbc' | 'app'", defaultValue: "'dark'", description: '배경·글자색과 오른쪽 구성.' },
      { name: 'appTitle / subtitle', type: 'ReactNode', description: '앱 이름(15px) / 부제(12px).' },
      { name: 'brandIcon', type: 'boolean | ReactNode', description: '앱 이름 앞 16px 아이콘. true면 ic_null.' },
      { name: 'onToggleSidebar / sidebarExpanded', type: '() => void / boolean', description: 'Figma ♦ sidebar toggle (app 제외).' },
      { name: 'timeout', type: '{ remaining, onExtend, extendLabel?, onEdit? }', description: 'Figma ♦ timeout / ♦ timeout edit — dark·light만.' },
      { name: 'bizButton / support', type: '{ label, onClick? }', description: 'Figma ♦ biz button / ♦ support.' },
      { name: 'actions', type: 'ReactNode', description: '오른쪽 아이콘 슬롯(btns). 생략하면 알림·계정·솔루션(app은 창 버튼).' },
      { name: 'menu', type: 'TitleBarMenuItem[]', description: 'lgbc 가운데 메뉴: { label, icon?, hasSubmenu?, external?, href?, onClick?, dividerBefore? }.' },
      { name: 'onMinimize / onMaximize / onClose', type: '() => void', description: 'type=app 창 버튼.' },
    ],
  },
  {
    id: 'mobile-title-bar',
    name: 'MobileTitleBar',
    figma: 'title bar-mobile (color dark | light)',
    description: '모바일 웹 상단 40px 바. 왼쪽 메뉴·앱 이름, 오른쪽 언어·로그인 아이콘(24).',
    Preview: () => (
      <Stage column>
        <div className="w-[255px]">
          <MobileTitleBar color="dark" appTitle="LG Business Cloud" onToggleSidebar={() => {}} />
        </div>
        <div className="w-[255px] ring-1 ring-neutral-20">
          <MobileTitleBar color="light" appTitle="LG Business Cloud" onToggleSidebar={() => {}} />
        </div>
      </Stage>
    ),
    code: `<MobileTitleBar color="light" appTitle="LG Business Cloud" onToggleSidebar={open} onLanguage={lang} onSignIn={signIn} />`,
    props: [
      { name: 'color', type: "'dark' | 'light'", defaultValue: "'dark'", description: 'bg neutral-70 / neutral-10.' },
      { name: 'appTitle / subtitle', type: 'ReactNode', description: '12px Medium / 8px Regular.' },
      { name: 'brandIcon', type: 'boolean | ReactNode', description: 'Figma ♦ brand icon (24).' },
      { name: 'onToggleSidebar', type: '() => void', description: 'Figma ♦ sidebar toggle — ic_menu 24.' },
      { name: 'actions', type: 'ReactNode', description: '오른쪽 group 슬롯. 생략하면 언어 + 로그인.' },
      { name: 'signInIcon', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ sign-in icon.' },
    ],
  },
  {
    id: 'sidebar-header',
    name: 'SidebarHeader',
    figma: 'element/header (state open | close · size small | large)',
    description: '사이드바 맨 위 48px 머리. 펼침(open)이면 서비스 이름과 지역·계정 아이콘, 접힘(close)이면 메뉴 버튼만 보입니다.',
    Preview: () => (
      <>
        <Stage label="size=small · open / close">
          <SidebarHeader title="LG Business Cloud" subtitle="Portal" />
          <SidebarHeader state="close" title="LG Business Cloud" />
        </Stage>
        <Stage label="size=large · open / close">
          <SidebarHeader size="large" title="LG Business Cloud" subtitle="Portal" />
          <SidebarHeader size="large" state="close" title="LG Business Cloud" />
        </Stage>
      </>
    ),
    code: `<SidebarHeader title="LG Business Cloud" subtitle="Portal" onRegion={pickRegion} onProfile={openProfile} />
<SidebarHeader state="close" title="LG Business Cloud" onOpen={expand} />`,
    props: [
      { name: 'state', type: "'open' | 'close'", defaultValue: "'open'", description: '펼침/접힘.' },
      { name: 'size', type: "'small' | 'large'", defaultValue: "'small'", description: 'small 210 bg neutral-20 / large 284 bg neutral-10.' },
      { name: 'title / subtitle', type: 'ReactNode', description: '서비스 이름 / 부제.' },
      { name: 'leftIcon', type: 'ReactNode', defaultValue: 'ic_null', description: 'Figma left_icon.' },
      { name: 'icons', type: 'boolean', defaultValue: 'true', description: '지역·계정 아이콘(14).' },
      { name: 'onRegion / onProfile / onOpen', type: '() => void', description: '아이콘·메뉴 버튼 동작.' },
    ],
  },
  {
    id: 'headings',
    name: 'HeadingMain · HeadingSub · HeadingMobile',
    figma: 'headings_main, headings_sub (align-left | align-center), headings_mobile',
    description:
      '콘텐츠 영역 제목 줄입니다. HeadingMain은 화면 제목(23px)·가운데 설명·오른쪽 동작, HeadingSub는 섹션 제목(15px)과 버튼, HeadingMobile은 모바일 화면 제목입니다.',
    Preview: () => (
      <>
        <Stage column label="headings_main">
          <HeadingMain title="타이틀" description="설명문구" onAdd={() => {}} onNotification={() => {}} notificationBadge />
          <HeadingMain
            title="기기 상세"
            onBack={() => {}}
            actions={
              <>
                <HeadingAction icon={<IconFullscreen />} label="큰 썸네일" />
                <HeadingAction icon={<IconDownload />} label="모두 저장" />
                <HeadingAction icon={<IconEdit />} label="수정" />
              </>
            }
          />
        </Stage>
        <Stage column label="headings_sub — align-center / align-left">
          <HeadingSub
            type="align-center"
            title="텍스트"
            actions={
              <>
                <Button variant="text" height="h26" icon={<IconFullscreen />} label="큰 썸네일" />
                <Button height="h26" label="전체 삭제" />
              </>
            }
          />
          <HeadingSub title="텍스트" actions={<Button height="h26" label="전체 삭제" />} />
        </Stage>
        <Stage column label="headings_mobile">
          <div className="w-[360px]">
            <HeadingMobile
              title="타이틀"
              actions={
                <>
                  <Button height="h26" label="기기검색" />
                  <Button height="h26" label="취소" />
                </>
              }
            />
          </div>
        </Stage>
      </>
    ),
    code: `<HeadingMain title="기기 관리" description="등록된 기기 12대" onAdd={add} />
<HeadingSub type="align-center" title="최근 알림" actions={<Button height="h26" label="전체 삭제" />} />
<HeadingMobile title="기기" onBack={back} actions={<Button height="h26" label="검색" />} />`,
    props: [
      { name: 'title', type: 'ReactNode', description: '제목. Main/Mobile 23px(h1), Sub 15px neutral-70(h2).' },
      { name: 'onBack / avatar', type: '() => void / ReactNode', description: '제목 앞 뒤로 화살표·아바타 28 (Main·Mobile).' },
      { name: 'description', type: 'ReactNode', description: '설명 15px neutral-70 — Main은 가운데 고정.' },
      { name: 'actions', type: 'ReactNode', description: '오른쪽 버튼 영역 (HeadingAction = 아이콘24 + 12px 텍스트).' },
      { name: 'onAdd / onNotification', type: '() => void', description: 'HeadingMain의 ic_add 24 · 알림 아이콘.' },
      { name: 'type (Sub)', type: "'align-left' | 'align-center'", defaultValue: "'align-left'", description: '제목 정렬. align-center는 leading 슬롯(tabs/dropdown)을 왼쪽에 둡니다.' },
      { name: 'leading / titleIcon (Sub)', type: 'ReactNode', description: 'Figma tabs·dropdown / title icon.' },
      { name: 'as', type: "'h1' | 'h2' | 'h3' …", description: '제목 태그 수준 변경.' },
    ],
  },

  /* -------------------------------------------------------------------------------- scroll */
  {
    id: 'scroll-area',
    name: 'ScrollArea',
    figma: 'scroll bar (12: orientation × size 25|50|75% × reverse)',
    description:
      '스크롤바를 DS 모양(두께 10 중 2px 트랙 neutral-20, 썸 neutral-70 50%, 양 끝 여백 6)으로 바꾼 스크롤 영역입니다. 썸 길이·위치(size·reverse)는 브라우저가 스크롤 양에 따라 계산합니다.',
    Preview: () => (
      <>
        <Stage label="vertical · horizontal">
          <ScrollArea maxHeight={180} label="공지 목록" className="w-[220px] border border-neutral-40">
            <ul className="flex flex-col">
              {Array.from({ length: 16 }, (_, i) => (
                <li key={i} className="border-b border-neutral-20 px-2 py-1.5 text-body-4 text-neutral-70">
                  content texts {i + 1}
                </li>
              ))}
            </ul>
          </ScrollArea>
          <ScrollArea orientation="horizontal" label="가로 목록" className="w-[260px] border border-neutral-40">
            <div className="flex w-max gap-2 p-2">
              {Array.from({ length: 12 }, (_, i) => (
                <span key={i} className="inline-flex h-12 w-16 items-center justify-center bg-neutral-20 text-body-5 text-neutral-70">
                  {i + 1}
                </span>
              ))}
            </div>
          </ScrollArea>
        </Stage>
      </>
    ),
    code: `<ScrollArea maxHeight={240} label="공지 목록">{list}</ScrollArea>
<ScrollArea orientation="horizontal">{chips}</ScrollArea>`,
    props: [
      { name: 'orientation', type: "'vertical' | 'horizontal' | 'both'", defaultValue: "'vertical'", description: '스크롤 방향.' },
      { name: 'maxHeight / maxWidth', type: 'number | string', description: '최대 크기 (숫자는 px).' },
      { name: 'label', type: 'string', description: '지정하면 role="region" + tabIndex=0 — 키보드로 스크롤할 수 있습니다.' },
      { name: '...div props', type: 'HTMLAttributes<HTMLDivElement>', description: 'className, style, onScroll 등.' },
    ],
  },
];

