import { useId, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconAdd, IconArrowDown, IconArrowRight, IconInfo } from '../../icons';
import { Checkbox } from '../Checkbox';
import { Divider } from '../Divider';
import { IconButton } from '../IconButton';
import { Radio } from '../Radio';
import { Thumbnail16x9 } from './Thumbnail';
import { IconNull } from './icons';
import { IconSlot, focusRing } from './internal';

/** 리스트 항목을 담는 ul (항목들은 li로 렌더링됩니다) */
export function ItemList({ className, ...rest }: HTMLAttributes<HTMLUListElement>) {
  return <ul className={cn('flex flex-col', className)} {...rest} />;
}

/* --------------------------------------------------------------------------
 * list_depth
 * -------------------------------------------------------------------------- */

type ControlProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'checked' | 'defaultChecked' | 'onChange' | 'name' | 'value' | 'disabled'
>;

export interface ListDepthItemProps extends ControlProps {
  /** checkbox | icon | input | radio */
  type?: 'checkbox' | 'icon' | 'input' | 'radio';
  /** 1 depth | 2 depth | 3 depth → 1 | 2 | 3 */
  depth?: 1 | 2 | 3;
  /** 항목 텍스트 (12px Medium neutral-70). type=input이면 placeholder */
  label?: ReactNode;
  /** state=selected — 바탕 neutral-20. 생략하면 checkbox/radio는 체크 여부를 따라갑니다. */
  selected?: boolean;
  /** ♦ arrow — 펼침 화살표(ic_arrow_down 12px). true=기본, ReactNode=교체 */
  arrow?: IconProp;
  /** 펼침 상태. 주면 화살표가 버튼(aria-expanded)이 되고, false면 -90° 회전 */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** ♦ icon — type icon/input 앞 아이콘(16px). 기본 ic_info */
  icon?: IconProp;
  /** small right text — 텍스트 오른쪽 작은 글자(10px Regular) */
  smallRightText?: ReactNode;
  /** ♦ button_icon — 오른쪽 button_icon(onlyicon h16). true=ic_add */
  buttonIcon?: IconProp;
  buttonLabel?: string;
  onButtonClick?: () => void;
  /** divider — 아래 1px 선 */
  divider?: boolean;
  /** type=icon 항목 클릭 (텍스트 영역이 버튼이 됩니다) */
  onClick?: () => void;
  /** type=input의 input 속성 */
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
}

/**
 * Figma: Components / `list_depth` (24 variants)
 *   type  : checkbox | icon | input | radio
 *   depth : 1 depth | 2 depth | 3 depth
 *   state : default(neutral-10) | selected(neutral-20)
 *   props : ♦ arrow · arrow(swap) · ♦ button_icon · ♦ check/radio · ♦ icon · icon(swap) · divider · small right text
 *   - 260 폭, 내용 p4·8·4·(4 | 26 | 36), 높이 28(input 30) + divider 1
 *   - 1 depth: 화살표가 줄 안 맨 앞 / 2·3 depth: 화살표가 왼쪽 15·24px에 겹쳐 놓임
 *   - element: 왼쪽 4px, gap4 / input_text: 높이 22, p5.36·6.7, stroke neutral-40 @67%, 8px Medium
 */
