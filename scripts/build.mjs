import { execSync } from "node:child_process";

const isProd =
  process.env.BUILD_ENV === "prod" ||
  process.env.VERCEL_ENV === "production";

const mode = isProd ? "prod" : "dev";

console.log(
  `[build] VERCEL_ENV=${process.env.VERCEL_ENV ?? "local"} → mode=${mode}`
);

execSync(`vite build --mode ${mode}`, { stdio: "inherit" });
