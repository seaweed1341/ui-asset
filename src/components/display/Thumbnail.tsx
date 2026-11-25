import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconButton } from '../IconButton';
import { IconContentFill, IconFullscreen, IconMulti, IconPlay } from './icons';
import { IconSlot } from './internal';

/* --------------------------------------------------------------------------
 * ic_artwork_dummy
 * -------------------------------------------------------------------------- */

/**
 * Figma: Components / `ic_artwork_dummy` (64×64, 이미지 채우기)
 *   이미지가 없을 때 쓰는 "IMG" 자리표시 그림. 원본은 비트맵이라 SVG로 다시 그렸습니다.
 *   (raw 회색 바탕 → neutral-40·neutral-20 50% 혼합, 대각선 → neutral-40, 글자 → neutral-70 @60%)
 */
export function ArtworkDummy({ className, label = '이미지 없음' }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={label} className={cn('size-16 shrink-0', className)}>
      <rect width="64" height="64" className="fill-[color-mix(in_srgb,var(--color-neutral-40)_50%,var(--color-neutral-20))]" />
      <path d="M0 0L64 64M64 0L0 64" className="stroke-neutral-40" strokeWidth="1.5" />
      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fontFamily="ui-monospace, Menlo, monospace"
        className="fill-neutral-70 opacity-60"
      >
        IMG
      </text>
    </svg>
  );
}

/** 이미지 자리표시(회색 바탕 + X) — Figma 썸네일의 기본 placeholder 이미지 */
function ImagePlaceholder() {
  return (
    <svg aria-hidden className="absolute inset-0 size-full bg-neutral-20 text-neutral-40" preserveAspectRatio="none" viewBox="0 0 100 100">
      <path d="M0 0L100 100M100 0L0 100" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" fill="none" />
    </svg>
  );
}

function ThumbImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return <ImagePlaceholder />;
  return <img src={src} alt={alt ?? ''} className="absolute inset-0 size-full object-cover" />;
}

/* --------------------------------------------------------------------------
 * 공통 오버레이
 * -------------------------------------------------------------------------- */

export interface ThumbnailAction {
  /** 스크린리더용 이름 */
  label: string;
  /** 생략하면 ic_fullscreen */
  icon?: ReactNode;
  onClick?: () => void;
}

function ActionBar({ actions, size }: { actions: ThumbnailAction[]; size: 20 | 24 }) {
  return (
    <span className={cn('absolute bottom-1.5 right-1.5 z-[1] flex items-start', size === 20 ? 'gap-[5px]' : 'gap-1')}>
      {actions.map((a, i) => (
        <button
          key={i}
          type="button"
          aria-label={a.label}
          title={a.label}
          onClick={a.onClick}
          className={cn(
            'inline-flex items-center justify-center text-neutral-100 [&>svg]:size-full',
            'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70',
            size === 20 ? 'size-5' : 'size-6',
          )}
        >
          {a.icon ?? <IconFullscreen />}
        </button>
      ))}
    </span>
  );
}

function TopIcons({ multi, multi2, size }: { multi?: IconProp; multi2?: IconProp; size: 20 | 24 }) {
  const a = resolveIcon(multi, <IconMulti />);
  const b = resolveIcon(multi2, <IconMulti />);
  if (!a && !b) return null;
  const cls = size === 20 ? 'size-5' : 'size-6';
  return (
    <span aria-hidden className="absolute right-1.5 top-1.5 z-[1] flex items-center gap-1 text-neutral-100">
      {a && <IconSlot className={cls}>{a}</IconSlot>}
      {b && <IconSlot className={cls}>{b}</IconSlot>}
    </span>
  );
}

/* --------------------------------------------------------------------------
 * thumbnail_16:9
 * -------------------------------------------------------------------------- */

export interface Thumbnail16x9Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** image | video | icon | none */
  type?: 'image' | 'video' | 'icon' | 'none';
  /** landscape(147×90) | portrait(147×242) */
  orientation?: 'landscape' | 'portrait';
  /** 이미지 주소 (type image · video). 없으면 회색 X 자리표시 */
  src?: string;
  alt?: string;
  /** ♦ img — type icon/none일 때 가운데 그림. true=기본(ic_content_fill / ic_artwork_dummy), ReactNode=교체 */
  img?: IconProp;
  /** ♦ text — type icon/none일 때 가운데 텍스트 (12px Medium) */
  text?: ReactNode;
  /** ♦ duration — type video 우하단 재생 시간 */
  duration?: ReactNode;
  /** ♦ action — 우하단 아이콘 버튼들(20×20, 기본 ic_fullscreen) */
  actions?: ThumbnailAction[];
  /** multi / multi2 — 우상단 아이콘(기본 ic_multi) */
  multi?: IconProp;
  multi2?: IconProp;
  /** type video 가운데 재생 버튼 클릭 */
  onPlay?: () => void;
  /** 재생 버튼 접근성 이름 */
  playLabel?: string;
}

/**
 * Figma: Components / `thumbnail_16:9` (8 variants)
 *   type        : image | video | icon | none
 *   orientation : landscape(147×90) | portrait(147×242)
 *   props       : ♦ action · ♦ duration · ♦ text · ♦ img · multi · multi2 · icon/icon2(swap)
 *   - icon/none : 바탕 neutral-20, 가운데 ic_content_fill 32px(neutral-70) / ic_artwork_dummy 24px
 *   - video     : 이미지 위 neutral-40 + 가운데 button_icon(outlined h32, ic_play)
 *   - duration  : 29×13, 좌상단만 r5.36, neutral-70 바탕, 10px Regular neutral-10
 *   너비는 className(w-*)으로 바꿀 수 있고 높이는 비율을 따라갑니다.
 */
