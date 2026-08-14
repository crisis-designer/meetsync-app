// src/analyticsEvents.js를 유일한 소스로 삼아 docs/ANALYTICS_EVENTS.md를 생성한다.
// "npm run build"(= vercel의 배포 빌드) 직전에 자동 실행된다 — package.json의 "prebuild" 참고.
// 이 md 파일을 직접 고치지 마세요 — 다음 빌드 때 덮어써집니다. 이벤트를 바꾸려면 src/analyticsEvents.js를 고치세요.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { ANALYTICS_EVENTS } from "../src/analyticsEvents.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, "../docs/ANALYTICS_EVENTS.md");

const rows = ANALYTICS_EVENTS.map(
  (e) => `| \`${e.name}\` | ${e.when} | ${e.properties.map((p) => `\`${p}\``).join(", ")} | ${e.why} |`
).join("\n");

const md = `# MeetSync 추적 이벤트

이 문서는 자동 생성됩니다 — 직접 수정하지 마세요. 이벤트를 바꾸려면 \`src/analyticsEvents.js\`를 고친 뒤
\`npm run build\`(또는 \`npm run docs:analytics\`)를 실행하면 이 파일이 자동으로 갱신됩니다.

생성 시각: ${new Date().toISOString()}

| 이벤트 | 발생 시점 | 속성 | 왜 추적하는가 |
|---|---|---|---|
${rows}
`;

writeFileSync(outPath, md);
console.log(`docs/ANALYTICS_EVENTS.md 갱신 완료 (${ANALYTICS_EVENTS.length}개 이벤트)`);
