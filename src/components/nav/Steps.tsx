import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * 단계 상태. DS 베리언트는 default | active 두 가지뿐이라
 *   completed · current → active(채움),  upcoming → default 로 그립니다.
 *   (완료/현재 구분은 aria-current="step"과 스크린리더용 문구로 전달)
 */
export type StepStatus = 'completed' | 'current' | 'upcoming';

const statusOf = (i: number, current: number): StepStatus =>
  i < current ? 'completed' : i === current ? 'current' : 'upcoming';

const srStatus: Record<StepStatus, string> = { completed: '완료', current: '현재 단계', upcoming: '예정' };

/* ------------------------------------------------------------------------------------------------
 * element/number_large_step
 * ---------------------------------------------------------------------------------------------- */
export interface StepNumberProps {
  number: ReactNode;
  /** default | active (Figma: state) */
  state?: 'default' | 'active';
  /** 원 아래 라벨 (Figma: text=true) */
  label?: ReactNode;
  className?: string;
}

/**
 * Figma: `element/number_large_step` (4 variants) — state default | active · text true | false
 *   원 24×24 (rounded-full)
 *     default : bg neutral-20, 숫자 12px Medium neutral-70
 *     active  : bg neutral-100, 숫자 12px Bold neutral-10
 *   라벨 : 원 아래 6px(y30), 가운데 정렬, 18px Medium neutral-70 (원보다 넓으면 양옆으로 넘침)
 */
export function StepNumber({ number, state = 'default', label, className }: StepNumberProps) {
  return (
    <span className={cn('relative inline-flex size-6 shrink-0', className)}>
      <span
        className={cn(
          'inline-flex size-6 items-center justify-center rounded-full text-body-4',
          state === 'active' ? 'bg-neutral-100 font-bold text-neutral-10' : 'bg-neutral-20 text-neutral-70',
        )}
      >
        {number}
      </span>
      {label != null && (
        <span className="absolute left-1/2 top-[30px] -translate-x-1/2 whitespace-nowrap text-body-2 text-neutral-70">
          {label}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------
 * step type 01 — 번호 원 + 연결선 + 라벨
 * ---------------------------------------------------------------------------------------------- */
export interface StepIndicatorProps {
  /** 단계 라벨 (Figma: type = 2 step … 10 step → 배열 길이) */
  steps: ReactNode[];
  /** 현재 단계 index (0부터) */
  current: number;
  /** 라벨 표시 (Figma: number_large_step text=true). 기본 true */
  showLabel?: boolean;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: `step type 01` (9 variants: 2 step … 10 step)
 *   가로 나열 gap 5.36(→5px): [원 24] [연결선 영역 67×47] [원 24] …
 *   연결선: 영역 상단 y12 에 1px(0.67 → 1px) neutral-40, 폭 67
 *   전체 높이 47 (원 24 + 6 + 라벨 25 − 겹침) — 라벨은 원 중심 기준 가운데 정렬
 */
export function StepIndicator({ steps, current, showLabel = true, className, ...aria }: StepIndicatorProps) {
  return (
    <ol aria-label={aria['aria-label'] ?? '진행 단계'} className={cn('flex items-start gap-[5px]', showLabel ? 'h-[47px]' : 'h-6', className)}>
      {steps.map((label, i) => {
        const st = statusOf(i, current);
        return (
          <li key={i} className="flex items-start gap-[5px]" aria-current={st === 'current' ? 'step' : undefined}>
            {i > 0 && <span aria-hidden className="mt-3 h-px w-[67px] shrink-0 bg-neutral-40" />}
            <StepNumber number={i + 1} state={st === 'upcoming' ? 'default' : 'active'} label={showLabel ? label : undefined} />
            <span className="sr-only">
              {!showLabel && label} ({srStatus[st]})
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------------------------------------
 * element/number_small_step + step type 02
 * ---------------------------------------------------------------------------------------------- */
/**
 * Figma: `element/number_small_step` (status default | active)
 *   18×18, 숫자 12px Bold — default: 배경 없음 neutral-100 / active: 원(r9) neutral-100 + 숫자 neutral-10
 */
export function StepNumberSmall({
  number,
  status = 'default',
  className,
}: {
  number: ReactNode;
  status?: 'default' | 'active';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex size-[18px] shrink-0 items-center justify-center rounded-full text-body-4 font-bold',
        status === 'active' ? 'bg-neutral-100 text-neutral-10' : 'text-neutral-100',
        className,
      )}
    >
      {number}
    </span>
  );
}

export interface StepBarProps {
  /** 전체 단계 수 (Figma: type = 2 step … 10 step) */
  total: number;
  /** 현재 단계 index (0부터) */
  current: number;
  /** 현재 단계 설명 (Figma: "Text Text Text…") */
  description?: ReactNode;
  /** 앞쪽 "Step N." 문구를 바꿀 때 (기본 `Step ${current+1}.`) */
  stepLabel?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

/**
 * Figma: `step type 02` (9 variants: 2 step … 10 step)
 *   h38 · p10 · bg neutral-20 · 폭은 부모 채움
 *   왼쪽 [Step N. 12px Bold neutral-70] gap6 [설명 12px Medium neutral-70]
 *   오른쪽 number_small_step 나열 gap 5.36(→5px) — 현재 단계만 active
 */
export function StepBar({ total, current, description, stepLabel, className, ...aria }: StepBarProps) {
  return (
    <div className={cn('flex h-[38px] w-full items-center gap-1.5 bg-neutral-20 p-2.5', className)}>
      <span className="shrink-0 whitespace-nowrap text-body-4 font-bold text-neutral-70">{stepLabel ?? `Step ${current + 1}.`}</span>
      <span className="min-w-0 flex-1 truncate text-body-4 text-neutral-70">{description}</span>
      <ol aria-label={aria['aria-label'] ?? '진행 단계'} className="flex shrink-0 items-center gap-[5px]">
        {Array.from({ length: total }, (_, i) => {
          const st = statusOf(i, current);
          return (
            <li key={i} aria-current={st === 'current' ? 'step' : undefined}>
              <StepNumberSmall number={i + 1} status={st === 'current' ? 'active' : 'default'} />
              <span className="sr-only"> ({srStatus[st]})</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
