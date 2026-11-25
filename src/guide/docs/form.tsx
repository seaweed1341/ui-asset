import { useState, type ReactNode } from 'react';
import { Button, Dropdown, IconButton, IconEdit, IconDelete, Switch, TextField } from '../../components';
import {
  ChoiceGroup,
  FileDropZone,
  FormField,
  FormInputGroup,
  FormSection,
  FormTitle,
  NumberField,
  RequiredNote,
  Slider,
  TextArea,
  type FileDropItem,
} from '../../components/form';
import type { ComponentDoc } from '../ComponentDocs';
import type { PropRow } from '../ui';

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </div>
  );
}

const DISABLED: PropRow = { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '비활성화. 투명도 40%가 적용되고 조작할 수 없습니다.' };
const HELPER: PropRow[] = [
  { name: 'helperText', type: 'ReactNode', description: '하단 보조 문구 (Figma: ♦ bottom-text).' },
  { name: 'error', type: 'boolean | string', defaultValue: 'false', description: '오류 상태. 문자열이면 하단 문구를 오류 문구로 바꿉니다.' },
  { name: 'showCount', type: 'boolean', defaultValue: 'false', description: '하단 글자 수 (Figma: ♦ bottom-count). maxLength가 필요합니다.' },
  { name: 'plain', type: 'boolean', defaultValue: 'false', description: '테두리 없는 읽기 전용 텍스트 (Figma: status=text).' },
];

const opts = [
  { value: 'a', label: 'label' },
  { value: 'b', label: 'label' },
  { value: 'c', label: 'label' },
  { value: 'd', label: 'label' },
];
const dropOpts = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

function SliderDemo() {
  const [v, setV] = useState(6500);
  return <Slider min={0} max={10000} step={100} legend={[0, 5000, 10000]} value={v} onChange={setV} unit="dim" tooltip />;
}

function DropDemo() {
  const [files, setFiles] = useState<FileDropItem[]>([
    { name: 'File Name_01.png', size: 15 * 1024 * 1024 },
    { name: 'File Name_02.png', size: 15 * 1024 * 1024 },
  ]);
  return (
    <>
      <FileDropZone files={files} onFilesChange={setFiles} onDownload={() => undefined} />
      <FileDropZone size="small" files={files.slice(0, 1)} onFilesChange={(f) => setFiles([...f, ...files.slice(1)])} onDownload={() => undefined} />
    </>
  );
}

