# 💻 [문서 3] 개발 모킹 데이터 & 가상 라우팅 가이드 (Dev MD)

본 문서는 서버 백엔드가 없는 단일 클라이언트 웹앱(`app.js`) 환경에서 01_master_prd.md **v3.0**의 기획 요건과 예외 처리 알고리즘을 재현하기 위한 데이터 스키마, 함수 명세, 가상 라우팅 가이드입니다. 본 문서의 모든 항목은 PRD와 02_design_system.md **v2.9**의 태그를 참조하며, PRD에 없는 동작을 임의로 추가하지 않습니다.

---

## 0. 버전 히스토리

| 버전 | 변경 내용 |
|---|---|
| v2.8 | 실무자 셀프서브 감사 반영(발견 94) — ① §1.2 `const SEED_MEETING_DATA` pseudo-code가 실제 코드 구조(그런 이름의 최상위 상수 없음 — `buildSeedData()` 함수의 반환값)와 달랐던 것을 정정. ② 코드 내 stale 고정 줄번호 주석("아래 1030행 근처")을 이 프로젝트의 태그/컴포넌트명 참조 관례에 맞게 교체. 3.0의 실측 검증 관례(browser QA + esbuild + 로직 회귀)를 그대로 재적용해 확인 |
| v2.7 | 부트스트랩 자체 완결(발견 93, [DS-TOKEN 구현 규칙] 개정) — ① Tailwind Play CDN `<script>`를 index.html이 미리 갖고 있어야 한다는 전제를 없애고 app.js가 직접 주입(호스트가 여전히 수동으로 넣어둔 경우도 감지해 하위 호환). config는 반드시 그 스크립트의 onload 콜백 안에서 설정해야 함을 실측으로 확인 — 미리 설정하면 CDN 스크립트가 window.tailwind를 재초기화하며 덮어씀. ② Geist 폰트 로드 경로가 `geist@1/dist/fonts/geist-sans/style.css`(jsdelivr 404 — 그 패키지는 애초에 완성 CSS를 배포하지 않음)였던 걸 실제 존재하는 .woff2 4종(Regular/Medium/SemiBold/Bold, 코드가 실제 쓰는 굵기와 1:1) 직접 참조 @font-face로 교체. `document.fonts` API로 4개 폰트 페이스 등록·로드 확인 |
| v2.6 | 컴포넌트 아키텍처 리팩터(발견 92, 3.0 신설) — 화면 16개가 App() 내부 클로저·일반 함수 호출이었던 구조를 실제 함수 컴포넌트 + AppContext 구독으로 전환. JSX·로직은 문자열 리터럴 189개 전수 대조로 불변 확인, esbuild 번들 + 브라우저 수동 QA(전 화면·주요 플로우) + 로직 회귀 테스트 14/14 통과로 검증 |
| v2.5 | PRD v3.0 얼라인 — CONFLICT 통합 플로우(발견 89): cancelAttendance가 커밋 직후 대기 화면 없이 곧바로 QUICK/GRID로 강제 진입(quickReconfirmSlot/canQuickReconfirm으로 즉시 재계산, stale 클로저 방지), preCancelSnapshot ref + handleConflictBack으로 "뒤로가기=취소 취소" 구현, A01 CONFLICT에 QUICK 단계 신설(원클릭 재확인, trackRematchUpdate 재사용) |
| v2.4 | PRD v2.9 얼라인 — 회의 후보 기간 최대 7일 정책(발견 88): FULL_DATES를 07-16~07-22(7일)로 확장, H01 종료일 입력에 max 제약(시작일+6일) 추가. buildMemberResponse가 하드코딩된 candidatePeriod(3일) 대신 그 회의의 실제 candidatePeriod를 인자로 받아 채우도록 근본 수정 — 발의 시점(H01)에 3일보다 긴 후보 기간을 선택하면 일부 날짜가 무응답인데도 전원 제출 완료로 표시되던 결함 시정. 이 수정은 기존 기간 확장(extendPeriod, v2.2/발견 86) 케이스와 별개 경로였다 |
| v2.3 | PRD v2.8 얼라인 — 경로 B(웹훅 이탈) 특별취급 전면 폐지(발견 87): fireDropout이 이탈 감지 시점에 확정 슬롯을 본인 가용성에 자동 마킹하도록 변경, deriveRematchGate의 WEBHOOK 제외 분기 삭제, rematchTop3의 excludeIds WEBHOOK 분기 삭제, A01 CONFLICT 화면의 "경로 B만 무동선" 분기(conflictEdit === "DROPPED") 삭제 — 웹훅 이탈자도 GridEditor 재진입 가능 |
| v2.2 | PRD v2.7 / DS v2.4 얼라인 — R01 최종 확정 게이팅 함수 deriveRematchGate 신설(발견 84, [PRD-REMATCH] 6-2B), buildMemberResponse가 더 이상 FULL_ALL_SLOTS(5일 전체)를 미리 채우지 않고 초기 candidatePeriod(3일)만 채우도록 정정 — 기간 확장 시 신규 날짜가 가짜로 이미 채워져 있던 구조적 결함 수정(발견 86), extendPeriod에 extensionUpdatedIds 리셋 추가 + submitAvailability에 확장 후 재제출 추적 분기 추가(발견 86), 커밋 지점 ⑯ 확장 |
| v2.1 | PRD v2.6 / DS v2.3 얼라인 — 기간 확장 통지 필드·로직 추가(periodExtendedFrom, 발견 79), rejectPromotionRequest를 삭제 대신 상태 REJECTED 전환으로 재구현 + acknowledgeRequestResult 신설(발견 80), 필수 복귀 요청 4함수(request/cancel/approve/reject) + reinstateRequests 스키마 신설([DEV-REINSTATE-REQUEST], 발견 81), demoteMember 주석의 D01-DONE 노출 지점 제거 — 애초에 잘못된 명세였음(발견 82), 재조율 갱신 추적 필드 reMatchUpdatedIds 신설 + submitAvailability CONFLICT 분기 추가(발견 83), 커밋 지점 ⑬⑭⑮ 확장 |
| v1.0 | 최초 작성 |
| v1.1 | PRD v1.1 얼라인 전면 개정 — 시나리오 상태 스키마, 가상 시계, 멤버 우선 가용성 스키마(UNSET 희소 표현), COMPLETED 도달 경로, alert 전면 금지 |
| v1.2 | PRD v1.2 얼라인 — 지속 배너(alertBanner), 재편집 프리로드, deriveStep, 강제 마감 라벨 보정, R01 가드, 패널 닫기 |
| v1.3 | PRD v1.7 / DS v1.5 얼라인 전면 개정 — 라우팅 6종+A01 단계 상태머신(1.5), 진입 가드 함수(3.2), 커밋 일원화 commitMeeting(1.4), 멀티탭 storage 동기화(1.6 [DEV-SYNC]), 완화 3단계·실명 라벨 calculateBestTime 재설계(2.1), EX-04 실변동 함수(2.4), EX-05 1회성 소비(2.5), 히트맵 집계(2.7), 일괄 입력(2.8), 배너 해소 규칙(3.5), 주최자 권한 고정, 지각 제출 재포함 |
| v1.6 | PRD v2.0 / DS v1.8 얼라인 — cancelAttendance 경로 A 재설계(슬롯 단위 UNAVAILABLE 마킹, 연산 제외 폐지), deriveAbsentees 재조율 정합([PRD-CANCEL-SCOPE]), 히트맵 램프 재배치·확정 배경 색상 분리, 배너 렌더 조건 D01·R01 한정, 사용자 노출 문자열 전면 치환([DEV-COPY]) |
| v2.0 | PRD v2.5 / DS v2.2 얼라인 — deriveNextAction 축소(역강등 승인/거절만, 발견 74), EX-04 상태 갱신 항상 새 참조 생성으로 변경(발견 75), demoteMember·requestPromotion에 사유 노출 경로 추가(발견 76), coordinationPeriod/candidatePeriod 스키마 분리 및 관련 함수 전면 개정([DEV-PERIOD-SPLIT], 발견 77) |
| v1.9 | PRD v2.3 / DS v2.1 얼라인 — CANCELLED 상태·cancelMeeting 핸들러, 역강등 요청 3함수(request/approve/reject) + promotionRequests 스키마, demoteMember에 의견 인자 추가, extendPeriod(기간 확장 재탐색), fillDayUnavailable(일 단위 일괄), checkProactiveNudge(제출 시점 프로액티브), deriveNextAction(통합 행동 배너), 발의 후 제목 잠금(launched 참조 재사용), 커밋 지점 ⑩⑪⑫ 확장 |
| v1.8 | PRD v2.2 / DS v2.0 얼라인 — lateJoinId 상태·submitAvailability 3분기(제출→기록만/CONFLICT 전이), dropReason에 LATE_MISMATCH 추가, ex04FailedSlots 명시적 배제 상태, demotedReasons 맵 추가, 히트맵 균등 스케일 |
| v1.7 | PRD v2.1 / DS v1.9 얼라인 — 정렬 우선순위 역전(sortByPolicy: 비선호 필수 참석자 최소화 최우선), absence reason 3분기 유틸([DEV-ABSENCE-REASON]), 강제 마감 배제자 독촉 가시성(nudgedIds 참조), 히트맵 비균등 스케일 반영, CONFIRMED_BG 리터럴 문자열 버그 방지 노트, 반응형 상수(TOUCH_TARGET) 도입, [DEV-COPY] 정렬/위계 최신화 |
| v1.5 | PRD v1.9 / DS v1.7 얼라인 — 스키마 확장(launched·nudgedIds·reRequestedIds·declinedOptionalIds), 유입 트리거 발의 사건화(1.2), 미발의 가드(3.2), CF01 확인 상태 confirmOpen(2.9), 배제 3경로 핸들러 [DEV-EXIT](2.11), 재요청 커밋·버튼 상태(2.10), EX-04 대상 일반화(2.4), 히트맵 인원수 램프(2.7), 발의 후 권한 잠금 |
| v1.4 | PRD v1.8 / DS v1.6 얼라인 — UNAVAILABLE 상태(1.3, 2.1), 시드 전원 PENDING + 응답 유입 메커니즘(1.2 [DEV-ARRIVAL]), partialFit 사유 구분·병목 데이터(2.1), 확정 2탭 armed 상태·등록 문구 보정·불참 파생(2.9), 재요청 핸들러(2.10), EX-05 단발 함수화(2.5), EX-04 배너 슬롯 특정·신규 카드 diff(2.4), 패널 힌트(3.4), 4상태 순환(2.8) |

---

## 1. 전역 상태 및 데이터 스키마 명세 `[DEV-DATA]`

### 1.0 반응형 상수 `[DEV-RESPONSIVE]` (v1.7) → `[PRD-RESPONSIVE]`

