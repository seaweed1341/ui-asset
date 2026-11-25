import { cn } from '../lib/cn';
import { IconArrowDoubleLeft, IconArrowDoubleRight, IconArrowLeft, IconArrowRight } from '../icons';
import { Dropdown } from './Dropdown';

/**
 * Figma: `bottom_page indicator` (+ `element/page indicator`, `element/num_pagination`)
 *   p16, 상단 divider, 가운데 페이지 번호(19×19, selected = neutral-20 + Bold), 오른쪽 "N개씩 보기"
 *   규칙(LCS): 이중 화살표 = 처음/마지막 페이지, 단일 화살표 = 10페이지씩 이동, 페이지당 10/20/30/50
 */
export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  /** 한 번에 보여 줄 번호 수 (Figma num=5 | 10) */
  groupSize?: 5 | 10;
  pageSizeLabel?: string;
  className?: string;
}

const navBtn =
  'inline-flex size-[19px] items-center justify-center rounded-[3px] text-neutral-70 hover:bg-neutral-20 disabled:opacity-40 disabled:hover:bg-transparent [&>svg]:size-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70';

export function Pagination({
  page,
  pageCount,
  onPageChange,
  pageSize,
  pageSizeOptions = [10, 20, 30, 50],
  onPageSizeChange,
  groupSize = 10,
  pageSizeLabel = 'per page',
  className,
}: PaginationProps) {
  const groupStart = Math.floor((page - 1) / groupSize) * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, pageCount);
  const pages = Array.from({ length: Math.max(groupEnd - groupStart + 1, 0) }, (_, i) => groupStart + i);
  const go = (p: number) => onPageChange(Math.min(Math.max(p, 1), pageCount));

  return (
    <nav aria-label="페이지" className={cn('relative flex items-center justify-center border-t border-neutral-40 p-4', className)}>
      <div className="flex items-center gap-2.5">
        <button type="button" className={navBtn} aria-label="첫 페이지" disabled={page === 1} onClick={() => go(1)}>
          <IconArrowDoubleLeft />
        </button>
        <button type="button" className={navBtn} aria-label={`이전 ${groupSize}페이지`} disabled={groupStart === 1} onClick={() => go(groupStart - groupSize)}>
          <IconArrowLeft />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            aria-current={p === page ? 'page' : undefined}
            onClick={() => go(p)}
            className={cn(navBtn, 'text-body-5', p === page && 'bg-neutral-20 font-bold text-neutral-100')}
          >
            {p}
          </button>
        ))}
        <button type="button" className={navBtn} aria-label={`다음 ${groupSize}페이지`} disabled={groupEnd >= pageCount} onClick={() => go(groupStart + groupSize)}>
          <IconArrowRight />
        </button>
        <button type="button" className={navBtn} aria-label="마지막 페이지" disabled={page === pageCount} onClick={() => go(pageCount)}>
          <IconArrowDoubleRight />
        </button>
      </div>

      {pageSize != null && onPageSizeChange && (
        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-[5px]">
          <Dropdown
            className="w-[52px]"
            value={String(pageSize)}
            onChange={(v) => onPageSizeChange(Number(v))}
            options={pageSizeOptions.map((n) => ({ value: String(n), label: String(n) }))}
          />
          <span className="text-body-5 text-neutral-70">{pageSizeLabel}</span>
        </div>
      )}
    </nav>
  );
}
