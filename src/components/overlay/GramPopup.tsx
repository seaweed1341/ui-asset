import { useId, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconClose, IconProfile } from '../../icons';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';
import type { PopupAction } from '../Popup';
import { GramFileSelect, type GramFileSelectProps } from './GramFileSelect';
import {
  IconFavorite,
  IconFavoriteFill,
  IconLoadingDot,
  IconMonitor,
  IconNext,
  IconNull,
  IconPause,
  IconPhone,
  IconPlay,
  IconPrev,
  IconVoice,
} from './icons';
import { PopupThumbnail } from './PopupVariants';
import { useControllable, useOverlayFocus } from './useOverlayFocus';

/**
 * Figma: `gram_popup/popup` (27710:13991, gram Only) — 300×352, r5.4, stroke neutral-40 0.67px, bg neutral-10
 *   Top        : TitleBarBrowser(title_popup small) h33 p8 — bg neutral-70, 12px Bold neutral-10, 닫기 14 neutral-10
 *   body       : p 20/16, gap 8, 가운데 정렬
 *     텍스트_상단 : 12px Medium neutral-100 가운데 (+ text_icon: loading dot 18, gap 4)
 *     이미지      : gram_popup/content (슬롯)
 *     텍스트하단  : 12px Medium neutral-100 가운데
 *   체크박스   : p 0/16, checkbox_label "다시 보지 않기"
 *   button     : bottom_popup type=1 button — p16, primary h26 w210
 */
export interface GramPopupProps {
  open: boolean;
  onClose: () => void;
  /** 상단 바 제목 (Figma Top). null이면 상단 바 숨김 */
  title?: ReactNode | null;
  /** 텍스트_상단 */
  text?: ReactNode;
  /** text_icon — 상단 텍스트 앞 로딩 점 */
  loading?: boolean;
  /** 이미지 자리 (GramPopupContent 등) */
  children?: ReactNode;
  /** 텍스트하단 */
  bottomText?: ReactNode;
  /** 체크박스 — "다시 보지 않기". 문자열이면 라벨 교체 */
  dontShowAgain?: boolean | string;
  dontShowAgainChecked?: boolean;
  defaultDontShowAgainChecked?: boolean;
  onDontShowAgainChange?: (checked: boolean) => void;
  /** button — 하단 primary 버튼 (기본 라벨 '확인'). 생략하면 버튼 영역 숨김 */
  confirm?: PopupAction;
  /** 사용자의 확인이 꼭 필요한 경고성 팝업이면 alertdialog */
  role?: 'dialog' | 'alertdialog';
  width?: number;
  /** dim 없이 제자리에 그리기 (가이드 미리보기용) */
  inline?: boolean;
  className?: string;
}

export function GramPopup({
  open,
  onClose,
  title = 'LG gram Link',
  text,
  loading = false,
  children,
  bottomText,
  dontShowAgain = false,
  dontShowAgainChecked,
  defaultDontShowAgainChecked = false,
  onDontShowAgainChange,
  confirm,
  role = 'dialog',
  width = 300,
  inline = false,
  className,
}: GramPopupProps) {
  const titleId = useId();
  const textId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [dsa, setDsa] = useControllable(dontShowAgainChecked, defaultDontShowAgainChecked, onDontShowAgainChange);
  useOverlayFocus(ref, { open: open && !inline, onEscape: onClose, trap: true });

  if (!open) return null;

  const box = (
    <div
      ref={ref}
      role={role}
      aria-modal={!inline || undefined}
      aria-labelledby={title != null ? titleId : undefined}
      aria-describedby={text != null ? textId : undefined}
      tabIndex={-1}
      style={{ width }}
      className={cn(
        'flex max-w-full flex-col overflow-hidden rounded-[5.4px] bg-neutral-10 shadow-[inset_0_0_0_0.67px_var(--color-neutral-40)] outline-none',
        className,
      )}
    >
      {title != null && (
        <div className="flex items-center gap-2 bg-neutral-70 p-2">
          <h2 id={titleId} className="min-w-0 flex-1 text-body-4 font-bold text-neutral-10">
            {title}
          </h2>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="inline-flex size-3.5 shrink-0 text-neutral-10 [&>svg]:size-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-10"
          >
            <IconClose />
          </button>
        </div>
      )}

      <div className="flex flex-col items-center gap-2 px-4 py-5 text-center text-body-4 text-neutral-100">
        {text != null && (
          <div id={textId} className="flex items-center justify-center gap-1">
            {loading && (
              <IconLoadingDot
                size={18}
                className="shrink-0 animate-[spin_1s_steps(12,end)_infinite] motion-reduce:animate-none"
                role="presentation"
              />
            )}
            <p>{text}</p>
          </div>
        )}
        {children}
        {bottomText != null && <p>{bottomText}</p>}
      </div>

      {dontShowAgain && (
        <div className="px-4">
          <Checkbox
            label={typeof dontShowAgain === 'string' ? dontShowAgain : '다시 보지 않기'}
            checked={dsa}
            onChange={(e) => setDsa(e.target.checked)}
          />
        </div>
      )}

      {confirm && (
        <div className="flex justify-center p-4">
          <Button height="h26" label={confirm.label || '확인'} onClick={confirm.onClick} disabled={confirm.disabled} className="w-[210px]" />
        </div>
      )}
    </div>
  );

  if (inline) return box;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dimmer p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      {box}
    </div>
  );
}