```js
const TOUCH = { slot: "h-11", heatCell: "h-9" }; // 그리드 슬롯 44px, 히트맵 셀 36px 최소 (발견 52)
// 패널: max-h-[40vh] overflow-y-auto 또는 접힌 요약 행 (발견 53)
// 브랜드 바 역할 뱃지: max-w-[160px] truncate (발견 54)
```


### 1.1 시나리오 상태 (비영속·탭 로컬) `[DEV-DATA-SCENARIO]` → `[PRD-SIM-PANEL]`

```js
// 새로고침 시 기본값 복귀. localStorage 저장 금지, 탭 간 동기화 대상 아님 (PRD 1.3, 7.6)
const INITIAL_SCENARIO = {
  virtualClock: "BEFORE_DEADLINE", // "BEFORE_DEADLINE" | "DEADLINE_REACHED" [PRD-SIM-CLOCK]
  ex04Conflict: false,             // 확정 순간 동시성 충돌 [PRD-EX-04]
  // v1.4: ex05는 상태가 아니라 단발 액션 — fireDropout() 핸들러로 대체 (2.5, PRD 5.5)
};
const [scenario, setScenario] = useState(INITIAL_SCENARIO);
const [panelVisible, setPanelVisible] = useState(false); // 기본 숨김
```

**마감 판정은 반드시 이 상태만 참조한다.** `Date.now()` / `new Date()` 비교로 마감을 판정하는 코드는 결함이다.

### 1.2 회의 마스터 데이터 `[DEV-DATA-SEED]` → `[PRD-STATE]`, `[PRD-BRIEF]`

**v2.0 스키마 개정 — `[DEV-PERIOD-SPLIT]` (발견 77) → `[PRD-PERIOD-SPLIT]` 3.0-A**

`period`(단일 필드, 회의 후보 날짜와 응답 마감을 겸함)와 `deadline`(별도 시각)을 폐기하고, 서로 다른 두 개념을 명시적으로 분리한 두 필드로 대체한다:
- `coordinationPeriod`: 조율이 진행되는 기간. **`coordinationPeriod.end` + `coordinationPeriod.endTime`이 곧 응답 마감**이다 — 별도 deadline 필드 없음.
- `candidatePeriod`: 회의 후보 날짜(그리드가 렌더링하는 대상). `candidatePeriod.start`는 반드시 `coordinationPeriod.end`보다 뒤여야 한다(겹침 금지).

```js
// v2.8(발견 94) — 이 블록은 buildSeedData()가 반환하는 객체의 스키마 예시다.
// SEED_MEETING_DATA라는 이름의 최상위 상수는 실제 코드에 없다 — buildSeedData()를 호출한 결과가 이 모양이다.
function buildSeedData() {
  return {
  meetingId: "mock-meeting-777",
  title: "팀 주간 싱크 및 하반기 기획 리뷰",
  duration: "1h",
  durationLabel: "1h", // v1.8: H01 드롭다운 실제 선택값 (발견 67) — "30m"|"1h"|"1h30m"|"2h"
  coordinationPeriod: { start: "2026-07-13", end: "2026-07-15", endTime: "18:00" }, // v2.0: 조율 기간 — 종료 시각이 응답 마감 (PRD 3.0-A)
  candidatePeriod: { start: "2026-07-16", end: "2026-07-18" }, // v2.0: 회의 후보 날짜 — coordinationPeriod.end 다음 날부터
  status: "PROGRESS", // "PROGRESS" | "COMPLETED" | "CONFLICT" | "CANCELLED" [PRD-STATE] (v1.9: CANCELLED 추가)
  confirmedSlot: null,
  droppedMemberId: null, // CONFLICT 전이 시 이탈 멤버 [PRD-REMATCH]
  dropReason: null,      // "SELF_CANCEL" | "WEBHOOK" | "LATE_MISMATCH"
  cancelReason: null,    // v1.9: 회의 폐기 사유 (선택 입력) — [PRD-CANCEL-MEETING]
  launched: false,        // v1.5: 발의 완료 — 유입 트리거·가드·권한 잠금 기준(제목·권한 공통). 발의 시 커밋
  nudgedIds: [],          // v1.5: 독촉 발송 기록 (⑧) — 강제 마감 CF01이 참조
  reRequestedIds: [],     // v1.5: 재요청 발송 기록 (⑧) — 강등 CF01·버튼 상태가 참조
  declinedOptionalIds: [], // v1.5: 참조자 불참 기록 (⑨) — CONFLICT 전이 시 초기화 (PRD 5.5)
  demotedIds: [],         // v1.5: 강등 이력 — 당사자 배너(PRD 2.5-⑤) 판별 근거. 커밋 ⑦에 포함
  demotedReasons: {},     // v1.8: { memberId: slotKey } — 강등 근거 슬롯
  demoteNotes: {},        // v1.9: { memberId: string } — 강등 시 남긴 의견 (선택) [PRD-EX-01 의견 남기기]
  promotionRequests: [],  // v1.9: [{ id: memberId, status: "PENDING"|"APPROVED"|"REJECTED", reason }] — 역강등 요청 [PRD-PROMOTE-REQUEST]. v2.1(발견 80): REJECTED는 이제 실제로 쓰인다 — 거절 시 삭제 대신 상태만 바꾼다(아래 2.13)
  reinstateRequests: [],  // v2.1 신설: [{ id: memberId, status: "PENDING"|"APPROVED"|"REJECTED", reason }] — 필수 복귀 요청 [PRD-REINSTATE-REQUEST]. promotionRequests와 동일 구조, 방향만 반대(선택→필수)
  periodExtendedFrom: null, // v2.1 신설: 마지막 기간 확장 직전의 candidatePeriod.end 값 — A01 그리드가 "새로 추가된 날짜"를 판별하는 기준 [PRD-EX-01], 발견 79. null이면 확장 이력 없음
  reMatchUpdatedIds: [],  // v2.1 신설: CONFLICT 진입(이탈) 시점 이후 가용성을 갱신한 멤버 id 목록 — R01 반영 현황 카드가 참조 [PRD-REMATCH], 발견 83. CONFLICT 진입 시 항상 []로 리셋
  extensionUpdatedIds: [], // v2.2 신설: periodExtendedFrom 설정 이후(기간 확장 후) 실제로 재제출한 멤버 id 목록 — D01 제출 현황 카드가 참조, 발견 86. extendPeriod() 호출 시 항상 []로 리셋
  forceClosed: false,    // v1.3: 강제 마감 여부 — 커밋 대상 (지각 제출 시에도 유지, 5.3)
  members: [
    // v1.4: 시드는 전원 PENDING·availability 빈 상태로 시작 (PRD 1.1 응답 유입 연출 — 인과 붕괴 금지)
    { id: "m1", name: "김주최", email: "host@company.com",  role: "HOST",   attendance: "REQUIRED", status: "PENDING" }, // 권한 고정 — H01 토글 비노출 (PRD 2.2)
    { id: "m2", name: "이디자", email: "design@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
    { id: "m3", name: "최개발", email: "dev@company.com",    role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
    { id: "m4", name: "박기획", email: "pm@company.com",     role: "MEMBER", attendance: "REQUIRED", status: "PENDING" }, // EX-04 변동 대상 (PRD 5.4)
    { id: "m5", name: "정마케", email: "mkt@company.com",    role: "MEMBER", attendance: "OPTIONAL", status: "PENDING" },
    { id: "m6", name: "박개발", email: "dev2@company.com",   role: "MEMBER", attendance: "REQUIRED", status: "PENDING" }, // [PRD-EX-03 타겟 — 유입 대상 아님]
  ],
  availability: {}, // 1.3 스키마. 유입(아래) 시점에 멤버별로 채워진다
  };
}
```

**응답 유입 메커니즘 `[DEV-ARRIVAL]` (v1.4, v2.4 개정)** → PRD 1.1, 2.5-②

```js
const ARRIVAL_ORDER = ["m1", "m2", "m3", "m4", "m5"]; // m6 제외 — 끝까지 PENDING (EX-03 타겟)

// v2.4 개정(발견 88): buildMemberResponse(memberId, candidatePeriod) — 두 번째 인자 필수.
// 이전엔 인자 없이 모듈 상수(초기 3일 하드코딩)를 참조했으나, 이제 호출부가 그 회의의
// 실제 meeting.candidatePeriod를 넘긴다 — activeSlots(candidatePeriod)로 그 범위 전체를 채운다.
// H01에서 3일보다 긴 기간을 선택한 회의든, 원래 3일 그대로인 회의든 동일한 함수로 정확히 대응한다.
// m2는 이 시점에 applyContextBuffer()를 실제 실행하여 BLOCK_STRICT 산출 (죽은 코드 금지 규칙 유지)

// 유입 트리거 (v1.5): meeting.launched && status === "PROGRESS" && ARRIVAL_ORDER 중 PENDING 존재
//   — 화면 위치 무관, 백그라운드 유입 (PRD 2.5-② 개정). 발의 액션이 launched=true 커밋
// 동작: 1000ms 간격으로 다음 순번 멤버를 제출과 동일 경로로 실제 커밋 (커밋 ①과 동일)
//   커밋 시 buildMemberResponse(id, meeting.candidatePeriod)로 호출 — 확장 전이든 후든 항상 "지금 이 회의의" 기간 기준
// 재개 안전성: 트리거가 상태 파생이므로 유입 도중 새로고침·화면 이탈 후 복귀 시 남은 인원부터 자연 재개
// 유입 완료 전 가상 시계 '마감 도달' 전환 시 EX-03 배너에 미유입 인원이 명단으로 뜬다 — 정합 (명단 기반 판정)
```

**브리프 매핑 (PRD 2.4) 준수:** m1·m2의 `07-17T13:00` AVOID(점심 직후), m2의 외근 버퍼(특정 요일 외근)는 시드 수정 시에도 유지해야 한다. (v2.0 — 발견 77: candidatePeriod가 07-16~07-18로 이동함에 따라 관련 날짜도 같은 상대 일자로 재배치됨)

### 1.3 가용성 스키마 — 멤버 우선 + 희소 표현 `[DEV-DATA-GRID]` → `[PRD-GRID]`

```js
// availability[memberId] = { [slotKey]: "AVAILABLE" | "AVOID" | "UNAVAILABLE" | "BLOCK_STRICT" }
// 규칙 0 (v1.4): UNAVAILABLE = 유저 지정 불가. 연산상 UNSET과 동급(격상 불가)이나 키가 존재하며 표기상 구분 (PRD 3.2)
// 규칙 1: UNSET = 키 생략(희소 표현) = 가용 불가 (PRD 3.2 보수적 판정)
// 규칙 2: PENDING 멤버는 availability에 키 자체가 없다
// 규칙 3: slotKey "YYYY-MM-DDTHH:00" — 시작 시각, 1시간 단위
```

**슬롯 범위 (PRD 3.0-A, 3.1) — v2.0 개정:** 그리드는 `candidatePeriod`(기본 2026-07-16 ~ 07-18) 기준으로 렌더링한다, 시작 09:00~17:00 (하루 9슬롯 × 3일 = 27슬롯). `coordinationPeriod`(07-13~07-15, 응답 마감)는 그리드에 렌더링되지 않는다 — H01·A01 헤더의 마감 문구로만 노출된다.

