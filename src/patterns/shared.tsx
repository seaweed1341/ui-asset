/**
 * 공통 패턴 — 세 화면설계서(LCS Medical 웹앱, LGBC 대시보드, gram Claw 윈도우 앱)에서 똑같이 반복되는 조합.
 * 규칙 근거는 src/patterns/PATTERNS.md 참조.
 */
import type { ReactNode } from 'react';
import { Popup, type PopupAction } from '../components';
import { cn } from '../lib/cn';

/* ------------------------------------------------------------------------------------------------
 * ConfirmPopup — 확인 팝업
 *   세 파일 공통: 300폭 small title + 본문(10px) + 하단 2버튼
 *   순서 규칙   : 왼쪽 취소(secondary) / 오른쪽 실행(primary), 같은 폭. 파괴적 액션도 색을 바꾸지 않음
 *   1버튼 규칙  : 확인 전용 = 실행 버튼 하나(single='confirm'), 보기 전용 = 닫기 하나(single='close')
 * ---------------------------------------------------------------------------------------------- */
export interface ConfirmPopupProps {
  open: boolean;
  title: ReactNode;
  /** 결과를 밝히는 본문. 예: "삭제하면 되돌릴 수 없습니다." */
  message?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmDisabled?: boolean;
  /**
   * 버튼 하나만 둘 때
   *   'confirm' : 확인 전용 — 실행(primary) 하나 (예: OK)
   *   'close'   : 보기 전용 — 취소(secondary) 하나 (예: Close / 닫기)
   */
  single?: 'confirm' | 'close';
  width?: number;
  inline?: boolean;
}

export function ConfirmPopup({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled,
  single,
  width = 300,
  inline,
}: ConfirmPopupProps) {
  const cancel: PopupAction | undefined = single === 'confirm' ? undefined : { label: cancelLabel, onClick: onCancel };
  const confirm: PopupAction | undefined = single === 'close' ? undefined : { label: confirmLabel, onClick: onConfirm, disabled: confirmDisabled };
  return (
    <Popup open={open} onClose={onCancel} title={title} width={width} inline={inline} cancel={cancel} confirm={confirm}>
      {message && <p className="whitespace-pre-line">{message}</p>}
    </Popup>
  );
}

/* ------------------------------------------------------------------------------------------------
 * FormRow — 라벨 + 컨트롤 한 줄 (LCS P9 폼 행 / gram 설정 행)
 *   layout inline : 라벨 200(팝업 100) + gap 40 + 컨트롤 200  (LCS)
 *   layout setting: 라벨 12px + 도움말 10px (세로 gap 3) ↔ 오른쪽 컨트롤 (gram Claw 설정 카드)
 *   필수 표시 * 는 info-80-text
 * ---------------------------------------------------------------------------------------------- */
export function FormRow({
  label,
  htmlFor,
  required,
  help,
  error,
  layout = 'inline',
  labelWidth = 200,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  help?: ReactNode;
  /** 입력 바로 아래 인라인 오류 (error-80-text) — LCS·gram 공통 규칙 */
  error?: ReactNode;
  layout?: 'inline' | 'setting';
  labelWidth?: number;
  children: ReactNode;
  className?: string;
}) {
  const labelEl = (
    <label htmlFor={htmlFor} className={cn(layout === 'inline' ? 'text-body-5 text-neutral-100' : 'text-body-4 text-neutral-100')}>
      {label}
      {required && <span className="ml-0.5 text-info-80-text">*</span>}
    </label>
  );

  if (layout === 'setting') {
    return (
      <div className={cn('flex items-center justify-between gap-6 py-1', className)}>
        <div className="flex min-w-0 flex-col gap-[3px]">
          {labelEl}
          {help && <p className="text-body-5 text-neutral-70">{help}</p>}
        </div>
        <div className="shrink-0">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn('flex items-start gap-10', className)}>
      <div className="flex min-h-6 shrink-0 items-center" style={{ width: labelWidth }}>
        {labelEl}
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        {children}
        {help && !error && <p className="text-body-5 text-neutral-70">{help}</p>}
        {error && <p className="text-body-5 text-error-80-text">{error}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------
 * KeyValueList — 정보 블록 (LCS P15: 라벨 neutral-40 / 값 neutral-100, 10px, 행 gap 7)
 * ---------------------------------------------------------------------------------------------- */
export function KeyValueList({
  items,
  labelWidth = 96,
  className,
}: {
  items: { label: ReactNode; value: ReactNode }[];
  labelWidth?: number;
  className?: string;
}) {
  return (
    <dl className={cn('grid gap-y-[7px] text-body-5', className)} style={{ gridTemplateColumns: `${labelWidth}px minmax(0,1fr)` }}>
      {items.map((it, i) => (
        <div key={i} className="contents">
          <dt className="text-neutral-40">{it.label}</dt>
          <dd className="truncate text-neutral-100">{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------------------------------------
 * Panel — 흰 카드 (LCS content panel r8 / LGBC sub-card r8 / gram 설정 카드 r12)
 * ---------------------------------------------------------------------------------------------- */
export function Panel({
  children,
  radius = 8,
  padding = 'p-3',
  className,
}: {
  children: ReactNode;
  radius?: 8 | 12;
  padding?: string;
  className?: string;
}) {
  return (
    <div className={cn('bg-neutral-10 ring-1 ring-inset ring-neutral-40', radius === 8 ? 'rounded-lg' : 'rounded-xl', padding, className)}>
      {children}
    </div>
  );
}

/** 날짜 표기 규칙 (화면설계서 공통 포맷) */
export const formatDate = {
  /** LCS: Last update time — YYYY-MM-DD HH:mm */
  minute: (d: Date) => `${ymd(d, '-')} ${hm(d)}`,
  /** LGBC 헤더: YYYY.MM.dd hh:mm:ss */
  dotSecond: (d: Date) => `${ymd(d, '.')} ${hm(d)}:${pad(d.getSeconds())}`,
  /** LGBC 표: YYYY-MM-DD hh:mm:ss */
  dashSecond: (d: Date) => `${ymd(d, '-')} ${hm(d)}:${pad(d.getSeconds())}`,
  /** gram Claw 목록: now · 16m · 1hr · 2days · YYYY-MM-DD */
  relative: (d: Date, now = new Date()) => {
    const s = Math.round((now.getTime() - d.getTime()) / 1000);
    if (s < 60) return 'now';
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    if (s < 86400) return `${Math.floor(s / 3600)}hr`;
    if (s < 7 * 86400) return `${Math.floor(s / 86400)}days`;
    return ymd(d, '-');
  },
};
const pad = (n: number) => String(n).padStart(2, '0');
const ymd = (d: Date, sep: string) => [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join(sep);
const hm = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
