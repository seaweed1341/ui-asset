import { useId, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconAdd, IconInfo } from '../../icons';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { IconButton } from '../IconButton';
import { CardEmpty } from './CardEmpty';
import { TagList } from './TagList';
import { Thumbnail16x9, ThumbnailVariable } from './Thumbnail';
import { CardHitArea, IconSlot, cardStroke, hitContent, useControllable, type CardAction } from './internal';

/* --------------------------------------------------------------------------
 * 공통
 * -------------------------------------------------------------------------- */

interface BasicCardCommon extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** 제목 (12px Medium neutral-100) */
  title?: ReactNode;
  /** 부제 (10px Regular neutral-70) */
  subtitle?: ReactNode;
  /** ♦ body text — 본문 (10px Regular neutral-70) */
  body?: ReactNode;
  /** ♦ tag — element/tags */
  tags?: ReactNode[];
  /** ♦ button/toggle — 제목 오른쪽 button_icon(outlined h32). true=ic_add, ReactNode=아이콘 교체 */
  toggle?: IconProp;
  toggleLabel?: string;
  onToggleClick?: () => void;
  /** ♦ button_01 — primary h26 */
  primaryAction?: CardAction;
  /** ♦ button_02 — secondary h26 */
  secondaryAction?: CardAction;
  /** ♦ bottom text — 하단 왼쪽 보조 텍스트(10px Bold neutral-70) */
  bottomText?: ReactNode;
  /** botton_icon — bottom text 앞 아이콘. 기본 ic_info(true) */
  bottomIcon?: IconProp;
  /** status=selected — 외곽선 neutral-70 2px. 제어 */
  selected?: boolean;
  /** 비제어 초기값 */
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  /** 카드 전체를 눌러 선택/해제할 수 있게 합니다(aria-pressed 버튼). selected 관련 prop을 주면 자동으로 켜집니다. */
  selectable?: boolean;
  /** type=none일 때 안내 문구 */
  emptyLabel?: ReactNode;
}

function useCardSelection(p: BasicCardCommon) {
  const [selected, setSelected] = useControllable(p.selected, p.defaultSelected ?? false, p.onSelectedChange);
  const selectable = p.selectable ?? (p.selected !== undefined || p.defaultSelected !== undefined || !!p.onSelectedChange);
  return { selected, setSelected, selectable };
}

function ToggleButton({ toggle, label, onClick }: { toggle: IconProp; label?: string; onClick?: () => void }) {
  const icon = resolveIcon(toggle, <IconAdd />);
  if (!icon) return null;
  return <IconButton label={label ?? '추가'} icon={icon} onClick={onClick} className="shrink-0" />;
}

function BottomText({ text, icon, iconSize }: { text?: ReactNode; icon?: IconProp; iconSize: string }) {
  if (text == null) return null;
  const iconNode = resolveIcon(icon ?? true, <IconInfo />);
  return (
    <span className="flex min-w-0 items-center gap-[3px] text-body-5 font-bold text-neutral-70">
      {iconNode && <IconSlot className={cn('text-neutral-100', iconSize)}>{iconNode}</IconSlot>}
      <span className="truncate">{text}</span>
    </span>
  );
}

function Actions({ primary, secondary, allSecondary }: { primary?: CardAction; secondary?: CardAction; allSecondary?: boolean }) {
  if (!primary && !secondary) return null;
  return (
    <span className="flex shrink-0 items-center gap-[5px]">
      {primary && (
        <Button height="h26" variant={allSecondary ? 'secondary' : 'primary'} label={primary.label} onClick={primary.onClick} disabled={primary.disabled} />
      )}
      {secondary && <Button height="h26" variant="secondary" label={secondary.label} onClick={secondary.onClick} disabled={secondary.disabled} />}
    </span>
  );
}

function TitleText({ id, title, subtitle }: { id: string; title?: ReactNode; subtitle?: ReactNode }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
      {title != null && (
        <span id={id} className="truncate text-body-4 text-neutral-100">
          {title}
        </span>
      )}
      {subtitle != null && <span className="truncate text-body-5 text-neutral-70">{subtitle}</span>}
    </span>
  );
}

