# LCS Medical Server 1.2.1 화면설계서 분석 (웹 앱)

- 파일: `ITUX_LCSMedical_Server_1.2.1_261117` (fileKey `hbBPcXwmVavqMfRrm0qW39`). 읽기 전용으로만 분석했고 파일은 수정하지 않았다.
- 사용한 DS 라이브러리: `[DS] UI Asset 1.0.2`. 인스턴스의 대부분이 remote(R) 컴포넌트다.
- 제품: LG Calibration Studio Medical. 의료용 모니터의 캘리브레이션/QA를 원격으로 관리하는 브라우저 기반 서버 솔루션.
- 화면 구조는 회색 와이어프레임 톤이다. 강조색은 체크박스·상태 아이콘에만 쓰인다.

---

## A. 인벤토리

### 페이지 구성

| 페이지 | id | 성격 | 내용 |
|---|---|---|---|
| `시나리오` | 455:14411 | 문서(스펙) | 1920 폭 문서 프레임 66개: Cover, Legal Notice, Overview, History ×5, Index ×4(IA + Policy 3장), Subtitle ×7, **Screen Definition ×37**, End. 인스턴스는 12,869개이고 그중 비중첩 인스턴스는 2,498개 |
| `대표화면` | 86:55609 | 실제 화면 원본 | SECTION `2025-08-08-LCS서버 대표화면`(160:53453, 자식 206개). 화면·팝업이 **COMPONENT**로 정의되어 있고 시나리오 페이지는 이를 인스턴스로 가져다 쓴다. 섹션 밖에는 시안/논의용 섹션(`스케줄표기 논의`, `디바이스 그리드`, `비즈-워크-그룹룰` 등)과 가이드(`코멘트 관련 가이드`, `열람 관련 가이드`), 변경 요약 프레임 `대표화면 · 1.1.6 대비 변경 요약`이 있다. 인스턴스 11,937개, 비중첩 4,269개 |

### 화면 수
- 풀스크린 화면(폭 1280, 높이 ≥700): **40개**.
  - 높이 분포: 720×27개, 799×2, 802, 826, 881, 935×2, 1006, 1032, 1041, 1111, 1213, 1355.
  - 720보다 긴 화면은 세로 스크롤되는 상세 화면이다.
- 팝업 컴포넌트(`팝업-*`): **52개**.
  - 폭 분포: <300 12개, 300–399 7개, 400–499 10개, 500–599 20개, 600+ 3개.
- Screen Definition(스펙 문서 프레임): 37개. 모두 1920 폭이고 높이는 1080~2308.

### 타깃 뷰포트
- 와이어프레임은 **1280×720**으로 그려져 있다.
- Policy 문서(854:59516)의 명시 규칙: *"해당 솔루션은 웹 브라우저에서 작동. 현재 기본 사이즈 기준은 FHD(1920x1080)으로 개발되었고, 400% 확대(반응형) 기준 사이즈를 최소 사이즈로 제한하고 그 이상의 사이즈에서만 정상 동작을 보장함"*.
- 따라서 **1280×720 와이어 = FHD 1920×1080의 2/3 축소본**이다(추정). 실제 구현 px는 이 문서 값 ×1.5로 환산한다(추정).
- 단, DS 컴포넌트 일부는 와이어에서도 원래 높이를 유지한다(button h26 = 26px, button_icon h24 = 24px). 반면 `input_text height=h36`, `dropdown`은 **24px로 리사이즈**되어 쓰였다. 정확한 스케일 규칙은 GUI 단계에서 확인이 필요하다.

### Screen Definition 문서 프레임 구조
(622:88990 예시)

```
┌ 1920 ──────────────────────────────────────────────────────────────┐
│ Doc Title (1920x121)  "webOS UX / 대시보드 > 대표화면" (+ Modified v1.2.1 메모) │
├────────────────────────────────────────────────────────────────────┤
│ (41,150) 화면 인스턴스 1280x720          │ (1355,150) Des 표 535w      │
│  + annotation box/area/line/dot          │  description | 번호 | 제목 | 규칙 │
│    (분홍 번호 마커 1, 1-1, 2 …)            │                              │
│ 하단: 보조 팝업/상태 변형 인스턴스        │                              │
└────────────────────────────────────────────────────────────────────┘
```

---

## B. 앱 셸 / 레이아웃 골격

px는 1280 와이어 기준이고 괄호 안은 ×1.5 FHD 환산값(추정)이다.
근거 노드: `어셋매니저-그룹` 622:26904, `대시보드-디폴트` 622:23003.

```
┌──────────────────────────── 1280 (1920) ─────────────────────────────┐
│ title bar  h40 (60)  fill Global/neutral/m-neutral-70  pad L/R 16     │
│ [≡ 29x29][LG Calibration Studio Medical Body3 15 Med, neutral-10]     │
│                         … gap …  [⏱00:00 (Extend)] | [🔔][👤][⊞] gap10 │
├───────────┬──────────────────────────────────────────────────────┬───┤
│ side bar  │ content column (VERTICAL, gap 8, pad T/B 12)           │32 │
│ _open     │ ┌ page header row h37 ────────────────────────────────┐│pad│
│ 180 open  │ │ Title (Body2 18 Med, neutral-100)   Last update time:││ R │
│ / 47 close│ │                                  YYYY-MM-DD HH:mm [⟳]││   │
│ fill      │ ├ tab row h32 ────────────────────────────────────────┤│   │
│ neutral-20│ │ tab_group_line(h48,line,flex)      [actions →]       ││   │
│ items     │ ├ content area h534 ──────────────────────────────────┤│   │
│ 172x40    │ │ [navigation_side 220/253] 8 [panel r8 neutral-10    ]││   │
│ gap 11    │ │                              stroke neutral-40       ││   │
│ pad 4     │ └─────────────────────────────────────────────────────┘│   │
│ ←gap 32→  │                                                        │   │
├───────────┴──────────────────────────────────────────────────────┴───┤
│ footer h37 (≈56) fill #ffffff  pad L/R 20                              │
│ [⟳ Language [English ▾ 120]]      Copyright ⓒ LG Electronics… | Sitemap │
│                                   | Privacy Policy↗ | Cookie Policy↗ …   │
└──────────────────────────────────────────────────────────────────────┘
```

