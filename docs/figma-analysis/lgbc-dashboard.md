# LGBC 3.0 Dashboard 화면설계서 분석 (읽기 전용)

- 파일: `[LGBC] Dashboard_v1.0.10_261117` (fileKey `hmT8kDtUNDj7htPpitwccq`)
- 문서 버전: History 기준 0.7(26.03.05) → 1.0.0(26.07.28 시나리오 배포) → … → 1.0.10(26.11.17), 최신 항목 1.1.0 "위젯 표시 불가 상태" (New 태그)
- 작성: MS(연) webOS UX디자인팀 (Overview 페이지 명시). 표지 날짜 2026-11-17
- 분석 방법: Plugin API 읽기 전용 스크립트(인스턴스, 레이아웃, 변수 바인딩), 대표 프레임 스크린샷 14장. Figma 파일은 수정하지 않았다.

---

## A. 인벤토리

### 페이지

| 페이지 | id | 성격 | 내용 |
|---|---|---|---|
| Cover | 0:1 | 표지 | `Cover` 1920×960 프레임 1개, `Note` 섹션 |
| **Scenario** | 4030:217012 | **실제 스펙 문서(슬라이드)** | 최상위 노드 39개(그중 FRAME 33개), 인스턴스 4,372개 |
| 대표화면 | 31341:29127 | **작업 원본/컴포넌트 보관소** | 최상위 노드 62개, 인스턴스 8,419개. 1280폭 화면 COMPONENT, `widgets` 섹션(위젯 마스터 62개), `구 대시보드`/`구어드민`/`feature`/`커스텀 기능 제안` 등 레거시 |

### Scenario 페이지 프레임 분류 (1920폭 "슬라이드" 33장)

| 분류 | 프레임(name) | 개수 |
|---|---|---|
| 표지/개요/목차 | Cover, Overview, Index | 3 |
| 간지(Doc_Text만 있음) | PolicyWidget, DashboardStyle | 2 |
| History(변경이력 표) | 02, 36, 38, 47 | 4 |
| 공통: 헤더 | 03 | 1 |
| 대시보드 템플릿 화면 | 37 All Widgets, 30 Device Monitoring, 31 Content Management, 32 Schedule Management, 33 Device Installation, 04 All Workspaces, 09 템플릿 선택 팝업, 48 위젯 표시 불가 상태 | 8 |
| 디바이스 위젯 스펙 | 15 커넥션 스테이터스, 39 이슈트렌드, 40 이슈 액티비티, 17 디바이스 인스톨레이션 | 4 |
| 콘텐츠 위젯 스펙 | 18 애드온, 41 워크스페이스 오버뷰, 42 퍼블리시 히스토리, 19 최근 콘텐츠 액티비티, 43 유저 액티비티, 20 워크스페이스 스토리지, 44 퍼블리시 애널리틱스 | 7 |
| 기타 위젯 스펙 | 28 퀵버튼, 45 라이선스 오버뷰, 46 네트워크 스테이터스 | 3 |
| (페이지 직속 인스턴스) | Console_footer_SignIn 1683×74, Overlay 550×371, annotation dot 6개 | – |

**실제 화면/스펙 슬라이드는 22장**(헤더 1 + 템플릿 8 + 위젯 14). 표지, 개요, 간지, History는 9장이다.

Index 페이지 기준 공식 구성:
- 1. 정책 및 위젯 (14): 디바이스 위젯 4(1-1 커넥션 스테이터스, 1-2 이슈 트렌드, 1-3 이슈 액티비티, 1-4 디바이스 인스톨레이션), 콘텐츠 위젯 7(2-1 애드온, ~~2-2 콘텐츠 오버뷰~~(삭제, 취소선), 2-3 워크스페이스 오버뷰(All Workspaces 전용), 2-4 퍼블리시 히스토리, 2-5 최근 콘텐츠 액티비티, 2-6 유저 액티비티, 2-7 워크스페이스 스토리지, 2-8 콘텐츠 퍼블리시 애널리틱스), 기타 ETC 위젯 3(3-1 퀵버튼, 3-2 라이선스 오버뷰, 3-3 네트워크 스테이터스)
- 2. 대시보드 템플릿 (6): All Widgets, Device Monitoring, Content Management, Schedule Management, Device Installation, All Workspaces
- 주의: 레이어 이름 번호와 Index 번호가 다르다. 예를 들어 레이어 `1-6 디바이스등록 제안`은 Index 1-4, `2-8 라이브스토리지`는 2-7, `2-9 콘텐츠 퍼블리시 애널리틱스`는 2-8, `4-1 퀵버튼`/`4-2 라이선스 현황`/`4-3 네트워크스테이터스`는 3-1/3-2/3-3이다.

### 슬라이드 레이아웃 (스펙 문서 형식)

```
1920 x 1080 (내용이 길면 높이 연장: 1289~4117)
┌──────────────────────────────────────────────────────────────────────┐
│ Doc Title (1920x121)  "LGBC 3.0 Dashboard" / "<카테고리> > <제목>"     │  ← Doc Title Depth=depth2(22) / depth1(7)
├──────────────────────────────────────────────────────────────────────┤
│ x≈36~60, y≈139                                  x≈1342~1414, y≈139    │
│ ┌──────────── 화면/위젯 (1280 폭) ──────────┐   ┌─ table (441~552 폭) ┐│
│ │ ①  annotation dot(24x24, 빨강 번호)       │   │ description         ││
│ │                                           │   │ No | 설명 (bullet)  ││
│ └───────────────────────────────────────────┘   └─────────────────────┘│
│ 아래쪽: ② Data 없음 ③ 라이선스 없음 변형, "• 400% 대응 시" 400폭 3종     │
└──────────────────────────────────────────────────────────────────────┘
우상단에는 변경 태그 `Tag` Type=Modified(파랑) 또는 New(빨강)를 400x78 크기로 두고 버전과 변경 요약을 적는다.
```

