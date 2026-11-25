import { useState, type ReactNode } from 'react';
import { IconButton, IconSettings, Switch } from '../../components';
import {
  AppCard,
  ArtworkDummy,
  Avatar,
  BasicCard01,
  BasicCard02,
  CardEmpty,
  DashboardCard,
  DashboardNotiCard,
  DashboardProgressCard,
  GalleryCardL,
  GalleryCardS,
  IconBadge,
  ItemList,
  ListComplexItem,
  ListDepthItem,
  ListSimpleItem,
  TagList,
  Thumbnail16x9,
  Thumbnail1x1,
  ThumbnailVariable,
} from '../../components/display';
import type { ComponentDoc } from '../ComponentDocs';

function Stage({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div className="flex flex-col gap-2">
      {label && <span className="font-mono text-[12px] text-neutral-70">{label}</span>}
      <div className="flex flex-wrap items-start gap-4">{children}</div>
    </div>
  );
}

const LOREM = '에너지 사용량이 지난주보다 12% 줄었습니다. 자세한 내역은 리포트에서 확인하세요.';
const SELECTED = { name: 'selected / defaultSelected / onSelectedChange', type: 'boolean · (v) => void', description: '선택 상태(Figma status=selected). 제어·비제어 모두 지원하며, 주면 카드 전체가 aria-pressed 버튼으로 동작합니다.' };

function ListDepthDemo() {
  const [open, setOpen] = useState(true);
  return (
    <ItemList className="w-[260px]">
      <ListDepthItem type="checkbox" depth={1} label="전체 매장" expanded={open} onExpandedChange={setOpen} defaultChecked />
      {open && (
        <>
          <ListDepthItem type="checkbox" depth={2} label="강남점" smallRightText="12" />
          <ListDepthItem type="checkbox" depth={3} label="1층 로비" arrow={false} />
        </>
      )}
      <ListDepthItem type="radio" depth={1} name="ld-radio" label="라디오 항목" defaultChecked />
      <ListDepthItem type="radio" depth={2} name="ld-radio" label="라디오 하위" />
      <ListDepthItem type="icon" depth={1} label="아이콘 항목" selected onClick={() => {}} buttonIcon />
      <ListDepthItem type="icon" depth={2} label="아이콘 하위" onClick={() => {}} />
      <ListDepthItem type="input" depth={3} label="placeholder" />
    </ItemList>
  );
}

function SelectableGallery() {
  const [value, setValue] = useState('a');
  return (
    <>
      {(['a', 'b', 'c'] as const).map((v) => (
        <GalleryCardS
          key={v}
          name="gallery-s"
          value={v}
          checked={value === v}
          onChange={() => setValue(v)}
          title={`템플릿 ${v.toUpperCase()}`}
          body="1920×1080 가로형"
          iconButton={v === 'c'}
        />
      ))}
    </>
  );
}

