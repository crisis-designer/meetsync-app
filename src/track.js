import { supabase } from "./supabaseClient";
import { ANALYTICS_EVENTS } from "./analyticsEvents";

const KNOWN_NAMES = new Set(ANALYTICS_EVENTS.map((e) => e.name));

// fire-and-forget — 추적 실패가 실제 기능(회의 조율)을 막아선 안 된다.
export function track(name, meetingId, properties = {}) {
  if (!KNOWN_NAMES.has(name)) {
    console.warn(`track(): "${name}"은 src/analyticsEvents.js에 등록되지 않은 이벤트예요.`);
  }
  supabase.from("events").insert({ meeting_id: meetingId ?? null, name, properties }).then(({ error }) => {
    if (error) console.error("이벤트 기록 실패:", error.message);
  });
}