### 화면 크기와 브레이크포인트
- **실제 제품 화면 폭은 1280px**(데스크톱 웹 고정 폭). 대표화면의 모든 화면 컴포넌트가 1280 폭이고 높이는 내용에 따라 다르다(720 기본, All Widgets는 3948).
- **반응형 브레이크포인트는 따로 정의하지 않았다.** 대신 위젯마다 **"400% 대응 시"(접근성 확대 400%) 레이아웃을 400px 폭으로 정의**했다(v1.0.5에서 "접근성 대응을 위해 400% 상태의 위젯 형태 정의"). 400폭에서는 가로 서브카드가 세로로 쌓이고, 표는 pivot(행/열 전환, v1.0.6)되며, 가로로 긴 차트에는 좌/우 화살표 페이징이 붙는다("*가로로 긴 차트의 경우, 화살표 좌/우 키 제공"). 라이선스 카드처럼 내용이 길면 내부 스크롤을 쓴다("*스크롤 제공").

---

## B. 앱 셸 / 레이아웃 골격

### 측정값 (대표화면 `올위젯` 35262:54045, 1280×3948 기준)

```
x=0                                                                  x=1280
┌─────────────────────────────────────────────────────────────────────────┐
│ header_console (Property 1=Default_Console, 원격 라이브러리) 1280x74       │
│ ┌ title bar 1280x40  AL:H p4/16  bg $Global/neutral/m-neutral-10 ───────┐ │
│ │ "LG Business Cloud" (15 Medium, m-neutral-100)                         │ │
│ │               우측 elements(AL:H gap10, 444x32):                       │ │
│ │  [dropdown "Business 01" 108x24] | [⏱ 00:00][button h26 secondary     │ │
│ │  "Extend"] | [button_icon outlined h32 ✉][button_icon outlined h32 📦] │ │
│ │  | [icon_badge 👤][icon_badge 🔔][icon_badge ⚙] (24x24, type=large)   │ │
│ │  구분선: divider orientation=vertical 1x12 (m-neutral-40)              │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│ ┌ sub bar(GNB) 1280x34  AL:H p4/36  bg m-neutral-10 ────────────────────┐ │
│ │ button h26 style=text 120x26 x7 (간격 약 61, 균등 배치):                │ │
│ │ Dashboard · Devices · Data▾ · Content▾ · Rules · Schedule▾ · Add-On    │ │
│ │ Service▾  (드롭다운 메뉴는 icon-right=on)                               │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ Body  AL:V  padding 12 / 0 / 24 / 0   bg $Global/neutral/m-neutral-20      │
│ ┌ body_title (로컬 컴포넌트) 1280x50  AL:H gap8 p12/20 ──────────────────┐ │
│ │ "Dashboard" (18 Medium, Body/Body2)        [Dashboard Template | 서브] │ │
│ └────────────────────────────────────────────────────────────────────────┘ │
│  20 ┌ Content card 1240 폭  AL:V gap 8  p12/0  bg #ffffff (raw) ───┐ 20  │
│     │ ┌ Workspace bar 1240x76  AL:H gap10 p12/24 ───────────────────┐ │     │
│     │ │ "Workspace"(10)                     Last Update Time          │ │     │
│     │ │ "Workspace 01 ▾"(18)        YYYY.MM.dd hh:mm:ss [↻ h24]       │ │     │
│     │ │                             Auto Refresh [switch] [1 min ▾]   │ │     │
│     │ └───────────────────────────────────────────────────────────────┘ │     │
│     │ Widget 1240 폭 (AL:V, 좌우 padding 12)                             │     │
│     │ Widget …  (위젯끼리 세로 간격 8)                                    │     │
│     └───────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
(푸터 Console_footer_SignIn 1683x74는 Scenario 페이지에 따로 있고 Sitemap / Privacy Policy / Cookie 링크를 담는다. 대시보드 화면 안에는 배치하지 않았다.)
```

| 영역 | 크기 | 패딩/간격 | 배경 |
|---|---|---|---|
| 전역 헤더 `header_console` | 1280×74 (40+34) | title bar p4/16, sub bar p4/36 | `Global/neutral/m-neutral-10` |
| 바디 | 1280×auto | p 12(상) / 24(하), 좌우 0 | `Global/neutral/m-neutral-20` |
| 페이지 타이틀 `body_title` | 1280×50 | AL:H gap8, p12/20 | 투명 |
| 콘텐츠 카드 | **1240**(좌우 여백 20) | AL:V **gap 8**, p12 상하 | `#ffffff` (변수 미바인딩) |
| 워크스페이스 바 | 1240×76 | p12/24, gap10 | – |
| 위젯 | 1240 폭(일부 마스터는 1280, 배치 시 1240으로 리사이즈) | 좌우 p12, 상하 p0 또는 6 | `#ffffff` |

- **사이드바는 없다.** 내비게이션은 상단 GNB(sub bar) 7개 메뉴만 쓴다. `navigation_side`(220×144)는 워크스페이스 선택 드롭다운의 펼침 목록으로만 쓰였다(03 헤더 슬라이드).
- 앱 스위처: 헤더 좌측은 `LG Business Cloud` 텍스트(Global/AppTitle 값과 같은 문자열, 추정)이고 별도 앱 스위처 UI는 없다. 비즈니스 전환은 `dropdown "Business 01"`(펼침은 popup_list 108×89, Search + 목록 + 체크)으로 한다.
- 그리드: 12컬럼 같은 레이아웃 그리드는 쓰지 않았다(layoutGrids 없음). **위젯은 모두 1열 전폭(1240)으로 세로 스택**한다. 위젯 내부 서브카드만 가로 AL(gap 9~12)로 나눈다.
- 콘텐츠 최대 폭은 1240px(1280 - 20×2)이다.

---

## C. 화면 유형 (템플릿)

### C-1. 대시보드 홈 (템플릿 공통) — All Widgets / Device Monitoring / Content Management / Schedule Management / Device Installation

```
[header_console 74]
[body_title: "Dashboard"                      (Dashboard Template | <현재 템플릿명>) ]
┌ white card 1240 ──────────────────────────────────────────────────────────┐
│ Workspace bar (Workspace 01 ▾ … Last Update Time ↻ / Auto Refresh ◯ 1min▾)│
│ Widget: Connection Status                                                 │
│ Widget: Issue Trends                                                      │
│ Widget: …   (템플릿별 위젯 순서는 SRS/PRD를 따름)                          │
└───────────────────────────────────────────────────────────────────────────┘
```