export const displayDocs: ComponentDoc[] = [
  {
    id: 'basic-card-01',
    name: 'BasicCard01',
    figma: 'basic card_01, 5 variants',
    description: '아이콘 또는 작은 썸네일과 제목·본문·태그·버튼을 담는 기본 카드입니다. 카드 안에 버튼이 있어 선택은 카드 전체를 덮는 버튼(aria-pressed)으로 처리합니다.',
    Preview: () => (
      <>
        <Stage label="type=icon · normal / selected">
          <BasicCard01 title="매장 디스플레이" subtitle="Lobby-01 · 55XS4J" body={LOREM} tags={['온라인', '4K', 'HDR']} toggle bottomText="3분 전 동기화" primaryAction={{ label: '편집' }} secondaryAction={{ label: '보기' }} />
          <BasicCard01 title="매장 디스플레이" subtitle="Lobby-01 · 55XS4J" body={LOREM} tags={['온라인', '4K', 'HDR']} toggle bottomText="3분 전 동기화" primaryAction={{ label: '편집' }} secondaryAction={{ label: '보기' }} defaultSelected />
        </Stage>
        <Stage label="type=thumbnail · type=none">
          <BasicCard01 type="thumbnail" title="봄 프로모션" subtitle="콘텐츠 · 00:30" body={LOREM} tags={['예약']} toggle bottomText="게시 대기" primaryAction={{ label: '게시' }} secondaryAction={{ label: '취소' }} />
          <BasicCard01 type="none" emptyLabel="등록된 기기가 없습니다" />
        </Stage>
      </>
    ),
    code: `<BasicCard01
  title="매장 디스플레이" subtitle="Lobby-01" body="…" tags={['온라인', '4K']}
  toggle onToggleClick={add}
  bottomText="3분 전 동기화"
  primaryAction={{ label: '편집', onClick: edit }}
  secondaryAction={{ label: '보기' }}
  selected={selected} onSelectedChange={setSelected}
/>`,
    props: [
      { name: 'type', type: "'icon' | 'thumbnail' | 'none'", defaultValue: "'icon'", description: "Figma type(icon | thumbnail | -). none은 element/card_none을 그립니다." },
      { name: 'title / subtitle', type: 'ReactNode', description: '제목 12px Medium, 부제 10px Regular.' },
      { name: 'body', type: 'ReactNode', description: '♦ body text — 2줄까지.' },
      { name: 'tags', type: 'ReactNode[]', description: '♦ tag — element/tags.' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'true', description: 'type=icon 제목 앞 아이콘(ic_info).' },
      { name: 'thumbnailSrc', type: 'string', description: 'type=thumbnail 썸네일(64×40) 이미지.' },
      { name: 'toggle', type: 'boolean | ReactNode', description: '♦ button/toggle — 오른쪽 button_icon(ic_add). onToggleClick, toggleLabel과 함께.' },
      { name: 'primaryAction / secondaryAction', type: '{ label, onClick?, disabled? }', description: '♦ button_01(primary) / ♦ button_02(secondary), h26.' },
      { name: 'bottomText / bottomIcon', type: 'ReactNode / IconProp', description: '♦ bottom text + botton_icon.' },
      SELECTED,
      { name: 'children', type: 'ReactNode', description: 'top SLOT — 본문 아래 추가 내용.' },
    ],
  },
  {
    id: 'basic-card-02',
    name: 'BasicCard02',
    figma: 'basic card_02, 4 variants',
    description: '위쪽 큰 이미지(text) 또는 본문 썸네일 2장(thumbnail)을 쓰는 카드입니다. 아래 버튼 영역은 divider로 나뉩니다.',
    Preview: () => (
      <>
        <Stage label="type=text · normal / selected">
          <BasicCard02 title="로비 사이니지" subtitle="1920×1080" body={LOREM} tags={['가로형']} toggle bottomText="재생 중" primaryAction={{ label: '편집' }} secondaryAction={{ label: '보기' }} />
          <BasicCard02 title="로비 사이니지" subtitle="1920×1080" body={LOREM} tags={['가로형']} toggle bottomText="재생 중" primaryAction={{ label: '편집' }} secondaryAction={{ label: '보기' }} defaultSelected />
        </Stage>
        <Stage label="type=thumbnail · type=none">
          <BasicCard02 type="thumbnail" title="비교 보기" subtitle="A/B 레이아웃" primaryAction={{ label: '이전' }} secondaryAction={{ label: '다음' }} />
          <BasicCard02 type="none" emptyLabel="콘텐츠가 없습니다" />
        </Stage>
      </>
    ),
    code: `<BasicCard02 title="로비 사이니지" image="/img/lobby.jpg" body="…" primaryAction={{ label: '편집' }} />
<BasicCard02 type="thumbnail" title="비교 보기" images={[a, b]} primaryAction={{ label: '이전' }} secondaryAction={{ label: '다음' }} />`,
    props: [
      { name: 'type', type: "'text' | 'thumbnail' | 'none'", defaultValue: "'text'", description: 'Figma type.' },
      { name: 'image', type: 'boolean | string', defaultValue: 'true', description: '♦ image — type=text 상단 이미지(294×126). 문자열이면 이미지 주소, false면 숨김.' },
      { name: 'images', type: '(string | undefined)[]', description: 'type=thumbnail 본문 썸네일 목록(133×90).' },
      { name: '나머지', type: '—', description: 'title, subtitle, body, tags, toggle, primaryAction, secondaryAction, bottomText, selected… BasicCard01과 같습니다.' },
    ],
  },
  {
    id: 'gallery-card-l',
    name: 'GalleryCardL',
    figma: 'gallery card_L, 4 variants',
    description: '큰 이미지와 가운데 정렬 제목·설명을 갖는 갤러리 카드입니다. 버튼 배치에 따라 4가지 type이 있습니다.',
    Preview: () => (
      <Stage label="normal · buttonVer · buttonHor · buttonMix">
        <GalleryCardL title="Smart Signage" description={LOREM} badge="NEW" checkbox />
        <GalleryCardL type="buttonVer" title="Smart Signage" description={LOREM} badge="NEW" actions={[{ label: '설치' }, { label: '자세히' }]} />
        <GalleryCardL type="buttonHor" title="Smart Signage" description={LOREM} badge="NEW" actions={[{ label: '설치' }, { label: '자세히' }]} />
        <GalleryCardL type="buttonMix" title="Smart Signage" description={LOREM} badge="NEW" actions={[{ label: '설치' }, { label: '공유' }, { label: '자세히' }]} />
      </Stage>
    ),
    code: `<GalleryCardL type="buttonVer" image={src} title="Smart Signage" description="…" badge="NEW"
  actions={[{ label: '설치', onClick: install }, { label: '자세히' }]} />`,
    props: [
      { name: 'type', type: "'normal' | 'buttonVer' | 'buttonHor' | 'buttonMix'", defaultValue: "'normal'", description: 'Figma normal | button_ver | Button-hor | Button-mix.' },
      { name: 'image / imageAlt', type: 'string', description: '이미지. 없으면 자리표시(normal은 X, 나머지는 IMG 그림).' },
      { name: 'title / description', type: 'ReactNode', description: '15px Bold / 12px Medium, 가운데 정렬.' },
      { name: 'badge', type: 'ReactNode', description: '우상단 tag_text(medium).' },
      { name: 'actions', type: 'CardAction[]', description: 'secondary h26 + 오른쪽 ic_add. buttonMix는 3개.' },
      { name: 'checkbox / checked / defaultChecked / onCheckedChange', type: 'boolean', description: 'radio/check — 좌상단 체크박스.' },
    ],
  },
  {
    id: 'gallery-card-s',
    name: 'GalleryCardS',
    figma: 'gallery card_S, 3 variants',
    description: '작은 선택형 타일입니다. 카드 전체가 라디오/체크박스 label이라 어디를 눌러도 선택되고, 마우스를 올리면 바탕과 밑줄(over), 누르면 바탕(pressed)이 바뀝니다.',
    Preview: () => (
      <>
        <Stage label="control=radio (name 공유)">
          <SelectableGallery />
        </Stage>
        <Stage label="control=checkbox · none · disabled">
          <GalleryCardS control="checkbox" title="체크 타일" body="복수 선택" defaultChecked />
          <GalleryCardS control="none" title="클릭 타일" body="onCardClick" onCardClick={() => {}} />
          <GalleryCardS title="비활성" body="disabled" disabled />
        </Stage>
      </>
    ),
    code: `<GalleryCardS name="tpl" value="a" checked={v === 'a'} onChange={() => setV('a')} title="템플릿 A" body="가로형" />
<GalleryCardS control="checkbox" title="체크 타일" defaultChecked />`,
    props: [
      { name: 'control', type: "'radio' | 'checkbox' | 'none'", defaultValue: "'radio'", description: '♦ check/radio + swap. 나머지 input 속성(name, value, checked, onChange…)은 내부 input으로 전달됩니다.' },
      { name: 'artwork', type: 'ReactNode', defaultValue: '<ArtworkDummy />', description: 'artwork_icon(swap) 42px.' },
      { name: 'title / body', type: 'ReactNode', description: '♦ text(10px Bold) / ♦ body text(10px Regular).' },
      { name: 'iconButton', type: 'boolean | ReactNode', description: '♦ icon button — 우상단 21px 버튼. iconButtonLabel, onIconButtonClick.' },
      { name: 'onCardClick', type: '() => void', description: "control='none'일 때 카드 클릭." },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: '비활성화(투명도 40%).' },
    ],
  },
  {
    id: 'dashboard-card',
    name: 'DashboardCard',
    figma: 'dashboard card, 4 variants',
    description: '대시보드의 핵심 수치를 보여 줍니다. onClick/href를 주면 버튼·링크가 되고 누르는 동안 바탕이 neutral-20(pressed)으로 바뀝니다.',
    Preview: () => (
      <Stage label="size=Large · small · progress">
        <DashboardCard label="온라인 기기" value="42" supportingText="/ 100" badge="NEW" onClick={() => {}} />
        <DashboardCard size="small" label="오프라인" value="8" supportingText="/ 100" badge="!" onClick={() => {}} />
        <DashboardCard label="저장 공간" value="64" supportingText="%" progress={64} />
      </Stage>
    ),
    code: `<DashboardCard label="온라인 기기" value="42" supportingText="/ 100" badge="NEW" onClick={open} />
<DashboardCard size="small" label="저장 공간" value="64" supportingText="%" progress={64} />`,
    props: [
      { name: 'size', type: "'Large' | 'small'", defaultValue: "'Large'", description: '아이콘·제목을 세로(Large) 또는 한 줄(small)로.' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'true', description: 'icon(swap) 16px, 기본 ic_info.' },
      { name: 'label / value / supportingText', type: 'ReactNode', description: '♦ text / num(24px Bold) / ♦ supporting text.' },
      { name: 'progress', type: 'number', description: '♦ progress — 0~100 진행 막대.' },
      { name: 'badge', type: 'ReactNode', description: '♦ badge — 우상단 tag_text(small).' },
      { name: 'onClick / href', type: '() => void / string', description: '주면 button / a로 렌더링(포커스 링, :active=pressed).' },
    ],
  },
  {
    id: 'dashboard-progress-card',
    name: 'DashboardProgressCard',
    figma: 'dashboard card_L_Progress, 2 variants',
    description: '썸네일과 함께 진행률을 보여 주는 큰 대시보드 카드입니다.',
    Preview: () => (
      <Stage label="normal · progress 50 / 75">
        <DashboardProgressCard label="콘텐츠 배포" value="50" supportingText="/ 100" progress={50} badge="LIVE" onClick={() => {}} />
        <DashboardProgressCard label="펌웨어 업데이트" value="75" supportingText="/ 100" progress={75} badge="LIVE" />
      </Stage>
    ),
    code: `<DashboardProgressCard label="콘텐츠 배포" value="50" supportingText="/ 100" progress={50} badge="LIVE" onClick={open} />`,
    props: [
      { name: 'label / value / supportingText', type: 'ReactNode', description: '제목 15px Medium / 숫자 28px Bold / 보조 15px Medium neutral-40.' },
      { name: 'progress', type: 'number', description: '♦ progress — 0~100.' },
      { name: 'badge', type: 'ReactNode', description: '♦ badge — tag_text(medium).' },
      { name: 'thumbnailSrc', type: 'string', description: 'thumbnail_1:1(40×40) 이미지.' },
      { name: 'onClick / href', type: '() => void / string', description: 'pressed 상태는 :active.' },
    ],
  },
  {
    id: 'dashboard-noti-card',
    name: 'DashboardNotiCard',
    figma: 'dashboard card_Noti, 4 variants',
    description: '알림 한 건을 보여 주는 카드입니다. 읽지 않은 알림은 왼쪽 빨간 점(alertBadge)으로 표시합니다.',
    Preview: () => (
      <>
        <Stage label="type=left · default / selected">
          <DashboardNotiCard alertBadge title="펌웨어 업데이트" subtitle="Lobby-01" description={LOREM} date="2026/11/25 10:20:00" actionLabel="Confirmed" moreLabel="3 More" />
          <DashboardNotiCard alertBadge title="펌웨어 업데이트" subtitle="Lobby-01" description={LOREM} date="2026/11/25 10:20:00" actionLabel="Confirmed" moreLabel="3 More" defaultSelected />
        </Stage>
        <Stage label="type=center">
          <DashboardNotiCard type="center" alertBadge title="점검 예정" subtitle="전 매장" description={LOREM} date="2026/11/26 09:00:00" actionLabel="Confirmed" moreLabel="NN More" />
        </Stage>
      </>
    ),
    code: `<DashboardNotiCard alertBadge title="펌웨어 업데이트" subtitle="Lobby-01" description="…"
  date="2026/11/25 10:20:00" actionLabel="Confirmed" onAction={confirm}
  moreLabel="3 More" onMore={expand} />`,
    props: [
      { name: 'type', type: "'left' | 'center'", defaultValue: "'left'", description: '정렬.' },
      SELECTED,
      { name: 'alertBadge', type: 'boolean', defaultValue: 'false', description: 'alert badge — 6px 빨간 점.' },
      { name: 'thumbnail', type: 'boolean | string', defaultValue: 'true', description: '36px 썸네일. 문자열이면 이미지.' },
      { name: 'title / subtitle / description', type: 'ReactNode', description: '제목 12px Medium / 부제·본문 10px Regular.' },
      { name: 'date / actionLabel / onAction', type: 'ReactNode / () => void', description: 'date — 메타 줄과 오른쪽 h20 버튼.' },
      { name: 'moreLabel / onMore', type: 'ReactNode / () => void', description: 'more — 하단 전체폭 텍스트 버튼.' },
    ],
  },
  {
    id: 'app-card',
    name: 'AppCard',
    figma: 'app card_cc, 8 variants',
    description: '앱(서비스) 요약 카드입니다. 범례 목록(items) 또는 문장(text)을 담고, 선택 가능하게 하면 aria-pressed 버튼이 됩니다.',
    Preview: () => {
      const items = [
        { label: 'Online', value: '12' },
        { label: 'Offline', value: '03' },
        { label: 'Warning', value: '01' },
      ];
      return (
        <>
          <Stage label="layout=100% · normal / selected / text">
            <AppCard title="LG Connected Care" items={items} defaultSelected={false} />
            <AppCard title="LG Connected Care" items={items} defaultSelected />
            <AppCard title="LG Connected Care" text="원격으로 기기 상태를 점검하고 장애를 미리 알려 줍니다." />
          </Stage>
          <Stage label="layout=400%">
            <AppCard layout="400%" title="LG Connected Care" items={items} />
            <AppCard layout="400%" title="LG Connected Care" items={items} selected />
            <AppCard layout="400%" title="LG Connected Care" text="원격 점검 서비스" selected />
          </Stage>
        </>
      );
    },
    code: `<AppCard title="LG Connected Care" items={[{ label: 'Online', value: '12' }]} selected={sel} onSelectedChange={setSel} />
<AppCard layout="400%" title="LG Connected Care" text="원격 점검 서비스" />`,
    props: [
      { name: 'title', type: 'ReactNode', description: '제목 15px Bold.' },
      { name: 'layout', type: "'100%' | '400%'", defaultValue: "'100%'", description: '240 폭 / 172 폭.' },
      { name: 'items', type: '{ label, value?, unit? }[]', description: 'status=normal/selected의 범례 목록. 없으면 text(_text 상태).' },
      { name: 'text', type: 'ReactNode', description: '_text 상태 본문(12px Medium, 가운데).' },
      { name: 'subText', type: 'boolean', defaultValue: 'false', description: 'sub text — 항목 unit 표시.' },
      SELECTED,
      { name: 'onClick', type: '() => void', description: '카드 클릭.' },
    ],
  },
  {
    id: 'card-empty',
    name: 'CardEmpty',
    figma: 'element/card_none, 2 variants',
    description: '카드 자리에 내용이 없을 때 보여 줍니다. basic card의 type=none도 이 컴포넌트를 씁니다.',
    Preview: () => (
      <Stage label="type=01 · 02">
        <CardEmpty label="등록된 기기가 없습니다" />
        <CardEmpty type="02" />
      </Stage>
    ),
    code: `<CardEmpty label="등록된 기기가 없습니다" />
<CardEmpty type="02" label="There is no item" />`,
    props: [
      { name: 'type', type: "'01' | '02'", defaultValue: "'01'", description: '01: 흰 바탕 + 아이콘 / 02: 회색 바탕 + 큰 글자.' },
      { name: 'label', type: 'ReactNode', description: '안내 문구.' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'true', description: 'type=01 아이콘(ic_info 32px).' },
    ],
  },
  {
    id: 'thumbnail-16-9',
    name: 'Thumbnail16x9',
    figma: 'thumbnail_16:9, 8 variants',
    description: '가로/세로형 썸네일입니다. 이미지가 없으면 자리표시를 그리고, 동영상은 재생 버튼과 재생 시간을 얹습니다. 너비만 바꾸면 높이는 비율을 따라갑니다.',
    Preview: () => (
      <>
        <Stage label="landscape — image · video · icon · none">
          <Thumbnail16x9 multi />
          <Thumbnail16x9 type="video" duration="03:24" onPlay={() => {}} />
          <Thumbnail16x9 type="icon" />
          <Thumbnail16x9 type="none" actions={[{ label: '전체 화면' }]} />
        </Stage>
        <Stage label="portrait">
          <Thumbnail16x9 orientation="portrait" />
          <Thumbnail16x9 orientation="portrait" type="video" duration="00:15" />
          <Thumbnail16x9 orientation="portrait" type="icon" img={false} text="No content" />
          <Thumbnail16x9 orientation="portrait" type="none" />
        </Stage>
      </>
    ),
    code: `<Thumbnail16x9 src={src} alt="로비" multi />
<Thumbnail16x9 type="video" src={poster} duration="03:24" onPlay={play} />
<Thumbnail16x9 type="none" className="w-16" />`,
    props: [
      { name: 'type', type: "'image' | 'video' | 'icon' | 'none'", defaultValue: "'image'", description: 'Figma type.' },
      { name: 'orientation', type: "'landscape' | 'portrait'", defaultValue: "'landscape'", description: '147×90 / 147×242 비율.' },
      { name: 'src / alt', type: 'string', description: '이미지(image·video).' },
      { name: 'img / text', type: 'IconProp / ReactNode', description: '♦ img · ♦ text — icon/none 가운데 내용.' },
      { name: 'duration', type: 'ReactNode', description: '♦ duration — video 재생 시간.' },
      { name: 'actions', type: '{ label, icon?, onClick? }[]', description: '♦ action — 우하단 20px 아이콘 버튼(기본 ic_fullscreen).' },
      { name: 'multi / multi2', type: 'IconProp', description: '우상단 아이콘(기본 ic_multi).' },
      { name: 'onPlay / playLabel', type: '() => void / string', description: 'video 재생 버튼.' },
    ],
  },
  {
    id: 'thumbnail-1-1',
    name: 'Thumbnail1x1 · ThumbnailVariable · ArtworkDummy',
    figma: 'thumbnail_1:1 (2), thumbnail_variable (2), ic_artwork_dummy',
    description: '정사각 썸네일과 크기를 자유롭게 주는 썸네일, 이미지 없음 그림입니다. 크기는 className으로 바꿉니다.',
    Preview: () => (
      <>
        <Stage label="thumbnail_1:1 — default · none · 40px">
          <Thumbnail1x1 />
          <Thumbnail1x1 type="none" />
          <Thumbnail1x1 type="none" className="size-10" />
        </Stage>
        <Stage label="thumbnail_variable — default · none · actions">
          <ThumbnailVariable />
          <ThumbnailVariable type="none" />
          <ThumbnailVariable actions={[{ label: '전체 화면' }, { label: '설정', icon: <IconSettings /> }]} multi />
        </Stage>
        <Stage label="ic_artwork_dummy">
          <ArtworkDummy />
          <ArtworkDummy className="size-6" />
        </Stage>
      </>
    ),
    code: `<Thumbnail1x1 src={src} className="size-10" />
<ThumbnailVariable type="none" className="h-[90px] w-full" />
<ArtworkDummy className="size-6" />`,
    props: [
      { name: 'type (1:1)', type: "'default' | 'none'", defaultValue: "'default'", description: '이미지 / IMG 그림.' },
      { name: 'type (variable)', type: "'default' | 'none'", defaultValue: "'default'", description: 'none은 neutral-20 + 43px 그림 또는 text.' },
      { name: 'img / text / actions / multi / multi2', type: '—', description: 'thumbnail_variable 전용(♦ img, ♦ text, actions, multi, multi 2).' },
      { name: 'src / alt', type: 'string', description: '이미지.' },
    ],
  },
  {
    id: 'avatar',
    name: 'Avatar',
    figma: 'avarta, 8 variants',
    description: '사용자를 아이콘·이니셜·사진으로 표시합니다. 편집(우하단)·삭제(우상단) 버튼을 붙일 수 있습니다(small 제외).',
    Preview: () => (
      <>
        <Stage label="type=icon — x-large · large · medium · small">
          <Avatar name="홍길동" />
          <Avatar size="large" name="홍길동" />
          <Avatar size="medium" name="홍길동" />
          <Avatar size="small" name="홍길동" />
        </Stage>
        <Stage label="type=text · edit/close icon">
          <Avatar type="text" initials="AC" />
          <Avatar type="text" size="large" initials="AC" />
          <Avatar type="text" size="medium" initials="AC" />
          <Avatar type="text" size="small" initials="AC" />
          <Avatar editIcon closeIcon name="편집 가능" />
          <Avatar size="large" type="text" initials="KM" editIcon closeIcon />
        </Stage>
      </>
    ),
    code: `<Avatar name="홍길동" />
<Avatar type="text" size="large" initials="AC" />
<Avatar src={photo} name="홍길동" editIcon onEdit={edit} closeIcon onClose={remove} />`,
    props: [
      { name: 'type', type: "'icon' | 'text'", defaultValue: "'icon'", description: 'ic_profile 또는 이니셜.' },
      { name: 'size', type: "'x-large' | 'large' | 'medium' | 'small'", defaultValue: "'x-large'", description: '64 · 42 · 32 · 20px.' },
      { name: 'src / name', type: 'string', description: '사진(실패하면 type으로 대체)과 이름(alt·접근성).' },
      { name: 'initials', type: 'ReactNode', description: 'type=text 글자. 생략하면 name 앞 두 글자.' },
      { name: 'icon', type: 'ReactNode', description: '인스턴스(swap) — 아이콘 교체.' },
      { name: 'editIcon / onEdit', type: 'IconProp / () => void', description: '♦ edit icon — 우하단 버튼(ic_add).' },
      { name: 'closeIcon / onClose', type: 'IconProp / () => void', description: '♦ close icon — 우상단 버튼(ic_close).' },
    ],
  },
  {
    id: 'list-depth',
    name: 'ListDepthItem',
    figma: 'list_depth, 24 variants',
    description: '트리형 목록 항목입니다. depth별 들여쓰기와 펼침 화살표, 체크박스·라디오·아이콘·입력 type을 지원합니다. ItemList(ul) 안에 넣어 씁니다.',
    Preview: () => (
      <Stage label="checkbox · radio · icon · input (화살표를 눌러 접기)">
        <ListDepthDemo />
      </Stage>
    ),
    code: `<ItemList>
  <ListDepthItem type="checkbox" depth={1} label="전체 매장" expanded={open} onExpandedChange={setOpen} />
  <ListDepthItem type="checkbox" depth={2} label="강남점" smallRightText="12" />
  <ListDepthItem type="icon" depth={2} label="설정" selected onClick={go} />
  <ListDepthItem type="input" depth={3} label="placeholder" inputProps={{ value, onChange }} />
</ItemList>`,
    props: [
      { name: 'type', type: "'checkbox' | 'icon' | 'input' | 'radio'", defaultValue: "'checkbox'", description: 'Figma type.' },
      { name: 'depth', type: '1 | 2 | 3', defaultValue: '1', description: '1 depth | 2 depth | 3 depth (왼쪽 4 · 26 · 36px).' },
      { name: 'label', type: 'ReactNode', description: '항목 텍스트. input이면 placeholder.' },
      { name: 'selected', type: 'boolean', description: 'state=selected(neutral-20). 생략하면 checkbox/radio는 체크 여부를 따릅니다.' },
      { name: 'checked / defaultChecked / onChange / name / value', type: '—', description: 'checkbox·radio 입력 속성.' },
      { name: 'arrow / expanded / onExpandedChange', type: 'IconProp / boolean', description: '♦ arrow — 펼침 버튼(aria-expanded). 접히면 -90° 회전.' },
      { name: 'icon', type: 'boolean | ReactNode', defaultValue: 'true', description: '♦ icon — icon/input type 앞 아이콘.' },
      { name: 'smallRightText', type: 'ReactNode', description: 'small right text.' },
      { name: 'buttonIcon / onButtonClick', type: 'IconProp', description: '♦ button_icon — 오른쪽 h16 버튼.' },
      { name: 'divider', type: 'boolean', defaultValue: 'true', description: '아래 구분선.' },
      { name: 'onClick', type: '() => void', description: 'type=icon 항목 클릭.' },
    ],
  },
  {
    id: 'list-complex',
    name: 'ListComplexItem',
    figma: 'list_complex, 6 variants',
    description: '체크박스·아이콘·썸네일·보조 텍스트·오른쪽 동작을 한 줄에 담는 목록 항목입니다. onClick을 주면 행 전체가 버튼이 되고 키보드 포커스 시 반전(focus) 상태가 됩니다.',
    Preview: () => (
      <ItemList className="w-[362px]">
        <ListComplexItem control="checkbox" iconLeft thumbnail title="Lobby-01 메인 화면" supportingText="55XS4J · 온라인" textRight="10:20" action onClick={() => {}} />
        <ListComplexItem control="checkbox" iconLeft thumbnail title="Lobby-02 보조 화면" supportingText="55XS4J · 온라인" textRight="10:21" action selected onClick={() => {}} />
        <ListComplexItem control="checkbox" iconLeft thumbnail title="Lobby-03" supportingText="오프라인" textRight="—" action disabled />
        <ListComplexItem title="오른쪽 슬롯" supportingText="right에 원하는 요소" right={<IconButton variant="onlyicon" height="h24" label="설정" icon={<IconSettings />} />} />
      </ItemList>
    ),
    code: `<ListComplexItem control="checkbox" iconLeft thumbnail={src}
  title="Lobby-01" supportingText="온라인" textRight="10:20"
  action onActionClick={add} onArrowClick={open}
  selected={sel} onClick={select} />`,
    props: [
      { name: 'title / supportingText', type: 'ReactNode', description: '12px Medium / 10px Regular(♦ supporting text).' },
      { name: 'supportingIcon', type: 'IconProp', defaultValue: 'true', description: '♦ supporting icon — 12px ic_info.' },
      { name: 'control', type: "'checkbox' | 'radio' | 'none'", defaultValue: "'none'", description: '♦ check/radio. checked/defaultChecked/onChange/name/value 전달.' },
      { name: 'iconLeft', type: 'IconProp', description: '♦ icon-left — 20px(기본 ic_null2).' },
      { name: 'thumbnail', type: 'boolean | string', description: '♦ thumbnail — 66×40 썸네일.' },
      { name: 'textRight / right', type: 'ReactNode', description: '♦ text-right / right SLOT.' },
      { name: 'action / onActionClick / onArrowClick', type: 'boolean', description: '♦ action — 기본 버튼 2개(ic_add, ic_arrow_right).' },
      { name: 'selected', type: 'boolean', defaultValue: 'false', description: 'selected(neutral-20, 포커스와 함께 neutral-100).' },
      { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'disabled — 투명도 50%(Figma 값).' },
      { name: 'divider', type: 'boolean', defaultValue: 'true', description: '♦ divider.' },
      { name: 'onClick', type: '() => void', description: '행 클릭(focus 상태 지원).' },
    ],
  },
  {
    id: 'list-simple',
    name: 'ListSimpleItem',
    figma: 'list_simple, 2 variants',
    description: '설정 화면처럼 제목·설명과 오른쪽 컨트롤(기본 Switch)만 있는 단순 목록 항목입니다.',
    Preview: () => (
      <ItemList className="w-[361px] gap-3">
        <ListSimpleItem title="자동 업데이트" description="새 펌웨어를 자동으로 설치합니다" right={<Switch defaultChecked aria-label="자동 업데이트" />} divider />
        <ListSimpleItem title="알림 설정" description="알림 종류와 시간대" rightIcon leftIcon onClick={() => {}} divider />
        <ListSimpleItem title="선택된 항목" description="state=selected" titleIcon selected />
      </ItemList>
    ),
    code: `<ListSimpleItem title="자동 업데이트" description="새 펌웨어를 자동으로 설치합니다"
  right={<Switch checked={on} onChange={setOn} aria-label="자동 업데이트" />} divider />
<ListSimpleItem title="알림 설정" rightIcon onClick={open} />`,
    props: [
      { name: 'title / description', type: 'ReactNode', description: 'title text(15px Medium) / des text(12px Medium neutral-40).' },
      { name: 'leftIcon / titleIcon / rightIcon', type: 'IconProp', description: 'left icon · title icon · right icon(24px).' },
      { name: 'right', type: 'ReactNode', description: 'right instance — 오른쪽 요소(예: Switch).' },
      { name: 'divider', type: 'boolean', defaultValue: 'false', description: 'divider.' },
      { name: 'selected', type: 'boolean', defaultValue: 'false', description: 'state=selected.' },
      { name: 'onClick', type: '() => void', description: '행 클릭(행 전체 버튼).' },
    ],
  },
  {
    id: 'icon-badge',
    name: 'IconBadge',
    figma: 'icon_badge, 4 variants',
    description: '아이콘 우상단에 알림 배지를 붙입니다. onClick을 주면 버튼이 됩니다. (Navigation의 HeaderIconButton보다 Figma에 충실한 버전)',
    Preview: () => (
      <>
        <Stage label="color=black — large · small">
          <IconBadge label="알림 있음" />
          <IconBadge label="알림 있음" count={3} />
          <IconBadge label="알림 있음" type="small" />
          <IconBadge label="알림" badge={false} onClick={() => {}} />
        </Stage>
        <div className="flex gap-4 bg-neutral-100 p-3">
          <IconBadge label="알림 있음" color="white" onClick={() => {}} />
          <IconBadge label="알림 있음" color="white" type="small" />
        </div>
      </>
    ),
    code: `<IconBadge label="알림 3건" count={3} onClick={openNoti} />
<IconBadge label="알림" type="small" color="white" />`,
    props: [
      { name: 'label', type: 'string', description: '접근성 이름(필수).' },
      { name: 'type', type: "'large' | 'small'", defaultValue: "'large'", description: '24px / 16px.' },
      { name: 'color', type: "'black' | 'white'", defaultValue: "'black'", description: '아이콘 색.' },
      { name: 'icon', type: 'ReactNode', defaultValue: '<IconNotification />', description: 'icon(swap).' },
      { name: 'badge', type: 'boolean', defaultValue: 'true', description: 'badge 표시.' },
      { name: 'count', type: 'number | string', description: 'large 배지 안 숫자.' },
      { name: 'onClick', type: '() => void', description: '주면 button으로 렌더링.' },
    ],
  },
  {
    id: 'tag-list',
    name: 'TagList',
    figma: 'element/tags',
    description: '작은 태그(tag_text small)를 gap 4px로 나열합니다.',
    Preview: () => (
      <Stage>
        <TagList tags={['온라인', '4K', 'HDR']} />
        <TagList tags={['점검', '긴급']} status="error" />
      </Stage>
    ),
    code: `<TagList tags={['온라인', '4K', 'HDR']} />`,
    props: [
      { name: 'tags', type: 'ReactNode[]', description: '태그 텍스트 목록.' },
      { name: 'max', type: 'number', defaultValue: '8', description: '최대 표시 개수(Figma 슬롯 8개).' },
      { name: 'status / size', type: "TagProps['status'] / TagProps['size']", defaultValue: "'primary' / 'small'", description: 'Tag와 같습니다.' },
    ],
  },
];