/* ======================================================================== */

/**
 * Figma: `gram_popup/content` (27710:14001, gram Only, 12 variants) — GramPopup 본문 슬롯
 *   Property 1 → variant
 *     image       : thumbnail 247×120 (bg neutral-20)
 *     device      : .gram Link_아이콘메뉴 120×122 ×2, gap 7 — p 24/0, gap 5.36, stroke neutral-40 0.67, 아이콘 52 + 12px Medium neutral-70
 *     QR          : 126×108 프레임 안 QR 이미지 100×86
 *     Num → code  : 40×40 칸 ×4, gap 12, stroke neutral-70 1px, 23px Medium (body-1); 컨테이너 p 24/0
 *     숫자 → number : 40px Bold (heading-1) "1 2 3 4"
 *     progress    : progress bar_line — 라벨/퍼센트 (raw 9.38px → body-5 10px) + 3px 막대 neutral-20; p 24/0
 *     multi_image : gram_fileselect 124×80 2×2
 *     약관 → terms  : 247×92, r5.4, stroke neutral-20 0.67, p 4/0, 10px Regular neutral-100 가운데, 스크롤
 *     input       : avarta 28 + input_text h24(160) + 확인 버튼(secondary h26), gap 8
 *     플레이어 → player : 헤더(ic 20 + 10px) · 커버 80 + 곡명 15px Medium/가수 12px Medium neutral-70 · 진행 4px
 *                   (raw #354056 → primary-90) + 시간 10px · 컨트롤 prev24 / play·pause 36 / next24, gap 12
 *     list        : checkbox_label ×n, gap 8 (첫 줄 = 모두 선택)
 *     의견작성 → feedback : 언어 선택(radio_label gap12, 아래 구분선 neutral-20, pb24) · 별점 36 ×5 · 의견 입력 248×68
 *   아이콘 raw #000000 → neutral-100
 */
export type GramPopupContentProps =
  | { variant: 'image'; src?: string; alt?: string; className?: string }
  | { variant: 'device'; devices?: GramDevice[]; className?: string }
  | { variant: 'qr'; src?: string; alt?: string; className?: string }
  | { variant: 'code'; code?: string; length?: number; label?: string; className?: string }
  | { variant: 'number'; code: string; label?: string; className?: string }
  | { variant: 'progress'; label?: ReactNode; value: number; className?: string }
  | { variant: 'multiImage'; files: GramFileSelectProps[]; className?: string }
  | { variant: 'terms'; children: ReactNode; label?: string; className?: string }
  | {
      variant: 'input';
      value?: string;
      defaultValue?: string;
      onValueChange?: (v: string) => void;
      placeholder?: string;
      onSubmit?: (v: string) => void;
      submitLabel?: string;
      inputLabel?: string;
      className?: string;
    }
  | {
      variant: 'player';
      deviceName?: ReactNode;
      title: ReactNode;
      artist?: ReactNode;
      coverSrc?: string;
      /** 0~100 */
      progress?: number;
      elapsed?: ReactNode;
      playing?: boolean;
      defaultPlaying?: boolean;
      onPlayingChange?: (playing: boolean) => void;
      onPrev?: () => void;
      onNext?: () => void;
      className?: string;
    }
  | {
      variant: 'list';
      options: { value: string; label: ReactNode }[];
      allLabel?: ReactNode;
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (v: string[]) => void;
      className?: string;
    }
  | {
      variant: 'feedback';
      languageLabel?: ReactNode;
      languages?: { value: string; label: ReactNode }[];
      language?: string;
      defaultLanguage?: string;
      onLanguageChange?: (v: string) => void;
      ratingLabel?: ReactNode;
      rating?: number;
      defaultRating?: number;
      onRatingChange?: (v: number) => void;
      comment?: string;
      defaultComment?: string;
      onCommentChange?: (v: string) => void;
      commentPlaceholder?: string;
      maxLength?: number;
      className?: string;
    };