템플릿별 위젯 구성(description 원문):

| 템플릿 | 위젯 순서 |
|---|---|
| **All Widgets**(디폴트, 첫 진입) | Connection Status → Issue Trends → Issue Activity → Network Status → Quick Button → Recent Content Activity → Publish History → Content Publish Analytics → Device Installation → License Overview → Add-On → Workspace Storage → User Activity (13개, 1280×3948) |
| Device Monitoring | 1.1 Connection Status, 1.2 Issue Trends, 1.3 Issue Activity, 3.3 Network Status, 1.4 Device Installation, 3.1 License Overview, 2.6 User Activity |
| Content Management | 2.5 Recent Content Activity, 2.7 Publish History, 2.7 Workspace Storage, 2.1 Add-On, 2.6 User Activity |
| Schedule Management | 1.1 Connection Status, 2.4 Publish History, 2.8 Content Publish Analytics, 2.6 User Activity |
| Device Installation | 1.1 Connection Status, 1.5 Device Installation, 3.1 Quick Button, 2.6 User Activity |
| **All Workspaces**(Business 단위) | 1.1 Connection Status, 2.3 Workspace Overview(테이블) — 템플릿 버튼은 비활성 + ⓘ 툴팁 |

템플릿 버튼: `body_title` 우측의 `button h26 secondary`. 레이블은 "Dashboard Template"이고 서브텍스트로 현재 템플릿명(작은 Bold)을 붙인다.

### C-2. 위젯 카드 해부 (모든 위젯 공통)

```
Widget (AL:V, 1240 폭, 좌우 padding 12, bg #fff)
┌──────────────────────────────────────────────────────────────────────┐
│ widget_title (로컬 컴포넌트) 1216x56  AL:H gap8 p12                    │
│  "Title" 15 Medium(Body/Body3)              [action 영역]             │
│     action: button h26 secondary (텍스트/아이콘 좌측) 또는              │
│             button_icon onlyicon h32 (">" = View All)                 │
├──────────────────────────────────────────────────────────────────────┤
│ Body: 가로 AL gap 12 (일부 9/10)                                       │
│ ┌ sub-card ───────┐ ┌ sub-card ───────┐ ┌ sub-card ─┐                  │
│ │ AL:V p12 gap8~10│ │ label 12 Medium │ │           │                  │
│ │ bg m-neutral-10 │ │ (Body/Body4)    │ │           │                  │
│ │ r8, stroke      │ │ value 15 Bold   │ │           │                  │
│ │ m-neutral-40    │ │ "NN >"          │ │           │                  │
│ │ (opacity≈0.65)  │ │                 │ │           │                  │
│ └─────────────────┘ └─────────────────┘ └───────────┘                  │
└──────────────────────────────────────────────────────────────────────┘
(별도 푸터 없음. 위젯 사이 간격 8은 부모 카드의 gap이다.)
```

위젯별 구성 요소:

| 위젯 | 크기 | 헤더 액션 | 바디 구성 |
|---|---|---|---|
| Connection Status | 1240×208 | 없음 | 서브카드 4개(가로 gap12): 도넛 카드 208w(`graph/donut chart type=light` 128) / Online 266w / Standby 526w / Offline 180w. 상태 카드 = `icon_badge` + "Online (20)" + 세로 구분선(1×54 m-neutral-40)으로 나눈 지표(●badgedot + 라벨 / "NN >") |
| Issue Trends | 1240×179 | `button h26 secondary icon-left=on` "Select Issue Type"(⚙) | 회색 컨테이너(bg m-neutral-20, r8, p8)에 "Total NN"과 데이터카드 5개(238×80, gap12; `tag_text size=small status=primary` 카테고리 + 이슈명 / Total NN · Today NN [▲NEW 배지]) |
| Issue Activity | 1240×316 | `button_icon onlyicon h32` (View All >) | 필터 칩 행(`button h26` primary=선택(m-neutral-70 채움)/secondary, gap4, 라벨 "Hardware NNN") + 테이블(`element/cate_table` 헤더 27h + `element/cell_table` 36h × 5행, 마지막 열은 type=icon button 40w) |
| Network Status | 1240×308 | View All > | 서브카드 3개 412×240(gap10): Network Types(도넛 + `legend`, `element/trailing_chart type=dropdown`) / Average RTT ⓘ(`tootip_text`) / Weak Signal Devices ⓘ(⚠ Weak Caution + "Low RSSI Value -80 dBm 이하 NN >" 버튼) |
| Quick Button | 1240×272 | `button h26 secondary` "Edit" | 흰 컨테이너(r8, stroke m-neutral-40 0.5, p12, gap12)에 `thumbnail_16:9`(160×90) 아이콘 타일 7열×2행 + 라벨 |
| Recent Content Activity | 1240×302 | View All > | "Content by Type" + `tag_text size=medium`(선택 primary / 나머지 secondary, gap8, 9종: All·Image·Video·Playlist·Channel·Art·Addon·My Content·Document) + `basic card_02 type=text`(229×160) 5장 gap12 |
| Publish History | 1240×326 | (v1.0.7: More → View All) | Publish Summary 카드 400w(Total / ●Success / ●Fail 3분할) + `recent publish`(로컬, 807w) 표(Content Name >, Publish Time, Device Name, Published By, Status=`tag_text` 상태 칩) |
| Content Publish Analytics | 1240×520 | 없음 | 2행(gap12): [Monthly Publish Activity `charts_bar/type1` 894w + Content Type Distribution `charts_circle/circle` 350w] / [Top 10 Content `charts_bar/type1` 622w + Top 10 Devices 622w], 각 220h |
| Device Installation | 1240×216 | 없음 | `install code`(로컬, 602w; default / no code / expired 변형) + Awaiting Approval Devices 602w("NN >") |
| License Overview | 1240×289 | `button` "Manage License" + `button icon-left=on` "+ Purchase License" | 회색 컨테이너(m-neutral-20, r13, p12) "Assigned Licensed N" + `License Card`(257×156, Product Card / Header Category=Add-On/Expansion/Core) 가로 나열 + `button_icon outlined h32` ">" 페이징 |
| Add-On | 1240×178 | View All > | My Add-Ons 718w(로고 타일 + ">" 페이징) + Recommended Add-Ons 489w |
| Workspace Storage | 1240×206 | "Manage Storage" + "+ Add Storage" | 사용량 카드 844w("{NN}% used", Used/Total/Free, `progress bar_line`, 하단 안내문) + 분류 범례 카드 360w(Library/Report/Content {NN} GB {nn}%) |
| User Activity | 1240×266 | View All > | 테이블 3열(405w: User Name `text+icon` >, Recent Activity, Activity Count) 5행 |
| Workspace Overview(All WS 전용) | 1240×266 | – | 정렬 가능한 테이블(Workspace Name >, Devices⇅, Total Issues⇅, Distributed Contents⇅, Total Distributions⇅) + 세로 `scroll bar` |

