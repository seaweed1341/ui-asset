import { Fragment, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import {
  IconAdd,
  IconApps,
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
  IconClose,
  IconMenu,
  IconNotification,
  IconProfile,
  IconTime,
  IconWindowMaximize,
  IconWindowMinimize,
  IconEdit,
} from '../../icons';
import { Button } from '../Button';
import { HeaderIconButton } from '../Navigation';
import { IconExternal, IconGlobe, IconHome, IconNull, IconRegion, IconSignIn } from './icons';

const ring = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-70';

/* ================================================================================================
 * title bar
 * ============================================================================================== */
export interface TitleBarMenuItem {
  label: ReactNode;
  /** 왼쪽 아이콘 (Figma: button icon-left). true면 ic_home */
  icon?: IconProp;
  /** 하위 메뉴가 있다는 표시 — 오른쪽 ic_arrow_down */
  hasSubmenu?: boolean;
  /** 외부 링크 표시 — 오른쪽 ic_open(외부) */
  external?: boolean;
  href?: string;
  onClick?: () => void;
  /** 이 항목 앞에 구분선 (Figma: div 1×13 neutral-70 25%) + gap 20 */
  dividerBefore?: boolean;
}

export interface TitleBarProps {
  /** dark | light | lgbc | app (Figma: type) */
  type?: 'dark' | 'light' | 'lgbc' | 'app';
  /** 앱 이름 (Figma: App Title) */
  appTitle: ReactNode;
  /** 앱 이름 옆 부제 (Figma: ♦ subtitle + Subtitle) */
  subtitle?: ReactNode;
  /** 앱 이름 앞 브랜드 아이콘 16 (Figma: ♦ brand icon, 기본 ic_null) */
  brandIcon?: IconProp;
  /** 사이드바 토글 (Figma: ♦ sidebar toggle). type=app 에는 없음 */
  onToggleSidebar?: () => void;
  sidebarExpanded?: boolean;
  /** 세션 남은 시간 + Extend (Figma: ♦ timeout, ♦ timeout edit) */
  timeout?: { remaining: string; onExtend: () => void; extendLabel?: string; onEdit?: () => void };
  /** 비즈 버튼 (Figma: ♦ biz button — button h26 secondary icon-left) */
  bizButton?: { label: ReactNode; icon?: ReactNode; onClick?: () => void };
  /** 지원 버튼 (Figma: ♦ support — button h26 primary(pressed) icon-right) */
  support?: { label: ReactNode; onClick?: () => void };
  /** 오른쪽 아이콘 버튼 슬롯 (Figma: btns). 생략하면 알림·계정·앱 (type=app은 창 버튼) */
  actions?: ReactNode;
  /** type=lgbc 가운데 메뉴 */
  menu?: TitleBarMenuItem[];
  /** type=app 창 버튼 */
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

/**
 * Figma: Components / `title bar` (type dark | light | lgbc | app)
 *   1280×40 (lgbc 41) · px16 · 좌우 space-between · 세로 가운데
 *   bg: dark·app neutral-70 / light·lgbc neutral-10
 *   왼쪽 unit gap4: [sidebar toggle 16 (ic_menu)] [brand icon 16] [App Title 15px Medium] [Subtitle 12px Medium]
 *     글자색 dark·app neutral-10 (부제 neutral-15 → neutral-20) / light·lgbc neutral-100 (부제 neutral-70)
 *   오른쪽 elements gap10: [biz button h26] [timeout: ic_time 16 + "00:00" 12px Bold, gap 6.7→7, Extend h26]
 *     | divider 세로 12 neutral-40 | [btns: icon_badge 24 × 3, gap10] [support h26]
 *     Extend: dark = secondary / light = primary · 아이콘: dark·app neutral-10 / light·lgbc neutral-100
 *   lgbc: 가운데 메뉴(gap20) — button h20 text 10px Regular neutral-70, 아이콘 10, 그룹 구분선 1×13 neutral-70 25%
 *   app : 토글·timeout 없음, 오른쪽 창 버튼(최소화·최대화·닫기). Electron 등은 drag 영역 지정
 */
export function TitleBar({
  type = 'dark',
  appTitle,
  subtitle,
  brandIcon,
  onToggleSidebar,
  sidebarExpanded,
  timeout,
  bizButton,
  support,
  actions,
  menu,
  onMinimize,
  onMaximize,
  onClose,
  className,
}: TitleBarProps) {
  const dark = type === 'dark' || type === 'app';
  const brand = resolveIcon(brandIcon, <IconNull />);
  const tone = dark ? 'dark' : 'light';
  const showTimeout = timeout && (type === 'dark' || type === 'light');

  const winBtn = cn(
    'inline-flex size-6 items-center justify-center text-neutral-10 hover:bg-neutral-100 [&>svg]:size-6 [-webkit-app-region:no-drag]',
    ring,
  );

  return (
    <header
      className={cn(
        'flex w-full shrink-0 items-center justify-between gap-4 px-4',
        type === 'lgbc' ? 'h-[41px]' : 'h-10',
        dark ? 'bg-neutral-70' : 'bg-neutral-10',
        type === 'app' && 'select-none [-webkit-app-region:drag]',
        className,
      )}
    >
      {/* unit */}
      <div className="flex min-w-0 items-center gap-1">
        {type !== 'app' && onToggleSidebar && (
          <button
            type="button"
            aria-label="사이드바 열기/닫기"
            aria-expanded={sidebarExpanded}
            onClick={onToggleSidebar}
            className={cn(
              'inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-3.5',
              dark ? 'text-neutral-10' : 'text-neutral-100',
              ring,
            )}
          >
            <IconMenu />
          </button>
        )}
        {brand && (
          <span aria-hidden className={cn('inline-flex size-4 shrink-0 [&>svg]:size-full', dark ? 'text-neutral-10' : 'text-neutral-100')}>
            {brand}
          </span>
        )}
        <span className={cn('truncate whitespace-nowrap text-body-3', dark ? 'text-neutral-10' : 'text-neutral-100')}>{appTitle}</span>
        {subtitle != null && (
          <span className={cn('whitespace-nowrap text-body-4', dark ? 'text-neutral-20' : 'text-neutral-70')}>{subtitle}</span>
        )}
      </div>

      {/* lgbc menu */}
      {type === 'lgbc' && menu?.length ? (
        <nav aria-label="주 메뉴" className="flex min-w-0 items-center gap-5">
          {menu.map((m, i) => {
            const icon = resolveIcon(m.icon, <IconHome />);
            const cls = cn(
              'inline-flex h-6 items-center gap-1 whitespace-nowrap rounded-full px-[9px] py-[5px] text-body-5 font-regular text-neutral-70 hover:text-neutral-100 [&_svg]:size-2.5',
              icon && 'pl-1.5',
              (m.hasSubmenu || m.external) && 'pr-1.5',
              ring,
            );
            const inner = (
              <>
                {icon && <span aria-hidden className="inline-flex">{icon}</span>}
                {m.label}
                {m.hasSubmenu && <span aria-hidden className="inline-flex"><IconArrowDown /></span>}
                {m.external && <span aria-hidden className="inline-flex"><IconExternal /></span>}
              </>
            );
            return (
              <Fragment key={i}>
                {m.dividerBefore && <span aria-hidden className="h-[13px] w-px shrink-0 bg-neutral-70 opacity-25" />}
                {m.href ? (
                  <a href={m.href} onClick={m.onClick} target={m.external ? '_blank' : undefined} rel={m.external ? 'noreferrer' : undefined} className={cls}>
                    {inner}
                  </a>
                ) : (
                  <button type="button" onClick={m.onClick} aria-haspopup={m.hasSubmenu ? 'menu' : undefined} className={cls}>
                    {inner}
                  </button>
                )}
              </Fragment>
            );
          })}
        </nav>
      ) : null}

      {/* elements */}
      <div className="flex shrink-0 items-center gap-2.5">
        {type === 'app' ? (
          actions ?? (
            <>
              <button type="button" aria-label="최소화" onClick={onMinimize} className={winBtn}>
                <IconWindowMinimize />
              </button>
              <button type="button" aria-label="최대화" onClick={onMaximize} className={winBtn}>
                <IconWindowMaximize />
              </button>
              <button type="button" aria-label="닫기" onClick={onClose} className={winBtn}>
                <IconClose />
              </button>
            </>
          )
        ) : (
          <>
            {bizButton && (
              <Button variant="secondary" height="h26" icon={bizButton.icon ?? true} label={bizButton.label} onClick={bizButton.onClick} />
            )}
            {showTimeout && (
              <div className="flex items-center gap-[7px]">
                <span className={cn('flex items-center gap-[3px]', dark ? 'text-neutral-10' : 'text-neutral-70')}>
                  <span aria-hidden className="inline-flex size-4 [&>svg]:size-full">
                    <IconTime />
                  </span>
                  <span className="text-body-4 font-bold tabular-nums" aria-label="남은 세션 시간">
                    {timeout.remaining}
                  </span>
                </span>
                {timeout.onEdit && <HeaderIconButton label="세션 시간 설정" icon={<IconEdit />} tone={tone} onClick={timeout.onEdit} />}
                <Button
                  variant={dark ? 'secondary' : 'primary'}
                  height="h26"
                  label={timeout.extendLabel ?? 'Extend'}
                  onClick={timeout.onExtend}
                />
              </div>
            )}
            {(bizButton || showTimeout) && <span aria-hidden className="h-3 w-px shrink-0 bg-neutral-40" />}
            <div className="flex items-center gap-2.5">
              {actions ?? (
                <>
                  <HeaderIconButton label="알림" icon={<IconNotification />} tone={tone} />
                  <HeaderIconButton label="계정" icon={<IconProfile />} tone={tone} />
                  <HeaderIconButton label="솔루션" icon={<IconApps />} tone={tone} />
                </>
              )}
            </div>
            {support && (
              <Button
                variant="primary"
                height="h26"
                label={support.label}
                icon={<IconArrowRight />}
                iconPosition="right"
                onClick={support.onClick}
                className="bg-neutral-100"
              />
            )}
          </>
        )}
      </div>
    </header>
  );
}

/* ================================================================================================
 * title bar-mobile
 * ============================================================================================== */
export interface MobileTitleBarProps {
  /** dark | light (Figma: color) */
  color?: 'dark' | 'light';
  appTitle: ReactNode;
  subtitle?: ReactNode;
  brandIcon?: IconProp;
  /** 메뉴 토글 (Figma: ♦ sidebar toggle) */
  onToggleSidebar?: () => void;
  sidebarExpanded?: boolean;
  /** 오른쪽 그룹 (Figma: group 슬롯). 생략 시 언어(ic_globe) + 로그인(ic_sign_in) */
  actions?: ReactNode;
  onLanguage?: () => void;
  onSignIn?: () => void;
  /** 로그인 아이콘 표시 (Figma: ♦ sign-in icon). 기본 true */
  signInIcon?: boolean;
  className?: string;
}

/**
 * Figma: Components / `title bar-mobile` (color dark | light)
 *   h40 · px5 · space-between
 *   왼쪽 gap4: [ic_menu 24] [brand 24] [app title 12px Medium] [subtitle 8px Regular neutral-15 → neutral-20]
 *     dark: bg neutral-70, 글자·아이콘 neutral-10 / light: bg neutral-10, neutral-70
 *   오른쪽 group gap2: [ic_globe 24] [ic_sign_in 24]
 */
export function MobileTitleBar({
  color = 'dark',
  appTitle,
  subtitle,
  brandIcon,
  onToggleSidebar,
  sidebarExpanded,
  actions,
  onLanguage,
  onSignIn,
  signInIcon = true,
  className,
}: MobileTitleBarProps) {
  const dark = color === 'dark';
  const fg = dark ? 'text-neutral-10' : 'text-neutral-70';
  const brand = resolveIcon(brandIcon, <IconNull />);
  const iconBtn = cn('inline-flex size-6 shrink-0 items-center justify-center [&>svg]:size-full', fg, ring);
  return (
    <header className={cn('flex h-10 w-full shrink-0 items-center justify-between gap-[3px] px-[5px]', dark ? 'bg-neutral-70' : 'bg-neutral-10', className)}>
      <div className="flex min-w-0 items-center gap-1">
        {onToggleSidebar && (
          <button type="button" aria-label="메뉴 열기/닫기" aria-expanded={sidebarExpanded} onClick={onToggleSidebar} className={iconBtn}>
            <IconMenu />
          </button>
        )}
        {brand && (
          <span aria-hidden className={cn('inline-flex size-6 shrink-0 [&>svg]:size-full', fg)}>
            {brand}
          </span>
        )}
        <span className={cn('truncate text-body-4', fg)}>{appTitle}</span>
        {subtitle != null && <span className="whitespace-nowrap text-body-6 text-neutral-20">{subtitle}</span>}
      </div>
      {(actions || signInIcon || onLanguage) && (
        <div className="flex shrink-0 items-center justify-end gap-0.5">
          {actions ?? (
            <>
              <button type="button" aria-label="언어 선택" onClick={onLanguage} className={iconBtn}>
                <IconGlobe />
              </button>
              {signInIcon && (
                <button type="button" aria-label="로그인" onClick={onSignIn} className={iconBtn}>
                  <IconSignIn />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}

/* ================================================================================================
 * element/header — 사이드바 머리
 * ============================================================================================== */
export interface SidebarHeaderProps {
  /** open | close (Figma: state) */
  state?: 'open' | 'close';
  /** small(사이드바 210, bg neutral-20) | large(284, bg neutral-10) */
  size?: 'small' | 'large';
  title: ReactNode;
  subtitle?: ReactNode;
  /** 제목 앞 아이콘 (Figma: left_icon, 기본 ic_null) */
  leftIcon?: ReactNode;
  /** 오른쪽 지역·계정 아이콘 (Figma: icons). 기본 true */
  icons?: boolean;
  onRegion?: () => void;
  onProfile?: () => void;
  /** close 상태의 메뉴(ic_menu) 버튼 — 다시 펼치기 */
  onOpen?: () => void;
  className?: string;
}

/**
 * Figma: Components / `element/header` (state open | close · size small | large)
 *   h48 · open: px12 space-between / close: p12 정사각(42 | 48), ic_menu 18 | 24
 *   small: 폭 210 bg neutral-20 · 아이콘 18 · 제목 12px Medium · 부제 10px Regular
 *   large: 폭 284 bg neutral-10 · 아이콘 24 · 제목 15px Medium · 부제 12px Medium   (글자 neutral-100, gap2)
 *   오른쪽 btn gap6: ic_region 14 · ic_profile 14
 */
export function SidebarHeader({
  state = 'open',
  size = 'small',
  title,
  subtitle,
  leftIcon,
  icons = true,
  onRegion,
  onProfile,
  onOpen,
  className,
}: SidebarHeaderProps) {
  const small = size === 'small';
  const bg = small ? 'bg-neutral-20' : 'bg-neutral-10';
  if (state === 'close') {
    return (
      <div className={cn('flex h-12 shrink-0 items-center justify-center p-3', small ? 'w-[42px]' : 'w-12', bg, className)}>
        <button
          type="button"
          aria-label="메뉴 펼치기"
          aria-expanded={false}
          onClick={onOpen}
          className={cn('inline-flex shrink-0 text-neutral-70 [&>svg]:size-full', small ? 'size-[18px]' : 'size-6', ring)}
        >
          <IconMenu />
        </button>
      </div>
    );
  }
  const small14 = cn('inline-flex size-3.5 text-neutral-70 [&>svg]:size-full', ring);
  return (
    <div className={cn('flex h-12 shrink-0 items-center justify-between gap-2 px-3', small ? 'w-[210px]' : 'w-[284px]', bg, className)}>
      <div className="flex min-w-0 items-center gap-0.5 text-neutral-100">
        <span aria-hidden className={cn('inline-flex shrink-0 [&>svg]:size-full', small ? 'size-[18px]' : 'size-6')}>
          {leftIcon ?? <IconNull />}
        </span>
        <span className={cn('truncate', small ? 'text-body-4' : 'text-body-3')}>{title}</span>
        {subtitle != null && <span className={cn('whitespace-nowrap', small ? 'text-body-5' : 'text-body-4')}>{subtitle}</span>}
      </div>
      {icons && (
        <div className="flex shrink-0 items-center gap-1.5">
          <button type="button" aria-label="지역 선택" onClick={onRegion} className={small14}>
            <IconRegion />
          </button>
          <button type="button" aria-label="계정" onClick={onProfile} className={small14}>
            <IconProfile />
          </button>
        </div>
      )}
    </div>
  );
}

/* ================================================================================================
 * headings
 * ============================================================================================== */
interface HeadingLeadProps {
  title: ReactNode;
  /** 뒤로 가기 화살표 28 (Figma: titleIcon / arrow 표시) */
  onBack?: () => void;
  backLabel?: string;
  /** 제목 앞 아바타 28 (Figma: avarta) */
  avatar?: ReactNode;
  /** 제목 태그. 기본 h1 */
  as?: 'h1' | 'h2' | 'h3';
}

function HeadingLead({ title, onBack, backLabel = '뒤로', avatar, as: Tag = 'h1' }: HeadingLeadProps) {
  return (
    <div className="flex min-w-0 items-center gap-1">
      {onBack && (
        <button type="button" aria-label={backLabel} onClick={onBack} className={cn('inline-flex size-7 shrink-0 text-neutral-100 [&>svg]:size-full', ring)}>
          <IconArrowLeft />
        </button>
      )}
      {avatar && <span className="inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-20">{avatar}</span>}
      <Tag className="truncate text-body-1 text-neutral-100">{title}</Tag>
    </div>
  );
}

export interface HeadingMainProps extends HeadingLeadProps {
  /** 가운데 설명 (Figma: Description 15px Medium neutral-70, 가운데 정렬) */
  description?: ReactNode;
  /** 오른쪽 영역 (Figma: button container — 버튼, action buttons, Add/Noti 아이콘). gap12 */
  actions?: ReactNode;
  /** + 아이콘 버튼 (Figma: Add Icon 24) */
  onAdd?: () => void;
  /** 알림 아이콘 버튼 (Figma: Noti Icon, icon_badge) */
  onNotification?: () => void;
  notificationBadge?: boolean;
  className?: string;
}

/**
 * Figma: Components / `headings_main`
 *   h36 · space-between · 제목 23px Medium(Body1) neutral-100 · 앞 화살표/아바타 28 (gap4)
 *   설명 15px Medium neutral-70 — 가운데 고정(absolute center)
 *   오른쪽 gap12: [left text button h33 secondary] [action buttons: 아이콘24+12px 텍스트] [ic_add 24] [icon_badge]
 */
export function HeadingMain({ description, actions, onAdd, onNotification, notificationBadge, className, ...lead }: HeadingMainProps) {
  return (
    <div className={cn('relative flex min-h-9 w-full items-center justify-between gap-4', className)}>
      <HeadingLead {...lead} />
      {description != null && (
        <p className="pointer-events-none absolute left-1/2 top-1/2 max-w-[40%] -translate-x-1/2 -translate-y-1/2 truncate text-body-3 text-neutral-70">
          {description}
        </p>
      )}
      <div className="flex shrink-0 items-center justify-end gap-3">
        {actions}
        {onAdd && (
          <button type="button" aria-label="추가" onClick={onAdd} className={cn('inline-flex size-6 text-neutral-100 [&>svg]:size-full', ring)}>
            <IconAdd />
          </button>
        )}
        {onNotification && <HeaderIconButton label="알림" icon={<IconNotification />} tone="light" badge={notificationBadge} onClick={onNotification} />}
      </div>
    </div>
  );
}

/** headings_main 의 action buttons 한 칸 — [아이콘 24] gap4 [12px Medium neutral-100] */
export function HeadingAction({ icon, label, onClick }: { icon: ReactNode; label: ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn('inline-flex h-6 items-center gap-1 text-body-4 text-neutral-100 [&>svg]:size-6', ring)}>
      <span aria-hidden className="inline-flex size-6 [&>svg]:size-full">
        {icon}
      </span>
      {label}
    </button>
  );
}

export interface HeadingSubProps {
  /** align-left | align-center (Figma: type) */
  type?: 'align-left' | 'align-center';
  /** 제목 (Figma: title, 15px Medium neutral-70) */
  title: ReactNode;
  /** 제목 옆 아이콘 16 (Figma: title icon — loading dot 등) */
  titleIcon?: ReactNode;
  /** 왼쪽 슬롯 (Figma: tabs | dropdown). align-center에서는 왼쪽 1/3 영역, align-left에서는 제목 앞 */
  leading?: ReactNode;
  /** 오른쪽 버튼 (Figma: button 1 · button 2), gap6 */
  actions?: ReactNode;
  as?: 'h2' | 'h3' | 'h4';
  className?: string;
}

/**
 * Figma: Components / `headings_sub` (type align-left | align-center)
 *   h26 · 세 칸 space-between — align-center: left / text(가운데) / right 를 1:1:1
 *   제목 15px Medium(Body3) neutral-70 · titleIcon 16 gap4 · 오른쪽 gap6 (button h26: text icon-left + primary)
 */
export function HeadingSub({ type = 'align-left', title, titleIcon, leading, actions, as: Tag = 'h2', className }: HeadingSubProps) {
  const text = (
    <div className={cn('flex min-w-0 items-center gap-1', type === 'align-center' ? 'flex-1 justify-center' : 'flex-1')}>
      <Tag className="truncate text-body-3 text-neutral-70">{title}</Tag>
      {titleIcon && <span className="inline-flex size-4 shrink-0 [&>svg]:size-full">{titleIcon}</span>}
    </div>
  );
  return (
    <div className={cn('flex min-h-[26px] w-full items-center justify-between gap-4', className)}>
      {type === 'align-center' ? (
        <>
          <div className="flex min-w-0 flex-1 items-center gap-1.5">{leading}</div>
          {text}
        </>
      ) : (
        <>
          {leading && <div className="flex shrink-0 items-center gap-1.5">{leading}</div>}
          {text}
        </>
      )}
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5">{actions}</div>
    </div>
  );
}

export interface HeadingMobileProps extends HeadingLeadProps {
  /** 설명 (Figma: description 15px Medium neutral-70) */
  description?: ReactNode;
  /** 오른쪽 버튼 (Figma: button — primary h26 ×2 / 2button — ic_add + icon_badge), gap6 */
  actions?: ReactNode;
  className?: string;
}

/**
 * Figma: Components / `headings_mobile`
 *   360×64 · p 16/20 · gap12 · [화살표/아바타 28 + 제목 23px Medium] [설명 15px] … [오른쪽 버튼 gap6]
 */
export function HeadingMobile({ description, actions, className, ...lead }: HeadingMobileProps) {
  return (
    <div className={cn('flex min-h-16 w-full items-center gap-3 px-5 py-4', className)}>
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <HeadingLead {...lead} />
        {description != null && <p className="truncate text-body-3 text-neutral-70">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center justify-end gap-1.5">{actions}</div>}
    </div>
  );
}