### 루트 프레임
- 1280×720, VERTICAL auto-layout, gap 0.
- 배경 raw `#ffffff`. 변수에 바인딩되어 있지 않다.

### title bar
- 로컬 컴포넌트 `title bar` 552:67554, 1280×40.
- HORIZONTAL, pad 0/16/0/16, fill `Global/neutral/m-neutral-70`.
- 좌측 `unit`(gap 3):
  - `element/button_icon_header` 29×29(햄버거)
  - 앱 타이틀 `Body/Body3` 15 Medium, `neutral-10`
- 우측 `elements`(gap 10):
  - `element/trailing_title bar` 107×26: 시계 아이콘 + `00:00` + `Extend` 칩 버튼
  - `divider` vertical 1×12
  - `icon_badge` 24×24 ×3: `alert/ic_notification`, `user/ic_profile`, `common/ic_apps`
- 기능(1-1 ~ 1-4):
  - 로그인 세션 60분, Extend를 누르면 60분으로 재시작
  - 알림센터 팝업
  - 계정 팝업(E-mail ID / My Role / Account settings / Sign out)
  - 솔루션 모음

### body row
- HORIZONTAL, gap **32**, pad R **32**, L 0.
- 높이 643 = 720 − 40 − 37.

### side bar_open (DS)
- open 180×643 / close 47×643(아이콘만). fill `neutral-20`.
- `list slot` pad 4/4/0/4, gap 11.
- `element/list_1depth_side bar` 172×40, `text-size=large`.
  - selected 상태는 흰 배경에 굵은 글씨다.
- 메뉴: Dashboard / Device manager / Calibration studio / ─divider─ / Settings / Administration.
- Administration은 Region admin에게만 보인다.

### content column
- 폭: side bar open 시 1036, close 시 1169. 화면 폭에서 사이드바와 gap 32, 우측 32를 뺀 값으로 가변(fill)이다.
- VERTICAL, gap 8, pad 12/0/12/0.

**page header row (h37, HORIZONTAL)**
- 좌측 타이틀은 두 가지 방식이 섞여 있다.
  - DS `sub menu`(status=selected, depth=1 depth): 텍스트 `Body/Body2` 18 Medium, `neutral-100`, pad 6/0
  - 같은 스타일의 plain TEXT 18
- 상세 화면 타이틀: `button_icon outlined h32`(36×36, ← back) + gap 8 + 타이틀.
- 우측(gap 10):
  - `Last update time : 2025-05-27  23:55`(`Body/Body5` 10, `neutral-70`)
  - `button_icon outlined h16`(새로고침)
  - 필요 시 `button h26 secondary icon-left`(예: `Dashboard export`)를 gap 12로 붙인다.

**tab row (h32)**
- `tab_group_line hight=h48, line=true, type=flex`. 예: Device / Group policy, System / Email notification.
- 우측 끝에 페이지 액션 버튼이 온다. 예: `Save` primary h26 icon-left, `Edit` secondary, `Task Queue 5`.

**content area (h534)**
- 단일 패널 `Frame 6`: r8, fill `neutral-10`, stroke `neutral-40`, pad 8/12/8/12, gap 8~12.
- 또는 `navigation_side`(220 또는 253 폭, r4, pad 4, fill `neutral-10`) + gap 8 + 패널.

### footer (DS `footer type=default`)
- 1280×37, pad 0/20, fill `#ffffff`.
- 좌측 `lable`(gap 4): 언어 아이콘 + `Language` + dropdown 120w.
- 우측 `group`(gap 12): Copyright + 외부 링크 5개(↗ 아이콘), 사이 divider.

### 폭 동작
- 콘텐츠 영역은 사이드바 상태에 따라 1036↔1169로 늘어나고 줄어든다.
- 내부 패널은 fill이고 테이블 열은 고정 폭 합(917)으로 구성된다.
- 스펙 규칙(8번 테이블): *"클릭 및 드래그로 열 너비 조정 가능"*, *"칼럼 영역 편집 가능(횡스크롤 가능)"*.

---

## C. 화면 유형(템플릿)

### C-1. 대시보드
- 화면: `대시보드-디폴트` 622:23003, `-퀵메뉴`, `-그룹 교차선택`.

```
┌ header: Dashboard (Body2 18)        Last update time … [⟳] (Dashboard export ⊞) ┐
├ grid (ALG gap 8~9) ─────────────────────────────────────────────────────────────┤
│ navigation_side 253x574 │ Category|Model 탭카드 253x283 │ map card 514x283       │
│ [Connected|All] seg     │ tab_group_line + list_depth   │ element/card_none      │
│ [🔍Search 217][⚙24]     │                                │ (No location 6) h20 btn│
│ tree list + scroll bar  ├──────────────┬────────────────┼────────────────────────┤
│                          │ line/type1   │ charts_bar     │ circle/type1 (donut×2) │
│                          │ 253x262      │ 253x262        │ 253x262                │
│                          └ footnote Body5 (가운데) ───────────────────────────────┘
```

- 차트 카드 공통:
  - 카드 fill `neutral-10`.
  - title 행 h38, pad 13/13/0/13: 제목 `Body/Body4` 12 Medium, `neutral-70` + 우측 `element/trailing_chart type=dropdown`(Daily…).
  - data 영역 pad 4/12/8/12.
- 정보 아이콘은 `button_icon outlined h16`이고 `tootip_text position=bottom`과 쌍으로 쓰인다.
- 지도 카드는 `element/card_none`(fill `neutral-20`)이다.
  - 우상단에 `button h20 secondary` "No location 6"가 있다.
  - 하단 안내문은 `Body5`.

### C-2. 목록/테이블 화면
- 화면: 디바이스 매니저 `어셋매니저-그룹/전체/비즈니스/프로퍼티`, 어드민, 디바이스상세-히스토리.