export function ListDepthItem({
  type = 'checkbox',
  depth = 1,
  label,
  selected,
  arrow = true,
  expanded,
  onExpandedChange,
  icon = true,
  smallRightText,
  buttonIcon,
  buttonLabel = '추가',
  onButtonClick,
  divider = true,
  onClick,
  inputProps,
  className,
  checked,
  defaultChecked,
  onChange,
  name,
  value,
  disabled,
}: ListDepthItemProps) {
  const arrowNode = resolveIcon(arrow, <IconArrowDown />);
  const iconNode = type === 'icon' || type === 'input' ? resolveIcon(icon, <IconInfo />) : null;
  const btnNode = resolveIcon(buttonIcon, <IconAdd />);
  const toggleable = expanded !== undefined || !!onExpandedChange;

  const arrowEl = arrowNode
    ? (() => {
        const glyph = (
          <IconSlot
            className={cn(
              'size-3 text-neutral-70 transition-transform motion-reduce:transition-none',
              expanded === false && '-rotate-90',
            )}
          >
            {arrowNode}
          </IconSlot>
        );
        const pos = depth === 1 ? '' : cn('absolute top-1/2 -translate-y-1/2', depth === 2 ? 'left-[15px]' : 'left-6');
        return toggleable ? (
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={expanded ? '접기' : '펼치기'}
            onClick={() => onExpandedChange?.(!expanded)}
            className={cn('inline-flex shrink-0 rounded-sm', focusRing, pos)}
          >
            {glyph}
          </button>
        ) : (
          <span aria-hidden className={cn('inline-flex shrink-0', pos)}>
            {glyph}
          </span>
        );
      })()
    : null;

  const textCls = 'min-w-0 flex-1 truncate text-left text-body-4 text-neutral-70';

  let main: ReactNode;
  if (type === 'checkbox') {
    main = (
      <Checkbox
        label={<span className="block truncate">{label}</span>}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        className="min-w-0 flex-1 gap-1 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
      />
    );
  } else if (type === 'radio') {
    main = (
      <Radio
        label={<span className="block truncate">{label}</span>}
        checked={checked}
        defaultChecked={defaultChecked}
        onChange={onChange}
        name={name}
        value={value}
        disabled={disabled}
        className="min-w-0 flex-1 gap-1 [&>span:last-child]:min-w-0 [&>span:last-child]:flex-1"
      />
    );
  } else if (type === 'input') {
    main = (
      <input
        type="text"
        placeholder={typeof label === 'string' ? label : undefined}
        disabled={disabled}
        {...inputProps}
        className={cn(
          'h-[22px] min-w-0 flex-1 bg-neutral-10 px-[6.7px] py-[5.36px] text-body-6 font-medium text-neutral-100 outline-none',
          'ring-1 ring-inset ring-[color-mix(in_srgb,var(--color-neutral-40)_67%,transparent)] placeholder:text-neutral-40',
          'focus-visible:ring-neutral-70 disabled:opacity-40',
          inputProps?.className,
        )}
      />
    );
  } else {
    main = onClick ? (
      <button type="button" onClick={onClick} aria-current={selected || undefined} className={cn(textCls, 'rounded-sm', focusRing)}>
        {label}
      </button>
    ) : (
      <span className={textCls}>{label}</span>
    );
  }

  const highlight =
    selected === undefined
      ? type === 'checkbox' || type === 'radio'
        ? 'has-[input:checked]:bg-neutral-20'
        : ''
      : selected
        ? 'bg-neutral-20'
        : '';

  return (
    <li className={cn('flex w-full flex-col bg-neutral-10', highlight, className)}>
      <div
        className={cn(
          'relative flex w-full items-center py-1 pr-2',
          type === 'input' ? 'min-h-[30px]' : 'min-h-7',
          depth === 1 ? 'pl-1' : depth === 2 ? 'pl-[26px]' : 'pl-9',
        )}
      >
        {arrowEl}
        <div className="flex min-w-0 flex-1 items-center gap-1 pl-1">
          {iconNode && <IconSlot className="size-4 p-px text-neutral-100">{iconNode}</IconSlot>}
          {main}
          {smallRightText != null && type !== 'input' && (
            <span className="shrink-0 text-body-5 text-neutral-70">{smallRightText}</span>
          )}
          {btnNode && <IconButton variant="onlyicon" height="h16" label={buttonLabel} icon={btnNode} onClick={onButtonClick} />}
        </div>
      </div>
      {divider && <Divider />}
    </li>
  );
}

/* --------------------------------------------------------------------------
 * list_complex
 * -------------------------------------------------------------------------- */

