import { useId, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconAdd } from '../../icons';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { IconButton } from '../IconButton';
import { Radio } from '../Radio';
import { Tag } from '../Tag';
import { ArtworkDummy, ThumbnailVariable } from './Thumbnail';
import { CardHitArea, IconSlot, cardStroke, hitContent, stroke40a67, type CardAction } from './internal';

/* --------------------------------------------------------------------------
 * gallery card_L
 * -------------------------------------------------------------------------- */

export interface GalleryCardLProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /**
   * normal | buttonVer | buttonHor | buttonMix
   * (Figma: normal | button_ver | Button-hor | Button-mix)
   */
  type?: 'normal' | 'buttonVer' | 'buttonHor' | 'buttonMix';
  /** 이미지 주소. 없으면 normal은 이미지 자리표시, 나머지는 ic_artwork_dummy */
  image?: string;
  imageAlt?: string;
  /** 제목 (15px Bold neutral-100, 가운데) */
  title?: ReactNode;
  /** 설명 (12px Medium neutral-70, 가운데, 3줄) */
  description?: ReactNode;
  /** badge — 우상단 tag_text(medium, primary). 텍스트를 주면 표시 */
  badge?: ReactNode;
  /** 버튼(secondary h26, 오른쪽 ic_add). buttonVer·buttonHor 2개, buttonMix 3개 */
  actions?: CardAction[];
  /** radio/check — 좌상단(8,8) checkbox. 주면 표시 */
  checkbox?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /** 체크박스 접근성 이름 (기본: 제목 문자열) */
  checkboxLabel?: string;
}

/**
 * Figma: Components / `gallery card_L` (4 variants)
 *   type  : normal | button_ver | Button-hor | Button-mix
 *   props : badge · radio/check · Instance(체크 컨트롤 swap)
 *   - 290 폭, neutral-10 바탕, stroke neutral-40 1px
 *   - normal : 이미지 영역 p10(thumbnail_variable 270×145) + 내용 p20·16 gap12
 *   - button_* : 이미지 영역 neutral-20(132 / Button-hor 164) + 내용 + 버튼(세로 210폭 gap6 / 가로 gap6 / 혼합)
 *   - 배지 tag_text medium: top 10 · right 10 / 체크박스: top 8 · left 8
 */
export function GalleryCardL({
  type = 'normal',
  image,
  imageAlt,
  title,
  description,
  badge,
  actions = [],
  checkbox,
  checked,
  defaultChecked,
  onCheckedChange,
  checkboxLabel,
  className,
  ...rest
}: GalleryCardLProps) {
  const btn = (a: CardAction, i: number, cls?: string) => (
    <Button
      key={i}
      variant="secondary"
      height="h26"
      label={a.label}
      icon={<IconAdd />}
      iconPosition="right"
      onClick={a.onClick}
      disabled={a.disabled}
      className={cn('min-w-0', cls)}
    />
  );

  return (
    <article className={cn('relative flex w-[290px] flex-col bg-neutral-10', cardStroke, 'after:border-neutral-40', className)} {...rest}>
      {type === 'normal' ? (
        <div className="p-2.5">
          <ThumbnailVariable src={image} alt={imageAlt} className="h-[145px] w-full" />
        </div>
      ) : (
        <ThumbnailVariable
          type={image ? 'default' : 'none'}
          src={image}
          alt={imageAlt}
          className={cn('w-full', type === 'buttonHor' ? 'h-[164px]' : 'h-[132px]')}
        />
      )}
      {badge != null && <Tag label={badge} className="absolute right-2.5 top-2.5 z-[4]" />}
      {checkbox && (
        <Checkbox
          aria-label={checkboxLabel ?? (typeof title === 'string' ? title : '선택')}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="absolute left-2 top-2 z-[4]"
        />
      )}

      <div className="flex flex-col gap-3 px-4 py-5">
        <div className="flex flex-col gap-2.5 text-center">
          {title != null && <h3 className="text-body-3 font-bold text-neutral-100">{title}</h3>}
          {description != null && <p className="line-clamp-3 break-all text-body-4 text-neutral-70">{description}</p>}
        </div>
        {type === 'buttonVer' && actions.length > 0 && (
          <div className="flex flex-col items-center gap-1.5">{actions.slice(0, 2).map((a, i) => btn(a, i, 'w-[210px]'))}</div>
        )}
        {type === 'buttonHor' && actions.length > 0 && (
          <div className="flex gap-1.5">{actions.slice(0, 2).map((a, i) => btn(a, i, 'flex-1'))}</div>
        )}
        {type === 'buttonMix' && actions.length > 0 && (
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex w-full gap-1.5">{actions.slice(0, 2).map((a, i) => btn(a, i, 'flex-1'))}</div>
            {actions[2] && btn(actions[2], 2, 'w-[210px]')}
          </div>
        )}
      </div>
    </article>
  );
}

