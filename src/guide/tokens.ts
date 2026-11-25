/**
 * 가이드에 표시할 토큰 목록 (값은 적지 않습니다).
 * 실제 색상·크기는 화면에서 CSS 변수를 읽어 보여 주므로 theme.css가 유일한 원본입니다.
 */

export interface ColorToken {
  /** CSS 변수 이름 (-- 제외) */
  cssVar: string;
  /** Tailwind 클래스 접미사: bg-{tw}, text-{tw} */
  tw: string;
  /** Figma 변수 경로 */
  figma: string;
}

export interface ColorGroup {
  name: string;
  description: string;
  tokens: ColorToken[];
}

const steps = (group: string, figmaGroup: string, list: (number | string)[]): ColorToken[] =>
  list.map((s) => ({
    cssVar: `color-${group}-${s}`,
    tw: `${group}-${s}`,
    figma: `Global/${figmaGroup}/m-${group}-${s}`,
  }));

export const colorGroups: ColorGroup[] = [
  {
    name: 'Neutral',
    description: '배경, 텍스트, 테두리, 기본 버튼에 쓰는 회색 단계입니다.',
    tokens: steps('neutral', 'neutral', [10, 20, 40, 70, 100]),
  },
  {
    name: 'Primary',
    description: '선택 상태와 강조 요소에 쓰는 앱 대표 색상입니다.',
    tokens: steps('primary', 'primary', [15, 70, 90]),
  },
  {
    name: 'Success',
    description: '완료, 긍정적인 결과를 알릴 때 씁니다.',
    tokens: steps('success', 'semantic/success', [10, 20, 60, '80-text']),
  },
  {
    name: 'Information',
    description: '안내와 참고 정보를 알릴 때 씁니다.',
    tokens: steps('info', 'semantic/infomation', [10, 20, 60, '80-text']),
  },
  {
    name: 'Warning',
    description: '가벼운 경고와 주의가 필요한 상태에 씁니다.',
    tokens: steps('warning', 'semantic/warning', [10, 20, 60, '80-text']),
  },
  {
    name: 'Error',
    description: '오류, 입력 검증 실패, 위험한 작업에 씁니다.',
    tokens: steps('error', 'semantic/error', [10, 20, 60, '80-text']),
  },
];

export interface SemanticToken {
  cssVar: string;
  ref: string;
  usage: string;
}

export const semanticTokens: SemanticToken[] = [
  { cssVar: 'color-background-surface', ref: 'color-neutral-10', usage: 'body, 카드, 팝업 안쪽 배경' },
  { cssVar: 'color-text-sub', ref: 'color-neutral-70', usage: '본문 아래 위계의 서브 텍스트' },
  { cssVar: 'color-text-on-color', ref: 'color-neutral-10', usage: '진한 배경(40~100) 위 텍스트' },
  { cssVar: 'color-icon-sub', ref: 'color-neutral-70', usage: '서브 텍스트와 함께 쓰는 아이콘' },
  { cssVar: 'color-button-primary', ref: 'color-primary-70', usage: 'Primary UI 요소 기본' },
  { cssVar: 'color-button-primary-pressed', ref: 'color-primary-90', usage: 'Primary UI 요소 누름' },
  { cssVar: 'color-border', ref: 'color-neutral-40', usage: '외곽선' },
  { cssVar: 'color-status-success', ref: 'color-success-60', usage: '성공 상태 기본' },
  { cssVar: 'color-status-info', ref: 'color-info-60', usage: '정보 상태 기본' },
  { cssVar: 'color-status-warning', ref: 'color-warning-60', usage: '경고 상태 기본' },
  { cssVar: 'color-status-error', ref: 'color-error-60', usage: '오류 상태 기본' },
];

export interface TypeToken {
  key: string;
  figma: string;
  /** Tailwind 클래스 */
  tw: string;
  sample: string;
}

export const typeTokens: TypeToken[] = [
  { key: 'heading-1', figma: 'Heading/Heading1', tw: 'text-heading-1', sample: '매장 디스플레이 관리' },
  { key: 'heading-2', figma: 'Heading/Heading2', tw: 'text-heading-2', sample: '매장 디스플레이 관리' },
  { key: 'heading-3', figma: 'Heading/Heading3', tw: 'text-heading-3', sample: '매장 디스플레이 관리' },
  { key: 'heading-4', figma: 'Heading/Heading4', tw: 'text-heading-4', sample: '매장 디스플레이 관리' },
  { key: 'body-1', figma: 'Body/Body1', tw: 'text-body-1', sample: '등록된 기기 24대 중 3대가 오프라인입니다.' },
  { key: 'body-2', figma: 'Body/Body2', tw: 'text-body-2', sample: '등록된 기기 24대 중 3대가 오프라인입니다.' },
  { key: 'body-3', figma: 'Body/Body3', tw: 'text-body-3', sample: '등록된 기기 24대 중 3대가 오프라인입니다.' },
  { key: 'body-4', figma: 'Body/Body4', tw: 'text-body-4', sample: '등록된 기기 24대 중 3대가 오프라인입니다.' },
  { key: 'body-5', figma: 'Body/Body5', tw: 'text-body-5', sample: '등록된 기기 24대 중 3대가 오프라인입니다.' },
  { key: 'body-6', figma: 'Body/Body6', tw: 'text-body-6', sample: '등록된 기기 24대 중 3대가 오프라인입니다.' },
];
