// =====================================================================
// MeetSync — 6인 도메인 일정 조율 데모 (12차 재생성본)
// 기준 문서: 01_master_prd.md v3.0 / 02_design_system.md v2.7 / 03_dev_guide.md v2.5
// 규칙: 얼럿 금지(토스트/배너/확인 영역), 전체 리로드 금지, 마감 판정에 실제 시계 사용 금지
// 핵심 정책: COMPLETED 불변식 + 배제 3경로(강제 마감·강등·이탈)의 선언·통지·가시성 [PRD-EXIT-PRINCIPLE]
// =====================================================================
import React, { useState, useEffect, useRef, useMemo } from "react";

// [DS-TOKEN 구현 규칙] v2.6 이식 — Geist 웹폰트 1회 로드 + tailwind.config 확장 등록.
// CDN Tailwind(Play CDN) 전제 — index.html에서 Tailwind 스크립트가 로드된 뒤 이 config가 읽혀야 하므로,
// 이 대입은 반드시 React 렌더 이전, 모듈 최상단에서 실행된다.
if (typeof window !== "undefined") {
  if (!document.getElementById("meetsync-geist-font")) {
    const link = document.createElement("link");
    link.id = "meetsync-geist-font";
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/geist@1/dist/fonts/geist-sans/style.css";
    document.head.appendChild(link);
  }
  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    theme: { extend: {
      colors: {
        background: "#FFFFFF", foreground: "#302E33",
        primary: { DEFAULT: "#3C3A40", foreground: "#F7F7F8" },
        card: "#FFFFFF", secondary: "#EFEEF0",
        "muted-foreground": "#76717F", border: "#DBD9DE", ring: "#97929E",
        destructive: { DEFAULT: "#E03434", foreground: "#FFFAF5" },
        success: { DEFAULT: "#02B541", foreground: "#F0FCF8" },
        warning: { DEFAULT: "#E39219", foreground: "#FFFDF5" },
        unavail: "#76717F", block: "#DBD9DE", unset: "#FFFFFF",
        devpanel: { DEFAULT: "#3C3A40", foreground: "#C9C6CE" },
      },
      borderRadius: { md: "8px", xl: "14px" },
      fontFamily: { sans: ["Geist", "sans-serif"] },
    } },
  };
}

// [DS-TOKEN] — 02_design_system.md 섹션 1과 1:1 (v2.6 shadcn/Tailwind 킷 표준 이식)
const T = {
  background: "bg-background",
  foreground: "text-foreground",
  primary: "bg-primary",
  primaryForeground: "text-primary-foreground",
  card: "bg-card",
  success: "bg-success",
  successLight: "bg-success/10",
  textSuccess: "text-success",
  warning: "bg-warning",
  warningLight: "bg-warning/10",
  textWarning: "text-warning",
  unavail: "bg-unavail",
  block: "bg-block",
  unset: "bg-unset",
  destructiveLight: "bg-destructive/10",
  borderDestructive: "border-destructive/20",
  textDestructive: "text-destructive",
  mutedForeground: "text-muted-foreground",
  border: "border-border",
  devpanel: "bg-devpanel",
  devpanelForeground: "text-devpanel-foreground",
  disabled: "opacity-40 pointer-events-none",
  pScreen: "p-6",
  pCard: "p-4",
  roundedContainer: "rounded-xl",
  roundedElement: "rounded-md",
  pressed: "transition-all active:scale-[0.98]",
};
// 히트맵 인원수 오퍼시티 스케일 (v2.6 — DS 1.1 shadcn 이식, success 단일색 균등 오퍼시티) + 마커 분리
const HEAT_RAMP_BY_COUNT = { 0: "bg-[#EFEEF0]", 1: "bg-success/15", 2: "bg-success/30", 3: "bg-success/45", 4: "bg-success/60", 5: "bg-success/80", 6: "bg-success" }; // v2.6 — 서로 다른 원시색 6개 램프에서 success 단일색 오퍼시티 6단계로 전환. "같은 인원수는 어느 화면에서든 같은 색" 원칙(v2.0, 발견 58·62)이 이제 색상 1개만 쓰므로 구조적으로 보장됨
const RING_CONFIRMED = "ring-2 ring-success"; // 확정 슬롯 상시 마커 (v2.6 — 구 ring-emerald-600)
const RING_SELECTED = "ring-2 ring-ring";    // 탐색 선택 (v2.6 — 구 ring-slate-400, 신규 ring 토큰)
const CONFIRMED_BG = `${T.primary} ${T.primaryForeground}`; // v1.9 — 실제 토큰 참조로 수정 (발견 45: 리터럴 "bg-primary"는 CDN Tailwind가 인식 못 해 배경이 투명해지는 버그였음). v2.6 tailwind.config에 primary가 등록되어 있어 이 문제는 원천적으로 재발하지 않는다

// [DEV-DATA-GRID] 슬롯 체계 — PRD 3.1
const STORAGE_KEY = "meeting-demo-state";
const FULL_DATES = ["2026-07-16", "2026-07-17", "2026-07-18", "2026-07-19", "2026-07-20", "2026-07-21", "2026-07-22"]; // v2.4(발견 88) — 후보 기간 최대 7일 정책에 맞춰 5일→7일 확장
// v2.5 (발견 77, 근본 수정) — 조율 기간(응답 수집 창)과 실제 회의 후보 날짜는 다른 개념이다.
// 응답 마감(07/15)이 지나야 회의가 열릴 수 있으므로, 후보 슬롯은 마감 "이후" 날짜여야 한다.
// 기존엔 후보 슬롯(07/13~07/15)이 응답 수집 기간과 그대로 겹쳐 있어 — 마감일에 걸린 슬롯을
// 투표하는 모순이 있었다. 이제 후보 범위를 07/16~07/20(마감 다음 날부터)으로 옮긴다.
const DAY_LABEL = { "2026-07-13": "월", "2026-07-14": "화", "2026-07-15": "수", "2026-07-16": "목", "2026-07-17": "금", "2026-07-18": "토", "2026-07-19": "일", "2026-07-20": "월", "2026-07-21": "화", "2026-07-22": "수" }; // v2.4(발견 88) — FULL_DATES 7일 확장에 맞춰 라벨 추가
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17];
const slotKeyOf = (date, h) => `${date}T${String(h).padStart(2, "0")}:00`;
const FULL_ALL_SLOTS = FULL_DATES.flatMap((d) => HOURS.map((h) => slotKeyOf(d, h)));
// v2.4 개정(발견 88): DATES/ALL_SLOTS(고정 3일 하드코딩) 제거 — buildMemberResponse가 이제
// candidatePeriod 인자를 받아 activeSlots()로 직접 채우므로 고정 폭 상수 자체가 불필요해졌다.
// (v2.7/발견 86에서 "5일 전체 미리 채우기"의 결함을 "3일 고정 채우기"로 부분 수정했었으나,
// 그 3일 고정값 역시 발의 시점에 3일보다 긴 기간을 고르는 경로에서 동일한 결함을 재생산했다 — 발견 88.)
const activeDates = (period) => FULL_DATES.filter((d) => d >= period.start && d <= period.end); // v2.3 — [PRD-EX-01] 기간 확장
const activeSlots = (period) => activeDates(period).flatMap((d) => HOURS.map((h) => slotKeyOf(d, h)));
const fmtSlot = (sk) => {
  const [d, t] = sk.split("T");
  return `${d.slice(5, 7)}/${d.slice(8, 10)} (${DAY_LABEL[d]}) ${t}`;
};
const fmtDeadline = (cp) => { // v2.0 — coordinationPeriod 객체를 받아 "종료일(요일) 종료시각" 문자열 생성
  const d = cp.end;
  return `${d.slice(5, 7)}.${d.slice(8, 10)} (${DAY_LABEL[d] || ""}) ${cp.endTime}`;
};
const fmtPeriod = (p) =>
  `${p.start.slice(5, 7)}.${p.start.slice(8, 10)} (${DAY_LABEL[p.start]}) ~ ${p.end.slice(5, 7)}.${p.end.slice(8, 10)} (${DAY_LABEL[p.end]})`;

// [DEV-EX-02] [PRD-EX-02] 이동 시간 버퍼 — 유입 데이터 생성 시 실제 실행
function applyContextBuffer(externalEvents) {
  const keywords = ["외근", "출장", "미팅", "오프라인"];
  const out = {};
  externalEvents.forEach((ev) => {
    if (!keywords.some((k) => ev.title.includes(k))) return;
    const toH = (t) => parseInt(t.slice(0, 2), 10) + parseInt(t.slice(3, 5), 10) / 60;
    const bufStart = toH(ev.start) - 0.5, bufEnd = toH(ev.end) + 0.5;
    HOURS.forEach((h) => {
      if (h < bufEnd && h + 1 > bufStart) {
        out[ev.memberId] = out[ev.memberId] || {};
        out[ev.memberId][slotKeyOf(ev.date, h)] = "BLOCK_STRICT";
      }
    });
  });
  return out;
}

// [DEV-DATA-SEED] 시드 — 전원 PENDING·빈 가용성 (PRD 1.1 응답 유입)
function buildSeedData() {
  return {
    meetingId: "mock-meeting-777",
    title: "팀 주간 싱크 및 하반기 기획 리뷰",
    duration: "1h",
    durationLabel: "1h", // v2.4 (발견 67) — H01 드롭다운 실제 선택값
    // v2.0 (발견 77, [PRD-PERIOD-SPLIT]) — 조율 기간(응답 마감 포함)과 회의 후보 날짜를 완전히 분리한 필드
    coordinationPeriod: { start: "2026-07-13", end: "2026-07-15", endTime: "18:00" }, // 종료 시각이 곧 응답 마감
    candidatePeriod: { start: "2026-07-16", end: "2026-07-18" }, // coordinationPeriod.end 다음 날부터
    status: "PROGRESS",
    confirmedSlot: null,
    droppedMemberId: null,
    dropReason: null, // "SELF_CANCEL" | "WEBHOOK" — v1.6 경로 구분 (PRD 5.5)
    forceClosed: false,
    launched: false,          // 발의 사건 — 유입 트리거·가드·권한 잠금 기준 (v1.5)
    nudgedIds: [],            // 독촉 발송 기록 ⑧
    reRequestedIds: [],       // 재요청 발송 기록 ⑧
    declinedOptionalIds: [],  // 참조자 불참 기록 ⑨ — CONFLICT 전이 시 초기화
    demotedIds: [],           // 강등 이력 — 당사자 배너 판별 (PRD 2.5-⑤)
    demotedReasons: {},       // v2.2 (발견 64): { memberId: slotKey } — 강등 사유가 된 슬롯, 당사자 배너 근거 표기용
    demoteNotes: {},          // v2.3: { memberId: string } — 강등 시 남긴 의견(선택)
    promotionRequests: [],    // v2.3: [{ id: memberId, status: "PENDING"|"REJECTED" }] — 역강등 요청 [PRD-PROMOTE-REQUEST]. v2.5(발견 80): 거절은 삭제 대신 REJECTED로 유지
    reinstateRequests: [],    // v2.5 신설: [{ id: memberId, status: "PENDING"|"REJECTED", reason }] — 필수 복귀 요청 [PRD-REINSTATE-REQUEST], 발견 81
    periodExtendedFrom: null, // v2.5 신설: 마지막 기간 확장 직전 candidatePeriod.end — 신규 날짜 판별 기준, 발견 79
    reMatchUpdatedIds: [],    // v2.5 신설: CONFLICT 진입 이후 가용성 갱신한 멤버 id — 재조율 반영 현황, 발견 83
    extensionUpdatedIds: [],  // v2.7 신설: 기간 확장(periodExtendedFrom) 이후 실제로 재제출한 멤버 id — 제출 현황 재대기, 발견 86
    cancelReason: null,       // v2.3: 회의 폐기 사유 (선택) [PRD-CANCEL-MEETING]
    blockReasons: { m2: "외근 (고객사 방문) · 이동 버퍼 30분", m4: "확정 직전 등록된 외부 일정" },
    members: [
      { id: "m1", name: "김주최", email: "host@company.com", role: "HOST", attendance: "REQUIRED", status: "PENDING" },
      { id: "m2", name: "이디자", email: "design@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
      { id: "m3", name: "최개발", email: "dev@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
      { id: "m4", name: "박기획", email: "pm@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" },
      { id: "m5", name: "정마케", email: "mkt@company.com", role: "MEMBER", attendance: "OPTIONAL", status: "PENDING" },
      { id: "m6", name: "박개발", email: "dev2@company.com", role: "MEMBER", attendance: "REQUIRED", status: "PENDING" }, // [PRD-EX-03 타겟]
    ],
    availability: {},
  };
}
// [DEV-ARRIVAL] 유입 데이터
const ARRIVAL_ORDER = ["m1", "m2", "m3", "m4", "m5"]; // m6 제외 — EX-03 타겟
const MEMBER_AVOIDS = { // v2.5 (발견 77) — 후보 날짜 이동에 맞춰 같은 상대 일자로 재배치 (day0=07/16, day1=07/17, day2=07/18)
  m1: ["2026-07-17T13:00", "2026-07-18T09:00"], // 점심 직후 회피 [PRD-BRIEF]
  m2: ["2026-07-17T13:00"],
  m3: ["2026-07-16T09:00", "2026-07-16T10:00"],
  m4: ["2026-07-18T16:00", "2026-07-18T17:00"],
  m5: ["2026-07-17T14:00", "2026-07-16T15:00"],
};
// v2.4 개정(발견 88): candidatePeriod 인자 필수 — 하드코딩된 ALL_SLOTS(3일 고정) 대신
// 그 회의의 실제 candidatePeriod 전체를 activeSlots()로 채운다. 3일이든 7일이든 동일하게 대응.
function buildMemberResponse(memberId, candidatePeriod) {
  const grid = {};
  activeSlots(candidatePeriod).forEach((sk) => { grid[sk] = "AVAILABLE"; });
  (MEMBER_AVOIDS[memberId] || []).forEach((sk) => { grid[sk] = "AVOID"; });
  if (memberId === "m2") {
    const blocks = applyContextBuffer([
      { memberId: "m2", title: "외근 (고객사 방문)", date: "2026-07-17", start: "11:00", end: "12:00" }, // v2.5 (발견 77) 날짜 이동
    ]);
    Object.assign(grid, blocks.m2 || {});
  }
  return grid;
}

// [DEV-DATA-PERSIST] 커밋 일원화 — 지점: ①제출·유입 ②확정 ③이탈·취소 ④재조율 확정(② 공유) ⑤EX-04 ⑥강제 마감 ⑦강등 ⑧발송 기록 ⑨참조자 불참 + 발의
function commitMeeting(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : buildSeedData();
  } catch (e) {
    return buildSeedData();
  }
}

// [DEV-EX-01] 추천 연산 — 완화 0~3 + 사유 구분 (UNAVAILABLE·UNSET·BLOCK 격상 불가)
function intersect(av, group, allowAvoid, slots) {
  if (!group.length) return [];
  return slots.filter((sk) =>
    group.every((m) => {
      const v = (av[m.id] || {})[sk];
      return v === "AVAILABLE" || (allowAvoid && v === "AVOID");
    })
  );
}
function partialFit(av, required, slots) {
  const scored = slots.map((sk) => {
    const absentees = [];
    let fit = 0;
    required.forEach((m) => {
      const v = (av[m.id] || {})[sk];
      if (v === "AVAILABLE" || v === "AVOID") fit += 1;
      else absentees.push({ id: m.id, name: m.name, reason: v === "UNAVAILABLE" ? "UNAVAILABLE" : v === "BLOCK_STRICT" ? "BLOCK" : "UNSET" });
    });
    return { slotKey: sk, fit, absentees };
  });
  const max = Math.max(...scored.map((s) => s.fit));
  return scored.filter((s) => s.fit === max);
}
function calculateBestTime(av, members, options = {}) {
  const excluded = new Set(options.excludeIds || []);
  const responders = members.filter((m) => m.status === "SUBMITTED" && !excluded.has(m.id));
  const required = responders.filter((m) => m.attendance === "REQUIRED");
  const optionals = responders.filter((m) => m.attendance === "OPTIONAL");
  const excludedCount = members.length - responders.length;
  const slots = options.slots || FULL_ALL_SLOTS; // v2.3 — 기간 확장 시 활성 범위로 좁혀 전달됨

  let pool, level;
  pool = intersect(av, responders, false, slots); level = 0;
  if (!pool.length) { pool = intersect(av, required, false, slots); level = 1; }
  if (!pool.length) { pool = intersect(av, required, true, slots); level = 2; }
  let items;
  if (!pool.length) { items = partialFit(av, required, slots); level = 3; }
  else items = pool.map((sk) => ({ slotKey: sk, fit: 0, absentees: [] }));

  // 정렬 우선순위 (v1.9 — PRD 3.4 역전, 발견 49): ①필수 참석자 비선호 최소 ②선택 참석자 참여 최대 ③빠른 시간
  // v1.8까지 "선택 참석자 참여"를 1순위로 뒀던 것은 필수 참석자 불편 최소화(관계 비용 테제)를 밀어내는 결과라 역전한다.
  const meta = (sk) => ({
    avoidRequired: required.filter((m) => (av[m.id] || {})[sk] === "AVOID").length,
    optAvail: optionals.filter((m) => (av[m.id] || {})[sk] === "AVAILABLE").length,
    t: FULL_ALL_SLOTS.indexOf(sk), // 정렬 기준은 항상 전체 범위 인덱스(시간순 일관성 유지)
  });
  items.sort((a, b) => {
    const A = meta(a.slotKey), B = meta(b.slotKey);
    if (level === 3 && b.fit !== a.fit) return b.fit - a.fit;
    if (A.avoidRequired !== B.avoidRequired) return A.avoidRequired - B.avoidRequired; // 1순위
    if (B.optAvail !== A.optAvail) return B.optAvail - A.optAvail;                     // 2순위
    return A.t - B.t;                                                                   // 3순위
  });

  return items.slice(0, 3).map((it) => {
    let label, tone, subline = "", subNames = [], reRequestTargets = [], blockNames = [];
    if (level === 0) {
      label = excludedCount > 0 ? "제출한 사람은 모두 가능해요" : "모두 가능한 시간이에요"; tone = "ok";
    } else if (level === 1) {
      subNames = optionals.map((m) => m.name);
      label = `선택 참석자 ${subNames.length}명 빼고 가능해요`; tone = "warn";
      subline = `빠진 선택 참석자: ${subNames.join(", ")}`;
    } else if (level === 2) {
      subNames = required.filter((m) => (av[m.id] || {})[it.slotKey] === "AVOID").map((m) => m.name);
      label = "일부는 피하고 싶은 시간이에요"; tone = "warn";
      subline = `피하고 싶은 시간대: ${subNames.join(", ")}`;
    } else {
      const unav = it.absentees.filter((a) => a.reason === "UNAVAILABLE").map((a) => a.name);
      blockNames = it.absentees.filter((a) => a.reason === "BLOCK").map((a) => a.name);
      const unset = it.absentees.filter((a) => a.reason === "UNSET").map((a) => a.name);
      subNames = it.absentees.map((a) => a.name);
      reRequestTargets = it.absentees.filter((a) => a.reason !== "BLOCK"); // {id,name,reason} — 잠금은 재요청 불가 (PRD 5.1)
      label = `${it.absentees.length}명은 참석 못 해요`; tone = "danger";
      const hard = [...unav, ...blockNames.map((n) => `${n}(다른 일정 있음)`)];
      const parts = [];
      if (hard.length) parts.push(`참석 못 함: ${hard.join(", ")}`);
      if (unset.length) parts.push(`아직 답 안 함: ${unset.join(", ")}`);
      subline = parts.join(" · ");
    }
    return { slotKey: it.slotKey, level, label, tone, subline, subNames, reRequestTargets, blockNames, absentees: it.absentees };
  });
}

// [DEV-EX-03] 마감 유예 — 가상 시계만, 의사결정자 기준
function checkDeadlineStatus(meeting, scenario) {
  const pendingRequired = meeting.members.filter((m) => m.attendance === "REQUIRED" && m.status === "PENDING");
  const reached = scenario.virtualClock === "DEADLINE_REACHED";
  return {
    alertBannerActive: reached && pendingRequired.length > 0 && !meeting.forceClosed,
    shouldBlockResult: pendingRequired.length > 0 && !meeting.forceClosed,
    pendingList: pendingRequired.map((m) => m.name),
    pendingIds: pendingRequired.map((m) => m.id),
  };
}

// [PRD-HEATMAP] 집계 — 인원수 절대값 (v1.5), 읽기 전용
function buildHeatmap(meeting) {
  const responders = meeting.members.filter((m) => m.status === "SUBMITTED");
  const map = {};
  activeSlots(meeting.candidatePeriod).forEach((sk) => { // v2.0 — candidatePeriod 기준
    const detail = responders.map((m) => {
      const v = (meeting.availability[m.id] || {})[sk];
      const state = v === "AVAILABLE" ? "AVAILABLE" : v === "AVOID" ? "AVOID" : v === "UNAVAILABLE" ? "UNAVAILABLE" : v === "BLOCK_STRICT" ? "BLOCK" : "UNSET";
      return { name: m.name, isOptional: m.attendance === "OPTIONAL", state };
    });
    map[sk] = { count: detail.filter((d) => d.state === "AVAILABLE").length, detail };
  });
  return map;
}
const heatToken = (count) => HEAT_RAMP_BY_COUNT[Math.max(0, Math.min(count, 6))];
const HEAT_STATE_LABEL = { AVAILABLE: "가능", AVOID: "피하고 싶음", UNAVAILABLE: "안 되는 시간", BLOCK: "다른 일정 있음", UNSET: "아직 답 안 함" };

// [PRD-ABSENCE-REASON] 불참 사유 3분기 (v1.9, 발견 48) — 미확인/참석불가/자발적불참을 구분
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
// [DEV 2.9] 필수 불참 파생 — 이탈자 포함 (PRD 3.4·6.2)
function deriveAbsentees(meeting) {
  const required = meeting.members.filter((m) => m.attendance === "REQUIRED");
  return required.filter((m) => {
    // v2.4 (발견 73): CONFLICT 진행 중에만 droppedMemberId를 강제 불참 처리한다 —
    // COMPLETED로 재확정된 뒤에는 그 사람이 재요청에 응해 실제로 가능해졌을 수 있으므로
    // absenceReason()의 실데이터 판정만을 신뢰한다. status !== "PROGRESS" 조건은 COMPLETED까지 오염시켜
    // 재요청으로 시간을 연 사람도 영원히 "불참"으로 고정 표시되는 결함이었다.
    if (meeting.status === "CONFLICT" && m.id === meeting.droppedMemberId) return true;
    return absenceReason(m, meeting) !== null;
  });
}

// [DEV-REQUEST-LIST] v2.5 신규 — 역강등/필수복귀 요청 배열 공용 순수 함수 (발견 80·81)
// promotionRequests·reinstateRequests 둘 다 { id, status, reason } 구조를 공유하므로 로직도 공유한다.
function upsertRequest(list, id, reason) { // 요청 생성/갱신 — 기존 항목 있으면 대체
  return [...list.filter((r) => r.id !== id), { id, status: "PENDING", reason: reason || null }];
}
function removeRequest(list, id) { // 취소 — 완전 삭제
  return list.filter((r) => r.id !== id);
}
function rejectRequest(list, id) { // v2.5 정정(발견 80) — 삭제 대신 상태만 REJECTED로 바꿔 요청자가 인지할 수 있게 한다
  return list.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r));
}
function acknowledgeRejection(list, id) { // 거절 확인 후 배열에서 제거 — REJECTED 상태인 항목만 대상
  return list.filter((r) => !(r.id === id && r.status === "REJECTED"));
}
function findPending(list) { return list.find((r) => r.status === "PENDING") || null; }
function isPending(list, id) { return list.some((r) => r.id === id && r.status === "PENDING"); }
function isRejected(list, id) { return list.some((r) => r.id === id && r.status === "REJECTED"); }

