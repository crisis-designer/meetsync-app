import { createClient } from "@supabase/supabase-js";

// anon(publishable) 키는 클라이언트에 노출돼도 안전하게 설계된 키입니다 — RLS를 켜지 않았으므로
// 이 프로젝트에서는 링크만 있으면 누구나 읽고 쓸 수 있습니다 (로그인 없는 조율 도구 특성상 의도된 설계).
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
