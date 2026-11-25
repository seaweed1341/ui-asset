import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconArrowDown, IconArrowUp, IconInfo } from '../../icons';

/* ------------------------------------------------------------------------------------------------
 * 데이터
 * ---------------------------------------------------------------------------------------------- */
export interface NavTreeItem {
  id: string;
  label: ReactNode;
  /** 두 번째 줄 (Figma list_navi: multi line=2 line, subtext 8px) — variant="list"에서만 */
  subtext?: ReactNode;
  /** 라벨 앞 아이콘 (Figma: ♦ icon + icon swap). true면 기본 ic_info */
  icon?: IconProp;
  /** 오른쪽 개수 "(n)" (Figma list_navi: right 2 = trailing_navi Sub text / list_depth: small right text) */
  count?: ReactNode;
  /** 오른쪽 추가 요소 (Figma: right 1 = trailing_navi icon | button icon | badge / list_depth: ♦ button_icon) */
  trailing?: ReactNode;
  children?: NavTreeItem[];
  disabled?: boolean;
}

/** list = `element/list_navi`(Navigation) · depth = `list_depth` type=icon(navigation_side) */
export type NavTreeVariant = 'list' | 'depth';

type ArrowState = 'expanded' | 'collapsed' | 'none';

const ArrowGlyph = ({ state }: { state: ArrowState }) =>
  state === 'expanded' ? <IconArrowUp /> : state === 'collapsed' ? <IconArrowDown /> : null;

/* ------------------------------------------------------------------------------------------------
 * element/list_navi — 한 줄
 * ---------------------------------------------------------------------------------------------- */
