# LG gram Claw (그램클로) 화면설계서 분석 — Windows 데스크톱 앱

- 대상 파일: `UX_IT_LG-gram-Claw_v1.0.2_261119` (fileKey `kKzkPtfU2gPLgCUAKCDa6k`). 읽기 전용으로 분석했으며 파일은 수정하지 않았음.
- 분석 범위: 주로 `한글 KOR 시나리오` 페이지를 봤음. ENG 페이지는 같은 구조를 그대로 옮긴 사본이고, `작업영역`은 마스터 컴포넌트와 와이어프레임 초안을 모아 둔 곳.
- 제품 성격: 클라우드 LLM(Gemini/OpenAI/Claude)과 PC용 로컬 모델을 함께 쓰는 **AI 에이전트 채팅 앱**. 구성은 새 대화, 히스토리, 모델, 예약 태스크, 설정이며 Claude Desktop/ChatGPT 데스크톱 앱과 비슷한 구조. 설계서는 회색 톤 **와이어프레임 수준**이고, 시각 스펙은 별도 GUI 문서를 참조하라고 명시돼 있음.

---

## A. 인벤토리

### A-1. 페이지
| 페이지 | id | 최상위 노드 수 | 성격 |
|---|---|---|---|
| 한글 KOR 시나리오 | 100:30895 | 85 | **실제 설계서(기준)** |
| 영문 ENG Scenario | 4023:53460 | 84 | KOR과 좌표·구성이 같은 영문판. 영문 문구가 길어 일부 프레임 높이만 다름(예: History 1080→1361) |
| 작업영역 | 0:1 | 433 | 작업 공간. 화면 마스터 컴포넌트 51개, 레퍼런스 캡처 이미지(image 48~5381 다수), 와이어프레임 초안(`*-wireframe`, `screen-*`) |

### A-2. KOR 페이지 최상위 프레임 분류 (85개, 모두 1920×1080 슬라이드이며 일부는 세로로 늘어남)
| 분류 | 개수 | 프레임 |
|---|---|---|
| 표지/문서 | 11 | Cover 1, History 4(개정 이력), Overview 1, Information Architecture 1, Subtitle 2, Index 1, End 1 |
| 체크리스트 | 2 | 자체 Checklist |
| 섹션 간지(`Doc_Text`만 있음) | 8 | 제너럴, 온보딩, 뉴챗, 대화, 모델, 스케줄태스크, 세팅, 기타 |
| 떠 있는 주석 인스턴스 | 6 | `세팅` 이름의 24×24 Badge/annotation (프레임 밖에 남은 것) |
| **화면 설계 슬라이드** | **58** | 제너럴 규칙 5, 사이드 패널 1, 온보딩 11, 뉴챗 18, 대화(히스토리) 5, 모델 7(토큰사용량 포함), 스케줄태스크 8, 세팅 2, 기타(Tray) 1, 에러케이스 2 |

- 슬라이드 공통 틀: 상단에 `Doc Title`(Depth=depth1/2/3, breadcrumb 형태로 "LG gram Claw / 온보딩 > 약관 동의") 1920×121 → 왼쪽에 앱 창 → 오른쪽에 `table`/`Des` description 표(번호 1, 1-1, 2…). 화면 위에는 빨간 `annotation dot`(24×24)과 `annotation area/box`를 올림. 오른쪽 위에 `Tag`(Type=Modified ×25 / New ×4)와 "v 1.0.2 | 26.11.19 + 변경 내용"을 둠.
- 슬라이드 안에 그려진 **앱 창 수: 59개**(`title bar` 인스턴스 기준). 52개는 1:1 크기, 7개는 축소 썸네일(사이드 패널 플로우 654×368/427, 에러케이스 667/801/817 폭).

### A-3. 창(Window) 크기 — 데스크톱 타깃 사이즈
| 용도 | 크기(px) | 횟수 | 비고 |
|---|---|---|---|
| **메인 창(새 대화/채팅)** | **1280×720** | 12 | 타이틀바 40 + 본문 680. 기준 해상도 |
| 메인 창(좌측 패널 접힘 + 우측 패널 열림) | 1097×720 | 3 | 42 + 551 + 504 |
| 메인 창 변형(첨부 등) | 1280×687 | 1 | |
| **온보딩 창** | 1280 × 699/775/790/816/851/875/883 | 13 | 마스터는 `0환영합니다.` 등 **1280×960** 컴포넌트 16종. 슬라이드에서는 내용 높이만큼 잘라서 보여 줌 |
| **탭 화면(히스토리/모델/예약/설정)** | **1100 폭** × 667~1475 | 22 | 사이드바 240 + 메인 860. 높이가 720을 넘는 것은 스크롤 페이지 전체를 펼쳐 그린 것. 설정 2/2는 물결 생략선(`Omission line`)으로 위쪽을 잘라 표시 |
| 스플래시/충돌 방지 | 약 1045×639(Frame 3) | 2 | 타이틀바 1043×40 |
| 팝업(텍스트형) | **300×129 / 300×143** | 다수 | `popup|type=text` |
| 삭제 팝업 | 350×129 | 2 | 로컬 `삭제팝업` |
| 스케줄 편집 다이얼로그 | 384×678 | 1 | 로컬 프레임 `Edit task dialog` |
| 기타 팝업 | 531×159(충돌 안내), 612×368(토큰 한도 설정) | 각 1 | `popup` 인스턴스 |
| 토스트 | 185~421 × 33 (하단 중앙), 421×67 (오른쪽 아래) | 14 | |
| Tray 메뉴 | 약 131×62 (3항목) | 1 | Windows 트레이 컨텍스트 메뉴 |

> 창 크기 결론: **기준 창 1280×720**이며 최대화 버튼이 있음. 같은 앱 화면이 1280 폭과 1100 폭 두 가지로 그려져 있음. 사이드바(240)는 고정이고 메인 영역이 990 → 860 → 551로 **유동적으로 줄어드는** 구조(추정: 창 리사이즈를 허용하고 메인 컬럼이 fluid).

---

## B. 앱 셸 / 레이아웃 골격

