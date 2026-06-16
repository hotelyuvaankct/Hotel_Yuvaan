import { execSync } from "node:child_process";

const branch = process.env.VERCEL_GIT_COMMIT_REF ?? "";
const vercelEnv = process.env.VERCEL_ENV ?? "local";

// Branch wins over VERCEL_ENV — Vercel sets VERCEL_ENV=production when a custom
// domain (e.g. dev.hotelyuvaan.com) is assigned to the develop branch.
function resolveBuildMode() {
  if (branch === "main") return "prod";
  if (branch === "develop") return "dev";
  if (process.env.BUILD_ENV === "prod") return "prod";
  if (process.env.BUILD_ENV === "dev") return "dev";
  if (vercelEnv === "production") return "prod";
  return "dev";
}

const mode = resolveBuildMode();

console.log(
  `[build] branch=${branch || "local"} VERCEL_ENV=${vercelEnv} → mode=${mode}`
);

execSync(`vite build --mode ${mode}`, { stdio: "inherit" });

