import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const port = Number(process.env.MAHABAH_SMOKE_PORT || 3100);
const baseUrl = process.env.MAHABAH_SMOKE_BASE_URL || `http://127.0.0.1:${port}`;
const shouldStartServer = !process.env.MAHABAH_SMOKE_BASE_URL;
const email = process.env.MAHABAH_SMOKE_EMAIL;
const password = process.env.MAHABAH_SMOKE_PASSWORD;
const screenshotDir = path.resolve(process.env.MAHABAH_SMOKE_SCREENSHOT_DIR || "tmp/smoke-routes");
const hasProductionBuild = existsSync(path.resolve(".next/BUILD_ID"));
const serverMode = process.env.MAHABAH_SMOKE_SERVER_MODE === "dev" || !hasProductionBuild ? "dev" : "start";

const publicRoutes = ["/", "/assets", "/contributions", "/services", "/contact", "/auth/login"];
const protectedRoutes = [
  "/dashboard/individual",
  "/dashboard/individual/browse-assets",
  "/dashboard/business",
  "/dashboard/business/company-contributions",
  "/dashboard/admin",
  "/dashboard/admin/review-center",
];
const authenticatedRoutesByRole = {
  individual: [
    "/dashboard/individual",
    "/dashboard/individual/browse-assets",
    "/dashboard/individual/my-requests",
    "/dashboard/individual/messages",
    "/dashboard/individual/personal-profile",
  ],
  business: [
    "/dashboard/business",
    "/dashboard/business/browse-assets",
    "/dashboard/business/company-contributions",
    "/dashboard/business/my-requests",
    "/dashboard/business/company-profile",
  ],
  admin: [
    "/dashboard/admin",
    "/dashboard/admin/assets",
    "/dashboard/admin/contributions",
    "/dashboard/admin/service-requests",
    "/dashboard/admin/review-center",
  ],
};

function fail(message) {
  throw new Error(message);
}

function screenshotName(route, expected) {
  const slug = route.replace(/^\/+/, "").replace(/[^a-zA-Z0-9\u0600-\u06FF]+/g, "-").replace(/^-|-$/g, "") || "home";
  return `${expected}-${slug}.png`;
}

async function waitForServer(url, timeoutMs = 45_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await globalThis.fetch(url, { redirect: "manual" });
      if (response.status < 500) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => globalThis.setTimeout(resolve, 750));
  }
  fail(`Server did not become ready at ${url}`);
}

async function visit(page, route, expected) {
  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45_000 });
  if (!response) fail(`No response for ${route}`);
  const status = response.status();
  if (status >= 500) fail(`${route} returned HTTP ${status}`);
  if (expected === "public" && status >= 400) fail(`${route} returned HTTP ${status}`);
  if (expected === "redirect-login" && !page.url().includes("/auth/login")) {
    fail(`${route} should redirect to /auth/login when unauthenticated, got ${page.url()}`);
  }
  if (expected === "dashboard" && page.url().includes("/auth/login")) {
    fail(`${route} redirected to login after authenticated smoke login`);
  }
  const title = await page.title();
  if (!title.trim()) fail(`${route} rendered without a document title`);
  const screenshotPath = path.join(screenshotDir, screenshotName(route, expected));
  await page.screenshot({ path: screenshotPath, fullPage: true });
  return screenshotPath;
}

async function loginForSmoke(context) {
  if (!email || !password) return null;
  const response = await context.request.post(`${baseUrl}/api/auth/login`, {
    data: { email, password },
  });
  if (!response.ok()) {
    const body = await response.text();
    fail(`Smoke login failed with HTTP ${response.status()}: ${body}`);
  }
  const body = await response.json();
  return body.role || "individual";
}

let server;
if (shouldStartServer) {
  const args = serverMode === "dev"
    ? ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(port)]
    : ["run", "start", "--", "--hostname", "127.0.0.1", "--port", String(port)];
  server = spawn("npm", args, {
    cwd: process.cwd(),
    env: { ...process.env, PORT: String(port) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.on("exit", (code) => {
    if (code !== null && code !== 0) {
      console.error(`Smoke dev server exited with ${code}`);
    }
  });
}

try {
  await waitForServer(`${baseUrl}/`);
  await rm(screenshotDir, { recursive: true, force: true });
  await mkdir(screenshotDir, { recursive: true });
  const browser = await chromium.launch();
  const context = await browser.newContext({ locale: "ar-SA" });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));

  const screenshots = [];

  for (const route of publicRoutes) {
    screenshots.push(await visit(page, route, "public"));
  }

  for (const route of protectedRoutes) {
    screenshots.push(await visit(page, route, "redirect-login"));
  }

  const role = await loginForSmoke(context);
  if (role) {
    const dashboardRoutes = authenticatedRoutesByRole[role] ?? authenticatedRoutesByRole.individual;
    for (const route of dashboardRoutes) {
      screenshots.push(await visit(page, route, "dashboard"));
    }
  }

  await browser.close();

  if (consoleErrors.length) {
    fail(`Browser console errors detected:\n${consoleErrors.slice(0, 10).join("\n")}`);
  }

  console.log(`Route smoke passed at ${baseUrl}${role ? ` with ${role} login` : " without demo credentials"}.`);
  console.log(`Screenshots written to ${screenshotDir}`);
  screenshots.forEach((file) => console.log(`- ${path.relative(process.cwd(), file)}`));
} finally {
  if (server) {
    server.kill("SIGTERM");
    await Promise.race([
      once(server, "exit"),
      new Promise((resolve) => globalThis.setTimeout(resolve, 2_000)),
    ]);
  }
}
