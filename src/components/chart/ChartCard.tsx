import { useId, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button';
import { Dropdown, type DropdownOption } from '../Dropdown';

/**
 * Figma: `element/trailing_chart` (2 variants) — 차트 카드 제목 오른쪽 컨트롤
 *   type=dropdown : dropdown|status=normal 121×24 (기간 선택 등)
 *   type=button   : button h26 secondary 53×26
 */
export type ChartTrailingProps =
  | {
      type?: 'dropdown';
      options: DropdownOption[];
      value?: string;
      defaultValue?: string;
      onChange?: (value: string) => void;
      placeholder?: ReactNode;
      className?: string;
    }
  | {
      type: 'button';
      label: ReactNode;
      onClick?: () => void;
      className?: string;
    };

export function ChartTrailing(props: ChartTrailingProps) {
  if (props.type === 'button') {
    return <Button variant="secondary" height="h26" label={props.label} onClick={props.onClick} className={props.className} />;
  }
  const { options, value, defaultValue, onChange, placeholder, className } = props;
  return (
    <Dropdown
      options={options}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  );
}

/**
 * Figma: `charts_bar/type1` · `charts_bar/type2` · `charts_line/type1` · `charts_area/type1` 공통 카드 (356×220)
 *   카드   : bg neutral-10, r8, 외곽선 0.67px neutral-40 (charts_circle은 1px)
 *   title  : 높이 36, p 12/12/0/12 — 제목 12px Medium neutral-70, ♦ right = trailing_chart
 *   ♦ tab  : 제목 아래 tab_group_line 슬롯(기본 숨김)
 *   data   : p 4/12/8/12, gap 4 — ♦ legend(오른쪽 정렬) + graph
 */
export interface ChartCardProps {
  /** 제목 (♦ title). 생략하면 제목 줄 전체가 사라집니다(trailing도 함께). */
  title?: ReactNode;
  /** 제목 오른쪽 컨트롤 (♦ right). 보통 <ChartTrailing /> */
  trailing?: ReactNode;
  /** 제목 아래 탭 슬롯 (♦ tab) */
  tabs?: ReactNode;
  /** 차트 위 범례 슬롯 (♦ legend). 차트 컴포넌트의 내장 범례를 써도 됩니다. */
  legend?: ReactNode;
  children: ReactNode;
  /** 본문 영역 className (원형 카드처럼 배치를 바꿀 때) */
  bodyClassName?: string;
  className?: string;
}

export function ChartCard({ title, trailing, tabs, legend, children, bodyClassName, className }: ChartCardProps) {
  const titleId = useId();
  return (
    <section
      aria-labelledby={title != null ? titleId : undefined}
      className={cn(
        'flex w-full min-w-0 flex-col rounded-lg bg-neutral-10 shadow-[inset_0_0_0_0.67px_var(--color-neutral-40)]',
        className,
      )}
    >
      {title != null && (
        <header className="flex h-9 shrink-0 items-center justify-between gap-3 px-3 pt-3">
          <h3 id={titleId} className="min-w-0 truncate text-body-4 font-medium text-neutral-70">
            {title}
          </h3>
          {trailing != null && <div className="flex shrink-0 items-center">{trailing}</div>}
        </header>
      )}
      {tabs != null && <div className="px-[3px]">{tabs}</div>}
      <div className={cn('flex min-w-0 flex-1 flex-col gap-1 px-3 pb-2 pt-1', bodyClassName)}>
        {legend != null && <div className="flex justify-end">{legend}</div>}
        {children}
      </div>
    </section>
  );
}