const frame = (selected: boolean) =>
  cn('relative flex w-[294px] flex-col bg-neutral-10', cardStroke, selected ? 'after:border-2 after:border-neutral-70' : 'after:border-neutral-40');

/* --------------------------------------------------------------------------
 * basic card_01
 * -------------------------------------------------------------------------- */

export interface BasicCard01Props extends BasicCardCommon {
  /** icon | thumbnail | none (Figma: -) */
  type?: 'icon' | 'thumbnail' | 'none';
  /** type=icon 제목 앞 아이콘(24px). 기본 ic_info */
  icon?: IconProp;
  /** type=thumbnail 제목 앞 썸네일(thumbnail_16:9, 64×40) 이미지 주소 */
  thumbnailSrc?: string;
}

/**
 * Figma: Components / `basic card_01` (5 variants)
 *   type   : icon | thumbnail | -(none → element/card_none type 01)
 *   status : normal | selected(stroke neutral-70 2px) | none
 *   props  : ♦ body text · ♦ tag · ♦ button_01 · ♦ button_02 · ♦ bottom text · ♦ button/toggle · ♦ bottom
 *            botton_icon(swap) · button/toggle(swap) · top(SLOT → children)
 *   - 294 폭, neutral-10 바탕, stroke neutral-40 1px, 반경 0
 *   - top: p10 gap8 / title: gap8, 아이콘 24 또는 썸네일 64×40 + 텍스트(gap2) + button_icon h32
 *   - bottom: p8·10, 오른쪽 정렬 버튼(gap5), 왼쪽 bottom text(아이콘 13px, gap3)
 *   카드 안에 버튼이 있으므로 선택은 카드 전체를 덮는 버튼(aria-pressed)으로 처리합니다.
 */
export function BasicCard01(props: BasicCard01Props & { children?: ReactNode }) {
  const {
    type = 'icon',
    icon = true,
    thumbnailSrc,
    title,
    subtitle,
    body,
    tags,
    toggle,
    toggleLabel,
    onToggleClick,
    primaryAction,
    secondaryAction,
    bottomText,
    bottomIcon,
    emptyLabel,
    children,
    className,
    selected: _s,
    defaultSelected: _d,
    onSelectedChange: _o,
    selectable: _sel,
    ...rest
  } = props;
  const id = useId();
  const { selected, setSelected, selectable } = useCardSelection(props);

  if (type === 'none') {
    return <CardEmpty type="01" label={emptyLabel} className={cn('h-[155px] w-[294px]', className)} />;
  }

  const lead =
    type === 'icon' ? (
      resolveIcon(icon, <IconInfo />) && (
        <IconSlot className="size-6 p-0.5 text-neutral-100">{resolveIcon(icon, <IconInfo />)}</IconSlot>
      )
    ) : (
      <Thumbnail16x9 src={thumbnailSrc} className="w-16" />
    );

  const hasBottom = !!primaryAction || !!secondaryAction || bottomText != null;

  return (
    <article className={cn(frame(selected), className)} {...rest}>
      {selectable && <CardHitArea labelledBy={id} pressed={selected} onClick={() => setSelected(!selected)} />}
      <div className={cn('flex flex-col gap-2 p-2.5', selectable && hitContent)}>
        <div className="flex items-center gap-2">
          {lead}
          <TitleText id={id} title={title} subtitle={subtitle} />
          <ToggleButton toggle={toggle} label={toggleLabel} onClick={onToggleClick} />
        </div>
        {body != null && <p className="line-clamp-2 break-all text-body-5 text-neutral-70">{body}</p>}
        {tags && tags.length > 0 && <TagList tags={tags} />}
        {children}
      </div>
      {hasBottom && (
        <div className={cn('flex items-center justify-between gap-2 px-2.5 py-2', selectable && hitContent)}>
          <BottomText text={bottomText} icon={bottomIcon} iconSize="size-[13px]" />
          <span className="ml-auto">
            <Actions primary={primaryAction} secondary={secondaryAction} />
          </span>
        </div>
      )}
    </article>
  );
}

