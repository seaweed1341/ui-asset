import { useId, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { resolveIcon, type IconProp } from '../../lib/icon-slot';
import { IconClose, IconDownload } from '../../icons';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { IconUpload } from './icons';

/**
 * Figma: Components / `drag & drop files` (4 variants)
 *   size   : large | small
 *   status : normal(안내 + Browse File) | over(파일이 올라간 상태: 파일 목록 + Download File)
 *            → files 유무로 자동 결정
 *   ♦ sub text : 지원 형식 안내 (10px Regular)
 *   상자   : 268 폭, p 12, gap 12, bg neutral-20, 1px 점선 neutral-40 (dash 2.68 → CSS dashed)
 *   large normal : ic_artwork_dummy 42 + 제목 15px Medium(gap 3) + button h26 secondary(arrow/ic_upload)
 *   small normal : 제목·sub text(gap 2) + button h20 secondary
 *   large over   : list_depth 행(bg neutral-10, p 4/8/4/8, 이름 12px Medium · 크기 10px · ic_close h16, 하단 divider neutral-40)
 *                  + button h20 secondary(arrow/ic_download)
 *   small over   : 한 줄(space-between) — button h20 text(ic_close + 파일명 + 크기 8px Bold) + Download File
 *   드래그 중 강조(점선 neutral-70)는 Figma에 없는 상태라 추가했습니다.
 */
export interface FileDropItem {
  /** 목록 key. 없으면 name을 씁니다. */
  id?: string;
  name: string;
  /** 바이트 수(자동으로 KB/MB 표시) 또는 표시할 문자열 */
  size?: number | string;
  file?: File;
}

export interface FileDropZoneProps {
  /** large | small */
  size?: 'large' | 'small';
  /** 제어: 올라간 파일 목록. 있으면 status=over 화면 */
  files?: FileDropItem[];
  /** 비제어 초기 목록 */
  defaultFiles?: FileDropItem[];
  /** 목록이 바뀔 때 (추가·삭제) */
  onFilesChange?: (files: FileDropItem[]) => void;
  /** 새로 고르거나 끌어다 놓은 원본 File들 */
  onFilesAdd?: (files: File[]) => void;
  /** input accept (예: "image/png,image/tiff,image/jpeg") */
  accept?: string;
  multiple?: boolean;
  /** 제목 (Figma: Drag and drop files upload) */
  title?: ReactNode;
  /** 보조 문구 (Figma: ♦ sub text). false면 숨김 */
  subText?: ReactNode | false;
  /** 파일 선택 버튼 글자 */
  browseLabel?: ReactNode;
  /** 다운로드 버튼 글자 */
  downloadLabel?: ReactNode;
  /** 주면 파일이 있을 때 Download File 버튼 표시 */
  onDownload?: (files: FileDropItem[]) => void;
  /** large 안내 그림. 생략/true면 기본(ic_artwork_dummy 자리), ReactNode면 교체, false면 숨김 */
  artwork?: IconProp;
  disabled?: boolean;
  className?: string;
}

export const formatFileSize = (size: number | string | undefined) => {
  if (size == null || typeof size === 'string') return size;
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
  const mb = size / (1024 * 1024);
  return `${mb < 10 ? +mb.toFixed(1) : Math.round(mb)}MB`;
};

/** ic_artwork_dummy 대체: 회색 상자 + IMG */
const ArtworkDummy = () => (
  <span className="relative inline-flex size-[42px] items-center justify-center overflow-hidden bg-neutral-40 font-mono text-body-5 font-bold text-neutral-70">
    IMG
  </span>
);

export function FileDropZone({
  size = 'large',
  files,
  defaultFiles = [],
  onFilesChange,
  onFilesAdd,
  accept,
  multiple = true,
  title = 'Drag and drop files upload',
  subText = 'Supported files: PNG, TIFF, JPG',
  browseLabel = 'Browse File',
  downloadLabel = 'Download File',
  onDownload,
  artwork = true,
  disabled,
  className,
}: FileDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [inner, setInner] = useState(defaultFiles);
  const list = files ?? inner;
  const [dragging, setDragging] = useState(false);
  const depth = useRef(0);

  const update = (next: FileDropItem[]) => {
    if (files === undefined) setInner(next);
    onFilesChange?.(next);
  };
  const add = (picked: File[]) => {
    if (!picked.length || disabled) return;
    const chosen = multiple ? picked : picked.slice(0, 1);
    onFilesAdd?.(chosen);
    const items = chosen.map((f) => ({ id: `${f.name}-${f.size}-${f.lastModified}`, name: f.name, size: f.size, file: f }));
    update(multiple ? [...list, ...items] : items);
  };
  const remove = (item: FileDropItem) => update(list.filter((f) => f !== item));

  const drag = {
    onDragEnter: (e: DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      depth.current += 1;
      setDragging(true);
    },
    onDragOver: (e: DragEvent) => {
      e.preventDefault();
      if (!disabled) e.dataTransfer.dropEffect = 'copy';
    },
    onDragLeave: () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setDragging(false);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      depth.current = 0;
      setDragging(false);
      add(Array.from(e.dataTransfer.files));
    },
  };

  const hasFiles = list.length > 0;
  const artNode = resolveIcon(artwork, <ArtworkDummy />);
  const key = (f: FileDropItem, i: number) => f.id ?? `${f.name}-${i}`;

  const download = onDownload && (
    <Button
      variant="secondary"
      height="h20"
      icon={<IconDownload />}
      iconPosition="left"
      label={downloadLabel}
      disabled={disabled}
      onClick={() => onDownload(list)}
    />
  );

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      aria-disabled={disabled || undefined}
      {...drag}
      className={cn(
        'flex w-[268px] gap-3 border border-dashed bg-neutral-20 p-3 transition-colors',
        dragging ? 'border-neutral-70' : 'border-neutral-40',
        hasFiles && size === 'small' ? 'flex-row items-center justify-between' : 'flex-col items-center justify-center',
        disabled && 'opacity-40 [&_button:disabled]:opacity-100',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        tabIndex={-1}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          add(Array.from(e.target.files ?? []));
          e.target.value = '';
        }}
      />
      <span id={titleId} className="sr-only">
        {typeof title === 'string' ? title : '파일 업로드'}
      </span>

      {!hasFiles ? (
        <>
          <div className={cn('flex w-full flex-col items-center', size === 'large' ? 'gap-2' : 'gap-0')}>
            {size === 'large' && artNode}
            <div className={cn('flex flex-col items-center text-center text-neutral-70', size === 'large' ? 'gap-[3px]' : 'gap-0.5')}>
              <p className="text-body-3">{title}</p>
              {subText !== false && subText != null && <p className="text-body-5">{subText}</p>}
            </div>
          </div>
          <Button
            variant="secondary"
            height={size === 'large' ? 'h26' : 'h20'}
            icon={<IconUpload />}
            iconPosition="left"
            label={browseLabel}
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
          />
        </>
      ) : size === 'large' ? (
        <>
          <ul className="flex w-full flex-col">
            {list.map((f, i) => (
              <li key={key(f, i)} className="border-b border-neutral-40 bg-neutral-10">
                <div className="flex items-center py-1 pl-1 pr-2">
                  <div className="flex min-w-0 flex-1 items-center gap-1 pl-1">
                    <span className="min-w-0 flex-1 truncate text-body-4 text-neutral-70">{f.name}</span>
                    {f.size != null && <span className="shrink-0 text-body-5 text-neutral-70">{formatFileSize(f.size)}</span>}
                    <IconButton
                      variant="onlyicon"
                      height="h16"
                      label={`${f.name} 삭제`}
                      icon={<IconClose />}
                      disabled={disabled}
                      onClick={() => remove(f)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          {download}
        </>
      ) : (
        <>
          <ul className="flex min-w-0 flex-wrap gap-1">
            {list.map((f, i) => (
              <li key={key(f, i)} className="min-w-0">
                <Button
                  variant="text"
                  height="h20"
                  className="text-neutral-70"
                  icon={<IconClose />}
                  iconPosition="left"
                  label={f.name}
                  subtext={formatFileSize(f.size)}
                  aria-label={`${f.name} 삭제`}
                  disabled={disabled}
                  onClick={() => remove(f)}
                />
              </li>
            ))}
          </ul>
          {download}
        </>
      )}
    </div>
  );
}
