import { useCallback, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** 제어(value) + 비제어(defaultValue) 겸용 상태 */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState<T>(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = useCallback(
    (v: T) => {
      if (value === undefined) setInner(v);
      onChange?.(v);
    },
    [value, onChange],
  );
  return [current, set] as const;
}

/** 공통 포커스 링 */
export const focusRing =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-70';

/**
 * 카드 외곽선. Figma stroke는 inside라서 레이아웃을 밀지 않도록 ::after 오버레이로 그립니다.
 * (자식 썸네일이 테두리를 덮지 않도록 z-index도 위에 둡니다.)
 */
export const cardStroke =
  "after:pointer-events-none after:absolute after:inset-0 after:z-[3] after:rounded-[inherit] after:border after:content-['']";

/** stroke neutral-40 @ 67% (Figma: m-neutral-40, opacity 0.67) */
export const stroke40a67 = 'after:border-[color-mix(in_srgb,var(--color-neutral-40)_67%,transparent)]';

/**
 * 카드 전체를 덮는 클릭 영역(stretched button).
 * 카드 안에 다른 버튼이 있어도 중첩 없이 카드 선택/클릭을 지원합니다.
 * 내용 영역에는 `hitContent`를 붙여 클릭이 이 버튼으로 통과되게 하세요.
 */
export function CardHitArea({
  label,
  pressed,
  onClick,
  disabled,
  labelledBy,
}: {
  label?: string;
  labelledBy?: string;
  pressed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-labelledby={label ? undefined : labelledBy}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'absolute inset-0 z-[1] rounded-[inherit] disabled:cursor-not-allowed',
        'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70',
      )}
    />
  );
}

/** CardHitArea 위에 올라가는 내용: 클릭은 통과, 내부 버튼/입력은 그대로 동작 */
export const hitContent =
  'pointer-events-none relative z-[2] [&_a]:pointer-events-auto [&_button]:pointer-events-auto [&_input]:pointer-events-auto [&_label]:pointer-events-auto';

/** 아이콘 슬롯 래퍼 (svg를 칸에 맞춤) */
export function IconSlot({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('inline-flex shrink-0 items-center justify-center [&>svg]:size-full', className)}>{children}</span>;
}

/**
 * Figma: `progress bar_line`의 막대 부분(트랙 neutral-20, 진행 neutral-70, 양끝 둥글게).
 * 진행 막대 컴포넌트는 다른 묶음 소관이라 카드 내부용으로만 둡니다.
 */
export function ProgressLine({ value, className, label }: { value: number; className?: string; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <span
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={label}
      className={cn('block h-1.5 w-full overflow-hidden rounded-full bg-neutral-20', className)}
    >
      <span
        className="block h-full rounded-full bg-neutral-70 transition-[width] motion-reduce:transition-none"
        style={{ width: `${v}%` }}
      />
    </span>
  );
}

/** 카드 버튼 정의 (Figma: button_01 / button_02 등) */
export interface CardAction {
  label: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}
