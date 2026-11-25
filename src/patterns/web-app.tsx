/**
 * 웹앱 패턴 — 기준: LCS Medical Server 1.2.1 화면설계서 (브라우저 기반 관리 솔루션)
 *   와이어프레임 1280×720 = FHD 1920×1080의 2/3 (문서 규칙). 값은 1280 기준으로 적음.
 */
import { useMemo, useState, type ReactNode } from 'react';
import {
  Button,
  Checkbox,
  DataTable,
  Divider,
  Dropdown,
  EmptyState,
  HeaderIconButton,
  IconApps,
  IconArrowLeft,
  IconButton,
  IconMenu,
  IconNotification,
  IconProfile,
  IconRefresh,
  IconTime,
  Pagination,
  SideBar,
  Tabs,
  TextField,
  type Column,
  type SideNavItem,
  type SortState,
  type TabItem,
} from '../components';
import { cn } from '../lib/cn';

/* ------------------------------------------------------------------------------------------------
 * WebTitleBar — `title bar` type=dark
 *   h40, bg neutral-70, p 0/16. 왼쪽 [≡ 사이드바 토글][앱 이름 15px neutral-10]
 *   오른쪽 gap10: [⏱ 00:00 Extend](세션 60분, Extend 시 재시작) | [알림][계정][솔루션 모음]
 * ---------------------------------------------------------------------------------------------- */
