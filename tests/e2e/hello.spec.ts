import { expect, test } from "@playwright/test";

test("shows the hello heading", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Hello, world" })).toBeVisible();
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
