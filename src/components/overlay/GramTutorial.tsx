import { Fragment, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconArrowLeft } from '../../icons';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { IconButton } from '../IconButton';
import { IconSignIn } from './icons';
import { useControllable } from './useOverlayFocus';

/**
 * Figma: `gram_tutorial_Top` (27710:14111, gram Only) — 1184×32
 *   ♦ Left  : button_icon outlined h32 — arrow/ic_arrow_left (이전)
 *   ♦ Right : button_icon outlined h32 — arrow/ic_sign_in (튜토리얼 나가기)
 */
export interface GramTutorialTopProps {
  /** ♦ Left — 주면 왼쪽 이전 버튼 */
  onPrev?: () => void;
  /** ♦ Right — 주면 오른쪽 나가기 버튼 */
  onExit?: () => void;
  prevLabel?: string;
  exitLabel?: string;
  /** 가운데 내용 (선택) */
  children?: ReactNode;
  className?: string;
}

export function GramTutorialTop({ onPrev, onExit, prevLabel = '이전', exitLabel = '튜토리얼 나가기', children, className }: GramTutorialTopProps) {
  return (
    <div className={cn('flex h-8 w-full items-center justify-between gap-4', className)}>
      {onPrev ? <IconButton label={prevLabel} height="h32" icon={<IconArrowLeft />} onClick={onPrev} /> : <span className="size-8" />}
      {children != null && <div className="min-w-0 flex-1 text-center text-body-3 text-neutral-100">{children}</div>}
      {onExit ? <IconButton label={exitLabel} height="h32" icon={<IconSignIn />} onClick={onExit} /> : <span className="size-8" />}
    </div>
  );
}

/* ------------------------------------------------------------------------ */

/**
 * Figma: `gram_tutorial_Bottom` (27710:14105, gram Only) — 1184×45, 3열(388 | 408 | 388) SPACE_BETWEEN
 *   ♦ chckbox : checkbox_label "다시 보지 않기"
 *   버튼      : button h33 200×45 (p 12/10) — [secondary 취소][primary 다음], gap 8
 *   ♦ step    : step type 01 — element/number_large_step 24 원형 + 구분선 67px neutral-40, gap 5.36
 *               active  : bg neutral-100, 10px Bold neutral-10
 *               default : bg neutral-20, 10px Regular neutral-70
 */
export interface GramTutorialBottomProps {
  /** ♦ step — 단계 수. 0이면 단계 표시 숨김 */
  steps?: number;
  /** 현재 단계 (1부터) */
  current?: number;
  /** ♦ chckbox — 다시 보지 않기. 문자열이면 라벨 교체 */
  dontShowAgain?: boolean | string;
  dontShowAgainChecked?: boolean;
  defaultDontShowAgainChecked?: boolean;
  onDontShowAgainChange?: (checked: boolean) => void;
  onCancel?: () => void;
  onNext?: () => void;
  cancelLabel?: string;
  nextLabel?: string;
  className?: string;
}

export function GramTutorialBottom({
  steps = 3,
  current = 1,
  dontShowAgain = true,
  dontShowAgainChecked,
  defaultDontShowAgainChecked = false,
  onDontShowAgainChange,
  onCancel,
  onNext,
  cancelLabel = '취소',
  nextLabel = '다음',
  className,
}: GramTutorialBottomProps) {
  const [dsa, setDsa] = useControllable(dontShowAgainChecked, defaultDontShowAgainChecked, onDontShowAgainChange);
  const big = 'h-[45px] w-[200px] max-w-full py-3';
  return (
    <div className={cn('grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4', className)}>
      <div className="flex justify-start">
        {dontShowAgain && (
          <Checkbox
            label={typeof dontShowAgain === 'string' ? dontShowAgain : '다시 보지 않기'}
            checked={dsa}
            onChange={(e) => setDsa(e.target.checked)}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        {onCancel && <Button variant="secondary" label={cancelLabel} onClick={onCancel} className={big} />}
        {onNext && <Button label={nextLabel} onClick={onNext} className={big} />}
      </div>

      <div className="flex justify-end">
        {steps > 0 && (
          <ol aria-label={`튜토리얼 ${steps}단계 중 ${current}단계`} className="flex items-center gap-[5.36px]">
            {Array.from({ length: steps }, (_, i) => {
              const n = i + 1;
              const active = n === current;
              return (
                <Fragment key={n}>
                  {i > 0 && <li aria-hidden className="h-px w-[67px] bg-neutral-40" />}
                  <li
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'inline-flex size-6 items-center justify-center rounded-full text-body-5',
                      active ? 'bg-neutral-100 font-bold text-neutral-10' : 'bg-neutral-20 text-neutral-70',
                    )}
                  >
                    {n}
                  </li>
                </Fragment>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}
