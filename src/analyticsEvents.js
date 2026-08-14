// 이 파일이 이벤트 추적의 유일한 소스입니다 — track()을 호출하는 모든 곳은 여기 정의된 이름만 씁니다.
// docs/ANALYTICS_EVENTS.md는 이 배열에서 자동 생성됩니다(scripts/generate-analytics-doc.mjs, "npm run build" 시 자동 실행).
// 새 이벤트를 추가/수정할 땐 이 배열만 고치세요 — 문서는 손대지 마세요, 다음 빌드 때 자동으로 덮어써집니다.
export const ANALYTICS_EVENTS = [
  {
    name: "meeting_created",
    when: "호스트가 회의를 발의(초대 링크 생성)했을 때",
    properties: ["member_count", "candidate_days"],
    why: "퍼널의 시작점 — 얼마나 많은 회의가 시도되는지",
  },
  {
    name: "invite_link_opened",
    when: "참석자가 초대 링크를 열었을 때",
    properties: ["is_returning"],
    why: "초대가 실제로 도달·클릭됐는지 — 발의와 응답 사이 이탈 확인",
  },
  {
    name: "availability_submitted",
    when: "참석자가 가능 시간을 제출했을 때",
    properties: ["response_delay_hours", "is_resubmit"],
    why: "응답까지 걸리는 시간 — '재촉의 비용'이 실제로 줄었는지의 근거",
  },
  {
    name: "meeting_confirmed",
    when: "호스트가 최종 시간을 확정했을 때",
    properties: ["level", "days_to_confirm"],
    why: "가장 중요한 이벤트. level(0~3)의 분포가 '관계 비용 이관' 가설이 실제로 작동하는지의 핵심 증거",
  },
  {
    name: "mitigation_triggered",
    when: "독촉·강제마감·강등·재요청·기간확장 중 하나가 실행됐을 때",
    properties: ["type"],
    why: "완화 장치가 얼마나 자주 필요했는지 — 낮을수록 설계가 잘 맞았다는 신호",
  },
  {
    name: "attendance_cancelled",
    when: "확정 후 필수 참석자가 참석을 취소했을 때",
    properties: ["dropout_reason"],
    why: "확정 후 이탈이라는 가장 어려운 엣지케이스의 실제 발생 빈도",
  },
  {
    name: "rematch_completed",
    when: "이탈 후 재조율로 새 시간이 다시 확정됐을 때",
    properties: ["days_to_rematch"],
    why: "이탈이 생겨도 회의가 실제로 살아나는지",
  },
  {
    name: "meeting_cancelled",
    when: "회의 자체가 폐기됐을 때",
    properties: ["reason"],
    why: "완전 실패 사례 — 이 비율이 높으면 도구가 안 맞는다는 뜻",
  },
];
