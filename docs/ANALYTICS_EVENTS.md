# MeetSync 추적 이벤트

이 문서는 자동 생성됩니다 — 직접 수정하지 마세요. 이벤트를 바꾸려면 `src/analyticsEvents.js`를 고친 뒤
`npm run build`(또는 `npm run docs:analytics`)를 실행하면 이 파일이 자동으로 갱신됩니다.

생성 시각: 2026-08-14T22:37:30.632Z

| 이벤트 | 발생 시점 | 속성 | 왜 추적하는가 |
|---|---|---|---|
| `meeting_created` | 호스트가 회의를 발의(초대 링크 생성)했을 때 | `member_count`, `candidate_days` | 퍼널의 시작점 — 얼마나 많은 회의가 시도되는지 |
| `invite_link_opened` | 참석자가 초대 링크를 열었을 때 | `is_returning` | 초대가 실제로 도달·클릭됐는지 — 발의와 응답 사이 이탈 확인 |
| `availability_submitted` | 참석자가 가능 시간을 제출했을 때 | `response_delay_hours`, `is_resubmit` | 응답까지 걸리는 시간 — '재촉의 비용'이 실제로 줄었는지의 근거 |
| `meeting_confirmed` | 호스트가 최종 시간을 확정했을 때 | `level`, `days_to_confirm` | 가장 중요한 이벤트. level(0~3)의 분포가 '관계 비용 이관' 가설이 실제로 작동하는지의 핵심 증거 |
| `mitigation_triggered` | 독촉·강제마감·강등·재요청·기간확장 중 하나가 실행됐을 때 | `type` | 완화 장치가 얼마나 자주 필요했는지 — 낮을수록 설계가 잘 맞았다는 신호 |
| `attendance_cancelled` | 확정 후 필수 참석자가 참석을 취소했을 때 | `dropout_reason` | 확정 후 이탈이라는 가장 어려운 엣지케이스의 실제 발생 빈도 |
| `rematch_completed` | 이탈 후 재조율로 새 시간이 다시 확정됐을 때 | `days_to_rematch` | 이탈이 생겨도 회의가 실제로 살아나는지 |
| `meeting_cancelled` | 회의 자체가 폐기됐을 때 | `reason` | 완전 실패 사례 — 이 비율이 높으면 도구가 안 맞는다는 뜻 |
