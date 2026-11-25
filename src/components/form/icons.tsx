import { createIcon } from '../../icons';

/**
 * form 묶음 전용 아이콘 (Figma Icon 페이지에서 SVG_STRING으로 추출).
 * 이름 충돌을 피하려고 배럴(index.ts)에서는 다시 export하지 않습니다.
 */

/** common/ic_subtract */
export const IconSubtract = createIcon('IconSubtract', 'M3.91479 12.7754V11.2754H20.0853V12.7754H3.91479Z');

/** arrow/ic_upload */
export const IconUpload = createIcon('IconUpload', [
  'M18.5 16V19.5H5.5V16H4V19.5C4 20.328 4.671 21 5.5 21H18.5C19.328 21 20 20.328 20 19.5V16H18.5Z',
  'M11.25 5.22997V16.502H12.75V5.23197L17.302 9.78497L18.364 8.72397L13.06 3.41997C12.475 2.83397 11.525 2.83397 10.939 3.41997L5.635 8.72397L6.696 9.78497L11.25 5.22997Z',
]);
