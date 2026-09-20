import { expect, test } from "@playwright/test";

test("shows the hello heading and a Google sign-in button when signed out", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello, world" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in with Google" })).toBeVisible();
});

test("sign-in kicks off the Google OAuth flow", async ({ page }) => {
  await page.goto("/");
  const [request] = await Promise.all([
    page.waitForRequest((r) => r.url().startsWith("https://accounts.google.com/")),
    page.getByRole("button", { name: "Sign in with Google" }).click(),
  ]);
  const url = new URL(request.url());
  expect(url.searchParams.get("redirect_uri")).toContain("/api/auth/callback/google");
  expect(url.searchParams.get("client_id")).toBeTruthy();
  expect(url.searchParams.get("client_id")).not.toBe("undefined");
});

test("greets in a random language when the button is clicked", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("message")).toHaveText("A tiny app living on the web.");
  await page.getByRole("button", { name: "Say hello" }).click();
  await expect(page.getByTestId("message")).toContainText("from Devin!");
});

test("health endpoint reports ok", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  expect((await response.json()).status).toBe("ok");
});