export interface ListComplexItemProps extends ControlProps {
  /** 제목 (12px Medium) */
  title: ReactNode;
  /** ♦ supporting text — 보조 텍스트 (10px Regular) */
  supportingText?: ReactNode;
  /** ♦ supporting icon — 보조 텍스트 앞 12px 아이콘. true=ic_info */
  supportingIcon?: IconProp;
  /** ♦ check/radio + check/radio(swap): checkbox | radio | none(기본) */
  control?: 'checkbox' | 'radio' | 'none';
  /** ♦ icon-left — 20px 아이콘. true=ic_null2 */
  iconLeft?: IconProp;
  /** ♦ thumbnail — thumbnail_16:9(66×40). true=자리표시, 문자열=이미지 주소 */
  thumbnail?: boolean | string;
  /** ♦ text-right — 오른쪽 작은 텍스트 */
  textRight?: ReactNode;
  /** right(SLOT) — 오른쪽 동작 영역 (예: IconButton들) */
  right?: ReactNode;
  /** ♦ action — 기본 오른쪽 버튼 세트(outlined ic_add + onlyicon ic_arrow_right)를 표시 */
  action?: boolean;
  onActionClick?: () => void;
  onArrowClick?: () => void;
  /** selected — 바탕 neutral-20 (포커스와 함께면 neutral-100) */
  selected?: boolean;
  /** ♦ divider */
  divider?: boolean;
  /** 행 클릭. 주면 행 전체가 버튼(포커스 시 neutral-70 반전)이 됩니다. */
  onClick?: () => void;
  className?: string;
}

/**
 * Figma: Components / `list_complex` (6 variants)
 *   focus    : true(:focus-visible — 바탕 neutral-70, 글자 neutral-10) | false
 *   selected : true(바탕 neutral-20, 포커스와 함께면 neutral-100) | false
 *   disabled : true(투명도 50%) | false
 *   props    : ♦ icon-left · ♦ supporting text · ♦ action · ♦ supporting icon · ♦ check/radio · ♦ thumbnail
 *              ♦ text-right · ♦ divider · right(SLOT) · icon-left/supporting icon/check/radio(swap)
 *   - 362 폭, state-layer p8·12 gap8, 높이 56 + divider 1 / elements gap 10.72 / text gap 1.34
 */