```
┌ header: Device manager                                  Last update time … [⟳] ┐
├ tab_group_line h48: [Device][Group policy]                                       ┤
├ navigation_side 220x534 ┐8┌ panel 941x534 (r8, neutral-10, pad 8/12, gap 8) ──────┤
│ [Connected|All]         │ │ ⓘ Default group  (Body3 15, h36 pad 12/0)            │
│ [🔍 Search      ][⚙]    │ │ Total 40         [All▾][🔍 Search 284] [≡Filter][⚙][⊞Batch report] │
│ ▾ All            NN     │ │ ┌ Actionbar 917x30 r8 neutral-20 ─────────────────┐ │
│ ▾ Business 01    NN     │ │ │☐ Select all | 2 item(s) selected [Move][Delete][Batch report]│
│   ▾ Workspace 1  NN     │ │ ├ table (ALG) ─────────────────────────────────────┤ │
│     Default group (sel) │ │ │☐40│Identity⇕120│Group⇕77│…│Del 40│→ 40 │ header h29│
│     New group     NN    │ │ │☐  │ text       │ text   │…│ 🗑    │ →   │ row h36   │
│                         │ │ └──────────────────────────────────────────────────┘ │
│                         │ │      ─────────────────────────────────────────        │
│                         │ │   «  ‹  1 [2] 3 … 10  ›  »                  [10 ▾]    │
└─────────────────────────┘ └──────────────────────────────────────────────────────┘
```

**영역 순서**
1. 라벨(선택한 위계 이름)
2. 툴바
3. 액션바(선택 시에만)
4. 테이블
5. 페이지네이션

**툴바 (h26, HORIZONTAL)**
- 좌측 `Total N`: `Body5` 10, `neutral-70`, gap 12.
- 우측 `right`(gap 6):
  - `search`(gap 8) = `dropdown status=normal` 34×24(검색 기준, 예: "All") + `input_text height=h36 default enabled` 284×24(돋보기 좌측 아이콘)
  - `button h26 secondary icon-left`(Filter)
  - `button_icon outlined h24`(⚙ 보기 설정)
  - `button h26 secondary icon-left`(Batch report / Download / Add)
- 어드민 화면에서는 `+ Add`가 primary h26이다(빈 항목 화면 스크린샷 근거).

**액션바**
- 로컬 `buttons | Property 1=Actionbar` 917×30, r8, fill `neutral-20`, pad 2/4, gap 12.
- 좌측: `checkbox_label`(Select all, 부분선택 시 indeterminate) + `|` + `N item(s) selected`(Body5).
- 우측 Slot(gap 4): `button h20 secondary icon-left` 여러 개. 그룹 사이에 `divider vertical`.

**테이블**
- grid auto-layout(ALG).
- 헤더 `element/cate_table_vertical`:
  - h29, `text size=14`, `align=center|left`, `type=text`(정렬 ⇕ 아이콘 포함)
  - 체크 열은 `type=check`
- 셀 `element/cell_table`:
  - h36, `♦ divider_topdown=true`
  - type: `text` / `icon+text`(상태 아이콘 + 텍스트) / `icon button`(🗑, →) / `check`
- 열 폭(1280 와이어): check 40, 첫 열 120, 일반 70~77, 아이콘 버튼 40.

**페이지네이션**
- `bottom_page indicator num=10` 917×41, pad 16.
- 구성: `« ‹ 1 … 10 › »`, 현재 페이지는 박스로 강조. 우측에 per-page `dropdown`(10).

### C-3. 카드 그리드 화면
- 화면: 캘리브레이션 스튜디오 디바이스 `캘리브레이션 스튜디오-디바이스-그리드` 622:26212.
- 좌측 `navigation_side`, 우측 패널 구성:
  - 상단: 액션바(Calibration / Calibration schedule | Acceptance test / Constancy test / Visual check / QA schedule)
  - 카드 그리드: 3열 × N행
  - 하단: 페이지네이션
- 카드는 로컬 `basic card_02` 257×238. 변형: `속성 1=active / disble / 베리언트3`.
  - 행1(h36, pad 8/8/4/8): `checkbox` + 우측 `button_icon h24` ×4(메모, 복사, 삭제, →상세)
  - 행2(h68, gap 20): 모델 이미지 56×50 + USB 연결 배지 + `Model name`/`Facility` 라벨·값
  - 행3(h36, gap 4): 상태 `button_icon h24` ×6(캘리브레이션/어셉턴스/콘스턴시/비주얼체크 + 워런티/업데이트 상태 아이콘)
  - 행4: key-value 5줄(Workstation, Map Location, Department, City, Serial number), 라벨 `neutral-40`, 값 `neutral-100`, Body5
  - 미연결 카드는 전체가 옅게(`disble`) 표시되고 일부 버튼이 비활성화된다.
- 헤더 우측에 `Task Queue 5`(button h26 secondary icon-left, 카운트 포함)가 있다.

### C-4. 위계형 정책 테이블 (보기/편집)
- 화면: `캘리브레이션-그룹스케줄`(11429:77167) / `-에딧`, `어셋매니저-그룹폴리시` / `-에딧`.

```
 tab row: [Device][Group schedule]        [⊞Calibration preset][⊞QA test preset] | [✎ Edit]
 header:  All / [Any exceptions ▾]  │ Calibration schedule ⓘ │ Constancy test schedule ⓘ
 ┌ Business 카드 (r8, stroke neutral-40) ───────────────────────────────────────┐
 │ ⓑ Business 01   40/10 │ policycell (text)          │ policycell (text)        │
 │ ┌ Workspace 카드 (inset) ─────────────────────────────────────────────────┐ │
 │ │ ⓦ Workspace A 20/10 │ group_policycell (follow: "↳ Business 01" 칩)    │ │
 │ │   ⓖ Group A-1 10/10 │ ↳ Business 01  (neutral-20 행 배경)               │ │
 │ │   ⓖ Group A-2 10/0  │ ⛓̸ Custom  Custom 2  ▭Monitor OSD  ⓨAnnually 08:00 … │ │
 └──────────────────────────────────────────────────────────────────────────────┘
```

- 위계 배지는 원형 아이콘이다: B = `#2b7fff` 파랑, W = `#ff8904` 주황, G = `#fdc700` 노랑. raw hex이고 변수에 바인딩되어 있지 않다.
- `{전체}/{예외}` 숫자는 Body5로 표시한다.
- 셀은 로컬 컴포넌트다: `policycell`(400×80), `groupschedule-cell`(400×36~87), `group_policycell`(238×40).
  - 상태 축: `text / text-t / follow / follow-edit / edit-default / edit-custom`
  - 링크 축: `link / unlink / follow`