**후보 기간 최대 범위 — 최대 7일 (v2.4 개정 — 발견 86·88):** `FULL_DATES`가 07-16~07-22(7일)로 확장됐다 — [PRD-PERIOD-SPLIT] 3.0-A의 "최대 7일" 정책과 일치시킨 것이다(발견 88, 근거: 실무 일회성 회의 90%가 발의로부터 10일 이내 성사). H01 종료일 입력에는 `max = 시작일 + 6일` 제약을 추가해 그 이상은 애초에 선택 불가능하게 한다. `[기간 넓혀서 다시 찾기]`(5.1 액션 ③)도 이 7일 상한 안에서만 `candidatePeriod`를 넓힌다.

**v2.1까지의 결함과 v2.2의 부분 수정:** v2.1까지는 고정 풀 전체(당시 5일)를 유입 시점(buildMemberResponse)에 미리 `AVAILABLE`로 채워뒀는데, 이것이 결함이었다 — 기간을 확장하면 아직 아무도 응답하지 않은 새 날짜가 이미 전원 가능으로 채워진 것처럼 보였다(대시보드·히트맵이 확장 직후부터 초록). 발견 79의 통지("새 날짜에 응답해야 한다")와 정면으로 모순되는 시드 설계였다. v2.2는 이를 "초기 candidatePeriod(당시 3일 고정값)만 채운다"로 고쳤으나, 이는 **발의 후 기간 확장(extendPeriod) 경로만** 고려한 반쪽 수정이었다.

**v2.4의 근본 수정 (발견 88):** 발의 시점(H01)에 주최자가 애초에 3일보다 긴 후보 기간(최대 7일)을 선택하는 경로는 v2.2의 수정 대상이 아니었다 — `buildMemberResponse`가 여전히 "3일"이라는 하드코딩된 값을 기준으로 채웠기 때문에, 이 경로에서는 4~7일차가 무응답인 채로 멤버 상태만 SUBMITTED가 되는 동일한 결함이 재발했다. v2.4부터 `buildMemberResponse(memberId, candidatePeriod)`는 인자로 받은 **그 회의의 실제 candidatePeriod**(며칠이든) 기준으로 `activeSlots(candidatePeriod)`를 채운다 — "3일"이라는 숫자는 코드 어디에도 하드코딩되지 않는다. 이제 발의 시 최초 지정이든 사후 확장이든 동일한 함수·동일한 원칙으로 처리된다.

**시드 가용성 명세 (유입 시 커밋될 데이터)** — 표에 없는 슬롯은 전부 `AVAILABLE`. 각 멤버의 행은 해당 멤버 유입 시점에 커밋된다. (v2.0 — 발견 77: candidatePeriod 이동에 맞춰 같은 상대 일자로 재배치, day0=07-16·day1=07-17·day2=07-18). **v2.2(발견 86): 이 표는 초기 3일(07-16~18) 범위에만 적용되며, 확장으로 드러나는 07-19·07-20에는 어떤 멤버도 값이 없다.**

| 멤버 | AVOID | BLOCK_STRICT | 비고 |
|---|---|---|---|
| m1 김주최 | 07-17T13:00, 07-18T09:00 | — | 점심 직후 회피 [PRD-BRIEF] |
| m2 이디자 | 07-17T13:00 | 07-17T10:00, 11:00, 12:00 | "외근 11:00~12:00 + 전후 30분 버퍼" 산출 결과 [PRD-EX-02] |
| m3 최개발 | 07-16T09:00, 07-16T10:00 | — | EX-05 이탈 대상 |
| m4 박기획 | 07-18T16:00, 07-18T17:00 | — | EX-04 변동 대상 |
| m5 정마케 | 07-17T14:00, 07-16T15:00 | — | 참조자 — 정렬 규칙 시연용 |
| m6 박개발 | (제출 전 — 데이터 없음) | — | 시연자가 직접 편집·제출 |

> m2의 BLOCK_STRICT는 하드코딩이 아니라 **`applyContextBuffer()`(2.2)를 시드 생성 시점에 실제 실행하여 산출**한다. 죽은 코드(정의만 있고 호출 없음) 금지.

### 1.4 localStorage 영속화 — 커밋 일원화 `[DEV-DATA-PERSIST]` → `[PRD-DATA-RULE]` 7.2

```js
const STORAGE_KEY = "meeting-demo-state";

// v1.3: 모든 영속화는 이 단일 함수를 통한다. 제출·상태 전이·EX-04 변동 전부.
function commitMeeting(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

// 커밋 지점 (PRD 7.2와 1:1 — 누락 시 결함):
// ① 가용성 최종 제출 (버퍼 병합 + 멤버 SUBMITTED)
// ② 확정 성공 (status COMPLETED + confirmedSlot)
// ③ 이탈/취소 (status CONFLICT + droppedMemberId + dropReason)
// ④ 재조율 확정 (status COMPLETED 재전이 — ②와 경로 공유)
// ⑤ EX-04 충돌 변동 (대상자 가용성 BLOCK_STRICT)
// ⑥ 강제 마감 (forceClosed: true)
// ⑦ 강등 (attendance OPTIONAL 전환 + demotedReasons + demoteNotes)
// ⑧ 독촉·재요청 발송 기록 (nudgedIds·reRequestedIds)
// ⑨ 참조자 자발적 불참 (declinedOptionalIds)
// ⑩ 회의 폐기 (status CANCELLED + cancelReason) — v1.9
// ⑪ 역강등 요청 상태 변경 (promotionRequests 배열 갱신: 요청/승인/거절/취소) — v1.9, v2.1부터 거절은 삭제가 아니라 상태 REJECTED로 커밋(발견 80)
// ⑫ 기간 확장 (candidatePeriod.end 갱신 + periodExtendedFrom 기록) — v1.9, v2.1 필드 추가(발견 79)
// ⑬ 필수 복귀 요청 상태 변경 (reinstateRequests 배열 갱신: 요청/승인/거절/취소) — v2.1 신설, [PRD-REINSTATE-REQUEST]
// ⑭ 요청 결과 확인(acknowledge) — REJECTED 상태의 promotionRequests·reinstateRequests 항목을 배너 확인 후 배열에서 제거 — v2.1 신설, 발견 80·81
// ⑮ 재조율 갱신 기록 (reMatchUpdatedIds 갱신, CONFLICT 중 submitAvailability 호출 시) — v2.1 신설, 발견 83

function loadInitialState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : buildSeedData(); // buildSeedData가 applyContextBuffer 실행
}

// 초기화 경로는 2곳만: 패널 [데이터 초기화], D01-DONE [새 회의 만들기] (PRD 7.4)
function resetDemoData() {
  localStorage.removeItem(STORAGE_KEY);
  // 시드 재생성 + 시나리오 기본값 + 편집 버퍼 비움 + 라우팅(패널: "/", 새 회의: "/")
}
```

### 1.5 라우팅·단계 상태 `[DEV-ROUTE-STATE]`

```js
const [currentPath, setCurrentPath] = useState("/"); // v1.3: 최초 진입은 L01
const [attendeeStage, setAttendeeStage] = useState("INVITE"); // "INVITE"|"AUTH"|"GRID"|"DONE" [DS-FLOW-A01]
const [currentMemberId, setCurrentMemberId] = useState(null);
const [temporaryGridState, setTemporaryGridState] = useState({}); // 편집 버퍼 (PRD 7.5)
const [alertBanner, setAlertBanner] = useState(null); // { message, cause } — cause는 해소 규칙용 (3.5)
const [heatOpen, setHeatOpen] = useState(false);      // D01-HEAT 접힘 상태
const [resetArmed, setResetArmed] = useState(false);  // [새 회의 만들기] 2탭 확인 상태
```

**경로 표:** `/`=L01 · `/host/create`=H01 · `/attendee`=A01 · `/host/dashboard`=D01 · `/host/re-match`=R01 · `/guide`=GD01

- A01의 5번째 상태(결과 안내)는 stage가 아니라 **meeting.status 파생**이다: `COMPLETED`/`CONFLICT`이면 stage 무시하고 RESULT 렌더링 (DS 3.3).
- A01 이탈 후 재진입 시 stage는 `INVITE`로 초기화한다 (초대 랜딩이 A01의 정문 — PRD 2.5-③). 단, 편집 버퍼는 유지(7.5).

### 1.6 멀티탭 동기화 `[DEV-SYNC]` → `[PRD-SYNC]` 7.6

```js
// 타 탭의 commitMeeting을 실시간 수신. 실구현 — 연출 아님.
useEffect(() => {
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY) return;
    if (e.newValue === null) { // 타 탭에서 초기화 실행
      setMeeting(buildSeedData());
      return;
    }
    setMeeting(JSON.parse(e.newValue));
    // 수신 직후 진입 가드(3.2)가 재평가되어 필요 시 리다이렉트 (PRD 2.6)
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);
// 경계: scenario·temporaryGridState·attendeeStage는 동기화하지 않는다 (탭 로컬 — PRD 7.6)
// last-write-wins 한계는 데모 가이드에 안내 (스코프 밖)
```

---

## 2. 알고리즘·예외 처리 구현 명세 `[DEV-ALGO]`

### 2.1 [DEV-EX-01] 추천 연산 — 완화 3단계 + 실명 라벨 (calculateBestTime) → PRD 3.4, 3.7, 5.1