export function WebTitleBar({
  appTitle,
  onToggleNav,
  session,
  actions,
}: {
  appTitle: string;
  onToggleNav?: () => void;
  /** 남은 세션 시간 표시 + 연장 */
  session?: { remaining: string; onExtend: () => void };
  actions?: ReactNode;
}) {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between bg-neutral-70 px-4 text-neutral-10">
      <div className="flex items-center gap-[3px]">
        {onToggleNav && <HeaderIconButton label="메뉴 열기/닫기" icon={<IconMenu />} onClick={onToggleNav} />}
        <span className="text-body-3">{appTitle}</span>
      </div>
      <div className="flex items-center gap-2.5">
        {session && (
          <div className="flex items-center gap-1.5 text-body-5">
            <span aria-hidden className="inline-flex size-3.5 [&>svg]:size-full">
              <IconTime />
            </span>
            <span aria-label="남은 세션 시간">{session.remaining}</span>
            <Button variant="secondary" height="h20" label="Extend" onClick={session.onExtend} />
          </div>
        )}
        {session && <Divider orientation="vertical" />}
        {actions ?? (
          <>
            <HeaderIconButton label="알림" icon={<IconNotification />} />
            <HeaderIconButton label="계정" icon={<IconProfile />} />
            <HeaderIconButton label="솔루션" icon={<IconApps />} />
          </>
        )}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------------------------------------
 * WebFooter — `footer` type=default (h37~40, p 0/20)
 *   왼쪽 언어 선택 / 오른쪽 Copyright + 링크(button h20 text, 사이 세로 divider)
 * ---------------------------------------------------------------------------------------------- */
export function WebFooter({
  links = ['Sitemap', 'Privacy Policy', 'Cookie Policy'],
  copyright = 'Copyright ⓒ LG Electronics. All Rights Reserved.',
}: {
  links?: string[];
  copyright?: string;
}) {
  return (
    <footer className="flex h-[37px] shrink-0 items-center justify-between border-t border-neutral-20 bg-neutral-10 px-5">
      <div className="flex items-center gap-1 text-body-5 text-neutral-70">
        <span>Language</span>
        <Dropdown className="w-[120px]" defaultValue="en" options={[{ value: 'en', label: 'English' }, { value: 'ko', label: '한국어' }]} />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-body-6 text-neutral-70">{copyright}</span>
        <div className="flex items-center">
          {links.map((l, i) => (
            <span key={l} className="flex items-center">
              {i > 0 && <Divider orientation="vertical" />}
              <Button variant="text" height="h20" label={l} />
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------------------------------------
 * WebAppShell — 앱 골격
 *   ┌ title bar 40 ───────────────────────────────────────────┐
 *   │ side bar 180(open)/47(close) │ gap32 │ content (fill) │32│
 *   │  bg neutral-20                │       │ p 12/0, gap 8  │  │
 *   └ footer 37 ──────────────────────────────────────────────┘
 * ---------------------------------------------------------------------------------------------- */
export function WebAppShell({
  appTitle,
  nav,
  navDividerBefore,
  activeNav,
  onNavigate,
  session,
  children,
  className,
}: {
  appTitle: string;
  nav: SideNavItem[];
  navDividerBefore?: string[];
  activeNav: string;
  onNavigate: (id: string) => void;
  session?: { remaining: string; onExtend: () => void };
  children: ReactNode;
  className?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={cn('flex h-full min-h-[720px] flex-col bg-neutral-10', className)}>
      <WebTitleBar appTitle={appTitle} onToggleNav={() => setCollapsed((c) => !c)} session={session} />
      <div className="flex min-h-0 flex-1 gap-8 pr-8">
        <SideBar items={nav} dividerBefore={navDividerBefore} activeId={activeNav} onSelect={onNavigate} collapsed={collapsed} width={180} collapsedWidth={47} />
        <main className="flex min-w-0 flex-1 flex-col gap-2 py-3">{children}</main>
      </div>
      <WebFooter />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * PageHeader — 페이지 헤더 행 (h37)
 *   왼쪽: [← back h32](상세 화면만) + 제목 18px(Body2) — 화면 UI는 Heading을 쓰지 않음
 *   오른쪽 gap10: "Last update time : YYYY-MM-DD HH:mm"(10px) + 새로고침 h16 (+ 페이지 액션 gap12)
 * ---------------------------------------------------------------------------------------------- */
export function PageHeader({
  title,
  onBack,
  lastUpdated,
  onRefresh,
  actions,
}: {
  title: ReactNode;
  onBack?: () => void;
  lastUpdated?: string;
  onRefresh?: () => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex min-h-[37px] items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {onBack && (
          <IconButton label="뒤로" variant="outlined" height="h32" onClick={onBack} icon={<IconArrowLeft />} />
        )}
        <h1 className="text-body-2 text-neutral-100">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        {lastUpdated && (
          <div className="flex items-center gap-2.5 text-body-5 text-neutral-70">
            <span>Last update time : {lastUpdated}</span>
            {onRefresh && <IconButton label="새로고침" height="h16" icon={<IconRefresh />} onClick={onRefresh} />}
          </div>
        )}
        {actions}
      </div>
    </div>
  );
}
/* ------------------------------------------------------------------------------------------------
 * PageTabs — 탭 행 (h32): tab_group_line h48 flex ↔ 오른쪽 페이지 액션(h26 icon-left), 그룹 사이 세로 divider
 * ---------------------------------------------------------------------------------------------- */
export function PageTabs({ items, value, onChange, actions }: { items: TabItem[]; value: string; onChange: (v: string) => void; actions?: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <Tabs items={items} value={value} onChange={onChange} height="h48" aria-label="페이지 탭" />
      {actions && <div className="flex items-center gap-2 pb-1">{actions}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * ListToolbar — 목록 툴바 (h26)
 *   왼쪽 "Total N"(10px neutral-70) ↔ 오른쪽 gap6: [검색 기준 dropdown + 검색 input h36(24)] [Filter] [⚙] [주 액션]
 *   주 액션: 기본 secondary + 아이콘 왼쪽. 추가(+ Add)만 primary
 * ---------------------------------------------------------------------------------------------- */
export function ListToolbar({
  total,
  searchFields,
  searchField,
  onSearchFieldChange,
  query,
  onQueryChange,
  actions,
}: {
  total: number;
  searchFields?: { value: string; label: string }[];
  searchField?: string;
  onSearchFieldChange?: (v: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-body-5 text-neutral-70">Total {total}</span>
      <div className="flex flex-wrap items-center gap-1.5">
        <div className="flex items-center gap-2">
          {searchFields && (
            <Dropdown className="w-[110px]" value={searchField} onChange={onSearchFieldChange} options={searchFields} />
          )}
          <TextField className="w-[220px]" height="h36" icon placeholder="Search" value={query} onValueChange={onQueryChange} clearable aria-label="검색어" />
        </div>
        {actions}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * SelectionActionBar — 선택 액션바 (로컬 `buttons/Actionbar`)
 *   항목을 1개 이상 체크했을 때만 표시. h30, r8, bg neutral-20, p 2/4, gap12
 *   [☐ Select all(부분 선택 시 indeterminate)] | "N item(s) selected" … [h20 secondary icon-left ×N]
 * ---------------------------------------------------------------------------------------------- */
export function SelectionActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onClear,
  actions,
}: {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  actions: ReactNode;
}) {
  if (selectedCount === 0) return null;
  const all = selectedCount === totalCount;
  return (
    <div role="toolbar" aria-label="선택 항목 작업" className="flex min-h-[30px] flex-wrap items-center justify-between gap-3 rounded-lg bg-neutral-20 px-1 py-0.5">
      <div className="flex items-center gap-3 pl-1">
        <Checkbox label="Select all" checked={all} indeterminate={!all} onChange={() => (all ? onClear() : onSelectAll())} />
        <Divider orientation="vertical" />
        <span className="text-body-5 text-neutral-70">{selectedCount} item(s) selected</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">{actions}</div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * ListPage — 목록 화면 템플릿 (LCS C-2)
 *   순서: 영역 라벨 → 툴바 → 액션바(선택 시) → 표 → 페이지네이션
 *   빈 상태: 표를 그리지 않고 "There is no item." 문구만. 툴바는 유지
 *   상태 기억: 정렬·페이지 크기는 호출 측에서 저장하도록 값/핸들러를 노출
 * ---------------------------------------------------------------------------------------------- */
export interface ListPageProps<T> {
  label?: ReactNode;
  rows: T[];
  columns: Column<T>[];
  getRowId: (row: T) => string;
  getRowLabel?: (row: T) => string;
  /** 검색에 쓰는 문자열 */
  getSearchText: (row: T, field: string) => string;
  searchFields?: { value: string; label: string }[];
  toolbarActions?: ReactNode;
  /** 선택한 id 목록을 받아 액션바 버튼을 그림 */
  selectionActions?: (ids: string[]) => ReactNode;
  isRowDimmed?: (row: T) => boolean;
  emptyText?: string;
  initialPageSize?: number;
}

export function ListPage<T>({
  label,
  rows,
  columns,
  getRowId,
  getRowLabel,
  getSearchText,
  searchFields,
  toolbarActions,
  selectionActions,
  isRowDimmed,
  emptyText = 'There is no item.',
  initialPageSize = 10,
}: ListPageProps<T>) {
  const [query, setQuery] = useState('');
  const [field, setField] = useState(searchFields?.[0]?.value ?? 'all');
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q ? rows.filter((r) => getSearchText(r, field).toLowerCase().includes(q)) : rows;
    if (sort) {
      const k = sort.key as keyof T;
      list = [...list].sort((a, b) => String(a[k]).localeCompare(String(b[k]), undefined, { numeric: true }) * (sort.direction === 'asc' ? 1 : -1));
    }
    return list;
  }, [rows, query, field, sort, getSearchText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const pageRows = filtered.slice((current - 1) * pageSize, current * pageSize);

  return (
    <div className="flex flex-col gap-2">
      {label && <p className="flex h-9 items-center text-body-3 text-neutral-100">{label}</p>}
      <ListToolbar
        total={filtered.length}
        searchFields={searchFields}
        searchField={field}
        onSearchFieldChange={setField}
        query={query}
        onQueryChange={(q) => {
          setQuery(q);
          setPage(1);
        }}
        actions={toolbarActions}
      />
      {selectionActions && (
        <SelectionActionBar
          selectedCount={selected.length}
          totalCount={pageRows.length}
          onSelectAll={() => setSelected(pageRows.map(getRowId))}
          onClear={() => setSelected([])}
          actions={selectionActions(selected)}
        />
      )}
      {filtered.length === 0 ? (
        <EmptyState variant="text" title={emptyText} />
      ) : (
        <>
          <DataTable
            columns={columns}
            rows={pageRows}
            getRowId={getRowId}
            getRowLabel={getRowLabel}
            selectable={!!selectionActions}
            selected={selected}
            onSelectedChange={setSelected}
            sort={sort}
            onSortChange={setSort}
            isRowDimmed={isRowDimmed}
          />
          <Pagination
            page={current}
            pageCount={pageCount}
            onPageChange={setPage}
            pageSize={pageSize}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setPage(1);
            }}
          />
        </>
      )}
    </div>
  );
}