차트 컴포넌트 매핑:
- 도넛: `graph/donut chart type=light`(128×128; Connection Status, Network Types, Content Type Distribution 안쪽) 안에 `element/circle_segments`. 중앙 라벨은 "Total / NN".
- 원형 차트 카드: `charts_circle/circle Property 1=type1`(350×220)에 `legend type=Horizon series, 정렬=세로`를 우측에 둔다(범례마다 값 "00 >").
- 세로 막대: `charts_bar/type1`(602~894×220)에 `graph/bar shape=vertical`, `element/bar_group_vertical bar count=3`(월별 3계열: Publishes/Devices/Content) 또는 `bar count=1`(Top10), `element/y-axis_number count=6`, `element/x-axis_text count=10`, `element/bg line count=6`, `element/axis_line_chart type=1px` 구성. 호버 값은 `tootip_text position=bottom`.
- 범례: `legend type=Horizon series, 정렬=가로`(차트 우상단), `element/legend_item type=horizon 01_fix/02_hug`.
- 진행률: `progress bar_line size=medium`(Workspace Storage, 다색 세그먼트).

### C-3. 헤더 / 워크스페이스 바 (03 슬라이드)
- ⓪ 재진입하면 사용자가 마지막으로 선택한 범위의 대시보드를 보여준다(사용자별로 저장).
- ② Business 드롭다운 → 커먼 정의를 참조한다.
- ③ Workspace 드롭다운: "Workspace" 라벨(10) + "Workspace 1 ▾"(18). 펼침(220폭)은 Search input_text + "All Workspaces" + 워크스페이스 목록(ⓘ아이콘)으로 구성한다. 기본값은 첫 워크스페이스이고, Business 권한이 있을 때만 All workspaces가 보인다. Business/Group은 목록에 표시하지 않는다.
- ④ Last Update Time(12) + "YYYY.MM.dd hh:mm:ss"(10, m-neutral-70) + 새로고침 `button_icon outlined h24`. Auto Refresh는 `switch_label` off가 기본이고, 주기 드롭다운은 30초 / **1분(디폴트)** / 5분 / 10분 / 30분이다. 수동 새로고침을 누르면 자동 타이머가 리셋된다.
- ⑤ Dashboard Template 버튼 → 템플릿 선택 팝업을 연다.

### C-4. 팝업 (모달)

```
대시보드 템플릿 선택 팝업 (09) 938x319, r5, bg m-neutral-10, stroke m-neutral-40
┌ element/title_popup size=large 938x49  "Choose Dashboard Template" ────────┐
├ body AL:Grid gap8 p8/16 ──────────────────────────────────────────────────┤
│ [gallery card_L 175x196] x5 (선택된 카드 stroke m-neutral-100 = 굵은 테두리)│
│   image 175x145(thumbnail_variable) / text content "All Widgets"(12)       │
├ element/bottom_popup type=2 buttons, align=vertical 938x58 p16 ────────────┤
│        [ Cancel (secondary) ]  [ Done (primary) ]  — 가운데 정렬, 동일 폭   │
└───────────────────────────────────────────────────────────────────────────┘
배경: 화면 전체 Dim (Overlay 컴포넌트)
```

- Select Issue Type 팝업(39, 위젯 설정): 997×363, AL:V p12 gap12, bg m-neutral-10, r8. 제목 "Select Issue Type"(12)과 안내 "You can select up to 5 items"(10, m-neutral-70) 아래에 회색 영역(m-neutral-20, p8)이 오고, 카테고리 행마다 좌측 180w 라벨과 우측 `checkbox_label` 다수(gap16)를 둔다. 행 구분선은 m-neutral-40. 하단 [Close 210w secondary][Done 210w primary] gap12, 가운데 정렬.
- Weak Signal Devices 팝업(46 ①-1): 소형 테이블 팝업(Model Name / Device Name / RSSI Value) + "Total NN" + 하단 [Close] 단일 버튼.
- 콘텐츠 상세 팝업: 콘텐츠 시나리오를 참조한다(본 문서에는 없다).

### C-5. 커스텀 대시보드 (대표화면 `77-커스텀대시보드-진입/편집중`, 1280×858)
- 09 슬라이드 ② "Custom 대시보드 1개 슬롯"에서 진입한다. 처음에는 빈 칸에 "+ Create Custom Dashboard" 버튼이 있다.
- 레이아웃: "Custom Dashboard" 타이틀, "Name*" input_text(전폭), 그 아래 좌측 Widget List 패널(240w, 카테고리별 `checkbox_label` 그룹: Device Widgets (4) / Content Widgets (7) / ETC Widgets (3), 세로 scroll bar)과 우측 Dashboard Editor(선택 목록 "Total {N} / 10" + 드래그 핸들 ≡ / Preview 영역, "Clear All" 버튼). 하단에는 [Cancel][Save] 큰 버튼(h33 추정)을 가운데 두고, 아무것도 선택하지 않으면 Save가 비활성이다.
- Empty: 아이콘(common/ic_dashboard 40) + "Create Your Custom Dashboard" + "Select a widget from the widget list panel and add it to the dashboard editor."
- (주의) History 0.9.0에 "커스텀 템플릿 삭제"가 있지만 09 슬라이드는 Custom 슬롯을 여전히 설명한다. 이 화면은 Scenario 페이지에 독립 슬라이드가 없다.