export const formDocs: ComponentDoc[] = [
  {
    id: 'number-field',
    name: 'NumberField',
    figma: 'input_number, 5 variants',
    description: '숫자를 직접 입력하거나 오른쪽 화살표로 한 단계씩 올리고 내립니다. 입력창에서 ↑/↓(step), PageUp/PageDown(×10), Home/End(min/max)로도 조작합니다.',
    Preview: () => (
      <>
        <Stage label="status">
          <NumberField defaultValue={null} />
          <NumberField defaultValue={12} min={0} max={20} />
          <NumberField defaultValue={30} error="0~20 사이로 입력하세요" />
          <NumberField defaultValue={5} disabled />
          <NumberField defaultValue={5} plain />
        </Stage>
        <Stage label="label · icon · unit · bottom">
          <NumberField label="Label" defaultValue={3} unit="unit" helperText="supporting text" />
          <NumberField label="Label" icon defaultValue={1} step={0.5} helperText="step 0.5" />
        </Stage>
      </>
    ),
    code: `const [count, setCount] = useState<number | null>(1);
<NumberField label="수량" value={count} onChange={setCount} min={0} max={20} unit="개" />
<NumberField defaultValue={30} error="0~20 사이로 입력하세요" />`,
    props: [
      { name: 'value / defaultValue', type: 'number | null', description: '제어 / 비제어 값. 빈 칸은 null.' },
      { name: 'onChange', type: '(value: number | null) => void', description: '값이 바뀔 때.' },
      { name: 'min / max / step', type: 'number', defaultValue: '– / – / 1', description: '범위와 증감 단위. blur 때 범위 밖 값은 잘라냅니다.' },
      { name: 'label', type: 'ReactNode', description: '위 라벨 (Figma: ♦ label).' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'false', description: '왼쪽 아이콘. true면 ic_search (Figma: ♦ left icon).' },
      { name: 'unit', type: 'ReactNode', description: '오른쪽 단위 (Figma: ♦ right-text).' },
      { name: 'clearable', type: 'boolean', defaultValue: 'true', description: '포커스 중 값이 있으면 지우기 버튼 (Figma: status=active).' },
      ...HELPER,
      DISABLED,
    ],
  },
  {
    id: 'text-area',
    name: 'TextArea',
    figma: 'input_text_multi, 5 variants',
    description: '여러 줄 텍스트를 입력합니다. 글자 수 제한이 있으면 showCount로 하단에 표시합니다.',
    Preview: () => (
      <Stage label="status">
        <TextArea helperText="supporting text" showCount maxLength={100} />
        <TextArea defaultValue="입력한 내용" helperText="supporting text" showCount maxLength={100} />
        <TextArea defaultValue="입력한 내용" error="error text" showCount maxLength={100} />
        <TextArea helperText="supporting text" disabled />
        <TextArea defaultValue="읽기 전용 텍스트" plain />
        <TextArea label="Label" placeholder="메모를 입력하세요" />
      </Stage>
    ),
    code: `<TextArea label="메모" maxLength={100} showCount helperText="100자 이내" />
<TextArea error="필수 항목입니다" />`,
    props: [
      { name: 'value / defaultValue', type: 'string', description: '제어 / 비제어 값.' },
      { name: 'onValueChange', type: '(value: string) => void', description: '값이 바뀔 때 (네이티브 onChange도 함께 호출).' },
      { name: 'label', type: 'ReactNode', description: '위 라벨 (Figma 세트에는 없음, TextField와 같은 형태).' },
      { name: 'placeholder', type: 'string', defaultValue: "'placeholder'", description: 'Figma: text.' },
      ...HELPER,
      DISABLED,
    ],
  },
  {
    id: 'slider',
    name: 'Slider',
    figma: 'slider 4 · element/rail_slider 6 · element/handler_slider 12 · Tick Mark 5',
    description: '범위 안의 값을 끌어서 고릅니다. 네이티브 range 입력을 쓰므로 방향키·PageUp/Down·Home/End로 조작할 수 있고, 오른쪽 입력칸으로 정확한 값을 넣을 수 있습니다.',
    Preview: () => (
      <>
        <Stage label="case=text · num-position=downside / upside">
          <Slider min={0} max={20} defaultValue={10} unit="dim" />
          <Slider min={0} max={20} defaultValue={10} unit="dim" numPosition="upside" />
        </Stage>
        <Stage label="case=icon">
          <Slider case="icon" icon startLabel="A" endLabel="B" min={0} max={20} defaultValue={10} unit="dim" />
          <Slider case="icon" icon startLabel="A" endLabel="B" min={0} max={20} defaultValue={10} unit="dim" numPosition="upside" />
        </Stage>
        <Stage label="railStyle=point · tooltip · tickmark=5 · disabled">
          <Slider railStyle="point" min={0} max={20} defaultValue={5} input={false} />
          <div className="pt-8">
            <SliderDemo />
          </div>
          <Slider min={0} max={20} defaultValue={15} tickmark={5} legend={false} input={false} />
          <Slider min={0} max={20} defaultValue={10} unit="dim" disabled />
        </Stage>
      </>
    ),
    code: `const [v, setV] = useState(6500);
<Slider min={0} max={10000} step={100} value={v} onChange={setV} unit="dim" />
<Slider case="icon" icon startLabel="A" endLabel="B" numPosition="upside" />
<Slider railStyle="point" tooltip input={false} />`,
    props: [
      { name: 'value / defaultValue', type: 'number', description: '제어 / 비제어 값.' },
      { name: 'onChange', type: '(value: number) => void', description: '값이 바뀔 때.' },
      { name: 'min / max / step', type: 'number', defaultValue: '0 / 100 / 1', description: '범위와 단위. −/+ 버튼도 step만큼 움직입니다.' },
      { name: 'case', type: "'text' | 'icon'", defaultValue: "'text'", description: 'text = 양쪽 −/+ 버튼, icon = 양쪽 아이콘·글자 라벨.' },
      { name: 'numPosition', type: "'downside' | 'upside'", defaultValue: "'downside'", description: '눈금 숫자 위치 (Figma: num-position).' },
      { name: 'legend', type: 'boolean | ReactNode[]', defaultValue: 'true', description: '눈금 숫자. true면 [min, 중간, max].' },
      { name: 'tickmark', type: 'boolean | number', defaultValue: 'true', description: '눈금선. true면 9개, 숫자면 그 개수.' },
      { name: 'railStyle', type: "'bar' | 'point'", defaultValue: "'bar'", description: '레일·손잡이 모양 (rail_slider / handler_slider style).' },
      { name: 'tooltip', type: 'boolean', defaultValue: 'false', description: '손잡이 위 값 말풍선 (handler_slider tooltip=on).' },
      { name: 'formatValue', type: '(v: number) => string', defaultValue: 'String', description: '말풍선·스크린리더 값 표시 형식.' },
      { name: 'input', type: 'boolean', defaultValue: 'true', description: '오른쪽 숫자 입력칸 (Figma: ♦ right-area). blur/Enter에서 반영.' },
      { name: 'unit', type: 'ReactNode', description: '입력칸 옆 단위 (Figma: ♦ right-text).' },
      { name: 'startLabel / endLabel', type: 'ReactNode', description: 'case=icon 양쪽 글자 (Figma: ♦ text label).' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'false', description: 'case=icon 양쪽 아이콘. true면 ic_info (Figma: ♦ icon label).' },
      DISABLED,
    ],
  },
  {
    id: 'file-drop-zone',
    name: 'FileDropZone',
    figma: 'drag & drop files, 4 variants',
    description: '파일을 끌어다 놓거나 Browse File 버튼으로 고릅니다. 파일이 올라가면 목록(status=over)으로 바뀌고, 각 파일을 지울 수 있습니다.',
    Preview: () => (
      <>
        <Stage label="status=normal · size=large / small">
          <FileDropZone accept="image/png,image/tiff,image/jpeg" />
          <FileDropZone size="small" />
        </Stage>
        <Stage label="status=over (파일 있음)">
          <DropDemo />
        </Stage>
      </>
    ),
    code: `const [files, setFiles] = useState<FileDropItem[]>([]);
<FileDropZone
  accept="image/png,image/tiff,image/jpeg"
  files={files}
  onFilesChange={setFiles}
  onDownload={(list) => download(list)}
/>
<FileDropZone size="small" subText={false} />`,
    props: [
      { name: 'size', type: "'large' | 'small'", defaultValue: "'large'", description: 'large는 안내 그림과 h26 버튼, small은 한 줄 요약.' },
      { name: 'files / defaultFiles', type: 'FileDropItem[]', description: '제어 / 비제어 목록 ({ id?, name, size?, file? }). 비어 있지 않으면 status=over 화면.' },
      { name: 'onFilesChange', type: '(files: FileDropItem[]) => void', description: '추가·삭제로 목록이 바뀔 때.' },
      { name: 'onFilesAdd', type: '(files: File[]) => void', description: '새로 고르거나 놓은 원본 File (업로드 요청에 사용).' },
      { name: 'accept / multiple', type: 'string / boolean', defaultValue: '– / true', description: '숨은 file input에 전달.' },
      { name: 'title', type: 'ReactNode', defaultValue: "'Drag and drop files upload'", description: '안내 제목.' },
      { name: 'subText', type: 'ReactNode | false', defaultValue: "'Supported files: PNG, TIFF, JPG'", description: '보조 문구 (Figma: ♦ sub text).' },
      { name: 'browseLabel / downloadLabel', type: 'ReactNode', defaultValue: "'Browse File' / 'Download File'", description: '버튼 글자.' },
      { name: 'onDownload', type: '(files) => void', description: '주면 파일이 있을 때 Download File 버튼을 표시.' },
      { name: 'artwork', type: 'boolean | ReactNode', defaultValue: 'true', description: 'large 안내 그림 (ic_artwork_dummy 자리).' },
      DISABLED,
    ],
  },
  {
    id: 'form-field',
    name: 'FormField · FormTitle · FormInputGroup',
    figma: 'form 10 · element/base_form_1 12 · element/base_form_element 3 · element/base_form_title',
    description: '제목(필수 *)과 입력 요소를 한 항목으로 묶습니다. 제목은 위(vertical) 또는 왼쪽(horizontal)에 두고, 입력 오른쪽 보조 버튼(aside)과 아래 버튼(action)을 붙일 수 있습니다. 입력 두 개를 나란히 둘 때는 FormInputGroup을 씁니다.',
    Preview: () => (
      <>
        <Stage label="type=input/dropdown · vertical / horizontal">
          <FormField title="Title" required className="w-[220px]" aside={<Button variant="secondary" height="h26" label="Button" />} action={<Button height="h26" label="Button" />}>
            <TextField height="h36" className="w-full" />
          </FormField>
          <FormField orientation="horizontal" title="Title" required className="w-[220px]" aside={<Button variant="secondary" height="h26" label="Button" />} action={<Button height="h26" label="Button" />}>
            <TextField height="h36" className="w-full" />
          </FormField>
        </Stage>
        <Stage label="type=input_text_multi">
          <FormField type="textarea" title="Title" required className="w-[219px]" action={<Button height="h26" label="Button" />}>
            <TextArea className="w-full" />
          </FormField>
          <FormField type="textarea" orientation="horizontal" title="Title" required className="w-[281px]" action={<Button height="h26" label="Button" />}>
            <TextArea className="w-full" />
          </FormField>
        </Stage>
        <Stage label="type=radio/check · switch">
          <FormField type="choice" title="Title" required>
            <ChoiceGroup options={opts} defaultValue="a" />
          </FormField>
          <FormField type="choice" orientation="horizontal" title="Title" required>
            <ChoiceGroup type="check" options={opts} defaultValue={['a']} />
          </FormField>
          <FormField type="switch" title="Title" required>
            <Switch defaultChecked aria-label="Title" />
          </FormField>
          <FormField type="switch" orientation="horizontal" title="Title" required>
            <Switch defaultChecked aria-label="Title" />
          </FormField>
        </Stage>
        <Stage label="FormInputGroup (base_form_1 count=2) · aside icon button">
          <FormField title="기간" className="w-[320px]">
            <FormInputGroup>
              <Dropdown options={dropOpts} placeholder="Text" />
              <Dropdown options={dropOpts} placeholder="Text" />
            </FormInputGroup>
          </FormField>
          <FormField
            title="Title"
            className="w-[260px]"
            aside={
              <>
                <IconButton label="편집" icon={<IconEdit />} />
                <IconButton label="삭제" icon={<IconDelete />} />
              </>
            }
          >
            <FormInputGroup>
              <TextField height="h36" />
              <TextField height="h36" />
            </FormInputGroup>
          </FormField>
          <FormTitle required>Title</FormTitle>
        </Stage>
      </>
    ),
    code: `<FormField title="장치 이름" required htmlFor="device-name"
  aside={<Button variant="secondary" height="h26" label="중복 확인" />}
  action={<Button height="h26" label="저장" />}>
  <TextField id="device-name" height="h36" className="w-full" />
</FormField>

<FormField type="choice" orientation="horizontal" title="방향">
  <ChoiceGroup options={[{ value: 'h', label: '가로' }, { value: 'v', label: '세로' }]} defaultValue="h" />
</FormField>

<FormField title="기간">
  <FormInputGroup>
    <TextField height="h36" />
    <TextField height="h36" />
  </FormInputGroup>
</FormField>`,
    props: [
      { name: 'title', type: 'ReactNode', description: '항목 제목 12px Bold (Figma: ♦ title).' },
      { name: 'required', type: 'boolean', defaultValue: 'false', description: '제목 옆 * 표시 (base_form_title ♦ *).' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: '제목 위치 (Figma: title 베리언트).' },
      { name: 'type', type: "'input' | 'textarea' | 'choice' | 'switch'", defaultValue: "'input'", description: 'Figma type(input/dropdown · input_text_multi · radio/check · switch). 간격과 가로형 제목 정렬이 달라집니다.' },
      { name: 'htmlFor', type: 'string', description: '제목을 해당 입력의 <label>로 연결.' },
      { name: 'aside', type: 'ReactNode', description: '입력 오른쪽 요소 (Figma: ♦ element — button / icon button / switch).' },
      { name: 'action', type: 'ReactNode', description: '입력 아래 버튼, 폭을 채움 (Figma: ♦ button_down).' },
      { name: 'labeled', type: 'boolean', defaultValue: 'false', description: '입력에 위 라벨이 있을 때 aside를 아래 정렬 (Figma: ♦ label=on).' },
      { name: 'titleWidth', type: 'number | string', description: '가로형에서 제목 열 폭을 맞출 때.' },
    ],
  },
  {
    id: 'choice-group',
    name: 'ChoiceGroup',
    figma: 'element/base_form_2, 4 variants',
    description: '라디오 또는 체크박스 묶음입니다. 기존 Radio·Checkbox(라벨형)를 세로(gap 8) 또는 가로(gap 16)로 늘어놓습니다.',
    Preview: () => (
      <>
        <Stage label="type=radio · vertical / horizontal">
          <ChoiceGroup options={opts} defaultValue="a" aria-label="radio vertical" />
          <ChoiceGroup options={opts} defaultValue="b" orientation="horizontal" aria-label="radio horizontal" />
        </Stage>
        <Stage label="type=check · vertical / horizontal · disabled">
          <ChoiceGroup type="check" options={opts} defaultValue={['a', 'c']} aria-label="check vertical" />
          <ChoiceGroup type="check" options={opts} defaultValue={['b']} orientation="horizontal" aria-label="check horizontal" />
          <ChoiceGroup options={opts} defaultValue="a" disabled aria-label="disabled" />
        </Stage>
      </>
    ),
    code: `const [mode, setMode] = useState('a');
<ChoiceGroup options={options} value={mode} onChange={setMode} />
<ChoiceGroup type="check" orientation="horizontal" options={options} defaultValue={['a']} />`,
    props: [
      { name: 'type', type: "'radio' | 'check'", defaultValue: "'radio'", description: 'radio_label / checkbox_label.' },
      { name: 'options', type: 'ChoiceOption[]', description: '{ value, label, disabled? } 목록.' },
      { name: 'value / defaultValue', type: 'string (radio) | string[] (check)', description: '제어 / 비제어 선택 값.' },
      { name: 'onChange', type: '(value) => void', description: '선택이 바뀔 때. check는 배열.' },
      { name: 'orientation', type: "'vertical' | 'horizontal'", defaultValue: "'vertical'", description: '세로 gap 8 / 가로 gap 16.' },
      { name: 'name', type: 'string', description: '라디오 name (생략하면 자동).' },
      DISABLED,
    ],
  },
  {
    id: 'form-section',
    name: 'FormSection · RequiredNote',
    figma: 'title_paragraph 2 · required items',
    description: '폼을 단락으로 나누는 제목과, "* is required" 필수 항목 안내입니다. 첫 단락은 type="top"으로 위 여백을 없앱니다.',
    Preview: () => (
      <div className="flex w-[360px] flex-col">
        <FormSection type="top" title="기본 정보" extra={<RequiredNote />}>
          <FormField orientation="horizontal" title="이름" required titleWidth={56}>
            <TextField height="h36" className="w-full" />
          </FormField>
          <FormField orientation="horizontal" title="메모" type="textarea" titleWidth={56}>
            <TextArea className="w-full" />
          </FormField>
        </FormSection>
        <FormSection title="설정">
          <FormField orientation="horizontal" title="밝기" titleWidth={56}>
            <NumberField defaultValue={50} min={0} max={100} unit="%" />
          </FormField>
          <RequiredNote error />
        </FormSection>
      </div>
    ),
    code: `<FormSection type="top" title="기본 정보" extra={<RequiredNote />}>
  <FormField orientation="horizontal" title="이름" required>…</FormField>
</FormSection>
<FormSection title="설정">…</FormSection>
<RequiredNote error />`,
    props: [
      { name: 'FormSection.title', type: 'ReactNode', description: '단락 제목 12px Bold.' },
      { name: 'FormSection.type', type: "'default' | 'top'", defaultValue: "'default'", description: 'default = 위 여백 16px, top = 첫 단락.' },
      { name: 'FormSection.extra', type: 'ReactNode', description: '제목 오른쪽 요소 (예: RequiredNote).' },
      { name: 'RequiredNote.label', type: 'ReactNode', defaultValue: "'is required'", description: '* 옆 안내 문구.' },
      { name: 'RequiredNote.error', type: 'boolean | ReactNode', defaultValue: 'false', description: '미완료 경고. true면 "Not Completed" (error-60).' },
    ],
  },
];