```js
// 입력: availability, members, options { excludeIds: [] (강제 마감 제외자·이탈자), forceClosed, slots (v2.0 신규 — 후보 슬롯 풀, 기본 FULL_ALL_SLOTS) }
// slots 옵션 (v2.0 — [DEV-PERIOD-SPLIT], 발견 77): 호출부는 항상 activeSlots(meeting.candidatePeriod)를 넘겨
//   연산이 candidatePeriod 범위 안에서만 후보를 찾도록 한다. 생략 시 전체 목업 범위(FULL_ALL_SLOTS)로 폴백.
// 반환: [{ slotKey, level: 0|1|2|3, label, subNames: [] }] 최대 3개 — level 3 정의상 결과 ≥ 1 보장
function calculateBestTime(availability, members, options = {}) {
  const excluded = new Set(options.excludeIds || []);
  const responders = members.filter(m => m.status === "SUBMITTED" && !excluded.has(m.id));
  const required   = responders.filter(m => m.attendance === "REQUIRED");
  // 참조자 미응답은 자동 제외 — responders 필터가 담당 (PRD 3.7)

  let pool, level;
  pool = intersect(availability, responders, { allowAvoid: false }); level = 0;       // 기본: 응답자 전원
  if (!pool.length) { pool = intersect(availability, required, { allowAvoid: false }); level = 1; } // 완화1: 참조자 제외
  if (!pool.length) { pool = intersect(availability, required, { allowAvoid: true });  level = 2; } // 완화2: AVOID 격상
  if (!pool.length) { pool = partialFit(availability, required);                        level = 3; } // 완화3: 부분 성립 (PRD 3.4-4)

  return sortByPolicy(pool, availability, responders, level).slice(0, 3)
         .map(s => attachLabel(s, level, members, options));
}

// partialFit (v1.4): 27슬롯 전체에 대해 슬롯별 참석 가능(AVAILABLE|AVOID) 의사결정자 수를 집계,
// 최대 인원 슬롯들을 반환. 각 슬롯에 absentees를 사유와 함께 부착:
//   [{ name, reason: "UNAVAILABLE"(유저 불가) | "BLOCK"(외부 일정·잠금) | "UNSET"(미확인) }]
// reason은 서브라인 구분 표기(PRD 3.4)와 재요청 분기(PRD 5.1 — BLOCK은 재요청 대상 아님)의 근거다.
// 집계는 공집합이 될 수 없으므로 level 3은 항상 결과를 낸다 (PRD 5.1).

// 정렬 (v1.7 — PRD 3.4 우선순위 역전, 발견 49):
//   level 0~2 → ①AVOID로 참여하는 필수 참석자 수 少 ②선택 참석자 AVAILABLE 多 ③빠른 시간
//   level 3   → ①참석 가능 필수 참석자 多 ②AVOID 참여 少 ③빠른 시간
// v1.6까지는 "선택 참석자 참여"가 1순위였으나, 이는 필수 참석자 불편 최소화(관계 비용 테제)를 밀어내는 결과를 낳았다.
function sortByPolicy(pool, av, group, level) {
  const meta = (sk) => ({
    avoidRequired: group.filter(m => m.attendance === "REQUIRED" && (av[m.id]||{})[sk] === "AVOID").length,
    optAvail: group.filter(m => m.attendance === "OPTIONAL" && (av[m.id]||{})[sk] === "AVAILABLE").length,
    t: FULL_ALL_SLOTS.indexOf(sk), // v2.0: 정렬 기준은 항상 전체 목업 범위(기간 확장 포함) 인덱스로 일관성 유지
  });
  return [...pool].sort((a, b) => {
    const A = meta(a), B = meta(b);
    if (A.avoidRequired !== B.avoidRequired) return A.avoidRequired - B.avoidRequired; // 1순위
    if (B.optAvail !== A.optAvail) return B.optAvail - A.optAvail;                     // 2순위
    return A.t - B.t;                                                                   // 3순위
  });
}

// 라벨 규칙 (attachLabel) — DS D01-RESULT·NAMES와 1:1, 문구는 [DEV-COPY] 표 준수:
//   level 0: "모두 가능한 시간이에요" — 연산 제외 인원(강제 마감 제외자 + 미응답 선택 참석자 + 이탈자) ≥ 1이면 "제출한 사람은 모두 가능해요" (PRD 3.4 보정)
//   level 1: "선택 참석자 n명 빼고 가능해요" + subNames = 제외된 선택 참석자 이름
//   level 2: "일부는 피하고 싶은 시간이에요" + 서브라인 "피하고 싶은 시간대: {이름들}" (라벨 반복 금지)
//   level 3: "n명은 참석 못 해요" + 서브라인은 [DEV-ABSENCE-REASON] 3분기 참조
//            + reRequestTargets = reason이 BLOCK이 아닌 absentees (재요청 대상 — 2.10)
// UNSET(키 부재)은 모든 단계에서 가용 불가 (PRD 3.2)
```

### [DEV-ABSENCE-REASON] 불참 사유 3분기 유틸 (v1.7) → `[PRD-ABSENCE-REASON]`

```js
// 완료 화면·확정 확인 문장·서브라인이 공유하는 단일 판정 함수 — 문구 불일치 방지
function absenceReason(member, meeting) {
  if (meeting.declinedOptionalIds?.includes(member.id)) return "SELF_DECLINED"; // 자발적 불참 (경로 A)
  if (member.status !== "SUBMITTED") return "UNCONFIRMED"; // 미확인 — 강제 마감 배제
  const v = (meeting.availability[member.id] || {})[meeting.confirmedSlot];
  if (v !== "AVAILABLE" && v !== "AVOID") return "UNAVAILABLE_SLOT"; // 참석 불가 — 데이터 근거
  return null;
}
const ABSENCE_LABEL = {
  UNCONFIRMED: (name) => `미확인 (마감까지 답 없었음): ${name}`,
  UNAVAILABLE_SLOT: (name) => `참석 못 함: ${name}`,
  SELF_DECLINED: (name) => `불참 알림: ${name}`,
};
// 세 사유를 같은 문구("불참 예상")로 합치는 것은 결함 (발견 48)
```

### 2.2 [DEV-EX-02] 이동 시간 버퍼 (applyContextBuffer) → `[PRD-EX-02]`

```js
// 호출: buildSeedData() 내부 1회 (PRD 1.1 모킹 표)
function applyContextBuffer(externalEvents) {
  const keywords = ["외근", "출장", "미팅", "오프라인"];
  // 키워드 일정의 [시작-30분, 종료+30분]과 겹치는 슬롯 전부 BLOCK_STRICT 산출 → 해당 멤버 availability에 병합
}
```

### 2.3 [DEV-EX-03] 마감 유예 판정 (checkDeadlineStatus) → `[PRD-EX-03]`, PRD 3.7

```js
function checkDeadlineStatus(meeting, scenario) {
  // 판정 대상: 의사결정자만 (참조자 PENDING은 무영향 — PRD 3.7)
  const pendingRequired = meeting.members
    .filter(m => m.attendance === "REQUIRED" && m.status === "PENDING");
  const deadlineReached = scenario.virtualClock === "DEADLINE_REACHED";

  return {
    alertBannerActive: deadlineReached && pendingRequired.length > 0 && !meeting.forceClosed,
    shouldBlockResult: pendingRequired.length > 0 && !meeting.forceClosed, // 의사결정자 기준 (PRD 3.7)
    pendingList: pendingRequired.map(m => m.name),
  };
}
// [강제 마감]: commitMeeting({...meeting, forceClosed: true}) → excludeIds = PENDING 의사결정자로 연산
// 지각 제출 (PRD 5.3): 제외자가 제출하면 SUBMITTED가 되므로 responders 필터에 자동 재포함 — 별도 처리 불요
```

### 2.4 [DEV-EX-04] 확정 및 동시성 검증 (handleConfirmMeeting) → `[PRD-EX-04]`

> **변동 대상 일반화 (PRD 5.4-1):** 고정 m4가 아니라 "해당 슬롯에 가용(AVAILABLE|AVOID)한 의사결정자 응답자 1인"(m4 적격 시 m4 우선). 강등으로 m4가 참조자여도 배너가 거짓이 되지 않기 위함.
> **상태 갱신 보장 (v2.0 — 발견 75):** 대상자가 이미 BLOCK_STRICT라서 "변경할 게 없는" 경우에도 **항상 새 객체를 생성해 커밋**한다. 이전 상태 객체를 그대로 재사용(`let next = meeting`)하면 변경 감지가 누락될 수 있다는 게 실제로 발생했던 결함이다.
> **실패 슬롯 명시적 배제 (v1.8, 발견 61):** 데이터 변동이 실제로 그 슬롯을 pool에서 밀어내는지에 간접 의존하지 않고, 시도한 slotKey를 `ex04FailedSlots`에 직접 추가해 top3에서 무조건 제외한다.

```js
function handleConfirmMeeting(slotKey) {
  setSyncChecking(true); // [DS-FLOW-D01-SYNC] 0.8초

  setTimeout(() => {
    setSyncChecking(false);

    if (scenario.ex04Conflict) {
      const eligible = meeting.members.filter(m => m.attendance === "REQUIRED" && m.status === "SUBMITTED"
        && ["AVAILABLE", "AVOID"].includes((meeting.availability[m.id] || {})[slotKey]));
      const target = eligible.find(m => m.id === "m4") || eligible[0] || meeting.members.find(m => m.id === "m4");
      const prevKeys = currentTop3Ref.current.map(s => s.slotKey);

      // v2.0 (발견 75): 조건 분기 없이 항상 새 객체 생성 — 이미 BLOCK_STRICT여도 재커밋한다
      const next = {
        ...meeting,
        availability: { ...meeting.availability, [target.id]: { ...(meeting.availability[target.id] || {}), [slotKey]: "BLOCK_STRICT" } },
        blockReasons: { ...meeting.blockReasons, [target.id]: "확정 직전 등록된 외부 일정" },
      };
      commitMeeting(next); // ⑤
      setMeeting(next);

      setEx04FailedSlots(prev => [...new Set([...prev, slotKey])]); // v1.8, 발견 61
      const after = calculateBestTime(next.availability, next.members, {
        excludeIds: next.forceClosed ? next.members.filter(m => m.attendance === "REQUIRED" && m.status === "PENDING").map(m => m.id) : [],
        slots: activeSlots(next.candidatePeriod), // v2.0 — candidatePeriod 기준
      }).filter(s => s.slotKey !== slotKey);
      setNewCardKeys(after.map(s => s.slotKey).filter(k => !prevKeys.includes(k)));
      showAlertBanner(`그사이 ${target.name}님의 일정에 변동이 생겨 ${fmtSlot(slotKey)} 추천이 제외되었습니다. 다른 시간으로 다시 확정할 수 있습니다.`, "EX04");
      return; // 확정 취소. 전체 리로드 금지 (PRD 5.4)
    }

    // 정상: COMPLETED 전이 + 커밋 ②/④ (PRD 4, 7.2)
    // v2.0 (발견 73 근본 정리): 재확정 성공 시 이전 CONFLICT의 잔재(droppedMemberId·dropReason)를 지운다.
    const next = { ...meeting, status: "COMPLETED", confirmedSlot: slotKey, droppedMemberId: null, dropReason: null };
    setMeeting(commitMeeting(next));
    clearBannerByCause("EX04"); clearBannerByCause("EX05"); // 해소 규칙 (3.5)
    const absent = deriveAbsentees(next).length + next.declinedOptionalIds.length;
    showToast(absent === 0 ? "전원 캘린더에 등록되었습니다" : `참석 가능 인원(${next.members.length - absent}명)의 캘린더에 등록되었습니다`);
  }, 800);
}
```
```

### 2.5 [DEV-EX-05] 확정 후 이탈 — 단발 액션 (v1.4) → `[PRD-EX-05]`, `[PRD-REMATCH]`

```js
// 토글+useEffect 모델 폐기, 직접 핸들러로 전환 — 켜둔 채 잊는 함정 원천 제거 (PRD 5.5)
// v2.3 개정(발견 87): 이전엔 상태값만 바꾸고 availability는 건드리지 않아, 최개발 본인 데이터가
// 갱신되지 않은 채로 같은 슬롯이 재추천될 수 있었다. 경로 A(cancelAttendance)가 취소 슬롯을
// UNAVAILABLE로 마킹하는 것과 대칭으로, 여기서도 확정 슬롯을 자동 마킹한다.
function fireDropout() {
  if (meeting.status !== "COMPLETED") return; // 버튼 자체가 비활성이지만 이중 방어
  const slot = meeting.confirmedSlot;
  const next = {
    ...meeting,
    status: "CONFLICT",
    droppedMemberId: "m3",
    dropReason: "WEBHOOK",
    availability: { ...meeting.availability, m3: { ...meeting.availability.m3, [slot]: "BLOCK_STRICT" } },
    blockReasons: { ...meeting.blockReasons, m3: "외부 일정 변동 감지" },
    reMatchUpdatedIds: [], // 본인의 선언 행위가 아니므로 [본인id]로 시작하지 않는다 — 그리드 재진입해야 갱신 인정 (PRD 6-2B)
  };
  setMeeting(commitMeeting(next)); // ③ 커밋
  showAlertBanner("필수 참석자(최개발)의 일정 이탈이 감지되었습니다.", "EX05");
  setCurrentPath("/host/re-match"); // 주최자 화면 강제 (PRD 2.6)
}
// 패널 버튼: disabled = status !== "COMPLETED", 비활성 힌트 "확정 완료 상태에서만 발동합니다" (PRD 1.7)
```

**A01 CONFLICT 화면 — 경로별 분기 삭제 (v2.3, 발견 87)**

```js
// 기존(폐기): MemberPicker onPick 안에서
//   if (isWebhook && id === meeting.droppedMemberId) { setConflictEdit("DROPPED"); return; }
//   위 분기를 삭제한다. isWebhook 여부·droppedMemberId 일치 여부와 무관하게
//   selectMember(id); setConflictEdit("GRID")로 통일 — 경로 A와 동일한 재선택 화면으로 보낸다.
// 부수 효과: conflictEdit === "DROPPED" 상태와 그 렌더 분기(1608행대 "회원님의 일정 이탈로
// 재조율이 진행 중입니다" 읽기 전용 화면)는 도달 불가능한 코드가 되므로 함께 제거한다.
// dropReason별 안내 문구(causeText: SELF_CANCEL/LATE_MISMATCH/WEBHOOK)는 그대로 유지 —
// "왜 재조율이 필요한지"를 설명하는 용도로는 계속 구분하되, 이제 셋 다 GridEditor로 이어진다.
```

**CONFLICT 통합 플로우 — QUICK 단계 신설 + 취소 강제 진입 (v2.5, 발견 89)** → PRD 6-2C

```js
// 원클릭 재확인 대상 판정 — rematchTop3와 같은 컴포넌트 스코프, useMemo 아닌 파생값(rematchTop3 갱신마다 재계산)
const quickReconfirmSlot = rematchTop3.length && rematchTop3[0].level !== 3 ? rematchTop3[0] : null;
const canQuickReconfirm = (memberId) => {
  if (!quickReconfirmSlot) return false;
  const v = (meeting.availability[memberId] || {})[quickReconfirmSlot.slotKey];
  return v === "AVAILABLE" || v === "AVOID";
};