// [DEV-EX-01-EXTEND] v2.5 신규 — 기간 확장 신규 날짜 판정 (발견 79)
// periodExtendedFrom은 마지막 확장 직전의 candidatePeriod.end 값. null이면 확장 이력 없음(전부 원본).
function isNewlyAddedDate(date, periodExtendedFrom) {
  return periodExtendedFrom != null && date > periodExtendedFrom;
}

// [DEV-REMATCH-GATE] v2.2 신규 — 재조율 최종 확정 게이팅 (발견 84)
// v2.3 개정(발견 87): dropReason별 제외 분기 삭제 — 경로 A·B·C 무관하게 필수 참석자 전원이 대상.
// 경로 A·C 이탈 유발 본인은 이미 reMatchUpdatedIds에 포함되어 있으므로 이 필터만으로 자연스럽게 걸러지고,
// 경로 B(웹훅) 이탈자는 본인이 실제로 재제출해야 걸러진다 — 의도된 차이(PRD 6-2B).
function deriveRematchGate(meeting) {
  const requiredToReflect = meeting.members.filter((m) => m.attendance === "REQUIRED");
  const pending = requiredToReflect.filter((m) => !meeting.reMatchUpdatedIds.includes(m.id));
  return { blocked: pending.length > 0, pendingNames: pending.map((m) => m.name) };
}

// [DEV-EXT-STATUS] v2.2 신규 — 기간 확장 후 제출 현황 판정 (발견 86)
// periodExtendedFrom 없으면 기존 로직(SUBMITTED 기준) 그대로, 있으면 extensionUpdatedIds 기준으로 전환.
function trackExtensionUpdate(extensionUpdatedIds, meetingStatus, periodExtendedFrom, memberId) {
  if (meetingStatus !== "PROGRESS" || periodExtendedFrom == null) return extensionUpdatedIds;
  return [...new Set([...extensionUpdatedIds, memberId])];
}


// [DEV-REMATCH-STATUS] v2.5 신규 — 재조율 갱신 추적 (발견 83)
// CONFLICT 진행 중 제출이면 기록, 아니면(최초 제출·COMPLETED 재제출 등) 원본 유지.
// "최초 제출 여부"(status SUBMITTED)와 무관하게 "이탈 이후 실제 갱신 여부"만 본다.
function trackRematchUpdate(reMatchUpdatedIds, meetingStatus, memberId) {
  if (meetingStatus !== "CONFLICT") return reMatchUpdatedIds;
  return [...new Set([...reMatchUpdatedIds, memberId])];
}


function deriveStep(meeting, currentPath) {
  if (meeting.status === "CANCELLED") return 4; // v2.3
  if (meeting.status === "COMPLETED") return 4;
  if (meeting.status === "CONFLICT") return 3;
  const required = meeting.members.filter((m) => m.attendance === "REQUIRED");
  const allIn = required.every((m) => m.status === "SUBMITTED") || meeting.forceClosed;
  if (allIn) return 3;
  if (currentPath === "/host/create") return 1;
  return 2;
}

// [PRD-ROUTE-GUARD 2.6] 진입 가드 — 미발의 분기 포함 (v1.5)
function resolveRoute(path, meeting) {
  if (path === "/" || path === "/guide") return path;
  if (meeting.status === "CANCELLED") { // v2.3 — 최우선 가드, 되돌릴 수 없는 종결 상태
    if (path === "/host/create" || path === "/host/re-match") return "/host/dashboard";
    return path;
  }
  if (!meeting.launched && !["/", "/guide", "/host/create"].includes(path)) return "/host/create";
  if (meeting.status === "COMPLETED") {
    if (path === "/host/create") return "/host/dashboard";
    return path;
  }
  if (meeting.status === "CONFLICT") {
    if (path === "/host/create" || path === "/host/dashboard") return "/host/re-match";
    return path;
  }
  return path;
}

