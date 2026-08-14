# 🎨 [문서 2] 디자인 시스템 및 컴포넌트 조립 명세서 (Design MD)

본 문서는 피그마(Figma) 디자인 자산을 대체하여, 마크다운 기반의 컴포넌트 구조와 Tailwind CSS 시맨틱 토큰 체계를 정의한 디자인 명세서입니다. 모든 UI 조립은 00_alignment_guide.md의 '인라인 클래스 금지 규칙'에 따라 본 문서에 명시된 토큰 변수만을 참조하여 구현됩니다.

본 문서의 모든 화면 명세는 01_master_prd.md **v3.0**의 태그를 참조합니다. PRD에 없는 기능을 본 문서가 임의로 추가하지 않으며, 본 문서에 없는 스타일을 코드가 임의로 사용하지 않습니다.

---

## 0. 버전 히스토리

| 버전 | 변경 내용 |
|---|---|
| v2.9 | 실무자 셀프서브 감사 반영(발견 94) — ① §1의 `const DESIGN_TOKENS`가 실제 코드 변수명(`const T`)과 달라 이 문서만 보고 app.js를 여는 사람이 못 찾는 문제를 정정. ② 히트맵 0인원 셀이 tailwind.config에 이미 등록된 `secondary`(#EFEEF0)와 동일 hex를 `bg-[#EFEEF0]`로 별도 하드코딩하던 토큰 이탈을 `bg-secondary` 참조로 교체(코드·문서 양쪽 반영) |
| v2.8 | 반응형 감사 반영(발견 91) — A01 그리드(G01) 요일 컬럼이 candidatePeriod 최대 7일(PRD 3.0-A)에서 44px 터치 타겟 아래로 줄어들던 문제를 gridTemplateColumns `minmax(2.75rem, 1fr)` + 컨테이너 overflow-x-auto로 수정, 시간 라벨 열 sticky 고정 추가. 부수 발견: AB01 닫기 버튼·P01 닫기 버튼이 44×44 터치 타겟 원칙(발견 52)의 예외로 남아있던 것을 재적용(min-w-11 min-h-11 + 음수 마진으로 시각 레이아웃 불변 확대) |
| v2.7 | PRD v3.0 얼라인 — CONFLICT 통합 플로우(발견 89·90): CANCEL-CONFIRM(경로 A) 확정 직후 대기 화면 없이 QUICK-RECONFIRM 또는 GRID로 강제 진입하도록 개정, QUICK-RECONFIRM 컴포넌트 신설(원클릭 재확인, 이미 반영 시 버튼 비활성 상태로 전환), CONFLICT 일반 진입 문구에 QUICK 분기 추가 |
| v2.6 | v2.5 이식 후 잔여 참조 정리 — 애초에 v2.5는 섹션 1(토큰 정의)만 갈아끼웠을 뿐 섹션 2·3(화면 명세 전체)은 옛 어휘(`bg-surface`·`text-muted`·`bg-required`·`bg-avoid`·`bg-danger-light` 등)를 그대로 쓰고 있었음이 전수 재검사에서 드러나 함께 정리한다: 1.3 토큰↔PRD 매핑표, 2.4(D01) 히트맵/마커 마크업 주석, 그리고 섹션 2 전역의 모든 실사용 클래스(`bg-surface`→`bg-card`, `text-muted`→`text-muted-foreground`, `border-muted`→`border-border`, `bg-required`(-light)→`bg-success`(/10), `text-required`→`text-success`, `bg-avoid`(-light)→`bg-warning`(/10), `text-avoid`→`text-warning`, `bg-danger-light`→`bg-destructive/10`, `border-danger`→`border-destructive/20`, `text-danger`→`text-destructive`)를 신 토큰명으로 일괄 치환. 부수 발견: v2.5의 devpanel 도메인 토큰이 구 3종(`bg-devpanel`·`text-devpanel`·`text-devpanel-strong`)을 2종(`devpanel`·`devpanel-foreground`)으로 축약하며 강조(흰색) 변형의 대응값이 빠져 있었음 — 신규 값을 만들지 않고 `devpanel` 배경이 `primary`와 동일 색상이라는 점에 근거해 강조 텍스트는 `primary-foreground`로 대체(사용자 확인). `unavail`·`block`·`unset`·`devpanel`은 이름 자체는 변경 없어 섹션 2 표기 그대로 유지. v2.5 자체 히스토리 행은 원안 그대로 보존하기 위해 이번 정리를 별도 행으로 분리 기록 |
| v2.5 | shadcn/Tailwind 킷 표준 완전 이식: 시맨틱 컬러(이름+값), 타이포(Geist 채택·스케일 기일치 확인), 곡률(radius-xl 14/radius-md 8 정렬), 그림자·다크모드(피그마 정의) 일괄 정렬. 히트맵은 success 단일색 균등 오퍼시티 스케일로 재정의('같은 인원수=같은 색' 원칙의 구조적 보장). 도메인 확장 토큰·컴포넌트는 표준 문법 유지. 토큰 격리 범위를 색·곡률로 명문화(타이포·간격 유틸은 인라인 허용). 01/03/04 무변경(토큰 지식의 02 격리 확인). |
| v2.4 | PRD v2.7 얼라인 — R01 재조율 반영 현황 카드를 게이팅으로 강화([DS-FLOW-R01-STATUS] 개정, 발견 84): 필수 인원 미갱신 시 [최종 확정] 버튼 자체를 안내 문구로 대체, H01 조율 기간·회의 후보 날짜 카드 가운데 정렬을 1.7-A 정렬 규칙의 명시적 예외로 지정(발견 85), D01 제출 현황 카드에 "기간 확장 후 재대기" 표시 분기 추가(발견 86) |
| v2.3 | PRD v2.6 얼라인 — A01 GRID에 필수 복귀 요청 링크 신설(선택 참석자 전용, [DS-FLOW-A01-REINSTATE-REQ]), A01-RESULT에 요청 거절 배너·필수 복귀 요청 대기 배너·기간 확장 신규 날짜 강조 추가, D01 통합 행동 배너에 필수 복귀 요청 승인/거절 추가, D01-DONE 강등 의견 노출 컴포넌트 제거(발견 82 — 확정 완료 히어로에는 애초에 노출 대상이 아니었음), R01에 재조율 반영 현황 카드 신설([DS-FLOW-R01-STATUS]) |
| v1.0 | 최초 작성 (토큰 + H01 화면 1종) |
| v1.1 | H01 깨진 조립 문법 복구, 미명세 화면 3종(A01/D01/R01) 신설, 시나리오 패널(P01)·토스트(T01)·그리드 슬롯(G01) 컴포넌트 신설, 상태 토큰 확장, 상태별 노출 규칙 신설 |
| v1.2 | P01 패널에 화면 바로가기 신설 |
| v1.3 | 글로벌 브랜드 바(B01) 신설 |
| v1.4 | 1차 QA 반영 — 지속 알림 배너(AB01)·역할/단계 표시(CX01) 신설, P01 닫기 버튼, A01 뒤로가기, R01 가드 상태 |
| v1.5 | PRD v1.7 얼라인 전면 개정 — 랜딩(L01)·데모 가이드(GD01) 화면 신설, A01을 5단계 구조(초대 랜딩→본인 선택→그리드→제출 완료→결과 안내)로 재설계, D01에 초대 링크 카드·집계 히트맵·확정 완료 카드 신설, H01 기간·마감 표시형 및 주최자 권한 고정, 추천 카드 실명 표기 및 완화 3단계 뱃지, 일괄 입력 버튼, 히트맵 밀도 토큰 신설, 노출표를 PRD 2.6 가드 표와 1:1 재작성 |
| v2.2 | PRD v2.5 얼라인 — 통합 행동 배너를 역강등 승인/거절 전용으로 축소([DS-FLOW-D01-NEXT] 재조립, 재요청 배너 컴포넌트 제거), 강등·역강등 CF01에 사유/의견 노출 컴포넌트 신설, H01 조율 기간·회의 후보 날짜 2세트 입력 재조립([DS-FLOW-H01-PERIOD]), 그리드/히트맵 데이터 소스를 candidatePeriod 기준으로 명시
| v2.1 | PRD v2.3 얼라인 — CANCELLED 종료 화면 신설(L01 톤 재사용, 신규 컴포넌트 없음), 주최자 통합 행동 배너([DS-FLOW-D01-NEXT]), 역강등 요청 버튼·배지·승인 확인 영역, 강등 CF01에 의견 입력 필드, 기간 확장 액션, 날짜 헤더 일괄 불가, 프로액티브 재요청 팝업, 발의 후 제목 잠금, 표시 문구 순화 사전 확장 |
| v2.0 | PRD v2.2 얼라인 — 그리드 위계 분리 실제 코드 반영 확인(56), 히트맵 균등 스케일 재조정(58·62), 뒤늦은 제출 경로 컴포넌트 신설(60, MemberPicker 미확인자 표기), CONFLICT 사유 3분기 문구(63), 강등 배너 근거 슬롯 표기(64), EX-04 확정 실패 슬롯 명시적 배제 주석(61) |
| v1.9 | PRD v2.1 얼라인 — 히트맵 비균등 명도 스케일(고빈도 구간 4·5·6명 명도 폭 확대), 그리드 슬롯 44px·히트맵 셀 36px 이상 터치 타겟(반응형), 시나리오 패널 모바일 접힘·내부 스크롤, 브랜드 바 뱃지 truncate, 그리드 사용법 안내 위계 하향(범례 옆 보조 텍스트로 이동), 카드 본문 좌측 정렬 일괄 적용(CF01만 중앙 정렬 예외), 불참 사유 3분기 표기 컴포넌트, 확정 확인 문장 정렬 우선순위 반영, Top3 근거 펼침(선택), 독촉 당사자 배너 |
| v1.8 | PRD v2.0 얼라인 — 히트맵 7단계 명도 재배치(저농도 구간 분리) 및 확정 슬롯 색상 계열 전환(bg-confirmed, 램프와 무관), 지속 배너 D01·R01 한정, A01 경로 A 취소자에게 업데이트 동선 제공, 사용자 노출 문구 전면 교체(가용성→내 시간, 의사결정자→필수 참석자, 참조자→선택 참석자 등, [DS-COPY] 부록) |
| v1.7 | PRD v1.9 얼라인 — 확인 영역 공통 컴포넌트 신설(2.11 [DS-COMP-CF01], armed 버튼 폐기), 부분 성립 카드 위계 재조립(재요청 주 액션·발송 상태·강등 보조·강행 확정 미노출), 히트맵 인원수 7단계 램프·확정/선택 마커 분리, A01 당사자별 안내 5종·참석 취소 플로우(2.3.5), H01 발의 후 권한 잠금, 그리드 잠금 캡션·일정명 토스트, 노출표 미발의 행 |
| v1.6 | PRD v1.8 얼라인 — 유저 지정 불가 토큰·슬롯 매핑·범례 5종(G01), 확정 2탭 확인 및 부분 성립 카드 2액션(D01-RESULT), 상태별 위계 규칙 신설([DS-HIERARCHY]) 및 COMPLETED 대시보드 결과 중심 재조립(D01-DONE 히어로), 패널 힌트·이탈 단발 버튼(P01), 가이드 스캔 구조 재조립(GD01), EX-04 신규 카드 표시, 히트맵 상세 상태 5종 구분, A01 확정 안내 불참 명시 |

---

## 1. 글로벌 디자인 시스템 및 시맨틱 토큰 사양 `[DS-TOKEN]`

`app.js` 최상단의 `const T` 오브젝트에 아래 명세와 1:1로 매칭되는 키-값을 선언하고 모든 UI 컴포넌트에 적용합니다. **아래 표에 없는 색상·간격·곡률 값을 마크업에 직접 쓰는 것을 금지합니다.**

### 1.1 시맨틱 컬러 토큰 (Semantic Colors) — shadcn 표준 세트

킷(shadcn/Tailwind Figma Kit)의 시맨틱 이름과 값을 그대로 채택한다.
`app.js`는 인라인 `tailwind.config` 확장에 아래 hex를 시맨틱 이름으로 등록하고,
`const T` 오브젝트는 시맨틱 클래스만 참조한다. 아래 표에 없는 색상 값을 마크업에 직접 쓰는 것을 금지한다.

| 토큰 | 값 (킷 실측) | 용도 |
|---|---|---|
| `background` | `#FFFFFF` | 전체 화면 바탕색 |
| `foreground` | `#302E33` (neutral-950) | 타이틀·본문 기본 텍스트 |
| `primary` | `#3C3A40` (neutral-900) | 주최자 메인 액션, 제출·확정 버튼 |
| `primary-foreground` | `#F7F7F8` (neutral-50) | 주 액션 버튼 내 텍스트 |
| `card` | `#FFFFFF` | 카드·인풋 등 콘텐츠 표면 |
| `secondary` | `#EFEEF0` (neutral-100) | 보조 버튼 배경 (표준 세트 — 현행 미사용, 예약) |
| `muted-foreground` | `#76717F` (neutral-500) | 설명·힌트·보조 텍스트 |
| `border` | `#DBD9DE` (neutral-200) | 카드·컴포넌트 경계선 |
| `ring` | `#97929E` (neutral-400) | 탐색 선택 마커 (`ring-2 ring-ring`) |
| `destructive` | `#E03434` (red-600) | EX-03 경고 텍스트·아이콘 |
| `destructive/10` | destructive 10% | 경고·지속 배너 배경 (구 bg-danger-light) |
| `destructive/20` | destructive 20% | 경고·지속 배너 테두리 (구 border-danger) |
| `destructive-foreground` | `#FFFAF5` (red-50) | destructive 배경 위 텍스트 |
| `success` | `#02B541` (green-600) | 가용(AVAILABLE) 슬롯, 최적 추천 강조·텍스트 |
| `success/10` | success 10% | 최적 추천 카드·확정 완료 카드 배경 (구 bg-required-light) |
| `success-foreground` | `#F0FCF8` (green-50) | success 배경 위 텍스트 |
| `warning` | `#E39219` | 비선호(AVOID) 슬롯·관련 텍스트 |
| `warning/10` | warning 10% | 비선호 경고·재조율 화면 배경 (구 bg-avoid-light) |
| `warning-foreground` | `#FFFDF5` (amber-100) | warning 배경 위 텍스트 |

**도메인 확장 토큰 (shadcn 미정의 개념 — 표준 문법으로 확장)**

| 토큰 | 값 | 용도 |
|---|---|---|
| `unavail` | `#76717F` (neutral-500) | 유저 지정 불가(UNAVAILABLE) 슬롯 — 시스템 잠금보다 진하게: 본인의 명시적 선언 (v1.6 판단 유지) |
| `block` | `#DBD9DE` (neutral-200) | 시스템 잠금(BLOCK_STRICT) 슬롯 |
| `unset` | `#FFFFFF` | 미지정(UNSET) 슬롯 표면 (테두리로 구분) |
| `devpanel` | `#3C3A40`/95% | 시나리오 패널·데모 가이드 배경 (제품 UI와 시각적 구분) |
| `devpanel-foreground` | `#C9C6CE` (neutral-300 상당) | 시나리오 패널 본문 텍스트 |

**구현 규칙 (app.js 재생성 시 준수)**

1. 인라인 `tailwind.config` 확장에 시맨틱 hex와 곡률을 동명으로 등록한다:

    tailwind.config = { theme: { extend: {
      colors: {
        background:'#FFFFFF', foreground:'#302E33',
        primary:{ DEFAULT:'#3C3A40', foreground:'#F7F7F8' },
        card:'#FFFFFF', secondary:'#EFEEF0',
        'muted-foreground':'#76717F', border:'#DBD9DE', ring:'#97929E',
        destructive:{ DEFAULT:'#E03434', foreground:'#FFFAF5' },
        success:{ DEFAULT:'#02B541', foreground:'#F0FCF8' },
        warning:{ DEFAULT:'#E39219', foreground:'#FFFDF5' },
        unavail:'#76717F', block:'#DBD9DE', unset:'#FFFFFF',
        devpanel:{ DEFAULT:'#3C3A40', foreground:'#C9C6CE' },
      },
      borderRadius: { md:'8px', xl:'14px' },
      fontFamily: { sans:['Geist','sans-serif'] },
    }}}

2. `const T` 키는 시맨틱 이름의 camelCase로 개명하고 시맨틱 클래스만 참조한다.
   예: `bgPrimary:"bg-slate-900"` → `primary:"bg-primary"`,
   `textMuted:"text-slate-500"` → `mutedForeground:"text-muted-foreground"`,
   `bgRequired:"bg-emerald-500"` → `success:"bg-success"`, 히트맵 램프는 `bg-success/15` 형식,
   `roundedContainer:"rounded-2xl"` → `roundedContainer:"rounded-xl"` (14px),
   `roundedElement:"rounded-lg"` → `roundedElement:"rounded-md"` (8px).
3. config 등록으로 과거 `bg-primary` 미인식 문제(발견 45)는 재발하지 않는다 —
   당시 결함 원인은 config 미등록 상태의 리터럴 사용이었다. 이 기록은 히스토리에 유지한다.
4. 원시 hex를 T 밖 마크업에 직접 쓰는 것은 여전히 금지 ([00 정합성 가이드] 2조).

### 1.1-2 타이포그래피 (Typography) — 킷 표준 채택

- **스케일**: Tailwind 표준 스케일을 그대로 사용한다 (킷과 기일치 확인 —
  현행 사용: text-xs·sm·lg·xl·2xl·3xl × font-medium·semibold·bold).
- **서체**: 킷 표준 **Geist**를 채택한다. 웹폰트 1회 로드, `fontFamily.sans`로 등록 (구현 규칙 1 참조).
- **격리 범위 명문화**: 토큰 격리(T 오브젝트 경유 의무)는 **색·곡률**에 적용한다.
  타이포·간격 유틸리티 클래스는 Tailwind 표준값 한정으로 마크업 직접 사용을 허용한다 —
  표준 스케일 밖의 임의 수치(`text-[13px]` 등)는 금지.

**히트맵 밀도 토큰 (v1.9 — 비균등 명도 스케일)** — `[PRD-HEATMAP]` 3.8. v1.8의 균등 7단계는 실데이터가 4~6명 구간에 몰리는 6인 회의 특성상 사용자 눈에 보이는 건 사실상 상위 2~3단계뿐이었다 (발견 50). 저빈도 구간(0~3명)은 단계를 압축하고, 고빈도 구간(4~6명)의 명도 폭을 넓혀 실제로 자주 마주치는 차이를 더 뚜렷하게 만든다.

| 토큰 | 값 | 가능 인원 |
|---|---|---|
| `heat-0` | `#EFEEF0` (neutral-100) | 0명 |
| `heat-1` | `success/15` | 1명 |
| `heat-2` | `success/30` | 2명 |
| `heat-3` | `success/45` | 3명 |
| `heat-4` | `success/60` | 4명 |
| `heat-5` | `success/80` | 5명 |
| `heat-6` | `success` (원색) | 6명 |

**단일색 오퍼시티 스케일 전환 (v2.5):** '가용'의 표준 색이 success로 이동함에 따라,
히트맵을 success 단일색의 균등 오퍼시티 단계로 재정의한다. 서로 다른 원시색 6개를 잇던
기존 방식과 달리 단일 색상의 균등 상승이므로 "같은 인원수는 어느 화면에서든 같은 색"
원칙(v2.0, 발견 58·62)이 구조적으로 보장되며, 표준 시맨틱 색 1개만 사용해 이식 순도가 높다.

**균등 스케일 재조정 (v2.0 — 발견 58·62):** v1.9의 저빈도 압축·고빈도 확대 방식은 6명 단계가 `emerald-800`으로 과도하게 튀어 팔레트 일관성이 깨졌다 — "가장 진한 색"의 인상이 화면마다 달라 보이는 원인이었다. 6인 고정 모수에서는 저빈도 압축이 틀린 처방이었다 — 0~6 전 구간을 100 단위로 고르게 상승시켜 어느 화면에서든 같은 인원수가 같은 색으로 보이게 한다.

**확정 슬롯 색상 계열 (v1.8 — PRD 3.8, 발견 41):** 확정 슬롯은 램프 계열을 쓰지 않는다. `primary`(주최자 강조색) + `primary-foreground` — 후보군과 아예 다른 정보임을 색만으로 전달한다. 링 마커(confirmed 마커: `ring-2 ring-success`)는 유지하되 배경 자체가 램프에서 이탈한다.

**마커 토큰:** 탐색 선택 `ring-2 ring-ring`.

### 1.2 레이아웃 및 상태 토큰 (Layout & States)

| 토큰 | 값 | 용도 |
|---|---|---|
| `disabled-state` | `opacity-40 pointer-events-none` | 인터랙션 불가 영역 (BLOCK_STRICT 슬롯, 비활성 제출 버튼) |
| `p-screen` | `p-6` | 화면 최외곽 여백 |
| `p-card` | `p-4` | 카드 내부 여백 |
| 곡률(킷 Border Radius 체계 정렬) | 컨테이너 `rounded-xl`(radius-xl, **14px** — 구 16px에서 변경), 요소 `rounded-md`(radius-md, **8px** — 킷 정의 "inputs, buttons" 용도와 일치, 구 rounded-lg와 동일값). 킷 7단계(0/2/6/8/10/14/full) 중 이 2단계만 사용한다. |
| 그림자 | Tailwind 표준 `shadow-lg` 1개소만 사용 (현행 유지). 피그마에서는 킷 이펙트 스타일 `Light/box-shadow/default/lg`가 이에 대응한다. |
| `pressed-feedback` | `transition-all active:scale-[0.98]` | 모든 탭 가능 요소의 눌림 피드백 |

**다크 모드 (피그마 정의, 코드 미구현):** 킷의 Light/Dark 모드 체계를 피그마 Variables
모드로 정의해 시맨틱 토큰이 모드 전환에 대응함을 검증한다. **코드 구현은 스코프 OUT** —
본 서비스는 라이트 모드만 제공하며, 다크 값은 피그마에서만 유지·시연한다.

### 1.3 토큰 ↔ PRD 상태 매핑 (정합성 기준표)

그리드 슬롯 상태(`[PRD-GRID]` 3.2)는 아래 매핑 외의 시각 표현을 갖지 않습니다.

| PRD 슬롯 상태 | 적용 토큰 |
|---|---|
| `UNSET` | `unset` + `border` |
| `AVAILABLE` | `success` |
| `AVOID` | `warning` |
| `UNAVAILABLE` | `unavail` (v1.6 — 유저 변경 가능하므로 disabled-state 미적용) |
| `BLOCK_STRICT` | `block` + `disabled-state` |

---

## 2. 화면별 가상 라우팅 및 컴포넌트 조립 문법 `[DS-FLOW]`

단일 `app.js` 내에서 라우팅 조건 분기에 따라 렌더링될 조립 명세입니다. 아래 마크업은 조립 구조와 토큰 적용 위치를 정의하는 스펙이며, 실제 구현 시 동일한 계층·토큰·조건 규칙을 따라야 합니다.

**화면 목록 (v1.5):** L01 랜딩(`/`) · H01 발의(`/host/create`) · A01 참석자(`/attendee`, 5단계) · D01 대시보드(`/host/dashboard`) · R01 재조율(`/host/re-match`) · GD01 데모 가이드(`/guide`)

### 2.0 킷 컴포넌트 매핑 `[DS-COMPONENT-MAP]`

화면에 등장하는 표준 UI는 킷 컴포넌트 스펙을 따르고, MeetSync 고유 개념은
같은 문법으로 확장 제작한다. 킷 전체 컴포넌트 중 아래 등장분만 채택한다.

| MeetSync 요소 | 킷 표준 컴포넌트 | 비고 |
|---|---|---|
| 제출·확정·재요청 버튼 | Button (primary / secondary / destructive) | 상태별 variant 사용 |
| 이름·회의 정보 입력 | Input | `card` 표면 + `border` |
| 추천 카드·확정 카드·경고 배너 | Card (+ success/10 · warning/10 · destructive/10 배경) | |
| 응답 상태 표시 (제출 완료 등) | Badge | success/warning 계열 |

**도메인 확장 컴포넌트 (킷 미정의 — 킷 문법으로 자체 제작)**

| 컴포넌트 | 정의 |
|---|---|
| GridSlot | 27슬롯 시간표 셀 — 상태 5종(unset/success/warning/unavail/block) × 마커 2종(ring/confirmed) |
| HeatCell | 집계 히트맵 셀 — heat-0~6 |
| RecommendCard | 추천 근거 카드 — Card 확장, 산출 근거·양보자 표기 슬롯 포함 |

아이콘: 코드 현행(텍스트 기호 ✓·→)을 유지한다. 피그마 재조립 시 킷 표준 아이콘(Lucide)
사용을 허용하되, 코드와 피그마의 기호 차이를 본 조항으로 명시해 둔다.

### 2.1 서비스 랜딩 (`/`) `[DS-FLOW-L01]` (v1.5)

`[PRD-JOURNEY]` 2.5-①. 여정의 시작. 역할·단계 표시(CX01) 미노출 (PRD 2.3), 브랜드 바(B01)는 노출 (로고 탭 타겟 유지).

```
<ScreenContainer className="bg-background p-screen flex-col gap-8 min-h-screen justify-center">

  {/* [DS-FLOW-L01-HERO] 문제 정의 — PRD 총론(관계 비용)의 언어를 그대로 쓴다 */}
  <FlexCol className="gap-3 text-center">
    <Text className="text-foreground text-3xl font-bold tracking-tight">
      회의 시간 잡기,{줄바꿈}이제 눈치 없이.
    </Text>
    <Text className="text-muted-foreground text-sm">
      재촉하기 미안하고, 비선호 시간을 말하기 애매하고, 확정 후 번복이 두려운 —
      일정 조율의 관계 비용을 시스템이 대신 집니다.
    </Text>
  </FlexCol>

  {/* [DS-FLOW-L01-HOW] 해결 방식 3단계 요약 */}
  <FlexCol className="gap-2">
    <StepRow className="bg-card border-border rounded-element p-card">1. 링크 하나로 전원의 가능·비선호 시간을 수집</StepRow>
    <StepRow className="bg-card border-border rounded-element p-card">2. 전원 조건 교차 + 3단계 완화로 최적 시간을 근거와 함께 추천</StepRow>
    <StepRow className="bg-card border-border rounded-element p-card">3. 확정 직전 재검증, 확정 후 이탈까지 재조율로 방어</StepRow>
  </FlexCol>

  {/* [DS-FLOW-L01-CTA] */}
  <Button className="bg-primary text-primary-foreground w-full py-4 rounded-element font-bold pressed-feedback">
    회의 만들기
  </Button>
  {/* 클릭 시: H01 진입 */}

  {/* [DS-FLOW-L01-GUIDE-LINK] 데모 가이드 진입 — 유일한 진입 경로 (PRD 1.6) */}
  <Text className="text-muted-foreground text-xs text-center underline pressed-feedback">
    데모 가이드 · 심사자용
  </Text>
  {/* 클릭 시: GD01 진입 */}

</ScreenContainer>
```

### 2.2 주최자 회의 발의 화면 (`/host/create`) `[DS-FLOW-H01]`

```
<ScreenContainer className="bg-background p-screen flex-col gap-6 min-h-screen">

  {/* [DS-FLOW-H01-HEADER] */}
  <FlexCol className="gap-2">
    <Text className="text-foreground text-2xl font-bold tracking-tight">새 회의 일정 잡기</Text>
    <Text className="text-muted-foreground text-sm">도메인 멤버들의 외부 캘린더 일정을 자동으로 조율합니다.</Text>
  </FlexCol>

  {/* [DS-FLOW-H01-BODY] 회의 기본 설정 구역 */}
  {/* 제목 잠금 (v2.1 — PRD 2.2): 발의 후(launched) 재진입 시 Input을 표시형 Text로 전환 — 권한 토글과 동일한 잠금 규칙 */}
  <FlexCol className="gap-4">
    <Input className="bg-card border-border rounded-element p-card w-full"
           placeholder="회의 제목을 입력하세요 (예: 주간 기획 리뷰)" />

    {/* [DS-FLOW-H01-DURATION] 시간 단위 드롭다운 (v2.0, 발견 67·68) — 실제 선택지 4종 + 커스텀 화살표 */}
    <SelectWrapper className="relative w-full">
      <Select className="bg-card border-border rounded-element p-card w-full appearance-none pr-9" defaultValue="1h">
        <Option value="30m">30분 단위</Option>
        <Option value="1h">1시간 단위</Option>
        <Option value="1h30m">1시간 30분 단위</Option>
        <Option value="2h">2시간 단위</Option>
      </Select>
      <ChevronIcon className="text-muted-foreground pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▼</ChevronIcon>
    </SelectWrapper>

    {/* [DS-FLOW-H01-PERIOD] 조율 기간·회의 후보 날짜 2세트 입력 (v2.2 전면 재조립, v2.4 정렬 확정 — 발견 85) — PRD 2.2·3.0-A [PRD-PERIOD-SPLIT] */}
    {/* 순서: 조율 기간(응답 마감)을 먼저, 회의 후보 날짜를 그 아래에 — "먼저 마감을 정하고, 그 이후 날짜 중에서 후보를 고른다"는 인과 순서를 화면 순서로도 보여준다 */}
    {/* 가운데 정렬 (v2.4, 발견 85): 두 MetaCard 모두 items-center text-center — 라벨·입력 필드 행 전부 중앙. 1.7-A 좌측 정렬 기본 규칙의 명시적 예외(CF01과 같은 근거) */}
    <MetaCard className="bg-card border-border rounded-element p-card flex-1 flex-col items-center text-center gap-1">
      <Text className="text-muted-foreground text-xs">조율 기간 (응답 마감)</Text>
      {/* launched: 표시형 Text (fmtDeadline) / !launched: <DateInput type="date"> + <TimeInput type="time"> — 시작일 자유 입력, 종료일+시각이 곧 마감. 입력 행도 justify-center */}
    </MetaCard>
    <MetaCard className="bg-card border-border rounded-element p-card flex-1 flex-col items-center text-center gap-1">
      <Text className="text-muted-foreground text-xs">회의 후보 날짜</Text>
      {/* launched: 표시형 Text (fmtPeriod) */}
      {/* !launched: <DateInput type="date" min={조율기간종료일+1}> ~ <DateInput type="date" min={시작일}> — min 제약으로 무효 날짜 원천 차단. 입력 행도 justify-center */}
      {/* 재조정 무효화 규칙: 조율 기간을 나중에 늦춰서 이미 고른 후보 시작일이 조율 기간 종료일 이전이 되면,
          시스템이 임의로 밀지 않고 후보 날짜 입력을 초기화 + "조율 기간이 바뀌어 회의 후보 날짜를 다시 선택해주세요" 안내 */}
    </MetaCard>
    {/* 발의 후 잠금: 두 MetaCard 모두 launched 시 표시형(pressed-feedback 미적용, 탭 무반응)으로 전환 — 제목 잠금과 동일 규칙 */}
  </FlexCol>

  {/* [DS-FLOW-H01-LIST] 참석자 권한 할당 목록 — 멤버 디렉토리 자동 로드(모킹, PRD 1.1) */}
  <FlexCol className="gap-3 border-t border-border pt-4">
    <Text className="text-foreground font-semibold text-sm">참석자 가용성 권한 지정 (총 6명)</Text>

    {members.map(member => (
      <FlexRow key={member.id}
               className="justify-between items-center p-card bg-card border-border rounded-element">
        <FlexCol>
          <Text className="text-foreground font-medium text-sm">{member.name}</Text>
          <Text className="text-muted-foreground text-xs">{member.email}</Text>
        </FlexCol>

        {/* [DS-FLOW-H01-HOSTFIX] 주최자(m1) 행: 토글 대신 고정 뱃지 (v1.5) — PRD 2.2 주최자 권한 고정 */}
            {/* [DS-FLOW-H01-LOCK] (v1.7 — PRD 2.2): 발의 후(launched) 전 멤버 권한 토글 잠금 — 표시형 뱃지로 대체. 역할 변경은 강등 플로우(5.1)로만 */}
        {member.role === 'HOST'
          ? <Badge className="bg-primary text-primary-foreground px-3 py-1.5 rounded-element text-xs font-bold">의사결정자 · 주최자</Badge>
          : <ToggleGroup value={member.attendance}>
              <ToggleItem value="REQUIRED"
                className={member.attendance === 'REQUIRED'
                  ? "bg-success text-primary-foreground font-bold px-3 py-1.5 rounded-element text-xs"
                  : "bg-background text-muted-foreground px-3 py-1.5 rounded-element text-xs"}>
                의사결정자
              </ToggleItem>
              <ToggleItem value="OPTIONAL"
                className={member.attendance === 'OPTIONAL'
                  ? "bg-success text-primary-foreground font-bold px-3 py-1.5 rounded-element text-xs"
                  : "bg-background text-muted-foreground px-3 py-1.5 rounded-element text-xs"}>
                참조자
              </ToggleItem>
            </ToggleGroup>}
      </FlexRow>
    ))}
  </FlexCol>

  {/* [DS-FLOW-H01-ACTION] */}
  <Button className="bg-primary text-primary-foreground w-full py-4 rounded-element font-bold mt-auto pressed-feedback">
    회의 개설 및 초대 링크 생성하기
  </Button>
  {/* 클릭 시 (v1.5): 링크 생성 완료 토스트(T01) → D01 진입 (PRD 2.5-②) — 참석자 화면 강제 전환 금지 */}

</ScreenContainer>
```

### 2.3 참석자 화면 (`/attendee`) `[DS-FLOW-A01]` — 5단계 구조 (v1.5)

`[PRD-JOURNEY]` 2.5-③④⑤, `[PRD-GRID]`, `[PRD-ROUTE-GUARD]` 참조. 단계 전이:

```
(PROGRESS)  INVITE → AUTH → GRID → DONE
                      ↑______|  (뒤로가기 — 버퍼 유지)
             DONE → AUTH  ([다른 참석자로 응답하기])
             DONE → GRID  ([가용 시간 다시 수정하기] — 재편집 프리로드)
(COMPLETED) 모든 단계 대신 RESULT-CONFIRMED 렌더링
(CONFLICT)  모든 단계 대신 RESULT-REMATCH 렌더링
```

#### 2.3.1 초대 랜딩 단계 `[DS-FLOW-A01-INVITE]`

A01 진입 시 최초 단계 (PROGRESS 한정). "링크를 받은 참석자"의 시점 — 생략 금지 (PRD 2.5-③).

```
<FlexCol className="gap-6 justify-center min-h-[60vh]">
  <FlexCol className="gap-2 text-center">
    <Text className="text-muted-foreground text-sm">{주최자명}님이 회의 일정 조율에 초대했습니다</Text>
    <Text className="text-foreground text-2xl font-bold">{회의 제목}</Text>
    <FlexRow className="gap-3 justify-center">
      <Badge className="bg-card border-border text-muted-foreground rounded-element px-2 py-1 text-xs">소요 {duration}</Badge>
      <Badge className="bg-card border-border text-muted-foreground rounded-element px-2 py-1 text-xs">응답 마감 {deadline 표기}</Badge>
    </FlexRow>
  </FlexCol>
  <Button className="bg-primary text-primary-foreground w-full py-4 rounded-element font-bold pressed-feedback">
    가입 없이 바로 응답하기
  </Button>
  {/* 클릭 시: AUTH 단계 진입. 무가입 진입 가치(PRD 2.1)의 체감 지점 */}
</FlexCol>
```

#### 2.3.2 본인 선택 단계 `[DS-FLOW-A01-AUTH]`

```
<FlexCol className="gap-3">
  <Text className="text-foreground text-2xl font-bold">참석자 확인</Text>
  <Text className="text-muted-foreground text-sm">본인의 이름을 선택해주세요.</Text>
  {members.map(member => (
    <SelectCard key={member.id}
      className="bg-card border-border rounded-element p-card pressed-feedback flex justify-between items-center">
      <Text className="text-foreground font-medium text-sm">{member.name}</Text>
      {/* SUBMITTED 멤버: 우측 "제출 완료 · 수정 가능" 뱃지 text-success text-xs — 재선택 시 프리로드 (PRD 3.5) */}
    </SelectCard>
  ))}
</FlexCol>
```

#### 2.3.3 그리드 편집 단계 `[DS-FLOW-A01-GRID]`

```
<FlexCol className="gap-4">
  <BackButton className="text-muted-foreground text-sm pressed-feedback">← 참석자 다시 선택</BackButton>
  {/* 뒤로가기: AUTH 복귀, 편집 버퍼 유지 (PRD 3.6) */}

  {/* [DS-FLOW-A01-HEADER] 위계 재조립 (v1.9 스펙 → v2.0 실제 코드 반영 확인, 발견 46·56) */}
  {/* 사실 정보(마감일)만 헤더에 남기고, 조작법 설명은 범례 옆 보조 텍스트로 하향 이동 */}
  <FlexRow className="justify-between items-end">
    <FlexCol className="gap-1">
      <Text className="text-foreground text-2xl font-bold">내 시간 선택하기</Text>
      <Text className="text-muted-foreground text-sm">마감: {deadline 표기}</Text>
    </FlexCol>
    {/* [DS-FLOW-A01-BULK] 일괄 입력 (v1.5) — PRD 3.3: UNSET만 AVAILABLE로, AVOID·BLOCK 보존 */}
    <Button className="bg-card border-border text-foreground rounded-element px-3 py-1.5 text-xs font-medium pressed-feedback">
      나머지 다 가능으로
    </Button>
  </FlexRow>

  {/* [DS-COMP-G01] 슬롯 그리드 — 가로축은 회의 후보 날짜(candidatePeriod, v2.2 — PRD 3.0-A) 기준 가변 일수, 세로축 09~18시 (PRD 3.1), 시각 규칙은 1.3 매핑표. 조율 기간(coordinationPeriod)은 그리드에 렌더링되지 않는다 — 응답 마감 문구로만 노출(H01·A01 헤더) */}
  {/* 탭 순환 (v1.6): 미지정 → 가능 → 비선호 → 불가 → 미지정 (PRD 3.3 4상태) */}
  {/* 터치 타겟 (v1.9 — PRD 1.7-B [PRD-RESPONSIVE], 발견 52): 슬롯 최소 44×44px. 데스크톱에서 과도하게 커 보이지 않도록 h-11(44px) 고정 또는 반응형(모바일 44px/데스크톱 36px) 중 택1 */}
  {/* 요일 컬럼 최소폭 (v2.8 신설 — PRD 1.7-B [PRD-RESPONSIVE], 발견 91): candidatePeriod가 최대 7일(PRD 3.0-A)까지 늘어나도 요일 컬럼이 44px 터치 타겟 밑으로 줄지 않도록 gridTemplateColumns를 `auto repeat(N, minmax(2.75rem, 1fr))`로 고정한다. 그 이상 좁아져야 하는 폭은 그리드 컨테이너의 overflow-x-auto로 가로 스크롤 처리(요일 컬럼별 페이징 대안은 폐기 — 스크롤이 구현 비용 대비 동일 문제 해결). 시간 라벨 열(첫 컬럼)은 sticky left-0 + 배경(bg-card)으로 고정해 가로 스크롤 중에도 몇 시 행인지 항상 보이게 한다 */}
  {/* [DS-FLOW-A01-DAYBULK] 일 단위 일괄 불가 (v2.1 신설 — PRD 3.3): 날짜 헤더를 pressed-feedback 대상으로 만들고 탭 시 "이 날 종일 안 돼요" 확인 토스트 또는 소형 팝오버로 실행. UNSET만 UNAVAILABLE로 전환, 기존 값 보존 */}
  {/* [DS-FLOW-A01-EXTENDED] 기간 확장 신규 날짜 강조 (v2.3 신설 — PRD 5.1, 발견 79): 주최자가 candidatePeriod를 확장한 뒤 참석자가 재진입하면, 새로 추가된 날짜의 DateHeader에 "새로 추가됨" 마이크로 뱃지(text-warning text-[10px])를 붙인다. 기존 응답이 있는 날짜는 값 그대로 유지 — 그리드 전체를 다시 채우게 하지 않는다 */}
  <Grid className="bg-card border-border rounded-container p-card">
    {/* 모든 슬롯: h-11 최소, rounded-element + pressed-feedback */}
    {/* 날짜 헤더(DateHeader): cursor-pointer + pressed-feedback, 탭 시 [DS-FLOW-A01-DAYBULK] 실행 */}
    {/* BLOCK_STRICT 출처 표기 (v1.7 — PRD 3.2, 발견 28): ① 그리드 하단 상시 캡션 "회색 잠금은 연동된 캘린더의 기존 일정입니다 (이동 버퍼 포함, 자동 반영)" ② 탭 토스트에 실제 일정명 "외근 (고객사 방문) · 이동 버퍼 30분" */}
  </Grid>

  {/* [DS-COMP-G01-LEGEND] 범례 + 사용법 안내 (v1.9 재조립) — 그리드 하단, 조작법은 낮은 위계(text-[11px] text-muted-foreground)로 범례 아래 별도 줄 */}
  <FlexRow className="gap-4 justify-center flex-wrap">
    <LegendItem token="bg-unset">아직 안 정함</LegendItem>
    <LegendItem token="bg-success">가능</LegendItem>
    <LegendItem token="bg-warning">피하고 싶음</LegendItem>
    <LegendItem token="bg-unavail">안 되는 시간</LegendItem>
    <LegendItem token="bg-block">다른 일정 있음</LegendItem>
  </FlexRow>
  {/* 사용법 안내 (v1.9 — PRD 1.7-A 위계 규칙, 발견 46): 조작법은 여기, 낮은 위계로 */}
  <Text className="text-muted-foreground text-[11px] text-center">탭하면 가능 → 피하고 싶음 → 안 되는 시간 → 해제 순으로 바뀌어요 · 드래그로 한 번에 지정</Text>

  {/* [DS-FLOW-A01-PROMOTE-REQ] 역강등 요청 (v2.1 신설 — PRD 5.1 [PRD-PROMOTE-REQUEST]) — 본인이 필수 참석자일 때만 노출, 주최자 본인은 미노출(권한 고정과 정합) */}
  <TextLink className="text-muted-foreground text-[11px] underline text-center pressed-feedback">
    저는 꼭 필요한 사람이 아닌 것 같아요
  </TextLink>
  {/* 탭 시 확인 영역(CF01, v2.2 — 발견 76): "주최자님께 참조자 전환을 요청합니다. 승인되면 이 회의는 회원님 없이도 성립할 수 있어요."
      + extra: <TextInput placeholder="요청 사유 (선택) — 주최자님이 승인 여부를 판단하는 데 도움이 돼요" /> + [취소]/[요청 보내기]
      입력한 사유는 requestPromotion(id, reason)으로 함께 커밋되어 D01-NEXT 배너에 노출된다(위 참조) — 사유를 받기만 하고 아무 데도 안 보여주면 결함 */}

  {/* [DS-FLOW-A01-REINSTATE-REQ] 필수 복귀 요청 (v2.3 신설 — PRD 5.1 [PRD-REINSTATE-REQUEST], 발견 81) — 역강등 요청의 대칭. 본인이 선택 참석자일 때만 노출, 필수 참석자는 미노출(이미 필수이므로 대상 아님) */}
  <TextLink className="text-muted-foreground text-[11px] underline text-center pressed-feedback">
    다시 필수 참석자가 되고 싶어요
  </TextLink>
  {/* 탭 시 확인 영역(CF01): "주최자님께 필수 복귀를 요청합니다. 승인되면 다시 필수 참석자로 전환돼요."
      + extra: <TextInput placeholder="요청 사유 (선택) — 주최자님이 승인 여부를 판단하는 데 도움이 돼요" /> + [취소]/[요청 보내기]
      requestReinstate(id, reason)으로 커밋, D01-NEXT 배너에 노출(사유 포함) — 역강등 요청과 동일한 가시성 요건 적용 */}

  {/* [DS-FLOW-A01-ACTION] 제출 — AVAILABLE 0개면 disabled-state + 안내 (PRD 3.4) */}
  <Button className="bg-primary text-primary-foreground w-full py-4 rounded-element font-bold pressed-feedback">
    시간 제출하기
  </Button>
  {/* AVAILABLE 0개일 때만: "되는 시간을 1개 이상 골라야 제출할 수 있어요" text-muted-foreground text-xs */}
  {/* 제출 시 (v1.5): 커밋 → DONE 단계 전환 (PRD 2.5-④) — 주최자 화면 강제 전환 금지 */}
  {/* [DS-FLOW-A01-PROACTIVE] 프로액티브 재요청 팝업 (v2.1 신설 — PRD 5.3 [PRD-PROACTIVE]) */}
  {/* 제출 즉시 "이 응답대로면 병목 1명만 열리면 전원 합의 가능"으로 계산되면, DONE 단계 진입 전 소형 확인 영역(CF01) 노출: */}
  {/* "이 응답대로면 {슬롯}만 빼고 전원 합의가 가능해요. 혹시 그 시간도 열어주실 수 있나요?" + [아니요, 그대로 제출] / [네, 다시 볼게요](→ GRID 복귀, 해당 슬롯 하이라이트) */}
  {/* 본인에게만 노출 — 다른 참석자·주최자는 이 팝업의 존재를 모른다 (공개 노출 이전 예방) */}
</FlexCol>
```

#### 2.3.4 제출 완료 단계 `[DS-FLOW-A01-DONE]` (v1.5)

`[PRD-JOURNEY]` 2.5-④. 참석자 여정의 1차 종착점.

```
<FlexCol className="gap-6 justify-center min-h-[60vh] text-center">
  <FlexCol className="gap-2">
    <Text className="text-success text-2xl font-bold">제출 완료</Text>
    <Text className="text-muted-foreground text-sm">{이름}님의 가용 시간이 제출되었습니다.</Text>
    <Text className="text-foreground text-sm font-medium">현재 응답 현황 {n}/{전원}</Text>
  </FlexCol>
  <FlexCol className="gap-2">
    <Button className="bg-card border-border text-foreground w-full py-3 rounded-element text-sm font-medium pressed-feedback">가용 시간 다시 수정하기</Button>
    {/* → GRID 복귀, 재편집 프리로드 (PRD 3.5) */}
    <Button className="bg-card border-border text-foreground w-full py-3 rounded-element text-sm font-medium pressed-feedback">다른 참석자로 응답하기</Button>
    {/* → AUTH 복귀 */}
    <Button className="bg-primary text-primary-foreground w-full py-3 rounded-element text-sm font-bold pressed-feedback">주최자 대시보드에서 결과 보기</Button>
    {/* → D01. 참석자→주최자 시점 전환의 공식 동선 (PRD 2.5-④) */}
  </FlexCol>
</FlexCol>
```

#### 2.3.5 당사자별 결과 안내 · 참석 취소·뒤늦은 제출·회의 폐기 플로우 `[DS-FLOW-A01-RESULT]` (v2.1 전면 개정)

`[PRD-JOURNEY]` 2.5-⑤ 영구 매트릭스와 1:1. CANCELLED·COMPLETED·CONFLICT는 단계 전체를 대체, PROGRESS 당사자는 일반 플로우 위 배너.

```
{/* CANCELLED — 전 상태 최우선 가드 (v2.1 신설, PRD 5.6) */}
<Card className="bg-card border-border rounded-container p-card text-center">
  <Text className="text-muted-foreground text-sm">이 회의는 취소되었습니다</Text>
  {/* 취소 사유가 있으면: <Text className="text-muted-foreground text-xs">{사유}</Text> */}
</Card>
{/* 재제출·재조율 동선 일절 없음. L01 톤(중립 표면색) 재사용 — 신규 컴포넌트 불요 */}

{/* PROGRESS · 강제 마감 제외자 배너 (bg-warning/10, PROGRESS 한정): "응답 마감으로 현재 추천에서 제외되어 있습니다. 지금 제출하면 즉시 반영됩니다." */}
{/* PROGRESS · 강등된 멤버 배너: "주최자가 회원님을 참조자로 변경했습니다{강등 근거 슬롯}. 가용 시간을 업데이트하면 추천에 반영됩니다."
    + (demoteNotes에 값 있으면, v2.2 — 발견 76) 하단 줄 "주최자님의 메모: {의견}" text-foreground — 확정 시점(D01-DONE)까지 기다리지 않고 강등 즉시 실시간으로 노출 */}
{/* PROGRESS · 역강등 요청 대기 중 배너 (v2.1 신설): "참조자 전환을 요청했어요. 주최자님의 확인을 기다리는 중이에요." + <TextLink>요청 취소</TextLink> */}
{/* PROGRESS · 역강등/필수 복귀 요청 거절 배너 (v2.3 신설 — 발견 80·81): "요청이 거절됐어요" — 요청 유형 무관 동일 문구. 대기 배너가 사라지고 결과를 알 수 없게 방치하는 대신 명시적으로 노출 */}
{/* PROGRESS · 필수 복귀 요청 대기 중 배너 (v2.3 신설 — PRD 5.1 [PRD-REINSTATE-REQUEST], 발견 81): "다시 필수 참석자가 되고 싶다고 요청했어요. 주최자님의 확인을 기다리는 중이에요." + <TextLink>요청 취소</TextLink> — 역강등 요청 대기 배너와 동일 컴포넌트, 문구만 분기 */}
{/* PROGRESS · 기간 확장 신규 날짜 안내 (v2.3 신설 — PRD 5.1, 발견 79): 별도 배너는 두지 않는다 — GRID 단계 진입 시 [DS-FLOW-A01-EXTENDED] 뱃지로 즉시 드러나므로 RESULT 단계에서 중복 배너를 추가하지 않는다 */}

{/* COMPLETED — RESULT-CONFIRMED */}
<Card className="bg-success/10 ...">확정 일시 / 등록 안내(3.4 보정) / 불참·미확인 실명(사유 3분기 표시 문구 순화 — [DS-COPY])</Card>
<TextLink className="text-muted-foreground text-xs underline pressed-feedback">내 참석 상황을 확인하거나 바꾸고 싶어요</TextLink>
{/* → SITUATION-AUTH: 본인 선택 목록에서 상태별 분기 (PRD 5.5 경로 A/C) */}

{/* SITUATION-AUTH: 본인 선택 — AUTH 재사용, 헤더 "내 상황 확인하기". 목록에서 미확인자는 "아직 답 안 함 · 지금 제출" 배지로 구분 표시 */}
{/*   제출자 선택 → CANCEL-CONFIRM (경로 A)  /  미확인자 선택 → LATE-JOIN-GRID (경로 C) — 서로 다른 화면으로 즉시 분기, 공용 확인 화면 거치지 않음 */}

{/* LATE-JOIN-GRID (v2.1 신설, 경로 C): GRID 컴포넌트 재사용, submitLabel "시간 제출하기". 제출 후: */}
{/*   확정 슬롯 포함 → 상태 전이 없이 토스트만 "이 시간에 참석 가능하신 걸로 기록했어요" */}
{/*   확정 슬롯 불포함 → CONFLICT 전이, 배너 "뒤늦게 응답했는데 확정된 시간에 참석이 어려워 재조율이 필요해요" */}

{/* CANCEL-CONFIRM (경로 A): 역할 분기 + CF01(2.11) */}
{/* 필수 참석자: "회원님은 필수 참석자예요. 참석을 취소하면 이 시간의 확정이 취소되고, 주최자에게 알려지며 다른 시간을 다시 찾기 시작해요." + [돌아가기]/[참석 취소하기] */}
{/* 선택 참석자: "회원님은 선택 참석자라 회의 진행에는 영향이 없어요. 주최자에게 불참 소식만 전달돼요." + [돌아가기]/[불참 알리기] → 기록 후 RESULT-CONFIRMED 복귀(본인 불참 표기) */}
{/* 주최자 본인도 이 화면을 동일하게 이용한다 — 별도 "주최자 취소" 컴포넌트 없음 ("주최자=참석자" 원칙, PRD 2.5-⑤) */}
{/* v2.7 개정(발견 89) — [참석 취소하기] 확정 직후, 대기 화면(RESULT-CONFIRMED 등)을 거치지 않고 곧바로 QUICK-RECONFIRM 또는 GRID로 강제 진입한다(아래 CONFLICT 참조). 이 강제 진입에서의 뒤로가기는 SITUATION-AUTH가 아니라 취소 자체를 취소(CANCEL-CONFIRM 직전 상태로 복원)한다. */}

{/* CONFLICT — 일반 참석자: 재조율 안내 카드 + <Button bg-primary>내 시간 다시 알려주기</Button> → AUTH → QUICK-RECONFIRM 또는 GRID(v2.7 개정, 발견 89) → 재제출 시 대체안 실시간 재연산 */}
{/* CONFLICT — 이탈자 본인 (AUTH에서 이탈자 선택 시에도 분기), 사유 3종 문구 분기: */}
{/*   경로 A(취소): "이 시간에 참석이 어려워져" / 경로 C(뒤늦은 불일치): "뒤늦게 응답했는데 이 시간이 맞지 않아" / 경로 B(웹훅): "일정이 겹쳐" */}
{/*   v2.8 개정(발견 87): 경로 B 전용 안내·업데이트 동선 미제공 분기 폐지. 경로 A·B·C 전부 일반 참석자와 동일하게 재편집 가능 — 사유 문구(위 3종)만 다르고 그 뒤 동선은 동일 */}

{/* QUICK-RECONFIRM (v2.7 신설, 발견 89·90) — AUTH·CANCEL-CONFIRM 양쪽에서 진입, GRID의 경량 대안 */}
{/* 진입 조건: 1순위 추천 슬롯이 존재하고 부분 성립(레벨 3)이 아니며, 본인의 기존 가용성이 그 슬롯을 이미 AVAILABLE·AVOID로 커버할 때만. 그 외는 전부 GRID로 직행(분기 없음, 이 컴포넌트에 도달하지 않음) */}
<Card className="bg-card border-border rounded-container p-card flex-col gap-2">
  <Text className="text-muted-foreground text-xs">대체 시간 후보</Text>
  <Text className="text-foreground text-lg font-bold">{후보 슬롯 일시}</Text>
  <Text className="text-muted-foreground text-sm">{이름}님은 이미 이 시간에 응답한 적이 있어요. 여전히 가능하신가요?</Text>
</Card>
{/* 기본 상태: <Button bg-primary text-primary-foreground>네, 여전히 가능해요</Button> + <TextLink>다른 시간을 직접 고를게요</TextLink>(→GRID) + <TextLink>뒤로가기</TextLink>(취소 강제 진입이면 취소 취소, 아니면 AUTH) */}
{/* v2.7(발견 90) — 클릭 후(reMatchUpdatedIds에 본인 포함) 화면에 그대로 머물며 버튼이 bg-card border-border text-muted-foreground + disabled 상태로 전환, 라벨 "✓ 반영 완료"로 교체(재요청 버튼 [DS-COMP] 패턴과 동일 톤). 이 상태에서는 하단 링크가 <TextLink>돌아가기</TextLink> 단일 항목으로 축소된다. */}
```

### 2.4 주최자 대시보드### 2.4 주최자 대시보드 (`/host/dashboard`) `[DS-FLOW-D01]`

`[PRD-EX-03]`, `[PRD-EX-04]`, `[PRD-STATE]`, `[PRD-JOURNEY]`, `[PRD-HEATMAP]`, `[PRD-NEXT-ACTION]`, `[PRD-CANCEL-MEETING]` 참조.

```
<ScreenContainer className="bg-background p-screen flex-col gap-4 min-h-screen">

  {/* CANCELLED 가드 (v2.1) — 이 상태면 아래 컴포넌트 전부 미노출, A01의 CANCELLED 카드와 동일 톤의 종료 화면만 렌더링 */}

  {/* [DS-FLOW-D01-NEXT] 주최자 통합 행동 배너 (v2.2 범위 축소 — PRD 3.9, 발견 74 / v2.3 대상 확장 — 발견 81) — AB01보다 상위, 최상단 */}
  {/* 승인/거절이 필요한 요청 전용. 대기 중인 요청이 있으면 유형별로 각각 별도 배너: */}
  {/*   역강등 요청: "{이름}님이 참조자 전환을 요청했어요" + (사유 있으면 "사유: {reason}" 별도 줄, text-muted-foreground) + [승인]/[거절] */}
  {/*   필수 복귀 요청 (v2.3 신설, 발견 81): "{이름}님이 다시 필수 참석자가 되고 싶다고 요청했어요" + (사유 있으면 동일 형식) + [승인]/[거절] */}
  {/*   두 유형이 동시에 대기 중이면 배너 2개를 각각 노출한다 — 하나로 합쳐서 요약하지 않는다(유형이 다르면 승인 결과도 다름) */}
  {/*   (bg-success/10 톤 — 경고 아님, 확인 요청) */}
  {/* 대기 요청이 없으면 배너 자체가 렌더링되지 않는다. */}
  {/* v2.1의 "재요청 시 즉시 합의 가능" 요약 배너는 제거됐다(발견 74) — Top3 카드의 재요청 액션과 완전히 중복이었다.
      EX-03 마감 유예는 이 통합 배너에 흡수되지 않고 기존 AB01/BANNER 자리에서 별도로 노출된다. */}

  {/* [DS-COMP-AB01] 지속 배너 슬롯 — EX-04 충돌·EX-05 이탈 시 최상단 (2.10) */}

  {/* [DS-FLOW-D01-CANCEL] 회의 취소 버튼 (v2.1 신설 — PRD 5.6) — 화면 우상단 또는 링크 카드 하단, 소형 텍스트 버튼 */}
  {/* <TextLink className="text-muted-foreground text-xs underline">이 회의 취소하기</TextLink> → CF01: 결과 문장 + 선택 입력(취소 사유) + [취소]/[회의 취소하기] → CANCELLED 전이 */}

  {/* [DS-FLOW-D01-LINK] 초대 링크 카드 (v1.5) — 노출: status PROGRESS (PRD 2.5-②) */}
  <Card className="bg-card border-border rounded-container p-card flex-col gap-2">
    <Text className="text-muted-foreground text-xs">초대 링크</Text>
    <Text className="text-foreground text-sm font-mono">meetsync.app/m/{meetingId}</Text>
    <FlexRow className="gap-2">
      <Button className="bg-card border-border text-foreground px-3 py-1.5 rounded-element text-xs pressed-feedback">링크 복사</Button>
      {/* 클릭 시: "링크가 복사되었습니다" 토스트 — 연출 (PRD 1.1) */}
      <Button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-element text-xs font-bold pressed-feedback">링크 열어보기</Button>
      {/* 클릭 시: A01 INVITE 진입 — 주최자→참석자 시점 전환의 공식 동선 (PRD 2.5-②) */}
    </FlexRow>
  </Card>

  {/* [DS-FLOW-D01-BANNER] EX-03 경고 배너 — 노출: 가상시계 '마감 도달' AND 의사결정자 PENDING 존재 */}
  <Banner className="bg-destructive/10 border-destructive/20 text-destructive p-card rounded-element text-sm">
    미응답 필수 참석자: {pendingList}. 마감이 유예되었습니다.
    <FlexRow className="gap-2 mt-2">
      <Button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-element text-xs pressed-feedback">독촉 알림 전송</Button>
      {/* 클릭 시: 발송 완료 토스트 — 실발송 없음 (PRD 1.1) */}
      <Button className="bg-card border-border text-foreground px-3 py-1.5 rounded-element text-xs pressed-feedback">제외하고 강제 마감</Button>
    </FlexRow>
  </Banner>

  {/* [DS-FLOW-D01-STATUS] 응답 현황 — 상시. 멤버별 칩: SUBMITTED=text-success / PENDING=text-muted-foreground */}
  {/* v2.4(발견 86): periodExtendedFrom이 설정돼 있으면(기간 확장 이력 있음) "제출 완료" 판정 기준이 바뀐다 —
      SUBMITTED 여부가 아니라 extensionUpdatedIds(확장 이후 실제로 재제출한 사람) 기준으로 카운트·칩을 그린다.
      기간을 넓혔는데 화면은 여전히 "전원 제출 완료"로 보이는 것 자체가 결함이었다(발견 86 핵심). */}
  <Card className="bg-card border-border rounded-container p-card">
    <Text className="text-foreground font-semibold text-sm">
      {/* periodExtendedFrom 없음: "응답 현황 {submittedCount}/6 완료" (기존)
          periodExtendedFrom 있음: "응답 현황 {extensionUpdatedIds.length}/6 완료 (기간 확장 — 새 날짜 응답 필요)" */}
      응답 현황 {submittedCount}/6 완료
    </Text>
  </Card>

  {/* [DS-FLOW-D01-HEAT] 집계 가시성 뷰 (v1.5) — PRD 3.8. 기본 접힘 */}
  <Collapsible className="bg-card border-border rounded-container">
    <ToggleRow className="p-card pressed-feedback flex justify-between">
      <Text className="text-foreground font-semibold text-sm">전체 가용 현황 보기</Text>
      <Text className="text-muted-foreground text-xs">{펼침 ? "접기 ▲" : "펼치기 ▼"}</Text>
    </ToggleRow>
    {/* 펼침 시: */}
    <HeatGrid className="p-card">
      {/* 밀도(v1.9): bg-heat-{가능 인원수} 오퍼시티 스케일 (1.1) / 마커: 확정 ring-success 상시 + "확정된 시간" 라벨, 탐색 선택 ring-ring — 분리 필수 */}
      {/* 터치 타겟 (v1.9 — PRD 1.7-B, 발견 52): 셀 최소 36×36px (h-9 이상) */}
      {/* 읽기 전용 — 편집 경로 금지 (PRD 3.8). pressed-feedback은 선택용으로만 */}
    </HeatGrid>
    {/* 슬롯 선택 시: 하단 상세 — 인원별 상태를 이름과 함께, 좌측 정렬 (PRD 1.7-A 정렬 일관성 규칙) */}
    <SlotDetail className="p-card border-t border-border flex-col text-left">
      <Text className="text-foreground text-sm font-medium">{선택 슬롯 일시}</Text>
      {/* 행 구성 (v1.6 — 5종 구분): {이름} — 가능(text-success) / 비선호(text-warning) / 불가(text-destructive · 유저 선언) / 미확인(text-muted-foreground · 미지정) / 외부 일정(text-muted-foreground · 잠금) */}
      {/* 참조자는 이름 옆 "(선택)" 마이크로 라벨 text-muted-foreground — 필수 참석자와 시각 구분 (PRD 3.8) */}
    </SlotDetail>
  </Collapsible>

  {/* [DS-FLOW-D01-RESULT] 추천 Top 3 — 노출: 필수 참석자 전원 제출 또는 강제 마감 (PRD 3.7) */}
  {/* 정렬 우선순위 (v1.9 — PRD 3.4 역전, 발견 49): ①비선호 필수 참석자 최소 ②선택 참석자 참여 최대 ③빠른 시간 */}
  <FlexCol className="gap-2 text-left">
    <Text className="text-foreground text-xl font-bold">추천 시간 Top 3</Text>
    {top3.map((slot, rank) => (
      <RecommendCard key={slot.key}
        className={rank === 0
          ? "bg-success/10 border-border rounded-container p-card text-left"
          : "bg-card border-border rounded-container p-card text-left"}>
        {/* 카드 본문 좌측 정렬 — CF01 확인 영역만 예외 (PRD 1.7-A 정렬 일관성 규칙, 발견 47) */}
        <FlexRow className="justify-between items-center">
          <FlexCol className="gap-1 text-left">
            <Text className="text-foreground font-semibold text-sm">{slot 일시 표기}</Text>
            {/* 라벨: "모두 가능한 시간이에요"·"제출한 사람은 모두 가능해요"=text-success / "선택 참석자 n명 빼고 가능해요"·"일부는 피하고 싶은 시간이에요"=text-warning / "n명은 참석 못 해요"=text-destructive */}
            <Badge className="text-xs">{slot.relaxationLabel}</Badge>
            {/* [DS-FLOW-D01-NAMES] 인원 실명 서브라인 — 사유 3분기 (v1.9 — [PRD-ABSENCE-REASON], 발견 48) */}
            {/* 미확인(강제 마감 배제): "미확인: {이름}" / 참석 불가(데이터 근거): "참석 못 함: {이름}" / 자발적 불참(경로 A): "불참 알림: {이름}" — 세 사유를 같은 문구로 합치지 않는다 */}
            <Text className="text-muted-foreground text-xs">{예: "피하고 싶은 시간대: 김주최, 이디자" / "참석 못 함: 이디자(다른 일정 있음) · 아직 답 안 함: 박개발"}</Text>
            {/* [DS-FLOW-D01-WHY] 근거 펼침 (v1.9, 선택 적용 — PRD 3.4 투명성): <TextLink className="text-muted-foreground text-[11px] underline">왜 이 순서인가요?</TextLink> → 펼침 시 1줄 근거, 예: "피하고 싶어하는 사람이 가장 적어서" */}
            {/* EX-04 갱신 신규 진입 카드: 라벨 옆 "새 추천" 마이크로 뱃지 text-warning (v1.6 — PRD 5.4-4) */}
          </FlexCol>

          {/* [DS-FLOW-D01-CONFIRM] 확정 확인 (v1.9 개정) — armed 폐기, 확인 영역 CF01(2.11) 적용, 중앙 정렬 예외 유지 (PRD 3.4) */}
          {/* level 0~2: [최종 확정] → CF01 확장(text-center). 문장: 전원 "전원이 참석 가능한 시간입니다." / 비선호 "{이름들}님이 피하고 싶은 시간입니다. 확정 전 양해를 구하는 것이 좋습니다." */}
          {/* 강제 마감 배제자 존재 시 (v1.9 — [PRD-ABSENCE-REASON], 발견 48): 문장에 사유 추가 — "{이름}님은 답이 없어 포함되지 않았습니다." 라벨만으로는 이유가 안 드러나므로 문장으로 보강 */}
          {/* level 3(부분 성립): [최종 확정] 버튼 자체 미노출 — 불변식 (PRD 2.7). 노출 시 결함 */}
          <Button className="bg-primary text-primary-foreground px-4 py-2 rounded-element text-xs font-bold pressed-feedback">최종 확정</Button>
        </FlexRow>

        {/* [DS-FLOW-D01-DEADLOCK] 교착 해소 (v2.1 위계 재조립 — PRD 5.1) — level 3 한정, 3액션 */}
        {/* ① 주 액션 [가용성 재요청] bg-primary — "{이름}님이 이 시간을 열어주면 전원 참석이 가능합니다" */}
        {/*    발송 후: "재요청 보냄 ✓" 비활성 톤(bg-card border-border text-muted-foreground) — 무상태 금지 (발견 31) */}
        {/* ② 보조 [{이름}님을 참조자로 변경하고 진행] — 불참 예상 필수 1명일 때만, 텍스트 버튼(text-muted-foreground underline) */}
        {/*    탭 → CF01: 재요청 이력 라인 + 결과 문장 + [의견 남기기](선택 텍스트 입력, v2.1 신설 — "회의 전 남기고 싶은 의견이 있으신가요? (선택)") + [취소]/[참조자로 변경] */}
        {/*    남긴 의견은 강등 당사자의 참석자 결과 안내([DS-FLOW-A01-RESULT])에만 노출된다 — D01-DONE 히어로에는 노출하지 않는다 (v2.3 정정, 발견 82) */}
        {/* ③ [기간 넓혀서 다시 찾기] (v2.1 신설, v2.3 통지 보강 — 발견 79) — 텍스트 버튼, 재요청·강등과 나란히 상시 노출(불참 인원수 무관). 실행 시 기간 확장 후 재계산 + 전원 통지 커밋([DS-FLOW-A01-EXTENDED]에서 소비) — [재요청]과 무관한 별개 액션이므로 재요청 발송 이력과 섞지 않는다. 주최자에게는 "조율 기간을 넓혔어요 — 다시 계산할게요" 토스트만 노출(경량 피드백, 1.5) */}
        {/* ④ 필수 2명 이상 불가: 강등(②) 미제안, 재요청·기간 확장은 그대로 노출 — "필수 참석자 2명 이상이 불가한 시간입니다. 재요청하거나 기간을 넓혀보세요." */}
        {/* ⑤ 주최자 본인 병목: "주최자 본인의 가용 시간을 조정해야 합니다" (재요청·강등 미노출, 기간 확장은 노출) */}
        {/* ⑥ 잠금 병목: "{이름}님은 해당 시간에 외부 일정이 있습니다" — 재요청 미노출, 강등·기간 확장은 가능 */}
      </RecommendCard>
    ))}
  </FlexCol>

  {/* [DS-FLOW-D01-DONE] 확정 완료 히어로 (v1.6 격상) — 노출: status COMPLETED (PRD 2.5-⑥) */}
  {/* 강등 의견 — 이 히어로에는 노출하지 않는다 (v2.3 정정, 발견 82). 의견은 주최자가 강등 당사자에게 남긴 메모이지 주최자 자신에게 남긴 게 아니다.
      주최자 본인의 확정 완료 화면에 자신이 쓴 메모를 다시 보여주는 것은 무의미하다 — 노출은 강등 당사자의 PROGRESS 재진입 배너([DS-FLOW-A01-RESULT]) 단독. v2.1 스펙의 "히어로 하단 노출"은 이 화면 성격을 잘못 짚은 것이었다. */}
  {/* COMPLETED 시 위계 (섹션 3.4 [DS-HIERARCHY]): 본 히어로가 화면 최상단 1순위. 일시는 text-3xl 대형 표기 */}
  {/* 등록 문구 (PRD 3.4 보정): 전원 참석 가능 → "전원 캘린더에 등록되었습니다" / 불참·미확인 존재 → "참석 가능 인원(n명)의 캘린더에 등록되었습니다" + "불참 예상: {이름들}" text-warning 라인 */}
  <Card className="bg-success/10 border-border rounded-container p-card flex-col gap-3 text-center">
    <Text className="text-muted-foreground text-xs">회의 확정 완료</Text>
    <Text className="text-foreground text-xl font-bold">{확정 일시 표기}</Text>
    <Text className="text-success text-sm">전원 캘린더에 등록되었습니다</Text>
    <Button className="bg-primary text-primary-foreground w-full py-3 rounded-element text-sm font-bold pressed-feedback">
      새 회의 만들기
    </Button>
    {/* 1탭: 버튼이 확인 상태로 전환 — "저장된 데모 데이터가 삭제됩니다 · 다시 탭하여 확인" (alert 금지) */}
    {/* 2탭: 데이터 초기화(PRD 7.4) 후 L01 이동 (PRD 2.5-⑥) */}
  </Card>

  {/* [DS-FLOW-D01-SYNC] EX-04 싱크 체크 오버레이 — 확정 클릭 후 0.8초간만 */}
  <Overlay className="bg-devpanel text-primary-foreground fixed inset-0 flex items-center justify-center font-bold">
    전원 캘린더 가용성 검증 중...
  </Overlay>
  {/* 통과: COMPLETED 전이(커밋 — PRD 7.2) + "전원 캘린더에 등록되었습니다" 토스트 */}
  {/* 충돌(토글 ON): m4 실데이터 변동+커밋 → 재연산 → 지속 배너(AB01) "그사이 박기획님의 일정에 변동이 생겨 추천 결과를 갱신했습니다" (PRD 5.4) */}

</ScreenContainer>
```

### 2.5 재조율 우회 플로우 (`/host/re-match`) `[DS-FLOW-R01]`

`[PRD-EX-05]`, `[PRD-REMATCH]` 참조.

```
<ScreenContainer className="bg-warning/10 p-screen flex-col gap-4 min-h-screen">

  {/* [DS-COMP-AB01] EX-05 이탈 배너 슬롯 — 최상단 */}

  {/* [DS-FLOW-R01-NOTICE] 충돌 안내 */}
  <FlexCol className="gap-2">
    <Text className="text-warning text-xl font-bold">일정 재조율이 필요합니다</Text>
    <Text className="text-warning text-sm">
      {이탈 멤버명}님이 확정된 회의 일정을 취소했습니다. 기존 응답 데이터를 유지한 채 대체 시간을 추천합니다.
    </Text>
  </FlexCol>

  {/* [DS-FLOW-R01-STATUS] 재조율 반영 현황 (v2.3 신설 — PRD 6-2A [PRD-REMATCH], 발견 83 / v2.4 게이팅 강화 — PRD 6-2B, 발견 84) — D01-STATUS(응답 현황 카드)와 대칭, NOTICE 바로 아래 */}
  <Card className="bg-card border-border rounded-container p-card">
    <Text className="text-foreground font-semibold text-sm">재조율 반영 현황 {updatedCount}/{meeting.members.length}명</Text>
    <FlexRow className="gap-3 flex-wrap">
      {/* 멤버별 칩: 이탈(CONFLICT 진입) 시점 이후 가용성을 갱신한 사람 = text-success "✓ 갱신함" / 아직 갱신 안 한 사람 = text-muted-foreground "… 대기" */}
      {/* 판정 근거는 "최초 제출 여부"(status SUBMITTED)가 아니라 "이탈 시점 이후 갱신 여부" — 확정 전부터 이미 SUBMITTED였던 멤버도 재조율 국면에서 갱신 전이면 "대기"로 표기 */}
      {/* 경로 A·C의 이탈 유발 본인은 이탈 선언 자체가 갱신으로 간주되어 즉시 "✓ 갱신함" (PRD 6-2B) — 경로 B(웹훅)는 v2.8부터 동일하게 목록·연산 대상이지만, 본인의 선언 행위가 없으므로 실제 재제출 전까지는 "… 대기"로 표시 */}
    </FlexRow>
  </Card>

  {/* [DS-FLOW-R01-GATE] 최종 확정 게이팅 (v2.4 신설 — PRD 6-2B, 발견 84) */}
  {/* pendingRequiredReflect.length === 0 이면 D01-RESULT 카드에 [최종 확정] 버튼을 평소대로 노출.
      pendingRequiredReflect.length > 0 이면 카드마다 버튼 자리에 안내 문구로 대체: */}
  {/* <Text className="text-muted-foreground text-sm text-center">모든 필수 참석자가 갱신하면 최종 확정할 수 있어요</Text> */}
  {/* 대상 판정 (v2.8 개정): 필수 참석자 전원이 대상 — 경로(A·B·C) 무관하게 reMatchUpdatedIds 포함 여부로 판정. 경로 A·C 이탈 유발 본인은 이탈 처리 시점에 이미 포함되고, 경로 B는 본인의 실제 재제출 시점에 포함된다 */}
  {/* 별도의 강제 확정(우회) 경로는 두지 않는다 — 재조율은 5.3 강제 마감과 달리 시한이 없는 국면 (PRD 6-2B) */}

  {/* [DS-FLOW-R01-RESULT] 대체안 카드 — D01-RESULT 컴포넌트 재사용 (실명 표기 포함), 이탈자 포함 전원 재연산 (v2.8 개정) */}
  <FlexCol className="gap-2">
    {/* 라벨: 이탈자도 연산에 포함되므로 일반 3.4 라벨 규칙을 그대로 적용한다 — "응답자 전원 가능" 보정은 더 이상 이탈자 제외를 전제로 하지 않는다 */}
    {/* 확정 버튼·EX-04 검증 동일 적용, 성공 시 COMPLETED 재전이+커밋 (PRD 6.3) */}
  </FlexCol>

  {/* [DS-FLOW-R01-GUARD] CONFLICT 아닌 상태 진입 시: NOTICE/RESULT 대신 아래만 (PRD 6.5) */}
  <FlexCol className="gap-3 items-center">
    <Text className="text-muted-foreground text-sm">현재 재조율이 필요한 회의가 없습니다.</Text>
    <Button className="bg-primary text-primary-foreground rounded-element px-4 py-2 text-xs font-bold pressed-feedback">대시보드로 돌아가기</Button>
  </FlexCol>

</ScreenContainer>
```

### 2.6 데모 가이드 화면 (`/guide`) `[DS-FLOW-GD01]` (v1.5)

`[PRD-SIM-GUIDE]` 1.6. 제품 UI와 구분되는 devpanel 룩 전면 적용 — "데모 사용 설명서"임이 즉시 인지되어야 한다. 역할·단계 표시(CX01) 미노출. 상태와 무관하게 항상 진입 가능.

```
<ScreenContainer className="bg-devpanel text-devpanel-foreground p-screen flex-col gap-6 min-h-screen font-mono text-sm">

  <BackButton className="text-devpanel-foreground text-xs pressed-feedback">← 랜딩으로 돌아가기</BackButton>
  <Text className="text-primary-foreground text-xl font-bold">DEMO GUIDE</Text>

  {/* [DS-FLOW-GD01-BODY] 섹션 5개 — PRD 1.6 내용과 1:1 */}
  <GuideSection title="1. 권장 시연 순서">   {/* PRD 1.2 페르소나 플로우 8단계 요약 */}
  <GuideSection title="2. 시나리오 패널 열기"> {/* Ctrl+Shift+D / 로고 5회 탭 */}
  <GuideSection title="3. 예외 시나리오 발동법"> {/* EX-01~05: 발동 방법 + 관찰 포인트 */}
  <GuideSection title="4. 두 창으로 나란히 보기"> {/* 참석자 창 제출 → 주최자 창 실시간 갱신 (PRD 7.6). 경계: 시나리오 토글·가상 시계는 창별 독립 */}
  <GuideSection title="5. 데이터 초기화">     {/* 패널 [데이터 초기화] 또는 완료 화면 [새 회의 만들기] */}

  {/* [DS-FLOW-GD01-STRUCT] 스캔 가능 구조 (v1.6 — PRD 1.6): 문단 나열 금지 */}
  {/* 섹션 1 시연 순서: 번호 원형 뱃지 + 한 줄 설명의 단계 카드 목록 (border-border 행) */}
  {/* 섹션 2 단축키: <Kbd> 키 캡 칩 — border rounded-element px-1.5 모노스페이스 (예: [Ctrl]+[Shift]+[D]) */}
  {/* 섹션 3 EX-01~05: 각 항목을 3단 블록으로 — "발동 조건" / "조작" / "기대되는 화면 변화" 레이블드 행 */}
  {/* 각 GuideSection: text-primary-foreground 제목 + text-devpanel-foreground 본문. 시나리오 토글 미배치 — 제어는 패널로 일원화 (PRD 1.6) */}

</ScreenContainer>
```

### 2.7 시나리오 제어 패널 `[DS-FLOW-P01]`

**반응형 (v1.9 — PRD 1.7-B, 발견 53):** 좁은 뷰포트에서 항목이 여러 줄로 쌓이며 본문을 가리는 것을 방지한다. 모바일 기준 패널은 `max-h-[40vh] overflow-y-auto` 내부 스크롤을 갖거나, 기본은 접힌 요약 행(예: "EX-04 OFF · 마감 전") 하나만 노출하고 탭하면 펼쳐지는 구조로 전환한다.

`[PRD-SIM-PANEL]` 참조. **제품 UI와 시각적으로 명확히 구분되는 개발자 도구 룩** (다크 + 모노스페이스).

```
<Panel className="bg-devpanel text-devpanel-foreground fixed bottom-0 inset-x-0 p-card font-mono text-xs z-50">
  {/* 기본 숨김. Ctrl+Shift+D(데스크톱) / 로고 5회 연속 탭·2초 내(모바일) 토글 */}
  {/* 우측 상단 닫기(X) 버튼 상시 — 제스처만으로 닫게 하는 것 금지 (PRD 1.4) */}
  {/* 터치 타겟 (v2.8 — PRD 1.7-B [PRD-RESPONSIVE], 발견 52 재적용): 닫기(X) 히트박스가 글자 크기만큼만 잡히던 것을 min-w-11 min-h-11(44×44) + -m-2로 시각 레이아웃 변경 없이 확대 */}
  {/* 하단 시트 — 열린 상태에서도 제품 조작 가능 (PRD 1.4) */}

  <FlexRow className="justify-between items-center gap-4 flex-wrap">
    <Toggle label="가상 시계" options={["마감 전", "마감 도달"]} />
    <Toggle label="EX-04 확정 충돌" options={["OFF", "ON"]} />
    <ActionButton label="EX-05 이탈 발생시키기" />
    {/* v1.6 단발 버튼 (PRD 5.5): COMPLETED에서만 활성. 비활성 시 disabled-state + 사유 힌트 */}
    <Button className="border-border rounded-element px-3 py-1.5 pressed-feedback">데이터 초기화</Button>
  </FlexRow>

  {/* [DS-FLOW-P01-HINT] 관찰 가능성 힌트 (v1.6 — PRD 1.4/1.7): 각 제어 하단에 text-devpanel-foreground text-[10px] 상시 힌트 1줄 */}
  {/* 가상 시계 '마감 도달': "미응답 의사결정자가 있으면 대시보드에 경고 배너가 뜹니다" / '마감 전': "마감 판정이 발생하지 않습니다" */}
  {/* EX-04 ON: "다음 확정 시도는 충돌합니다" / OFF: "확정이 정상 성공합니다" */}
  {/* 이탈 버튼 활성: "실행 시 즉시 재조율 국면으로 전환됩니다" / 비활성: "확정 완료 상태에서만 발동합니다" */}

  {/* 화면 바로가기 — 진입 가드(PRD 2.6)의 적용을 받는다: 차단 조합은 리다이렉트/대체 렌더링 */}
  <FlexRow className="gap-2 mt-2">
    <JumpButton>L01 랜딩</JumpButton>
    <JumpButton>H01 발의</JumpButton>
    <JumpButton>A01 참석자</JumpButton>
    <JumpButton>D01 대시보드</JumpButton>
    <JumpButton>R01 재조율</JumpButton>
  </FlexRow>
</Panel>
```

### 2.8 토스트 컴포넌트 `[DS-COMP-T01]`

경량 피드백 전용 (`[PRD-NOTICE]`). `alert()` 사용 금지. 노출 2.5초 후 자동 소멸, 동시 1개.

```
<Toast className="bg-primary text-primary-foreground rounded-element p-card text-sm fixed top-4 inset-x-4 z-40">
  {message}
</Toast>
```

### 2.9 글로벌 브랜드 바 + 컨텍스트 표시 `[DS-COMP-B01]` `[DS-COMP-CX01]`

브랜드 바(B01)는 **전 화면** 상단 공통 — 로고가 모바일 패널 호출(5회 탭) 타겟. 역할·단계 표시(CX01)는 **제품 화면(H01·A01·D01·R01)에만** 노출 (v1.5 — PRD 2.3 적용 범위): L01·GD01에는 브랜드 바만 노출한다.

```
<BrandBar className="bg-card border-border px-6 py-3 border-b flex justify-between items-center">
  <Text className="text-foreground font-bold text-sm">MeetSync</Text>
  {/* [DS-COMP-CX01-ROLE] 역할 뱃지 — 제품 화면 한정. 주최자: bg-primary / 참석자: bg-success, 공통 text-primary-foreground */}
  {/* A01 본인 선택 후: "참석자 화면 · {이름}" (PRD 2.3) */}
  {/* 텍스트 오버플로 방지 (v1.9 — PRD 1.7-B, 발견 54): max-w-[160px] truncate — 이름이 길어도 뱃지가 줄바꿈되거나 레이아웃을 깨지 않는다 */}
  <Badge className="rounded-element px-2 py-1 text-xs font-medium max-w-[160px] truncate">{역할 표기}</Badge>
</BrandBar>

{/* [DS-COMP-CX01-STEP] 진행 단계 — 제품 화면 한정, 브랜드 바 직하단. PRD 2.3 도출 규칙(의사결정자 기준)과 1:1 */}
<StepIndicator className="bg-card border-border border-b px-6 py-2 flex gap-2">
  {/* 발의 → 응답 수집 → 조율·확정 → 완료. 현재: text-foreground font-semibold, 그 외: text-muted-foreground */}
  {/* CONFLICT: ③으로 회귀 + text-warning 강조 */}
</StepIndicator>
```

### 2.10 지속 알림 배너 `[DS-COMP-AB01]`

**노출 범위 (v1.8 — PRD 1.5):** D01·R01 한정. A01은 당사자별 안내(2.3.5)로 대체 — 상단 배너 미노출.

`[PRD-NOTICE]` 중요 알림 전용. 토스트 혼용 금지 — EX-04 충돌·EX-05 이탈은 반드시 이 컴포넌트.

```
<AlertBanner className="bg-destructive/10 border-destructive/20 text-destructive p-card rounded-element text-sm flex justify-between items-start gap-2">
  <Text>{알림 본문}</Text>
  <CloseButton className="text-destructive pressed-feedback min-w-11 min-h-11 flex items-center justify-center -m-2 shrink-0">✕</CloseButton>
  {/* 터치 타겟 (v2.8 — PRD 1.7-B [PRD-RESPONSIVE], 발견 52 재적용): min-w-11 min-h-11(44×44) + -m-2로 시각 레이아웃 변경 없이 히트박스만 확대 */}
  {/* 수동 닫기 전까지 유지, 화면 전환에도 유지 */}
  {/* 해소 규칙 (v1.5): 유발 상황이 해소되면 자동 해제 — EX-04 배너는 확정 성공 시, EX-05 배너는 재조율 확정 성공 시 (PRD 1.5) */}
</AlertBanner>
```

---

### 2.11 확인 영역 `[DS-COMP-CF01]` (v1.7)

무게 있는 결정(확정·강등·강제 마감·참석 취소·새 회의 만들기)의 공통 확인 패턴 — PRD 3.4. armed 버튼(문구 변형+자동 소멸) 전면 폐기.

```
{/* 트리거 1탭 → 카드/영역 하단 확장 */}
<ConfirmArea className="border-t border-border pt-3 mt-2 flex-col gap-2">
  {/* ① 이력 라인(강등·강제 마감): 미발송 경고(text-warning) + [먼저 보내기] 보조 버튼 / 발송됨 "✓" text-muted-foreground */}
  {/* ② 결과 문장(text-foreground text-sm) — 주어·대상·결과 명시 */}
  {/* ③ 액션 2개: [취소](bg-card border-border) + [실행 라벨](bg-primary) — 명시적 취소 필수 */}
</ConfirmArea>
{/* 자동 소멸 없음. 접힘: [취소] 또는 다른 트리거 조작 시만. 동시 1개만 열림 */}
```

## 3. 상태별 노출 규칙 (정합성 검증표) `[DS-STATE-MAP]`

코드 재생성 시 아래 표와 렌더링 결과가 1:1로 일치해야 한다. 표에 없는 조합에서 컴포넌트를 노출하는 것은 결함이다.

### 3.1 회의 상태 × 화면 진입 — PRD 2.6 가드 표와 1:1

| 회의 상태 | L01 | GD01 | H01 | A01 | D01 | R01 |
|---|---|---|---|---|---|---|
| PROGRESS (미발의) | ○ | ○ | ○ | → H01 | → H01 | → H01 |
| PROGRESS (발의 후) | ○ | ○ | ○ (권한·제목 잠금) | ○ (4단계 + 당사자 배너) | ○ | 가드 상태 (R01-GUARD) |
| COMPLETED | ○ | ○ | → D01 리다이렉트 | RESULT-CONFIRMED만 렌더링 (경로 A/C 분기) | ○ (D01-DONE 표기) | 가드 상태 (R01-GUARD) |
| CONFLICT | ○ | ○ | → R01 리다이렉트 | 당사자별 (일반·경로A·경로C: 안내+가용성 업데이트 / 경로B: 전용) | → R01 리다이렉트 | ○ (재조율 플로우) |
| CANCELLED (v2.1 신규) | ○ | ○ | → D01 리다이렉트 | 종료 안내만 렌더링 | 종료 화면 (다른 컴포넌트 전부 미노출) | → D01 리다이렉트 |

- 탭 간 동기화(PRD 7.6)로 상태가 수신된 경우에도 본 표를 즉시 적용한다.
- CANCELLED는 최우선 가드다 — 다른 어떤 상태 판정보다 먼저 확인한다 (되돌릴 수 없는 종결 상태).

### 3.2 D01 컴포넌트 매트릭스

| 조건 | LINK | BANNER | STATUS | HEAT | RESULT | DONE | SYNC |
|---|---|---|---|---|---|---|---|
| PROGRESS · 마감 전 · 의사결정자 PENDING 존재 | ○ | ✕ | ○ (n/6) | ○ (접힘) | ✕ (유예 전 미노출) | ✕ | ✕ |
| PROGRESS · 마감 도달 · 의사결정자 PENDING 존재 | ○ | ○ | ○ | ○ | ✕ (유예) | ✕ | ✕ |
| PROGRESS · 의사결정자 전원 제출 (또는 강제 마감) | ○ | ✕ | ○ | ○ | ○ | ✕ | ✕ |
| 확정 클릭 직후 0.8초 | — | — | — | — | — | — | ○ |
| COMPLETED | ✕ | ✕ | ○ | ○ | ✕ | ○ | ✕ |

- 참조자 PENDING은 BANNER·RESULT 판정에 영향을 주지 않는다 (PRD 3.7). STATUS 칩에만 미응답으로 남는다.

### 3.3 A01 단계 매트릭스

| 조건 | INVITE | AUTH | GRID | DONE | RESULT-CONFIRMED | RESULT-REMATCH |
|---|---|---|---|---|---|---|
| PROGRESS · 최초 진입 | ○ | ✕ | ✕ | ✕ | ✕ | ✕ |
| PROGRESS · [바로 응답] 후 | ✕ | ○ | ✕ | ✕ | ✕ | ✕ |
| PROGRESS · 본인 선택 후 | ✕ | ✕ | ○ | ✕ | ✕ | ✕ |
| PROGRESS · 제출 직후 | ✕ | ✕ | ✕ | ○ | ✕ | ✕ |
| COMPLETED | ✕ | ✕ | ✕ | ✕ | ○ | ✕ |
| CONFLICT | ✕ | ✕ | ✕ | ✕ | ✕ | ○ |

### 3.4 상태별 컴포넌트 위계 규칙 `[DS-HIERARCHY]` (v1.6)

노출표(3.1~3.3)는 컴포넌트의 **존재**를, 본 규칙은 **순서와 비중**을 정의한다. 상태가 바뀌었는데 이전 국면의 레이아웃을 재사용하는 것은 결함이다 (PRD 2.5-⑥).

| 회의 상태 | D01 위계 (위→아래) |
|---|---|
| PROGRESS | LINK → BANNER(조건부) → STATUS → HEAT(접힘) → RESULT |
| COMPLETED | **DONE 히어로 (일시 대형 표기)** → HEAT(접힘 · "조율 근거 다시 보기" 라벨 · 확정 슬롯에 링 마커) → STATUS(한 줄 요약으로 축소: "6명 응답 완료") |

- COMPLETED에서 LINK·BANNER·RESULT는 미노출 (3.2와 동일) — 위계 대상 자체가 아니다.
- HEAT의 확정 슬롯 마커: 해당 슬롯에 `ring-2` + primary 계열 링. 상세 선택 시 "확정된 시간" 라벨 병기.

---

## 4. 사용자 노출 문구 사전 `[DS-COPY]` (v1.8)

`[PRD-COPY]` 1.8과 1:1. 아래 표는 코드의 모든 사용자 노출 문자열이 준수해야 하는 치환표다. 좌측 용어가 화면에 그대로 노출되면 결함이다.

| 금지 (기획/개발 용어) | 사용 (일상어) | 적용 예 |
|---|---|---|
| 가용 시간 선택 | 내 시간 선택하기 | A01 그리드 헤더 |
| 가용성 최종 제출 | 시간 제출하기 | A01 제출 버튼 |
| 가용 시간 업데이트 / 가용성 업데이트 | 내 시간 다시 알려주기 | A01·R01 재편집 동선 |
| 의사결정자 | 필수 참석자 | H01 권한 뱃지, 카드 서브라인 |
| 참조자 | 선택 참석자 | H01 권한 뱃지, 현황 칩 |
| 부분 성립 / n명 참석 불가 | (라벨 삭제 — 사유 문구로 대체, 예: "일부만 가능") | D01 추천 카드 |
| 응답 현황 | 제출 현황 | D01 현황 카드 |
| 조율 근거 다시 보기 | 다른 시간대 비교해보기 | D01 COMPLETED 히트맵 접힘 라벨 |
| 재요청 보냄 ✓ | 다시 요청했어요 | 부분 성립 카드 재요청 버튼 |
| 응답자 전원 가능 / 전원 가능 | 모두 가능한 시간이에요 | 추천 카드 라벨 |
| 비선호 시간 포함 | 일부는 피하고 싶은 시간이에요 | 추천 카드 라벨 |
| 미확인 | 아직 답 안 한 사람 | 히트맵 상세, 서브라인 |
| 불가 | 안 되는 시간 | 히트맵 상세 |
| 외부 일정 | 다른 일정 있음 | 히트맵 상세, 잠금 캡션 |

- 데모 가이드(GD01)와 시나리오 패널(P01)은 심사자용 개발자 도구이므로 본 표 적용 대상이 아니다 — EX-01 등 기술 지칭을 그대로 쓴다.

**v2.1 추가 항목 — 신규 기능 및 표시 문구 순화 (PRD 1.7-A 확장)**

| 금지/후보 | 사용 (일상어) | 적용 예 |
|---|---|---|
| 이 회의를 삭제합니다 | 이 회의를 취소합니다 | D01 회의 취소 CF01 |
| 이 날 전체 안 됨 | 이 날 종일 안 돼요 | A01 그리드 날짜 헤더 액션 |
| 조건 완화 요청 | 참조자 전환을 요청했어요 | A01 역강등 요청 대기 배너 |
| 기간 확장 재계산 | 기간 넓혀서 다시 찾기 | D01 교착 해소 보조 액션 |
| (히트맵 상세) 불가 | 다른 일정이 있어요 / 이 시간은 어려워요 | 타인이 보는 화면 한정 (본인 화면은 정확한 상태명 유지) |
| (완료 화면) 불참 예상 | 미확인 (마감까지 답 없었음) / 참석 못 함 / 불참 알림 — [PRD-ABSENCE-REASON] 3분기 유지 | 완료 화면 불참 목록 (사유별 순화, 통합 문구 금지) |

- **원칙 (PRD 1.7-A 표시 문구 순화 규칙):** 본인이 아닌 타인이 보는 화면에서만 말투를 순화한다. 내부 분류명(`UNCONFIRMED`·`UNAVAILABLE_SLOT`·`SELF_DECLINED` 등)과 사유 판정 로직은 그대로 유지 — 정확성을 낮추지 않고 표현만 조정한다.
