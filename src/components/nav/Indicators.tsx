import { useRef, type KeyboardEvent } from 'react';
import { cn } from '../../lib/cn';
import { IconArrowDoubleLeft, IconArrowDoubleRight, IconArrowLeft, IconArrowRight } from '../../icons';
import { IconButton } from '../IconButton';

/* ------------------------------------------------------------------------------------------------
 * element/dot_pagination · element/dot indicator · bottom_dot indicator
 * ---------------------------------------------------------------------------------------------- */
export interface DotIndicatorProps {
  /** 점 개수 (Figma: count 2 … 10) */
  count: number;
  /** 현재 위치 index (0부터) */
  current: number;
  /** 넘기면 점을 눌러 이동할 수 있는 탭 목록(캐러셀 컨트롤)이 됩니다. 없으면 표시 전용 */
  onChange?: (index: number) => void;
  /** 흰 바탕 p8 상자에 담기 (Figma: bottom_dot indicator) */
  framed?: boolean;
  /** 점마다 읽을 이름 (기본 "n / 전체") */
  getLabel?: (index: number) => string;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: `element/dot_pagination` (status default | current) + `element/dot indicator` (count 2…10)
 *        + `bottom_dot indicator`
 *   점 4×4 원 · gap 4
 *     default : neutral-40 · 투명도 60%
 *     current : neutral-100
 *   bottom_dot indicator : bg neutral-10 · p8 (점 줄을 감싸는 상자)
 *   onChange가 있으면 role="tablist"(점=tab), ←→ Home End 로 이동. 클릭 영역은 점 주변 16px로 넓힘.
 */
export function DotIndicator({ count, current, onChange, framed, getLabel, className, ...aria }: DotIndicatorProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const label = getLabel ?? ((i: number) => `${i + 1} / ${count}`);
  const dot = (on: boolean) => cn('block size-1 rounded-full', on ? 'bg-neutral-100' : 'bg-neutral-40 opacity-60');

  const onKey = (e: KeyboardEvent, i: number) => {
    let n = i;
    if (e.key === 'ArrowRight') n = (i + 1) % count;
    else if (e.key === 'ArrowLeft') n = (i - 1 + count) % count;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = count - 1;
    else return;
    e.preventDefault();
    refs.current[n]?.focus();
    onChange?.(n);
  };

  const dots = onChange ? (
    <div role="tablist" aria-label={aria['aria-label'] ?? '슬라이드 선택'} className="flex items-center gap-1">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="button"
          role="tab"
          aria-selected={i === current}
          aria-label={label(i)}
          tabIndex={i === current ? 0 : -1}
          onClick={() => onChange(i)}
          onKeyDown={(e) => onKey(e, i)}
          className={cn(
            'relative size-1 rounded-full before:absolute before:-inset-1.5 before:content-[""]',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70',
          )}
        >
          <span aria-hidden className={dot(i === current)} />
        </button>
      ))}
    </div>
  ) : (
    <div role="img" aria-label={aria['aria-label'] ?? `${count}개 중 ${current + 1}번째`} className="flex items-center gap-1">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} aria-hidden className={dot(i === current)} />
      ))}
    </div>
  );

  return <div className={cn('inline-flex w-fit', framed && 'bg-neutral-10 p-2', className)}>{dots}</div>;
}

/* ------------------------------------------------------------------------------------------------
 * element/page indicator (+ element/num_pagination)
 * ---------------------------------------------------------------------------------------------- */
export interface PageIndicatorProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** 한 번에 보여 줄 번호 수 (Figma: type 5 | 10) */
  type?: 5 | 10;
  /** 처음/마지막으로 가는 이중 화살표 (Figma: ♦ double arrow). 기본 true */
  doubleArrow?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: `element/page indicator` (type 5 | 10, ♦ double arrow) — 테두리·여백 없는 번호 줄.
 *   (테두리·p16·"N개씩 보기"까지 있는 `bottom_page indicator`는 기존 Pagination)
 *   [≪][<] gap 5.36 · 그룹 사이 gap 10.72 · 번호 gap 5.36 · [>][≫]
 *   화살표: button_icon outlined h16 (16×16, 테두리 neutral-40)
 *   번호 element/num_pagination 19×19, 10px Regular neutral-70
 *     over/pressed : 16×16 neutral-20 (r2.7) / selected : neutral-20 + Bold neutral-100
 *   단일 화살표 = 이전/다음 묶음(type 개씩), 이중 화살표 = 처음/마지막 페이지
 */
export function PageIndicator({
  page,
  pageCount,
  onPageChange,
  type = 5,
  doubleArrow = true,
  className,
  ...aria
}: PageIndicatorProps) {
  const groupStart = Math.floor((page - 1) / type) * type + 1;
  const groupEnd = Math.min(groupStart + type - 1, pageCount);
  const pages = Array.from({ length: Math.max(groupEnd - groupStart + 1, 0) }, (_, i) => groupStart + i);
  const go = (p: number) => onPageChange(Math.min(Math.max(p, 1), pageCount));

  return (
    <nav aria-label={aria['aria-label'] ?? '페이지'} className={cn('flex w-fit items-center gap-[11px]', className)}>
      <div className="flex items-center gap-[5px]">
        {doubleArrow && (
          <IconButton height="h16" label="첫 페이지" icon={<IconArrowDoubleLeft />} disabled={page <= 1} onClick={() => go(1)} />
        )}
        <IconButton height="h16" label={`이전 ${type}페이지`} icon={<IconArrowLeft />} disabled={groupStart <= 1} onClick={() => go(groupStart - type)} />
      </div>
      <ul className="flex items-center gap-[5px]">
        {pages.map((p) => {
          const sel = p === page;
          return (
            <li key={p}>
              <button
                type="button"
                aria-current={sel ? 'page' : undefined}
                aria-label={`${p}페이지`}
                onClick={() => go(p)}
                className={cn(
                  'group relative inline-flex size-[19px] items-center justify-center text-body-5 text-neutral-70',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
                  sel && 'font-bold text-neutral-100',
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    'absolute inset-px rounded-[2.7px]',
                    sel ? 'bg-neutral-20' : 'group-hover:bg-neutral-20 group-active:bg-neutral-20',
                  )}
                />
                <span className="relative">{p}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-[5px]">
        <IconButton height="h16" label={`다음 ${type}페이지`} icon={<IconArrowRight />} disabled={groupEnd >= pageCount} onClick={() => go(groupStart + type)} />
        {doubleArrow && (
          <IconButton height="h16" label="마지막 페이지" icon={<IconArrowDoubleRight />} disabled={page >= pageCount} onClick={() => go(pageCount)} />
        )}
      </div>
    </nav>
  );
}