// conflictEdit 상태값에 "QUICK" 추가 (기존 AUTH/GRID/null에 더해)
// AUTH의 onPick: selectMember(id) 후 canQuickReconfirm(id) 결과에 따라 QUICK 또는 GRID로 분기
// QUICK 화면: quickReconfirmSlot 정보 표시 + "네, 여전히 가능해요"(reMatchUpdatedIds에 trackRematchUpdate로 추가,
//   커밋 ⑰) / "다른 시간을 직접 고를게요"(GRID로 전환) / "뒤로가기"(handleConflictBack) 3버튼
// v2.5 개정(발견 90): 클릭 후 곧바로 conflictEdit을 null로 넘기지 않고 화면에 그대로 머문다.
//   alreadyUpdated = meeting.reMatchUpdatedIds.includes(currentMemberId) — true면 버튼을 disabled 속성 +
//   card/border/muted 스타일(라인 1029 재요청 버튼과 동일 패턴)로 바꾸고 라벨을 "✓ 반영 완료"로 교체,
//   onClick 핸들러 최상단에서도 alreadyUpdated면 즉시 return(이중 커밋 방지). 이 상태에서는 "다른 시간을
//   직접 고를게요"·"뒤로가기" 대신 "돌아가기"(setConflictEdit(null)) 단일 버튼만 노출한다.

// preCancelSnapshot(useRef) — 취소 강제 플로우 전용 되돌리기 스냅샷
// handleConflictBack: preCancelSnapshot.current 존재 시 그 스냅샷을 commitMeeting으로 그대로 복원하고
//   ref를 null로 비움(취소의 취소) — 없으면 기존처럼 setConflictEdit("AUTH")
// GridEditor(CONFLICT 편집)의 onBack, QUICK의 "뒤로가기" 버튼 모두 handleConflictBack 공용 사용
// preCancelSnapshot은 확정적 커밋이 일어나는 지점(QUICK 확인, GRID 제출, AUTH 재진입)마다 null로 정리 —
//   그렇지 않으면 이후 무관한 재진입에서도 "취소 취소"가 잘못 발동할 수 있다

// cancelAttendance(경로 A) 개정 — 커밋 직후 대기 화면을 거치지 않고 곧바로 진입:
//   1. preCancelSnapshot.current = meeting (취소 직전 스냅샷)
//   2. next = commitMeeting({...}) 로 CONFLICT 커밋 (기존과 동일)
//   3. ⚠ 이 시점의 `meeting`/`rematchTop3` 클로저는 아직 취소 이전(stale) 값이므로
//      quickReconfirmSlot·canQuickReconfirm을 그대로 쓰면 안 된다. next를 인자로 calculateBestTime을
//      직접 다시 호출해 topSlot·eligible을 그 자리에서 재계산한다.
//   4. selectMember(id); setConflictEdit(eligible ? "QUICK" : "GRID")
```

### 2.6 재조율 연산 → `[PRD-REMATCH]`

```js
// R01 진입: calculateBestTime(availability, members, { excludeIds: [] }) — v2.3 개정(발견 87)
//   → 이전엔 경로 B에 한해 excludeIds: [droppedMemberId]였으나 폐지. 이탈자의 확정 슬롯은
//   fireDropout/cancelAttendance가 이미 UNAVAILABLE·BLOCK_STRICT로 마킹해뒀으므로 별도 제외 불필요.
// 대체안 확정: handleConfirmMeeting 동일 → COMPLETED 재전이+커밋 ④, EX05 배너 자동 해소 (3.5)
// 기존 availability 절대 삭제 금지 (PRD 6.1)
```

**재조율 반영 현황 추적 (v2.1 신설, 발견 83) → `[DEV-REMATCH-STATUS]`**

```js
// CONFLICT 진입 지점 3곳(cancelAttendance 경로 A, fireDropout 경로 B, submitAvailability의 LATE_MISMATCH 경로 C)
// 모두 커밋 시 reMatchUpdatedIds: [] 를 함께 초기화한다 — 이전 재조율 세션의 잔존 기록이 새 CONFLICT로 새는 것을 방지.

// submitAvailability에 분기 추가:
function submitAvailability(id, buffer) {
  const isRematchUpdate = meeting.status === "CONFLICT";
  setMeeting(commitMeeting({
    ...meeting,
    availability: { ...meeting.availability, [id]: buffer },
    members: meeting.members.map(m => m.id === id ? { ...m, status: "SUBMITTED" } : m),
    reMatchUpdatedIds: isRematchUpdate ? [...new Set([...meeting.reMatchUpdatedIds, id])] : meeting.reMatchUpdatedIds, // ⑮
  }));
}
// 판정이 "최초 제출"(status SUBMITTED, 영구 유지)이 아니라 "이탈 이후 갱신"인 이유:
// 확정 전부터 이미 SUBMITTED였던 멤버는 CONFLICT 진입 시점에도 여전히 SUBMITTED다 — 이 값만으로는
// "이탈 이후 실제로 다시 손을 댔는지"를 구분할 수 없다. reMatchUpdatedIds가 그 구분을 담당한다.

// R01 반영 현황 카드: meeting.members.map(m => reMatchUpdatedIds.includes(m.id) ? "✓ 갱신함" : "… 대기")
// updatedCount = reMatchUpdatedIds.length (D01 제출 현황의 submittedCount와 대칭 — 3.8 참조)

// v2.2 정정(발견 84): 경로 A(cancelAttendance)·경로 C(submitAvailability의 LATE_MISMATCH 분기)는
// CONFLICT 커밋 시 reMatchUpdatedIds를 []가 아니라 [본인id]로 초기화한다 — 이탈을 유발한 본인의 그 행위 자체가
// 이미 갱신이므로, 별도로 다시 그리드에 들어가 증명할 필요가 없다(PRD 6-2B).
// 경로 B(fireDropout)는 v2.3(발견 87)에서도 여전히 []로 초기화한다 — 단, 이유가 바뀌었다.
// "재조율 대상이 아니라서"가 아니라, "본인이 아무 행위도 하지 않았으므로 갱신으로 인정할 근거가 없어서"다.
// 확정 슬롯 자동 마킹(fireDropout)은 본인의 갱신 선언을 대신하지 않는다 — 본인이 실제로 그리드에
// 재진입해 제출해야 submitAvailability를 통해 reMatchUpdatedIds에 포함된다.
```

### [DEV-REMATCH-GATE] 최종 확정 게이팅 (v2.2 신설, 발견 84) → `[PRD-REMATCH]` 6-2B

```js
// v2.3 개정(발견 87): dropReason별 제외 분기 삭제 — 경로 A·B·C 무관하게 필수 참석자 전원이 대상이다.
// 경로 A·C 이탈 유발 본인은 이미 reMatchUpdatedIds에 [본인id]로 포함되어 있으므로 별도 분기 없이
// 이 필터만으로 자연스럽게 걸러지고, 경로 B(웹훅) 이탈자는 본인이 실제로 재제출해야 걸러진다 — 의도된 차이다.
function deriveRematchGate(meeting) {
  const requiredToReflect = meeting.members.filter(m => m.attendance === "REQUIRED");
  const pending = requiredToReflect.filter(m => !meeting.reMatchUpdatedIds.includes(m.id));
  return { blocked: pending.length > 0, pendingNames: pending.map(m => m.name) };
}
// R01 대체안 카드: deriveRematchGate(meeting).blocked이면 [최종 확정] 버튼 대신
// "모든 필수 참석자가 갱신하면 최종 확정할 수 있어요" 안내 노출 (카드마다 동일 조건, 슬롯별 차이 없음 —
// 반영 여부는 슬롯이 아니라 회의 전체 단위의 사건이므로).
// 강제 우회 경로 없음 — 5.3 강제 마감과 달리 재조율에는 시한 개념이 없다(PRD 6-2B).
```

### 2.7 히트맵 집계 (buildHeatmap) → `[PRD-HEATMAP]` 3.8

```js
// 반환: { [slotKey]: { ratio, detail: [{ name, state, isOptional }] } }
// ratio = 참석 가능(AVAILABLE) 인원 / 제출 완료 인원 — SUBMITTED만 집계 (PRD 3.8)
// 밀도 (v1.6): bg-heat-{가능 인원수} 절대 램프 0~6, 저농도 구간 명도 재배치 (DS 1.1 — PRD 3.8)
// 확정 슬롯은 램프 미사용, bg-primary 계열로 분리 렌더링 (발견 41)
// detail의 state: "AVAILABLE"|"AVOID"|"UNAVAILABLE"(BLOCK_STRICT 또는 UNSET)
// 읽기 전용 — 이 함수·뷰에서 availability를 변경하는 코드는 결함
```

### 2.8 일괄 입력 (fillRemaining) → PRD 3.3

```js
// 편집 버퍼에서 UNSET(키 부재) 슬롯만 AVAILABLE로 채운다. 기존 AVOID·UNAVAILABLE·BLOCK_STRICT 보존 (v1.4).
// 탭 순환 (v1.4): UNSET → AVAILABLE → AVOID → UNAVAILABLE → UNSET(키 삭제)
// BLOCK_STRICT는 본인 availability가 아니라 시스템 마스크이므로 대상 자체가 아님에 주의
```

---

### 2.9 확인 영역 상태·완료 파생 (v1.5) → PRD 3.4, DS CF01

```js
const [confirmOpen, setConfirmOpen] = useState(null);
// { type: "CONFIRM"|"DEMOTE"|"FORCE_CLOSE"|"CANCEL"|"RESET"|"PROMOTE_REQUEST"|"REINSTATE_REQUEST", slotKey?, memberId? } — 동시 1개, 자동 소멸 없음
// PROMOTE_REQUEST·REINSTATE_REQUEST (v2.1 신설): A01에서 요청 사유 입력 CF01에 사용 — [PRD-PROMOTE-REQUEST]·[PRD-REINSTATE-REQUEST]
// 접힘: [취소] 또는 다른 트리거 조작 시. armed 타이머 패턴 전면 폐기 (PRD 3.4)

