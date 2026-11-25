import { useState, type ReactNode } from 'react';
import {
  BadgeDot,
  Button,
  Checkbox,
  Dropdown,
  IconButton,
  IconClose,
  IconSearch,
  Radio,
  Switch,
  Tabs,
  Tag,
  TextField,
} from '../components';
import { CodeBlock, PropsTable, type PropRow } from './ui';

export interface ComponentDoc {
  id: string;
  name: string;
  figma: string;
  description: string;
  Preview: () => ReactNode;
  code: string;
  props: PropRow[];
}

const DISABLED: PropRow = { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '비활성화. 투명도 40%가 적용되고 조작할 수 없습니다.' };
const ICON = (fallback: string): PropRow => ({
  name: 'icon',
  type: 'boolean | ReactNode',
  defaultValue: 'false',
  description: `true면 기본 아이콘(${fallback}), 아이콘 요소를 넘기면 교체, 생략하면 아이콘 없음.`,
});

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </div>
  );
}

export const docs: ComponentDoc[] = [
  {
    id: 'button',
    name: 'Button',
    figma: 'button, 81 variants',
    description: '화면의 주요 동작을 실행합니다. 한 영역에 primary는 하나만 두고, 나머지는 secondary나 text로 낮춥니다.',
    Preview: () => (
      <>
        {(['primary', 'secondary', 'text'] as const).map((v) => (
          <Stage key={v} label={v}>
            <Button variant={v} label="저장" />
            <Button variant={v} label="기기 추가" icon />
            <Button variant={v} label="다음" icon iconPosition="right" />
            <Button variant={v} height="h26" label="저장" />
            <Button variant={v} height="h20" label="저장" />
            <Button variant={v} label="저장" disabled />
          </Stage>
        ))}
      </>
    ),
    code: `<Button label="저장" />
<Button variant="secondary" label="기기 추가" icon />
<Button variant="text" height="h26" label="다음" icon iconPosition="right" />
<Button label="저장" disabled />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '버튼 텍스트. children을 넘기면 children이 우선합니다.' },
      { name: 'variant', type: "'primary' | 'secondary' | 'text'", defaultValue: "'primary'", description: 'Figma의 style.' },
      { name: 'height', type: "'h33' | 'h26' | 'h20'", defaultValue: "'h33'", description: '높이와 글자 크기(15·10·8px).' },
      ICON('ic_add'),
      { name: 'iconPosition', type: "'left' | 'right'", defaultValue: "'left'", description: 'Figma의 icon-left / icon-right.' },
      DISABLED,
      { name: 'badge', type: 'boolean', defaultValue: 'false', description: '우상단 알림 점.' },
      { name: 'subtext', type: 'ReactNode', description: '라벨 뒤 보조 텍스트(8px Bold).' },
    ],
  },
  {
    id: 'icon-button',
    name: 'IconButton',
    figma: 'button_icon, 27 variants',
    description: '툴바나 표 안처럼 공간이 좁은 곳에서 아이콘만으로 동작을 표시합니다. label은 화면에 보이지 않고 스크린리더가 읽습니다.',
    Preview: () => (
      <>
        {(['outlined', 'filled', 'onlyicon'] as const).map((v) => (
          <Stage key={v} label={v}>
            <IconButton variant={v} label="추가" />
            <IconButton variant={v} height="h24" label="검색" icon={<IconSearch />} />
            <IconButton variant={v} height="h16" label="닫기" icon={<IconClose />} />
            <IconButton variant={v} label="추가" disabled />
          </Stage>
        ))}
      </>
    ),
    code: `<IconButton label="추가" />
<IconButton variant="filled" height="h24" label="검색" icon={<IconSearch />} />`,
    props: [
      { name: 'label', type: 'string', description: '접근성 이름(필수). 툴팁으로도 표시됩니다.' },
      { name: 'variant', type: "'outlined' | 'filled' | 'onlyicon'", defaultValue: "'outlined'", description: 'Figma의 style.' },
      { name: 'height', type: "'h32' | 'h24' | 'h16'", defaultValue: "'h32'", description: 'Figma의 hight.' },
      { name: 'icon', type: 'ReactNode', defaultValue: '<IconAdd />', description: '표시할 아이콘.' },
      DISABLED,
    ],
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    figma: 'checkbox, checkbox_label',
    description: '여러 항목 중 원하는 만큼 고릅니다. 하위 항목이 일부만 선택되면 indeterminate로 표시합니다.',
    Preview: () => (
      <>
        <Stage label="default">
          <Checkbox label="알림 받기" defaultChecked />
          <Checkbox label="자동 업데이트" />
          <Checkbox label="전체 선택" indeterminate />
          <Checkbox label="잠김" disabled defaultChecked />
        </Stage>
        <Stage label="onlyIcon, number">
          <Checkbox type="onlyIcon" aria-label="선택" defaultChecked />
          <Checkbox type="number" number={1} aria-label="첫 번째" defaultChecked />
          <Checkbox type="number" number={2} aria-label="두 번째" defaultChecked />
        </Stage>
      </>
    ),
    code: `<Checkbox label="알림 받기" defaultChecked />
<Checkbox label="전체 선택" indeterminate />
<Checkbox type="number" number={1} aria-label="첫 번째" defaultChecked />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '오른쪽 라벨(12px Medium). 없으면 aria-label을 주세요.' },
      { name: 'checked / defaultChecked', type: 'boolean', description: '네이티브 checkbox와 같습니다.' },
      { name: 'indeterminate', type: 'boolean', defaultValue: 'false', description: '일부 선택 상태.' },
      { name: 'type', type: "'default' | 'onlyIcon' | 'number'", defaultValue: "'default'", description: 'Figma의 type.' },
      { name: 'number', type: 'number | string', defaultValue: '1', description: "type='number'일 때 표시할 숫자." },
      DISABLED,
    ],
  },
  {
    id: 'radio',
    name: 'Radio',
    figma: 'radio button, radio_label',
    description: '서로 배타적인 선택지 중 하나를 고릅니다. 같은 name으로 묶습니다.',
    Preview: function RadioPreview() {
      const [v, setV] = useState('daily');
      return (
        <Stage>
          {[
            ['daily', '매일'],
            ['weekly', '매주'],
            ['monthly', '매월'],
          ].map(([value, label]) => (
            <Radio key={value} name="cycle" value={value} label={label} checked={v === value} onChange={() => setV(value)} />
          ))}
          <Radio name="cycle-x" label="사용 안 함" disabled />
        </Stage>
      );
    },
    code: `<Radio name="cycle" value="daily" label="매일" checked={v === 'daily'} onChange={() => setV('daily')} />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '오른쪽 라벨(12px Medium).' },
      { name: 'name / value / checked', type: 'string / string / boolean', description: '네이티브 radio와 같습니다.' },
      DISABLED,
    ],
  },
  {
    id: 'switch',
    name: 'Switch',
    figma: 'switch, switch_label',
    description: '누르는 즉시 적용되는 켜기·끄기 설정에 씁니다. 저장 버튼이 필요한 설정이면 Checkbox를 씁니다.',
    Preview: () => (
      <Stage>
        <Switch label="자동 재생" defaultChecked />
        <Switch label="절전 모드" />
        <Switch label="원격 제어" disabled defaultChecked />
      </Stage>
    ),
    code: `<Switch label="자동 재생" checked={on} onChange={setOn} />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '오른쪽 라벨(10px Regular).' },
      { name: 'checked / defaultChecked', type: 'boolean', description: '제어·비제어 모두 지원합니다.' },
      { name: 'onChange', type: '(checked: boolean) => void', description: '바뀐 값을 받습니다.' },
      DISABLED,
    ],
  },
  {
    id: 'text-field',
    name: 'TextField',
    figma: 'input_text, 18 variants',
    description: '한 줄 텍스트를 입력받습니다. 오류가 나면 무엇이 잘못됐고 어떻게 고치는지 하단 문구로 알립니다.',
    Preview: () => (
      <>
        <Stage label="h48">
          <TextField label="기기 이름" placeholder="예: 1층 로비" />
          <TextField label="검색" icon clearable defaultValue="로비" />
          <TextField label="IP 주소" error="숫자와 점(.)만 입력하세요" defaultValue="192.168.a" />
        </Stage>
        <Stage label="h36">
          <TextField height="h36" type="password" label="비밀번호" defaultValue="secret" />
          <TextField height="h36" label="밝기" unit="%" helperText="0~100" showCount maxLength={3} />
          <TextField height="h36" label="모델명" disabled defaultValue="55XS4J" />
        </Stage>
      </>
    ),
    code: `<TextField label="검색" icon clearable />
<TextField label="IP 주소" error="숫자와 점(.)만 입력하세요" />
<TextField height="h36" type="password" label="비밀번호" />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '입력창 위 라벨(8px).' },
      { name: 'height', type: "'h48' | 'h36'", defaultValue: "'h48'", description: '입력 글자 12px / 10px.' },
      { name: 'type', type: "'default' | 'password'", defaultValue: "'default'", description: 'password는 보기·숨기기 버튼이 붙습니다.' },
      ICON('ic_search'),
      { name: 'unit', type: 'ReactNode', description: '오른쪽 단위 텍스트.' },
      { name: 'clearable', type: 'boolean', defaultValue: 'false', description: '값이 있으면 지우기 버튼 표시.' },
      { name: 'helperText', type: 'ReactNode', description: '하단 보조 문구.' },
      { name: 'error', type: 'boolean | string', description: '오류 상태. 문자열이면 하단 문구를 대체합니다.' },
      { name: 'showCount', type: 'boolean', defaultValue: 'false', description: 'maxLength와 함께 글자 수 표시.' },
      { name: 'plain', type: 'boolean', defaultValue: 'false', description: '테두리 없는 읽기 전용(Figma: text).' },
      DISABLED,
    ],
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    figma: 'dropdown, 4 variants',
    description: '목록에서 하나를 고릅니다. 키보드 위·아래 화살표와 Enter로도 조작할 수 있습니다.',
    Preview: () => (
      <Stage>
        <Dropdown
          label="화면 방향"
          placeholder="선택"
          options={[
            { value: 'landscape', label: '가로' },
            { value: 'portrait', label: '세로' },
            { value: 'auto', label: '자동 회전' },
          ]}
        />
        <Dropdown label="입력 소스" icon defaultValue="hdmi1" options={[{ value: 'hdmi1', label: 'HDMI 1' }, { value: 'hdmi2', label: 'HDMI 2' }]} />
        <Dropdown label="지역" disabled placeholder="서울" options={[]} />
      </Stage>
    ),
    code: `<Dropdown
  label="화면 방향"
  placeholder="선택"
  options={[{ value: 'landscape', label: '가로' }, { value: 'portrait', label: '세로' }]}
  onChange={setValue}
/>`,
    props: [
      { name: 'options', type: 'DropdownOption[]', description: '{ value, label, disabled? } 목록.' },
      { name: 'value / defaultValue', type: 'string', description: '선택된 값.' },
      { name: 'onChange', type: '(value: string) => void', description: '고른 값을 받습니다.' },
      { name: 'label', type: 'ReactNode', description: '위 라벨(8px).' },
      { name: 'placeholder', type: 'ReactNode', defaultValue: "'Text'", description: '선택 전 문구.' },
      ICON('ic_info_fill'),
      { name: 'plain', type: 'boolean', defaultValue: 'false', description: '테두리·화살표 없는 텍스트형.' },
      DISABLED,
    ],
  },
  {
    id: 'tag',
    name: 'Tag',
    figma: 'tag_text, 12 variants + element/badgedot',
    description: '항목의 상태나 분류를 짧게 표시합니다. 누를 수 없는 표시용입니다. 숫자 알림에는 BadgeDot을 씁니다.',
    Preview: () => (
      <>
        <Stage label="medium">
          <Tag label="온라인" />
          <Tag status="secondary" label="예약됨" />
          <Tag status="error" label="오프라인" icon />
        </Stage>
        <Stage label="small, BadgeDot">
          <Tag size="small" label="신규" />
          <Tag size="small" status="error" label="점검" icon />
          <BadgeDot size="large" count={3} />
          <BadgeDot />
        </Stage>
      </>
    ),
    code: `<Tag label="온라인" />
<Tag status="error" label="오프라인" icon />
<BadgeDot size="large" count={3} />`,
    props: [
      { name: 'label', type: 'ReactNode', description: '태그 텍스트.' },
      { name: 'status', type: "'primary' | 'secondary' | 'error'", defaultValue: "'primary'", description: '배경 색상.' },
      { name: 'size', type: "'medium' | 'small'", defaultValue: "'medium'", description: '12px / 10px.' },
      ICON('ic_info_fill'),
    ],
  },
  {
    id: 'tabs',
    name: 'Tabs',
    figma: 'tab_group_line, element/tab_line',
    description: '같은 화면 안에서 내용을 나눠 봅니다. 좌우 화살표 키로 탭을 옮길 수 있습니다.',
    Preview: () => (
      <div className="flex w-full flex-col gap-6">
        <Tabs
          aria-label="기기 정보"
          items={[
            { value: 'status', label: '상태' },
            { value: 'schedule', label: '스케줄' },
            { value: 'content', label: '콘텐츠' },
            { value: 'log', label: '로그', disabled: true },
          ]}
        />
        <Tabs
          aria-label="기간"
          height="h36"
          type="full"
          items={[
            { value: 'd', label: '일간' },
            { value: 'w', label: '주간' },
            { value: 'm', label: '월간' },
          ]}
        />
      </div>
    ),
    code: `<Tabs
  items={[{ value: 'status', label: '상태' }, { value: 'schedule', label: '스케줄' }]}
  value={tab}
  onChange={setTab}
/>`,
    props: [
      { name: 'items', type: 'TabItem[]', description: '{ value, label, disabled? } 목록.' },
      { name: 'value / defaultValue', type: 'string', description: '선택된 탭. 생략하면 첫 탭.' },
      { name: 'onChange', type: '(value: string) => void', description: '고른 탭을 받습니다.' },
      { name: 'height', type: "'h48' | 'h36'", defaultValue: "'h48'", description: '탭 글자 15px / 10px.' },
      { name: 'type', type: "'flex' | 'full'", defaultValue: "'flex'", description: 'full은 너비를 균등 분할합니다.' },
      { name: 'divider', type: 'boolean', defaultValue: 'true', description: '비선택 탭 아래 구분선.' },
    ],
  },
];

export function ComponentSection({ doc }: { doc: ComponentDoc }) {
  const { Preview } = doc;
  return (
    <section id={doc.id} aria-labelledby={`${doc.id}-title`} className="scroll-mt-36 md:scroll-mt-6 border-t border-neutral-100 py-14">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 id={`${doc.id}-title`} className="text-heading-3 text-neutral-100">
          {doc.name}
        </h2>
        <span className="text-body-4 text-neutral-70">Figma: {doc.figma}</span>
      </header>
      <p className="mb-6 max-w-2xl text-body-3 text-neutral-70">{doc.description}</p>

      <div className="ring-1 ring-inset ring-neutral-40">
        <div className="flex flex-col gap-6 bg-neutral-10 p-6">
          <Preview />
        </div>
        <CodeBlock code={doc.code} />
      </div>

      <h3 className="mb-2 mt-8 text-body-2 font-bold text-neutral-100">Props</h3>
      <PropsTable rows={doc.props} />
    </section>
  );
}
