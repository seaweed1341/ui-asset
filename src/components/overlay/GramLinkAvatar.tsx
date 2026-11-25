import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { IconError, IconProfile } from '../../icons';
import { IconFolderGroup } from './icons';

/**
 * Figma: `.그램링크_아바타` (27757:14316, gram Only, 4 variants) — 42×42 원형, bg neutral-20
 *   Property 1 : Profile | Profile_Folder | Profile_ImageSelected | Profile_Initial
 *     Profile               : user/ic_profile 24 가운데 (neutral-70)
 *     Profile_Folder        : + 오른쪽 아래 폴더 배지 10 (bg neutral-10, stroke raw #000@0.8 → neutral-100, file/ic_group 6)
 *     Profile_ImageSelected : 이미지 + 폴더 배지 + 오른쪽 위 제거 아이콘 12 (alert/ic_error, 흰 원 10 위)
 *     Profile_Initial       : 이니셜 10px Regular (raw #000 → neutral-100) + 폴더 배지
 */
export type GramLinkAvatarVariant = 'profile' | 'profileFolder' | 'profileImageSelected' | 'profileInitial';

export interface GramLinkAvatarProps {
  /** Figma Property 1 */
  variant?: GramLinkAvatarVariant;
  /** profileImageSelected 이미지 */
  src?: string;
  /** profileInitial 글자 */
  initial?: ReactNode;
  /** 스크린리더용 이름 */
  label?: string;
  /** profileImageSelected의 제거(ⓧ) 버튼 */
  onRemove?: () => void;
  removeLabel?: string;
  /** 지름(px). 기본 42 */
  size?: number;
  className?: string;
}

export function GramLinkAvatar({
  variant = 'profile',
  src,
  initial,
  label,
  onRemove,
  removeLabel = '이미지 제거',
  size = 42,
  className,
}: GramLinkAvatarProps) {
  const folder = variant !== 'profile';
  return (
    <span style={{ width: size, height: size }} className={cn('relative inline-flex shrink-0', className)}>
      <span
        role="img"
        aria-label={label}
        aria-hidden={label ? undefined : true}
        className="inline-flex size-full items-center justify-center overflow-hidden rounded-full bg-neutral-20 text-body-5 text-neutral-100">
        {variant === 'profileInitial' ? (
          initial
        ) : variant === 'profileImageSelected' && src ? (
          <img src={src} alt="" className="size-full object-cover" />
        ) : variant === 'profileImageSelected' ? (
          'Image'
        ) : (
          <span className="inline-flex size-6 text-neutral-70 [&>svg]:size-full">
            <IconProfile />
          </span>
        )}
      </span>

      {folder && (
        <span
          aria-hidden
          className="absolute bottom-px right-px inline-flex size-2.5 items-center justify-center rounded-full bg-neutral-10 text-neutral-100 shadow-[inset_0_0_0_0.5px_var(--color-neutral-100)] [&>svg]:size-1.5"
        >
          <IconFolderGroup />
        </span>
      )}

      {variant === 'profileImageSelected' && onRemove && (
        <button
          type="button"
          aria-label={removeLabel}
          onClick={onRemove}
          className="absolute right-0 top-0 inline-flex size-3 items-center justify-center rounded-full bg-neutral-10 text-neutral-100 [&>svg]:size-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-70"
        >
          <IconError />
        </button>
      )}
    </span>
  );
}