export interface GramDevice {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
}

const DEFAULT_DEVICES: GramDevice[] = [
  { value: 'mobile', label: '모바일 기기', icon: <IconPhone /> },
  { value: 'webos', label: 'LG webOS 기기', icon: <IconMonitor /> },
];

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70';

export function GramPopupContent(props: GramPopupContentProps) {
  const base = cn('w-[247px] max-w-full text-left', props.className);
  switch (props.variant) {
    case 'image':
      return <PopupThumbnail src={props.src} alt={props.alt} height={120} className={base} />;

    case 'device':
      return (
        <div className={cn(base, 'flex gap-[7px]')}>
          {(props.devices ?? DEFAULT_DEVICES).map((d) => (
            <button
              key={d.value}
              type="button"
              onClick={d.onClick}
              className={cn(
                'flex h-[122px] flex-1 flex-col items-center justify-center gap-[5.36px] py-6 shadow-[inset_0_0_0_0.67px_var(--color-neutral-40)]',
                'hover:bg-neutral-20 active:bg-neutral-20',
                focusRing,
              )}
            >
              <span aria-hidden className="inline-flex size-[52px] text-neutral-100 [&>svg]:size-full">
                {d.icon ?? <IconNull />}
              </span>
              <span className="text-body-4 text-neutral-70">{d.label}</span>
            </button>
          ))}
        </div>
      );

    case 'qr':
      return (
        <div className={cn('flex h-[108px] w-[126px] items-center justify-center', props.className)}>
          <PopupThumbnail src={props.src} alt={props.alt ?? 'QR 코드'} height={86} className="w-[100px] object-contain" />
        </div>
      );

    case 'code': {
      const len = props.length ?? 4;
      const chars = (props.code ?? '').slice(0, len).padEnd(len, ' ').split('');
      return (
        <div role="group" aria-label={props.label ?? '인증 번호'} className={cn(base, 'flex justify-center gap-3 py-6')}>
          {chars.map((c, i) => (
            <span
              key={i}
              className="inline-flex size-10 items-center justify-center text-body-1 text-neutral-100 shadow-[inset_0_0_0_1px_var(--color-neutral-70)]"
            >
              {c.trim()}
            </span>
          ))}
        </div>
      );
    }

    case 'number':
      return (
        <p aria-label={props.label} className={cn(base, 'text-center text-heading-1 tracking-normal text-neutral-100')}>
          {props.code.split('').join(' ')}
        </p>
      );

    case 'progress': {
      const v = Math.max(0, Math.min(100, props.value));
      return (
        <div className={cn(base, 'flex flex-col gap-[5.4px] py-6')}>
          <div className="flex justify-between gap-[5.4px] text-body-5 text-neutral-70">
            <span>{props.label ?? 'Label'}</span>
            <span aria-hidden>{Math.round(v)}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(v)}
            aria-label={typeof props.label === 'string' ? props.label : '진행률'}
            className="h-[3px] overflow-hidden rounded-full bg-neutral-20"
          >
            <div className="h-full rounded-full bg-neutral-70 transition-[width] motion-reduce:transition-none" style={{ width: `${v}%` }} />
          </div>
        </div>
      );
    }

    case 'multiImage':
      return (
        <div className={cn(base, 'grid w-[248px] grid-cols-2')}>
          {props.files.slice(0, 4).map((f, i) => (
            <GramFileSelect key={i} width={124} height={80} {...f} />
          ))}
        </div>
      );

    case 'terms':
      return (
        <div
          tabIndex={0}
          role="region"
          aria-label={props.label ?? '약관'}
          className={cn(
            base,
            'max-h-[92px] min-h-[92px] overflow-y-auto rounded-[5.4px] px-2 py-1 text-center text-body-5 text-neutral-100 shadow-[inset_0_0_0_0.67px_var(--color-neutral-20)]',
            focusRing,
          )}
        >
          {props.children}
        </div>
      );

    case 'input':
      return <GramContentInput {...props} className={base} />;

    case 'player':
      return <GramContentPlayer {...props} className={base} />;

    case 'list':
      return <GramContentList {...props} className={base} />;

    case 'feedback':
      return <GramContentFeedback {...props} className={cn(base, 'w-[248px]')} />;
  }
}

