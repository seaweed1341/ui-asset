import { useRef, useState, type ReactNode } from 'react';
import { Button, IconInfo } from '../../components';
import {
  FilterPanel,
  FilterSection,
  GramFileSelect,
  GramLinkAvatar,
  GramPopup,
  GramPopupContent,
  GramSearchOpen,
  GramTutorialBottom,
  GramTutorialTop,
  LoadingDots,
  NotificationBox,
  PopupImage,
  PopupList,
  PopupSlot,
  Snackbar,
  TooltipSlot,
  TooltipSlotBox,
  useSnackbar,
} from '../../components/overlay';
import type { ComponentDoc } from '../ComponentDocs';

/** overlay 묶음: 스낵바 · 알림 상자 · 슬롯 툴팁 · 팝업 변형 · 필터 패널 · 로딩(dot) · gram 전용 오버레이 */

function Stage({ children, label, column }: { children: ReactNode; label?: string; column?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className={column ? 'flex flex-col items-start gap-3' : 'flex flex-wrap items-center gap-4'}>{children}</div>
    </div>
  );
}

const noop = () => {};

const DEVICES = Array.from({ length: 12 }, (_, i) => ({ value: `d${i + 1}`, label: `Device ${String(i + 1).padStart(2, '0')}` }));

export const overlayDocs: ComponentDoc[] = [
  /* ---------------------------------------------------------------- Snackbar */
  {
    id: 'snackbar',
    name: 'Snackbar',
    figma: 'snackbar',
    description:
      '작업 결과를 화면 아래에 잠깐 알리고, 실행 취소 같은 바로가기 버튼을 붙일 수 있습니다. 첫 번째 버튼은 primary, 나머지는 secondary(h20)입니다. useSnackbar()로 여러 개를 차례로 보여 줄 수 있습니다. 포커스를 빼앗지 않고 role=status로 읽힙니다.',
    Preview: function SnackbarPreview() {
      const snackbar = useSnackbar();
      const n = useRef(0);
      return (
        <>
          <Stage label="message only · with close" column>
            <Snackbar message="설정을 저장했습니다." />
            <Snackbar message="설정을 저장했습니다." onClose={noop} />
          </Stage>
          <Stage label="actions (1 primary + secondary)" column>
            <Snackbar message="기기 3대를 삭제했습니다." actions={[{ label: '실행 취소', onClick: noop }]} onClose={noop} />
            <Snackbar
              message="새 버전이 있습니다."
              actions={[
                { label: '업데이트', onClick: noop },
                { label: '나중에', onClick: noop },
              ]}
              onClose={noop}
            />
          </Stage>
          <Stage label="useSnackbar() queue">
            <Button
              variant="secondary"
              height="h26"
              label="스낵바 띄우기"
              onClick={() => snackbar.show({ message: `알림 ${++n.current}`, actions: [{ label: '확인', onClick: noop }], duration: 3000 })}
            />
            {snackbar.element}
          </Stage>
        </>
      );
    },
    code: `<Snackbar message="기기 3대를 삭제했습니다." actions={[{ label: '실행 취소', onClick: undo }]} onClose={close} />

// 큐
const snackbar = useSnackbar();
snackbar.show({ message: '저장했습니다.', actions: [{ label: '보기', onClick: open }], duration: 4000 });
return <>{page}{snackbar.element}</>;`,
    props: [
      { name: 'message', type: 'ReactNode', description: '메시지 (10px Regular, neutral-10).' },
      { name: 'actions', type: 'SnackbarAction[]', defaultValue: '[]', description: '버튼 슬롯. 첫 번째 primary, 나머지 secondary.' },
      { name: 'maxActions', type: 'number', defaultValue: '3', description: '그릴 버튼 최대 개수.' },
      { name: 'onClose', type: '() => void', description: '주면 닫기(×) 표시. 포커스가 안에 있을 때 Esc로도 닫힙니다.' },
      { name: 'width', type: "number | 'auto'", defaultValue: '456', description: '폭(px).' },
      { name: 'useSnackbar()', type: '{ show, dismiss, clear, element, count }', description: 'show(options)로 큐에 추가. options.duration(ms, 기본 4000, 0=유지), closable.' },
    ],
  },

  /* --------------------------------------------------------- NotificationBox */
  {
    id: 'notification-box',
    name: 'NotificationBox',
    figma: 'notification box',
    description:
      '화면 안에 고정되는 안내 배너입니다. Figma 원본은 default 하나뿐이고, info/success/warning/error는 상태 색 토큰(10 배경, 20 테두리, 60 아이콘)으로 확장했습니다. warning·error는 role=alert, 나머지는 role=status입니다.',
    Preview: () => (
      <Stage column>
        <NotificationBox>라이선스가 30일 후 만료됩니다.</NotificationBox>
        <NotificationBox status="info" title="업데이트 안내" onClose={noop}>
          새 펌웨어(v2.4.1)를 사용할 수 있습니다.
        </NotificationBox>
        <NotificationBox status="success">기기 등록을 마쳤습니다.</NotificationBox>
        <NotificationBox status="warning" action={<Button variant="secondary" height="h20" label="자세히" />}>
          저장 공간이 10% 남았습니다.
        </NotificationBox>
        <NotificationBox status="error" title="연결 실패" onClose={noop}>
          서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.
        </NotificationBox>
      </Stage>
    ),
    code: `<NotificationBox>라이선스가 30일 후 만료됩니다.</NotificationBox>
<NotificationBox status="error" title="연결 실패" onClose={close}>서버에 연결할 수 없습니다.</NotificationBox>`,
    props: [
      { name: 'status', type: "'default' | 'info' | 'success' | 'warning' | 'error'", defaultValue: "'default'", description: 'default가 Figma 원본(raw #f5f6fa → info-10).' },
      { name: 'children', type: 'ReactNode', description: '본문 (Figma: Text, 12px Medium neutral-70).' },
      { name: 'title', type: 'ReactNode', description: '굵은 제목.' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'true', description: '상태별 기본 아이콘(19px). ReactNode면 교체, false면 숨김.' },
      { name: 'action', type: 'ReactNode', description: '오른쪽 버튼·링크.' },
      { name: 'onClose', type: '() => void', description: '주면 닫기(×) 버튼.' },
    ],
  },

  /* ------------------------------------------------------------- TooltipSlot */
  {
    id: 'tooltip-slot',
    name: 'TooltipSlot',
    figma: 'tootip_slot (8 variants) + element/arrow_tooltip',
    description:
      '말풍선 안에 자유로운 내용(슬롯)을 넣는 툴팁·팝오버입니다. trigger="hover"는 마우스 오버·포커스 때 role=tooltip으로, trigger="click"은 클릭으로 여닫는 비모달 role=dialog로 뜹니다. Esc로 닫히고 click 모드는 닫힐 때 트리거로 포커스가 돌아갑니다. placement는 말풍선이 뜨는 쪽이며 꼬리는 그 반대 변(Figma position)에 붙습니다.',
    Preview: () => (
      <>
        <Stage label="TooltipSlotBox — Figma position × align">
          {(['top', 'bottom', 'left', 'right'] as const).map((p) =>
            (['start', 'center'] as const).map((a) => (
              <TooltipSlotBox key={p + a} position={p} align={a}>
                {p} / {a}
              </TooltipSlotBox>
            )),
          )}
        </Stage>
        <Stage label="hover (placement)">
          {(['top', 'bottom', 'left', 'right'] as const).map((p) => (
            <TooltipSlot key={p} placement={p} content={`placement=${p}`}>
              <Button variant="secondary" height="h26" label={p} />
            </TooltipSlot>
          ))}
          <TooltipSlot placement="bottom" align="start" content="align=start — 꼬리가 트리거 가운데를 가리킵니다">
            <button type="button" aria-label="설명 보기" className="inline-flex size-4 text-neutral-70 [&>svg]:size-full">
              <IconInfo />
            </button>
          </TooltipSlot>
        </Stage>
        <Stage label="click (rich content)">
          <TooltipSlot
            trigger="click"
            label="기기 정보"
            placement="right"
            align="start"
            content={
              <div className="flex w-44 flex-col gap-1.5">
                <p className="font-bold">Lobby-01</p>
                <p>모델 55XS4J · 펌웨어 v2.4.1</p>
                <Button height="h20" label="상세 보기" className="self-start" />
              </div>
            }
          >
            <Button variant="secondary" height="h26" label="클릭해서 열기" />
          </TooltipSlot>
        </Stage>
      </>
    ),
    code: `<TooltipSlot placement="bottom" content="저장된 설정이 모든 기기에 적용됩니다.">
  <button aria-label="설명 보기"><IconInfo /></button>
</TooltipSlot>

<TooltipSlot trigger="click" label="기기 정보" placement="right" align="start" content={<DeviceCard />}>
  <Button variant="secondary" label="정보" />
</TooltipSlot>`,
    props: [
      { name: 'content', type: 'ReactNode', description: '말풍선 내용 (Figma textbox SLOT, 10px Regular).' },
      { name: 'children', type: 'ReactNode', description: '트리거. 포커스 가능한 요소 하나를 권장(aria 속성이 자동으로 붙음).' },
      { name: 'placement', type: "'top' | 'bottom' | 'left' | 'right'", defaultValue: "'bottom'", description: '말풍선 위치. Figma position은 이것의 반대(꼬리 변).' },
      { name: 'align', type: "'start' | 'center'", defaultValue: "'center'", description: '꼬리 위치. start는 꼬리가 트리거 가운데를 가리키도록 말풍선을 밀어 배치.' },
      { name: 'trigger', type: "'hover' | 'click'", defaultValue: "'hover'", description: 'hover=tooltip, click=비모달 dialog(바깥 클릭·Esc로 닫힘).' },
      { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: '제어·비제어 모두 지원.' },
      { name: 'label', type: 'string', description: 'click 모드 대화상자의 이름(aria-label).' },
      { name: 'maxWidth', type: 'number', defaultValue: '240', description: '말풍선 최대 폭(px).' },
    ],
  },

  /* -------------------------------------------------------------- PopupImage */
  {
    id: 'popup-image',
    name: 'PopupImage',
    figma: 'popup_image',
    description: '큰 제목(h53) 아래 이미지(424×194)를 보여 주는 팝업입니다. 기존 Popup(size=large) 위에 만들어서 dim·포커스 이동·Esc 닫기·포커스 복귀가 같습니다.',
    Preview: function PopupImagePreview() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Stage label="inline">
            <PopupImage inline open onClose={noop} title="Popup title" titleIcon cancel={{ label: '취소', onClick: noop }} confirm={{ label: '확인', onClick: noop }} />
          </Stage>
          <Stage label="modal">
            <Button variant="secondary" height="h26" label="팝업 열기" onClick={() => setOpen(true)} />
            <PopupImage
              open={open}
              onClose={() => setOpen(false)}
              title="화면 미리보기"
              description="선택한 콘텐츠가 이렇게 표시됩니다."
              cancel={{ label: '취소', onClick: () => setOpen(false) }}
              confirm={{ label: '적용', onClick: () => setOpen(false) }}
            />
          </Stage>
        </>
      );
    },
    code: `<PopupImage open={open} onClose={close} title="화면 미리보기" src={url} alt="미리보기"
  cancel={{ label: '취소', onClick: close }} confirm={{ label: '적용', onClick: apply }} />`,
    props: [
      { name: 'open / onClose / title', type: 'boolean / () => void / ReactNode', description: 'Popup과 같습니다.' },
      { name: 'src / alt', type: 'string', description: '이미지. 없으면 neutral-20 자리표시.' },
      { name: 'imageHeight', type: 'number', defaultValue: '194', description: '이미지 높이(px).' },
      { name: 'description', type: 'ReactNode', description: '이미지 아래 설명.' },
      { name: 'children', type: 'ReactNode', description: '본문 슬롯을 직접 구성.' },
      { name: 'cancel / confirm', type: 'PopupAction', description: '[secondary][primary] 버튼.' },
      { name: 'width', type: 'number', defaultValue: '456', description: '폭(px).' },
      { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'dim 없이 제자리에 그리기.' },
    ],
  },

  /* --------------------------------------------------------------- PopupSlot */
  {
    id: 'popup-slot',
    name: 'PopupSlot',
    figma: 'popup type=slot',
    description: '작은 제목(h33) 아래 자유 슬롯(276×120)을 두고 넘치면 스크롤합니다. 기존 Popup(size=small) 위에 만들었습니다.',
    Preview: () => (
      <Stage>
        <PopupSlot inline open onClose={noop} title="적용 대상" cancel={{ label: '취소', onClick: noop }} confirm={{ label: '확인', onClick: noop }}>
          {DEVICES.map((d) => (
            <p key={d.value}>{d.label} — 55XS4J · Online</p>
          ))}
        </PopupSlot>
        <PopupSlot inline open onClose={noop} title="scroll=false" scroll={false} confirm={{ label: '확인', onClick: noop }}>
          <p>내용만큼 높이가 늘어납니다.</p>
        </PopupSlot>
      </Stage>
    ),
    code: `<PopupSlot open={open} onClose={close} title="적용 대상" confirm={{ label: '확인', onClick: close }}>
  {devices.map((d) => <p key={d.id}>{d.name}</p>)}
</PopupSlot>`,
    props: [
      { name: 'children', type: 'ReactNode', description: '본문 슬롯 (gap 10, 10px Regular neutral-70).' },
      { name: 'bodyHeight', type: 'number', defaultValue: '120', description: '본문 최대 높이(px).' },
      { name: 'scroll', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ scroll. false면 높이 제한 없음.' },
      { name: 'width', type: 'number', defaultValue: '300', description: '폭(px).' },
      { name: '…', type: 'PopupProps', description: 'open, onClose, title, cancel, confirm, titleIcon, inline.' },
    ],
  },

  /* --------------------------------------------------------------- PopupList */
  {
    id: 'popup-list',
    name: 'PopupList',
    figma: 'popup_list',
    description:
      '검색 + 선택 목록 + 하단 버튼으로 이뤄진 선택 팝업입니다. 목록은 role=listbox이며 화살표·Home/End로 이동하고 Space/Enter로 선택합니다. multiple이면 체크박스 다중 선택입니다. 선택된 행은 neutral-20 배경입니다.',
    Preview: function PopupListPreview() {
      const [single, setSingle] = useState<string[]>(['d2']);
      return (
        <Stage>
          <PopupList inline open onClose={noop} title="기기 선택" items={DEVICES} value={single} onValueChange={setSingle} onConfirm={noop} />
          <PopupList inline open onClose={noop} title="기기 선택 (multiple)" items={DEVICES} multiple search defaultValue={['d1', 'd3']} onConfirm={noop} />
        </Stage>
      );
    },
    code: `<PopupList open={open} onClose={close} title="기기 선택" items={devices} multiple search
  value={selected} onValueChange={setSelected} onConfirm={(v) => apply(v)} />`,
    props: [
      { name: 'items', type: 'PopupListItem[]', description: '{ value, label, searchText?, disabled? }' },
      { name: 'multiple', type: 'boolean', defaultValue: 'false', description: '체크박스 다중 선택.' },
      { name: 'value / defaultValue / onValueChange', type: 'string[]', description: '선택값 (제어·비제어).' },
      { name: 'search', type: 'boolean', defaultValue: 'false', description: '검색창(input_text h36).' },
      { name: 'listHeight', type: 'number', defaultValue: '143', description: '목록 최대 높이(px).' },
      { name: 'onConfirm / confirmLabel', type: "(value) => void / string", defaultValue: "'확인'", description: 'Figma ♦ bottom (1 button). 생략하면 버튼 없음.' },
      { name: 'width', type: 'number', defaultValue: '252', description: '폭(px).' },
    ],
  },

  /* ------------------------------------------------------------- FilterPanel */
  {
    id: 'filter-panel',
    name: 'FilterPanel · FilterSection',
    figma: 'filter + element/section_filter',
    description:
      '체크박스 묶음으로 목록을 거르는 패널입니다. LCS 화면설계서처럼 placement="right", width={246}으로 두면 화면 오른쪽에서 밀려 들어오고, 열릴 때 패널 안으로 포커스가 이동하며 Esc로 닫힙니다. FilterSection은 그룹 제목, 날짜 범위, 전체 선택 + 들여쓴 항목을 지원합니다.',
    Preview: function FilterPreview() {
      const [open, setOpen] = useState(false);
      const [status, setStatus] = useState<string[]>(['online']);
      const sections = (
        <>
          <FilterSection groupTitle="Device" title="Registered date" date />
          <FilterSection
            title="Status"
            allLabel="All"
            options={[
              { value: 'online', label: 'Online' },
              { value: 'offline', label: 'Offline' },
              { value: 'error', label: 'Error' },
            ]}
            value={status}
            onValueChange={setStatus}
          />
          <FilterSection
            title="Model"
            options={[
              { value: '55XS4J', label: '55XS4J' },
              { value: '49XF3E', label: '49XF3E' },
            ]}
          />
        </>
      );
      return (
        <>
          <Stage label="inline (300)">
            <FilterPanel height={480} onClose={noop} onReset={() => setStatus([])} onApply={noop}>
              {sections}
            </FilterPanel>
          </Stage>
          <Stage label='placement="right" · 246px (LCS)'>
            <Button variant="secondary" height="h26" label="필터 열기" onClick={() => setOpen(true)} />
            <FilterPanel placement="right" width={246} open={open} onClose={() => setOpen(false)} onReset={() => setStatus([])} onApply={() => setOpen(false)}>
              {sections}
            </FilterPanel>
          </Stage>
        </>
      );
    },
    code: `<FilterPanel placement="right" width={246} open={open} onClose={close} onReset={reset} onApply={apply}>
  <FilterSection groupTitle="Device" title="Registered date" date dateText={range} onDateClick={openPicker} />
  <FilterSection title="Status" allLabel="All" options={statusOptions} value={status} onValueChange={setStatus} />
</FilterPanel>`,
    props: [
      { name: 'placement', type: "'inline' | 'right'", defaultValue: "'inline'", description: 'right = 화면 오른쪽 고정 사이드 패널(슬라이드).' },
      { name: 'open / onClose', type: 'boolean / () => void', description: 'right일 때 열림. onClose를 주면 닫기(×)와 Esc 동작.' },
      { name: 'onReset / onApply', type: '() => void', description: '하단 [Reset][Apply] 버튼 (h26, 같은 폭).' },
      { name: 'width / height', type: 'number', defaultValue: '300 / auto', description: '폭(Figma 300, LCS 246), inline 높이.' },
      { name: 'scroll', type: 'boolean', defaultValue: 'true', description: 'Figma ♦ scroll.' },
      { name: 'FilterSection.groupTitle', type: 'ReactNode', description: '♦ title_divider — 회색 10px Bold 제목 + 구분선.' },
      { name: 'FilterSection.title', type: 'ReactNode', description: '섹션 제목 (12px Medium).' },
      { name: 'FilterSection.date', type: 'boolean | ReactNode', description: '♦ date picker. true면 기본 날짜 범위 필드(dateText, onDateClick).' },
      { name: 'FilterSection.options / allLabel', type: 'FilterOption[] / ReactNode', description: '체크박스 목록. allLabel이 있으면 전체 선택 + 16px 들여쓰기.' },
      { name: 'FilterSection.value / defaultValue / onValueChange', type: 'string[]', description: '선택값.' },
    ],
  },

  /* ------------------------------------------------------------- LoadingDots */
  {
    id: 'loading-dots',
    name: 'LoadingDots',
    figma: 'loading style=dot',
    description: '점 12개가 한 칸씩 도는 로딩 표시입니다(기존 Loading은 stroke 스타일). 움직임 줄이기 설정에서는 멈춥니다.',
    Preview: () => (
      <Stage>
        <LoadingDots />
        <LoadingDots size="small" />
        <LoadingDots label={false} ariaLabel="불러오는 중" />
        <LoadingDots size="small" label="기기 목록을 불러오는 중..." />
      </Stage>
    ),
    code: `<LoadingDots />
<LoadingDots size="small" label="기기 목록을 불러오는 중..." />
<LoadingDots label={false} ariaLabel="불러오는 중" />`,
    props: [
      { name: 'size', type: "'large' | 'small'", defaultValue: "'large'", description: 'large 36 + 15px(세로), small 14 + 10px(가로).' },
      { name: 'label', type: 'ReactNode | false', defaultValue: "'Loading...'", description: 'Figma ♦ text. false면 숨김.' },
      { name: 'ariaLabel', type: 'string', description: '스크린리더 이름(라벨이 없을 때).' },
    ],
  },

  /* ---------------------------------------------------------- GramFileSelect */
  {
    id: 'gram-file-select',
    name: 'GramFileSelect',
    figma: 'gram_fileselect (gram Only, 3 variants)',
    description:
      '첨부할 이미지·파일 한 칸입니다. 누르면 선택(Select: 빨간 2px 테두리 + 체크), 마우스를 올리거나 포커스하면 삭제 버튼이 나타납니다(focus_del).',
    Preview: () => (
      <Stage>
        <GramFileSelect onDelete={noop} />
        <GramFileSelect defaultSelected onDelete={noop} />
        <GramFileSelect label="IMG_0021.jpg" icon={false} />
        <GramFileSelect width={124} height={80} selectable={false} />
      </Stage>
    ),
    code: `<GramFileSelect src={thumb} alt="IMG_0021.jpg" selected={on} onSelectedChange={setOn} onDelete={remove} />`,
    props: [
      { name: 'src / alt / label', type: 'string / string / ReactNode', description: '썸네일, 이름, 아래쪽 텍스트(12px).' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'true', description: '오른쪽 위 아이콘(ic_null 24).' },
      { name: 'selected / defaultSelected / onSelectedChange', type: 'boolean', description: 'Select 상태(제어·비제어).' },
      { name: 'selectable', type: 'boolean', defaultValue: 'true', description: 'false면 보기 전용.' },
      { name: 'onDelete', type: '() => void', description: '주면 focus_del(hover/focus) 삭제 버튼.' },
      { name: 'width / height', type: 'number', defaultValue: '236 / 110', description: '크기(px).' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '투명도 40%.' },
    ],
  },

  /* --------------------------------------------------------------- GramPopup */
  {
    id: 'gram-popup',
    name: 'GramPopup · GramPopupContent',
    figma: 'gram_popup/popup + gram_popup/content (12 variants)',
    description:
      'gram Link 전용 팝업입니다. 진회색 상단 바, 가운데 정렬 본문(상단 텍스트, 콘텐츠 슬롯, 하단 텍스트), "다시 보지 않기", 확인 버튼으로 구성됩니다. 모달이며 포커스를 안에 가두고 Esc로 닫힙니다. GramPopupContent는 본문 슬롯용 12가지 내용입니다.',
    Preview: function GramPopupPreview() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Stage label="GramPopup (inline)">
            <GramPopup
              inline
              open
              onClose={noop}
              text="갤러리를 연결하면 사진을 바로 보낼 수 있습니다."
              bottomText="연결은 언제든 해제할 수 있습니다."
              dontShowAgain
              confirm={{ label: '확인', onClick: noop }}
            >
              <GramPopupContent variant="image" />
            </GramPopup>
            <GramPopup inline open onClose={noop} text="기기를 찾는 중입니다." loading confirm={{ label: '취소', onClick: noop }}>
              <GramPopupContent variant="device" />
            </GramPopup>
          </Stage>
          <Stage label="modal">
            <Button variant="secondary" height="h26" label="gram 팝업 열기" onClick={() => setOpen(true)} />
            <GramPopup open={open} onClose={() => setOpen(false)} text="TV 화면에 표시된 번호를 입력하세요." confirm={{ label: '확인', onClick: () => setOpen(false) }}>
              <GramPopupContent variant="code" code="12" />
            </GramPopup>
          </Stage>
          <Stage label="GramPopupContent variants">
            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
              {[
                ['qr', <GramPopupContent key="qr" variant="qr" />],
                ['code (Num)', <GramPopupContent key="code" variant="code" code="73" />],
                ['number (숫자)', <GramPopupContent key="num" variant="number" code="1234" label="인증 번호 1234" />],
                ['progress', <GramPopupContent key="pr" variant="progress" label="전송 중" value={40} />],
                ['multiImage', <GramPopupContent key="mi" variant="multiImage" files={[{ defaultSelected: true }, {}, {}, { onDelete: noop }]} />],
                ['terms (약관)', <GramPopupContent key="t" variant="terms">{'제1조(목적) 이 약관은 LG gram Link 서비스 이용 조건을 정합니다. '.repeat(6)}</GramPopupContent>],
                ['input', <GramPopupContent key="in" variant="input" onSubmit={noop} />],
                ['player (플레이어)', <GramPopupContent key="pl" variant="player" title="Bubble Gum" artist="NewJeans" progress={50} elapsed="00:21" />],
                ['list', <GramPopupContent key="li" variant="list" options={[{ value: 'a', label: '항목 1' }, { value: 'b', label: '항목 2' }]} />],
                ['feedback (의견작성)', <GramPopupContent key="fb" variant="feedback" />],
              ].map(([label, node]) => (
                <div key={label as string} className="flex flex-col items-center gap-2 bg-neutral-10 p-4 ring-1 ring-inset ring-neutral-20">
                  <span className="self-start font-mono text-[12px] text-neutral-70">{label}</span>
                  {node}
                </div>
              ))}
            </div>
          </Stage>
        </>
      );
    },
    code: `<GramPopup open={open} onClose={close} text="갤러리를 연결하면 사진을 바로 보낼 수 있습니다."
  dontShowAgain onDontShowAgainChange={setSkip} confirm={{ label: '확인', onClick: close }}>
  <GramPopupContent variant="image" src={preview} />
</GramPopup>

<GramPopupContent variant="player" title="Bubble Gum" artist="NewJeans" progress={50} elapsed="00:21" />
<GramPopupContent variant="feedback" onRatingChange={setRating} onCommentChange={setComment} />`,
    props: [
      { name: 'title', type: 'ReactNode | null', defaultValue: "'LG gram Link'", description: 'Figma Top. null이면 상단 바 숨김.' },
      { name: 'text / bottomText', type: 'ReactNode', description: '텍스트_상단 / 텍스트하단 (12px Medium, 가운데).' },
      { name: 'loading', type: 'boolean', defaultValue: 'false', description: 'text_icon — 상단 텍스트 앞 로딩 점 18.' },
      { name: 'children', type: 'ReactNode', description: '이미지 슬롯 (GramPopupContent).' },
      { name: 'dontShowAgain', type: 'boolean | string', defaultValue: 'false', description: '체크박스. checked/defaultChecked/onChange는 dontShowAgain* props.' },
      { name: 'confirm', type: 'PopupAction', description: '하단 primary 버튼(w210).' },
      { name: 'role', type: "'dialog' | 'alertdialog'", defaultValue: "'dialog'", description: '확인이 꼭 필요한 경고면 alertdialog.' },
      { name: 'inline', type: 'boolean', defaultValue: 'false', description: 'dim 없이 제자리에 그리기.' },
      {
        name: 'GramPopupContent.variant',
        type: "'image' | 'device' | 'qr' | 'code' | 'number' | 'progress' | 'multiImage' | 'terms' | 'input' | 'player' | 'list' | 'feedback'",
        description: 'Figma Property 1 (Num→code, 숫자→number, 약관→terms, 플레이어→player, 의견작성→feedback). variant마다 props가 다릅니다(타입이 안내).',
      },
    ],
  },

  /* ---------------------------------------------------------- GramSearchOpen */
  {
    id: 'gram-search-open',
    name: 'GramSearchOpen',
    figma: 'gram_search_open',
    description:
      '검색창을 펼친 상태입니다. 최근·추천 검색어를 섹션으로 보여 주고 항목마다 지우기, 섹션마다 전체 삭제를 둘 수 있습니다. 입력창에서 ↓로 항목으로 이동하고 Esc로 닫습니다.',
    Preview: function SearchPreview() {
      const [recent, setRecent] = useState(['서울시', '문서', '경주시', '안양시', '카리나']);
      return (
        <Stage>
          <GramSearchOpen
            autoFocus={false}
            placeholder="‘서울시’ 사진, 동영상에서 검색"
            onClose={noop}
            sections={[
              {
                id: 'recent',
                title: '최근 검색어',
                items: recent.map((v) => ({ value: v, label: v })),
                onRemove: (it) => setRecent((r) => r.filter((x) => x !== it.value)),
                onClearAll: () => setRecent([]),
              },
              {
                id: 'suggest',
                title: '추천 검색어',
                items: ['Screenshots', 'Selfies', 'Posters', 'Videos'].map((v) => ({ value: v, label: v })),
              },
            ]}
          />
        </Stage>
      );
    },
    code: `<GramSearchOpen placeholder="사진, 동영상에서 검색" value={q} onValueChange={setQ} onSubmit={search} onClose={close}
  sections={[{ id: 'recent', title: '최근 검색어', items, onRemove, onClearAll, onSelect }]} />`,
    props: [
      { name: 'value / defaultValue / onValueChange', type: 'string', description: '검색어 (제어·비제어).' },
      { name: 'onSubmit', type: '(value) => void', description: 'Enter로 검색.' },
      { name: 'onClose', type: '() => void', description: 'Esc 또는 빈 입력창의 × 로 닫기.' },
      { name: 'placeholder', type: 'string', defaultValue: "'검색'", description: '입력창 안내 문구.' },
      { name: 'topText', type: 'ReactNode', description: 'Figma ♦ 상단문구.' },
      { name: 'sections', type: 'GramSearchSection[]', description: '{ id, title, items, onSelect?, onRemove?, onClearAll?, clearAllLabel? }' },
      { name: 'autoFocus', type: 'boolean', defaultValue: 'true', description: '열릴 때 입력창 포커스.' },
    ],
  },

  /* ------------------------------------------------------------ GramTutorial */
  {
    id: 'gram-tutorial',
    name: 'GramTutorialTop · GramTutorialBottom',
    figma: 'gram_tutorial_Top + gram_tutorial_Bottom',
    description: '튜토리얼(코치마크) 화면의 위·아래 막대입니다. 위는 이전/나가기 아이콘 버튼, 아래는 다시 보지 않기 · 취소/다음 버튼 · 단계 표시입니다.',
    Preview: function TutorialPreview() {
      const [step, setStep] = useState(1);
      return (
        <Stage column>
          <div className="flex w-full flex-col gap-6 bg-neutral-20 p-4">
            <GramTutorialTop onPrev={() => setStep((s) => Math.max(1, s - 1))} onExit={noop} />
            <GramTutorialBottom current={step} onCancel={() => setStep(1)} onNext={() => setStep((s) => (s % 3) + 1)} />
          </div>
        </Stage>
      );
    },
    code: `<GramTutorialTop onPrev={prev} onExit={exit} />
<GramTutorialBottom steps={3} current={step} onCancel={exit} onNext={next} onDontShowAgainChange={setSkip} />`,
    props: [
      { name: 'Top.onPrev / onExit', type: '() => void', description: '♦ Left / ♦ Right — 주면 버튼 표시.' },
      { name: 'Top.prevLabel / exitLabel', type: 'string', description: '아이콘 버튼 이름(aria-label).' },
      { name: 'Bottom.steps / current', type: 'number', defaultValue: '3 / 1', description: '♦ step — 0이면 숨김. 현재 단계는 aria-current=step.' },
      { name: 'Bottom.dontShowAgain', type: 'boolean | string', defaultValue: 'true', description: '♦ chckbox. 상태는 dontShowAgain* props.' },
      { name: 'Bottom.onCancel / onNext', type: '() => void', description: '200×45 [secondary][primary] 버튼.' },
    ],
  },

  /* ---------------------------------------------------------- GramLinkAvatar */
  {
    id: 'gram-link-avatar',
    name: 'GramLinkAvatar',
    figma: '.그램링크_아바타 (4 variants)',
    description: 'gram Link 공유 대상 아바타(42px)입니다. 폴더 배지, 이미지 선택(제거 버튼), 이니셜 상태가 있습니다.',
    Preview: () => (
      <Stage>
        <GramLinkAvatar label="프로필" />
        <GramLinkAvatar variant="profileFolder" label="공유 폴더" />
        <GramLinkAvatar variant="profileImageSelected" onRemove={noop} label="선택한 이미지" />
        <GramLinkAvatar variant="profileInitial" initial="g" label="gram" />
      </Stage>
    ),
    code: `<GramLinkAvatar variant="profileFolder" label="공유 폴더" />
<GramLinkAvatar variant="profileImageSelected" src={thumb} onRemove={remove} label="선택한 이미지" />`,
    props: [
      { name: 'variant', type: "'profile' | 'profileFolder' | 'profileImageSelected' | 'profileInitial'", defaultValue: "'profile'", description: 'Figma Property 1.' },
      { name: 'src', type: 'string', description: 'profileImageSelected 이미지 (없으면 "Image" 문구).' },
      { name: 'initial', type: 'ReactNode', description: 'profileInitial 글자.' },
      { name: 'onRemove', type: '() => void', description: 'profileImageSelected의 제거(ⓧ) 버튼.' },
      { name: 'label', type: 'string', description: '스크린리더 이름.' },
      { name: 'size', type: 'number', defaultValue: '42', description: '지름(px).' },
    ],
  },
];
