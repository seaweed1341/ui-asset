import { type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { IconSort } from '../icons';
import { Checkbox } from './Checkbox';

/**
 * Figma: `element/cate_table`(헤더 셀) + `element/cell_table`(바디 셀)
 *   헤더 : h26, bg neutral-20, 10px Bold neutral-70, p 6/6/6/8, 정렬 아이콘(ic_arrow_table_fill 8)
 *   셀   : h36, p 4/6, 10px Regular neutral-70, 행 구분선 #bcbcbc@50%(divider-table)
 *   열   : 체크 열 40, 아이콘 버튼 열 40 (화면설계서 공통)
 */
export interface Column<T> {
  key: string;
  header: ReactNode;
  /** px 또는 CSS 폭. 생략하면 남은 폭을 나눔 */
  width?: number | string;
  align?: 'left' | 'center';
  sortable?: boolean;
  render?: (row: T, index: number) => ReactNode;
}

export type SortState = { key: string; direction: 'asc' | 'desc' } | null;

export interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  /** 행 체크박스의 접근성 이름에 쓸 값 (생략하면 id) */
  getRowLabel?: (row: T) => string;
  /** 첫 열에 체크박스(cate_table type=check / cell_table type=check) */
  selectable?: boolean;
  selected?: string[];
  onSelectedChange?: (ids: string[]) => void;
  sort?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** 위젯 표처럼 최대 행 수를 제한 (LGBC: 최대 5행) */
  maxRows?: number;
  /** 행이 없을 때 대신 보여 줄 내용 */
  empty?: ReactNode;
  /** 흐린(비활성) 행 — 예: 연결이 끊긴 디바이스 (cell_table dimmed) */
  isRowDimmed?: (row: T) => boolean;
  caption?: string;
  className?: string;
}

const cellBase = 'border-b border-divider-table px-1.5 text-body-5 text-neutral-70 [&:not(:last-child)]:border-r';

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  getRowLabel,
  selectable,
  selected = [],
  onSelectedChange,
  sort,
  onSortChange,
  maxRows,
  empty,
  isRowDimmed,
  caption,
  className,
}: DataTableProps<T>) {
  const visible = maxRows ? rows.slice(0, maxRows) : rows;
  const ids = visible.map(getRowId);
  const allChecked = ids.length > 0 && ids.every((id) => selected.includes(id));
  const someChecked = !allChecked && ids.some((id) => selected.includes(id));

  if (rows.length === 0 && empty) return <>{empty}</>;

  const toggleAll = () => onSelectedChange?.(allChecked ? [] : ids);
  const toggle = (id: string) =>
    onSelectedChange?.(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);

  const onSort = (key: string) => {
    if (!onSortChange) return;
    if (sort?.key !== key) onSortChange({ key, direction: 'asc' });
    else onSortChange(sort.direction === 'asc' ? { key, direction: 'desc' } : null);
  };

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <table className="w-full table-fixed border-collapse text-left">
        {caption && <caption className="sr-only">{caption}</caption>}
        <colgroup>
          {selectable && <col style={{ width: 40 }} />}
          {columns.map((c) => (
            <col key={c.key} style={{ width: c.width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="h-[26px] bg-neutral-20">
            {selectable && (
              <th scope="col" className={cn(cellBase, 'border-t text-center')}>
                <Checkbox
                  aria-label="전체 선택"
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={toggleAll}
                />
              </th>
            )}
            {columns.map((c) => {
              const active = sort?.key === c.key;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={active ? (sort!.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                  className={cn(cellBase, 'border-t py-1.5 pl-2 font-bold', c.align === 'center' && 'text-center')}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={cn(
                        'inline-flex items-center gap-1 font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
                        active && 'text-neutral-100',
                      )}
                    >
                      {c.header}
                      <IconSort className="size-2" />
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => {
            const id = getRowId(row);
            const dim = isRowDimmed?.(row);
            const isSel = selected.includes(id);
            return (
              <tr key={id} className={cn('h-9', isSel && 'bg-neutral-20', dim && 'opacity-40')}>
                {selectable && (
                  <td className={cn(cellBase, 'text-center')}>
                    <Checkbox aria-label={`${getRowLabel?.(row) ?? id} 선택`} checked={isSel} onChange={() => toggle(id)} />
                  </td>
                )}
                {columns.map((c) => (
                  <td key={c.key} className={cn(cellBase, 'truncate py-1', c.align === 'center' && 'text-center')}>
                    {c.render ? c.render(row, i) : String((row as Record<string, unknown>)[c.key] ?? '--')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