- 편집 모드:
  - 헤더 우측이 `Cancel`(secondary) + `Save`(primary)로 바뀐다(추정, 스펙 2·3번).
  - 하위 레벨에 링크/언링크 아이콘이 생긴다.
  - 화면 이탈 시 `팝업-나가기`가 뜬다.

### C-5. 상세 화면
- 화면: 디바이스 디테일 `디바이스상세-인포-모니터` 622:26902 외 14종.

```
 [← h32]  Device details (18)                         Last update time … [⟳]
 ┌img 120x177┐┌ key-value 357x177 ┐ ┌img 174x177┐┌ key-value 357x177 ┐  (ALG gap 9)
 │ monitor   ││ Device type  Diag… │ │ PC        ││ Workstation Win11 │
 └───────────┘└───────────────────┘ └───────────┘└───────────────────┘
 ┌ navigation_side 120x549 ┐┌ content 907x549 (pad 0/4) ───────────────────────┐
 │ Information (selected)  ││ tab_group_line h36 [Monitor|Workstation]  [✎Edit][⊞Detail report] │
 │ Control                 ││ Serial number   [704NSDJFSM (disabled input)]      │
 │ Updates                 ││ Size            21.3"                              │
 │ Schedule                ││ ── divider ──                                      │
 │ History                 ││ Warranty(Hours) ⓘ  ✓ 25690  hours used             │
 └─────────────────────────┘│ Warranty(Date) ⓘ  ✓ [2025-08-18 📅] installed       │
                            └───────────────────── scroll bar ───────────────────┘
```

- 정보 key-value:
  - text content pad 12/16, gap 7~8
  - 라벨 `neutral-40`, 값 `neutral-100`, `Body5`
  - 라벨 옆에 정보 아이콘 + `tootip_text`
- 상세 서브 내비: `navigation_side` 120w의 `element/list_navi_item type=list`(전체 248회 사용).
- 보기 모드 값:
  - 편집 가능한 항목은 비활성 `input_text` 박스로 표시하고, 나머지는 plain text로 표시한다.
  - 날짜는 `Date input`을 쓴다.
- 섹션 구분은 `divider horizontal`.
- 상단 액션:
  - 탭 행 우측에 `Edit`(secondary h26 icon-left)와 보고서 버튼(`Detail report`, 진한 fill = primary)을 둔다.
  - 연결이 끊긴 디바이스는 Edit가 비활성화된다.
- 히스토리 탭(`디바이스상세-히스토리-*`):
  - 상단에 `radio_label` 기간 선택: Last 1 day / 7 days / 1 month / 3 months / 1 year / Custom + `Date input`(YYYY.MM.DD ~ YYYY.MM.DD)
  - 그 아래는 C-2 패턴: Issue History List + Total, 검색, 액션바(Export), 테이블, 페이지네이션

### C-6. 설정/폼 화면
- 화면: `세팅-시스템` 622:28389, `세팅-이메일알림`.
- 탭 행: `tab_group_line h48` + 우측 `Save` = `button h26 primary icon-left`(fill `neutral-70`).
- 패널: r8, pad 8/12, gap **12**.
- 폼 행 `form`(HORIZONTAL, gap **40**, h24~26):
  - `area_title` 200w: `element/base_form_title`(라벨 Body5 10 `neutral-100`, 필수표시 `*`는 `m-info-80-text`)
  - 컨트롤 200×24: `dropdown` / `input_text`
  - 부가: 버튼(`Download` secondary h26 icon-left), `alert/ic_info` 16 + `tootip_text position=left`(설명 칩)
- 이메일 알림:
  - `email form`(로컬 613×43, Chip 입력)
  - `switch_label` On/Off
  - `element/base_form_2 type=radio, orientation=horizontal`
  - Off이면 하위 설정을 dim 처리한다.

### C-7. 팝업 (모달)
- DS `popup`을 직접 쓰지 않는다(5회). 대부분 **title_popup + body + bottom_popup**을 수직으로 쌓은 로컬 COMPONENT다.
- 공통 컨테이너: VERTICAL gap 0, r **5.36**, fill `neutral-10`.

| 크기 등급 | 폭 | title_popup | body | bottom_popup | 예 |
|---|---|---|---|---|---|
| 확인(소) | 259~292 | `size=small` h33, pad 8 | pad 8/16/8/16, gap 7, 본문 Body5 10 `neutral-70` | h58, pad 16, gap 4, **버튼 2개 동일 폭** | 팝업-딜리트, 저장, 나가기, 리셋, 그룹명변경, 완료 |
| 폼(중) | 456~528 | `size=large` h53, pad 16/12 | form 행 라벨 100w + gap 40 + 컨트롤 200×24 | 동일 | 어드민 이미지/메뉴얼 추가, 프리셋 편집, 제너레이트코드 |
| 복합(대) | 538~656 | `size=small/large` | 섹션 제목(Body3) + radio + 표 + 체크박스 + tooltip 칩 + Schedule event time 행 | Cancel + Save | 팝업-캘리브레이션-Add 656×738, 어셉턴스테스트-Add |
| 결과 | 292 | "Inform" | `Result` 라벨 + `[Succeeded / Total] : [MM / NN]` + 실패 사유 bullet | OK 단일 primary | 팝업-완료-실패포함 |
| 로딩 | 282 | 없음 | `loading size=large` + "Loading..." | Cancel 단일 | 팝업-로딩 |
| 사이드 패널 | 246 × 전체 높이 | "Filter" + × | 섹션 헤더(Body6 `neutral-40`) + 그룹 제목 + `checkbox_label` 목록 + scroll bar | Reset(secondary) + Apply(primary) | 팝업-필터. 우측에서 슬라이드 인 |

- title_popup 우측에는 항상 `×`(common/ic_close)가 있다.
- 팝업 안의 리스트형 편집(그룹 설정): `tab_group_line`(Group edit / Permission settings) + 트리 목록(행마다 `(n)` 카운트 + `button_icon h16` 편집/삭제/추가) + 하단 `Close`.

