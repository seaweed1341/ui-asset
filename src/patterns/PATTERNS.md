# 화면 패턴 규칙

세 화면설계서를 분석해 DS 컴포넌트가 실제로 어떻게 조합되는지 정리하고, 그 조합을 `src/patterns/`에 코드로 옮겼다.

| 플랫폼 | 화면설계서 | 버전 | 코드 |
|---|---|---|---|
| 웹앱 (관리 솔루션) | LCS Medical Server | 1.2.1 (26.11.17) | `web-app.tsx` |
| 웹 대시보드 (클라우드 포털) | LGBC 3.0 Dashboard | 1.0.10 (26.11.17) | `dashboard.tsx` |
| Windows 데스크톱 앱 | LG gram Claw | 1.0.2 (26.11.19) | `desktop.tsx` |
| 세 플랫폼 공통 | | | `shared.tsx` |

분석 원본(노드 ID, 사용 횟수, 원문 규칙 포함)은 `docs/figma-analysis/`에 있다. 아래에는 코드로 옮긴 결론만 적는다.

---

## 1. 세 플랫폼 비교

| 항목 | 웹앱 (LCS) | 대시보드 (LGBC) | 데스크톱 (gram Claw) |
|---|---|---|---|
| 기준 크기 | 1280×720 와이어 = FHD 1920×1080의 2/3 | 1280 고정 폭, 높이 가변 | 창 1280×720, 최대화 가능 |
| 반응형 | 사이드바 접힘에 따라 콘텐츠 1036↔1169 | 브레이크포인트 없음. 400% 확대 시 400px 레이아웃 | 메인 컬럼만 유동 (padding 40 유지) |
| 상단 | `title bar` dark (neutral-70, h40) | `header_console` light (neutral-10, 40 + GNB 34) | 커스텀 타이틀바 app (neutral-20, h40) + 최소화/최대화/닫기 |
| 내비게이션 | 좌측 `side bar` 180 / 47 | 상단 GNB(`button h26 text` ×7). 사이드바 없음 | 좌측 240 / 42 + 우측 패널 50 / 320~504 |
| 본문 배경 | 흰색, 패널 r8 | 회색(neutral-20) 위 흰 카드(1240) | 흰색. 사이드바·타이틀바는 neutral-20 |
| 페이지 제목 | Body2 18 | Body2 18 | Heading3 28 + Body3 부제 (탭 화면) |
| 주 사용 버튼 | h26 secondary + 왼쪽 아이콘 | h26 secondary | h26 secondary, 온보딩 h33 |
| 피드백 | 모달 팝업만 (토스트 0회) | 정의 없음 (새로고침 실패도 알림 없음) | 토스트(하단 중앙 / 오른쪽 아래), 입력창 위 배너, 대화 안 오류 카드 |
| 빈 상태 | "There is no item." 문구만 | 회색 패널 + 제목 + 설명 (+ 라이선스 버튼) | 아이콘 + 문구 + 버튼 |
| 주 텍스트 | Body5 10px (68%) | Body5 10px | Body4 12px + Body5 10px |
| 고유 규칙 | 세션 60분 + Extend, 위계 7단계, 권한별 표시 | 위젯 최대 5행, 수량 클릭 → 필터된 목록, Auto Refresh | 트레이 메뉴, Ctrl+Enter 전송, 우측 패널이 열리면 좌측 접힘 |

---

## 2. 공통 규칙 (`shared.tsx`)

세 파일에서 예외 없이 반복된다.

1. **팝업 버튼 순서**: 왼쪽 취소(secondary), 오른쪽 실행(primary). 두 버튼은 같은 폭이다. 파괴적 액션(Delete, Leave)도 버튼 색을 바꾸지 않는다. → `ConfirmPopup`
2. **버튼 하나인 팝업**: 확인 전용은 실행 버튼 하나(OK), 보기 전용은 닫기 하나(Close). 폭은 210. → `ConfirmPopup single="confirm" | "close"`
3. **팝업 구조**: `title_popup` small(h33, 12px Bold) + 본문(10px, p 8/16) + `bottom_popup`(p16, gap4, h26). 폭은 300이 기본이다. dim 위 화면 정중앙에 띄운다. → `Popup`
4. **비활성**: 투명도 40%. 필수 입력이 채워지기 전에는 Save/다음을 비활성화한다. 연결이 끊기거나 라이선스가 없으면 해당 액션을 비활성화하고 영역을 흐리게 표시한다.
5. **인라인 오류**: 입력 바로 아래 10px `error-80-text`. → `FormRow error`, `TextField error`
6. **정보 아이콘 + 툴팁**: 라벨 옆 `ic_info` 16 + `tootip_text`. 잘린 텍스트에 hover하면 전문을 보여 준다. → `InfoTip`
7. **표**: 헤더 26(neutral-20, 10px Bold), 행 36, 셀 구분선 neutral-40 50%. 체크 열과 아이콘 버튼 열은 40. → `DataTable`
8. **Heading 스타일은 화면 UI에서 거의 쓰지 않는다**. 웹은 제목도 Body2 18이다. 데스크톱 탭 화면만 Heading3 28을 쓴다.
9. **Primary 버튼은 회색(neutral-70)**이다. teal(primary-70)은 체크·선택·태그·차트에만 쓴다. 세 파일 모두 같다.
10. **날짜 표기** → `formatDate`

    | 용도 | 형식 |
    |---|---|
    | LCS 갱신 시각 | `YYYY-MM-DD HH:mm` |
    | LGBC 헤더 | `YYYY.MM.dd hh:mm:ss` |
    | LGBC 표 | `YYYY-MM-DD hh:mm:ss` |
    | gram 목록 | `now · 16m · 1hr · 2days · YYYY-MM-DD` |
    | 날짜 입력 | `YYYY.MM.DD` |