### C-6. Empty / 오류 상태
1. **Data 없음(위젯 단위)**: `empty-state-container` AL:H gap24 p20/40, bg m-neutral-20, r8. 구성은 `thumbnail_1:1`(60, IMG 플레이스홀더) + title "There is no data."(15, m-neutral-100) + description(12, m-neutral-70, 예: "No devices are currently connected to the system. Please check your network settings or wait for new devices."). 도넛은 회색 링과 "Total 0"으로 바뀐다. 차트는 축은 그대로 두고 가운데에 "There is no data."만 표시한다. 수치 데이터가 없으면 "0"/"0GB, 0%"로 적는다.
2. **라이선스 없음(위젯 단위)**: 같은 컨테이너(m-neutral-10 + stroke)에 title "This widget is not available with your current license." + "To use this widget, go to the portal and update your license." + `button h26 secondary icon-right=on` "CPQ Portal >". 헤더 액션 버튼은 **비활성**(status=disable, opacity 0.4)이다. All Widgets 외 템플릿에서도 라이선스 없는 위젯을 제목과 함께 그대로 표시해 템플릿의 용도를 알 수 있게 한다.
3. **위젯 표시 불가(화면 단위, 48, v1.1.0 New)**: 콘텐츠 카드 안에 `ic_artwork_dummy` 64 + "There are no available licenses at the moment"(15) + "You can check the license information after you assign a license to your Workspace."(12) + `button h33 secondary` "Go to Plan"(→ 포털 > 플랜)을 가운데 정렬한다(AL:V gap16 p26/24). 템플릿 버튼은 숨기고 툴팁도 없다.
4. 그 밖의 위젯별 상태: Add-On은 "설치된 Add-On이 없습니다" / 모두 설치하면 Recommended 섹션 숨김. Network는 "All WiFi Connections Strong"(✅ 초록) / "No WiFi Devices"(⊘ 회색) / "There is no device.". License는 "There is no license assigned." + Manage License 버튼. Device Installation은 "No Installation Code"(코드 만료 케이스는 v1.0.9에서 "코드 없음"으로 통일).
- **로딩 상태, 토스트, 스낵바는 정의하지 않았다**("서버 새로고침 실패 시 노티 없음", v1.0.2).

---

## D. 컴포넌트 사용 통계

### D-1. DS/원격 라이브러리 컴포넌트 — Scenario 페이지(총 인스턴스 4,372; "top"은 다른 인스턴스 안에 중첩되지 않은 직접 배치 수)

| 컴포넌트(세트) | 총 | top | 주요 변형 (개수) |
|---|---|---|---|
| element/cell_table | 441 | 111 | align=center, type=text, divider_topdown=true (319); type=text+icon (80); type=slot (22) |
| element/bar_chart | 342 | 0 | type=y (262); type=x (80) |
| element/bar_count_chart | 342 | 0 | count=1 |
| arrow/ic_arrow_right | 303 | 12 | – ("NN >" 링크 화살표) |
| **button** | 211 | 79 | h26 secondary normal (71); **h26 text icon-right=on (36)**; h26 secondary icon-right=on (28). status=disable 19 |
| **button_icon** | 207 | 45 | onlyicon h16 (68); onlyicon h32 (50); outlined h24 (45) |
| **tag_text** | 156 | 67 | size=medium secondary (86); size=small primary icon=on (22); small primary (20) |
| cell_table(문서 표) | 155 | 0 | (description table용) |
| element/bar_group_vertical | 134 | 28 | bar count=1 (70); bar count=3 (64) |
| element/axis_line_chart | 132 | 0 | type=1px (110); 2px (22) |
| thumbnail_16:9 | 104 | 49 | type=none, landscape |
| element/cate_table | 93 | 27 | align=center, normal, text, divider_topbottom=true |
| ic_artwork_dummy | 90 | 3 | – |
| element/circle_segments | 84 | 0 | type=light |
| element/bar_group_horizontal | 80 | 80 | bar count=1 |
| divider | 69 | 2 | vertical (27); horizontal (25) |
| element/badgedot | 59 | 9 | size=medium, state=primary |
| annotation dot | 54 | 53 | color=filled (문서 주석) |
| icon_badge | 51 | 3 | type=large, color=black |
| element/legend_item | 50 | 24 | horizon 01_fix (26); 02_hug (24) |
| thumbnail_1:1 | 41 | 41 | type=default (empty 썸네일) |
| checkbox_label / checkbox | 30 / 29 | 30 / 4 | normal, 1depth / unselected 24, selected 5 |
| Doc Title | 29 | 29 | depth2 (22); depth1 (7) |
| graph/donut chart | 28 | 11 | type=light |
| alert/ic_info / ic_info_fill / ic_warning / ic_ok / ic_error / ic_null | 27/22/9/10/4/34 | – | – |
| thumbnail_variable | 26 | 4 | default |
| dropdown | 24 | 7 | status=normal (22); height=h28 (2) |
| legend | 24 | 13 | Horizon series 가로 (16); 세로 (8) |
| table | 23 | 23 | (스펙 description 표) |
| basic card_02 | 20 | 5 | type=text, normal |
| element/trailing_chart | 19 | 19 | type=dropdown |
| tootip_text | 15 | 8 | bottom/center (6); top/center (5); left/start (4) |
| scroll bar | 15 | 11 | vertical 25%/50%, horizontal 25% |
| tab_group_line | 13 | 13 | hight=h36, line=true, type=full |
| License Card / Product Card / Header | 12 / 12 | 3 / 0 | Category=Add-On / Expansion / Core (각 4) |
| header_console | 9 | 3 | Property 1=Default_Console |
| switch_label | 8 | 2 | on/off=off, normal |
| charts_circle/circle / charts_bar/type1 / graph/bar | 8 / 8 / 8 | – | type1 / – / shape=vertical |
| list_depth | 5 | 0 | checkbox·icon, 1 depth |
| Tag | 5 | 0 | Modified (4); New (1) |
| input_text | 2 | 0 | h36 default enabled |
| gallery card_L | 2 | 1 | type=normal |
| popup_list / navigation_side / element/title_popup / element/bottom_popup / Overlay | 1 each | – | title_popup size=large; bottom_popup type=2 buttons, align=vertical |
| Console_footer_SignIn | 1 | 1 | Property 1=SignIn |