export interface NavListItemProps {
  label: ReactNode;
  subtext?: ReactNode;
  icon?: IconProp;
  count?: ReactNode;
  trailing?: ReactNode;
  /** 1 | 2 | 3 (Figma: depth) — 왼쪽 여백 4 / 16 / 28 */
  depth?: number;
  /** 왼쪽 화살표 상태 (Figma: ♦ left = ic_arrow_down). expanded면 위쪽 화살표 */
  arrow?: ArrowState;
  /** 화살표 자리 유지 (Figma: margin). false면 화살표 자리 없이 붙음 */
  margin?: boolean;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * Figma: Components / `element/list_navi` (30 variants)
 *   depth       : 1 | 2 | 3  → padding 6 / 4·6 / 6 · 왼쪽 4 | 16 | 28
 *   multi line  : 1 line(h29) | 2 line(h41, subtext 8px Regular)
 *   status      : normal | over(:hover) | pressed(:active) | selected → bg neutral-20 | disabled → 40%
 *   구성: [leftarea 12: ic_arrow_down neutral-100] gap4 [ic 13 neutral-100] gap 2.68(→3) [Text 12px Medium neutral-70]
 *         … [right 1: 16] gap 5.36(→5) [right 2: "(n)" 10px Regular neutral-70]
 *   ♦ edit / sort 버튼 묶음은 trailing 슬롯으로 넣으세요.
 */
export function NavListItem({
  label,
  subtext,
  icon,
  count,
  trailing,
  depth = 1,
  arrow = 'none',
  margin = true,
  selected,
  disabled,
  className,
}: NavListItemProps) {
  const ic = resolveIcon(icon, <IconInfo />);
  const pl = 4 + 12 * (Math.min(Math.max(depth, 1), 3) - 1);
  return (
    <div
      style={{ paddingLeft: pl }}
      className={cn(
        'flex w-full items-center gap-1 py-1.5 text-left transition-colors',
        depth === 1 ? 'pr-1' : 'pr-1.5',
        selected ? 'bg-neutral-20' : !disabled && 'group-hover/row:bg-neutral-20 group-active/row:bg-neutral-20',
        disabled && 'opacity-40',
        className,
      )}
    >
      {margin && (
        <span aria-hidden className="inline-flex size-3 shrink-0 text-neutral-100 [&>svg]:size-full">
          <ArrowGlyph state={arrow} />
        </span>
      )}
      <span className="flex min-w-0 flex-1 items-center gap-[5px]">
        <span className="flex min-w-0 flex-1 items-center gap-[3px]">
          {ic && (
            <span aria-hidden className="inline-flex size-[13px] shrink-0 text-neutral-100 [&>svg]:size-full">
              {ic}
            </span>
          )}
          <span className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="truncate text-body-4 text-neutral-70">{label}</span>
            {subtext != null && <span className="truncate text-body-6 text-neutral-70">{subtext}</span>}
          </span>
        </span>
        {trailing != null && <span className="inline-flex shrink-0 items-center">{trailing}</span>}
        {count != null && <span className="shrink-0 text-body-5 text-neutral-70">{count}</span>}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * list_depth (type=icon) — navigation_side 의 한 줄
 * ---------------------------------------------------------------------------------------------- */
const depthPad = [4, 15, 24];

/**
 * Figma: `list_depth` (24 variants 중 type=icon) — depth 1|2|3 · state default | selected
 *   h28 (+ divider 1px) · py4 · pr8 · 화살표 x = 4 | 15 | 24 (12×12 neutral-70)
 *   element: pl4 gap4 [icon 16] [list texts 12px Medium neutral-70] [small text "NN" 10px Regular] [button_icon h16]
 *   default bg neutral-10 / selected bg neutral-20 (over/pressed 베리언트 없음)
 *   type=checkbox | radio | input 은 목록 선택용(popup_list)이라 이 묶음에서는 다루지 않습니다.
 */
export function NavDepthItem({
  label,
  icon,
  count,
  trailing,
  depth = 1,
  arrow = 'none',
  selected,
  disabled,
  divider = false,
  className,
}: Omit<NavListItemProps, 'subtext' | 'margin'> & {
  /** 아래 구분선 (Figma: divider) */
  divider?: boolean;
}) {
  const ic = resolveIcon(icon, <IconInfo />);
  return (
    <div className={cn('flex w-full flex-col', selected ? 'bg-neutral-20' : 'bg-neutral-10', disabled && 'opacity-40', className)}>
      <div style={{ paddingLeft: depthPad[Math.min(Math.max(depth, 1), 3) - 1] }} className="flex h-7 items-center py-1 pr-2">
        <span aria-hidden className="inline-flex size-3 shrink-0 text-neutral-70 [&>svg]:size-full">
          <ArrowGlyph state={arrow} />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-1 pl-1">
          {ic && (
            <span aria-hidden className="inline-flex size-4 shrink-0 text-neutral-100 [&>svg]:size-full">
              {ic}
            </span>
          )}
          <span className="min-w-0 flex-1 truncate text-body-4 text-neutral-70">{label}</span>
          {count != null && <span className="shrink-0 text-body-5 text-neutral-70">{count}</span>}
          {trailing != null && <span className="inline-flex shrink-0 items-center">{trailing}</span>}
        </span>
      </div>
      {divider && <span aria-hidden className="h-px w-full bg-neutral-40" />}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * NavTree — role="tree" 키보드 탐색
 * ---------------------------------------------------------------------------------------------- */
export interface NavTreeProps {
  items: NavTreeItem[];
  variant?: NavTreeVariant;
  /** 선택 항목 (제어) */
  selectedId?: string;
  /** 선택 항목 (비제어 초기값) */
  defaultSelectedId?: string;
  onSelect?: (id: string, item: NavTreeItem) => void;
  /** 펼친 항목 id (제어) */
  expandedIds?: string[];
  /** 펼친 항목 id (비제어 초기값) */
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  /** 하위가 있는 항목을 누르면 선택과 함께 펼침/접힘. 기본 true */
  toggleOnSelect?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

interface FlatNode {
  item: NavTreeItem;
  depth: number;
  parentId?: string;
  setSize: number;
  posInSet: number;
}

function flatten(items: NavTreeItem[], expanded: Set<string>, depth = 1, parentId?: string, out: FlatNode[] = []) {
  items.forEach((item, i) => {
    out.push({ item, depth, parentId, setSize: items.length, posInSet: i + 1 });
    if (item.children?.length && expanded.has(item.id)) flatten(item.children, expanded, depth + 1, item.id, out);
  });
  return out;
}

/**
 * 계층 내비게이션 트리. variant="list"는 `Navigation`(element/list_navi), "depth"는 `navigation_side`(list_depth) 모양.
 *   ↑↓ 이동 · → 펼치기/첫 자식 · ← 접기/부모 · Home End · Enter/Space 선택 · 문자 입력 없음
 */
export function NavTree({
  items,
  variant = 'list',
  selectedId,
  defaultSelectedId,
  onSelect,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  toggleOnSelect = true,
  className,
  ...aria
}: NavTreeProps) {
  const [innerSel, setInnerSel] = useState(defaultSelectedId);
  const [innerExp, setInnerExp] = useState<string[]>(defaultExpandedIds);
  const sel = selectedId ?? innerSel;
  const expList = expandedIds ?? innerExp;
  const expanded = useMemo(() => new Set(expList), [expList]);
  const flat = useMemo(() => flatten(items, expanded), [items, expanded]);
  const [focusId, setFocusId] = useState<string | undefined>();
  const refs = useRef(new Map<string, HTMLLIElement>());

  const tabStop =
    (focusId && flat.some((n) => n.item.id === focusId) && focusId) ||
    (sel && flat.some((n) => n.item.id === sel) && sel) ||
    flat[0]?.item.id;

  const setExpanded = (id: string, open: boolean) => {
    const next = open ? [...new Set([...expList, id])] : expList.filter((x) => x !== id);
    if (expandedIds === undefined) setInnerExp(next);
    onExpandedChange?.(next);
  };

  const focus = (id: string) => {
    setFocusId(id);
    refs.current.get(id)?.focus();
  };

  const choose = (node: FlatNode) => {
    const { item } = node;
    if (item.disabled) return;
    if (selectedId === undefined) setInnerSel(item.id);
    onSelect?.(item.id, item);
    if (toggleOnSelect && item.children?.length) setExpanded(item.id, !expanded.has(item.id));
  };

  const onKeyDown = (e: KeyboardEvent, idx: number) => {
    const node = flat[idx];
    const hasKids = !!node.item.children?.length;
    const isOpen = expanded.has(node.item.id);
    switch (e.key) {
      case 'ArrowDown':
        if (idx < flat.length - 1) focus(flat[idx + 1].item.id);
        break;
      case 'ArrowUp':
        if (idx > 0) focus(flat[idx - 1].item.id);
        break;
      case 'Home':
        focus(flat[0].item.id);
        break;
      case 'End':
        focus(flat[flat.length - 1].item.id);
        break;
      case 'ArrowRight':
        if (hasKids && !isOpen) setExpanded(node.item.id, true);
        else if (hasKids && isOpen) focus(flat[idx + 1].item.id);
        break;
      case 'ArrowLeft':
        if (hasKids && isOpen) setExpanded(node.item.id, false);
        else if (node.parentId) focus(node.parentId);
        break;
      case 'Enter':
      case ' ':
        choose(node);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  return (
    <ul role="tree" className={cn('flex w-full flex-col', variant === 'depth' && 'gap-1', className)} {...aria}>
      {flat.map((node, idx) => {
        const { item, depth } = node;
        const hasKids = !!item.children?.length;
        const arrow: ArrowState = hasKids ? (expanded.has(item.id) ? 'expanded' : 'collapsed') : 'none';
        const isSel = item.id === sel;
        return (
          <li
            key={item.id}
            ref={(el) => {
              if (el) refs.current.set(item.id, el);
              else refs.current.delete(item.id);
            }}
            role="treeitem"
            aria-level={depth}
            aria-setsize={node.setSize}
            aria-posinset={node.posInSet}
            aria-expanded={hasKids ? expanded.has(item.id) : undefined}
            aria-selected={isSel}
            aria-disabled={item.disabled || undefined}
            tabIndex={item.id === tabStop ? 0 : -1}
            onFocus={() => setFocusId(item.id)}
            onClick={() => choose(node)}
            onKeyDown={(e) => onKeyDown(e, idx)}
            className={cn(
              'group/row cursor-pointer outline-none',
              'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70',
              item.disabled && 'cursor-not-allowed',
            )}
          >
            {variant === 'list' ? (
              <NavListItem
                label={item.label}
                subtext={item.subtext}
                icon={item.icon}
                count={item.count}
                trailing={item.trailing}
                depth={depth}
                arrow={arrow}
                selected={isSel}
                disabled={item.disabled}
              />
            ) : (
              <NavDepthItem
                label={item.label}
                icon={item.icon}
                count={item.count}
                trailing={item.trailing}
                depth={depth}
                arrow={arrow}
                selected={isSel}
                disabled={item.disabled}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
