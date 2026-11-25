import { Fragment, useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconSettings } from '../../icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { TextField } from '../TextField';
import { ScrollArea } from './ScrollArea';
import { NavTree, type NavTreeItem, type NavTreeVariant } from './NavTree';

/* ------------------------------------------------------------------------------------------------
 * 작은 조각
 * ---------------------------------------------------------------------------------------------- */
/**
 * 목록 사이 소제목.
 *   variant="list"  : Figma `element/index` (list_navi_item type=index) — p 12/8/4/8, 10px Bold primary-90
 *   variant="depth" : Figma `index` (navigation_side) — p 4/12, 9.38px Bold neutral-70 (→ Body5 10px)
 */
export function NavIndex({
  children,
  variant = 'list',
  id,
  className,
}: {
  children: ReactNode;
  variant?: NavTreeVariant;
  id?: string;
  className?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        'truncate text-body-5 font-bold',
        variant === 'list' ? 'px-2 pb-1 pt-3 text-primary-90' : 'px-3 py-1 text-neutral-70',
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface NavBottomAction {
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

/**
 * Figma: `element/list_navi_count/element/bottom_navi`
 *   하단 고정 버튼 영역 — 상단 테두리 neutral-40 · bg neutral-10 · p 6.7(→7) · gap 5.36(→5)
 *   버튼: button h20 secondary, 폭 채움
 */
export function NavigationBottom({ actions, className }: { actions: NavBottomAction[]; className?: string }) {
  return (
    <div className={cn('flex shrink-0 flex-col gap-[5px] border-t border-neutral-40 bg-neutral-10 p-[7px]', className)}>
      {actions.map((a, i) => (
        <Button key={i} variant="secondary" height="h20" label={a.label} onClick={a.onClick} disabled={a.disabled} className="w-full" />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * 공통: 섹션 + 선택 상태
 * ---------------------------------------------------------------------------------------------- */
export interface NavSection {
  id: string;
  /** 소제목 (Figma: element/index / index) */
  title?: ReactNode;
  /** 섹션 위 구분선 (Figma: list_navi_item type=divider) */
  divider?: boolean;
  items: NavTreeItem[];
}

interface SelectionProps {
  sections: NavSection[];
  selectedId?: string;
  defaultSelectedId?: string;
  onSelect?: (id: string, item: NavTreeItem) => void;
  /** 처음에 펼쳐 둘 항목 id */
  defaultExpandedIds?: string[];
}

function Sections({
  sections,
  variant,
  selectedId,
  defaultSelectedId,
  onSelect,
  defaultExpandedIds,
  navLabel,
}: SelectionProps & { variant: NavTreeVariant; navLabel: string }) {
  const baseId = useId();
  const [inner, setInner] = useState(defaultSelectedId);
  const sel = selectedId ?? inner;
  return (
    <>
      {sections.map((s, i) => {
        const titleId = `${baseId}-${s.id}`;
        return (
          <Fragment key={s.id}>
            {s.divider &&
              (variant === 'list' ? (
                <div aria-hidden className="shrink-0 px-[7px]">
                  <span className="block h-px bg-neutral-20" />
                </div>
              ) : (
                <span aria-hidden className="block h-px shrink-0 bg-neutral-40" />
              ))}
            {s.title != null && (
              <NavIndex id={titleId} variant={variant}>
                {s.title}
              </NavIndex>
            )}
            <NavTree
              items={s.items}
              variant={variant}
              selectedId={sel ?? ''}
              onSelect={(id, item) => {
                if (selectedId === undefined) setInner(id);
                onSelect?.(id, item);
              }}
              defaultExpandedIds={defaultExpandedIds}
              aria-labelledby={s.title != null ? titleId : undefined}
              aria-label={s.title == null ? (sections.length > 1 ? `${navLabel} ${i + 1}` : navLabel) : undefined}
            />
          </Fragment>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Navigation
 * ---------------------------------------------------------------------------------------------- */
export interface NavigationPanelProps extends SelectionProps {
  /** 상단 검색 (Figma: list_navi_item type=search bar — input_text h36) */
  search?: { placeholder?: string; value?: string; onValueChange?: (v: string) => void };
  /** 하단 고정 버튼 (Figma: ♦ bottom_navi) */
  bottomActions?: NavBottomAction[];
  /** 기본 214 (Figma) */
  width?: number | string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: Components / `Navigation` (Property 1 = Default | example, ♦ bottom_navi)
 *   폭 214 · 세로 p-top 12 · gap 6 · bg neutral-10 · 테두리 neutral-40 (0.67 → 1px)
 *   항목: element/list_navi_item — list(element/list_navi) · search bar(px4) · divider(px 6.7, neutral-20) · index
 *   하단: element/bottom_navi 고정 (목록이 길면 목록만 스크롤)
 */
export function NavigationPanel({
  search,
  bottomActions,
  width = 214,
  className,
  'aria-label': label = '탐색',
  ...sel
}: NavigationPanelProps) {
  return (
    <nav aria-label={label} style={{ width }} className={cn('flex h-full flex-col border border-neutral-40 bg-neutral-10', className)}>
      <ScrollArea className="flex min-h-0 flex-1 flex-col gap-1.5 pt-3">
        {search && (
          <div className="shrink-0 px-1">
            <TextField
              height="h36"
              icon
              className="w-full"
              aria-label={search.placeholder ?? '검색'}
              placeholder={search.placeholder ?? 'placeholder'}
              value={search.value}
              onValueChange={search.onValueChange}
            />
          </div>
        )}
        <Sections {...sel} variant="list" navLabel={label} />
      </ScrollArea>
      {bottomActions?.length ? <NavigationBottom actions={bottomActions} /> : null}
    </nav>
  );
}

/* ------------------------------------------------------------------------------------------------
 * navigation_side
 * ---------------------------------------------------------------------------------------------- */
export interface NavigationSideProps extends SelectionProps {
  /** 맨 위 필터 (Figma: filter1 = tab_group_segment) — <SegmentedControl />를 넣으세요 */
  filter?: ReactNode;
  /** 검색 줄 (Figma: search = input_text h36 + button_icon outlined h24) */
  search?: {
    placeholder?: string;
    value?: string;
    onValueChange?: (v: string) => void;
    /** 오른쪽 설정 버튼. 없으면 버튼을 그리지 않음 */
    onSettings?: () => void;
    settingsLabel?: string;
  };
  /** 태그 필터 (Figma: filter2 = tab_group_box) — <TabBox />를 넣으세요 */
  tags?: ReactNode;
  /** 하단 버튼 (Figma: bottom2 — button h20 secondary, p 4/0 gap4) */
  bottomActions?: NavBottomAction[];
  /** 기본 220 (Figma) */
  width?: number | string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: Components / `navigation_side`
 *   폭 220 · p4 · gap4 · r4 · bg neutral-10 · 테두리 neutral-40 (0.67 → 1px)
 *   [filter1: tab_group_segment] [search: input h36 + 설정 24] [filter2: tab_group_box]
 *   [scrl: list(list_depth type=icon, gap4) + scroll bar] [bottom: 버튼 h20 ×n]
 */
export function NavigationSide({
  filter,
  search,
  tags,
  bottomActions,
  width = 220,
  className,
  'aria-label': label = '탐색',
  ...sel
}: NavigationSideProps) {
  return (
    <nav
      aria-label={label}
      style={{ width }}
      className={cn('flex h-full flex-col gap-1 rounded-[4px] border border-neutral-40 bg-neutral-10 p-1', className)}
    >
      {filter && <div className="shrink-0">{filter}</div>}
      {search && (
        <div className="flex shrink-0 items-center gap-1">
          <TextField
            height="h36"
            icon
            className="min-w-0 flex-1"
            aria-label={search.placeholder ?? '검색'}
            placeholder={search.placeholder ?? 'Search'}
            value={search.value}
            onValueChange={search.onValueChange}
          />
          {search.onSettings && (
            <IconButton height="h24" label={search.settingsLabel ?? '설정'} icon={<IconSettings />} onClick={search.onSettings} />
          )}
        </div>
      )}
      {tags && <div className="shrink-0">{tags}</div>}
      <ScrollArea className="flex min-h-0 flex-1 flex-col gap-1">
        <Sections {...sel} variant="depth" navLabel={label} />
      </ScrollArea>
      {bottomActions?.length ? (
        <div className="flex shrink-0 flex-col gap-1 py-1">
          {bottomActions.map((a, i) => (
            <Button key={i} variant="secondary" height="h20" label={a.label} onClick={a.onClick} disabled={a.disabled} className="w-full" />
          ))}
        </div>
      ) : null}
    </nav>
  );
}
