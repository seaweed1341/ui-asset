import type { ReactNode } from 'react';

/**
 * Figma의 아이콘 on/off(BOOLEAN) + 아이콘 교체(INSTANCE_SWAP)를 하나의 prop으로 표현합니다.
 *  - false / undefined : 아이콘 없음
 *  - true              : Figma 기본 아이콘
 *  - ReactNode         : 아이콘 교체
 */
export type IconProp = boolean | ReactNode;

export const resolveIcon = (icon: IconProp, fallback: ReactNode): ReactNode => {
  if (icon === true) return fallback;
  if (icon === false || icon === null || icon === undefined) return null;
  return icon;
};