### B-1. 창 크롬 (모든 창 공통)
- 외곽: **직각(corner radius 0), 그림자 없음, 1px stroke `#555555`**(변수에 바인딩되지 않은 raw 값). 실제 OS 창 테두리를 흉내 낸 것.
- **커스텀 타이틀바**: DS `title bar|type=app`(52/59회), 높이 **40**, fill `Global/neutral/m-neutral-20`(#efefef), auto-layout H, padding 0/16/0/16.
  - 왼쪽 `unit`(gap 4): 앱 아이콘 `alert/ic_null` 16×16 + "LG gram Claw" 텍스트 15px(Body3), `m-neutral-70`.
  - 오른쪽 `elements`(gap 10): `icon_badge|type=large, color=white` 24×24 ×3 → `common/ic_popup_min`, `common/ic_popup_max`, `common/ic_close`(최소화/최대화/닫기, Windows 순서).
  - 설명 1번: "OS에서 제공하는 앱 상단바 영역, 아이콘 및 이름 표시".
- 앱 배경: `m-neutral-10`(#ffffff). 사이드바와 타이틀바는 `m-neutral-20`.

### B-2. 메인 창 와이어프레임 (1280×720, 새 대화 기본 상태) — node `158:20751`
```
┌──────────────────────────────── title bar 1280×40 (neutral-20, p 0/16) ───────────────────────────────┐
│ [ic16] LG gram Claw (15)                                                       [_] [□] [×] (24, gap10)│
├───────────────┬──────────────────────────────────────────────────────────────────────────────┬────┤
│ left-sidebar  │ main-chat 990×680  (padding 40/40/40/40)                                     │ ws │
│ 240×680       │                                                                              │ 50 │
│ neutral-20    │   central-greeting 910×451 (V, gap 24, 가운데 정렬)                          │    │
│ 오른쪽 1px    │        [ic_artwork_dummy 64×64]                                              │[»] │
│ neutral-40    │        "좋은 아침이에요" 28 Bold, neutral-100                                │ 18 │
│ V gap12 pb12  │        "무엇을 도와드릴까요?" 15 Body3, neutral-70   (text-group gap 8)       │    │
│               │                                                                              │ p16│
│ header 29     │   selector row 910×27 (H gap12, 오른쪽 정렬)                                 │    │
│ menu 4×40     │     [Desktop ▾ 121] | [AI Model ▾ 182] [Query level ▾ 121]                   │    │
│ divider       │   bottom-container 910×122 (V gap 4)                                         │    │
│ 고정됨(N)     │   ┌ prompt-input 910×104 (p12, gap8, neutral-10, 1px neutral-40, r0) ┐      │    │
│ 예약 대화(N)  │   │ input-content 886×40                                             │      │    │
│ 최근(N) ×6    │   │                                   [📎24] (gap12) [send btn 32]   │      │    │
│ …             │   └──────────────────────────────────────────────────────────────────┘      │    │
│ 설정 240×40   │   "AI가 생성한 답변은 정확하지 않을 수 있습니다." Body5 10, 가운데             │    │
└───────────────┴──────────────────────────────────────────────────────────────────────────────┴────┘
```
- `screen-body` 1280×680: auto-layout H, gap 0 → `left-sidebar`(240) + `main-chat`(fill, 990) + `workspace-sidebar`(50, 접힘).
- 메인 컬럼 콘텐츠 폭은 910(990−40×2). 1097 창에서는 471로 줄어듦. 즉 **padding 40을 유지한 채 폭만 늘었다 줄었다 함**.

### B-3. 좌측 패널 `left-sidebar` (로컬 COMPONENT_SET, 사용 35회)
| variant | 크기 | 설명 |
|---|---|---|
| Property 1=Default | 240×680 | 펼침 (기본값) |
| Property 1=Variant2 | **42**×680 | 접힘(아이콘만 표시), 6회 사용 |

펼침 상태의 내부 구조(위→아래, gap 12, padding-bottom 12, fill neutral-20, 오른쪽 stroke 1 neutral-40):
1. `element/header|state=open, size=small` 240×29: `common/ic_menu` 18 (접기/펼치기) + 오른쪽 `arrow/ic_arrow_left` 14.
2. `menu` 240×160 (padding 0/12): `element/list_1depth_side bar|open/close=open, status=…, text-size=large` 216×40 ×4. 항목은 새 대화, 히스토리, 모델, 예약 태스크이고 아이콘은 `alert/ic_info` 18, 라벨은 Body4 12. 선택 항목은 bg `neutral-10`. "모델" 오른쪽에 `tag_text|size=small, status=primary` 30×16("12%", 토큰 사용 %)를 붙임.
3. `divider|orientation=horizontal` 240×1 (neutral-40).
4. `conversations-divider` ×3 (padding 0/12/12/12): 고정됨 / 예약 대화 / 최근. 그룹 헤더(높이 22, gap 8)는 `arrow/ic_arrow_down` 14 + (`common/ic_location` 또는 `common/ic_time`) 14 + 라벨 Body5 10 **Bold** + "(N)". 항목은 `list_depth|type=checkbox, depth=1 depth, state=default|selected` 216×28, gap 4, Body4 12. 선택 항목 fill neutral-10. 예약 대화는 오른쪽에 실행 횟수 숫자를 표시.
5. 맨 아래 `설정` = `element/list_1depth_side bar` 240×40.

### B-4. 우측 패널 `workspace-sidebar` (로컬 COMPONENT_SET, 16회)
| variant | 마스터 크기 | 내용 |
|---|---|---|
| close | 50×680 | `arrow/ic_arrow_double_right` 18만 있음, padding 16. **기본값** |
| workspace | 320×680 | `tab_group_segment`(워크스페이스/애셋) + 경로 Body5 + 숨김 폴더 `switch` + 새로고침/파일 브라우저 열기 + 폴더 트리(`list_depth type=icon depth 1/2`) |
| asset | 320×680 (인스턴스는 504) | 세그먼트 탭 + `input_text|h36` "애셋 검색..." + `tab_group_box`(전체/이미지/파일/링크) + 빈 상태 "Assets가 없습니다." |
| file | 320×680 | 파일 상세: 파일명·경로, 미리보기 영역, "파일관리자에서 보기" |

- 규칙: "우측 패널 기본은 접힘. **우측 패널이 열리면 좌측 패널(1번)은 닫힘**." 1097 창의 구성이 42 + 551 + 504.
- 오른쪽 패널은 fill neutral-10, 왼쪽 stroke neutral-40, padding 16, gap 16.

### B-5. 탭 화면 골격 (1100 창: 히스토리/모델/예약 태스크/설정)
```
┌──────────────────── title bar 1100×40 ────────────────────┐
├──────────┬────────────────────────────────────────────────┤
│ left-    │ MainContent 860 (V, gap 24, p 56/48/56/48)     │
│ sidebar  │   Heading3 28 "히스토리"                       │
│ 240      │   Body3 15 부제 (neutral-70)   ← 제목 묶음 gap 8│
│          │   [보조 컨트롤 행: 검색 / 전체 N/10 / 정렬]    │
│          │   [콘텐츠 블록: 764 폭, 블록 간 gap 24]        │
└──────────┴────────────────────────────────────────────────┘
```
- 콘텐츠 폭은 **764**(860−48×2). 오른쪽 패널은 쓰지 않음.
- 페이지 헤더 오른쪽 끝에 주 액션을 둠. 예: `button|h26, style=primary, icon-left=on` "+ 태스크 추가".

### B-6. 온보딩 창 골격 (1280 폭)
```
┌──────────────────────── title bar 1280×40 ────────────────────────┐
│ Welcome wireframe (V, gap 34, padding-top 64, fill neutral-20)     │
│            ●─●─●─④─⑤   (custom Step 32×32, connector 34)           │
│            Title 28 Bold / Subtitle 14~15 (gap 8)                  │
│        ┌──────── card 608~610 (white, r12, 1px #c9c9c9, p32~36) ┐ │
│        │  카드 제목 18 / 리스트·입력·안내 박스 (gap 12~24)      │ │
│        └─────────────────────────────────────────────────────────┘ │
│        [이전] text h33  ─────────────── [다음] primary h33 210     │
└────────────────────────────────────────────────────────────────────┘
```
- 사이드바 없이 가운데 1열 구조. Footer는 608 폭, H, 양 끝 정렬(space-between).
- 첫 화면(환영)은 단계 표시가 없고 [다음] 버튼만 있음. 이어하기 상태에서는 "다음"(text) + "설정 이어하기"(primary).

### B-7. 레이아웃 적응 규칙 (스펙에서 확인된 것)
| 상태 | 좌측 | 메인 | 우측 |
|---|---|---|---|
| 기본(1280) | 240 | 990 (콘텐츠 910) | 50 (접힘) |
| 좌측 접힘 | 42 | 나머지 | 50 |
| 우측 패널 열림 | 42 (자동 닫힘) | 551 (1097 창) | 504 (마스터 320) |
| 탭 화면(1100) | 240 | 860 (콘텐츠 764) | 없음 |

- 창 레벨의 반응형 브레이크포인트 정의는 없음. 최소 창 크기 정의도 없음(SRS 참조 대상으로 추정).

---

## C. 화면 유형(템플릿)

### C-1. 스플래시 / 실행 가드
- **스플래시**(100:31346): 빈 창 가운데에 로고 애니메이션 IMG 64. 변경 이력: "퓨론 로고가 아닌 로딩 사용".
- **gram Chat 충돌 방지**(3879:57678): 창 전체에 dim을 깔고 가운데에 `popup` 531×159(제목 "LG gram Claw", 본문 3줄, 버튼 1개 "앱 종료"). 규칙: "LG gram Chat 앱이 실행 중이면 실행 즉시 종료 안내 팝업".
- **Tray 메뉴**(286:56161): 트레이 아이콘 위에 항목 3개 "LG gram Claw 열기 / 새 대화 / (구분선) 종료". 동작은 Open(실행/재호출), New Chat(실행 후 새 대화로 이동), Exit(앱 종료).

### C-2. 온보딩 (11개 슬라이드, IA: Welcome → User Agreement → Local Model Download → AI Agent Settings → Persona → Finish)
| 단계 | 슬라이드 | 핵심 구성 |
|---|---|---|
| 0 환영 | 100:31395 | Heading 28 + 설명 + 큰 카드(IMG) + [다음]. 창 닫기(X)를 누르면 "나가기" 팝업 |
| 시작 전 준비 | 3857:22051 | 카드 안에 안내 2개(로컬 모델 다운로드, 클라우드 AI 연결: Body3 제목 + Body4 본문, 아래 구분선 neutral-40) + 회색 안내 박스(#f5f5f5, r12) |
| 1 약관 동의 | 100:31376 | 스텝 5개, `element/bottom_popup` 행에 "모두 선택"(checkbox) 박스, "LG전자 이용 약관" 제목 18, `checkbox` + 라벨 + `button|h20 secondary` "더보기", [이전]/[동의] |
| 로컬 모델 | 208:33360 | 다운로드 버튼(`button|h33 text, icon-left`) → 진행 상태 "로컬 모델 다운로드 중 58%"(`loading/stroke` 14) → 완료. 오류 시 "앱 종료" 팝업 |
| AI 모델: 클라우드 연결 | 100:31502 | 공급자 카드 3개(Google Gemini/Open AI/Claude, 546×56, r10, 선택 시 2px 검정 테두리). [다음]은 1개 이상 선택해야 활성화 |
| API 키 입력 | 100:31604 | 공급자 행 + `tag_text`(비활성/활성화) + 가이드 박스(neutral-20 r8, `button|h26 secondary icon-left` "Google AI Studio") + "리셋" + 비밀번호 입력(눈/복사 아이콘) + `button|h33 secondary` "연결 테스트"(입력 전 disable) |
| AI 모델 선택 | 2474:44751 | `dropdown` + `popup_list` 546×260 |
| 토큰 사용량 설정 | 3712:24061 | `input_text` 숫자 + `switch` ×2(앱 내 알림, 사용 중지) |
| 페르소나 | 100:31475 | 2×2 선택 카드 4종(간결한 실무형 기본값) |
| 로딩 | 3879:56767 | 로컬 모델이 아직 다운로드 중일 때 대기 화면 |
| 설정 완료 | 2273:43828 | 소개 이미지 + [시작하기] → New Chat. 이후 실행 시 온보딩을 다시 띄우지 않음 |

- 단계 표시: DS `step`이 아니라 **로컬 그리기**. 원 32×32, 완료는 `#626262` 채움 + "✓", 현재/이후는 흰 원 + 회색 테두리 + 숫자 14, connector 34×1.
- 버튼 규칙: 왼쪽 `button|h33, style=text` "이전"(48×33), 오른쪽 `button|h33, style=primary` 210×33 "다음/동의/시작하기". 조건을 채우기 전에는 `status=disable`.

### C-3. 새 대화 / 채팅 (18개 슬라이드)
- **기본(빈 대화)**: B-2 와이어프레임 참조. 인사말은 시간대별로 다름(2~5시 이른 새벽입니다 / 6~10시 좋은 아침이에요 / 10~17시 안녕하세요 / 17~20시 좋은 저녁입니다 / 20~2시 늦은 시간까지 수고 많으십니다).
- **입력 영역 선택기**: 드롭다운 3개. 워크스페이스(`dropdown|status=normal` 121×27, "Desktop") | 세로선 16 | AI 모델(`dropdown|status=selected` 182×24) | 추론 레벨(121×27, 모델에 따라 숨김). 모두 **hover하면 열림**.
- **신규 사용 체험 카드**(2273:44167): 입력창 위에 805×187 카드 영역(명언 카드 만들기 / 세계 명소 알아보기 / 데일리 브리핑 예약하기). 접기와 "다시 보지 않기"를 제공하고, 완료한 카드는 체크로 표시.
- **대화 중**:
```
                                         ( {채팅 내용} )  ← 사용자: button h33 secondary(pill r100), 오른쪽 정렬
 [IC36] {AI 답변 내용} Body3 15                          ← AI: alert/ic_null2 36 + 텍스트, gap 10
 [IC36] Worked for N.Ns ▾ (Body4 12)                     ← 작업 내역(기본 접힘), 펼치면 단계/시간/코드
        {AI 답변 내용}
        [↻20] [⧉20] (gap 12)                             ← 최신 답변 아래에 항상 표시, 그 외는 hover 시
```
  메시지 블록 간 간격은 24(central-greeting gap 24).
- **생각 중**: 로딩(퓨론) 아이콘 + "생각하고 있어요." + "Working N.Ns". 전송 버튼이 정지 버튼(`audio & video/ic_stop`)으로 바뀜. 좌측 목록의 해당 대화에는 깜빡이는 dot.
- **선택 패널**(2145:45468, "모달이 아니므로 선택 패널로 부른다"): 입력창 자리에 고정 패널. 구성은 위험도 dot(보통 주황 / 위험 빨강) + "{액션}을 실행할까요?" + "자세히 ▾" + 번호 선택지(1 예 / 2 예, 이번 세션 동안 / 3 예, 항상 허용 / 4 아니요, 선택 행은 짙은 회색 bar + 흰 글자) + 결과 요약 박스 + 키 가이드 "Esc 취소 · ↑↓ 이동 · 1-2 선택 · Enter 확인" + 닫기 X(=아니요).
- **파일 첨부**: 입력창 안 썸네일 타일(로딩/파일 아이콘 + 파일명, hover 시 X) + "Attachments (3/50)". 대화창에 이미지는 최대 10장 그리드, 그 외 파일은 리스트 행으로 표시.
- **토큰 사용량 경고/제한**: 입력창 위에 경고 배너(warning-10 bg, warning-60 stroke, ⚠ + 문구 + `button|h26 secondary icon-right` "토큰 사용량 제한 설정 >" + X). 제한에 걸리면 X 없이 고정되고 채팅창이 막힘.
- **스크롤**: 최신 답변으로 가는 플로팅 `button_icon` 33×32, `scroll bar`는 스크롤 중에만 보임.
- **클라우드 모델 미설정**: 채팅창 막힘 + 안내 문구 + `button|h33 secondary icon-right` "모델 설정".

### C-4. 히스토리 (5개)
```
MainContent (p56/48, gap24)
 Heading3 "히스토리" / Body3 "지난 대화 기록을 찾아보고 관리합니다."
 input_text|h48 764×33  [🔍 대화 검색]
 [☐ 모두 선택] (checkbox 16 + Body4)      ← 체크 시 "N개 선택됨 | [취소] [선택 삭제]" 액션바, sticky
 고정됨 (Body4 라벨, gap 8)
 ┌ list box r8, 1px neutral-40 ───────────────────────────┐
 │ {Conversation}                              [pin 16]   │ row 764×41, p12/16
 └────────────────────────────────────────────────────────┘
 오늘 / 어제 / 이번주 / 과거  (각 그룹 동일, 행 사이 divider)
   오른쪽 메타: now · 16m · 1hr · 2days · 2026-08-28 / [예약 · 3] tag / (분기됨)
```
- hover하면 왼쪽에 체크박스, 오른쪽에 `common/ic_more`가 나타남. more를 누르면 로컬 `dorpdown` 134 폭(r8, 흰색, 항목: 고정/고정 해제, 제목 편집, 대화 분기, 삭제).
- 빈 상태: 아이콘 + 문구 + "새 대화" 버튼.

### C-5. 모델 (7개: 모델 관리, 목록 펼침, 0개, 로컬 다운로드, API 키 편집, 토큰 사용량, 토큰 한도 설정)
- `tab_group_line|hight=h48, line=true, type=flex` 197×32 (모델 관리 / 토큰 사용량, Body3 15).
- 섹션 제목 Body2 18(클라우드 모델 / 로컬 모델 / 기능별 모델), 섹션 내부 gap 12, 섹션 아래 padding 24.
- **대표 모델 슬롯**: 762×52, r8, **1px primary(#1d828f, raw)**. `dropdown|status=text` + `button|h26 secondary icon-left` "편집". 편집하면 "저장"으로 바뀜.
- **공급자 슬롯**: 762×104, r10, p12/16, gap 26. 공급자명 14 + `tag_text|size=small, icon=on`(활성화/확인 필요/비활성화) + `button|h26 secondary` "API 키 관리". 하위 행 "^ 연결한 모델 (2/10)" + `button|h26 secondary icon-left` "+ 모델 추가".
- **기능별 모델 리스트**: r12, 1px neutral-40. `FeatureRow` 762×74(p16/24, 제목 Body2 + 설명 Body4) + 오른쪽 `dropdown` 172. 행 사이 `divider`. 맨 아래 주석 Body4 "변경 사항은 다음 대화부터 적용됩니다."
- **토큰 사용량 대시보드**: 안내 박스 → 월간 사용량 카드(24% + progress bar + "1,232,000 / 5,000,000" + `button|h20` "토큰 사용량 제한 설정") → `tab_group_segment`(7 days/30 days/90 days) → 통계 카드 3개 → 차트(DS `element/bar_chart`, `element/axis_line_chart`, `element/bar_count_chart`, `legend`, `tootip_text|position=left`, `graph/bar`, `charts_bar/type1`).

### C-6. 예약 태스크 (8개)
```
 Heading3 "예약 태스크" / Body3 부제                       [+ 태스크 추가] (h26 primary icon-left)
 전체 2 / 10 (Body5)                                      [다음 실행이 빠른 순 ▾] (dropdown 108×24)
 ┌ Task card 764×139 (p16/14/12/16, gap10, r10, 1px neutral-40, bg neutral-10) ┐
 │ 일일브리핑 Body3 15                                          (switch 31×17)   │
 │ ● 매일 14:11 · {model id}  Body5                                             │
 │ ▌ "오늘 원/달러 환율 요약"  (2px primary-70 bar + Body5)                      │
 │ ───────────── divider neutral-40 ─────────────                              │
 │ 최근 실행: 지금 ● / 📅 다음 실행: 오후 02:11 ●   [☰ 실행 기록 3] [⋯ 24]      │
 └──────────────────────────────────────────────────────────────────────────────┘  card gap 16
```
- 일시정지 카드는 bg `neutral-20`이고 "다음 실행"을 표시하지 않음. 실패 카드는 주의 색 ticker(dot).
- 스케줄 편집 다이얼로그 384×678(p20/18/18/18, gap 16, r8, scrim `#17181a` 53%): 제목+닫기 → 폼(태스크 이름 input / 프롬프트 multi input / 모델 dropdown / divider / 스케줄 탭 4칸(매일/매주/매월/간격) + 시:분 dropdown + 다음 실행 안내 / divider / "저장 후 바로 실행" switch) → 오른쪽 아래 [취소][저장] h26.
- 빈 상태: 아이콘 + 도움말 + 추천 카드.

### C-7. 설정 (2개 슬라이드, IA: General / Memory / Security and Permissions / App Information)
- 한 페이지를 세로로 스크롤. 카드 764 폭, **r12, p18, gap 12, 1px neutral-40**.
- 카드 헤더: 아이콘 24 + Body2 18("일반", "메모리", "보안 및 승인", "앱 정보").
- 설정 행: 라벨 Body4 12(neutral-100) + 도움말 Body5 10(neutral-70), 세로 gap 3 + 오른쪽 `switch` 31×17. 드롭다운 행은 라벨 + `dropdown` 387 폭.
- 데스크톱 관련 설정: **테마(시스템/라이트/다크, 기본 시스템)**, **시스템 부팅 시 자동 시작(기본 Off)**, **데스크톱 알림(기본 On, "앱이 백그라운드에 있을 때 작업이 완료되면 알림")**.
- 보안 및 승인: 기본 승인 모드 dropdown(실행 전 승인 요청 / 안전한 도구 승인(기본) / 모든 도구 자동 승인 → 경고 팝업) + 도구 자동 승인 규칙 접기 그룹(항상 허용됨 / 현재 세션 전용, 행마다 🗑).
- 앱 정보: 이름·설명·제작자·버전 + `button|h20` "오픈 소스 라이선스 보기", "약관 보기" → 팝업.

### C-8. 팝업 / 다이얼로그
```
popup|type=text 300×129 (fill neutral-10, 1px neutral-40, r0)
┌ element/title_popup|size=small 300×33 (p8, gap8) ─────────────┐
│ 제목 Body4 12 neutral-100                            [× 14]   │
├ body 300×38 (p12)  본문 Body5 10 neutral-70, 가운데 정렬 ─────┤
├ element/bottom_popup|type=2 buttons 300×58 (p16, gap4) ───────┤
│ [ 취소  secondary h26 132 ] [ 실행 primary h26 132 ]          │
└───────────────────────────────────────────────────────────────┘
```
- 배치 규칙(DS General UI 슬라이드): "화면 정중앙, 최상위 레이어. 팝업 아래 레이어는 오버레이(dim) 뒤". dim 예시는 `m-neutral-70` 사각형, 스케줄 다이얼로그는 `#17181a`@0.53.
- 버튼이 하나인 경우: secondary "확인" / "닫기" / "앱 종료". v1.0.2부터 일부 팝업은 오른쪽 위 X를 없애고 하단 "닫기"로 통일(예약 실행 기록 팝업).

### C-9. 알림 / 피드백 (에러케이스 2개 슬라이드)
| 종류 | 위치 | 컴포넌트/스타일 | 용도 |
|---|---|---|---|
| 하단 중앙 토스트 | 창 하단 중앙 | `toast` 185~376×33, r4, neutral-20 bg, drop shadow(blur 10, y 3.35), p8/12, Body4 12 | 복사 완료, 연결 성공, 되돌림, 분기, 파일 첨부 실패(warning-10 bg + ⚠) 등 |
| 하단 오른쪽 토스트 | 오른쪽/아래 20px | 421×67, success-10 bg, success-60 stroke, ic_info + 2줄 텍스트 + `button|h20` "보기" + ✕ | 예약 작업 실행 성공/실패/일시정지 |
| 입력창 위 배너 | 프롬프트 바로 위 | warning-10/60, ⚠ + 텍스트 + 버튼 + ✕ | 토큰 사용량 경고(50/70/90%)/제한 |
| 대화 안 오류 카드 | 답변 자리 | 제목 + 본문 + 안내 한 줄 + [닫기] + (재시도 가능 시)[다시 시도] | 일시적인 오류 / 확인이 필요합니다 / 요청을 처리하지 못했습니다 / 상황별 고정 |
| 대화 안 일반 말풍선 | 답변 자리 | AI 답변과 같은 모양 | 반복 상한 도달, 보안 정책으로 저장 실패 등 "멈춤 또는 이어가기" |
| 팝업 | 가운데 | `popup` | 파괴적 확인, 연결 실패, 앱 종료 유도 |
| OS 알림 | Windows | (화면 없음) | 설정의 "데스크톱 알림"으로 정의만 됨 |

---

## D. 컴포넌트 사용 통계

### D-1. 앱 창 내부(59개 창 루트 아래, 직접 배치된 인스턴스만 집계) — 실제 UI 구성
| 컴포넌트(set) | 개수 | 주요 variant |
|---|---|---|
| **button** | 120 | `h26, secondary, icon-left=on` ×30 / `h26, secondary` ×20 / `h33, text` ×15 / 그 밖에 h33 primary·secondary, h20 secondary, status disable·pressed |
| **dropdown** | 85 | `status=normal` ×58 / `selected` ×17 / `text` ×10 |
| **button_icon** | 57 | `outlined, h24` ×25 / `outlined, h32` ×15 / `filled, h32` ×15(전송) / onlyicon h16·h24 |
| **title bar** | 52 | `type=app` 만 사용 |
| **divider** | 46 | `orientation=horizontal` |
| left-sidebar [로컬] | 35 | Default ×29 / Variant2(접힘) ×6 |
| list_depth | 24 | `type=checkbox, depth=1, state=default` ×16 / `type=icon, depth=1` ×8 |
| tag_text | 21 | `size=small, status=primary, icon=on` ×11 / `icon=off` ×6 / `size=medium` ×4 |
| switch | 20 | `on, normal` ×14 / `off, normal` ×4 / `off, disable` ×2 |
| workspace-sidebar [로컬] | 16 | close ×13 / workspace / asset |
| input_text | 13 | `h36, default, enabled` ×8 / `h48` ×5 |
| checkbox | 13 | `unselected, normal, Default` ×11 / indeterminate / selected |
| element/list_1depth_side bar | 11 | `open, normal, large` ×9 / `open, selected, large` ×2 (사이드바 내부까지 세면 226) |
| tab_group_line | 8 | `h48, line=true, flex` ×6 / `h36, full` ×2 |
| element/bottom_popup / toast / popup_list | 4 / 4 / 1 | |
| element/badgedot | 5 | `size=large, state=primary` |
| tab_group_segment / radio_label / element/dot_pagination | 3 / 3 / 3 | |
| element/header | 2 | `state=open, size=small` (사이드바 내부까지 45) |
| 차트류 | — | charts_bar/type1 2, legend 2, graph/bar 6, element/bar_chart·axis_line_chart 등(내부 다수) |
| input_text_multi / thumbnail_1:1 / scroll bar | 1 / 1 / 2 | |
| 아이콘 | — | alert/ic_null2(36 아바타) 18, file/ic_file 15, alert/ic_ok 11, alert/ic_null 11, ic_artwork_dummy(일러스트 자리) 10, arrow/ic_arrow_up·down, common/ic_calendar·refresh·close·more·location·time, edit/ic_copy |

### D-2. 페이지 전체(KOR, 5,231개 인스턴스, 120종). 위 표에 없는 것만
- 사이드바 내부를 포함한 누적: `list_depth` 446, `element/list_1depth_side bar` 226, `alert/ic_info` 246, `arrow/ic_arrow_down` 226, `icon_badge|type=large, color=white` 177(타이틀바 창 버튼), `common/ic_popup_min/max` 각 59, `dropdown` 124, `button` 209(h26 secondary ×46 최다), `popup` 16(`type=text` ×13 / `type=slot` ×3), `element/title_popup|size=small` 20, `element/bottom_popup|2 buttons, vertical` 30, `toast` 14, `loading/stroke` 7, `tootip_text` 2, `element/rail_slider`/`handler_slider` 각 1(General UI 예시).
- **문서 템플릿 컴포넌트(앱 UI 아님, 원격)**: `cell_table` 966, `element/table_cell` 248, `annotation dot` 221(`color=filled, flip=off, rotate=off` ×203), `Doc Title` 66(depth2 ×49), `table` 58, `historytable` 54, `Tag` 29(Modified 25/New 4), `annotation area` 14, `annotation box` 13, `arrow_long` 8, `Omission line` 5, `cursor` 1, `diagram_cell` 2.
- **사용되지 않은 DS 컴포넌트**: `pagination`, `breadcrumb`, `navigation_side`, `side bar_open`(작업영역에만 1개), `step`, `progress bar`(로컬로 그림), `snackbar`, `tooltip`(대신 `tootip_text`), `notification box`, `cards`, `avatar`, `headings_main/sub`, `title bar-mobile`, **gram Only 그룹 전체(gram_fileselect, gram_popup, gram_search_open, gram_tutorial, .그램링크_아바타)**.

### D-3. 로컬(파일 내부) 커스텀 컴포넌트 — 작업영역 페이지, 51개
| 이름 | 크기 | 설명 |
|---|---|---|
| `left-sidebar` (SET) | 240×680 / 42×680 | 앱 좌측 내비게이션(펼침/접힘). DS `element/header` + `element/list_1depth_side bar` + `list_depth` 조합 |
| `workspace-sidebar` (SET, 5 variants) | 50 / 320×680 | 우측 패널(close/workspace/asset/file/Variant5) |
| `뉴챗` | 1280×720 | 메인 창 전체(타이틀바+3단) |
| 온보딩 화면 16종 (`0환영합니다.` ~ `7나중에 설정하기`, `4. AI 모델 설정 / …` 공급자별 활성/비활성, GitHub Copilot 로그인 전/후, LGE Lite LLM) | 1280×960 | 온보딩 단계별 전체 창 |
| `대화-기록있음 / 대화-호버 / 대화-체크 / 대화-대화없음` | 1100×978 / 718 / 718 / 667 | 히스토리 상태 |
| `모델-0개 / 모델-2개 / 모델-추가 / 모델-추가중 / 모델-편집 / 모델-편집-취소 / 로컬 다운로드 중 / 토큰사용량` | 1100×795~1392 | 모델 탭 상태 |
| `스케줄태스크` 외 8종(활성/일시정지/실패/예약0/조건에맞는0/태스크만들기/스케줄히스토리) | 1100×736 | 예약 태스크 상태 |
| `세팅 / 세팅-MCP연동 / 세팅-MCPJSON편집 / 세팅-훅추가 / 세팅-로그 / 메모리 / 메모리-편집` | 1100×786~1911 | 설정 계열. MCP/훅/로그/메모리는 v1.0.2 IA에서 빠짐(작업영역에만 있음) |
| `dorpdown` (오타 그대로) | 134×114 | more 메뉴(흰 bg, r8, p0/8, 30px 항목) |
| `삭제팝업` | 350×129 | 삭제 확인 팝업 |
| `workspace-dropdown` | 158×87 | 워크스페이스 드롭다운 펼침(경로 + 워크스페이스 선택…/워크스페이스 패널 열기) |
| `모델ID` | 576×48 | 모델 ID 행 |

- 컴포넌트로 만들지 않고 프레임으로 반복한 것: `Task card`, `ConversationRow`, `FeatureRow`, `Environment card`(610 폭 온보딩 카드), `Setup progress`(스텝), `prompt-input`, `Edit task dialog`, 오른쪽 아래 `toast` 프레임.

---

## E. 조합 패턴

| 패턴 | 구성 | 수치 | 사용처 |
|---|---|---|---|
| **P1 창 셸** | `title bar|type=app` + `screen-body`(H) | 40 + 680, 외곽 1px #555555, r0 | 모든 창 |
| **P2 3단 채팅 레이아웃** | `left-sidebar` + `main-chat` + `workspace-sidebar` | 240/42 · fill · 50/320~504 | 새 대화 |
| **P3 사이드바 메뉴 그룹** | `element/header` + `element/list_1depth_side bar`×4 + `divider` + 접는 그룹 ×3(헤더 22 + `list_depth` 28, gap 4) + 하단 설정 | padding 0/12, gap 12 | 모든 메인 화면 |
| **P4 프롬프트 컴포저** | (선택기 행: `dropdown`×3 + 세로선, 오른쪽 정렬, gap 12) + `prompt-input`(p12, gap 8, stroke neutral-40) + 액션(`file/ic_file` 24 + `button_icon|filled,h32`) + 고지 문구 Body5 | 910×104, 블록 gap 4 | 채팅 |
| **P5 AI 메시지 블록** | `alert/ic_null2` 36 + [Worked for ▾ Body4] + 답변 Body3 + 액션 아이콘 20(refresh/copy, gap 12) | 아바타-본문 gap 8~10 | 채팅 |
| **P6 사용자 메시지** | `button|h33, secondary`(pill) 오른쪽 정렬 | 높이 33 | 채팅 |
| **P7 페이지 헤더** | Heading3 28 + Body3 15 (gap 8) [+ 오른쪽 `button|h26 primary icon-left`] | MainContent p56/48, gap 24 | 히스토리/모델/예약/설정 |
| **P8 그룹 리스트 박스** | 그룹 라벨 Body4 + 박스(r8, 1px neutral-40) 안에 행(p12/16, 41 높이) + 오른쪽 메타(시간/아이콘/tag) | 라벨-박스 gap 8 | 히스토리 |
| **P9 설정 카드** | 카드(r12, p18, gap 12, stroke neutral-40) → 헤더(아이콘 24 + Body2 18) → 행(라벨 Body4 + 도움말 Body5 + 오른쪽 `switch`/`dropdown`/`button h20`) | 행 세로 gap 3 | 설정 |
| **P10 공급자 슬롯** | 이름 14 + `tag_text`(상태) … 오른쪽 `button|h26 secondary` / 하위 접기 행 + "+ 모델 추가" | r10, p12/16 | 모델, 온보딩 API |
| **P11 태스크 카드** | 제목 Body3 + 메타 Body5 + `switch` / 프롬프트(2px primary bar) / divider / 푸터(실행 정보 + pill 버튼 + `button_icon|outlined,h24` more) | p16/14/12/16, gap 10, r10, 카드 간 16 | 예약 태스크 |
| **P12 확인 팝업** | `popup|type=text` = `element/title_popup|small` + body + `element/bottom_popup|2 buttons`(secondary 왼쪽 + primary 오른쪽, h26) | 300 폭, p16, 버튼 gap 4 | 삭제/초기화/되돌리기/나가기/다시 시도 |
| **P13 온보딩 단계 카드** | 스텝 표시 → Heading 28 + 부제 → 흰 카드(608~610, r12, p32) → Footer(text "이전" ↔ primary 210 "다음") | 블록 gap 34, 위 64 | 온보딩 전 단계 |
| **P14 상태 배지** | `tag_text|size=small, icon=on` + 상태색 | 16 높이, r100 | API 키(활성화/확인 필요/비활성화), 예약 실행 표시 |
| **P15 more 메뉴** | `common/ic_more` hover → 로컬 `dorpdown` 134 | 항목 30 높이 | 히스토리 행, 사이드바 대화, 태스크 카드 |
| **P16 세그먼트 + 필터** | `tab_group_segment`(2~3칸) + `input_text|h36` + `tab_group_box` | 26 높이 | 우측 패널, 토큰 기간 |

---

## F. 콘텐츠 / UX 규칙

### F-1. 버튼 문구와 순서
- 문구는 2~4자 동사/명사 위주: 다음, 이전, 동의, 확인, 취소, 삭제, 저장, 닫기, 초기화, 리셋, 되돌리기, 다시 시도, 앱 종료, 계속 진행하기, 나가기, 시작하기, 설정 이어하기, 연결 테스트, API 키 관리, + 모델 추가, + 태스크 추가, 지금 실행, 실행 기록 N, 변경, 더보기, 편집, 보기. 약관 단계는 v1.0.2에서 "다음"을 "동의"로 바꿈.
- **확인/취소 순서**: 팝업은 **왼쪽 = 취소(secondary), 오른쪽 = 실행(primary)**. 같은 폭(132)으로 나란히, 또는 다이얼로그 오른쪽 끝에 작게 [취소][저장]. 온보딩 하단은 왼쪽 "이전"(text 버튼), 오른쪽 "다음"(primary).
- 팝업 제목은 질문형("이 시점으로 되돌릴까요?", "모든 도구 실행을 자동 승인하시겠습니까?")이나 명사형("모델 삭제", "API 키 초기화", "연결 실패"). 본문에는 결과를 밝힘("…삭제됩니다. 이 작업은 되돌릴 수 없습니다.").
- 비활성 표현: `status=disable` 버튼(primary disable = 연한 회색). 쓰는 경우는 필수 조건 미충족(약관 미체크, API 미입력, 모델 미선택), 한도 도달(태스크 10개, 모델 10개, 첨부 50개/이미지 10장 → 첨부 버튼 dim), 토큰 제한(예약 태스크 토글 off + dim, 추가 버튼 잠금). 문서 표기는 "dimmed 처리".

### F-2. 상태 표현
- **오류**: 대화 안 오류 카드는 4그룹(일시적인 오류 / 확인이 필요합니다 / 요청을 처리하지 못했습니다 / 상황별)으로 나누고, 제목·본문·안내 한 줄·[다시 시도] 여부를 표로 정의. 앱 전역 오류는 하단 중앙 토스트("대화 기록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요."), 예약 작업은 오른쪽 아래 토스트, 치명 오류(로컬 모델 다운로드 불가)는 팝업 + "앱 종료".
- **빈 상태**: 아이콘 + 안내 문구 + 버튼(히스토리 "새 대화", 예약 "태스크 추가" + 추천 카드, 모델 "다운로드", 애셋 "Assets가 없습니다.").
- **로딩**: `loading/stroke` 14 + 진행률 텍스트(NN%), 다운로드 중 배지는 "선택·조작 불가, 표시만". AI는 퓨론 로딩 아이콘 + "생각하고 있어요." + "Working N.Ns". 스플래시는 가운데 로딩 애니메이션.
- **성공**: 하단 중앙 토스트("클립보드에 복사되었습니다.", "연결에 성공하였습니다."). 복사 아이콘이 잠시 체크로 바뀜.
- **API 키 상태 3단계**: 활성화(초록) / 확인 필요(주황, 만료·토큰 고갈·일시 오류) / 비활성화(회색, 삭제·연결 오류). 상태에 따라 하위 모델의 선택 가능 여부가 달라짐.

### F-3. 데스크톱 특화 규칙 (설명 표에서 추출)
- 설치/진입: "LG Update & Renew" 앱에서 설치 → Windows에서 앱 실행. 진입 조건은 Windows OS + 네트워크 연결 + LG gram chat 미실행.
- 창: 커스텀 타이틀바(아이콘 + 앱명 + 최소화/최대화/닫기). 온보딩 중 창을 닫으면 "나가기" 확인 팝업이 뜨고, 다시 실행하면 마지막 단계부터 이어서 진행.
- 시스템 트레이: 열기 / 새 대화 / 종료.
- OS 연동: 파일 첨부 버튼 → OS 파일 브라우저, 워크스페이스 선택 → 폴더 브라우저, "파일관리자에서 보기", Drag & Drop과 클립보드 붙여넣기로 첨부, 부팅 시 자동 시작, 데스크톱 알림(백그라운드 작업 완료), 초기 언어는 Windows 언어 설정을 따름.
- 키보드: **Ctrl+Enter = 전송**. 선택 패널은 Esc 취소, ↑↓ 이동, 숫자 선택, Enter 확인.
- 입력 한도: 프롬프트 1만 자 이상이면 txt 첨부로 자동 변환(되돌리기 제공), 첨부 50개, 이미지 10장, PDF/Office 500MB, 이미지/텍스트/CSV 16MB, 폴더 첨부 불가, 같은 파일 중복 불가.
- 시간 표기: now / m / hr(24h 이내) → days(7일 이내) → YYYY-MM-DD. 대화 그룹은 고정됨 / 오늘 / 어제 / 이번주 / 과거.
- 밀도: 본문 최소 10px(Body5), 메타 8px(Body6, `button h20` 라벨)까지 사용. 리스트 행 28(사이드바)/41(히스토리), 버튼 높이 20/26/33. **고밀도 마우스 중심 UI**.
- 동작 원칙: 드롭다운은 hover로 열림, 토글은 클릭 즉시 반영, 팝업은 화면 정중앙·최상위.

### F-4. 문서 관례
- 모든 슬라이드에 번호 주석(1, 1-1, 2-1…)을 달고 오른쪽 description 표와 1:1로 대응. 세부 값(기본 토큰 수, 지원 포맷, 공급자 순서 등)은 **"SRS 참조"**로 넘김.
- 플레이스홀더는 중괄호로 표기: `{Conversation}`, `{AI Model name}`, `{Query level}`, `{채팅 내용}`.
- 버전 태그: 오른쪽 위 `Tag` Modified/New + "v 1.0.2 | 26.11.19" + 변경 요약.

---

## G. 실제로 바인딩된 색상·텍스트 스타일

### G-1. 색상 변수 (59개 창 내부, 바인딩 횟수, 해석된 값)
| 변수 | 값 | 용도 | 횟수(T=텍스트, F=fill, S=stroke) |
|---|---|---|---|
| Global/neutral/m-neutral-70 | #737373 | 기본 텍스트, 아이콘, primary 버튼 bg | T 1270 / F 658 / S 19 |
| Global/neutral/m-neutral-10 | #ffffff | 배경, 카드, 팝업 | F 585 / T 81 |
| Global/neutral/m-neutral-40 | #bcbcbc | 테두리, divider, 비활성 | S 410 / F 140 / T 15 |
| Global/neutral/m-neutral-100 | #000000 | 제목·강조 텍스트 | T 324 / F 208 |
| Global/neutral/m-neutral-20 | #efefef | 타이틀바, 사이드바, 온보딩 bg, 토스트 | F 235 / S 12 |
| Global/primary/m-primary-70 | **#1d828f**(teal) | switch on, tag, 프롬프트 bar, 선택 | F 135 / T 5 / S 2 |
| Global/primary/m-primary-90 / -15 | #10454c / — | 강조 텍스트, 연한 bg | 소수 |
| Global/semantic/success/m-success-60 / -10 / -80-text | #12b76a / #f6fef9 / #027948 | 활성화 배지, 예약 성공 토스트 | F 25 / 6 / 4 |
| Global/semantic/warning/m-warning-60 / -10 / -80-text | #f79009 / #fffcf5 / #b54708 | 확인 필요, 토큰 경고 배너·토스트 | F 7 / 5 / 11 |
| Global/semantic/error/m-error-60 / -80-text | #f04438 / #b32318 | 실패 dot, Failed 텍스트 | F 5 / T 1 |
| Global/semantic/infomation/m-info-80-text | #0e66e8 | 정보 텍스트 | F 2 |

- 로컬 변수 컬렉션은 비어 있음(`Collection: 0`). 모든 변수는 DS 라이브러리(원격)에서 가져옴.
- 와이어프레임이라 실제로 쓰인 팔레트는 **neutral 5단계 + teal primary 1개 + semantic(success/warning/error)**뿐.

### G-2. 텍스트 스타일 (창 내부 TEXT 기준)
| 스타일 | 정의 | 횟수 | 용도 |
|---|---|---|---|
| Body/Body4 | Noto Sans Medium 12 / 140% | 758 | 리스트 항목, 라벨, 메뉴, 토스트, 팝업 제목 |
| Body/Body5 | Noto Sans Regular 10 / 140% | 644 | 메타, 도움말, h26 버튼 라벨, 팝업 본문, 그룹 헤더(Bold override) |
| Body/Body3 | Noto Sans Medium 15 / 140% | 240 | 부제, 답변 본문, h33 버튼, 탭, 앱 타이틀 |
| Body/Body6 | Noto Sans Regular 8 / 140% | 87 | h20 버튼 라벨, 아주 작은 메타 |
| Body/Body2 | Noto Sans Medium 18 / 140% | 36 | 섹션·카드 제목 |
| Heading/Heading3 | Noto Sans Bold 28 / 130% | 29 | 페이지 제목, 인사말 |
| Body/Body1 | Noto Sans Medium 23 | 3 | 거의 안 씀 |
| (스타일 없음) | — | 140 | 아래 G-4 |

- Heading1/2/4는 쓰이지 않음. **페이지 제목은 Heading3(28) 하나로 통일**하고 나머지는 Body2~6.

### G-3. 변수에 바인딩되지 않은 raw HEX (상위)
| HEX | 횟수 | 출처/의미 |
|---|---|---|
| #626262 | S 75 / F 29 | 온보딩 스텝 표시 원·connector |
| #ffffff | F 73 / T 31 | 온보딩 카드, `dorpdown` bg (= neutral-10 미바인딩) |
| #000000 | F 57 / T 47 / S 24 | 공급자 카드 테두리, 카드 제목 14px (= neutral-100 미바인딩) |
| #1d828f | F 34 / T 30 / S 4 | primary-70 값을 직접 입력(대표 모델 테두리 등) |
| #555555 | S 30 | **창 외곽 테두리** |
| #747474 / #171717 | T 37 / T 15 | 온보딩 부제·제목 |
| #d0d0d0 / #c9c9c9 | S 24 / S 14 | 온보딩·모델 카드 테두리 |
| #f79009 | F 14 / T 6 | warning-60 미바인딩(주황 dot, 차트 Output) |
| #f2f2f2 / #f5f5f5 / #f9f9f9 | F 12 / 5 / 1 | 안내 박스 bg |
| #17181a / #70747c | T 10 / 10 | 예약 태스크 헤더(외부 생성 와이어프레임에서 가져온 흔적) |
| #0e66e8 | T 4 / F 2 | info 파랑 |

### G-4. 스타일 없이 쓴 폰트 (와이어프레임 생성기/외부에서 붙여 넣은 흔적)
- Inter Regular 14 ×50, Inter Bold 28 ×13, Inter Semi Bold 18 ×5, Inter Bold 20 ×2: 온보딩 카드 제목·본문, 공급자명 14, 리셋/입력 등.
- LG Smart UI Regular 14 ×19 / Bold 14 ×12 / Regular 12 ×11 / Bold 12 ×2: 일부 버튼·라벨.
- Noto Sans 17.67 / 11.36 / 12.69 (축소된 썸네일 창 안 텍스트).
- 정리하면 **온보딩 화면(`Welcome wireframe`, `Environment card`)과 모델 공급자 카드가 DS 토큰·스타일을 가장 많이 벗어난 영역**이고, 사이드바·채팅·히스토리·설정·예약 카드는 거의 모두 DS 변수·스타일에 바인딩돼 있음.

---

### 부록: 주요 노드 ID
- 메인 창: `158:20751`(1280×720, 인스턴스 of `119:18589 뉴챗`)
- 우측 패널 열림: `158:21320`(1097×720)
- 히스토리: `169:34811` / 예약: `3712:52018` / 모델: `2203:41906` / 설정: `2209:43447` / 토큰: `3709:22248`
- 온보딩: `3857:22310`(준비사항), `2169:51427`(API 키)
- 스케줄 다이얼로그: `234:51066` 안의 `Edit task dialog`
- 로컬 셸 컴포넌트: `30:3679 left-sidebar`, `119:18743 workspace-sidebar`