---

## 3. 웹앱 패턴 (`web-app.tsx`, LCS)

```
┌ WebTitleBar 40 (neutral-70) ─────────────────────────────────────────┐
│ [≡] App title                [⏱ 00:00 Extend] | [알림][계정][솔루션] │
├ SideBar 180/47 ┬ 32 ┬ main (p 12/0, gap 8) ─────────────────┬ 32 ┤
│ neutral-20     │    │ PageHeader 37: 제목 18 ↔ Last update ⟳ │    │
│ 항목 h40       │    │ PageTabs 32: tab h48 ↔ 페이지 액션     │    │
│                │    │ ListPage / 패널(r8)                    │    │
├ WebFooter 37 ──┴────┴────────────────────────────────────────┴────┤
```

| 컴포넌트 | 규칙 |
|---|---|
| `WebAppShell` | 타이틀바 + 사이드바(접힘 토글) + 콘텐츠 + 푸터 |
| `PageHeader` | 상세 화면만 왼쪽에 ← 뒤로(h32)를 둔다. 오른쪽에 Last update time + 새로고침 h16을 둔다 |
| `PageTabs` | 페이지 탭(h48 flex) 오른쪽 끝에 페이지 액션을 둔다(예: Save는 primary, Edit는 secondary) |
| `ListToolbar` | 왼쪽에 `Total N`. 오른쪽에 [검색 기준 ▾ + 검색] [Filter] [⚙] [주 액션]. 주 액션은 secondary + 아이콘이고, 추가(+ Add)만 primary |
| `SelectionActionBar` | 1개 이상 체크했을 때만 나타난다. Select all(부분 선택 시 indeterminate) + "N item(s) selected" + h20 버튼들 |
| `ListPage` | 라벨 → 툴바 → 액션바 → 표 → 페이지네이션 순서. 결과가 없으면 표 없이 "There is no item."만 보여 준다 |
| `Pagination` | 이중 화살표는 처음/마지막 페이지, 단일 화살표는 10페이지씩 이동. 페이지당 10/20/30/50, 기본 10 |

추가 규칙:
- 피드백은 팝업으로만 준다. 흐름은 실행 → 로딩 팝업(Cancel) → 완료(OK) 또는 실패 포함 결과(Succeeded/Total + 실패 사유).
- 보기 모드에서는 컨트롤을 비활성으로 둔다. Edit를 누르면 활성화되고, 헤더가 Cancel + Save로 바뀐다. 저장하지 않고 나가면 확인 팝업을 띄운다.
- 정렬, 뷰(그리드/리스트), 퀵 필터는 다음 접속 때 복원한다.

---

## 4. 대시보드 패턴 (`dashboard.tsx`, LGBC)

```
┌ ConsoleHeader 74: title bar 40 (neutral-10) + GNB 34 ─────────────────┐
├ DashboardBody (bg neutral-20, p 12/0/24/0) ───────────────────────────┤
│  body_title 50: "Dashboard" 18          [Dashboard Template | 서브]   │
│  ┌ 흰 카드 1240 (좌우 20, gap 8) ──────────────────────────────────┐  │
│  │ WorkspaceBar 76                                                 │  │
│  │ Widget: widget_title 56 + StatRow(서브카드 gap 12)              │  │
│  │ Widget …                                                        │  │
│  └─────────────────────────────────────────────────────────────────┘  │
```