export function ListComplexItem({
  title,
  supportingText,
  supportingIcon = true,
  control = 'none',
  iconLeft,
  thumbnail,
  textRight,
  right,
  action,
  onActionClick,
  onArrowClick,
  selected = false,
  divider = true,
  onClick,
  className,
  checked,
  defaultChecked,
  onChange,
  name,
  value,
  disabled,
}: ListComplexItemProps) {
  const id = useId();
  const leftIcon = resolveIcon(iconLeft, <IconNull />);
  const supIcon = resolveIcon(supportingIcon, <IconInfo />);
  const ariaLabel = typeof title === 'string' ? title : undefined;
  const ctrlProps = {
    checked,
    defaultChecked,
    onChange,
    name,
    value,
    disabled,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabel ? undefined : id,
    className: 'relative z-[2] shrink-0 opacity-100',
  };

  return (
    <li
      data-selected={selected}
      aria-disabled={disabled || undefined}
      className={cn('flex w-full flex-col', disabled && 'pointer-events-none opacity-50', className)}
    >
      <div
        className={cn(
          'relative flex min-h-14 w-full items-center gap-2 px-3 py-2 text-neutral-70 transition-colors',
          selected && 'bg-neutral-20',
          'has-[>button:first-child:focus-visible]:bg-neutral-70 has-[>button:first-child:focus-visible]:text-neutral-10',
          selected && 'has-[>button:first-child:focus-visible]:bg-neutral-100',
        )}
      >
        {onClick && (
          <button
            type="button"
            aria-labelledby={id}
            aria-pressed={selected}
            disabled={disabled}
            onClick={onClick}
            className="absolute inset-0 z-[1] outline-none"
          />
        )}
        {control === 'checkbox' && <Checkbox {...ctrlProps} />}
        {control === 'radio' && <Radio {...ctrlProps} />}
        {leftIcon && <IconSlot className="size-5">{leftIcon}</IconSlot>}
        {thumbnail && (
          <Thumbnail16x9 src={typeof thumbnail === 'string' ? thumbnail : undefined} className="w-[66px]" />
        )}
        <div className="flex min-w-0 flex-1 items-center gap-[10.72px]">
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-[1.34px]">
            <span id={id} className="truncate text-body-4">
              {title}
            </span>
            {supportingText != null && (
              <span className="flex min-w-0 items-center gap-1">
                {supIcon && <IconSlot className="size-3">{supIcon}</IconSlot>}
                <span className="truncate text-body-5">{supportingText}</span>
              </span>
            )}
          </div>
          {(textRight != null || right || action) && (
            <div className="relative z-[2] flex shrink-0 items-center justify-end gap-2">
              {textRight != null && <span className="text-right text-body-5">{textRight}</span>}
              {right}
              {action && (
                <>
                  <IconButton height="h24" label="추가" onClick={onActionClick} disabled={disabled} />
                  <IconButton
                    variant="onlyicon"
                    height="h24"
                    label="자세히"
                    icon={<IconArrowRight />}
                    onClick={onArrowClick}
                    disabled={disabled}
                    className="text-inherit"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {divider && <Divider />}
    </li>
  );
}

/* --------------------------------------------------------------------------
 * list_simple
 * -------------------------------------------------------------------------- */

export interface ListSimpleItemProps {
  /** title text (15px Medium neutral-70) */
  title: ReactNode;
  /** des text — description (12px Medium neutral-40) */
  description?: ReactNode;
  /** left icon — 24px. true=ic_info */
  leftIcon?: IconProp;
  /** title icon — 제목 앞 24px. true=ic_null */
  titleIcon?: IconProp;
  /** right instance(swap) — 오른쪽 요소 (Figma 기본: switch) */
  right?: ReactNode;
  /** right icon — 오른쪽 ic_arrow_right 24px */
  rightIcon?: IconProp;
  /** divider */
  divider?: boolean;
  /** state=selected — 바탕 neutral-20 */
  selected?: boolean;
  /** 행 클릭. 주면 행 전체가 버튼이 됩니다(오른쪽 요소는 별도로 동작). */
  onClick?: () => void;
  className?: string;
}

/**
 * Figma: Components / `list_simple` (2 variants)
 *   state : default | selected(바탕 neutral-20)
 *   props : title text · des text · right instance · right icon · title icon · left icon · instance(swap) · divider · description
 *   - 361 폭, 줄 gap8 / 텍스트 gap4 / divider는 아래 gap4
 */
export function ListSimpleItem({
  title,
  description,
  leftIcon,
  titleIcon,
  right,
  rightIcon,
  divider = false,
  selected = false,
  onClick,
  className,
}: ListSimpleItemProps) {
  const id = useId();
  const left = resolveIcon(leftIcon, <IconInfo />);
  const tIcon = resolveIcon(titleIcon, <IconNull />);
  const rIcon = resolveIcon(rightIcon, <IconArrowRight />);

  return (
    <li className={cn('relative flex w-full flex-col justify-center gap-1', selected && 'bg-neutral-20', className)}>
      {onClick && (
        <button
          type="button"
          aria-labelledby={id}
          aria-current={selected || undefined}
          onClick={onClick}
          className={cn('absolute inset-0 z-[1]', 'focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-70')}
        />
      )}
      <div className="flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {left && <IconSlot className="size-6 text-neutral-100">{left}</IconSlot>}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex items-center gap-1">
              {tIcon && <IconSlot className="size-6 text-neutral-100">{tIcon}</IconSlot>}
              <span id={id} className="truncate text-body-3 text-neutral-70">
                {title}
              </span>
            </span>
            {description != null && <span className="truncate text-body-4 text-neutral-40">{description}</span>}
          </div>
        </div>
        {right != null && <span className="relative z-[2] inline-flex shrink-0">{right}</span>}
        {rIcon && <IconSlot className="size-6 text-neutral-100">{rIcon}</IconSlot>}
      </div>
      {divider && <Divider />}
    </li>
  );
}
