import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Tag, type TagProps } from '../Tag';

/**
 * Figma: Components / `element/tags` (단일 컴포넌트)
 *   tag_text(size=small, status=primary) 인스턴스를 가로로 gap 4px 나열. 슬롯 8개 중 기본 3개 노출.
 */
export interface TagListProps extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  /** 태그 텍스트 목록 */
  tags: ReactNode[];
  /** 최대 표시 개수 (Figma 슬롯 8개) */
  max?: number;
  status?: TagProps['status'];
  size?: TagProps['size'];
}

export function TagList({ tags, max = 8, status = 'primary', size = 'small', className, ...rest }: TagListProps) {
  return (
    <ul className={cn('flex flex-wrap items-start gap-1', className)} {...rest}>
      {tags.slice(0, max).map((t, i) => (
        <li key={i} className="flex">
          <Tag size={size} status={status} label={t} />
        </li>
      ))}
    </ul>
  );
}
