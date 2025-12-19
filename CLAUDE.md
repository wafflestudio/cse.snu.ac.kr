../csereal-web에 있는 next.js 프로젝트를 현재 경로에 있는 react-router-v7 프로젝트로 마이그레이션 중.

마이그레이션하면서 한 의사결정은 모두 이 파일에 기록.
- store 마이그레이션 완료. 현재 store 구조를 존중

기본적으로 아래 순서로 마이그레이션. 
- 요청된 기능에 연관된 기존 코드 탐색
- 기존 코드를 현재 프로젝트의 적합한 위치에 복사
- 현재 프로젝트의 컨벤션과 react-router에 맞게 기존 코드를 수정 

Use react 19.
Use react router v7.
Prefer shadcn component. Install if required. pnpm dlx shadcn@latest add [component]

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.
