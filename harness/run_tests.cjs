const {
  calculateBestTime,
  deriveRematchGate,
  checkDeadlineStatus,
  buildMemberResponse,
  trackRematchUpdate,
  trackExtensionUpdate,
  activeSlots,
  activeDates,
  FULL_DATES,
  FULL_ALL_SLOTS,
} = require("./app_test.cjs");

let pass = 0, fail = 0;
function assert(name, cond, detail) {
  if (cond) { pass++; console.log(`PASS  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? " — " + detail : ""}`); }
}
function eq(a, b) { return JSON.stringify(a) === JSON.stringify(b); }

// ---------- 발견 88: FULL_DATES 7일 확장 ----------
assert("FULL_DATES 길이가 7", FULL_DATES.length === 7, `실제 ${FULL_DATES.length}`);
assert("FULL_DATES 마지막 날짜가 2026-07-22", FULL_DATES[FULL_DATES.length - 1] === "2026-07-22");

// ---------- 발견 88: buildMemberResponse가 candidatePeriod 전체를 채우는지 ----------
{
  const period5 = { start: "2026-07-16", end: "2026-07-20" }; // 5일
  const resp = buildMemberResponse("m1", period5);
  const expectedSlots = activeSlots(period5);
  const filledCount = expectedSlots.filter((sk) => resp[sk] !== undefined).length;
  assert("buildMemberResponse가 5일 전체(45슬롯)를 채움", filledCount === expectedSlots.length,
    `채워진 슬롯 ${filledCount}/${expectedSlots.length}`);

  const period3 = { start: "2026-07-16", end: "2026-07-18" }; // 3일(기본값)
  const resp3 = buildMemberResponse("m1", period3);
  const expected3 = activeSlots(period3);
  const filled3 = expected3.filter((sk) => resp3[sk] !== undefined).length;
  assert("buildMemberResponse가 기존 3일 케이스도 정상 동작(회귀)", filled3 === expected3.length,
    `채워진 슬롯 ${filled3}/${expected3.length}`);

  // 후보 기간 밖 슬롯은 채우면 안 됨(과다 채움 방지)
  const outOfRangeSlot = "2026-07-21T09:00";
  assert("candidatePeriod 밖 슬롯은 채우지 않음(3일 케이스)", resp3[outOfRangeSlot] === undefined);
}

// ---------- 발견 89/90: calculateBestTime level 판정 (QUICK 분기 판단 근거) ----------
{
  const members = [
    { id: "m1", name: "A", attendance: "REQUIRED", status: "SUBMITTED" },
    { id: "m2", name: "B", attendance: "REQUIRED", status: "SUBMITTED" },
    { id: "m3", name: "C", attendance: "REQUIRED", status: "SUBMITTED" },
  ];
  const slots = ["2026-07-16T09:00", "2026-07-16T10:00"];
  // 전원 AVAILABLE인 슬롯 하나 존재 → level 0 또는 1 (partial 아님, level!==3 이어야 QUICK 대상)
  const avAllGood = {
    m1: { "2026-07-16T09:00": "AVAILABLE" },
    m2: { "2026-07-16T09:00": "AVAILABLE" },
    m3: { "2026-07-16T09:00": "AVAILABLE" },
  };
  const r1 = calculateBestTime(avAllGood, members, { slots });
  assert("전원 가능 슬롯 존재 시 level !== 3 (QUICK 대상)", r1.length > 0 && r1[0].level !== 3, `level=${r1[0] && r1[0].level}`);

  // 아무 슬롯도 전원 커버 안 됨 → level 3 (partial), QUICK 대상 아님
  const avPartial = {
    m1: { "2026-07-16T09:00": "AVAILABLE" },
    m2: { "2026-07-16T09:00": "UNAVAILABLE" },
    m3: { "2026-07-16T09:00": "UNAVAILABLE" },
  };
  const r2 = calculateBestTime(avPartial, members, { slots });
  assert("전원 커버되는 슬롯 없으면 level === 3 (GRID 강제)", r2.length > 0 && r2[0].level === 3, `level=${r2[0] && r2[0].level}`);
}

// ---------- 발견 84/87: deriveRematchGate — 경로 무관 통일 판정 ----------
{
  const meetingBlocked = {
    members: [
      { id: "m1", name: "김주최", attendance: "REQUIRED" },
      { id: "m2", name: "이디자", attendance: "REQUIRED" },
      { id: "m3", name: "정마케", attendance: "OPTIONAL" },
    ],
    reMatchUpdatedIds: ["m1"], // m2 아직 안 함
  };
  const g1 = deriveRematchGate(meetingBlocked);
  assert("필수 참석자 1명 미갱신이면 게이팅 blocked=true", g1.blocked === true);
  assert("게이팅 pendingNames는 미갱신 필수 참석자 이름만(선택 참석자 제외)", eq(g1.pendingNames, ["이디자"]));

  const meetingAllUpdated = { ...meetingBlocked, reMatchUpdatedIds: ["m1", "m2"] };
  const g2 = deriveRematchGate(meetingAllUpdated);
  assert("필수 참석자 전원 갱신하면 게이팅 blocked=false", g2.blocked === false);

  // 발견 87 회귀: WEBHOOK dropReason이어도 예외 처리 없이 동일하게 판정되는지(필드 자체를 안 봄)
  const meetingWebhook = { ...meetingBlocked, dropReason: "WEBHOOK", droppedMemberId: "m1" };
  const g3 = deriveRematchGate(meetingWebhook);
  assert("WEBHOOK 경로도 dropReason 무관하게 동일 판정(발견 87 회귀)", eq(g3, g1));
}

// ---------- trackRematchUpdate — QUICK 확인 버튼이 재사용하는 함수 ----------
{
  const r1 = trackRematchUpdate([], "CONFLICT", "m1");
  assert("CONFLICT 중 갱신 시 id 추가됨", eq(r1, ["m1"]));
  const r2 = trackRematchUpdate(["m1"], "CONFLICT", "m1");
  assert("중복 추가 방지(Set)", eq(r2, ["m1"]));
  const r3 = trackRematchUpdate([], "PROGRESS", "m1");
  assert("CONFLICT 아닐 때는 변경 없음", eq(r3, []));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail > 0 ? 1 : 0);