// deriveAbsentees (v1.6 — [PRD-CANCEL-SCOPE]): droppedMemberId 존재만으로 고정 불참 처리 금지.
// 재연산과 동일한 데이터(availability[confirmedSlot])를 참조해 실제 상태 판정 — 표기·연산 정합
// + 등록 문구·불참 표기에는 declinedOptionalIds(참조자 불참)도 실명 병기 (PRD 5.5-⑨)
```

### 2.10 가용성 재요청 (v1.5) → `[PRD-DEADLOCK-FLOW]` 5.1

```js
function sendReRequest(ids) {
  setMeeting(commitMeeting({ ...meeting, reRequestedIds: [...new Set([...meeting.reRequestedIds, ...ids])] })); // ⑧
  showToast(`${이름들}님에게 가용성 재요청을 보냈습니다`); // 발송 연출 (PRD 1.1)
}
// 버튼 상태: 대상 전원이 reRequestedIds에 있으면 "재요청 보냄 ✓" 비활성 톤 (발견 31)
// 병목 해소 시 카드가 상위 완화로 대체되므로 상태 자연 초기화
```

### 2.11 배제 3경로 핸들러 `[DEV-EXIT]` (v1.5) → `[PRD-EXIT-PRINCIPLE]` 2.7

```js
// 독촉 (강제 마감의 통지 — 5.3)
function nudge(id) {
  setMeeting(commitMeeting({ ...meeting, nudgedIds: [...new Set([...meeting.nudgedIds, id])] })); // ⑧
  showToast("독촉 알림을 전송했습니다"); // 연출
}
// 강제 마감: CF01(FORCE_CLOSE) — nudgedIds로 이력 라인 분기 → 실행 시 forceClosed 커밋 ⑥

// 강등 (5.1-2) — 불참 예상 필수 1명 카드 한정. v1.9: 의견 남기기 인자 추가
function demoteMember(id, slotKey, note) {
  setMeeting(commitMeeting({
    ...meeting,
    members: /* 대상 attendance = "OPTIONAL" */,
    demotedReasons: { ...meeting.demotedReasons, [id]: slotKey },
    demoteNotes: note ? { ...meeting.demoteNotes, [id]: note } : meeting.demoteNotes,
  })); // ⑦
  showToast(`${이름}님에게 참조자 변경 알림을 전송했습니다`); // 연출
} // CF01(DEMOTE): reRequestedIds 이력 라인 + 결과 문장 + 선택 텍스트 입력(의견) → 실행 → 추천 즉시 재연산
// demoteNotes에 값이 있으면 노출 지점은 **PROGRESS 실시간 A01 당사자 배너 단 1곳**이다 (v2.0 — 발견 76, 확정 시점까지 기다리지 않음):
//   A01 당사자 배너에 "주최자님의 메모: {내용}" 즉시 노출
// v2.1 정정 (발견 82): 이전 명세는 D01-DONE(주최자 확정 완료 화면)에도 노출하라고 잘못 지시했다.
//   그 메모는 주최자가 강등 당사자에게 남긴 것이지 주최자 자신에게 남긴 게 아니므로,
//   주최자 화면에 재노출하는 것은 자신이 쓴 글을 자신에게 다시 보여주는 무의미한 구조다.
//   D01-DONE 렌더링 코드에서 demoteNotes 참조를 제거할 것 — 남아있으면 결함.
// 저장만 하고 A01 배너에 안 보여주면 결함(발견 76 원칙은 유효)

// 참석 취소 (5.5 경로 A — 실구현). COMPLETED 확정 안내 링크 → cancelStage "AUTH" → "CONFIRM"
// v1.6 재설계: "연산 완전 제외" 모델 폐기 — 슬롯 단위 거절로 축소, 재조율에 본인 계속 참여 (PRD 5.5, [PRD-CANCEL-SCOPE])
function cancelAttendance(id) {
  const m = /* 해당 멤버 */;
  if (m.attendance === "REQUIRED") {
    setMeeting(commitMeeting({
      ...meeting,
      status: "CONFLICT",
      droppedMemberId: id, // 배너·표기 참조용 — 연산 제외에는 쓰지 않음
      availability: { ...meeting.availability, [id]: { ...meeting.availability[id], [meeting.confirmedSlot]: "UNAVAILABLE" } }, // 그 슬롯만 차단
      declinedOptionalIds: [],
    })); // ③ + 초기화
    showAlertBanner(`${m.name}님이 참석을 취소했습니다.`, "EX05");
  } else {
    setMeeting(commitMeeting({ ...meeting, declinedOptionalIds: [...meeting.declinedOptionalIds, id] })); // ⑨
  }
}
// 재조율 연산: calculateBestTime(..., { excludeIds: [] }) — droppedMemberId를 excludeIds에 넣지 않는다.
// 취소자도 다른 참석자와 동일하게 [내 가용 시간 업데이트하기] 대상.
// 패널 [이탈 발생시키기] = 경로 B(웹훅 모킹, m3 고정) — fireDropout 유지, 경로 A와 병존 (PRD 5.5)
// H01 권한 토글·제목: meeting.launched면 비활성(표시형) — 통지 없는 배제 뒷문 차단, 회의 정체성 보호 (PRD 2.2, v1.9)
// CONFLICT 중 A01: 일반 참석자는 [가용성 업데이트]로 재편집 가능, droppedMemberId 본인은 전용 안내 (PRD 2.5-⑤)
```

### 2.12 회의 폐기 (v1.9 신설) → `[PRD-CANCEL-MEETING]` 5.6

```js
function cancelMeeting(reason) {
  setMeeting(commitMeeting({ ...meeting, status: "CANCELLED", cancelReason: reason || null })); // ⑩
}
// CF01: 결과 문장 + 선택 입력(사유) + [취소]/[회의 취소하기]. status와 무관하게(PROGRESS·COMPLETED·CONFLICT 어디서든) 실행 가능
// CANCELLED는 흡수 상태 — resolveRoute·deriveStep 모두 다른 어떤 판정보다 먼저 확인 (3.1·3.2 최우선 가드)
```

### 2.13 역강등 요청 (v1.9 신설, v2.0 사유 필드 추가) → `[PRD-PROMOTE-REQUEST]` 5.1

```js
// 요청 (참석자, 본인이 REQUIRED일 때만 노출 — 주최자 본인 제외)
// v2.0 (발견 76): reason 인자 추가 — 입력받은 사유는 promotionRequests 항목에 저장되고,
//   D01 통합 행동 배너(2.17)가 그대로 노출해야 한다. 저장만 하고 안 보여주면 결함.
function requestPromotion(id, reason) {
  setMeeting(commitMeeting({ ...meeting, promotionRequests: [...meeting.promotionRequests.filter(r => r.id !== id), { id, status: "PENDING", reason: reason || null }] })); // ⑪
}
function cancelPromotionRequest(id) {
  setMeeting(commitMeeting({ ...meeting, promotionRequests: meeting.promotionRequests.filter(r => r.id !== id) })); // ⑪
}
// 승인 (주최자) — 기존 demoteMember를 그대로 호출, 요청 상태만 정리
function approvePromotionRequest(id) {
  demoteMember(id, null, null); // 근거 슬롯 없음(요청 기반이므로) — CF01 문구는 "요청을 승인합니다"로 분기
  setMeeting((prev) => commitMeeting({ ...prev, promotionRequests: prev.promotionRequests.filter(r => r.id !== id) }));
}
function rejectPromotionRequest(id) {
  // v2.1 정정 (발견 80): 이전 구현은 배열에서 항목을 바로 삭제했다 — 요청자는 "대기 중" 배너가
  // 사라진 것만으로 간접 추측해야 했고, 이는 "수신 재현 불가" 원칙(서버 알림 발신을 재현하지 않는다는 것)을
  // "요청자 화면에 결과를 아예 안 보여줘도 된다"는 뜻으로 잘못 확장 적용한 것이었다. 원칙은 발신을
  // 재현하지 않는다는 것이지, 사후 가시성(2.7 ③요소)까지 생략해도 된다는 뜻이 아니다.
  // 삭제 대신 status만 REJECTED로 바꾸고 배열에 유지한다 — 요청자 화면이 이 상태를 읽어 배너를 그린다.
  setMeeting(commitMeeting({
    ...meeting,
    promotionRequests: meeting.promotionRequests.map(r => r.id === id ? { ...r, status: "REJECTED" } : r),
  })); // ⑪
  showToast("요청을 거절했어요");
}
// 확정 시 자동 폐기 (PRD 5.1): handleConfirmMeeting 성공 분기에서 promotionRequests: [] 로 초기화 커밋 (REJECTED 잔여분 포함 전부 정리)
// 대기 상태 판별: meeting.promotionRequests.find(r => r.id === 본인id && r.status === "PENDING")
// 거절 상태 판별(A01, v2.1): meeting.promotionRequests.find(r => r.id === 본인id && r.status === "REJECTED")
//   → 배너 노출 + [확인] 버튼 → acknowledgePromotionRejection(id)로 배열에서 완전히 제거(⑭) — 반복 재진입마다 배너가 계속 뜨지 않도록
function acknowledgePromotionRejection(id) {
  setMeeting(commitMeeting({ ...meeting, promotionRequests: meeting.promotionRequests.filter(r => !(r.id === id && r.status === "REJECTED")) })); // ⑭
}
```

### 2.13-A 필수 복귀 요청 (v2.1 신설) → `[PRD-REINSTATE-REQUEST]` 5.1

역강등 요청(2.13)의 대칭 경로 — 구조를 그대로 복제하되 필드와 전이 방향만 바꾼다.

```js
// 요청 (참석자, 본인이 OPTIONAL일 때만 노출 — 이미 REQUIRED인 사람은 대상 아님)
function requestReinstate(id, reason) {
  setMeeting(commitMeeting({ ...meeting, reinstateRequests: [...meeting.reinstateRequests.filter(r => r.id !== id), { id, status: "PENDING", reason: reason || null }] })); // ⑬
}
function cancelReinstateRequest(id) {
  setMeeting(commitMeeting({ ...meeting, reinstateRequests: meeting.reinstateRequests.filter(r => r.id !== id) })); // ⑬
}
// 승인 (주최자) — attendance를 REQUIRED로 되돌린다. demoteMember의 역방향이지만 별도 함수로 둔다 —
// 강등이 demotedReasons·demoteNotes 같은 강등 전용 부가 데이터를 남기는 것과 달리, 복귀는 그런 이력을 새로 만들지 않는다.
function approveReinstateRequest(id) {
  setMeeting((prev) => commitMeeting({
    ...prev,
    members: prev.members.map(m => m.id === id ? { ...m, attendance: "REQUIRED" } : m),
    reinstateRequests: prev.reinstateRequests.filter(r => r.id !== id),
  })); // ⑦ 준용(권한 변경) + ⑬
  showToast(`${이름}님을 다시 필수 참석자로 전환했어요`);
}
function rejectReinstateRequest(id) {
  setMeeting(commitMeeting({
    ...meeting,
    reinstateRequests: meeting.reinstateRequests.map(r => r.id === id ? { ...r, status: "REJECTED" } : r),
  })); // ⑬
  showToast("요청을 거절했어요");
}
function acknowledgeReinstateRejection(id) {
  setMeeting(commitMeeting({ ...meeting, reinstateRequests: meeting.reinstateRequests.filter(r => !(r.id === id && r.status === "REJECTED")) })); // ⑭
}
// 확정 시 자동 폐기: handleConfirmMeeting 성공 분기에서 reinstateRequests: [] 로 초기화 커밋 (promotionRequests와 동일 패턴)
// 대기/거절 상태 판별: promotionRequests와 동일한 find 패턴, 필드만 reinstateRequests로 교체
```

### 2.14 기간 확장 재탐색 (v1.9 신설, v2.0 재구현) → `[PRD-EX-01]` 교착 해소 액션 ③

**대상 필드가 `candidatePeriod`로 바뀌었다 (v2.0 — 발견 77).** 조율 기간(`coordinationPeriod`)은 이 액션과 무관하다 — 넓히는 건 항상 "회의가 열릴 수 있는 날짜"다.

```js
// Date 객체 미사용 원칙 준수 — FULL_DATES(고정 문자열 배열, v2.4부터 7일 목업 풀 — 발견 88 최대 7일 정책)의 인덱스로 다음 날짜를 찾는다
function extendPeriod() {
  const idx = FULL_DATES.indexOf(meeting.candidatePeriod.end);
  const newEnd = FULL_DATES[Math.min(idx + 2, FULL_DATES.length - 1)];
  setMeeting(commitMeeting({
    ...meeting,
    candidatePeriod: { ...meeting.candidatePeriod, end: newEnd },
    periodExtendedFrom: meeting.candidatePeriod.end, // v2.1 신설(발견 79) — 확장 직전 end를 기록, A01이 "신규 날짜" 판별에 사용
    extensionUpdatedIds: [], // v2.2 신설(발견 86) — 새 확장 세션 시작, 이전 확장의 재제출 기록은 리셋
  })); // ⑫
  showToast("회의 후보 날짜를 넓혔어요 — 다시 계산할게요");
}
// activeDates(candidatePeriod)/activeSlots(candidatePeriod)가 그리드·히트맵·calculateBestTime 호출부에서
// candidatePeriod 변경을 즉시 반영하므로, 이 함수는 필드 값만 갱신하면 나머지는 자동으로 재계산된다.
// 신규 날짜가 실제로 빈 상태인 이유는 함수 로직이 아니라 시드 단계(1.3, 발견 86)에서 이미 보장된다 —
// extendPeriod 자신은 필드 값만 옮길 뿐, 어떤 슬롯 데이터도 채우거나 지우지 않는다(그럴 필요가 없어졌다).

