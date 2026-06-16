import { execSync } from "node:child_process";

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "";
const vercelEnv = process.env.VERCEL_ENV ?? "local";

const isProd =
  process.env.BUILD_ENV === "prod" ||
  vercelEnv === "production" ||
  branch === "main";

const mode = isProd ? "prod" : "dev";

console.log(
  `[build] branch=${branch || "local"} VERCEL_ENV=${vercelEnv} → mode=${mode}`
);

execSync(`vite build --mode ${mode}`, { stdio: "inherit" });