// =====================================================================
export default function App() {
  const [meeting, setMeeting] = useState(loadInitialState);
  const [scenario, setScenario] = useState({ virtualClock: "BEFORE_DEADLINE", ex04Conflict: false });
  const [panelVisible, setPanelVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const [attendeeStage, setAttendeeStage] = useState("INVITE");
  const [currentMemberId, setCurrentMemberId] = useState(null);
  const [tempGrid, setTempGrid] = useState({});
  const [alertBanner, setAlertBanner] = useState(null);
  const [toast, setToast] = useState(null);
  const [syncChecking, setSyncChecking] = useState(false);
  const [heatOpen, setHeatOpen] = useState(false);
  const [heatSelected, setHeatSelected] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(null); // [DEV 2.9] CF01 — {type, slotKey?, memberId?} 동시 1개, 자동 소멸 없음
  const [cancelStage, setCancelStage] = useState(null); // 참석 취소 플로우 — {step:"AUTH"} | {step:"CONFIRM", id}
  const [lateJoinId, setLateJoinId] = useState(null); // v2.2 (발견 60) — COMPLETED 중 미확인자의 뒤늦은 제출 플로우, 취소 플로우와 분리
  const [proactiveOffer, setProactiveOffer] = useState(null); // v2.3 신규 — 제출 시점 프로액티브 재요청 [PRD-PROACTIVE]
  const [cancelReasonDraft, setCancelReasonDraft] = useState(""); // v2.3 — 회의 취소 사유 입력 임시 상태
  const [demoteNoteDraft, setDemoteNoteDraft] = useState(""); // v2.3 — 강등 시 의견 입력 임시 상태
  const [promoteReasonDraft, setPromoteReasonDraft] = useState(""); // v2.4 — 역강등 요청 사유 입력 임시 상태 (발견 71)
  const [reinstateReasonDraft, setReinstateReasonDraft] = useState(""); // v2.5 — 필수 복귀 요청 사유 입력 임시 상태 (발견 81)
  const [conflictEdit, setConflictEdit] = useState(null); // CONFLICT 중 가용성 업데이트 — "AUTH" | "GRID"
  const [newCardKeys, setNewCardKeys] = useState([]);
  const [ex04FailedSlots, setEx04FailedSlots] = useState([]); // v2.2 (발견 61) — EX-04로 확정 실패한 슬롯을 명시적으로 기록, 간접 데이터 의존 대신 직접 제외
  const toastTimer = useRef(null);
  const arrivalTimer = useRef(null);
  const preCancelSnapshot = useRef(null); // v2.4(발견 89) — 취소 강제 플로우 전용: 뒤로가기=취소 자체 취소
  const logoTaps = useRef([]);
  const dragRef = useRef({ active: false, apply: null });

  // ---- 피드백 ----
  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };
  const showAlertBanner = (message, cause) => setAlertBanner({ message, cause });
  const clearBannerByCause = (cause) => setAlertBanner((b) => (b && b.cause === cause ? null : b));

  // ---- 라우팅 ----
  const navigate = (path) => {
    const r = resolveRoute(path, meeting);
    if (r === "/attendee" && currentPath !== "/attendee") setAttendeeStage("INVITE");
    setCurrentPath(r);
    setConfirmOpen(null);
    setCancelStage(null);
    setConflictEdit(null);
    setNewCardKeys([]);
  };
  useEffect(() => {
    const r = resolveRoute(currentPath, meeting);
    if (r !== currentPath) setCurrentPath(r);
  }, [meeting.status, meeting.launched]); // eslint-disable-line
  // 상태 전이 시 탐색 상태 리셋 — COMPLETED 위계 준수 (발견 36 부수)
  useEffect(() => {
    setHeatOpen(false); setHeatSelected(null); setConfirmOpen(null); setCancelStage(null); setConflictEdit(null);
  }, [meeting.status]);

  // ---- [DEV-SYNC] 멀티탭 동기화 ----
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      if (e.newValue === null) { setMeeting(buildSeedData()); return; }
      try { setMeeting(JSON.parse(e.newValue)); } catch (err) { /* 무시 */ }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ---- [DEV-ARRIVAL] 응답 유입 — 발의 사건 트리거, 화면 위치 무관 (v1.5) ----
  useEffect(() => {
    const nextId = ARRIVAL_ORDER.find((id) => meeting.members.find((m) => m.id === id).status === "PENDING");
    if (!(meeting.launched && meeting.status === "PROGRESS" && nextId)) return;
    arrivalTimer.current = setTimeout(() => {
      setMeeting((prev) => {
        if (prev.status !== "PROGRESS" || !prev.launched) return prev;
        const id = ARRIVAL_ORDER.find((i) => prev.members.find((m) => m.id === i).status === "PENDING");
        if (!id) return prev;
        return commitMeeting({ // 커밋 ①
          ...prev,
          availability: { ...prev.availability, [id]: buildMemberResponse(id, prev.candidatePeriod) }, // v2.4(발견 88) — 그 회의의 실제 후보 기간 기준
          members: prev.members.map((m) => (m.id === id ? { ...m, status: "SUBMITTED" } : m)),
        });
      });
    }, 1000);
    return () => clearTimeout(arrivalTimer.current);
  }, [meeting]);

  // ---- 패널 호출 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") { e.preventDefault(); setPanelVisible((v) => !v); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  const onLogoTap = () => {
    const now = performance.now();
    logoTaps.current = [...logoTaps.current.filter((t) => now - t < 2000), now];
    if (logoTaps.current.length >= 5) { setPanelVisible((v) => !v); logoTaps.current = []; }
  };

  // ---- [DEV-EXIT] 배제 3경로 핸들러 (PRD 2.7) ----
  const nudge = (ids) => { // 독촉 — 발송 기록 커밋 ⑧
    setMeeting((prev) => commitMeeting({ ...prev, nudgedIds: [...new Set([...prev.nudgedIds, ...ids])] }));
    showToast("다시 알림을 보냈어요");
  };
  const sendReRequest = (targets) => { // 재요청 — 커밋 ⑧ (targets: {id,name}[])
    setMeeting((prev) => commitMeeting({ ...prev, reRequestedIds: [...new Set([...prev.reRequestedIds, ...targets.map((t) => t.id)])] }));
    showToast(`${targets.map((t) => t.name).join(", ")}님에게 다시 요청했어요`);
  };
  const demoteMember = (id, slotKey, note) => { // 강등 — 커밋 ⑦. v2.3: 의견 남기기(note) 인자 추가
    setMeeting((prev) => {
      const name = prev.members.find((m) => m.id === id).name;
      showToast(`${name}님에게 선택 참석자로 바뀌었다고 알렸어요`);
      return commitMeeting({
        ...prev,
        members: prev.members.map((m) => (m.id === id ? { ...m, attendance: "OPTIONAL" } : m)),
        demotedIds: [...new Set([...prev.demotedIds, id])],
        demotedReasons: slotKey ? { ...prev.demotedReasons, [id]: slotKey } : prev.demotedReasons, // v2.2 (발견 64)
        demoteNotes: note ? { ...prev.demoteNotes, [id]: note } : prev.demoteNotes, // v2.3
        promotionRequests: prev.promotionRequests.filter((r) => r.id !== id), // 요청 기반 승인이었다면 정리
      });
    });
    setConfirmOpen(null);
  };
  // v2.3 신규 — 회의 폐기 [PRD-CANCEL-MEETING]
  const cancelMeeting = (reason) => {
    setMeeting(commitMeeting({ ...meeting, status: "CANCELLED", cancelReason: reason || null })); // ⑩
    setConfirmOpen(null);
  };
  // v2.3 신규 — 역강등 요청 4종 [PRD-PROMOTE-REQUEST], v2.5부터 공용 순수 함수(upsertRequest 등) 사용
  const requestPromotion = (id, reason) => {
    setMeeting(commitMeeting({ ...meeting, promotionRequests: upsertRequest(meeting.promotionRequests, id, reason) })); // ⑪ v2.4: 사유 포함 (발견 71)
    showToast("참조자 전환을 요청했어요");
    setConfirmOpen(null);
  };
  const cancelPromotionRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, promotionRequests: removeRequest(meeting.promotionRequests, id) })); // ⑪
    showToast("요청을 취소했어요");
  };
  const approvePromotionRequest = (id) => {
    const target = meeting.members.find((m) => m.id === id);
    demoteMember(id, null, null);
    showToast(`${target.name}님의 요청을 승인했어요`);
  };
  const rejectPromotionRequest = (id) => {
    // v2.5 정정(발견 80): 삭제 대신 상태만 REJECTED로 바꿔 요청자 화면이 인지할 수 있게 한다
    setMeeting(commitMeeting({ ...meeting, promotionRequests: rejectRequest(meeting.promotionRequests, id) })); // ⑪
    showToast("요청을 거절했어요");
  };
  const acknowledgePromotionRejection = (id) => { // v2.5 신설 — 발견 80, ⑭
    setMeeting(commitMeeting({ ...meeting, promotionRequests: acknowledgeRejection(meeting.promotionRequests, id) }));
  };
  // v2.5 신규 — 필수 복귀 요청 5종 [PRD-REINSTATE-REQUEST] (역강등 요청의 대칭, 발견 81)
  const requestReinstate = (id, reason) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: upsertRequest(meeting.reinstateRequests, id, reason) })); // ⑬
    showToast("다시 필수 참석자가 되고 싶다고 요청했어요");
    setConfirmOpen(null);
  };
  const cancelReinstateRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: removeRequest(meeting.reinstateRequests, id) })); // ⑬
    showToast("요청을 취소했어요");
  };
  const approveReinstateRequest = (id) => {
    const target = meeting.members.find((m) => m.id === id);
    setMeeting((prev) => commitMeeting({
      ...prev,
      members: prev.members.map((m) => (m.id === id ? { ...m, attendance: "REQUIRED" } : m)),
      reinstateRequests: removeRequest(prev.reinstateRequests, id),
    })); // ⑬
    showToast(`${target.name}님을 다시 필수 참석자로 전환했어요`);
  };
  const rejectReinstateRequest = (id) => {
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: rejectRequest(meeting.reinstateRequests, id) })); // ⑬
    showToast("요청을 거절했어요");
  };
  const acknowledgeReinstateRejection = (id) => { // ⑭
    setMeeting(commitMeeting({ ...meeting, reinstateRequests: acknowledgeRejection(meeting.reinstateRequests, id) }));
  };
  // v2.3 신규 — 기간 확장 재탐색, v2.5 통지 보강(발견 79), v2.7 재대기 보강(발견 86)
  const extendPeriod = () => {
    // Date 객체 미사용 — FULL_DATES(고정 문자열 배열) 인덱스로 다음 날짜를 찾는다
    const idx = FULL_DATES.indexOf(meeting.candidatePeriod.end);
    const newEnd = FULL_DATES[Math.min(idx + 2, FULL_DATES.length - 1)];
    setMeeting(commitMeeting({
      ...meeting,
      candidatePeriod: { ...meeting.candidatePeriod, end: newEnd },
      periodExtendedFrom: meeting.candidatePeriod.end, // v2.5(발견 79) — A01이 신규 날짜 강조에 사용
      extensionUpdatedIds: [], // v2.7(발견 86) — 새 확장 세션 시작, 이전 확장의 재제출 기록 리셋
    })); // ⑫
    showToast("조율 기간을 넓혔어요 — 다시 계산할게요");
  };
  const cancelAttendance = (id) => { // 참석 취소 (PRD 5.5 경로 A — v1.6 재설계: 슬롯 단위 거절, 연산 제외 폐지) + [PRD-REMATCH] 6-2C 취소=대안선택 강제(발견 89)
    const m = meeting.members.find((x) => x.id === id);
    if (m.attendance === "REQUIRED") {
      const slot = meeting.confirmedSlot;
      preCancelSnapshot.current = meeting; // v2.4(발견 89) — 취소 직전 스냅샷, 뒤로가기로 그대로 복원
      const next = commitMeeting({
        ...meeting,
        status: "CONFLICT",
        droppedMemberId: id,
        dropReason: "SELF_CANCEL", // 슬롯 단위 거절 — 재조율에 계속 참여 [PRD-CANCEL-SCOPE]
        availability: { ...meeting.availability, [id]: { ...meeting.availability[id], [slot]: "UNAVAILABLE" } },
        declinedOptionalIds: [],
        reMatchUpdatedIds: [id], // v2.7 정정(발견 84) — 이탈 선언 자체가 본인의 갱신, [] 대신 [본인id]로 시작
      }); // ③ + 초기화
      setMeeting(next);
      showAlertBanner(`${m.name}님이 참석을 취소했습니다.`, "EX05");
      // v2.4 개정(발견 89) — 취소=대안선택 강제: 대기 화면을 거치지 않고 곧바로 원클릭/그리드로 진입한다.
      // canQuickReconfirm(등)은 이전 렌더의 stale 클로저이므로, 방금 만든 next를 기준으로 직접 재계산한다.
      const nextTop3 = calculateBestTime(next.availability, next.members, { excludeIds: [], slots: activeSlots(next.candidatePeriod) });
      const topSlot = nextTop3.length && nextTop3[0].level !== 3 ? nextTop3[0] : null;
      const eligible = topSlot && ["AVAILABLE", "AVOID"].includes((next.availability[id] || {})[topSlot.slotKey]);
      selectMember(id);
      setConflictEdit(eligible ? "QUICK" : "GRID");
    } else {
      setMeeting(commitMeeting({ ...meeting, declinedOptionalIds: [...new Set([...meeting.declinedOptionalIds, id])] })); // ⑨
      showToast("주최자에게 불참 알림을 전송했습니다");
    }
    setCancelStage(null);
  };
  // [PRD-REMATCH] 6-2C 신설(발견 89) — CONFLICT의 QUICK/GRID 공용 뒤로가기: 취소 강제 플로우(preCancelSnapshot 존재)면
  // 취소 자체를 취소(직전 스냅샷 그대로 복원)하고, 일반 재진입(웹훅·뒤늦은 제출 등)이면 본인 재선택으로.
  const handleConflictBack = () => {
    if (preCancelSnapshot.current) {
      setMeeting(commitMeeting(preCancelSnapshot.current));
      preCancelSnapshot.current = null;
      setConflictEdit(null);
      showToast("참석 취소를 취소했어요");
    } else {
      setConflictEdit("AUTH");
    }
  };
  const fireDropout = () => { // 경로 B — 웹훅 모킹, m3 고정
    if (meeting.status !== "COMPLETED") return;
    const slot = meeting.confirmedSlot;
    setMeeting(commitMeeting({
      ...meeting,
      status: "CONFLICT",
      droppedMemberId: "m3",
      dropReason: "WEBHOOK",
      declinedOptionalIds: [],
      reMatchUpdatedIds: [], // v2.3(발견 87) — 본인의 선언 행위가 아니므로 [본인id]로 시작하지 않는다. 그리드 재진입해야 갱신 인정
      availability: { ...meeting.availability, m3: { ...meeting.availability.m3, [slot]: "BLOCK_STRICT" } }, // v2.3(발견 87) — 경로 A의 UNAVAILABLE 마킹과 대칭. 없으면 같은 슬롯이 재추천되는 모순 발생
      blockReasons: { ...meeting.blockReasons, m3: "외부 일정 변동 감지" },
    })); // ③
    showAlertBanner("최개발님의 일정 이탈이 감지되었습니다.", "EX05");
    setCurrentPath("/host/re-match");
  };
  const forceCloseExec = () => { // 강제 마감 — 커밋 ⑥
    setMeeting(commitMeeting({ ...meeting, forceClosed: true }));
    setConfirmOpen(null);
    showToast("아직 답 없는 사람을 빼고 결과를 계산해요");
  };

  // ---- 초기화 ----
  const resetDemoData = (toPath) => {
    localStorage.removeItem(STORAGE_KEY);
    setMeeting(buildSeedData());
    setScenario({ virtualClock: "BEFORE_DEADLINE", ex04Conflict: false });
    setTempGrid({});
    setAlertBanner(null);
    setCurrentMemberId(null);
    setAttendeeStage("INVITE");
    setHeatSelected(null); setHeatOpen(false);
    setConfirmOpen(null); setCancelStage(null); setConflictEdit(null);
    setNewCardKeys([]);
    setEx04FailedSlots([]); // v2.2 (발견 61)
    setCurrentPath(toPath);
    showToast("데모 데이터가 초기화되었습니다");
  };

  // ---- [DEV-EX-04] 확정 + 동시성 검증 ----
  const handleConfirmMeeting = (slotKey) => {
    setConfirmOpen(null);
    setSyncChecking(true);
    setTimeout(() => {
      setSyncChecking(false);
      if (scenario.ex04Conflict) {
        // 변동 대상 일반화 (v1.5 — PRD 5.4-1): 해당 슬롯 가용 필수 응답자, m4 우선
        const eligible = meeting.members.filter((m) => m.attendance === "REQUIRED" && m.status === "SUBMITTED"
          && ["AVAILABLE", "AVOID"].includes((meeting.availability[m.id] || {})[slotKey]));
        const target = eligible.find((m) => m.id === "m4") || eligible[0] || meeting.members.find((m) => m.id === "m4");
        const prevKeys = currentTop3Ref.current.map((s) => s.slotKey);
        // v2.5 (발견 75): 이전엔 대상자가 이미 BLOCK_STRICT면 next=meeting(동일 참조)을 그대로 써서
        // setMeeting이 사실상 아무 일도 안 하는 경우가 있었다. 항상 새 객체를 만들어 상태 갱신·재계산을 보장한다.
        const next = {
          ...meeting,
          availability: { ...meeting.availability, [target.id]: { ...(meeting.availability[target.id] || {}), [slotKey]: "BLOCK_STRICT" } },
          blockReasons: { ...meeting.blockReasons, [target.id]: "확정 직전 등록된 외부 일정" },
        };
        commitMeeting(next); // ⑤
        setMeeting(next);
        // v2.2 (발견 61): 데이터 변동 성공 여부와 무관하게, 시도했던 슬롯 자체를 명시적으로 실패 목록에 추가한다.
        // 이전에는 대상자 가용성 변경이 실제로 그 슬롯을 pool에서 제외하는지에 전적으로 의존했는데,
        // 누적된 강등·재요청·이전 EX-04 시도 등으로 대상자 선정이 어긋나면 같은 슬롯이 계속 추천되는 결함이 있었다.
        setEx04FailedSlots((prev) => [...new Set([...prev, slotKey])]);
        const after = calculateBestTime(next.availability, next.members, {
          excludeIds: next.forceClosed ? next.members.filter((m) => m.attendance === "REQUIRED" && m.status === "PENDING").map((m) => m.id) : [],
          slots: activeSlots(next.candidatePeriod), // 버그 수정 — next.period는 PERIOD-SPLIT 이후 존재하지 않는 필드였음(발견 79 작업 중 grep으로 발견)
        }).filter((s) => s.slotKey !== slotKey); // 방금 실패한 슬롯은 즉시 결과에서도 제외
        setNewCardKeys(after.map((s) => s.slotKey).filter((k) => !prevKeys.includes(k)));
        showAlertBanner(`그사이 ${target.name}님의 일정에 변동이 생겨 ${fmtSlot(slotKey)} 추천이 제외되었습니다. 다른 시간으로 다시 확정할 수 있습니다.`, "EX04");
        return; // 확정 취소 — 리로드 금지
      }
      // v2.4 (발견 73 근본 정리): 재확정 성공 시 이전 CONFLICT의 잔재(droppedMemberId·dropReason)를 지운다.
      // 지우지 않으면 재요청으로 실제로는 가능해진 사람이 다른 함수의 폴백 분기에서 계속 옛 사유로 오염될 여지가 남는다.
      // v2.5(발견 81) — 확정 순간 대기 중인 요청은 자동 폐기(PRD 5.1). REJECTED 잔여분도 함께 정리.
      const next = { ...meeting, status: "COMPLETED", confirmedSlot: slotKey, droppedMemberId: null, dropReason: null, promotionRequests: [], reinstateRequests: [] };
      setMeeting(commitMeeting(next)); // ②/④
      clearBannerByCause("EX04");
      clearBannerByCause("EX05");
      const absent = deriveAbsentees(next).length + next.declinedOptionalIds.length;
      showToast(absent === 0 ? "전원 캘린더에 등록되었습니다" : `참석 가능 인원(${next.members.length - absent}명)의 캘린더에 등록되었습니다`);
    }, 800);
  };

  // ---- 발의 (커밋: launched) ----
  const launchMeeting = () => {
    setMeeting(commitMeeting({ ...meeting, launched: true }));
    showToast("초대 링크가 생성되었습니다");
    setCurrentPath("/host/dashboard");
  };

  // ---- 제출 (커밋 ①) — CONFLICT 중 업데이트 겸용 ----
  // v2.3 신규 — 제출 직전 판정: 본인의 응답이 유일한 병목이면 조용히 재고 기회를 준다 (PRD 5.3 [PRD-PROACTIVE])
  const checkProactiveNudge = (buffer) => {
    const projected = { ...meeting.availability, [currentMemberId]: buffer };
    const result = calculateBestTime(projected, meeting.members, { slots: activeSlots(meeting.candidatePeriod) });
    const top = result[0];
    const me = meeting.members.find((m) => m.id === currentMemberId);
    if (top && top.level === 2 && top.subNames.length === 1 && top.subNames[0] === me?.name) return top;
    return null;
  };
  const submitAvailability = (skipProactive) => {
    const buffer = tempGrid[currentMemberId] || {};
    // 최초 제출(신규)에만 적용 — lateJoin·CONFLICT 재편집은 이미 다른 사유로 진행 중이라 제외
    if (!skipProactive && !lateJoinId && meeting.status === "PROGRESS" && attendeeStage === "GRID") {
      const offer = checkProactiveNudge(buffer);
      if (offer) { setProactiveOffer(offer); return; }
    }
    const next = {
      ...meeting,
      availability: { ...meeting.availability, [currentMemberId]: { ...buffer } },
      members: meeting.members.map((m) => (m.id === currentMemberId ? { ...m, status: "SUBMITTED" } : m)),
      // v2.5(발견 83) — CONFLICT 중 재제출이면 반영 현황에 기록. 최초 제출(status SUBMITTED)과는 별개 판정
      reMatchUpdatedIds: trackRematchUpdate(meeting.reMatchUpdatedIds, meeting.status, currentMemberId),
      // v2.7(발견 86) — PROGRESS 중 기간 확장 이후 재제출이면 제출 현황 재대기 판정에 기록
      extensionUpdatedIds: trackExtensionUpdate(meeting.extensionUpdatedIds, meeting.status, meeting.periodExtendedFrom, currentMemberId),
    };
    if (lateJoinId) {
      // v2.2 (발견 60) — COMPLETED 중 미확인자의 뒤늦은 제출: 취소가 아니라 "이제 답했다"는 별개 사건
      const v = buffer[meeting.confirmedSlot];
      if (v === "AVAILABLE" || v === "AVOID") {
        // 확정된 시간에 실제로 가능 — 상태 전이 없이 기록만
        setMeeting(commitMeeting(next));
        setLateJoinId(null);
        showToast("이 시간에 참석 가능하신 걸로 기록했어요");
      } else {
        // 확정된 시간에 안 됨 — 이제서야 정당하게 재조율 필요. "취소"가 아니므로 사유를 구분해서 기록
        const withConflict = { ...next, status: "CONFLICT", droppedMemberId: lateJoinId, dropReason: "LATE_MISMATCH", declinedOptionalIds: [], reMatchUpdatedIds: [lateJoinId] }; // v2.7 정정(발견 84) — 이 제출 자체가 본인 갱신
        setMeeting(commitMeeting(withConflict));
        showAlertBanner(`${meeting.members.find((m) => m.id === lateJoinId).name}님이 응답을 제출했는데 확정된 시간에 참석이 어려워 재조율이 필요해요.`, "EX05");
        setLateJoinId(null);
      }
      return;
    }
    setMeeting(commitMeeting(next));
    if (meeting.status === "CONFLICT") {
      preCancelSnapshot.current = null; // v2.4(발견 89) — 새 시간을 실제로 제출했으니 되돌릴 대상 없음
      setConflictEdit(null);
      showToast("업데이트되었습니다 — 대체안에 즉시 반영됩니다");
    } else {
      setAttendeeStage("DONE");
      showToast("시간을 제출했어요");
    }
  };

  // ---- 그리드 편집 (4상태 순환) ----
  const selectMember = (id) => {
    setCurrentMemberId(id);
    setTempGrid((prev) => {
      if (!prev[id] && meeting.availability[id]) return { ...prev, [id]: { ...meeting.availability[id] } };
      if (!prev[id]) return { ...prev, [id]: {} };
      return prev;
    });
  };
  const cycleState = (v) =>
    v === "AVAILABLE" ? "AVOID" : v === "AVOID" ? "UNAVAILABLE" : v === "UNAVAILABLE" ? undefined : "AVAILABLE";
  const paintSlot = (sk, state) => {
    setTempGrid((prev) => {
      const g = { ...(prev[currentMemberId] || {}) };
      if (g[sk] === "BLOCK_STRICT") return prev;
      if (state === undefined) delete g[sk]; else g[sk] = state;
      return { ...prev, [currentMemberId]: g };
    });
  };
  const onSlotDown = (sk) => {
    const g = tempGrid[currentMemberId] || {};
    if (g[sk] === "BLOCK_STRICT") {
      showToast(`이 시간엔 안 돼요: ${meeting.blockReasons[currentMemberId] || "기존 일정"}`); // 실제 일정명 (발견 28)
      return;
    }
    const next = cycleState(g[sk]);
    dragRef.current = { active: true, apply: next === undefined ? "AVAILABLE" : next };
    paintSlot(sk, next);
  };
  const onSlotEnter = (sk) => { if (dragRef.current.active) paintSlot(sk, dragRef.current.apply); };
  useEffect(() => {
    const end = () => { dragRef.current.active = false; };
    window.addEventListener("mouseup", end);
    window.addEventListener("touchend", end);
    return () => { window.removeEventListener("mouseup", end); window.removeEventListener("touchend", end); };
  }, []);
  const onGridTouchMove = (e) => {
    if (!dragRef.current.active) return;
    const t = e.touches[0];
    const el = document.elementFromPoint(t.clientX, t.clientY);
    const sk = el && el.getAttribute && el.getAttribute("data-slot");
    if (sk) paintSlot(sk, dragRef.current.apply);
  };
  const fillRemaining = () => {
    setTempGrid((prev) => {
      const g = { ...(prev[currentMemberId] || {}) };
      activeSlots(meeting.candidatePeriod).forEach((sk) => { if (!g[sk]) g[sk] = "AVAILABLE"; }); // v2.0 — candidatePeriod 기준
      return { ...prev, [currentMemberId]: g };
    });
    showToast("아직 안 정한 시간을 모두 '가능'으로 채웠어요");
  };
  const fillDayUnavailable = (date) => { // v2.3 신규 — 일 단위 일괄 불가 (PRD 3.3)
    setTempGrid((prev) => {
      const g = { ...(prev[currentMemberId] || {}) };
      HOURS.forEach((h) => { const sk = slotKeyOf(date, h); if (!g[sk]) g[sk] = "UNAVAILABLE"; });
      return { ...prev, [currentMemberId]: g };
    });
    showToast("이 날은 종일 안 되는 걸로 표시했어요");
  };

  // ---- 파생 ----
  const dl = checkDeadlineStatus(meeting, scenario);
  const submittedCount = meeting.members.filter((m) => m.status === "SUBMITTED").length;
  const top3 = useMemo(() => {
    if (meeting.status !== "PROGRESS" || dl.shouldBlockResult) return [];
    const excludeIds = meeting.forceClosed ? dl.pendingIds : [];
    return calculateBestTime(meeting.availability, meeting.members, { excludeIds, slots: activeSlots(meeting.candidatePeriod) })
      .filter((s) => !ex04FailedSlots.includes(s.slotKey)); // v2.2 (발견 61) — 명시적 제외
  }, [meeting, dl.shouldBlockResult, ex04FailedSlots]); // eslint-disable-line
  const currentTop3Ref = useRef([]);
  currentTop3Ref.current = top3;
  const rematchTop3 = useMemo(() => {
    if (meeting.status !== "CONFLICT") return [];
    // v2.3 개정(발견 87): 경로 A·B·C 전부 excludeIds 미사용, 본인 포함 전원 기준으로 재연산한다.
    // 각 경로의 확정 슬롯 자동 마킹(UNAVAILABLE 또는 BLOCK_STRICT)만으로 그 슬롯이 자연히 후보에서 빠진다.
    return calculateBestTime(meeting.availability, meeting.members, { excludeIds: [], slots: activeSlots(meeting.candidatePeriod) });
  }, [meeting]);
  // [PRD-REMATCH] 6-2C 신설(발견 89) — 원클릭 재확인 대상 판정: CONFLICT 진입 후 1순위 추천 슬롯이 이미 전원(또는
  // 선택 참석자 제외 전원) 커버된 상태(level 0~2)라면, 그 슬롯에 대해 본인 기존 데이터가 이미
  // AVAILABLE·AVOID로 표시돼 있는 사람은 그리드를 다시 채울 필요 없이 원클릭으로만 "갱신"을 인정한다.
  // level 3(부분 성립)이면 애초에 전원 커버되는 슬롯 자체가 없으므로 항상 그리드로 보낸다.
  const quickReconfirmSlot = rematchTop3.length && rematchTop3[0].level !== 3 ? rematchTop3[0] : null;
  const canQuickReconfirm = (memberId) => {
    if (!quickReconfirmSlot) return false;
    const v = (meeting.availability[memberId] || {})[quickReconfirmSlot.slotKey];
    return v === "AVAILABLE" || v === "AVOID";
  };
  const heatmap = useMemo(() => buildHeatmap(meeting), [meeting]);
  const hostName = meeting.members.find((m) => m.role === "HOST").name;
  const step = deriveStep(meeting, currentPath);
  const isProductScreen = ["/host/create", "/attendee", "/host/dashboard", "/host/re-match"].includes(currentPath);
  const isHostScreen = ["/host/dashboard", "/host/re-match"].includes(currentPath); // v1.6 — PRD 1.5 배너 범위
  const nameOf = (id) => (meeting.members.find((m) => m.id === id) || {}).name;

  // 등록 안내 (PRD 3.4 보정 + [PRD-ABSENCE-REASON] 사유 3분기, 발견 48)
  const registrationCopy = () => {
    const reqAbs = deriveAbsentees(meeting);
    const decl = meeting.declinedOptionalIds.map((id) => meeting.members.find((m) => m.id === id)).filter(Boolean);
    const all = [...reqAbs, ...decl];
    if (all.length === 0) return { main: "전원 캘린더에 등록되었습니다", absentLines: [] };
    const byReason = { UNCONFIRMED: [], UNAVAILABLE_SLOT: [], SELF_DECLINED: [] };
    all.forEach((m) => {
      // v2.4 (발견 73): CONFLICT 진행 중 이탈자만 폴백 — deriveAbsentees와 판정 기준 일치
      const r = m.attendance === "REQUIRED" && meeting.status === "CONFLICT" && m.id === meeting.droppedMemberId && absenceReason(m, meeting) === null
        ? "UNAVAILABLE_SLOT" // 이탈자인데 다른 사유가 안 잡히면 슬롯 불가로 폴백
        : absenceReason(m, meeting) || "UNAVAILABLE_SLOT";
      byReason[r].push(m.name);
    });
    const absentLines = Object.entries(byReason)
      .filter(([, names]) => names.length > 0)
      .map(([reason, names]) => ABSENCE_LABEL[reason](names.join(", ")));
    return {
      main: `참석 가능 인원(${meeting.members.length - all.length}명)의 캘린더에 등록되었습니다`,
      absentLines,
    };
  };

  // =====================================================================
  // 공통 컴포넌트
  // =====================================================================
  const BrandBar = () => (
    <div className={`${T.card} ${T.border} px-6 py-3 border-b flex justify-between items-center select-none`}>
      <span className={`${T.foreground} font-bold text-sm cursor-default`} onClick={onLogoTap}>MeetSync</span>
      {isProductScreen && (
        <span className={`${currentPath === "/attendee" ? T.success : T.primary} ${T.primaryForeground} ${T.roundedElement} px-2 py-1 text-xs font-medium max-w-[160px] truncate`}>
          {currentPath === "/attendee"
            ? `참석자 화면${currentMemberId && (attendeeStage === "GRID" || attendeeStage === "DONE" || conflictEdit === "GRID") ? " · " + nameOf(currentMemberId) : ""}`
            : "주최자 화면"}
        </span>
      )}
    </div>
  );

  const StepIndicator = () => (
    <div className={`${T.card} ${T.border} border-b px-6 py-2 flex gap-2 flex-wrap text-xs`}>
      {["발의", "응답 수집", "조율·확정", "완료"].map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const conflict = meeting.status === "CONFLICT" && n === 3;
        return (
          <span key={label} className={`${active ? (conflict ? `${T.textWarning} font-semibold` : `${T.foreground} font-semibold`) : T.mutedForeground}`}>
            {n}. {label}{conflict && active ? " (재조율)" : ""}{n < 4 ? "  ›" : ""}
          </span>
        );
      })}
    </div>
  );

  const AlertBannerView = () =>
    alertBanner ? (
      <div className={`${T.destructiveLight} ${T.borderDestructive} ${T.textDestructive} ${T.pCard} ${T.roundedElement} border text-sm flex justify-between items-start gap-2 mx-6 mt-4`}>
        <span>{alertBanner.message}</span>
        <button className={`${T.textDestructive} ${T.pressed} font-bold`} onClick={() => setAlertBanner(null)}>✕</button>
      </div>
    ) : null;

  const ToastView = () =>
    toast ? <div className={`${T.primary} ${T.primaryForeground} ${T.roundedElement} ${T.pCard} text-sm fixed top-4 inset-x-4 z-40 text-center shadow-lg`}>{toast}</div> : null;

  // [DS-COMP-CF01] 확인 영역 — 공통 (자동 소멸 없음, [취소] 명시)
  const ConfirmArea = ({ history, sentence, extra, cancelLabel = "취소", execLabel, onExec, onCancel }) => (
    <div className={`border-t ${T.border} pt-3 mt-2 flex flex-col gap-2`}>
      {history}
      <span className={`${T.foreground} text-sm`}>{sentence}</span>
      {extra}
      <div className="flex gap-2">
        <button className={`${T.card} border ${T.border} ${T.foreground} flex-1 py-2 ${T.roundedElement} text-xs font-medium ${T.pressed}`}
          onClick={onCancel || (() => setConfirmOpen(null))}>{cancelLabel}</button>
        <button className={`${T.primary} ${T.primaryForeground} flex-1 py-2 ${T.roundedElement} text-xs font-bold ${T.pressed}`}
          onClick={onExec}>{execLabel}</button>
      </div>
    </div>
  );

  // [DS-FLOW-D01-RESULT] 추천 카드 (D01·R01 공용) — CF01 확정 + 교착 해소 위계 (PRD 5.1)
  // v2.2(발견 84): gate prop — R01에서만 전달. { blocked, message } — blocked면 레벨 무관하게 확정 버튼 대신 안내 노출
  const RecommendList = ({ items, gate }) => (
    <div className="flex flex-col gap-2">
      {items.map((slot, rank) => {
        const isNew = newCardKeys.includes(slot.slotKey);
        // 강제 마감 배제자 존재 시 사유 보강 (v1.9 — [PRD-ABSENCE-REASON], 발견 44·48)
        const forcedOutNote = meeting.forceClosed && slot.label === "제출한 사람은 모두 가능해요"
          ? ` ${dl.pendingList.join(", ")}님은 답이 없어 포함되지 않았습니다.` : "";
        const confirmSentence =
          slot.level === 2 ? `${slot.subNames.join(", ")}님이 피하고 싶은 시간입니다. 확정 전 양해를 구하는 것이 좋습니다.`
          : slot.level === 1 ? `선택 참석자(${slot.subNames.join(", ")})를 빼면 모두 가능한 시간입니다.`
          : `전원이 참석 가능한 시간입니다.${forcedOutNote}`;
        const cfConfirm = confirmOpen && confirmOpen.type === "CONFIRM" && confirmOpen.slotKey === slot.slotKey;
        const cfDemote = confirmOpen && confirmOpen.type === "DEMOTE" && confirmOpen.slotKey === slot.slotKey;
        // 교착 해소 분기 데이터
        const oneAbsentee = slot.absentees.length === 1 ? slot.absentees[0] : null;
        const hostBottleneck = oneAbsentee && oneAbsentee.id === "m1";
        const reReqSent = slot.reRequestTargets.length > 0 && slot.reRequestTargets.every((t) => meeting.reRequestedIds.includes(t.id));
        return (
          <div key={slot.slotKey} className={`${rank === 0 ? T.successLight : T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2 text-left`}> {/* v1.9 — PRD 1.7-A 정렬 일관성 명시 (발견 47) */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex flex-col gap-1">
                <span className={`${T.foreground} font-semibold text-sm`}>
                  {fmtSlot(slot.slotKey)}
                  {isNew && <span className={`${T.textWarning} text-xs font-bold ml-2`}>새 추천</span>}
                </span>
                <span className={`text-xs font-medium ${slot.tone === "ok" ? T.textSuccess : slot.tone === "warn" ? T.textWarning : T.textDestructive}`}>{slot.label}</span>
                {slot.subline && <span className={`${T.mutedForeground} text-xs`}>{slot.subline}</span>}
              </div>
              {/* 불변식(PRD 2.7): 부분 성립 카드에는 확정 버튼 자체가 없다. v2.2(발견 84): gate.blocked면 레벨 무관하게 버튼 대신 안내 */}
              {slot.level < 3 && (
                gate?.blocked ? (
                  <span className={`${T.mutedForeground} text-xs text-right shrink-0`}>모든 필수 참석자가<br />갱신하면 확정할 수 있어요</span>
                ) : (
                  <button className={`${T.primary} ${T.primaryForeground} px-4 py-2 ${T.roundedElement} text-xs font-bold ${T.pressed} shrink-0`}
                    onClick={() => setConfirmOpen({ type: "CONFIRM", slotKey: slot.slotKey })}>최종 확정</button>
                )
              )}
            </div>

            {cfConfirm && (
              ConfirmArea({ sentence: confirmSentence, execLabel: "이 시간으로 확정", onExec: () => handleConfirmMeeting(slot.slotKey) })
            )}

            {/* [DS-FLOW-D01-DEADLOCK] level 3 — 갈림길 (PRD 5.1, v2.3: 기간 확장 액션 추가) */}
            {slot.level === 3 && (
              <div className={`border-t ${T.border} pt-2 flex flex-col gap-2`}>
                {hostBottleneck ? (
                  <span className={`${T.mutedForeground} text-xs`}>주최자님이 직접 시간을 다시 골라야 해요 — 참석자 화면에서 김주최로 들어가 다시 알려주세요.</span>
                ) : slot.absentees.length >= 2 ? (
                  <>
                    {slot.reRequestTargets.length > 0 && (
                      <div className="flex justify-between items-center gap-2">
                        <span className={`${T.mutedForeground} text-xs`}>필수 참석자 2명 이상이 안 되는 시간이에요. 다시 요청하거나 다른 시간을 찾아보세요.</span>
                        <button className={`${reReqSent ? `${T.card} border ${T.border} ${T.mutedForeground}` : `${T.primary} ${T.primaryForeground}`} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed} shrink-0 ${reReqSent ? T.disabled : ""}`}
                          onClick={() => sendReRequest(slot.reRequestTargets)} disabled={reReqSent}>
                          {reReqSent ? "다시 요청했어요" : "다시 요청하기"}
                        </button>
                      </div>
                    )}
                    {slot.reRequestTargets.length === 0 && <span className={`${T.mutedForeground} text-xs`}>필수 참석자 2명 이상에게 다른 일정이 있는 시간이에요 — 다른 시간을 찾아보세요.</span>}
                  </>
                ) : (
                  <>
                    {slot.reRequestTargets.length > 0 && (
                      <div className="flex justify-between items-center gap-2">
                        <span className={`${T.mutedForeground} text-xs`}>
                          {slot.reRequestTargets.map((t) => t.name).join(", ")}님이 이 시간을 비워주면 {slot.blockNames.length ? "더 많이 참석할 수 있어요" : "모두 참석할 수 있어요"}
                        </span>
                        <button className={`${reReqSent ? `${T.card} border ${T.border} ${T.mutedForeground}` : `${T.primary} ${T.primaryForeground}`} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed} shrink-0 ${reReqSent ? T.disabled : ""}`}
                          onClick={() => sendReRequest(slot.reRequestTargets)} disabled={reReqSent}>
                          {reReqSent ? "다시 요청했어요" : "다시 요청하기"}
                        </button>
                      </div>
                    )}
                    {slot.blockNames.length > 0 && (
                      <span className={`${T.mutedForeground} text-xs`}>{slot.blockNames.join(", ")}님은 이 시간에 다른 일정이 있어요</span>
                    )}
                    {oneAbsentee && (
                      <button className={`${T.mutedForeground} text-xs underline text-left ${T.pressed}`}
                        onClick={() => setConfirmOpen({ type: "DEMOTE", slotKey: slot.slotKey, memberId: oneAbsentee.id })}>
                        {oneAbsentee.name}님을 선택 참석자로 바꾸고 진행하기
                      </button>
                    )}
                    {cfDemote && oneAbsentee && (
                      ConfirmArea({
                        history:
                          meeting.reRequestedIds.includes(oneAbsentee.id)
                            ? <span className={`${T.mutedForeground} text-xs`}>재요청 발송함 ✓</span>
                            : <div className="flex justify-between items-center gap-2">
                                <span className={`${T.textWarning} text-xs`}>아직 {oneAbsentee.name}님에게 다시 요청하지 않았어요</span>
                                {oneAbsentee.reason !== "BLOCK" && (
                                  <button className={`${T.card} border ${T.border} ${T.foreground} px-2 py-1 ${T.roundedElement} text-xs ${T.pressed} shrink-0`}
                                    onClick={() => sendReRequest([oneAbsentee])}>먼저 다시 요청하기</button>
                                )}
                              </div>,
                        sentence: `${oneAbsentee.name}님을 선택 참석자로 바꿀게요. 이 회의는 ${oneAbsentee.name}님 없이 진행되며, 회의 내용을 따로 전달해야 해요. 바꾸면 ${oneAbsentee.name}님에게 알림이 가요.`,
                        extra:
                          <input className={`${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`}
                            placeholder="회의 전 남기고 싶은 의견이 있으신가요? (선택)"
                            defaultValue={demoteNoteDraft}
                            onChange={(e) => setDemoteNoteDraft(e.target.value)} />,
                        execLabel: "선택 참석자로 바꾸기", onExec: () => demoteMember(oneAbsentee.id, slot.slotKey, demoteNoteDraft || null)
                      })
                    )}
                  </>
                )}
                {/* [기간 넓혀서 다시 찾기] (v2.3 신설 — PRD 5.1) — 주최자 본인 병목 제외 항상 노출 */}
                {!hostBottleneck && (
                  <button className={`${T.mutedForeground} text-xs underline text-left ${T.pressed}`} onClick={extendPeriod}>
                    기간 넓혀서 다시 찾기
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  // 히트맵 (D01 공용) — 램프 + 마커 분리
  const HeatView = ({ collapsedLabel }) => (
    <div className={`${T.card} ${T.border} ${T.roundedContainer} border`}>
      <button className={`${T.pCard} ${T.pressed} flex justify-between w-full items-center`} onClick={() => setHeatOpen((v) => !v)}>
        <span className={`${T.foreground} font-semibold text-sm`}>{collapsedLabel}</span>
        <span className={`${T.mutedForeground} text-xs`}>{heatOpen ? "접기 ▲" : "펼치기 ▼"}</span>
      </button>
      {heatOpen && (
        <div className={T.pCard}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${activeDates(meeting.candidatePeriod).length}, 1fr)` }}>
            <div />
            {activeDates(meeting.candidatePeriod).map((d) => (
              <div key={d} className={`${T.mutedForeground} text-xs text-center pb-1`}>{d.slice(5, 7)}/{d.slice(8, 10)} ({DAY_LABEL[d]})</div>
            ))}
            {HOURS.map((h) => (
              <React.Fragment key={h}>
                <div className={`${T.mutedForeground} text-xs pr-2 flex items-center`}>{String(h).padStart(2, "0")}:00</div>
                {activeDates(meeting.candidatePeriod).map((d) => {
                  const sk = slotKeyOf(d, h);
                  const confirmed = meeting.confirmedSlot === sk && meeting.status === "COMPLETED";
                  const ring = confirmed ? RING_CONFIRMED : heatSelected === sk ? RING_SELECTED : "";
                  const bg = confirmed ? CONFIRMED_BG : heatToken(heatmap[sk].count); // v1.8 — 확정은 램프와 다른 계열 (발견 41)
                  return (
                    <button key={sk} className={`${bg} ${T.roundedElement} h-9 ${T.pressed} ${ring}`}
                      onClick={() => setHeatSelected(sk)} />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          {heatSelected && (
            <div className={`border-t ${T.border} mt-3 pt-3 flex flex-col gap-1`}>
              <span className={`${T.foreground} text-sm font-medium`}>
                {fmtSlot(heatSelected)} <span className={`${T.mutedForeground} text-xs`}>가능 {heatmap[heatSelected].count}명</span>
                {meeting.status === "COMPLETED" && meeting.confirmedSlot === heatSelected && <span className={`${T.textSuccess} text-xs font-bold ml-2`}>확정된 시간</span>}
              </span>
              {heatmap[heatSelected].detail.map((d) => (
                <span key={d.name} className={`text-xs ${d.state === "AVAILABLE" ? T.textSuccess : d.state === "AVOID" ? T.textWarning : d.state === "UNAVAILABLE" ? T.textDestructive : T.mutedForeground}`}>
                  {d.name}{d.isOptional ? " (선택)" : ""} — {HEAT_STATE_LABEL[d.state]}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 슬롯 그리드 (A01 편집·CONFLICT 업데이트 공용)
  const GridEditor = ({ onBack, submitLabel }) => {
    const buffer = tempGrid[currentMemberId] || {};
    const availCount = Object.values(buffer).filter((v) => v === "AVAILABLE").length;
    const me = meeting.members.find((m) => m.id === currentMemberId) || {};
    const slotToken = (v) =>
      v === "AVAILABLE" ? T.success : v === "AVOID" ? T.warning : v === "UNAVAILABLE" ? T.unavail
      : v === "BLOCK_STRICT" ? T.block : `${T.unset} border ${T.border}`;
    return (
      <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full`}>
        <button className={`${T.mutedForeground} text-sm text-left ${T.pressed}`} onClick={onBack}>← 참석자 다시 선택</button>
        {/* 당사자 배너 (PRD 2.5-⑤) */}
        {meeting.status === "PROGRESS" && meeting.forceClosed && me.status === "PENDING" && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs`}>
            응답 마감으로 지금은 추천에서 빠져 있어요. 지금 제출하면 바로 반영돼요.
          </div>
        )}
        {meeting.status === "PROGRESS" && meeting.demotedIds.includes(currentMemberId) && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs`}>
            주최자님이 회원님을 선택 참석자로 바꿨어요{meeting.demotedReasons?.[currentMemberId] ? ` (${fmtSlot(meeting.demotedReasons[currentMemberId])}에 참석이 어려우셔서)` : ""}. 시간을 다시 알려주면 추천에 반영돼요.
            {meeting.demoteNotes?.[currentMemberId] && (
              <span className={`block mt-1 ${T.foreground}`}>주최자님의 메모: {meeting.demoteNotes[currentMemberId]}</span>
            )}
          </div>
        )}
        {/* 독촉 당사자 배너 (v1.9 — PRD 2.7·5.3, 발견 51): 발신자만 알던 독촉을 수신자도 인지하게 함 */}
        {meeting.status === "PROGRESS" && me.status === "PENDING" && meeting.nudgedIds.includes(currentMemberId) && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs`}>
            주최자님이 빨리 답해달라고 알려왔어요.
          </div>
        )}
        {/* 역강등 요청 대기 배너 (v2.3 신규 — PRD 5.1 [PRD-PROMOTE-REQUEST]) */}
        {meeting.status === "PROGRESS" && isPending(meeting.promotionRequests, currentMemberId) && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2`}>
            <span>참조자 전환을 요청했어요. 주최자님의 확인을 기다리는 중이에요.</span>
            <button className={`${T.textWarning} underline shrink-0 ${T.pressed}`} onClick={() => cancelPromotionRequest(currentMemberId)}>요청 취소</button>
          </div>
        )}
        {/* 역강등 요청 거절 배너 (v2.5 신규 — 발견 80) */}
        {meeting.status === "PROGRESS" && isRejected(meeting.promotionRequests, currentMemberId) && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2`}>
            <span>요청이 거절됐어요.</span>
            <button className={`${T.textWarning} underline shrink-0 ${T.pressed}`} onClick={() => acknowledgePromotionRejection(currentMemberId)}>확인</button>
          </div>
        )}
        {/* 필수 복귀 요청 대기 배너 (v2.5 신규 — PRD 5.1 [PRD-REINSTATE-REQUEST], 발견 81) */}
        {meeting.status === "PROGRESS" && isPending(meeting.reinstateRequests, currentMemberId) && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2`}>
            <span>다시 필수 참석자가 되고 싶다고 요청했어요. 주최자님의 확인을 기다리는 중이에요.</span>
            <button className={`${T.textWarning} underline shrink-0 ${T.pressed}`} onClick={() => cancelReinstateRequest(currentMemberId)}>요청 취소</button>
          </div>
        )}
        {/* 필수 복귀 요청 거절 배너 (v2.5 신규 — 발견 80과 동일 원칙, 발견 81) */}
        {meeting.status === "PROGRESS" && isRejected(meeting.reinstateRequests, currentMemberId) && (
          <div className={`${T.warningLight} ${T.border} ${T.textWarning} ${T.pCard} ${T.roundedElement} border text-xs flex justify-between items-center gap-2`}>
            <span>요청이 거절됐어요.</span>
            <button className={`${T.textWarning} underline shrink-0 ${T.pressed}`} onClick={() => acknowledgeReinstateRejection(currentMemberId)}>확인</button>
          </div>
        )}
        {/* 위계 분리 (v2.2 실제 반영 — 발견 56): 마감일만 헤더, 조작법은 범례 옆 낮은 위계로 하향 */}
        <div className="flex justify-between items-end gap-2">
          <div className="flex flex-col gap-1">
            <h1 className={`${T.foreground} text-2xl font-bold`}>내 시간 선택하기</h1>
            <p className={`${T.mutedForeground} text-sm`}>마감: {fmtDeadline(meeting.coordinationPeriod)}</p>
          </div>
          <button className={`${T.card} ${T.border} ${T.foreground} ${T.roundedElement} border px-3 py-1.5 text-xs font-medium ${T.pressed} shrink-0`}
            onClick={fillRemaining}>나머지 다 가능으로</button>
        </div>
        <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border select-none touch-none`} onTouchMove={onGridTouchMove}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `auto repeat(${activeDates(meeting.candidatePeriod).length}, 1fr)` }}>
            <div />
            {activeDates(meeting.candidatePeriod).map((d) => (
              // [DS-FLOW-A01-DAYBULK] 날짜 헤더 탭 → 일 단위 일괄 불가 (v2.3, PRD 3.3)
              // v2.5(발견 79): periodExtendedFrom보다 뒤 날짜는 "새로 추가됨" 강조 — 기간 확장 시 전원 통지의 시각적 실체
              <button key={d} className={`${T.mutedForeground} text-xs text-center pb-1 ${T.pressed}`} onClick={() => fillDayUnavailable(d)}>
                {d.slice(5, 7)}/{d.slice(8, 10)} ({DAY_LABEL[d]})
                {isNewlyAddedDate(d, meeting.periodExtendedFrom) && (
                  <span className={`block ${T.textWarning} text-[10px] font-bold`}>새로 추가됨</span>
                )}
              </button>
            ))}
            {HOURS.map((h) => (
              <React.Fragment key={h}>
                <div className={`${T.mutedForeground} text-xs pr-2 flex items-center`}>{String(h).padStart(2, "0")}:00</div>
                {activeDates(meeting.candidatePeriod).map((d) => {
                  const sk = slotKeyOf(d, h);
                  const v = buffer[sk];
                  return (
                    <div key={sk} data-slot={sk}
                      className={`${slotToken(v)} ${T.roundedElement} h-11 ${v === "BLOCK_STRICT" ? "cursor-not-allowed" : `cursor-pointer ${T.pressed}`}`}
                      onMouseDown={(e) => { e.preventDefault(); onSlotDown(sk); }}
                      onMouseEnter={() => onSlotEnter(sk)}
                      onTouchStart={() => onSlotDown(sk)} />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="flex gap-3 justify-center flex-wrap">
          {[[`${T.unset} border ${T.border}`, "아직 안 정함"], [T.success, "가능"], [T.warning, "피하고 싶음"], [T.unavail, "안 되는 시간"], [T.block, "다른 일정 있음"]].map(([tok, label]) => (
            <span key={label} className={`${T.mutedForeground} text-xs flex items-center gap-1`}>
              <span className={`${tok} ${T.roundedElement} inline-block w-3 h-3`} />{label}
            </span>
          ))}
        </div>
        <p className={`${T.mutedForeground} text-[11px] text-center`}>탭하면 가능 → 피하고 싶음 → 안 되는 시간 → 해제 순으로 바뀌어요 · 드래그로 한 번에 지정</p>
        {/* 잠금 출처 캡션 (발견 28 — PRD 3.2) */}
        <p className={`${T.mutedForeground} text-xs text-center`}>회색으로 잠긴 시간은 연결된 캘린더에 이미 있는 일정이에요 (이동 시간 포함, 자동으로 반영돼요)</p>

        {/* [DS-FLOW-A01-PROMOTE-REQ] 역강등 요청 (v2.3 신규) — 필수 참석자 본인만, PROGRESS 한정 */}
        {meeting.status === "PROGRESS" && me.attendance === "REQUIRED" && me.role !== "HOST"
          && !isPending(meeting.promotionRequests, currentMemberId) && (
          <button className={`${T.mutedForeground} text-[11px] underline text-center ${T.pressed}`}
            onClick={() => setConfirmOpen({ type: "PROMOTE", memberId: currentMemberId })}>
            저는 꼭 필요한 사람이 아닌 것 같아요
          </button>
        )}
        {confirmOpen && confirmOpen.type === "PROMOTE" && confirmOpen.memberId === currentMemberId && (
          ConfirmArea({
            sentence: "주최자님께 참조자 전환을 요청합니다. 승인되면 이 회의는 회원님 없이도 성립할 수 있어요.",
            extra: (
              <input className={`${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`}
                placeholder="요청 사유 (선택) — 주최자님이 승인 여부를 판단하는 데 도움이 돼요"
                defaultValue={promoteReasonDraft}
                onChange={(e) => setPromoteReasonDraft(e.target.value)} />
            ),
            execLabel: "요청 보내기", onExec: () => requestPromotion(currentMemberId, promoteReasonDraft || null)
          })
        )}

        {/* [DS-FLOW-A01-REINSTATE-REQ] 필수 복귀 요청 (v2.5 신규 — PRD 5.1 [PRD-REINSTATE-REQUEST], 발견 81) — 역강등 요청의 대칭. 선택 참석자 본인만 */}
        {meeting.status === "PROGRESS" && me.attendance === "OPTIONAL"
          && !isPending(meeting.reinstateRequests, currentMemberId) && (
          <button className={`${T.mutedForeground} text-[11px] underline text-center ${T.pressed}`}
            onClick={() => setConfirmOpen({ type: "REINSTATE", memberId: currentMemberId })}>
            다시 필수 참석자가 되고 싶어요
          </button>
        )}
        {confirmOpen && confirmOpen.type === "REINSTATE" && confirmOpen.memberId === currentMemberId && (
          ConfirmArea({
            sentence: "주최자님께 필수 복귀를 요청합니다. 승인되면 다시 필수 참석자로 전환돼요.",
            extra: (
              <input className={`${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`}
                placeholder="요청 사유 (선택) — 주최자님이 승인 여부를 판단하는 데 도움이 돼요"
                defaultValue={reinstateReasonDraft}
                onChange={(e) => setReinstateReasonDraft(e.target.value)} />
            ),
            execLabel: "요청 보내기", onExec: () => requestReinstate(currentMemberId, reinstateReasonDraft || null)
          })
        )}

        {/* [DS-FLOW-A01-PROACTIVE] 프로액티브 재요청 팝업 (v2.3 신규 — PRD 5.3) */}
        {proactiveOffer ? (
          ConfirmArea({
            sentence: `이 응답대로면 ${fmtSlot(proactiveOffer.slotKey)}만 빼면 전원 합의가 가능해요. 혹시 그 시간도 열어주실 수 있나요?`,
            cancelLabel: "아니요, 그대로 제출", execLabel: "네, 다시 볼게요",
            onCancel: () => { setProactiveOffer(null); submitAvailability(true); },
            onExec: () => { setProactiveOffer(null); setHeatSelected(proactiveOffer.slotKey); }
          })
        ) : (
          <button className={`${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold mt-auto ${T.pressed} ${availCount === 0 ? T.disabled : ""}`}
            onClick={() => submitAvailability(false)} disabled={availCount === 0}>
            {submitLabel}
          </button>
        )}
        {availCount === 0 && <p className={`${T.mutedForeground} text-xs text-center`}>되는 시간을 1개 이상 골라야 제출할 수 있어요</p>}
      </div>
    );
  };

  // 본인 선택 리스트 (A01 AUTH·취소·CONFLICT 공용)
  const MemberPicker = ({ title, sub, onPick, onBack }) => (
    <div className={`${T.background} ${T.pScreen} flex flex-col gap-3 min-h-screen max-w-xl mx-auto w-full`}>
      {onBack && <button className={`${T.mutedForeground} text-sm text-left ${T.pressed}`} onClick={onBack}>← 돌아가기</button>}
      <h1 className={`${T.foreground} text-2xl font-bold`}>{title}</h1>
      <p className={`${T.mutedForeground} text-sm`}>{sub}</p>
      {meeting.members.map((member) => (
        <button key={member.id}
          className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border ${T.pressed} flex justify-between items-center text-left`}
          onClick={() => onPick(member.id)}>
          <span className={`${T.foreground} font-medium text-sm`}>{member.name}{member.attendance === "OPTIONAL" ? <span className={`${T.mutedForeground} text-xs`}> (선택)</span> : null}</span>
          {member.status === "SUBMITTED" && <span className={`${T.textSuccess} text-xs`}>제출 완료 · 수정 가능</span>}
          {member.status !== "SUBMITTED" && meeting.status === "COMPLETED" && <span className={`${T.textWarning} text-xs`}>아직 답 안 함 · 지금 제출</span>}
        </button>
      ))}
    </div>
  );

  // =====================================================================
  // [DS-FLOW-L01] 랜딩
  // =====================================================================
  const LandingScreen = () => (
    <div className={`${T.background} ${T.pScreen} flex flex-col gap-8 min-h-screen justify-center max-w-xl mx-auto w-full`}>
      <div className="flex flex-col gap-3 text-center">
        <h1 className={`${T.foreground} text-3xl font-bold tracking-tight`}>회의 시간 잡기,<br />이제 눈치 없이.</h1>
        <p className={`${T.mutedForeground} text-sm`}>
          재촉하기 미안하고, 비선호 시간을 말하기 애매하고, 확정 후 번복이 두려운 —
          일정 조율의 관계 비용을 시스템이 대신 집니다.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {["1. 링크 하나로 전원의 가능·비선호·불가 시간을 수집",
          "2. 전원 조건 교차 + 3단계 완화로 최적 시간을 근거와 함께 추천",
          "3. 확정 직전 재검증, 확정 후 이탈까지 재조율로 방어"].map((s) => (
          <div key={s} className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border text-sm ${T.foreground}`}>{s}</div>
        ))}
      </div>
      <button className={`${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold ${T.pressed}`} onClick={() => navigate("/host/create")}>
        회의 만들기
      </button>
      <button className={`${T.mutedForeground} text-xs text-center underline ${T.pressed}`} onClick={() => navigate("/guide")}>
        데모 가이드 · 심사자용
      </button>
    </div>
  );

  // =====================================================================
  // [DS-FLOW-GD01] 데모 가이드 — 스캔 구조
  // =====================================================================
  const GuideScreen = () => {
    const Kbd = ({ children }) => (
      <span className={`border ${T.border} ${T.roundedElement} px-1.5 py-0.5 ${T.primaryForeground} text-[11px] mx-0.5`}>{children}</span>
    );
    const StepCard = ({ n, children }) => (
      <div className={`border ${T.border} ${T.roundedElement} px-3 py-2 flex gap-3 items-start`}>
        <span className={`${T.primaryForeground} font-bold shrink-0`}>{n}</span>
        <span className={`${T.devpanelForeground} text-xs leading-relaxed`}>{children}</span>
      </div>
    );
    const ExBlock = ({ title, cond, act, expect }) => (
      <div className={`border ${T.border} ${T.roundedElement} px-3 py-2 flex flex-col gap-1`}>
        <span className={`${T.primaryForeground} text-xs font-bold`}>{title}</span>
        <span className={`${T.devpanelForeground} text-xs`}><span className={T.primaryForeground}>발동 조건</span> — {cond}</span>
        <span className={`${T.devpanelForeground} text-xs`}><span className={T.primaryForeground}>조작</span> — {act}</span>
        <span className={`${T.devpanelForeground} text-xs`}><span className={T.primaryForeground}>기대 변화</span> — {expect}</span>
      </div>
    );
    const H = ({ children }) => <h2 className={`${T.primaryForeground} text-sm font-bold mt-2`}>{children}</h2>;
    return (
      <div className={`${T.devpanel} ${T.pScreen} flex flex-col gap-3 min-h-screen font-mono max-w-2xl mx-auto w-full`}>
        <button className={`${T.devpanelForeground} text-xs text-left ${T.pressed}`} onClick={() => navigate("/")}>← 랜딩으로 돌아가기</button>
        <h1 className={`${T.primaryForeground} text-xl font-bold`}>DEMO GUIDE</h1>
        <H>1. 권장 시연 순서</H>
        <StepCard n="1">랜딩에서 [회의 만들기] → 발의 화면에서 [회의 개설 및 초대 링크 생성하기]</StepCard>
        <StepCard n="2">대시보드 도착 — 팀원 응답이 1초 간격으로 유입 (5/6까지, 다른 화면에 있어도 백그라운드 진행)</StepCard>
        <StepCard n="3">초대 링크 카드의 [링크 열어보기] → 참석자: 박개발 선택, 그리드 편집(가능→피하고 싶음→불가 순환) 후 제출</StepCard>
        <StepCard n="4">[주최자 대시보드에서 결과 보기] → 추천 Top 3 → [최종 확정] → 확인 영역에서 [이 시간으로 확정]</StepCard>
        <StepCard n="5">확정 완료 — 참석자 화면(패널 A01)으로 확정 안내 확인, [갑자기 참석이 어려워졌나요?]로 취소 플로우 체험</StepCard>
        <StepCard n="6">완료 화면의 [새 회의 만들기]로 처음부터 순환</StepCard>
        <H>2. 시나리오 패널 열기</H>
        <div className={`${T.devpanelForeground} text-xs leading-relaxed`}>
          데스크톱: <Kbd>Ctrl</Kbd>+<Kbd>Shift</Kbd>+<Kbd>D</Kbd> / 모바일: <Kbd>MeetSync</Kbd> 로고 2초 내 5회 탭. 각 제어 아래 현재 효과 힌트 상시 표시.
        </div>
        <H>3. 예외 시나리오</H>
        <ExBlock title="EX-01 · 완화 추천 + 교착 해소 루프" cond="교집합 0개인 제출 데이터" act="박개발로 특정 시간만 '가능' 또는 '불가' 위주 제출" expect="완화 뱃지 → 부분 성립 카드의 [가용성 재요청](발송 후 ✓ 상태) 또는 [참조자로 변경하고 진행](강등). 재요청 대상으로 재진입해 슬롯을 열면 추천이 상위 단계로 즉시 복귀" />
        <ExBlock title="EX-02 · 이동 버퍼" cond="상시" act="참석자에서 이디자 선택" expect="7/17 오전 3슬롯 잠금 — 탭 시 실제 일정명 토스트, 하단에 출처 캡션" />
        <ExBlock title="EX-03 · 마감 유예" cond="박개발 미제출" act="패널 가상 시계 → '마감 도달'" expect="경고 배너(명단+독촉/강제 마감). 강제 마감은 확인 영역에서 독촉 이력 확인 후 실행" />
        <ExBlock title="EX-04 · 확정 충돌" cond="패널 EX-04 ON" act="[최종 확정] → 확인" expect="확정 취소 + 실데이터 변동(제외 슬롯 명시 배너) + '새 추천' 표시" />
        <ExBlock title="EX-05 · 확정 후 이탈 (2경로)" cond="확정 완료 상태" act="A: 참석자 확정 안내의 [갑자기 참석이 어려워졌나요?] (실구현) / B: 패널 [이탈 발생시키기] (외부 캘린더 감지 모킹)" expect="필수 참석자 취소 시 재조율 국면 — 이탈자는 전용 안내, 다른 참석자는 가용 시간 업데이트 가능" />
        <H>4. 두 창으로 나란히 보기</H>
        <div className={`${T.devpanelForeground} text-xs leading-relaxed`}>
          같은 주소 두 창 — 제출·확정·유입이 실시간 동기화(storage 이벤트 실구현). 패널 토글은 창별 독립. 알림 "수신"은 재현하지 않음 — 당사자는 링크 재진입 시 화면으로 인지 (데모 경계).
        </div>
        <H>5. 데이터 초기화</H>
        <div className={`${T.devpanelForeground} text-xs leading-relaxed`}>패널 [데이터 초기화] 또는 완료 화면 [새 회의 만들기].</div>
      </div>
    );
  };

  // =====================================================================
  // [DS-FLOW-H01] 발의 — 발의 후 권한 잠금 (PRD 2.2)
  // =====================================================================
  const HostCreateScreen = () => (
    <div className={`${T.background} ${T.pScreen} flex flex-col gap-6 min-h-screen max-w-xl mx-auto w-full`}>
      <div className="flex flex-col gap-2">
        <h1 className={`${T.foreground} text-2xl font-bold tracking-tight`}>새 회의 일정 잡기</h1>
        <p className={`${T.mutedForeground} text-sm`}>도메인 멤버들의 외부 캘린더 일정을 자동으로 조율합니다.</p>
      </div>
      <div className="flex flex-col gap-4">
        {/* 제목 잠금 (v2.3 — PRD 2.2 일관성 수정): 발의 후 표시형 전환 — 권한 토글과 동일 규칙 */}
        {meeting.launched ? (
          <div className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border w-full text-sm ${T.foreground}`}>{meeting.title}</div>
        ) : (
          <input className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border w-full text-sm ${T.foreground}`}
            value={meeting.title}
            onChange={(e) => setMeeting((m) => ({ ...m, title: e.target.value }))}
            placeholder="회의 제목을 입력하세요" />
        )}
        {/* [발견 67·68] 실제 선택 가능한 옵션 + 커스텀 화살표 (네이티브 select가 우측 끝에 붙는 문제 수정) */}
        <div className="relative w-full">
          <select
            className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border w-full text-sm ${T.foreground} appearance-none pr-9`}
            value={meeting.durationLabel || "1h"}
            disabled={meeting.launched}
            onChange={(e) => setMeeting((m) => ({ ...m, durationLabel: e.target.value }))}>
            <option value="30m">30분 단위</option>
            <option value="1h">1시간 단위</option>
            <option value="1h30m">1시간 30분 단위</option>
            <option value="2h">2시간 단위</option>
          </select>
          <span className={`${T.mutedForeground} pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs`}>▼</span>
        </div>
        {/* [발견 77 재설계] 조율 기간·회의 후보 날짜 — 두 값 모두 주최자가 자유롭게 지정, 서로 겹칠 수 없음 [PRD-PERIOD-SPLIT] */}
        {/* 순서: 조율 기간(이 제품으로 회의 후보 날짜를 정해가는 실시간 구간, 종료 시각이 곧 응답 마감)을 먼저 */}
        {/* 가운데 정렬 (v2.7, 발견 85) — 1.7-A 좌측 정렬 기본 규칙의 명시적 예외(CF01과 동일 근거) */}
        <div className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border flex flex-col items-center text-center gap-1`}>
          <span className={`${T.mutedForeground} text-xs`}>조율 기간 (종료 시각이 응답 마감이에요)</span>
          {meeting.launched ? (
            <span className={`${T.foreground} text-sm font-medium`}>{fmtPeriod(meeting.coordinationPeriod)} {meeting.coordinationPeriod.endTime}</span>
          ) : (
            <div className="flex items-center justify-center gap-1 flex-wrap">
              <input type="date" className={`${T.foreground} text-sm font-medium bg-transparent border-0 p-0`}
                value={meeting.coordinationPeriod.start}
                onChange={(e) => setMeeting((m) => ({ ...m, coordinationPeriod: { ...m.coordinationPeriod, start: e.target.value } }))} />
              <span className={`${T.mutedForeground} text-xs`}>~</span>
              <input type="date" className={`${T.foreground} text-sm font-medium bg-transparent border-0 p-0`}
                min={meeting.coordinationPeriod.start}
                value={meeting.coordinationPeriod.end}
                onChange={(e) => {
                  const newEnd = e.target.value;
                  setMeeting((m) => {
                    // 조율 기간 종료일이 바뀌어 이미 고른 회의 후보 날짜가 무효해지면(겹치거나 역전) 후보 날짜를 초기화 — 시스템이 임의로 밀지 않음
                    const invalidated = m.candidatePeriod.start <= newEnd;
                    return {
                      ...m,
                      coordinationPeriod: { ...m.coordinationPeriod, end: newEnd },
                      candidatePeriod: invalidated ? { start: "", end: "" } : m.candidatePeriod,
                    };
                  });
                }} />
              <input type="time" className={`${T.foreground} text-sm font-medium bg-transparent border-0 p-0`}
                value={meeting.coordinationPeriod.endTime}
                onChange={(e) => setMeeting((m) => ({ ...m, coordinationPeriod: { ...m.coordinationPeriod, endTime: e.target.value } }))} />
            </div>
          )}
        </div>
        <div className={`${T.card} ${T.border} ${T.roundedElement} ${T.pCard} border flex flex-col items-center text-center gap-1`}>
          <span className={`${T.mutedForeground} text-xs`}>회의 후보 날짜</span>
          {meeting.launched ? (
            <span className={`${T.foreground} text-sm font-medium`}>{fmtPeriod(meeting.candidatePeriod)}</span>
          ) : meeting.candidatePeriod.start === "" ? (
            <>
              <span className={`${T.textWarning} text-xs`}>조율 기간이 바뀌어 회의 후보 날짜를 다시 선택해주세요.</span>
              <div className="flex items-center justify-center gap-1">
                <input type="date" className={`${T.foreground} text-sm font-medium bg-transparent border-0 p-0`}
                  min={FULL_DATES.find((d) => d > meeting.coordinationPeriod.end) || meeting.coordinationPeriod.end}
                  onChange={(e) => setMeeting((m) => ({ ...m, candidatePeriod: { start: e.target.value, end: e.target.value } }))} />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <input type="date" className={`${T.foreground} text-sm font-medium bg-transparent border-0 p-0`}
                min={FULL_DATES.find((d) => d > meeting.coordinationPeriod.end) || meeting.coordinationPeriod.end}
                value={meeting.candidatePeriod.start}
                onChange={(e) => setMeeting((m) => ({ ...m, candidatePeriod: { ...m.candidatePeriod, start: e.target.value } }))} />
              <span className={`${T.mutedForeground} text-xs`}>~</span>
              <input type="date" className={`${T.foreground} text-sm font-medium bg-transparent border-0 p-0`}
                min={meeting.candidatePeriod.start}
                max={FULL_DATES[Math.min(FULL_DATES.indexOf(meeting.candidatePeriod.start) + 6, FULL_DATES.length - 1)]} // v2.4(발견 88) — 최대 7일(시작일+6일) 제약, [PRD-PERIOD-SPLIT] 3.0-A
                value={meeting.candidatePeriod.end}
                onChange={(e) => setMeeting((m) => ({ ...m, candidatePeriod: { ...m.candidatePeriod, end: e.target.value } }))} />
            </div>
          )}
        </div>
      </div>
      <div className={`flex flex-col gap-3 border-t ${T.border} pt-4`}>
        <span className={`${T.foreground} font-semibold text-sm`}>참석자 역할 정하기 (총 {meeting.members.length}명)</span>
        {meeting.launched && <span className={`${T.mutedForeground} text-xs`}>회의를 연 뒤에는 역할을 바로 바꿀 수 없어요 — 추천 카드에서 선택 참석자로 바꿀 수 있어요.</span>}
        {meeting.members.map((member) => (
          <div key={member.id} className={`flex justify-between items-center ${T.pCard} ${T.card} ${T.border} ${T.roundedElement} border`}>
            <div className="flex flex-col">
              <span className={`${T.foreground} font-medium text-sm`}>{member.name}</span>
              <span className={`${T.mutedForeground} text-xs`}>{member.email}</span>
            </div>
            {member.role === "HOST" ? (
              <span className={`${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold`}>필수 참석자 · 주최자</span>
            ) : meeting.launched ? (
              /* [DS-FLOW-H01-LOCK] 발의 후 표시형 뱃지 — 통지 없는 배제 뒷문 차단 */
              <span className={`${T.background} ${T.mutedForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-medium`}>
                {member.attendance === "REQUIRED" ? "필수 참석자" : "선택 참석자"} · 잠김
              </span>
            ) : (
              <div className="flex gap-1">
                {[["REQUIRED", "필수 참석자"], ["OPTIONAL", "선택 참석자"]].map(([val, label]) => (
                  <button key={val}
                    className={`${member.attendance === val ? `${T.success} ${T.primaryForeground} font-bold` : `${T.background} ${T.mutedForeground}`} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`}
                    onClick={() => setMeeting((m) => ({ ...m, members: m.members.map((x) => (x.id === member.id ? { ...x, attendance: val } : x)) }))}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* v2.0 — candidatePeriod가 비어있으면(조율 기간 변경으로 무효화된 채 재선택 전) 발의 차단 */}
      <button className={`${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold mt-auto ${T.pressed} ${(meeting.launched || !meeting.candidatePeriod.start) ? T.disabled : ""}`}
        onClick={launchMeeting} disabled={meeting.launched || !meeting.candidatePeriod.start}>
        {meeting.launched ? "이미 발의된 회의입니다" : "회의 개설 및 초대 링크 생성하기"}
      </button>
      {!meeting.launched && !meeting.candidatePeriod.start && (
        <p className={`${T.textWarning} text-xs text-center`}>회의 후보 날짜를 먼저 선택해주세요.</p>
      )}
      {meeting.launched && (
        <button className={`${T.card} border ${T.border} ${T.foreground} w-full py-3 ${T.roundedElement} text-sm font-medium ${T.pressed}`}
          onClick={() => navigate("/host/dashboard")}>대시보드로 이동</button>
      )}
    </div>
  );

  // =====================================================================
  // [DS-FLOW-A01] 참석자 — 당사자별 안내 + 취소 플로우 (PRD 2.5-⑤, 5.5)
  // =====================================================================
  const AttendeeScreen = () => {
    // ── CANCELLED (v2.3 최우선 가드) ──
    if (meeting.status === "CANCELLED") {
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full`}>
          <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
            <span className={`${T.mutedForeground} text-sm`}>이 회의는 취소되었습니다</span>
            {meeting.cancelReason && <span className={`${T.mutedForeground} text-xs`}>{meeting.cancelReason}</span>}
          </div>
        </div>
      );
    }
    // ── COMPLETED ──
    if (meeting.status === "COMPLETED") {
      // 뒤늦은 제출 그리드 (v2.2, 발견 60) — 취소 플로우와 완전히 분리된 경로
      if (lateJoinId) {
        return GridEditor({ onBack: () => { setLateJoinId(null); setCancelStage(null); }, submitLabel: "시간 제출하기" });
      }
      // 진입: 본인 선택 — 상태에 따라 취소 플로우 / 뒤늦은 제출 플로우로 분기 (발견 60)
      if (cancelStage && cancelStage.step === "AUTH") {
        return MemberPicker({ title: "내 상황 확인하기", sub: "본인을 선택해주세요.", onBack: () => setCancelStage(null),
          onPick: (id) => {
            const mem = meeting.members.find((x) => x.id === id);
            if (mem.status !== "SUBMITTED") { setCancelStage(null); selectMember(id); setLateJoinId(id); }
            else setCancelStage({ step: "CONFIRM", id });
          } });
      }
      if (cancelStage && cancelStage.step === "CONFIRM") {
        const m = meeting.members.find((x) => x.id === cancelStage.id);
        const isReq = m.attendance === "REQUIRED";
        const already = meeting.declinedOptionalIds.includes(m.id);
        return (
          <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] max-w-xl mx-auto w-full`}>
            <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-3`}>
              <span className={`${T.foreground} font-bold`}>{m.name}님의 참석 취소</span>
              {already ? (
                <>
                  <span className={`${T.mutedForeground} text-sm`}>이미 불참을 알렸습니다.</span>
                  <button className={`${T.card} border ${T.border} ${T.foreground} w-full py-2 ${T.roundedElement} text-xs font-medium ${T.pressed}`}
                    onClick={() => setCancelStage(null)}>돌아가기</button>
                </>
              ) : (
                ConfirmArea({
                  sentence: isReq
                    ? "회원님은 필수 참석자예요. 참석을 취소하면 이 시간의 확정이 취소되고, 주최자에게 알려지며 다른 시간을 다시 찾기 시작해요."
                    : "회원님은 선택 참석자라 회의 진행에는 영향이 없어요. 주최자에게 불참 소식만 전달돼요.",
                  cancelLabel: "돌아가기", execLabel: isReq ? "참석 취소하기" : "불참 알리기",
                  onCancel: () => setCancelStage(null), onExec: () => cancelAttendance(m.id)
                })
              )}
            </div>
          </div>
        );
      }
      // 확정 안내
      const copy = registrationCopy();
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full`}>
          <div className={`${T.successLight} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
            <span className={`${T.mutedForeground} text-xs`}>회의가 확정되었습니다</span>
            <span className={`${T.foreground} text-xl font-bold`}>{fmtSlot(meeting.confirmedSlot)}</span>
            <span className={`${T.textSuccess} text-sm`}>{copy.main}</span>
            {copy.absentLines.map((line) => <span key={line} className={`${T.textWarning} text-xs`}>{line}</span>)}
          </div>
          <button className={`${T.mutedForeground} text-xs underline ${T.pressed}`} onClick={() => setCancelStage({ step: "AUTH" })}>
            내 참석 상황을 확인하거나 바꾸고 싶어요
          </button>
        </div>
      );
    }

    // ── CONFLICT ── [PRD-REMATCH] 6-2C(발견 89·90) — AUTH → QUICK(원클릭) 또는 GRID(전체 재편집) 자동 분기
    if (meeting.status === "CONFLICT") {
      // v2.4 개정(발견 89): 경로 B(웹훅) 무동선 분기 삭제 — 경로 A·C와 동일하게 진입한다.
      if (conflictEdit === "AUTH") {
        return MemberPicker({ title: "내 시간 다시 알려주기", sub: "본인을 선택해주세요.", onBack: () => setConflictEdit(null),
          onPick: (id) => { preCancelSnapshot.current = null; selectMember(id); setConflictEdit(canQuickReconfirm(id) ? "QUICK" : "GRID"); } });
      }
      if (conflictEdit === "QUICK") {
        const me = meeting.members.find((m) => m.id === currentMemberId);
        const alreadyUpdated = meeting.reMatchUpdatedIds.includes(currentMemberId); // v2.5(발견 90) — 이미 반영했으면 버튼 비활성화
        return (
          <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full`}>
            <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
              <span className={`${T.mutedForeground} text-xs`}>대체 시간 후보</span>
              <span className={`${T.foreground} text-lg font-bold`}>{fmtSlot(quickReconfirmSlot.slotKey)}</span>
              <span className={`${T.mutedForeground} text-sm`}>{me?.name}님은 이미 이 시간에 응답한 적이 있어요. 여전히 가능하신가요?</span>
            </div>
            <button className={`${alreadyUpdated ? `${T.card} border ${T.border} ${T.mutedForeground}` : `${T.primary} ${T.primaryForeground}`} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed} ${alreadyUpdated ? T.disabled : ""}`}
              disabled={alreadyUpdated}
              onClick={() => {
                if (alreadyUpdated) return;
                setMeeting((prev) => commitMeeting({ ...prev, reMatchUpdatedIds: trackRematchUpdate(prev.reMatchUpdatedIds, prev.status, currentMemberId) })); // ⑰
                preCancelSnapshot.current = null; // v2.4(발견 89) — 확정 반영됐으니 되돌릴 대상 없음
                showToast("반영했어요");
              }}>{alreadyUpdated ? "✓ 반영 완료" : "네, 여전히 가능해요"}</button>
            {alreadyUpdated ? (
              <button className={`${T.mutedForeground} text-xs underline ${T.pressed}`} onClick={() => setConflictEdit(null)}>돌아가기</button>
            ) : (
              <>
                <button className={`${T.mutedForeground} text-xs underline ${T.pressed}`} onClick={() => setConflictEdit("GRID")}>다른 시간을 직접 고를게요</button>
                <button className={`${T.mutedForeground} text-xs underline ${T.pressed}`} onClick={handleConflictBack}>뒤로가기</button>
              </>
            )}
          </div>
        );
      }
      if (conflictEdit === "GRID") {
        return GridEditor({ onBack: handleConflictBack, submitLabel: "내 시간 다시 알려주기" });
      }
      const droppedName = nameOf(meeting.droppedMemberId);
      // v2.2 (발견 63) — 사유 3분기: SELF_CANCEL(취소 선언) / LATE_MISMATCH(뒤늦은 제출인데 안 맞음) / WEBHOOK(감지)
      const causeText = {
        SELF_CANCEL: "이 시간에 참석이 어려워져",
        LATE_MISMATCH: "뒤늦게 응답했는데 이 시간이 맞지 않아",
        WEBHOOK: "일정이 겹쳐",
      }[meeting.dropReason] || "일정이 겹쳐";
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full`}>
          <div className={`${T.warningLight} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
            <span className={`${T.textWarning} text-lg font-bold`}>다른 시간을 다시 찾고 있어요</span>
            <span className={`${T.mutedForeground} text-sm`}>{droppedName}님이 {causeText} 주최자가 대체 시간을 찾고 있습니다. 확정되면 이 링크에서 확인할 수 있습니다.</span>
          </div>
          <button className={`${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`}
            onClick={() => setConflictEdit("AUTH")}>내 시간 다시 알려주기</button>
        </div>
      );
    }

    // ── PROGRESS ──
    if (attendeeStage === "INVITE") {
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-6 justify-center min-h-[70vh] max-w-xl mx-auto w-full`}>
          <div className="flex flex-col gap-2 text-center">
            <span className={`${T.mutedForeground} text-sm`}>{hostName}님이 회의 일정 조율에 초대했습니다</span>
            <span className={`${T.foreground} text-2xl font-bold`}>{meeting.title}</span>
            <div className="flex gap-3 justify-center">
              <span className={`${T.card} ${T.border} ${T.mutedForeground} ${T.roundedElement} border px-2 py-1 text-xs`}>소요 1시간</span>
              <span className={`${T.card} ${T.border} ${T.mutedForeground} ${T.roundedElement} border px-2 py-1 text-xs`}>응답 마감 {fmtDeadline(meeting.coordinationPeriod)}</span>
            </div>
          </div>
          <button className={`${T.primary} ${T.primaryForeground} w-full py-4 ${T.roundedElement} font-bold ${T.pressed}`} onClick={() => setAttendeeStage("AUTH")}>
            가입 없이 바로 응답하기
          </button>
        </div>
      );
    }
    if (attendeeStage === "AUTH") {
      return MemberPicker({ title: "참석자 확인", sub: "본인의 이름을 선택해주세요.",
        onPick: (id) => { selectMember(id); setAttendeeStage("GRID"); } });
    }
    if (attendeeStage === "DONE") {
      const me = meeting.members.find((m) => m.id === currentMemberId) || {};
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-6 justify-center min-h-[70vh] text-center max-w-xl mx-auto w-full`}>
          <div className="flex flex-col gap-2">
            <span className={`${T.textSuccess} text-2xl font-bold`}>제출 완료</span>
            <span className={`${T.mutedForeground} text-sm`}>{me.name}님의 시간이 제출됐어요.</span>
            <span className={`${T.foreground} text-sm font-medium`}>지금까지 {submittedCount}/{meeting.members.length}명 제출했어요</span>
          </div>
          <div className="flex flex-col gap-2">
            <button className={`${T.card} ${T.border} ${T.foreground} w-full py-3 ${T.roundedElement} border text-sm font-medium ${T.pressed}`}
              onClick={() => setAttendeeStage("GRID")}>내 시간 다시 고치기</button>
            <button className={`${T.card} ${T.border} ${T.foreground} w-full py-3 ${T.roundedElement} border text-sm font-medium ${T.pressed}`}
              onClick={() => { setCurrentMemberId(null); setAttendeeStage("AUTH"); }}>다른 사람으로 응답하기</button>
            <button className={`${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`}
              onClick={() => navigate("/host/dashboard")}>주최자 화면에서 결과 보기</button>
          </div>
        </div>
      );
    }
    return GridEditor({ onBack: () => setAttendeeStage("AUTH"), submitLabel: "시간 제출하기" });
  };

  // =====================================================================
  // [DS-FLOW-D01] 대시보드 — 상태별 위계 [DS-HIERARCHY]
  // =====================================================================
  const HostDashboardScreen = () => {
    if (meeting.status === "CANCELLED") { // v2.3 — 최우선 가드
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 justify-center min-h-[60vh] text-center max-w-xl mx-auto w-full`}>
          <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
            <span className={`${T.mutedForeground} text-sm`}>이 회의는 취소되었습니다</span>
            {meeting.cancelReason && <span className={`${T.mutedForeground} text-xs`}>{meeting.cancelReason}</span>}
          </div>
          <button className={`${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`}
            onClick={() => resetDemoData("/")}>새 회의 만들기</button>
        </div>
      );
    }
    if (meeting.status === "COMPLETED") {
      const copy = registrationCopy();
      const cfReset = confirmOpen && confirmOpen.type === "RESET";
      // v2.5 정정 (발견 82): 강등 의견은 주최자가 강등 당사자에게 남긴 메모이지 주최자 자신에게 남긴 게 아니다.
      // 여기서 다시 노출하는 건 주최자 본인이 쓴 글을 본인에게 재노출하는 무의미한 구조였다.
      // 노출은 강등 당사자의 PROGRESS 재진입 배너(A01, 아래 1030행 근처)에서만 한다 — 그쪽은 정상 동작 중이라 손대지 않음.
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full`}>
          <div className={`${T.successLight} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-3 text-center`}>
            <span className={`${T.mutedForeground} text-xs`}>회의 확정 완료</span>
            <span className={`${T.foreground} text-3xl font-bold`}>{fmtSlot(meeting.confirmedSlot)}</span>
            <span className={`${T.textSuccess} text-sm`}>{copy.main}</span>
            {copy.absentLines.map((line) => <span key={line} className={`${T.textWarning} text-xs`}>{line}</span>)}
            <button className={`${T.primary} ${T.primaryForeground} w-full py-3 ${T.roundedElement} text-sm font-bold ${T.pressed}`}
              onClick={() => setConfirmOpen(cfReset ? null : { type: "RESET" })}>새 회의 만들기</button>
            {cfReset && (
              ConfirmArea({ sentence: "저장된 데모 데이터가 삭제되고 처음 상태로 돌아갑니다.",
                execLabel: "삭제하고 새로 시작", onExec: () => resetDemoData("/") })
            )}
          </div>
          {HeatView({ collapsedLabel: "다른 시간대 비교해보기" })}
          <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border`}>
            <span className={`${T.mutedForeground} text-sm`}>{submittedCount}명 제출 완료</span>
          </div>
          {syncChecking && <div className={`${T.devpanel} ${T.primaryForeground} fixed inset-0 flex items-center justify-center font-bold z-50`}>모두의 캘린더 확인하는 중...</div>}
        </div>
      );
    }

    const cfForce = confirmOpen && confirmOpen.type === "FORCE_CLOSE";
    const allNudged = dl.pendingIds.every((id) => meeting.nudgedIds.includes(id));
    const pendingPromotion = findPending(meeting.promotionRequests); // [DEV-EXIT] deriveNextAction 우선순위 1
    const pendingReinstate = findPending(meeting.reinstateRequests); // v2.5 신규 — 발견 81
    const cfCancelMeeting = confirmOpen && confirmOpen.type === "CANCEL_MEETING";
    // v2.5 (발견 74): 상단 통합 배너와 하단 Top3 카드가 같은 재요청 액션을 중복 노출했다.
    // 카드 쪽이 슬롯별 맥락(누구·왜)을 이미 정확히 보여주므로, 상단 요약 배너는 제거하고 카드 액션만 남긴다.
    return (
      <div className={`${T.background} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full`}>
        {/* [DS-FLOW-D01-NEXT] 주최자 통합 행동 배너 (v2.3 신설 — PRD 3.9 [PRD-NEXT-ACTION], v2.5 대상 확장) */}
        {pendingPromotion && (
          <div className={`${T.successLight} ${T.border} ${T.foreground} ${T.pCard} ${T.roundedElement} border text-sm flex justify-between items-center gap-2`}>
            <span>
              {nameOf(pendingPromotion.id)}님이 참조자 전환을 요청했어요
              {pendingPromotion.reason && <span className={`block ${T.mutedForeground} font-normal mt-0.5`}>사유: {pendingPromotion.reason}</span>}
            </span>
            <div className="flex gap-2 shrink-0">
              <button className={`${T.card} border ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`}
                onClick={() => rejectPromotionRequest(pendingPromotion.id)}>거절</button>
              <button className={`${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed}`}
                onClick={() => approvePromotionRequest(pendingPromotion.id)}>승인</button>
            </div>
          </div>
        )}
        {/* 필수 복귀 요청 배너 (v2.5 신규 — PRD 5.1 [PRD-REINSTATE-REQUEST], 발견 81) — 역강등 요청과 동시 대기 시 별도 배너로 각각 노출 */}
        {pendingReinstate && (
          <div className={`${T.successLight} ${T.border} ${T.foreground} ${T.pCard} ${T.roundedElement} border text-sm flex justify-between items-center gap-2`}>
            <span>
              {nameOf(pendingReinstate.id)}님이 다시 필수 참석자가 되고 싶다고 요청했어요
              {pendingReinstate.reason && <span className={`block ${T.mutedForeground} font-normal mt-0.5`}>사유: {pendingReinstate.reason}</span>}
            </span>
            <div className="flex gap-2 shrink-0">
              <button className={`${T.card} border ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`}
                onClick={() => rejectReinstateRequest(pendingReinstate.id)}>거절</button>
              <button className={`${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed}`}
                onClick={() => approveReinstateRequest(pendingReinstate.id)}>승인</button>
            </div>
          </div>
        )}
        <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
          <span className={`${T.mutedForeground} text-xs`}>초대 링크</span>
          <span className={`${T.foreground} text-sm font-mono break-all`}>meetsync.app/m/{meeting.meetingId}</span>
          <div className="flex gap-2">
            <button className={`${T.card} ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} border text-xs ${T.pressed}`}
              onClick={() => showToast("링크가 복사되었습니다")}>링크 복사</button>
            <button className={`${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs font-bold ${T.pressed}`}
              onClick={() => navigate("/attendee")}>링크 열어보기</button>
          </div>
        </div>
        {/* [DS-FLOW-D01-CANCEL] 회의 취소 (v2.3 신설 — PRD 5.6) */}
        <button className={`${T.mutedForeground} text-xs underline text-left ${T.pressed}`}
          onClick={() => setConfirmOpen(cfCancelMeeting ? null : { type: "CANCEL_MEETING" })}>이 회의 취소하기</button>
        {cfCancelMeeting && (
          ConfirmArea({
            sentence: "이 회의를 취소합니다. 모든 참석자가 더 이상 이 링크로 일정을 조율하거나 확인할 수 없게 됩니다.",
            execLabel: "회의 취소하기", onExec: () => cancelMeeting(cancelReasonDraft),
            extra: <input className={`${T.card} border ${T.border} ${T.roundedElement} p-2 text-xs w-full`}
              placeholder="취소 사유 (참석자에게 표시됩니다, 선택)" defaultValue={cancelReasonDraft} onChange={(e) => setCancelReasonDraft(e.target.value)} />
          })
        )}

        {dl.alertBannerActive && (
          <div className={`${T.destructiveLight} ${T.borderDestructive} ${T.textDestructive} ${T.pCard} ${T.roundedElement} border text-sm flex flex-col gap-2`}>
            <span>아직 답 안 한 필수 참석자: {dl.pendingList.join(", ")}. 마감을 미루고 있어요.</span>
            <div className="flex gap-2">
              <button className={`${T.primary} ${T.primaryForeground} px-3 py-1.5 ${T.roundedElement} text-xs ${T.pressed}`}
                onClick={() => nudge(dl.pendingIds)}>다시 알림 보내기</button>
              <button className={`${T.card} ${T.border} ${T.foreground} px-3 py-1.5 ${T.roundedElement} border text-xs ${T.pressed}`}
                onClick={() => setConfirmOpen(cfForce ? null : { type: "FORCE_CLOSE" })}>빼고 마감하기</button>
            </div>
            {/* [PRD 5.3] 강제 마감 확인 영역 — 독촉 이력 표기 (2.7-②) */}
            {cfForce && (
              ConfirmArea({
                history: allNudged
                  ? <span className={`${T.mutedForeground} text-xs`}>이미 알림 보냈어요 ✓ · 아직 답 없음</span>
                  : <div className="flex justify-between items-center gap-2">
                      <span className={`${T.textWarning} text-xs`}>{dl.pendingList.join(", ")}님에게 아직 알림을 안 보냈어요</span>
                      <button className={`${T.card} border ${T.border} ${T.foreground} px-2 py-1 ${T.roundedElement} text-xs ${T.pressed} shrink-0`}
                        onClick={() => nudge(dl.pendingIds)}>먼저 알림 보내기</button>
                    </div>,
                sentence: `${dl.pendingList.join(", ")}님을 빼고 결과를 계산해요. 나중에 제출하면 자동으로 다시 포함돼요.`,
                execLabel: "빼고 마감하기", onExec: forceCloseExec
              })
            )}
          </div>
        )}

        <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
          {/* v2.7(발견 86): 기간 확장 이력이 있으면 "최초 제출" 대신 "확장 후 재제출" 기준으로 전환 — 그렇지 않으면
              전원 옛날에 이미 제출했다는 이유만으로 새 날짜에 대해서도 "제출 완료"로 잘못 보인다 */}
          {meeting.periodExtendedFrom != null ? (
            <>
              <span className={`${T.foreground} font-semibold text-sm`}>제출 현황 {meeting.extensionUpdatedIds.length}/{meeting.members.length}명 (기간 확장 — 새 날짜 응답 필요)</span>
              <div className="flex gap-3 flex-wrap">
                {meeting.members.map((m) => {
                  const reflected = meeting.extensionUpdatedIds.includes(m.id);
                  return (
                    <span key={m.id} className={`text-xs ${reflected ? T.textSuccess : T.mutedForeground}`}>
                      {m.name} {reflected ? "✓" : "대기"}{m.attendance === "OPTIONAL" ? " (선택)" : ""}
                    </span>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <span className={`${T.foreground} font-semibold text-sm`}>제출 현황 {submittedCount}/{meeting.members.length}명</span>
              <div className="flex gap-3 flex-wrap">
                {meeting.members.map((m) => (
                  <span key={m.id} className={`text-xs ${m.status === "SUBMITTED" ? T.textSuccess : T.mutedForeground}`}>
                    {m.name} {m.status === "SUBMITTED" ? "✓" : meeting.forceClosed && m.attendance === "REQUIRED" ? "제외" : "…"}{m.attendance === "OPTIONAL" ? " (선택)" : ""}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {HeatView({ collapsedLabel: "다 같이 되는 시간 보기" })}

        {!dl.shouldBlockResult && top3.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className={`${T.foreground} text-xl font-bold`}>추천 시간 Top 3</h2>
            {RecommendList({ items: top3 })}
          </div>
        )}
        {dl.shouldBlockResult && !dl.alertBannerActive && (
          <p className={`${T.mutedForeground} text-sm text-center`}>모든 필수 참석자가 응답하면 추천 시간이 산출됩니다.</p>
        )}

        {syncChecking && <div className={`${T.devpanel} ${T.primaryForeground} fixed inset-0 flex items-center justify-center font-bold z-50`}>모두의 캘린더 확인하는 중...</div>}
      </div>
    );
  };

  // =====================================================================
  // [DS-FLOW-R01] 재조율
  // =====================================================================
  const ReMatchScreen = () => {
    if (meeting.status !== "CONFLICT") {
      return (
        <div className={`${T.background} ${T.pScreen} flex flex-col gap-3 items-center justify-center min-h-[60vh]`}>
          <p className={`${T.mutedForeground} text-sm`}>현재 재조율이 필요한 회의가 없습니다.</p>
          <button className={`${T.primary} ${T.primaryForeground} ${T.roundedElement} px-4 py-2 text-xs font-bold ${T.pressed}`}
            onClick={() => navigate("/host/dashboard")}>대시보드로 돌아가기</button>
        </div>
      );
    }
    const dropped = meeting.members.find((m) => m.id === meeting.droppedMemberId) || {};
    const rematchGate = deriveRematchGate(meeting); // v2.7 신규 — 발견 84
    return (
      <div className={`${T.warningLight} ${T.pScreen} flex flex-col gap-4 min-h-screen max-w-xl mx-auto w-full`}>
        <div className="flex flex-col gap-2">
          <h1 className={`${T.textWarning} text-xl font-bold`}>일정 재조율이 필요합니다</h1>
          <p className={`${T.textWarning} text-sm`}>{dropped.name}님이 {({ SELF_CANCEL: "이 시간에 참석이 어려워져", LATE_MISMATCH: "뒤늦게 응답했는데 이 시간이 맞지 않아", WEBHOOK: "일정이 겹쳐" }[meeting.dropReason] || "일정이 겹쳐")} 대체 시간을 다시 찾고 있습니다. 참석자들이 시간을 다시 알려주면 즉시 반영됩니다.</p>
        </div>
        {/* [DS-FLOW-R01-STATUS] 재조율 반영 현황 (v2.5 신설 — PRD 6-2A [PRD-REMATCH], 발견 83) — D01 제출 현황 카드와 대칭 */}
        <div className={`${T.card} ${T.border} ${T.roundedContainer} ${T.pCard} border flex flex-col gap-2`}>
          <span className={`${T.foreground} font-semibold text-sm`}>재조율 반영 현황 {meeting.reMatchUpdatedIds.length}/{meeting.members.length}명</span>
          <div className="flex gap-3 flex-wrap">
            {meeting.members.map((m) => {
              const updated = meeting.reMatchUpdatedIds.includes(m.id);
              return (
                <span key={m.id} className={`text-xs ${updated ? T.textSuccess : T.mutedForeground}`}>
                  {m.name} {updated ? "✓ 갱신함" : "… 대기"}{m.attendance === "OPTIONAL" ? " (선택)" : ""}
                </span>
              );
            })}
          </div>
          {/* v2.7 신규(발견 84) — 필수 인원 미갱신 시 게이팅 안내를 현황 카드에도 명시 */}
          {rematchGate.blocked && (
            <span className={`${T.textWarning} text-xs`}>모든 필수 참석자가 갱신하면 최종 확정할 수 있어요.</span>
          )}
        </div>
        {RecommendList({ items: rematchTop3, gate: rematchGate })}
        {syncChecking && <div className={`${T.devpanel} ${T.primaryForeground} fixed inset-0 flex items-center justify-center font-bold z-50`}>모두의 캘린더 확인하는 중...</div>}
      </div>
    );
  };

  // =====================================================================
  // [DS-FLOW-P01] 시나리오 패널 — 힌트 상시 (PRD 1.7)
  // =====================================================================
  const ScenarioPanel = () => {
    const SegBtn = ({ on, children, onClick }) => (
      <button className={`px-2 py-1 ${T.roundedElement} ${T.pressed} ${on ? `${T.success} ${T.primaryForeground} font-bold` : `${T.devpanelForeground} border ${T.border}`}`} onClick={onClick}>{children}</button>
    );
    const Hint = ({ children }) => <span className={`${T.devpanelForeground} text-[10px] opacity-80`}>{children}</span>;
    const dropoutReady = meeting.status === "COMPLETED";
    return (
      <div className={`${T.devpanel} ${T.devpanelForeground} fixed bottom-0 inset-x-0 ${T.pCard} font-mono text-xs z-50 flex flex-col gap-2 max-h-[40vh] overflow-y-auto`}>
        <div className="flex justify-between items-center">
          <span className={`${T.primaryForeground} font-bold`}>DEMO CONTROL</span>
          <button className={`${T.devpanelForeground} ${T.pressed} font-bold px-2`} onClick={() => setPanelVisible(false)}>✕</button>
        </div>
        <div className="flex gap-6 flex-wrap items-start">
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1">가상 시계
              <SegBtn on={scenario.virtualClock === "BEFORE_DEADLINE"} onClick={() => setScenario((s) => ({ ...s, virtualClock: "BEFORE_DEADLINE" }))}>마감 전</SegBtn>
              <SegBtn on={scenario.virtualClock === "DEADLINE_REACHED"} onClick={() => setScenario((s) => ({ ...s, virtualClock: "DEADLINE_REACHED" }))}>마감 도달</SegBtn>
            </span>
            <Hint>{scenario.virtualClock === "DEADLINE_REACHED" ? "아직 답 안 한 필수 참석자가 있으면 대시보드에 경고 배너가 떠요" : "마감 판정이 일어나지 않아요"}</Hint>
          </div>
          <div className="flex flex-col gap-1">
            <span className="flex items-center gap-1">EX-04 확정 충돌
              <SegBtn on={!scenario.ex04Conflict} onClick={() => setScenario((s) => ({ ...s, ex04Conflict: false }))}>OFF</SegBtn>
              <SegBtn on={scenario.ex04Conflict} onClick={() => setScenario((s) => ({ ...s, ex04Conflict: true }))}>ON</SegBtn>
            </span>
            <Hint>{scenario.ex04Conflict ? "다음 확정 시도는 실패해요" : "확정이 정상적으로 성공해요"}</Hint>
          </div>
          <div className="flex flex-col gap-1">
            <button className={`border ${T.border} ${T.roundedElement} px-3 py-1.5 ${T.pressed} ${dropoutReady ? T.primaryForeground : T.disabled}`}
              onClick={fireDropout} disabled={!dropoutReady}>
              EX-05 이탈 발생시키기
            </button>
            <Hint>{dropoutReady ? "외부 캘린더 삭제 감지 시뮬레이션 — 즉시 재조율로 바뀌어요" : "확정 완료 상태에서만 눌러볼 수 있어요"}</Hint>
          </div>
          <div className="flex flex-col gap-1">
            <button className={`border ${T.border} ${T.roundedElement} px-3 py-1.5 ${T.pressed}`} onClick={() => resetDemoData("/")}>데이터 초기화</button>
            <Hint>저장된 데이터를 지우고 처음 상태로 되돌려요</Hint>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[["/", "L01 랜딩"], ["/host/create", "H01 발의"], ["/attendee", "A01 참석자"], ["/host/dashboard", "D01 대시보드"], ["/host/re-match", "R01 재조율"]].map(([p, label]) => (
            <button key={p} className={`border ${T.border} ${T.roundedElement} px-2 py-1 ${T.pressed}`} onClick={() => navigate(p)}>{label}</button>
          ))}
        </div>
      </div>
    );
  };

  // =====================================================================
  return (
    <div className={`${T.background} min-h-screen`}>
      {BrandBar()}
      {isProductScreen && StepIndicator()}
      {isHostScreen && AlertBannerView()}
      {currentPath === "/" && LandingScreen()}
      {currentPath === "/guide" && GuideScreen()}
      {currentPath === "/host/create" && HostCreateScreen()}
      {currentPath === "/attendee" && AttendeeScreen()}
      {currentPath === "/host/dashboard" && HostDashboardScreen()}
      {currentPath === "/host/re-match" && ReMatchScreen()}
      {panelVisible && ScenarioPanel()}
      {ToastView()}
    </div>
  );
}

export {
  calculateBestTime,
  deriveRematchGate,
  checkDeadlineStatus,
  buildMemberResponse,
  trackRematchUpdate,
  trackExtensionUpdate,
  activeSlots,
  activeDates,
  FULL_DATES,
};