// [DEV-EXT-STATUS] 기간 확장 후 제출 현황 재대기 (v2.2 신설, 발견 86) → D01-STATUS
// submitAvailability에 분기 추가 — CONFLICT 분기(2.6-REMATCH-STATUS)와 나란히, PROGRESS 중 확장 이력이 있으면 기록:
function submitAvailability_extensionBranch(meeting, currentMemberId) {
  const isPostExtension = meeting.status === "PROGRESS" && meeting.periodExtendedFrom !== null;
  return isPostExtension ? [...new Set([...meeting.extensionUpdatedIds, currentMemberId])] : meeting.extensionUpdatedIds;
}
// D01-STATUS 렌더: periodExtendedFrom이 있으면 submittedCount 대신 extensionUpdatedIds.length를 카운트로 쓰고,
// 멤버별 칩도 status===SUBMITTED 대신 extensionUpdatedIds.includes(id)로 판정한다 — "최초 제출"과 "확장 후 재제출"은 다른 축.

// A01 그리드 신규 날짜 강조 판정 (v2.1 신설, 발견 79):
// isNewlyAddedDate(date) = meeting.periodExtendedFrom !== null && date > meeting.periodExtendedFrom
// [기간 넓혀서 다시 찾기]는 [재요청](sendReRequest, 2.10)과 완전히 별개 함수다 — 이 함수가 reRequestedIds를 건드리는 일은 없다.
// 이 액션은 "전원"이 대상이므로 특정 멤버 대상의 알림 기록(nudgedIds·reRequestedIds)과 같은 성격의 필드를 두지 않는다 —
// periodExtendedFrom 하나로 전원 판정이 되므로 멤버별 발송 목록이 불필요하다.
```

### 2.15 일 단위 일괄 불가 (v1.9 신설) → PRD 3.3

```js
function fillDayUnavailable(date) {
  setTempGrid((prev) => {
    const g = { ...(prev[currentMemberId] || {}) };
    HOURS.forEach((h) => { const sk = slotKeyOf(date, h); if (!g[sk]) g[sk] = "UNAVAILABLE"; }); // UNSET만 전환, 기존 값 보존
    return { ...prev, [currentMemberId]: g };
  });
}
// [나머지 다 가능으로](fillRemaining, 2.8)와 대칭 — 날짜 헤더 탭 시 호출
```

### 2.16 프로액티브 재요청 판정 (v1.9 신설) → `[PRD-PROACTIVE]` 5.3

```js
function checkProactiveNudge(buffer) {
  // 제출 직전 buffer를 반영한 가상 availability로 calculateBestTime을 미리 실행
  const projected = { ...meeting.availability, [currentMemberId]: buffer };
  const result = calculateBestTime(projected, meeting.members, {});
  // level 2(비선호 포함)이고 병목이 정확히 1명이며 그 1명이 본인이 아닌 경우 → 프로액티브 팝업 대상 아님(본인 화면 한정 원칙)
  // level 3(부분 성립)이고 absentees.length === 1이고 그 1명이 "본인 제출로 인해 발생"한 경우만 팝업
  // 판정 로직은 데모 스코프에서 단순화: 본인 제출 전/후 top1 slotKey의 level이 악화되는지 비교
  return result[0]?.level >= 2 ? result[0] : null;
}
// 제출 버튼 클릭 시 이 함수를 먼저 실행 → 대상 있으면 CF01 팝업(본인 화면 한정) → 아니요 선택 시 정상 제출 진행
```

### 2.17 주최자 통합 행동 배너 판정 (v1.9 신설, v2.0 범위 축소, v2.1 대상 확장) → `[PRD-NEXT-ACTION]` 3.9

**v2.0 개정 (발견 74):** 원래 있던 "재요청 시 즉시 전원 합의 가능"(ONE_AWAY) 판정을 제거했다 — Top3 카드의 재요청 액션과 완전히 중복 노출되는 결함이었다. 이 배너는 **역강등 요청 승인/거절**과(v2.1부터) **필수 복귀 요청 승인/거절**을 담당한다.

```js
function deriveNextAction(meeting) {
  const pendingPromotion = meeting.promotionRequests.find(r => r.status === "PENDING");
  const pendingReinstate = meeting.reinstateRequests.find(r => r.status === "PENDING"); // v2.1 신설
  const actions = [];
  if (pendingPromotion) actions.push({ type: "PROMOTION", memberId: pendingPromotion.id, reason: pendingPromotion.reason });
  if (pendingReinstate) actions.push({ type: "REINSTATE", memberId: pendingReinstate.id, reason: pendingReinstate.reason });
  return actions; // v2.1: 배열로 변경 — 두 유형이 동시에 대기 중이면 배너 2개를 각각 렌더링 (DS 3.9 참조, 하나로 뭉뚱그리지 않음)
}
// D01 최상단에서 actions.map으로 배너를 각각 렌더링. reason이 있으면 배너에 "사유: {reason}"을 함께 노출한다 (발견 76, 81 동일 적용).
// EX-03 마감 유예 배너는 이 함수에 흡수되지 않고 기존 자리(AB01/BANNER, 5.3)에서 독립적으로 노출된다.
// 반환 타입이 단일 객체(v2.0)에서 배열(v2.1)로 바뀌었으므로, 호출부의 `pendingPromotion &&` 단일 분기 렌더링 코드는
// `actions.map(a => ...)` 형태로 함께 수정해야 한다 — 타입만 바꾸고 호출부를 안 고치면 결함.
```

---

## 3. 가상 라우팅·가드·패널 메커니즘 `[DEV-ROUTE]`

### 3.0 컴포넌트 아키텍처 `[DEV-COMPONENT-ARCH]` (v2.6 신규 — 발견 92)

**이전 구조(13차 재생성본까지):** 화면 16개(BrandBar부터 ScenarioPanel까지)가 `App()` 함수 내부에 선언된 클로저였고, JSX 태그가 아니라 `HostCreateScreen()`처럼 일반 함수 호출로 렌더링됐다. React DevTools에 컴포넌트로 잡히지 않고, `React.memo`도 적용할 수 없었다.

**현재 구조:** `AppContext`(React Context) 하나에 `App()`의 상태·세터·핸들러·파생값 전체를 담아 `<AppContext.Provider>`로 감싸고, 화면 16개는 모듈 최상단에 선언된 실제 함수 컴포넌트로 분리했다 — 각각 `const { ... } = useApp();`로 필요한 항목만 구독한다. 호출부도 전부 JSX 태그(`<AttendeeScreen />`)로 바뀌었다.

```js
const AppContext = createContext(null);
function useApp() { return useContext(AppContext); }
// App() 내부:
const ctx = { meeting, setMeeting, /* ...상태·핸들러·파생값 전부... */ };
return <AppContext.Provider value={ctx}>{/* ... */}</AppContext.Provider>;
```

이 리팩터는 순수하게 구조적이다 — JSX·상태 전이·핸들러 로직은 전혀 바꾸지 않았다(문자열 리터럴 189개 전수 대조로 확인). 여러 컨텍스트로 세분화(예: 데이터 상태 vs UI 상태 분리)하지 않고 단일 컨텍스트로 묶은 이유는, 화면 대부분이 `meeting`과 UI 상태를 동시에 참조해 경계를 나누는 이득이 크지 않기 때문이다 — 추후 특정 화면의 리렌더 비용이 실제로 문제가 되면 그때 분리를 검토한다.

### 3.1 단계 도출 (deriveStep) → PRD 2.3, 3.7

```js
function deriveStep(meeting, currentPath) {
  if (meeting.status === "CANCELLED") return 4; // v1.9 — 종료 상태는 완료와 동일 취급(단계 표시 목적)
  if (meeting.status === "COMPLETED") return 4;
  if (meeting.status === "CONFLICT") return 3; // 회귀 표시
  const required = meeting.members.filter(m => m.attendance === "REQUIRED");
  const allIn = required.every(m => m.status === "SUBMITTED") || meeting.forceClosed; // 의사결정자 기준 (PRD 3.7)
  if (allIn) return 3;
  if (currentPath === "/host/create") return 1;
  return 2;
}
// CX01 노출은 제품 화면(H01·A01·D01·R01) 한정 — L01·GD01 미노출 (PRD 2.3)
```

### 3.2 진입 가드 (resolveRoute) → `[PRD-ROUTE-GUARD]` 2.6, DS 3.1

```js
// 모든 setCurrentPath는 이 함수를 통과한다 (패널 바로가기·동기화 수신 포함)
function resolveRoute(requestedPath, meeting) {
  if (requestedPath === "/" || requestedPath === "/guide") return requestedPath; // 상시 허용
  if (meeting.status === "CANCELLED") {
    if (requestedPath === "/host/create" || requestedPath === "/host/re-match") return "/host/dashboard"; // v1.9 — 최우선 가드, CANCELLED 종료 화면으로
    return requestedPath; // A01·D01은 종료 화면 렌더링
  }
  if (!meeting.launched && !["/", "/guide", "/host/create"].includes(requestedPath))
    return "/host/create"; // 미발의 가드 (PRD 2.6, v1.5)
  if (meeting.status === "COMPLETED") {
    if (requestedPath === "/host/create") return "/host/dashboard"; // H01 → D01
    return requestedPath; // A01은 진입 허용 — RESULT-CONFIRMED 렌더링 (2.5-⑤)
  }
  if (meeting.status === "CONFLICT") {
    if (requestedPath === "/host/create" || requestedPath === "/host/dashboard") return "/host/re-match";
    return requestedPath; // A01은 RESULT-REMATCH 렌더링
  }
  return requestedPath; // PROGRESS: R01은 라우팅 허용하되 가드 상태 렌더링 (PRD 6.5)
}
// [DEV-SYNC] 수신으로 status 변경 시 현재 경로를 resolveRoute로 재평가하여 필요 시 이동
```

### 3.3 화면 분기 (DS 3.1과 1:1)

**배너 렌더 조건 (v1.6 — PRD 1.5):** `{isHostScreen && <AlertBannerView />}`, `isHostScreen = ["/host/dashboard","/host/re-match"].includes(currentPath)`. A01에서는 지속 배너(AlertBannerView) 미렌더링 — 단, A01 그리드 화면의 독촉 당사자 배너(위 nudge 항목)는 별개 컴포넌트로 예외적으로 노출된다 (당사자 가시성 요건, PRD 2.7).

```js
{currentPath === "/"              && <LandingScreen />}      // [DS-FLOW-L01]
{currentPath === "/guide"          && <GuideScreen />}        // [DS-FLOW-GD01] devpanel 룩
{currentPath === "/host/create"    && <HostCreateScreen />}   // [DS-FLOW-H01] 발의 → 토스트 → D01 (PRD 2.5-②)
{currentPath === "/attendee"       && <AttendeeScreen />}     // [DS-FLOW-A01] 5단계 + RESULT 오버라이드
{currentPath === "/host/dashboard" && <HostDashboardScreen />}// [DS-FLOW-D01]
{currentPath === "/host/re-match"  && <HostReMatchScreen />}  // [DS-FLOW-R01]
{panelVisible && <ScenarioPanel />}                           // [DS-FLOW-P01]
{alertBanner && <AlertBanner />}                              // [DS-COMP-AB01]
{toast && <Toast />}                                          // [DS-COMP-T01]
```

**A01 내부 분기 (DS 3.3 매트릭스와 1:1):**
```js
if (meeting.status === "COMPLETED") return <ResultConfirmed />; // stage 무시
if (meeting.status === "CONFLICT")  return <ResultRematch />;
switch (attendeeStage) { case "INVITE": ... "AUTH": ... "GRID": ... "DONE": ... }
```

**재편집 프리로드 (PRD 3.5):** AUTH에서 멤버 선택 시 버퍼에 키가 없고 `meeting.availability[id]` 존재 → 버퍼로 복사 후 GRID 진입. SUBMITTED 멤버가 빈 그리드로 시작하면 결함.

**제출 (PRD 2.5-④):** 커밋 ① → `setAttendeeStage("DONE")`. **D01 강제 전환 금지.** DONE의 [대시보드에서 결과 보기]만 D01 이동.

**발의 (PRD 2.5-②):** H01 액션 → 토스트 "초대 링크가 생성되었습니다" → `/host/dashboard`. D01-LINK 카드의 [링크 열어보기] → `/attendee` + stage `INVITE`.

**[새 회의 만들기] (PRD 2.5-⑥):** 1탭 `resetArmed=true`(버튼 문구 전환), 2탭 `resetDemoData()` → `/`. 다른 조작 시 resetArmed 해제.

### 3.4 시나리오 패널 `[DEV-PANEL]` → `[PRD-SIM-PANEL]`

- 토글: 데스크톱 `Ctrl+Shift+D` / 모바일 로고 5회 탭(2초 내). 우상단 ✕.
- 구성 (DS P01과 1:1, v1.4): 가상 시계 / EX-04 / **EX-05 [이탈 발생시키기] 단발 버튼 (COMPLETED에서만 활성)** / 데이터 초기화 / 바로가기 **L01·H01·A01·D01·R01** — 바로가기도 `resolveRoute` 통과.
- **힌트 라인 (v1.4 — PRD 1.4/1.7):** 각 제어 하단에 현재 설정의 효과를 상시 표기. 문구는 DS [DS-FLOW-P01-HINT]와 1:1.

### 3.5 피드백 규칙 → `[PRD-NOTICE]`

- `alert()` 전면 금지. 경량=토스트(2.5초, 동시 1개), 중요(EX-04·EX-05)=지속 배너.
- **배너 해소 (v1.3):** `showAlertBanner(message, cause)`로 원인 키를 저장. 확정 성공 시 `clearBannerByCause("EX04")`·`clearBannerByCause("EX05")` 실행 — 유발 상황 해소 시 자동 해제 (PRD 1.5). 수동 ✕도 유지.

### 3.6 검증 스크립트 (재생성 후 필수 실행)

```bash
npx esbuild app.js --bundle --outfile=/dev/null --loader:.js=jsx   # 문법 통과
grep -c "alert(" app.js            # 0이어야 함
grep -c "location.reload" app.js   # 0이어야 함
grep -c "Date.now" app.js          # 0이어야 함 (마감 판정 오염 검사)
grep -c "PRD-" app.js              # 태그 주석 존재 확인 (역추적)
grep -c "commitMeeting" app.js     # 정의 1 + 호출(제출·유입·발의·확정·이탈·취소·불참·강제마감·강등·독촉·재요청·EX04) — 10 이상 (커밋 지점 ②확정과 ④재조율 확정은 handleConfirmMeeting 단일 경로 공유 — PRD 6.3)
```

### [DEV-LATE-JOIN] 뒤늦은 제출 경로 (v1.8) → `[PRD-LATE-JOIN]`

```js
const [lateJoinId, setLateJoinId] = useState(null); // COMPLETED 중 미확인자의 뒤늦은 제출 플로우 식별자

