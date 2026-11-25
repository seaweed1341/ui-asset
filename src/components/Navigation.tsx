import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { IconArrowLeft, IconMenu } from '../icons';

/**
 * Figma: `side bar_open` (+ `element/header`, `element/list_1depth_side bar`)
 *   bg neutral-20, list slot p 4/4/0/4, 항목 h40 p 0/8 gap4 아이콘 18
 *   status normal | pressed(neutral-40) | selected(neutral-10 + Bold)
 *   open/close : 펼침(라벨) / 접힘(아이콘만, 34폭)
 *   폭 : DS 220 / LCS 180↔47 / gram Claw 240↔42 → width, collapsedWidth로 지정
 */
export interface SideNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  /** 오른쪽 작은 tag (예: gram "모델 12%") */
  trailing?: ReactNode;
  disabled?: boolean;
}

export interface SideBarProps {
  items: SideNavItem[];
  /** 메뉴 사이 구분선을 넣을 항목 id (이 항목 앞에 divider) */
  dividerBefore?: string[];
  activeId?: string;
  onSelect?: (id: string) => void;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** 상단 헤더(element/header): 메뉴 토글 */
  header?: boolean;
  width?: number;
  collapsedWidth?: number;
  /** 라벨 크기: large(15px, LCS) | small(12px, gram) */
  textSize?: 'large' | 'small';
  /** 목록 아래 추가 영역 (gram: 대화 그룹) */
  children?: ReactNode;
  /** 맨 아래 고정 항목 (gram: 설정) */
  footer?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

export function SideBar({
  items,
  dividerBefore = [],
  activeId,
  onSelect,
  collapsed = false,
  onCollapsedChange,
  header = false,
  width = 220,
  collapsedWidth = 47,
  textSize = 'large',
  children,
  footer,
  className,
  ...aria
}: SideBarProps) {
  return (
    <aside
      style={{ width: collapsed ? collapsedWidth : width }}
      className={cn('flex h-full shrink-0 flex-col overflow-hidden bg-neutral-20 transition-[width]', className)}
    >
      {header && (
        <div className={cn('flex h-[29px] items-center px-3', collapsed ? 'justify-center px-0' : 'justify-between')}>
          <button
            type="button"
            aria-label={collapsed ? '메뉴 펼치기' : '메뉴 접기'}
            aria-expanded={!collapsed}
            onClick={() => onCollapsedChange?.(!collapsed)}
            className="inline-flex size-[18px] text-neutral-100 [&>svg]:size-full"
          >
            <IconMenu />
          </button>
          {!collapsed && (
            <button type="button" aria-label="메뉴 접기" onClick={() => onCollapsedChange?.(true)} className="inline-flex size-3.5 text-neutral-70 [&>svg]:size-full">
              <IconArrowLeft />
            </button>
          )}
        </div>
      )}
      <nav aria-label={aria['aria-label'] ?? '주 메뉴'} className="min-h-0 flex-1 overflow-y-auto px-1 pt-1">
        <ul className="flex flex-col gap-0.5">
          {items.map((it) => {
            const active = it.id === activeId;
            return (
              <li key={it.id}>
                {dividerBefore.includes(it.id) && <span role="separator" className="mx-1 my-1.5 block h-px bg-neutral-40" />}
                <button
                  type="button"
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? it.label : undefined}
                  disabled={it.disabled}
                  onClick={() => onSelect?.(it.id)}
                  className={cn(
                    'flex h-10 w-full items-center gap-1 px-2 text-left text-neutral-70 transition-colors',
                    textSize === 'large' ? 'text-body-3' : 'text-body-4',
                    'active:bg-neutral-40 disabled:opacity-40',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70',
                    active && 'bg-neutral-10 font-bold text-neutral-100',
                    collapsed && 'justify-center px-0',
                  )}
                >
                  <span aria-hidden className="inline-flex size-[18px] shrink-0 [&>svg]:size-full">
                    {it.icon}
                  </span>
                  {!collapsed && <span className="min-w-0 flex-1 truncate">{it.label}</span>}
                  {!collapsed && it.trailing}
                </button>
              </li>
            );
          })}
        </ul>
        {!collapsed && children}
      </nav>
      {footer && <div className="px-1 pb-3">{footer}</div>}
    </aside>
  );
}

/**
 * Figma: `icon_badge` — 헤더의 24×24 아이콘 버튼 (+ badgedot)
 */
export function HeaderIconButton({
  label,
  icon,
  badge,
  tone = 'dark',
  onClick,
}: {
  label: string;
  icon: ReactNode;
  badge?: boolean;
  tone?: 'dark' | 'light';
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'relative inline-flex size-6 items-center justify-center rounded-[3px] [&>svg]:size-[18px]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-70',
        tone === 'dark' ? 'text-neutral-10 active:bg-neutral-100' : 'text-neutral-100 hover:bg-neutral-20',
      )}
    >
      {icon}
      {badge && <span aria-hidden className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-error-60" />}
    </button>
  );
}