export function Thumbnail16x9({
  type = 'image',
  orientation = 'landscape',
  src,
  alt,
  img = true,
  text,
  duration,
  actions,
  multi,
  multi2,
  onPlay,
  playLabel = '재생',
  className,
  ...rest
}: Thumbnail16x9Props) {
  const center =
    type === 'icon' || type === 'none'
      ? resolveIcon(img, type === 'icon' ? <IconContentFill /> : <ArtworkDummy className="size-full" />)
      : null;

  return (
    <div
      className={cn(
        'relative w-[147px] shrink-0 overflow-hidden',
        orientation === 'landscape' ? 'aspect-[147/90]' : 'aspect-[147/242]',
        (type === 'icon' || type === 'none') && 'bg-neutral-20',
        className,
      )}
      {...rest}
    >
      {(type === 'image' || type === 'video') && <ThumbImage src={src} alt={alt} />}
      {type === 'video' && <span aria-hidden className="absolute inset-0 bg-neutral-40" style={src ? { opacity: 0.6 } : undefined} />}

      {(type === 'icon' || type === 'none') && (center || text) && (
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          {center && (
            <IconSlot className={cn('text-neutral-70', type === 'icon' ? 'size-8' : 'size-6')}>{center}</IconSlot>
          )}
          {text && <span className="text-center text-body-4 text-neutral-70">{text}</span>}
        </span>
      )}

      {type === 'video' && (
        <span className="absolute inset-0 flex items-center justify-center">
          {onPlay ? (
            <IconButton label={playLabel} icon={<IconPlay />} onClick={onPlay} />
          ) : (
            <span aria-hidden className="inline-flex size-8 items-center justify-center bg-neutral-10 p-1.5 text-neutral-100 ring-1 ring-inset ring-neutral-40 [&>svg]:size-full">
              <IconPlay />
            </span>
          )}
        </span>
      )}

      <TopIcons multi={multi} multi2={multi2} size={20} />
      {actions && actions.length > 0 && <ActionBar actions={actions} size={20} />}

      {type === 'video' && duration != null && (
        <span className="absolute bottom-px right-px z-[1] inline-flex h-[13px] min-w-[29px] items-center justify-center rounded-tl-[5.36px] bg-neutral-70 px-0.5 text-body-5 leading-none text-neutral-10">
          {duration}
        </span>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * thumbnail_1:1
 * -------------------------------------------------------------------------- */

export interface Thumbnail1x1Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** default(이미지) | none(ic_artwork_dummy) */
  type?: 'default' | 'none';
  src?: string;
  alt?: string;
}

/**
 * Figma: Components / `thumbnail_1:1` (2 variants)
 *   type : default(이미지) | none(neutral-20 + ic_artwork_dummy 61%)
 *   90×90, stroke neutral-20 1px(inside). 크기는 className(size-*)으로 바꿉니다.
 */
export function Thumbnail1x1({ type = 'default', src, alt, className, ...rest }: Thumbnail1x1Props) {
  return (
    <div
      className={cn(
        'relative size-[90px] shrink-0 overflow-hidden',
        "after:pointer-events-none after:absolute after:inset-0 after:border after:border-neutral-20 after:content-['']",
        type === 'none' && 'bg-neutral-20',
        className,
      )}
      {...rest}
    >
      {type === 'default' ? (
        <ThumbImage src={src} alt={alt} />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center">
          <ArtworkDummy className="size-[61%]" label={alt} />
        </span>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * thumbnail_variable
 * -------------------------------------------------------------------------- */

export interface ThumbnailVariableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** default(이미지) | none(neutral-20 + 가운데 그림/텍스트) */
  type?: 'default' | 'none';
  src?: string;
  alt?: string;
  /** ♦ img — type none 가운데 그림(기본 ic_artwork_dummy 43px) */
  img?: IconProp;
  /** ♦ text — type none 가운데 텍스트 */
  text?: ReactNode;
  /** actions — 우하단 아이콘 버튼(24×24) */
  actions?: ThumbnailAction[];
  multi?: IconProp;
  multi2?: IconProp;
}

/**
 * Figma: Components / `thumbnail_variable` (2 variants)
 *   type : default | none
 *   기본 207×126이지만 카드 안에서는 가로를 꽉 채우고 높이만 지정해 씁니다(w-full + h-*).
 *   props : ♦ text · ♦ img · actions · multi · multi 2
 */
export function ThumbnailVariable({
  type = 'default',
  src,
  alt,
  img = true,
  text,
  actions,
  multi,
  multi2,
  className,
  ...rest
}: ThumbnailVariableProps) {
  const center = type === 'none' ? resolveIcon(img, <ArtworkDummy className="size-full" />) : null;
  return (
    <div
      className={cn('relative h-[126px] w-[207px] shrink-0 overflow-hidden', type === 'none' && 'bg-neutral-20', className)}
      {...rest}
    >
      {type === 'default' && <ThumbImage src={src} alt={alt} />}
      {type === 'none' && (center || text) && (
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          {center && <IconSlot className="size-[43px]">{center}</IconSlot>}
          {text && <span className="text-center text-body-4 text-neutral-70">{text}</span>}
        </span>
      )}
      <TopIcons multi={multi} multi2={multi2} size={24} />
      {actions && actions.length > 0 && <ActionBar actions={actions} size={24} />}
    </div>
  );
}