/* ---- variant 구현 -------------------------------------------------------- */

type Of<V extends GramPopupContentProps['variant']> = Extract<GramPopupContentProps, { variant: V }>;

function GramContentInput({ value, defaultValue = '', onValueChange, placeholder = '새 이름', onSubmit, submitLabel = '확인', inputLabel = '이름', className }: Of<'input'>) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  return (
    <form
      className={cn('flex items-center gap-2', className)}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(v);
      }}
    >
      <span aria-hidden className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-20 text-neutral-70 [&>svg]:size-3">
        <IconProfile />
      </span>
      <input
        aria-label={inputLabel}
        value={v}
        placeholder={placeholder}
        onChange={(e) => setV(e.target.value)}
        className="h-6 min-w-0 flex-1 bg-neutral-10 px-2 py-[5px] text-body-5 text-neutral-100 outline-none ring-1 ring-inset ring-neutral-40 placeholder:text-neutral-40 focus:ring-neutral-70"
      />
      <Button type="submit" variant="secondary" height="h26" label={submitLabel} className="h-[26px] shrink-0" />
    </form>
  );
}

function GramContentPlayer({
  deviceName = '디바이스1 소리듣기',
  title,
  artist,
  coverSrc,
  progress = 0,
  elapsed,
  playing,
  defaultPlaying = false,
  onPlayingChange,
  onPrev,
  onNext,
  className,
}: Of<'player'>) {
  const [on, setOn] = useControllable(playing, defaultPlaying, onPlayingChange);
  const p = Math.max(0, Math.min(100, progress));
  const ctrl = cn('inline-flex shrink-0 text-neutral-100 [&>svg]:size-full', focusRing);
  return (
    <div className={cn('flex flex-col gap-[7px]', className)}>
      <div className="flex items-center justify-center gap-1 text-body-5 text-neutral-100">
        <span aria-hidden className="inline-flex size-5 [&>svg]:size-full">
          <IconNull />
        </span>
        {deviceName}
      </div>
      <div className="flex gap-4 py-3">
        <PopupThumbnail src={coverSrc} alt="" height={80} className="w-20 shrink-0" />
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <p className="truncate text-body-3 text-neutral-100">{title}</p>
            {artist != null && <p className="truncate text-body-4 text-neutral-70">{artist}</p>}
          </div>
          <span aria-hidden className={cn('inline-flex size-5 self-end text-neutral-100 [&>svg]:size-full', !on && 'opacity-40')}>
            <IconVoice />
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div
          role="progressbar"
          aria-label="재생 위치"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(p)}
          className="h-1 overflow-hidden rounded-full bg-neutral-20"
        >
          <div className="h-full rounded-full bg-primary-90" style={{ width: `${p}%` }} />
        </div>
        <div className="flex justify-between gap-2 text-body-5 text-neutral-70">
          <span>{elapsed ?? '00:00'}</span>
          <span>{Math.round(p)}%</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button type="button" aria-label="이전 곡" onClick={onPrev} className={cn(ctrl, 'size-6')}>
          <IconPrev />
        </button>
        <button type="button" aria-label={on ? '일시정지' : '재생'} aria-pressed={on} onClick={() => setOn(!on)} className={cn(ctrl, 'size-9')}>
          {on ? <IconPause /> : <IconPlay />}
        </button>
        <button type="button" aria-label="다음 곡" onClick={onNext} className={cn(ctrl, 'size-6')}>
          <IconNext />
        </button>
      </div>
    </div>
  );
}