### C-8. 빈 상태 / 오류 상태
- 빈 항목(`빈 항목` 7804:87054, 공통요소 9436:92835):
  - 스펙: *"표시 가능한 항목이 없는 경우, 테이블 형태의 리스트 또는 카드를 표시하지 않고 문구로 안내 'There is no item'"*
  - 패널 중앙에 굵은 텍스트 `There is no item.`을 둔다. 툴바(Total, 검색, Add)는 그대로 유지한다.
- 미연결 상태:
  - 정보 영역을 옅게 하고 가운데에 아이콘 + `Disconnected`를 표시한다(`디바이스상세-인포-모니터-디스커넥트`).
  - 카드는 `disble` 변형을 쓴다.
- 액션 불가 팝업 문구: *"The requested command cannot be executed due to connection problems. Please check the status of your network or individual devices."*
- 입력 오류: 입력 필드 바로 아래에 `{error message}` 텍스트(Body5, `Global/semantic/error/m-error-80-text`)를 둔다. 팝업-그룹명변경과 제너레이트코드에서 확인했다.

---

## D. 컴포넌트 사용 통계

- 집계 기준: 비중첩 인스턴스(인스턴스 내부의 인스턴스는 제외).
- 대상: `대표화면` 페이지 4,269개(종류 101). 시나리오 페이지(2,498개, 종류 139)는 문서용 주석과 화면 재사용이 섞여 있어 참고로만 표기했다.

### DS 라이브러리 컴포넌트 (대표화면 기준)

| 컴포넌트(셋) | 수 | 주요 variant |
|---|---|---|
| element/cell_table | 1026 | align=left,type=text ×410 / center,text ×256 / center,icon button ×151 (전부 `♦ divider_topdown=true`) |
| dropdown | 333 | status=normal ×224 / text ×66 / disabled ×28 |
| element/cate_table_vertical | 299 | text size=14, align=left ×198 / center ×92 / type=check ×6 |
| button_icon | 289 | style=outlined, hight=h24 ×213 / h16 ×50 / h32 ×18 (outlined만 사용) |
| element/list_navi_item | 248 | type=list ×238 / index ×9 / divider ×1 |
| button | 201 | h26 secondary icon-left ×96 / h20 secondary icon-left ×27 / h26 primary icon-left ×21. h33은 미사용 |
| input_text | 163 | height=h36 default: enabled ×111 / text ×21 / active ×15 |
| alert/ic_info | 158 | 정보 아이콘 |
| tootip_text | 111 | position=left,center ×53 / bottom,center ×28 / bottom,start ×13 |
| checkbox_label | 105 | status=normal, depth=1depth |
| radio_label | 102 | status=normal |
| divider | 65 | vertical ×39 / horizontal ×26 |
| Date input | 64 | enabled ×62 |
| tab_group_line | 59 | hight=h48,line,flex ×29 (페이지 탭) / h36,line,flex ×18 (서브 탭) / h36,line,full ×12 |
| element/bottom_popup | 52 | type=2 buttons, align=vertical ×31 / 3 buttons ×20 / 1 button ×1 |
| element/title_popup | 51 | size=small ×46 / large ×5 |
| scroll bar | 41 | vertical, 25% |
| side bar_open | 40 | state=open ×35 / close ×1 |
| footer | 39 | type=default |
| element/cate_table | 36 | 가로형 표 헤더(팝업 내 표) |
| element/base_form_2 | 35 | type=radio, horizontal |
| checkbox | 26 | unselected ×15 / selected ×9 / disable ×2 |
| cell_table (가로형) | 25 | direction=center,color=20 / left,color=0 (팝업 내 key-value 표) |
| navigation_side | 24 | 좌측 위계 트리 / 상세 서브 내비 |
| sub menu | 21 | status=selected, depth=1 depth (페이지 타이틀로 사용) |
| list_complex | 21 | focus/selected/disabled=false |
| element/list_item | 18 | default |
| bottom_page indicator | 13 | num=10 (pagination) |
| element/list_1depth_side bar | 10 | open, large/small |
| list_depth | 9 | type=icon, 2 depth / 1 depth selected |
| slider | 9 | case=icon (밝기) |
| icon_badge | 8 | large black/white (헤더 아이콘) |
| element/section_filter | 7 | 필터 섹션 |
| element/donut chart ×6, legend ×6, element/trailing_chart ×6, graph/line ×3, charts_bar/type1 ×3 | | 대시보드 차트 |
| tab_group_box ×6, tab_group_segment ×3 | | Connected/All 세그먼트 |
| switch ×4, switch_label ×4 | | 이메일 알림 On/Off |
| popup ×5 | | type=slot |
| drag & drop files ×2, loading ×1, loading/dot ×1, input_text_multi ×1, thumbnail_* ×3, element/header ×1, headings_main ×1, headings_sub ×1 | | |
| **미사용** | | toast, snackbar, notification box, step, progress bar, breadcrumb, avatar, badgedot(시나리오 2회), tag_text(시나리오에 `tag style=line` 14회) |

- 시나리오 페이지에만 있는 문서 컴포넌트: `annotation dot`(175), `annotation area`(50), `annotation box`(28), `annotation line`(15), `arrow_long`(25), `Doc Title`(54), `historytable`(78), `element/table_cell`(145: Des 표), `Omission line`(16), `diagram_cell`.

### 로컬(제품 전용) 컴포넌트