/* --------------------------------------------------------------------------
 * gallery card_S
 * -------------------------------------------------------------------------- */

type ControlInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'title'>;

export interface GalleryCardSProps extends ControlInputProps {
  /** ♦ check/radio + check/radio(swap): radio(기본) | checkbox | none */
  control?: 'radio' | 'checkbox' | 'none';
  /** artwork_icon(swap) — 가운데 42px 그림. 기본 ic_artwork_dummy */
  artwork?: ReactNode;
  /** ♦ text — 제목 (10px Bold neutral-70, 가운데) */
  title?: ReactNode;
  /** ♦ body text — 본문 (10px Regular neutral-70, 가운데) */
  body?: ReactNode;
  /** ♦ icon button — 우상단 button_icon(21px) */
  iconButton?: ReactNode | boolean;
  iconButtonLabel?: string;
  onIconButtonClick?: () => void;
  /** control="none"일 때 카드 클릭 */
  onCardClick?: () => void;
  /** 루트 요소 className (나머지 props는 내부 input으로 전달) */
  className?: string;
}

/**
 * Figma: Components / `gallery card_S` (3 variants)
 *   status : normal | over(:hover — 바탕 neutral-20 + 글자 밑줄) | pressed(:active — 바탕 neutral-20)
 *   props  : ♦ check/radio · check/radio(swap) · artwork_icon(swap) · ♦ icon button · button(swap) · ♦ text · ♦ body text
 *   - 134×147, p18·12 gap8, stroke neutral-40 @67%, 반경 0
 *   - 라디오/체크박스는 카드 전체를 덮는 label이라 카드 어디를 눌러도 선택됩니다. name·value·checked 등은 input으로 전달.
 */
export function GalleryCardS({
  control = 'radio',
  artwork,
  title,
  body,
  iconButton,
  iconButtonLabel = '더보기',
  onIconButtonClick,
  onCardClick,
  className,
  disabled,
  ...inputProps
}: GalleryCardSProps) {
  const id = useId();
  const ariaLabel = typeof title === 'string' ? title : undefined;

  return (
    <div
      className={cn(
        'group/card relative flex w-[134px] flex-col items-center gap-2 bg-neutral-10 px-3 py-[18px] transition-colors',
        cardStroke,
        stroke40a67,
        !disabled && 'hover:bg-neutral-20 has-[:active]:bg-neutral-20',
        disabled && 'opacity-40',
        className,
      )}
    >
      {control === 'radio' && (
        <Radio
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : id}
          disabled={disabled}
          {...inputProps}
          className="absolute inset-0 z-[1] items-start p-2 opacity-100"
        />
      )}
      {control === 'checkbox' && (
        <Checkbox
          aria-label={ariaLabel}
          aria-labelledby={ariaLabel ? undefined : id}
          disabled={disabled}
          {...inputProps}
          className="absolute inset-0 z-[1] items-start p-2 opacity-100"
        />
      )}
      {control === 'none' && onCardClick && <CardHitArea labelledBy={id} onClick={onCardClick} disabled={disabled} />}

      <div className={cn('flex w-full flex-col items-center gap-2', hitContent)}>
        <IconSlot className="size-[42px]">{artwork ?? <ArtworkDummy className="size-full" label="" />}</IconSlot>
        {(title != null || body != null) && (
          <div className="flex w-full flex-col gap-[5px] text-center text-neutral-70 group-hover/card:underline group-has-[:active]/card:no-underline">
            {title != null && (
              <p id={id} className="break-all text-body-5 font-bold">
                {title}
              </p>
            )}
            {body != null && <p className="break-all text-body-5">{body}</p>}
          </div>
        )}
      </div>

      {iconButton && (
        <IconButton
          label={iconButtonLabel}
          height="h24"
          icon={iconButton === true ? undefined : iconButton}
          onClick={onIconButtonClick}
          disabled={disabled}
          className="absolute right-[7px] top-2 z-[4] size-[21px] p-1"
        />
      )}
    </div>
  );
}