대표화면 페이지(인스턴스 8,419, 레거시 포함)에서 추가로 보이는 DS 컴포넌트: `dashboard card status=normal, size=Large`(42, 구 대시보드), `badge_text_role`(72: Schedule Manager/master/admin), `basic card_01 type=thumbnail`(18), `element/tab_segment`(10), `tab_group_segment`(5), `progress bar_line size=medium, progress=50%`(6), `input_text h48`(6), `Date input`(2), `popup type=slot`(2), `switch`(5), `group_policycell`(18), `element/cate_table_vertical`(10), `index`(6), `Omission line`(2).

**DS 목록에 있지만 이 문서에서 쓰지 않은 컴포넌트**: radio button, pagination, breadcrumb, side bar_open, headings_main/sub, toast, snackbar, notification box, dashboard card_L_Progress, dashboard card_Noti, app card_cc, charts_line, charts_area, step, calendar, filter, loading, avatar. (`title bar` 이름은 header_console 안의 프레임명으로만 나온다.)

### D-2. 로컬(커스텀) 컴포넌트

| 컴포넌트 | 크기 | 설명 |
|---|---|---|
| `widget_title` | 1216(1256)×56 | 위젯 헤더. AL:H gap8 p12. 제목 15 Medium(Body/Body3, #000000 raw) + 우측 액션 슬롯. Scenario 페이지 115회, 가장 많이 쓴 로컬 컴포넌트 |
| `body_title` | 1280×50 | 페이지 타이틀 바. 좌: [back button_icon onlyicon h32(숨김)] 타이틀 18 Medium(Body/Body2) + │ 서브타이틀 15 + │ dropdown. 우: btns(button h26 secondary, gap12). 대부분 옵션은 숨김 상태로 쓴다 |
| `비즈니스사이트`, `올위젯`, `2디바이스 모니터링`, `3콘텐츠매니지먼트`, `4스케줄 매니지먼트`, `5디바이스 인스톨레이션`, `대시보드스타일`, `Home` 등 | 1280×(720~3948) | 화면 단위 COMPONENT(대표화면에서 만들어 Scenario에 인스턴스로 배치) |
| 위젯 14종 `1-1 커넥션스테이터스` … `4-3 네트워크스테이터스` | 1240/1280×(178~520) | `widgets` 섹션의 위젯 마스터(C-2 표 참조) |
| `install code` (set) | 602×160 | Property 1 = default / no code / expired. Installation Code "974910" + 복사 아이콘(edit/ic_copy) + 만료 시각 hh:mm:ss |
| `recent publish` (set) | 807×270 | Property 1 = default / empty. Recent Publish History 표 |
| `widget_license` | 270×135 | 구버전 대시보드용 라이선스 카드(레거시) |
| `widget_recent_card` (set) | 240×99 | success / fail / progress (레거시) |
| `card_noti` | 270×159 | 알림 카드(레거시, 구 대시보드) |
| `pixel status`, `cabinet status`, `top secuevent`, `recent secuevent`, `1-4 세큐리티모니터링` (sets) | – | LED/보안 위젯. 0.9.0에서 삭제(레거시) |

---

## E. 조합 패턴

| 패턴명 | 구성 | 수치 | 사용처 |
|---|---|---|---|
| **P1 위젯 셸** | `widget_title`(56h) + body(가로 AL) | 위젯 좌우 p12, 위젯 사이 gap8, 흰 배경, 위젯 자체에는 테두리 없음 | 모든 위젯 |
| **P2 서브카드(Stat Panel)** | AL:V, p12, gap8~10, bg `m-neutral-10`, r8, stroke `m-neutral-40` @ opacity 0.6~0.67, 1px | 서브카드 사이 gap 10~12 | Connection Status, Network, Publish Summary, Device Installation, 차트 카드 |
| **P3 KPI 지표 셀** | [●badgedot + 라벨 12 Medium] / ["NN"(15 Bold) + arrow/ic_arrow_right] 세로 gap4, 셀 사이 세로 divider 1×54 `m-neutral-40` | 셀 폭 균등 분할(114/162) | Online/Standby/Offline, Publish Summary(Total/Success/Fail), Awaiting Approval |
| **P4 회색 그룹 컨테이너** | bg `m-neutral-20`, r8~13, p8~12 + 상단 "Total NN"/"Assigned Licensed N" 라벨 + 흰 카드 나열(gap12) | 카드 238×80 / 257×156 | Issue Trends, License Overview |
| **P5 필터 칩 행** | `button h26`: 선택 = primary(m-neutral-70 채움), 미선택 = secondary(흰 바탕 + m-neutral-40 테두리), 라벨 + 카운트 "NNN" Bold, gap4 | – | Issue Activity 카테고리 필터 |
| **P6 태그 필터(Content by Type)** | `tag_text size=medium`: primary(m-primary-70) = 선택, secondary(m-primary-90) = 나머지, gap8 | 21h | Recent Content Activity |
| **P7 위젯 표** | `element/cate_table`(27h, bg m-neutral-20) + `element/cell_table`(36h) × 최대 5행, 가운데 정렬, 첫 열 링크는 type=text+icon(">"), 마지막 액션 열은 type=icon button 40w. 행 구분선 #bcbcbc @0.5 | 최대 5행("최대 5개 노출") | Issue Activity, User Activity, Publish History, Workspace Overview |
| **P8 차트 카드** | 제목 12 Medium + 우상단 legend(가로) + 차트 본문(축 6눈금) | 220h, r8 | Content Publish Analytics, Network Types |
| **P9 헤더 액션** | View All = `button_icon onlyicon h32`(">" 화살표). 설정 = `button h26 secondary icon-left=on`(⚙ Select Issue Type). 관리 = `button h26 secondary` 1~2개(+ 아이콘은 icon-left=on), gap8 | – | 위젯 헤더 우측 |
| **P10 Empty / 라이선스 없음 블록** | C-6 참조. [IMG 60] + title 15 + desc 12 (+ CPQ Portal > 버튼). 비활성 헤더 버튼은 opacity 0.4 | p20/40 gap24 또는 p0/60 gap40 | 모든 위젯의 ②/③ 상태 |
| **P11 팝업 하단 2버튼** | 가운데 정렬, 동일 폭(210), gap12, **[취소/닫기 secondary][확인 primary]** | – | 템플릿 선택, Select Issue Type, Custom Dashboard |
| **P12 가로 페이징** | 카드 목록 끝에 `button_icon outlined h32` ">" (p12) | – | License Overview, My Add-Ons |
| **P13 400% 스택** | 위젯 폭 400, 서브카드를 세로로 쌓음(gap12), 표는 pivot, 차트는 ‹ › 페이지 버튼 | 376 내부 폭 | 각 위젯 슬라이드 하단 |

---

## F. 콘텐츠 / UX 규칙

### 용어와 문구
- 영문 UI이고 Title Case를 쓴다: "Connection Status", "Last Update Time", "Auto Refresh", "Select Issue Type", "Manage License", "Purchase License", "Add Storage", "Manage Storage", "View All", "Go to Plan", "CPQ Portal".
- 용어 통일(v1.0.8): pending approval devices → **Awaiting Approval Devices**, success → **Succeeded**, fail → **Failed**. More button → **View All button**(v1.0.7).
- Empty 문구 체계: 제목 "There is no data." / "There is no device." / "There is no license assigned." + 원인과 행동을 안내하는 설명 한 줄.
- 라이선스 문구: "This widget is not available with your current license." / "To use this widget, go to the portal and update your license."
- 툴팁(All Workspaces): "Dashboard templates are not applied when viewing all workspaces."
- 상태 표기: "Online (20)", "Standby (47)", "Offline (47)"처럼 괄호 안에 개수를 적는다. Online의 하위 상태는 Playing/Broadcasting, Standby는 Screen Off/Network Ready/No Signal, Offline은 Disconnected다(Fast Power Mode는 v1.0.2에서 제외).

### 버튼 순서와 상태
- 확인/취소 순서: **좌 Cancel(Close) secondary / 우 Done(Save) primary**, 가운데 정렬, 동일 폭.
- 비활성: `button status=disable` + 인스턴스 **opacity 0.4**(19회 모두 동일), button_icon은 opacity 0.5. 라이선스가 없으면 헤더 액션을 비활성으로 둔다. All Workspaces에서는 템플릿 버튼을 비활성하고 서브텍스트 대신 ⓘ 툴팁을 띄운다.
- Primary 버튼 채움색은 `m-neutral-70`(무채색)이다. 강조색 primary(m-primary-70, 틸 #1d828f 계열, 추정)는 tag/chart에만 쓴다.

### 숫자와 날짜 형식 (플레이스홀더)
- 숫자: `NN`, `NNN`, `00`, `{NN}`, `{nnn} GB`, `{NN}%`. 차트 축 0/10/20/30/40/50.
- 헤더 갱신 시각: `YYYY.MM.dd hh:mm:ss`. 표: `YYYY-MM-DD hh:mm:ss`. 라이선스 기간: `2026-07-01` / `12 months`. 상대시간: `{NN hours ago}`.
- 차트 X축: Date Time format 설정을 따른다 → `{Jan 2026}` 또는 `{2026-01}`. 최근 12개월을 월 단위로 집계한다.
- 표에서 비어 있는 값은 "--"로 쓴다(Resolved Time 미해결). 데이터가 없는 Workspace 행은 "0"으로 쓴다.

### 동작 규칙 (description 원문 요약)
- **수량 클릭 → 목록 페이지로 이동하고 필터를 자동 적용한다**: Connection Status 상태별 수량 → Devices 목록(해당 상태 필터). Issue Trends 카드 → Data > Analytics > Issue Trends(Category/Issue Type 필터 적용).
- View All(>) 이동 경로: Issue Activity → Data > Analytics > Issue Trends. Recent Content / User Activity → Data > History > All. Publish History → Data > History > History > Content Publish. Network Status → Data > Analytics > Network Health.
- 목록 위젯은 **최대 5개**(최신순)만 보여준다. Issue Trends는 사용자가 고른 항목 최대 5개다("You can select up to 5 items"). Recommended Add-On은 미설치 중 최대 5개(다운로드 많은 순; 이전 기술은 무작위)이고, 모두 설치하면 섹션을 숨긴다.
- Issue Trends의 Today: 오늘 발생 건이 있으면 개수와 "▲ NEW" 배지, 없으면 "0"(배지 없음).
- 차트 인터랙션: 범례 클릭으로 계열 표시/숨김을 토글한다. 막대에 호버하면 툴팁에 수치가 나온다. 데이터 없는 월은 막대 높이 0이다. 도넛 영역에 호버하면 개수와 비율이 나오고, 클릭하면 토글된다. Top10 막대를 클릭하면 콘텐츠 상세 팝업 또는 디바이스 상세로 간다.
- Network: 평균 RTT는 범위에 따라 아이콘과 색이 다르다(✅ 148 ms 초록 / ⚠ 180 ms 주황 / ⊗ 302 ms 빨강, 기준은 "150ms 미만 정상, 150-300 약간 지연, 300 초과 심각"). Weak Signal은 RSSI ≤ -80 dBm인 WiFi 기기를 센다(툴팁 -50 우수 … -90 불안정). RTT 데이터가 없는 Offline 기기는 집계에서 뺀다.
- License Overview: End date가 가까운 순으로 정렬하고, 같으면 제품명 알파벳순으로 정렬한다. Manage License → Settings > License. Purchase License → Portal > Plan 새 탭(전 지역 노출).
- Workspace Overview: 컬럼 헤더를 클릭하면 오름/내림차순으로 정렬한다.
- Quick Button: 바로가기이며 구성은 편집할 수 없다(설명 기준). 화면에는 Edit 버튼이 있다.
- 템플릿: 읽기 전용이고 수정할 수 없다. 템플릿명은 권한(Role)과 무관한 화면 구성 프리셋이다. 디폴트는 All Widgets다.
- 사용자별 저장: 마지막 Workspace 선택, 마지막 템플릿, Auto Refresh 주기.
- 정의하지 않은 것: 로딩 스켈레톤/스피너, 토스트/스낵바, 에러 재시도(새로고침 실패 노티 없음).

---

## G. 화면에 실제로 바인딩된 색과 텍스트 스타일

측정 범위: Scenario 페이지 22개 화면 슬라이드 안의 화면 노드 12,912개(Doc Title, description 표, 주석 제외, 인스턴스 내부 포함).

### 색 변수 — 채움(도형/프레임)
| 변수 | 횟수 | 용도 |
|---|---|---|
| Global/neutral/m-neutral-40 | 1,205 | 구분선, 차트 그리드, 아이콘 |
| Global/neutral/m-neutral-10 | 617 | 흰 표면(헤더, 서브카드, 버튼 바탕) |
| Global/neutral/m-neutral-20 | 383 | 바디 배경, 회색 그룹 컨테이너, 표 헤더, empty 배경 |
| Global/neutral/m-neutral-100 | 330 | 아이콘(검정) |
| Global/primary/m-primary-70 | 250 | tag primary, 차트 계열 |
| Global/neutral/m-neutral-70 | 201 | primary 버튼 채움, 선택 칩 |
| Global/semantic/warning/m-warning-60 | 113 | Standby 도트, 주황 계열 |
| Global/primary/m-primary-90 | 87 | tag secondary |
| Global/semantic/infomation/m-info-60 | 68 | 파랑(Wifi, 차트) |
| Global/semantic/success/m-success-60 | 34 | Online 도트, Success |
| Global/semantic/error/m-error-60 | 10 | Fail |
| 기타 | – | Neutral/100(12), Global/neutral-70(8), m-success-20(8), m-info-80-text(7) |

### 색 변수 — 텍스트
m-neutral-70 **1,426**(보조 텍스트, 데이터 셀) · m-neutral-100 488(본문/제목) · m-primary-70 190 · m-neutral-10 158(반전 텍스트) · **Text/system/color-text-main** 125(Workspace 라벨/이름) · m-success-60 32 · m-primary-90 22 · m-info-80-text 8 · m-warning-80-text 6

### 색 변수 — 테두리
m-neutral-40 465 · m-neutral-20 144 · m-neutral-70 36 · m-neutral-100 31(선택 카드) · Border/component/color-border-01 12(License Card)

### 변수에 바인딩하지 않은 raw hex (자주 쓰는 순)
- 채움: **#ffffff 157**(콘텐츠 카드와 위젯 배경, 바인딩 누락), #000000 41, **#1d828f 40**(틸, 차트/태그 추정 = primary 계열), **#f79009 33**(주황 = warning), #d9d9d9 20(구분 Rectangle), #ed255b 18(빨강: NEW 배지 또는 Fail), #d1fadf 16(연초록), #0e66e8 12(파랑), #027948 8(진초록), #6b4aad/#333d54/#0a6e66 각 4(라이선스 카테고리 배지 Expansion/Core/Add-On)
- 텍스트: **#000000 200**(widget_title 제목 등), #525252 88("Total" 라벨), #757575 87, #0e66e8 30, #f79009 24, #ed255b 16, #ffffff 14, #677902/#b930ce 각 8(도넛 범례 My Content/Document)
- 테두리: **#bcbcbc 534**(표 셀 구분선 @0.5), #555555 56(400% 프레임 외곽), #a1a1a1 37(화면 외곽선)
- 위젯 마스터와 화면 루트의 흰 배경, widget_title 텍스트(#000000)를 변수에 바인딩하지 않은 점이 눈에 띈다.

### 텍스트 스타일
| 스타일 | 횟수 | 실측 값 | 용도 |
|---|---|---|---|
| Body/Body5 | 1,304 | 10 Regular | 표 셀, 보조 라벨, 축, 타임스탬프 |
| Body/Body4 | 742 | 12 Medium | 서브카드 제목, KPI 라벨, 칩/버튼 라벨, 표 헤더 |
| Body/Body3 | 405 | 15 Medium | 위젯 제목, empty 제목, 헤더 앱명 |
| Body/Body6 | 315 | 8 Regular | 차트 미세 라벨, 태그 |
| Body/Body2 | 53 | 18 Medium | 페이지 타이틀 "Dashboard", Workspace 이름 |
| Body/Body1 | 8 | 23 Medium | 거의 쓰지 않음 |
| Body/Body3B | 2 | 15 Bold | KPI 값 일부 |
| (스타일 미적용) | 약 120 | Noto Sans 9.08 Regular/Bold, 7.78 Medium, 12 Bold | License Card 내부(축소 배율로 생긴 소수점 크기) |

- **Heading/Heading1-4는 화면에서 한 번도 쓰지 않았다.** 대시보드는 Body 계열(최대 18)만 쓴다. KPI 숫자도 15 Bold 수준이고, 큰 숫자 히어로 타이포는 없다(Workspace Storage의 "{NN}%"만 크다, 추정 23).
- 효과(그림자): 화면 노드에 visible effect가 하나도 없다. 카드는 그림자 없이 테두리와 면 색으로만 구분한다.

---

### 참고 노드 ID
- All Widgets 화면 컴포넌트: `35262:54045` (대표화면) / 슬라이드 `35261:46840` (Scenario "37")
- 헤더 슬라이드 `16756:203025`, 템플릿 팝업 `16756:205426`, 위젯 표시 불가 `36584:48082`, All Workspaces `16756:202470`
- 위젯 마스터: widget_title 로컬, `33849:14353`(1-1), `33849:14354`(1-2), `34054:39437`(1-3), `34017:26597`(4-3), `33849:15894`(4-1), `33849:15886`(2-5), `33849:15885`(2-4), `33849:15891`(2-9), `33849:15215`(1-6), `34017:25688`(4-2), `33849:15242`(2-1), `33849:15890`(2-8), `33849:15887`(2-6), body_title `34018:43096`
- 커스텀 대시보드: `34050:45356`(진입), `34050:45357`(편집중)