| 이름 | 종류 / 크기 | 설명 |
|---|---|---|
| `title bar` 552:67554 | COMPONENT 1280×40 | GNB. 앱명, 세션 타이머 + Extend, 알림/계정/앱 아이콘 |
| `side bar_open` 552:68101 | COMPONENT 180×643 | 로컬 사본(시나리오에서 7회). 화면은 대부분 DS 버전을 사용 |
| `buttons` 11557:110066 | SET 3종(`Default` 796×2, `Actionbar` 796×30, `0`) | 선택 액션바 |
| `basic card_02` 7856:89316 | SET `active / disble / 베리언트3` 257×238 | 디바이스 카드 |
| `policycell` 3093:56258 | SET 8종 400×60~80 | 그룹 스케줄 정책 셀(type=QA/calibration × status) |
| `groupschedule-cell` 11421:79407 | SET 12종 400×36~87 | 그룹 스케줄 셀(follow / text / edit) |
| `group_policycell` 11430:92293 | SET 6종 238×40 | 그룹 폴리시 셀(link / unlink / follow × edit) |
| `selection` 11421:85852 | SET none/default/custom 95×24 | 프리셋 Default/Custom 선택 칩 |
| `method_selection` 11421:87756 | SET monitor/client × Default/text 117×24 | 캘리브레이션 방식(Client app / Monitor OSD) 표시 |
| `email form` 11561:91577 | COMPONENT 613×43 | 다중 이메일 Chip 입력(정상 / 경고 / 최대 10개) |
| `ic-기간` / `ic-QA` | SET 18×18 (7종 / 5종) | 주기(D/W/M…) 및 QA 타입 아이콘 |
| 화면 COMPONENT 40개 + `팝업-*` 52개 | 1280×720~, 246~656 폭 | 시나리오 페이지에서 인스턴스로 재사용 |

---

## E. 조합 패턴

| 패턴 | 구성(정확한 컴포넌트/variant) | 간격·패딩 | 위치 |
|---|---|---|---|
| **P1 페이지 헤더** | 타이틀(`sub menu selected depth1` 또는 TEXT Body2 18) ↔ [`Last update time : …` Body5 + `button_icon outlined h16`(⟳)] (+ `button h26 secondary icon-left`) | 행 h37, 우측 gap 10 / 12, 좌우 space-between | 모든 페이지 |
| **P1' 상세 헤더** | `button_icon outlined h32`(←) + 타이틀 18 | gap 8 | 디바이스 상세 |
| **P2 페이지 탭 + 액션** | `tab_group_line hight=h48 line=true flex` ↔ 우측 `button h26 primary/secondary icon-left`, 그룹 사이 `divider vertical` | 행 h32 | 세팅, 디바이스 매니저, 캘리브레이션 스튜디오, 어드민 |
| **P3 위계 내비 패널** | `navigation_side`: `tab_group_segment`(Connected/All) → `search` 행 = `input_text h36(24)` + `button_icon h24`(⚙) gap 4 → 트리 `list_depth`/`list_complex`(오른쪽 NN 카운트) + `scroll bar` | pad 4, gap 4, 폭 220/253 | 대시보드, 디바이스 매니저, 캘리브레이션 스튜디오 |
| **P4 목록 툴바** | `Total N`(Body5) … [`dropdown`(검색 기준) + `input_text`(🔍)] gap 8 + `button h26 secondary icon-left`(Filter, 조건 적용 시 뱃지) + `button_icon h24`(⚙ 뷰 세팅) + `button h26 secondary icon-left`(Batch report / Download) | 우측 gap 6, h26 | 모든 목록 |
| **P5 선택 액션바** | `buttons/Actionbar`: `checkbox_label`(Select all) + `|` + "N item(s) selected" + `button h20 secondary icon-left` ×N(+`divider vertical`) | 30h, r8, fill neutral-20, pad 2/4, gap 12 / 버튼 gap 4 | 항목을 1개 이상 체크했을 때만 표시 |
| **P6 데이터 테이블** | 헤더 행 = `cate_table_vertical type=check`(40) + `type=text, text size=14`(정렬 ⇕); 바디 = `cell_table type=check / text / icon+text / icon button`(🗑 / → 40w) | 헤더 h29, 행 h36, 셀 구분선 topdown | 디바이스 목록, 히스토리, 어드민 |
| **P7 페이지네이션** | `bottom_page indicator num=10` + per-page `dropdown`(10/20/30/50) | 41h, pad 16, 위에 divider | 테이블/카드 하단 |
| **P8 확인 팝업** | `element/title_popup size=small`(타이틀 + ×) → body(Body5 본문) → `element/bottom_popup type=2 buttons`(**Cancel secondary h26 왼쪽 / 실행 primary h26 오른쪽**, 동일 폭) | 259w, 타이틀 h33 pad 8 / body pad 8/16 / 하단 h58 pad 16 gap 4 / r5.36 | 삭제, 저장, 나가기, 리셋, 덮어쓰기 |
| **P9 폼 행** | `form` = `area_title`(`element/base_form_title` 라벨 Body5 + `*`) + 컨트롤(`dropdown`/`input_text` 200×24) [+ 보조 버튼 + `alert/ic_info` + `tootip_text position=left`] | gap 40, 라벨 200w(팝업은 100w), 행 간 gap 12(패널) / 7(팝업) | 세팅, 폼 팝업 |
| **P10 정보 아이콘 + 툴팁** | `alert/ic_info` 16 또는 `button_icon h16` + `tootip_text`(left/bottom/top) | gap 4 | 설명이 필요한 라벨 옆 어디서나 |
| **P11 상태 셀** | `cell_table type=icon+text`: `alert/ic_ok`(초록 `m-success-60`) / 경고 삼각형(`m-warning-60`) / 오류 ×(`m-error-60`) / 회색 블랭크 + 값 | 셀 h36 | FW·App 버전, 워런티 |
| **P12 차트 카드** | 제목(Body4 12) + `element/trailing_chart type=dropdown` → `graph/line` / `charts_bar/type1` / `element/donut chart` + `legend` | 253×262, title h38 pad 13 | 대시보드 |
| **P13 사이드 필터 패널** | 팝업-필터: 섹션 헤더(Body6) / 그룹 제목(Body4) / `checkbox_label` 리스트 → `Reset`(secondary) + `Apply`(primary) | 246w, 전체 높이 | 목록의 Filter 버튼 |
| **P14 결과 / 진행 플로우** | 실행 → `팝업-로딩`(loading + Cancel) → `팝업-완료`(OK) 또는 `팝업-완료-실패포함`(Inform: Succeeded/Total + 실패 사유 목록 + OK) | 282~292w | 캘리브레이션 / QA 실행, 스케줄 저장, 로그 다운로드 |
| **P15 Key-Value 정보 블록** | 라벨(Body5 `neutral-40`) + 값(Body5 `neutral-100`), 2열, 행 간 gap 7 | 357×177, pad 12/16 | 상세 상단, 카드 본문 |