function GramContentList({ options, allLabel = '모두 선택', value, defaultValue = [], onValueChange, className }: Of<'list'>) {
  const [sel, setSel] = useControllable(value, defaultValue, onValueChange);
  const values = options.map((o) => o.value);
  const all = values.length > 0 && values.every((v) => sel.includes(v));
  const some = !all && values.some((v) => sel.includes(v));
  return (
    <div role="group" className={cn('flex flex-col gap-2', className)}>
      {allLabel != null && (
        <Checkbox label={allLabel} checked={all} indeterminate={some} onChange={() => setSel(all ? [] : values)} className="self-start" />
      )}
      {options.map((o) => (
        <Checkbox
          key={o.value}
          label={o.label}
          checked={sel.includes(o.value)}
          onChange={(e) => setSel(e.target.checked ? [...sel, o.value] : sel.filter((v) => v !== o.value))}
          className="self-start"
        />
      ))}
    </div>
  );
}

function GramContentFeedback({
  languageLabel = '의견 작성에 사용할 언어를 선택해 주세요.',
  languages = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: '영어' },
  ],
  language,
  defaultLanguage,
  onLanguageChange,
  ratingLabel = 'LG gram Link는 어떠셨나요?',
  rating,
  defaultRating = 0,
  onRatingChange,
  comment,
  defaultComment = '',
  onCommentChange,
  commentPlaceholder = 'LG gram Link에 대한 의견을 자유롭게 남겨주세요.',
  maxLength = 100,
  className,
}: Of<'feedback'>) {
  const groupName = useId();
  const langId = useId();
  const rateId = useId();
  const [lang, setLang] = useControllable(language, defaultLanguage ?? languages[0]?.value ?? '', onLanguageChange);
  const [rate, setRate] = useControllable(rating, defaultRating, onRatingChange);
  const [text, setText] = useControllable(comment, defaultComment, onCommentChange);
  const [hover, setHover] = useState(0);
  const shown = hover || rate;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <div role="radiogroup" aria-labelledby={langId} className="flex flex-col items-center gap-4 border-b border-neutral-20 pb-6">
        <p id={langId} className="px-3 py-2 text-center text-body-4 font-bold text-neutral-100">
          {languageLabel}
        </p>
        <div className="flex gap-3">
          {languages.map((l) => (
            <Radio key={l.value} name={groupName} label={l.label} checked={lang === l.value} onChange={() => setLang(l.value)} />
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <p id={rateId} className="text-center text-body-4 text-neutral-100">
          {ratingLabel}
        </p>
        <div role="radiogroup" aria-labelledby={rateId} className="flex gap-[9.33px]" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rate === n}
              aria-label={`${n}점`}
              tabIndex={rate === n || (rate === 0 && n === 1) ? 0 : -1}
              onMouseEnter={() => setHover(n)}
              onClick={() => setRate(n)}
              onKeyDown={(e) => {
                const next = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? Math.min(5, n + 1) : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? Math.max(1, n - 1) : 0;
                if (next) {
                  e.preventDefault();
                  setRate(next);
                  (e.currentTarget.parentElement?.children[next - 1] as HTMLElement | undefined)?.focus();
                }
              }}
              className={cn('inline-flex size-9 text-neutral-100 [&>svg]:size-full', focusRing)}
            >
              {n <= shown ? <IconFavoriteFill /> : <IconFavorite />}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-0.5">
        <textarea
          aria-label="의견"
          value={text}
          maxLength={maxLength}
          placeholder={commentPlaceholder}
          onChange={(e) => setText(e.target.value)}
          className="h-[68px] resize-none bg-neutral-10 px-2 py-[5px] text-body-5 text-neutral-100 outline-none ring-1 ring-inset ring-neutral-40 placeholder:text-neutral-40 focus:ring-neutral-70"
        />
        <p className="px-2 text-right text-body-6 text-neutral-70" aria-live="polite">
          {text.length} / {maxLength}
        </p>
      </div>
    </div>
  );
}