/* --------------------------------------------------------------------------
 * basic card_02
 * -------------------------------------------------------------------------- */

export interface BasicCard02Props extends BasicCardCommon {
  /** text | thumbnail | none */
  type?: 'text' | 'thumbnail' | 'none';
  /**
   * ♦ image — type=text: 상단 thumbnail_variable(294×126) 이미지 주소, true=자리표시, false=숨김
   * type=thumbnail: 본문 썸네일 목록(133×90, gap 8)
   */
  image?: boolean | string;
  images?: (string | undefined)[];
}

/**
 * Figma: Components / `basic card_02` (4 variants)
 *   type   : text | thumbnail | none(element/card_none 294×244)
 *   status : normal | selected(stroke neutral-70 2px)
 *   props  : ♦ image · ♦ body text · ♦ tag · ♦ button/toggle · ♦ button_01 · ♦ button_02 · ♦ bottom text · ♦ bottom
 *   - text      : 이미지(294×126) / 내용 p10 gap8 / divider / bottom p10 (bottom text ↔ 버튼 양끝 정렬, 아이콘 10px)
 *   - thumbnail : 제목·부제 + 썸네일 2장(133×90, gap8) / divider / bottom p10 오른쪽 정렬(버튼 모두 secondary)
 */
export function BasicCard02(props: BasicCard02Props & { children?: ReactNode }) {
  const {
    type = 'text',
    image = true,
    images = [undefined, undefined],
    title,
    subtitle,
    body,
    tags,
    toggle,
    toggleLabel,
    onToggleClick,
    primaryAction,
    secondaryAction,
    bottomText,
    bottomIcon,
    emptyLabel,
    children,
    className,
    selected: _s,
    defaultSelected: _d,
    onSelectedChange: _o,
    selectable: _sel,
    ...rest
  } = props;
  const id = useId();
  const { selected, setSelected, selectable } = useCardSelection(props);

  if (type === 'none') {
    return <CardEmpty type="01" label={emptyLabel} className={cn('h-[244px] w-[294px]', className)} />;
  }

  const hasBottom = !!primaryAction || !!secondaryAction || (type === 'text' && bottomText != null);
  const content = selectable && hitContent;

  return (
    <article className={cn(frame(selected), className)} {...rest}>
      {selectable && <CardHitArea labelledBy={id} pressed={selected} onClick={() => setSelected(!selected)} />}

      {type === 'text' ? (
        <>
          {image !== false && (
            <ThumbnailVariable src={typeof image === 'string' ? image : undefined} className={cn('w-full', content)} />
          )}
          <div className={cn('flex flex-col gap-2 p-2.5', content)}>
            <div className="flex items-center gap-2">
              <TitleText id={id} title={title} subtitle={subtitle} />
              <ToggleButton toggle={toggle} label={toggleLabel} onClick={onToggleClick} />
            </div>
            {body != null && <p className="line-clamp-2 break-all text-body-5 text-neutral-70">{body}</p>}
            {tags && tags.length > 0 && <TagList tags={tags} />}
            {children}
          </div>
        </>
      ) : (
        <div className={cn('flex flex-col gap-2 p-2.5', content)}>
          <TitleText id={id} title={title} subtitle={subtitle} />
          {image !== false && images.length > 0 && (
            <div className="flex items-center gap-2">
              {images.map((src, i) => (
                <ThumbnailVariable key={i} src={src} className="h-[90px] w-auto min-w-0 flex-1" />
              ))}
            </div>
          )}
          {children}
        </div>
      )}

      {hasBottom && (
        <>
          <Divider />
          <div className={cn('flex items-center justify-between gap-2 p-2.5', content)}>
            {type === 'text' && <BottomText text={bottomText} icon={bottomIcon} iconSize="size-2.5" />}
            <span className="ml-auto">
              <Actions primary={primaryAction} secondary={secondaryAction} allSecondary={type === 'thumbnail'} />
            </span>
          </div>
        </>
      )}
    </article>
  );
}
