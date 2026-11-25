import { useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Checkbox } from '../Checkbox';
import { Radio } from '../Radio';

/* ────────────────────────────────────────────────────────────────────────────
 * FormTitle — Figma: `element/base_form_title`
 *   Title 12px Bold neutral-100 + ♦ * (10px Regular neutral-100), gap 2
 * ──────────────────────────────────────────────────────────────────────────── */
export interface FormTitleProps {
  children: ReactNode;
  /** 필수 표시 * (Figma: ♦ *) */
  required?: boolean;
  /** 주면 <label htmlFor>로 렌더링 */
  htmlFor?: string;
  id?: string;
  className?: string;
}

export function FormTitle({ children, required = false, htmlFor, id, className }: FormTitleProps) {
  const Tag = htmlFor ? 'label' : 'span';
  return (
    <Tag id={id} htmlFor={htmlFor} className={cn('inline-flex shrink-0 items-start gap-0.5 text-neutral-100', className)}>
      <span className="text-body-4 font-bold">{children}</span>
      {required && (
        <span aria-hidden className="text-body-5">
          *
        </span>
      )}
      {required && <span className="sr-only">(필수)</span>}
    </Tag>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * FormField — Figma: `form` (10 variants)
 *   title  : vertical(제목 위) | horizontal(제목 왼쪽)        → orientation
 *   type   : input/dropdown | input_text_multi | radio/check | switch → type (간격·제목 정렬)
 *            vertical 간격 8 · 8 · 10 · 10 / horizontal 간격 8 · 16 · 10 · 16
 *            horizontal 제목 칸 높이(세로 가운데): - · 23 · 15 · 19
 *   ♦ title       → title
 *   ♦ element     → aside (입력 오른쪽 element/base_form_element: button h26 · button_icon h32 ×2 · switch, gap 8)
 *   ♦ button_down → action (아래 primary button h26, 폭 채움, gap 8)
 *   ♦ label       → 입력에 위 라벨이 있으면 aside를 아래 정렬(items-end)
 * ──────────────────────────────────────────────────────────────────────────── */
type FieldType = 'input' | 'textarea' | 'choice' | 'switch';

const gapV: Record<FieldType, string> = { input: 'gap-2', textarea: 'gap-2', choice: 'gap-2.5', switch: 'gap-2.5' };
const gapH: Record<FieldType, string> = { input: 'gap-2', textarea: 'gap-4', choice: 'gap-2.5', switch: 'gap-4' };
const titleBoxH: Record<FieldType, string> = { input: '', textarea: 'h-[23px]', choice: 'h-[15px]', switch: 'h-[19px]' };

export interface FormFieldProps {
  /** 항목 제목 (Figma: ♦ title + base_form_title) */
  title?: ReactNode;
  /** 제목 옆 * 표시 */
  required?: boolean;
  /** 제목 위치 (Figma: title=vertical | horizontal) */
  orientation?: 'vertical' | 'horizontal';
  /** 입력 종류 (Figma: type = input/dropdown | input_text_multi | radio/check | switch) */
  type?: FieldType;
  /** 제목을 이 id의 입력에 <label>로 연결 */
  htmlFor?: string;
  /** 입력 오른쪽 보조 요소 (Figma: ♦ element) */
  aside?: ReactNode;
  /** 입력 아래 버튼 (Figma: ♦ button_down). 바로 아래 button은 폭을 채웁니다 */
  action?: ReactNode;
  /** 입력에 위 라벨이 있을 때 aside를 입력 높이에 맞춰 아래 정렬 (Figma: ♦ label=on) */
  labeled?: boolean;
  /** 제목 칸 폭 (horizontal일 때 제목 열을 맞출 때) */
  titleWidth?: number | string;
  children: ReactNode;
  className?: string;
}

export function FormField({
  title,
  required = false,
  orientation = 'vertical',
  type = 'input',
  htmlFor,
  aside,
  action,
  labeled = false,
  titleWidth,
  children,
  className,
}: FormFieldProps) {
  const titleId = useId();
  const horizontal = orientation === 'horizontal';

  const titleEl = title != null && (
    <div
      className={cn('flex shrink-0', horizontal && titleBoxH[type] && 'items-center', horizontal && titleBoxH[type])}
      style={horizontal && titleWidth != null ? { width: titleWidth } : undefined}
    >
      <FormTitle id={titleId} htmlFor={htmlFor} required={required}>
        {title}
      </FormTitle>
    </div>
  );

  const content =
    aside == null && action == null ? (
      <div className="min-w-0 flex-1">{children}</div>
    ) : (
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {aside != null ? (
          <div className={cn('flex gap-2', labeled ? 'items-end' : 'items-start')}>
            <div className="min-w-0 flex-1">{children}</div>
            <div className="flex shrink-0 items-center gap-[5.36px]">{aside}</div>
          </div>
        ) : (
          children
        )}
        {action != null && <div className="flex [&>button]:w-full">{action}</div>}
      </div>
    );

  return (
    <div
      role="group"
      aria-labelledby={title != null ? titleId : undefined}
      className={cn('flex', horizontal ? cn('flex-row', gapH[type]) : cn('flex-col', gapV[type]), className)}
    >
      {titleEl}
      {content}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * FormInputGroup — Figma: `element/base_form_1` (12 variants)
 *   type  : input_text | dropdown | input_date (안에 넣는 컴포넌트로 표현)
 *   count : 1 | 2  → 자식 수 (2개면 gap 8로 반씩)
 *   🚫 label : 자식에 라벨이 있으면 아래 정렬
 * ──────────────────────────────────────────────────────────────────────────── */
export function FormInputGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('flex w-full items-end gap-2 [&>*]:w-auto [&>*]:min-w-0 [&>*]:flex-1', className)}>{children}</div>;
}

/* ────────────────────────────────────────────────────────────────────────────
 * ChoiceGroup — Figma: `element/base_form_2` (4 variants)
 *   type        : radio(radio_label) | check(checkbox_label)
 *   orientation : vertical(gap 8) | horizontal(gap 16)
 * ──────────────────────────────────────────────────────────────────────────── */
export interface ChoiceOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}

interface ChoiceBase {
  options: ChoiceOption[];
  orientation?: 'vertical' | 'horizontal';
  /** 라디오 name (생략하면 자동) */
  name?: string;
  /** 그룹 이름 (스크린리더). FormField 안이면 생략 가능 */
  'aria-label'?: string;
  disabled?: boolean;
  className?: string;
}
export interface RadioChoiceGroupProps extends ChoiceBase {
  type?: 'radio';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
}
export interface CheckChoiceGroupProps extends ChoiceBase {
  type: 'check';
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}
export type ChoiceGroupProps = RadioChoiceGroupProps | CheckChoiceGroupProps;

export function ChoiceGroup(props: ChoiceGroupProps) {
  const { options, orientation = 'vertical', name, disabled, className } = props;
  const autoName = useId();
  const isCheck = props.type === 'check';
  const [radioInner, setRadioInner] = useState(!isCheck ? props.defaultValue : undefined);
  const [checkInner, setCheckInner] = useState<string[]>(isCheck ? (props.defaultValue ?? []) : []);

  const wrap = cn('flex', orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-4', className);

  if (props.type === 'check') {
    const selected = props.value ?? checkInner;
    const toggle = (v: string, on: boolean) => {
      const next = on ? [...selected, v] : selected.filter((x) => x !== v);
      if (props.value === undefined) setCheckInner(next);
      props.onChange?.(next);
    };
    return (
      <div role="group" aria-label={props['aria-label']} className={wrap}>
        {options.map((o) => (
          <Checkbox
            key={o.value}
            name={name}
            value={o.value}
            label={o.label}
            disabled={disabled || o.disabled}
            checked={selected.includes(o.value)}
            onChange={(e) => toggle(o.value, e.target.checked)}
          />
        ))}
      </div>
    );
  }

  const selected = props.value ?? radioInner;
  return (
    <div role="radiogroup" aria-label={props['aria-label']} className={wrap}>
      {options.map((o) => (
        <Radio
          key={o.value}
          name={name ?? autoName}
          value={o.value}
          label={o.label}
          disabled={disabled || o.disabled}
          checked={selected === o.value}
          onChange={() => {
            if (props.value === undefined) setRadioInner(o.value);
            props.onChange?.(o.value);
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * FormSection — Figma: `title_paragraph` (2 variants)
 *   type : default(위 여백 16) | top(첫 단락, 여백 없음)
 *   Title 12px Bold (raw #111111 → neutral-100), 폭 280
 *   본문 간격(gap 16)은 Figma form 화면 예시 기준으로 정했습니다.
 * ──────────────────────────────────────────────────────────────────────────── */
export interface FormSectionProps {
  title: ReactNode;
  /** default(위 여백 16px) | top(첫 단락) */
  type?: 'default' | 'top';
  /** 제목 오른쪽(예: RequiredNote) */
  extra?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function FormSection({ title, type = 'default', extra, children, className }: FormSectionProps) {
  const id = useId();
  return (
    <section aria-labelledby={id} className={cn('flex flex-col gap-4', type === 'default' && 'pt-4', className)}>
      <div className="flex items-center justify-between gap-4">
        <h3 id={id} className="text-body-4 font-bold text-neutral-100">
          {title}
        </h3>
        {extra}
      </div>
      {children}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * RequiredNote — Figma: `required items`
 *   * (raw 9.38px Medium → body-5 font-medium) neutral-100 + "is required" 10px neutral-70, gap 1, 오른쪽 정렬
 *   ♦ error → "Not Completed" 10px error-60
 * ──────────────────────────────────────────────────────────────────────────── */
export interface RequiredNoteProps {
  /** 안내 문구 */
  label?: ReactNode;
  /** 미완료 경고. true면 "Not Completed", 문자열/요소면 그 내용 */
  error?: boolean | ReactNode;
  className?: string;
}

export function RequiredNote({ label = 'is required', error, className }: RequiredNoteProps) {
  return (
    <p className={cn('flex items-center justify-end gap-px', className)}>
      {error != null && error !== false && (
        <span role="alert" className="mr-auto pr-2 text-body-5 text-error-60">
          {error === true ? 'Not Completed' : error}
        </span>
      )}
      <span aria-hidden className="text-body-5 font-medium text-neutral-100">
        *
      </span>
      <span className="text-body-5 text-neutral-70">{label}</span>
    </p>
  );
}