---

## F. 콘텐츠/UX 규칙

### 버튼 라벨과 순서
- 라벨은 모두 영문 Title case 동사 1~2단어다.
- bottom_popup 라벨 조합 집계(64개):

| 조합 | 수 |
|---|---|
| `Cancel` + `Save` | 26 |
| `Close` 단일 | 14 |
| `Cancel` + `Generate` | 7 |
| `OK` 단일 | 7 |
| `Cancel` 단일(로딩) | 2 |
| `Cancel` + `OK` / `Delete` / `Leave` / `Reset` / `Execute` | 각 1 |
| `Sign Out` | 1 |

- 순서 규칙: **취소(secondary)가 왼쪽, 확정(primary)이 오른쪽**이고 두 버튼은 같은 폭으로 꽉 채운다.
- 확인 전용 팝업은 `OK`(primary)를, 보기 전용 팝업은 `Close`(secondary)를 단일 버튼으로 쓴다.
- 파괴적 액션(Delete, Leave)도 별도 error 색 없이 primary 또는 secondary를 그대로 쓴다.
- 툴바·액션바 버튼은 모두 아이콘 + 라벨(icon-left=on)이다: `Filter`, `Batch report`, `Move`, `Delete`, `Export`, `Download`, `Edit`, `Save`, `+ Add`, `Task Queue 5`.

### 팝업 문구 예
- `Do you want to delete selected item(s)?`
- `Do you want to save?`
- `Do you want to leave this page? / Changes you made may not saved`
- `Unable to delete — The preset is currently in use and cannot be deleted.`
- `An item with the same content as the information you entered already exists. Do you want to overwrite it?`

### 피드백 방식
- **toast와 snackbar는 사용하지 않는다(0회).** 모든 결과는 모달 팝업으로 알린다.
- 흐름: 로딩 → 완료(OK) / 실패 포함 결과(Inform).
- 성공 후 별도 알림을 띄우지 않는 경우도 명시되어 있다. 예: 코드 갱신 성공 시 *"팝업이나 알림을 띄우지 않음 (Expiration 칼럼의 값이 바뀜)"*.

### 오류
- 입력 하단에 인라인 텍스트로 표시한다(`m-error-80-text`). 예:
  - `The code you generated already exists for that workspace`
  - 이메일: `Remove or correct the invalid email addresses.`
  - 이메일: `You can add up to 10 email addresses.`
- 잘못된 이메일 Chip은 Warning 색으로 표시한다.

### 빈 상태
- `There is no item.` 문구만 표시하고 테이블이나 카드는 렌더하지 않는다.

### 비활성(disabled) 규칙
- 필수 입력이 채워지기 전에는 `Save`를 비활성화한다(어드민 추가, 프리셋 편집, 그룹 스케줄 편집).
- 단일 워크스페이스/그룹을 선택했을 때만 `List export`를 활성화하고, 나머지 경우는 dimmed 처리한다.
- 미연결 디바이스: Edit, 로그파일 다운로드, 속성 복사, 스케줄 액션 버튼을 비활성화하고 카드를 옅게 표시한다.
- 보기 모드에서는 체크박스와 드롭다운이 비활성이고, Edit를 누르면 활성화된다(`dropdown status=disabled` 28회).
- 붙여넣기 모드에서는 리스트와 액션바를 제외한 모든 UI를 비활성화한다. 원본 아이템도 비활성화한다. ESC 또는 Cancel로 해제한다.
- Off 스위치의 하위 설정은 dim 처리한다.

### 테이블 규칙
- 밀도: 헤더 29px, 행 36px(1280 기준, FHD 환산 약 43/54 — 추정).
- 초기 정렬: Identity 알파벳 오름차순. 어드민 목록은 Updated time 내림차순이며 이 열만 정렬할 수 있다.
- 호버 시 잘린 텍스트와 정상 텍스트 모두 툴팁으로 전문을 보여준다.
- 열 너비는 드래그로 조절하고, 보기 설정 팝업에서 열 표시 여부와 순서를 편집한다.
- 페이지네이션:
  - 이중 화살표: 첫/마지막 페이지
  - 단일 화살표: 10페이지씩 이동
  - 페이지당 10/20/30/50, 기본 10
- 액션바 액션 버튼은 2줄까지 표시할 수 있다.
- 검색 드롭다운의 기본값은 `Serial number`다. 화면별 기준 목록이 정의되어 있다.

### 상태 기억
- 그리드/리스트 뷰와 퀵 필터는 마지막 상태를 저장한다(다음 접속 시 복원).

### 날짜·시간 표기
- `Last update time : 2025-05-27  23:55`(YYYY-MM-DD HH:mm)
- 설정 기본 Date format `YYYY-MM-DD`
- Date input placeholder `YYYY.MM.DD`, 기간 `YYYY.MM.DD ~ YYYY.MM.DD`
- 알림 `MM/DD/YYYY HH:MM:SS`
- 스케줄 `On the day 18 (2026-09-18)`, `on the 1st Wednesday (2025-09-03)`
- 시각은 4자리 24시간제이고 기본값은 `08:00`이다.
- 타임존 `(UTC+09:00) Asia/China` 또는 `(GMT+09:00) Seoul`
- 주기: Daily / Weekly / Bi-weekly / Monthly / Quarterly / Semi-annually / Annually
- 워런티: `{int} hours used`, `YYYY-MM-DD installed`
- 퍼센트는 소수점 없이 반올림한다.
- 지역 시간 기준: 히스토리는 설치 지역의 local 타임으로, 스케줄은 Time basis GMT 기준으로 표시한다.

### 권한별 표시
- Region admin: 전체 표시 + Administration 메뉴.
- Business admin: 해당 Business만 표시.
- Property admin / Monitoring: 해당 Property만 표시하고, 상위 Business는 비활성 상태로 표시한다.
- Monitoring 권한은 신규 코드 발급 버튼이 보이지 않는다.

### 위계
- Business > Workspace(Property) > Group 구조이며, 그룹 하위로 4단계까지 추가해 총 7단계다.
- 내비게이션에서 중복 선택이 가능하다. 단, 디바이스 매니저에서는 교차 선택이 불가능하다.
- 잘린 라벨은 호버 시 툴팁으로 전문을 보여준다.

