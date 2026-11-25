import { useState, type ReactNode } from 'react';
import {
  Button,
  DataTable,
  Divider,
  EmptyState,
  IconDashboard,
  IconInfo,
  IconSettings,
  InfoTip,
  Loading,
  Pagination,
  Popup,
  SideBar,
  Toast,
  Tooltip,
  type Column,
  type SortState,
} from '../../components';
import type { ComponentDoc } from '../ComponentDocs';

/** 이전 단계(패턴 작업)에서 만든 DS 부품의 가이드 문서 */

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

interface Row {
  id: string;
  name: string;
  model: string;
  status: string;
}
const rows: Row[] = [
  { id: '1', name: 'Lobby-01', model: '55XS4J', status: 'Online' },
  { id: '2', name: 'Store-12', model: '49XF3E', status: 'Offline' },
  { id: '3', name: 'Hall-03', model: '55XS4J', status: 'Online' },
];
const columns: Column<Row>[] = [
  { key: 'name', header: 'Device Name', sortable: true },
  { key: 'model', header: 'Model', sortable: true },
  { key: 'status', header: 'Status', align: 'center' },
];

export const coreDocs: ComponentDoc[] = [
  {
    id: 'data-table',
    name: 'DataTable',
    figma: 'element/cate_table + element/cell_table',
    description: '목록 데이터를 표로 보여 줍니다. 헤더 26, 행 36이며 체크 열과 아이콘 버튼 열은 40입니다. 정렬은 오름차순, 내림차순, 해제 순서로 바뀝니다.',
    Preview: function TablePreview() {
      const [sel, setSel] = useState<string[]>([]);
      const [sort, setSort] = useState<SortState>(null);
      const sorted = sort ? [...rows].sort((a, b) => a[sort.key as keyof Row].localeCompare(b[sort.key as keyof Row]) * (sort.direction === 'asc' ? 1 : -1)) : rows;
      return (
        <DataTable
          caption="디바이스 목록"
          columns={columns}
          rows={sorted}
          getRowId={(r) => r.id}
          getRowLabel={(r) => r.name}
          selectable
          selected={sel}
          onSelectedChange={setSel}
          sort={sort}
          onSortChange={setSort}
          isRowDimmed={(r) => r.status === 'Offline'}
        />
      );
    },
    code: `<DataTable columns={columns} rows={rows} getRowId={(r) => r.id}
  selectable selected={sel} onSelectedChange={setSel}
  sort={sort} onSortChange={setSort} maxRows={5} />`,
    props: [
      { name: 'columns', type: 'Column<T>[]', description: '{ key, header, width?, align?, sortable?, render? }' },
      { name: 'rows / getRowId', type: 'T[] / (row) => string', description: '행 데이터와 고유 id.' },
      { name: 'selectable', type: 'boolean', defaultValue: 'false', description: '첫 열 체크박스. 헤더는 부분 선택이면 indeterminate.' },
      { name: 'sort / onSortChange', type: 'SortState', description: '정렬 상태. sortable 열의 헤더를 누르면 바뀝니다.' },
      { name: 'maxRows', type: 'number', description: '위젯 표처럼 행 수 제한(LGBC: 5).' },
      { name: 'isRowDimmed', type: '(row) => boolean', description: '연결이 끊긴 항목 등을 흐리게 표시.' },
      { name: 'empty', type: 'ReactNode', description: '행이 없을 때 표 대신 보여 줄 내용.' },
    ],
  },
  {
    id: 'pagination',
    name: 'Pagination',
    figma: 'bottom_page indicator, element/num_pagination',
    description: '긴 목록을 페이지로 나눕니다. 이중 화살표는 처음과 마지막 페이지로, 단일 화살표는 10페이지씩 이동합니다.',
    Preview: function PaginationPreview() {
      const [page, setPage] = useState(3);
      const [size, setSize] = useState(10);
      return <Pagination className="w-full" page={page} pageCount={24} onPageChange={setPage} pageSize={size} onPageSizeChange={setSize} />;
    },
    code: `<Pagination page={page} pageCount={24} onPageChange={setPage}
  pageSize={size} onPageSizeChange={setSize} />`,
    props: [
      { name: 'page / pageCount', type: 'number', description: '현재 페이지(1부터)와 전체 페이지 수.' },
      { name: 'onPageChange', type: '(page) => void', description: '이동할 페이지를 받습니다.' },
      { name: 'groupSize', type: '5 | 10', defaultValue: '10', description: '한 번에 보이는 번호 수(Figma num).' },
      { name: 'pageSize / onPageSizeChange', type: 'number', description: '주면 오른쪽에 "per page" 선택이 붙습니다.' },
    ],
  },
  {
    id: 'popup',
    name: 'Popup',
    figma: 'popup = element/title_popup + element/bottom_popup',
    description: '사용자의 확인이 필요할 때 화면 정중앙에 띄웁니다. 버튼은 왼쪽 취소, 오른쪽 실행이고 같은 폭입니다. Esc나 바깥을 눌러 닫을 수 있습니다.',
    Preview: function PopupPreview() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Popup inline open onClose={() => undefined} title="Popup title" titleIcon cancel={{ label: 'Cancel', onClick: () => undefined }} confirm={{ label: 'Save', onClick: () => undefined }}>
            Do you want to save?
          </Popup>
          <Popup inline open size="large" width={340} onClose={() => undefined} title="Large title" confirm={{ label: 'OK', onClick: () => undefined }}>
            버튼이 하나면 210 폭으로 가운데에 둡니다.
          </Popup>
          <Button variant="secondary" label="팝업 열기" onClick={() => setOpen(true)} />
          <Popup open={open} onClose={() => setOpen(false)} title="Do you want to delete?" cancel={{ label: 'Cancel', onClick: () => setOpen(false) }} confirm={{ label: 'Delete', onClick: () => setOpen(false) }}>
            삭제하면 되돌릴 수 없습니다.
          </Popup>
        </>
      );
    },
    code: `<Popup open={open} onClose={close} title="Do you want to delete?"
  cancel={{ label: 'Cancel', onClick: close }}
  confirm={{ label: 'Delete', onClick: remove }}>
  삭제하면 되돌릴 수 없습니다.
</Popup>`,
    props: [
      { name: 'open / onClose', type: 'boolean / () => void', description: '열림 상태. Esc, 바깥 클릭, ×가 onClose를 부릅니다.' },
      { name: 'title / size', type: "ReactNode / 'small' | 'large'", defaultValue: "'small'", description: '제목 12px / 15px.' },
      { name: 'cancel / confirm', type: '{ label, onClick, disabled? }', description: '왼쪽 secondary / 오른쪽 primary 버튼.' },
      { name: 'footer', type: 'ReactNode', description: '버튼 영역을 직접 구성.' },
      { name: 'width', type: 'number', defaultValue: '300', description: '팝업 폭.' },
      { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'dim 없이 제자리에 그리기(문서·미리보기용).' },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    figma: 'tootip_text, 8 variants',
    description: '라벨의 뜻이나 잘린 텍스트 전문을 보여 줍니다. 마우스를 올리거나 키보드로 포커스하면 나타납니다. 정보 아이콘에는 InfoTip을 씁니다.',
    Preview: () => (
      <Stage>
        {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
          <Tooltip key={p} content={`position=${p}`} position={p}>
            <Button variant="secondary" height="h26" label={p} />
          </Tooltip>
        ))}
        <span className="inline-flex items-center gap-1 text-body-4 text-neutral-70">
          Average RTT <InfoTip content="150ms 미만 정상, 150~300 약간 지연, 300 초과 심각" />
        </span>
      </Stage>
    ),
    code: `<Tooltip content="설명" position="bottom"><Button label="…" /></Tooltip>
<InfoTip content="150ms 미만 정상" />`,
    props: [
      { name: 'content', type: 'ReactNode', description: '툴팁 내용(10px).' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'bottom'", description: '트리거 기준 위치.' },
    ],
  },
  {
    id: 'side-bar',
    name: 'SideBar',
    figma: 'side bar_open + element/list_1depth_side bar',
    description: '앱의 주 메뉴입니다. 접으면 아이콘만 남고, 접힌 상태에서는 마우스를 올리면 메뉴 이름이 보입니다.',
    Preview: function SideBarPreview() {
      const [active, setActive] = useState('dashboard');
      const [collapsed, setCollapsed] = useState(false);
      return (
        <div className="h-[260px] ring-1 ring-inset ring-neutral-40">
          <SideBar
            header
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            activeId={active}
            onSelect={setActive}
            items={[
              { id: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
              { id: 'devices', label: 'Device manager', icon: <IconInfo /> },
              { id: 'settings', label: 'Settings', icon: <IconSettings /> },
            ]}
            dividerBefore={['settings']}
          />
        </div>
      );
    },
    code: `<SideBar header items={items} activeId={id} onSelect={go}
  collapsed={collapsed} onCollapsedChange={setCollapsed}
  width={180} collapsedWidth={47} />`,
    props: [
      { name: 'items', type: 'SideNavItem[]', description: '{ id, label, icon, trailing?, disabled? }' },
      { name: 'activeId / onSelect', type: 'string / (id) => void', description: '선택 항목(흰 배경 + Bold).' },
      { name: 'collapsed / onCollapsedChange', type: 'boolean', description: '접힘 상태. header를 켜면 토글 버튼이 생깁니다.' },
      { name: 'width / collapsedWidth', type: 'number', defaultValue: '220 / 47', description: 'LCS 180/47, gram 240/42.' },
      { name: 'textSize', type: "'large' | 'small'", defaultValue: "'large'", description: '메뉴 글자 15px / 12px.' },
      { name: 'dividerBefore', type: 'string[]', description: '이 항목 앞에 구분선.' },
    ],
  },
  {
    id: 'feedback',
    name: 'Loading, Toast, EmptyState',
    figma: 'loading, toast + 화면설계서 빈 상태',
    description: '진행 중, 결과 알림, 비어 있음을 알립니다. 빈 상태는 무엇이 없는지와 다음에 할 일을 함께 적습니다.',
    Preview: () => (
      <>
        <Stage label="Loading">
          <Loading />
          <Loading size="small" label="Loading message..." />
        </Stage>
        <Stage label="Toast">
          <Toast onClose={() => undefined}>Neutral text message</Toast>
          <Toast tone="light">클립보드에 복사되었습니다.</Toast>
          <Toast tone="warning">파일을 첨부하지 못했습니다.</Toast>
        </Stage>
        <Divider />
        <div className="grid w-full gap-4">
          <EmptyState variant="panel" title="There is no data." description="No devices are currently connected to the system." />
          <EmptyState title="대화 기록이 없습니다" description="새 대화를 시작하면 여기에 표시됩니다." action={<Button height="h26" label="새 대화" icon />} />
        </div>
      </>
    ),
    code: `<Loading size="small" label="Loading message..." />
<Toast tone="light" onClose={close}>클립보드에 복사되었습니다.</Toast>
<EmptyState variant="panel" title="There is no data." description="…" />`,
    props: [
      { name: 'Loading size', type: "'large' | 'small'", defaultValue: "'large'", description: '36px + 15px / 14px + 10px.' },
      { name: 'Toast tone', type: "'neutral' | 'light' | 'warning' | 'success'", defaultValue: "'neutral'", description: 'DS 기본은 neutral, gram Claw는 light.' },
      { name: 'EmptyState variant', type: "'text' | 'panel' | 'center'", defaultValue: "'center'", description: 'LCS 문구만 / LGBC 회색 패널 / 아이콘 + 버튼.' },
    ],
  },
];