| 컴포넌트 | 규칙 |
|---|---|
| `Widget` | 제목 15px, 오른쪽에 헤더 액션(View All은 onlyicon ">", 관리는 h26 secondary). 상태는 `ready` / `empty` / `no-license`. 라이선스가 없으면 헤더 액션을 비활성화하고 "CPQ Portal" 버튼을 보여 준다 |
| `StatPanel` / `StatRow` | 서브카드는 p12, r8, 1px neutral-40, 그림자 없음. 폭이 좁아지면 줄바꿈해 세로로 쌓인다(400% 대응) |
| `KpiGroup` | ● 라벨 / 값(15 Bold) + ">". 셀 사이에 세로 구분선. 수량을 누르면 필터가 적용된 목록 페이지로 이동한다 |
| `FilterChips` | button h26. 선택은 primary, 미선택은 secondary. 라벨 + 카운트(Bold) |
| `GroupContainer` | 회색(neutral-20, r8) 그룹 + "Total NN" + 흰 카드 나열 |
| `WorkspaceBar` | 범위 선택 + Last Update Time + 새로고침 + Auto Refresh(기본 OFF, 주기 기본 1분) |
| 위젯 표 | `DataTable maxRows={5}`. 첫 열은 링크(">"), 마지막 열은 아이콘 버튼 40 |

추가 규칙:
- 목록 위젯은 최대 5개를 최신순으로 보여 준다.
- 용어: Awaiting Approval Devices, Succeeded/Failed, View All.
- 상태 표기는 "Online (20)"처럼 괄호 안에 개수를 적는다.
- 빈 값은 `--`로, 0건은 `0`으로 적는다.

---

## 5. 데스크톱 패턴 (`desktop.tsx`, gram Claw)

```
┌ DesktopWindow: 타이틀바 40 (neutral-20)  [ic] LG gram Claw   [_][□][×] ┐
├ DesktopSideNav 240/42 ┬ main (p40, fill) ────────────────┬ 우측 50/320 ┤
│ header(≡) / 메뉴 ×4   │ 채팅 or TabPage(764, Heading3)   │ » 패널      │
│ divider / 그룹 ×3     │                                  │             │
│ 설정                  │                                  │             │
└───────────────────────┴──────────────────────────────────┴─────────────┘
```

| 컴포넌트 | 규칙 |
|---|---|
| `DesktopWindow` | 창 모서리는 직각, 그림자 없음, 1px 테두리. 창 제어 버튼은 Windows 순서(최소화, 최대화, 닫기). 타이틀바는 drag 영역, 버튼은 no-drag |
| `ThreePane` | 우측 패널은 기본으로 접혀 있다. 우측 패널을 열면 좌측 패널이 자동으로 접힌다 |
| `DesktopSideNav` | 메뉴 h40(12px), 접는 그룹 헤더 22(10px Bold + (N)), 항목 h28. 설정은 맨 아래 |
| `TabPage` | p 56/48, 콘텐츠 폭 764. 제목 28 + 부제 15, 오른쪽에 주 액션 h26 primary |
| `SettingsCard` + `FormRow layout="setting"` | 카드는 r12, p18. 행은 라벨 12 + 도움말 10과 오른쪽 switch/dropdown |
| `GroupedList` | 그룹 라벨 + 박스(r8). 행 h41. hover하면 체크박스와 more 메뉴가 나타난다 |
| `OnboardingLayout` + `Stepper` | 위 64, gap 34. 단계 표시 → 제목 → 카드 608 → [이전 text] ↔ [다음 primary 210] |
| `DesktopToast` | 하단 중앙: 즉시 피드백. 오른쪽 아래: 예약 작업 결과 |

추가 규칙:
- 트레이 메뉴는 열기 / 새 대화 / 종료.
- 온보딩 중에 창을 닫으면 "나가기" 확인 팝업을 띄우고, 다시 실행하면 마지막 단계부터 이어서 진행한다.
- 키보드: Ctrl+Enter로 전송. 선택 패널은 Esc / ↑↓ / 숫자 / Enter로 조작한다.
- OS 연동: 파일 브라우저, "파일관리자에서 보기", 드래그 앤 드롭 첨부, 부팅 시 자동 시작(기본 Off), 데스크톱 알림(기본 On).
- 드롭다운은 hover로 열린다. 토글은 클릭 즉시 반영된다.

---

## 6. 화면설계서에서 확인이 필요한 점

- **와이어 축척(LCS)**: 1280 와이어를 FHD 기준 ×1.5로 해석한다(추정). 이 경우 버튼과 입력 높이도 비례로 커지는지 GUI 단계에서 확인이 필요하다.
- **변수 미바인딩 값**:
  - 표 구분선 `#bcbcbc`(neutral-40과 같은 값) → 코드에서는 `--color-divider-table`로 처리했다.
  - 흰 배경 `#ffffff` → neutral-10으로 처리했다.
  - 창 테두리 `#555555` → neutral-70으로 처리했다.
  - LCS 위계 배지(B `#2b7fff` / W `#ff8904` / G `#fdc700`)는 DS에 해당 토큰이 없어서 구현하지 않았다.
- **Primary 버튼 색**: 와이어 단계라 회색이다. GUI 단계에서 teal로 바뀔 수 있다. 바뀌면 `Button` 한 곳만 고치면 된다.
- **정의되지 않은 상태**: LGBC는 로딩·오류 상태를 정의하지 않았다. gram Claw는 온보딩과 모델 카드가 DS 토큰을 가장 많이 벗어나 있다.