### 상태 아이콘 체계 (Policy)
- 워런티(날짜) 5단계: >24 / 12–24 / 6–12 / ≤6개월 / 만료
- 워런티(시간) 3단계: 20–100% / 0–20% / 만료
- 업데이트: 최신 / 최신 아님
- 캘리브레이션·QA: Passed / Passed (6 months ago) / Unknown / Failed
- 값이 없을 때(Null, N/A)는 블랭크 아이콘을 쓴다.
- 호버 시 `항목 : 상태` 툴팁을 보여준다. 예: `Acceptance test : Passed`

### 세션
- 로그인 후 약 60분이 주어지고, Extend를 누르면 60분으로 재시작한다.

---

## G. 실제 바인딩된 색상·텍스트 스타일

- 집계 범위: `대표화면` 섹션 노드 31,132개(인스턴스 내부 포함).

### Fill 변수 (텍스트 제외)

| 변수 | 수 | 용도(관찰) |
|---|---|---|
| Global/neutral/m-neutral-10 | 2503 | 카드/패널/팝업/버튼 배경(흰색 계열) |
| Global/neutral/m-neutral-40 | 1941 | 아이콘·구분선·비활성 |
| Global/neutral/m-neutral-20 | 1815 | 사이드바, 액션바, 선택 행, 지도 카드 |
| Global/neutral/m-neutral-70 | 1288 | title bar, primary 버튼(와이어 톤), 차트 막대 |
| Global/neutral/m-neutral-100 | 806 | 아이콘(검정) |
| Global/semantic/success/m-success-60 | 166 | OK 상태 아이콘, USB 연결 배지 |
| Global/primary/m-primary-70 | 163 | 체크박스 선택(틸), 라디오 |
| Global/semantic/error/m-error-60 | 38 | 실패 아이콘 |
| Global/semantic/infomation/m-info-60 | 24 | 정보 |
| Global/secondary/m-secondary-20 / warning-60 / warning-20 / primary-90 / neutral-15 | 8 / 8 / 6 / 3 / 2 | |
| Layer/Layer/table/color-layer-table-cate-normal, Divider/table/color-divider-table-cate | 2 / 2 | 테이블 헤더 계층 토큰 |

### Stroke 변수
| 변수 | 수 |
|---|---|
| m-neutral-40 | 1298 |
| m-neutral-20 | 632 |
| m-neutral-70 | 252 |
| m-neutral-100 | 184 |
| m-primary-70 | 60 |
| m-primary-90 | 60 |
| m-neutral-15 | 22 |

### Text fill 변수
| 변수 | 수 | 용도 |
|---|---|---|
| m-neutral-70 | 3462 | 기본 본문 |
| m-neutral-100 | 1430 | 강조·값·타이틀 |
| m-neutral-40 | 530 | 라벨·placeholder·비활성 |
| m-info-80-text | 200 | 필수 `*`, 링크성 |
| m-neutral-10 | 192 | 진한 배경 위 텍스트 |
| m-error-80-text / m-error-60 | 9 / 9 | 오류 |

### 텍스트 스타일
- 텍스트 5,967개 중 98% 이상(5,854개)이 스타일에 바인딩되어 있다.

| 스타일 | 수 | 실측 |
|---|---|---|
| Body/Body5 | 4076 | 10px Regular. 본문·라벨·버튼·셀 대부분 |
| Body/Body4 | 814 | 12px Medium. 카드/차트 제목, 섹션 소제목 |
| Body/Body3 | 551 | 15px Medium. 앱명, 패널 라벨, 사이드바 메뉴 |
| Body/Body6 | 352 | 8px. 필터 섹션 헤더, 보조 |
| Body/Body2 | 44 | 18px Medium. 페이지 타이틀 |
| Body/Body3B | 9 | 15px Bold |
| Heading/Heading3 | 4 | |
| Body/Body1 | 3 | |
| Heading/Heading2 | 1 | |

- 화면 UI에는 Heading 계열을 거의 쓰지 않는다. 페이지 타이틀도 Body2 18이다.
- 스타일 미바인딩 텍스트 113개의 주요 조합: Inter Bold 10 ×38(위계 배지 B/W/G 문자), Google Sans Flex Bold 4.47/10 ×40(주기 아이콘), Noto Sans Bold 9.38 ×16, Noto Sans Bold 80 ×11(문서용 대형 숫자).

### 미바인딩 raw hex (빈도순, `*` = 인스턴스 내부)

**Fill**
| 값 | 수 | 용도 |
|---|---|---|
| `#ffffff` | 102 | 화면 루트·footer·trailing_chart 배경 |
| `#000000`* | 89 | |
| `#f9f9f9` | 78 | |
| `#d9d9d9` | 58 | 이미지 placeholder |
| `#fdc700` | 18 | G 배지 |
| `#000000` 10% | 14 | |
| `#ff8904` | 12 | W 배지 |
| `#ed255b`* | 9 | 주석 분홍 |
| `#2b7fff` | 8 | B 배지 |
| `#fdfdfd` | 8 | |
| `#1c1b1f` | 9 | Material 아이콘 |
| `#f5f5f5` | 13 | |
| `#354056` | 6 | |
| `#ff6614` | 5 | |

**Stroke**
| 값 | 수 |
|---|---|
| `#bcbcbc` | 987 (주로 cell_table 내부 구분선) |
| `#555555` | 36 |
| `#a1a1a1` | 35 |
| `#ed255b` | 6 |
| `#848c9d` | 5 |

**Text**
| 값 | 수 |
|---|---|
| `#555555`* | 39 |
| `#717182` | 14 |
| `#000000` | 17 |
| `#ffffff` | 11 |

- 위계 배지(B/W/G)의 파랑·주황·노랑은 DS 변수가 아닌 raw 값이다. 구현할 때는 primary / warning / secondary 계열 토큰으로 매핑해야 한다(추정).
- 와이어 단계라 primary 버튼 fill이 `m-neutral-70`(회색)이다. 실제 GUI에서는 `m-primary-*`로 바뀔 가능성이 높다(추정).