// MemberPicker onPick 분기: status !== "SUBMITTED" → lateJoinId 설정 + GridEditor 진입 (취소 플로우 아님)
// submitAvailability 3분기 (lateJoinId 존재 시):
//   확정 슬롯이 AVAILABLE|AVOID 포함 → 상태 전이 없이 커밋만, 토스트 "이 시간에 참석 가능하신 걸로 기록했어요"
//   미포함 → CONFLICT 전이, dropReason: "LATE_MISMATCH", declinedOptionalIds 초기화
// dropReason 3종 연산 취급 (v2.3부터 통일): SELF_CANCEL·LATE_MISMATCH·WEBHOOK 전부 excludeIds 미사용(계속 참여) —
// 각 경로의 확정 슬롯 자동 마킹(UNAVAILABLE 또는 BLOCK_STRICT)만으로 결과에서 자연히 제외된다
```

### [DEV-EX04-EXCLUDE] EX-04 명시적 실패 슬롯 배제 (v1.8) → 발견 61

```js
const [ex04FailedSlots, setEx04FailedSlots] = useState([]);
// handleConfirmMeeting의 ex04Conflict 분기에서 시도한 slotKey를 무조건 이 목록에 추가.
// top3 useMemo에서 .filter(s => !ex04FailedSlots.includes(s.slotKey)) 적용 — 대상자 가용성 변경이
// 실제로 pool에서 슬롯을 제외하는지에 간접 의존하지 않고, 시도 자체를 직접 차단한다.
// resetDemoData에서 초기화 필수 (누락 시 새 회의에서도 이전 세션의 실패 슬롯이 남는 결함).
```

### [DEV-DEMOTE-REASON] 강등 사유 기록 (v1.8) → 발견 64

```js
// meeting.demotedReasons: { [memberId]: slotKey } — demoteMember(id, slotKey) 호출 시 함께 커밋 ⑦
// 당사자 배너: meeting.demotedReasons[본인id] 존재 시 fmtSlot()으로 근거 슬롯을 문장에 포함
```
